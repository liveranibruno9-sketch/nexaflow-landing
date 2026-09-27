import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  DataTexture,
  Group,
  LinearFilter,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  RepeatWrapping,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  TubeGeometry,
  UnsignedByteType,
  Vector3,
  WebGLRenderer,
} from 'three'
import { COSTELLAZIONI } from '../cielo/stelle'
import { MODULI } from '../dati'
import { TAPPE, passiAccesi, type Tappa } from './rotta'

/**
 * La scena 3D del volo.
 *
 * La camera guarda sempre avanti (verso -z) e avanza lungo z in funzione di
 * `u`, i vh percorsi nella rotta. Tutto il resto e fermo nel mondo: le
 * costellazioni stanno su piani perpendicolari alla rotta, ognuna a 100 unita
 * dalla successiva, avvolte da nebulose.
 *
 * Costo per fotogramma: pochi draw call (un solo Points per le stelle di
 * fondo), attributi aggiornati solo per le costellazioni vicine, nessuna
 * allocazione. Le nebulose leggono una texture di rumore calcolata una volta.
 *
 * Colori: passati agli shader come valori sRGB diretti, senza la gestione del
 * colore di three.js, per avere in pagina esattamente la palette del sito.
 */

/* ---------------------------------------------------------------------------
   Costanti del mondo
   --------------------------------------------------------------------------- */

const FOV = 50
const TAN = Math.tan(((FOV / 2) * Math.PI) / 180)
const LATO = 5.4 // lato lungo di una costellazione, in unita del mondo
const DISTANZA_MODULI = 100
const Z_PRIMO_MODULO = -230
const AVVICINAMENTO = 40
const zPerdita = (i: number) => -40 - i * 30
const zModulo = (i: number) => Z_PRIMO_MODULO - i * DISTANZA_MODULI
const Z_ROTTA = [zModulo(5) - 80, zModulo(5) - 115, zModulo(5) - 150]
const Z_FINE = Z_ROTTA[2] - 30

const COLORI = {
  arancio: [1, 0.42, 0.172],
  arancioScuro: [0.55, 0.16, 0.05],
  giallo: [1, 0.886, 0.29],
  celeste: [0.62, 0.847, 1],
  bianco: [0.949, 0.961, 1],
  blu: [0.169, 0.388, 0.961],
  bluLuce: [0.431, 0.608, 1],
  caldo: [1, 0.86, 0.72],
}
const v3 = (c: number[]) => new Vector3(c[0], c[1], c[2])

/* ---------------------------------------------------------------------------
   Shader
   --------------------------------------------------------------------------- */

const VERT_UV = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

/** stelle delle costellazioni, delle perdite e della rotta */
const STELLE_VERT = /* glsl */ `
  attribute float aR;
  attribute float aLuce;
  attribute float aFinale;
  attribute float aLampo;
  uniform float uPx;
  uniform float uAlfa;
  varying float vLuce;
  varying float vFinale;
  varying float vLampo;
  varying float vAlfa;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float d = max(-mv.z, 0.001);
    gl_PointSize = clamp(aR * (1.0 + 0.9 * aLampo) * mix(0.8, 1.0, aLuce) * uPx / d, 2.0, 220.0);
    gl_Position = projectionMatrix * mv;
    vLuce = aLuce;
    vFinale = aFinale;
    vLampo = aLampo;
    vAlfa = uAlfa * smoothstep(0.5, 2.5, d);
  }
`
const STELLE_FRAG = /* glsl */ `
  uniform vec3 uSpento;
  uniform vec3 uAcceso;
  uniform vec3 uNucleo;
  uniform vec3 uFinale;
  varying float vLuce;
  varying float vFinale;
  varying float vLampo;
  varying float vAlfa;
  void main() {
    float r = length(gl_PointCoord - 0.5) * 2.0;
    if (r > 1.0) discard;
    float nucleo = smoothstep(0.13, 0.0, r);
    float alone = exp(-r * r * 5.0) * (1.0 - r);
    vec3 acceso = mix(uAcceso, uNucleo, nucleo);
    vec3 colore = mix(uSpento, acceso, vLuce);
    colore = mix(colore, mix(uFinale, uNucleo, nucleo * 0.5), vFinale);
    float luce = max(vLuce, vFinale);
    float a = nucleo * mix(0.85, 1.0, luce) + alone * mix(0.3, 0.7, luce) + vLampo * alone * 0.9;
    gl_FragColor = vec4(colore, a * vAlfa);
  }
`

/** le stelle di fondo: migliaia, un solo draw call */
const CAMPO_VERT = /* glsl */ `
  attribute float aR;
  attribute float aFase;
  attribute vec3 aColore;
  uniform float uPx;
  uniform float uTempo;
  varying vec3 vColore;
  varying float vAlfa;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float d = max(-mv.z, 0.001);
    gl_PointSize = clamp(aR * uPx / d, 1.3, 16.0);
    gl_Position = projectionMatrix * mv;
    float battito = 0.72 + 0.28 * sin(uTempo * (0.6 + fract(aFase * 7.3) * 1.6) + aFase * 6.2831);
    vAlfa = battito * smoothstep(330.0, 90.0, d) * smoothstep(0.6, 4.0, d);
    vColore = aColore;
  }
`
const CAMPO_FRAG = /* glsl */ `
  varying vec3 vColore;
  varying float vAlfa;
  void main() {
    float r = length(gl_PointCoord - 0.5) * 2.0;
    if (r > 1.0) discard;
    float a = smoothstep(1.0, 0.0, r);
    gl_FragColor = vec4(vColore, a * a * vAlfa);
  }
`

/** nebulosa: rumore precalcolato, due strati che derivano piano */
const NEBULA_FRAG = /* glsl */ `
  uniform sampler2D uRumore;
  uniform vec3 uColA;
  uniform vec3 uColB;
  uniform float uTempo;
  uniform float uAlfa;
  uniform vec2 uSeme;
  varying vec2 vUv;
  void main() {
    vec2 p = vUv - 0.5;
    float r = length(p) * 2.0;
    float maschera = smoothstep(1.0, 0.12, r);
    vec2 deriva = vec2(uTempo * 0.005, -uTempo * 0.0035);
    float n1 = texture2D(uRumore, vUv * 1.2 + uSeme + deriva).r;
    float n2 = texture2D(uRumore, vUv * 2.7 - uSeme * 1.7 - deriva * 1.6).r;
    float n = n1 * 0.62 + n2 * 0.38;
    float densita = smoothstep(0.34, 0.95, n) * maschera;
    vec3 colore = mix(uColA, uColB, smoothstep(0.3, 0.8, n2));
    gl_FragColor = vec4(colore, densita * uAlfa);
  }
`

/** linea fra due stelle: si disegna dalla stella accesa verso la prossima */
const LINEA_FRAG = /* glsl */ `
  uniform float uProg;
  uniform vec3 uColore;
  uniform float uAlfa;
  uniform float uTratteggio;
  varying vec2 vUv;
  void main() {
    if (vUv.x > uProg) discard;
    float y = abs(vUv.y - 0.5) * 2.0;
    float corpo = exp(-y * y * 7.0);
    float testa = (1.0 - step(0.999, uProg)) * smoothstep(0.12, 0.0, uProg - vUv.x);
    float tratto = mix(1.0, step(0.45, fract(vUv.x * 14.0)), uTratteggio);
    float a = (corpo * 0.55 + testa * corpo * 1.3) * tratto;
    gl_FragColor = vec4(uColore + testa * 0.35, a * uAlfa);
  }
`

/** la scia della rotta: svanisce vicino alla camera */
const SCIA_VERT = /* glsl */ `
  varying vec2 vUv;
  varying float vProfondita;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vProfondita = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`
const SCIA_FRAG = /* glsl */ `
  uniform float uProg;
  uniform float uAlfa;
  uniform float uTempo;
  uniform vec3 uColore;
  varying vec2 vUv;
  varying float vProfondita;
  void main() {
    if (vUv.x > uProg) discard;
    float vicino = smoothstep(2.5, 11.0, vProfondita);
    float pulsa = 0.75 + 0.25 * sin(vUv.x * 70.0 - uTempo * 3.0);
    float testa = smoothstep(0.035, 0.0, uProg - vUv.x) * (1.0 - step(0.999, uProg));
    gl_FragColor = vec4(uColore + testa * 0.5, (0.5 * pulsa + testa) * uAlfa * vicino);
  }
`

/* ---------------------------------------------------------------------------
   Utilita
   --------------------------------------------------------------------------- */

function mulberry32(seme: number) {
  return () => {
    seme |= 0
    seme = (seme + 0x6d2b79f5) | 0
    let t = Math.imul(seme ^ (seme >>> 15), 1 | seme)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x))
const liscia = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}

/** rumore frattale ripetibile senza giunture, calcolato una volta sola */
function texturaRumore(n = 128) {
  const caso = mulberry32(11)
  const ottave = [4, 8, 16, 32, 64].map((g) => {
    const v = new Float32Array(g * g)
    for (let i = 0; i < v.length; i++) v[i] = caso()
    return { g, v }
  })
  const grezzi = new Float32Array(n * n)
  let min = Infinity
  let max = -Infinity
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      let somma = 0
      let ampiezza = 1
      let totale = 0
      for (const { g, v } of ottave) {
        const fx = (x / n) * g
        const fy = (y / n) * g
        const x0 = Math.floor(fx)
        const y0 = Math.floor(fy)
        const tx = fx - x0
        const ty = fy - y0
        const sx = tx * tx * (3 - 2 * tx)
        const sy = ty * ty * (3 - 2 * ty)
        const x1 = (x0 + 1) % g
        const y1 = (y0 + 1) % g
        const a = v[y0 * g + x0]
        const b = v[y0 * g + x1]
        const c = v[y1 * g + x0]
        const d = v[y1 * g + x1]
        somma += ampiezza * ((a * (1 - sx) + b * sx) * (1 - sy) + (c * (1 - sx) + d * sx) * sy)
        totale += ampiezza
        ampiezza *= 0.55
      }
      const valore = somma / totale
      grezzi[y * n + x] = valore
      if (valore < min) min = valore
      if (valore > max) max = valore
    }
  }
  const dati = new Uint8Array(n * n * 4)
  for (let i = 0; i < n * n; i++) {
    const b = Math.round(((grezzi[i] - min) / (max - min)) * 255)
    dati[i * 4] = b
    dati[i * 4 + 1] = b
    dati[i * 4 + 2] = b
    dati[i * 4 + 3] = 255
  }
  const texture = new DataTexture(dati, n, n, RGBAFormat, UnsignedByteType)
  texture.wrapS = RepeatWrapping
  texture.wrapT = RepeatWrapping
  texture.magFilter = LinearFilter
  texture.minFilter = LinearFilter
  texture.needsUpdate = true
  return texture
}

/* ---------------------------------------------------------------------------
   Impaginazione: dipende dalla forma dello schermo
   --------------------------------------------------------------------------- */

type Impaginazione = {
  /** distanza della camera dalla costellazione quando e tutta accesa */
  sosta: number
  xFigura: number
  yFigura: number
  xPerdita: number
  yPerdita: number
  ritratto: boolean
}

function impagina(aspetto: number): Impaginazione {
  if (aspetto >= 1) {
    // schermo largo: testo a sinistra, costellazione nella meta destra
    const sosta = Math.max(LATO / (0.8 * TAN * aspetto), LATO / (0.75 * 2 * TAN))
    const mezzaLarghezza = sosta * TAN * aspetto
    return { sosta, xFigura: mezzaLarghezza * 0.44, yFigura: 0, xPerdita: 3.2, yPerdita: 0.3, ritratto: false }
  }
  // telefono: costellazione in alto, testo in basso
  // la figura occupa al massimo il 32% dell altezza, centrata al 30% dall alto
  const sosta = Math.max(LATO / (0.86 * 2 * TAN * aspetto), LATO / (0.64 * TAN))
  const mezzaAltezza = sosta * TAN
  return { sosta, xFigura: 0, yFigura: mezzaAltezza * 0.4, xPerdita: 0.9, yPerdita: 2.2, ritratto: true }
}

type Punto = { u: number; z: number }

/** i punti chiave della camera lungo la rotta; fra un punto e l'altro si interpola morbido */
function percorso(imp: Impaginazione): Punto[] {
  const punti: Punto[] = []
  for (const t of TAPPE) {
    const f = (frazione: number) => t.inizio + frazione * t.durata
    if (t.tipo === 'partenza') punti.push({ u: f(0), z: 10 })
    if (t.tipo === 'perdita') {
      const zf = zPerdita(t.indice)
      punti.push({ u: f(0), z: zf + 16 }, { u: f(0.68), z: zf + 1.2 })
    }
    if (t.tipo === 'modulo') {
      const zc = zModulo(t.indice)
      punti.push(
        { u: f(0), z: zc + imp.sosta + AVVICINAMENTO },
        { u: f(0.34), z: zc + imp.sosta + 10 },
        { u: f(0.7), z: zc + imp.sosta },
        { u: f(0.94), z: zc + imp.sosta - 0.5 },
      )
    }
    if (t.tipo === 'rotta') {
      punti.push(
        { u: f(0), z: Z_ROTTA[0] + 16 },
        { u: f(0.33), z: Z_ROTTA[0] + 2 },
        { u: f(0.66), z: Z_ROTTA[1] + 2 },
        { u: f(0.97), z: Z_ROTTA[2] + 2 },
      )
    }
    if (t.tipo === 'arrivo') punti.push({ u: f(0), z: Z_ROTTA[2] - 4 }, { u: f(1), z: Z_FINE })
  }
  return punti
}

function zAl(punti: Punto[], u: number) {
  if (u <= punti[0].u) return punti[0].z
  for (let i = 1; i < punti.length; i++) {
    const b = punti[i]
    if (u <= b.u) {
      const a = punti[i - 1]
      return a.z + (b.z - a.z) * liscia(a.u, b.u, u)
    }
  }
  return punti[punti.length - 1].z
}

/* ---------------------------------------------------------------------------
   La scena
   --------------------------------------------------------------------------- */

export type Scena = {
  /** da chiamare a ogni fotogramma: restituisce true finche la camera e in movimento */
  aggiorna: (u: number, dt: number, tempo: number) => boolean
  puntatore: (x: number, y: number) => void
  ridimensiona: () => void
  distruggi: () => void
}

type ModuloScena = {
  tappa: Tappa
  gruppo: Group
  z: number
  materialeStelle: ShaderMaterial
  geometriaStelle: BufferGeometry
  aLuce: Float32Array
  aFinale: Float32Array
  aLampo: Float32Array
  passi: (number | null)[]
  totale: number
  linee: { materiale: ShaderMaterial; passo: number }[]
  nebule: { materiale: ShaderMaterial; base: number }[]
}

export function creaScena(contenitore: HTMLElement, opzioni: { mobile: boolean; onPerso: () => void }): Scena {
  const { mobile } = opzioni
  const renderer = new WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'high-performance' })
  renderer.setClearColor(0x05070f, 1)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.6))
  contenitore.appendChild(renderer.domElement)

  const alPerso = (e: Event) => {
    e.preventDefault()
    opzioni.onPerso()
  }
  renderer.domElement.addEventListener('webglcontextlost', alPerso)

  const scena = new Scene()
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 420)
  const rumore = texturaRumore(128)
  const eliminabili: { dispose: () => void }[] = [rumore]
  const uPx = { value: 1 }
  const uTempo = { value: 0 }

  const materiale = (frag: string, vert: string, uniforms: Record<string, { value: unknown }>) => {
    const m = new ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    })
    eliminabili.push(m)
    return m
  }

  const pianoBase = new PlaneGeometry(1, 1)
  eliminabili.push(pianoBase)
  // segmento lungo 1 che parte dall'origine: basta ruotarlo e scalarlo
  const pianoLinea = new PlaneGeometry(1, 1).translate(0.5, 0, 0)
  eliminabili.push(pianoLinea)

  const nebula = (x: number, y: number, z: number, lato: number, colA: number[], colB: number[], alfa: number, seme: number) => {
    const m = materiale(NEBULA_FRAG, VERT_UV, {
      uRumore: { value: rumore },
      uColA: { value: v3(colA) },
      uColB: { value: v3(colB) },
      uTempo,
      uAlfa: { value: alfa },
      uSeme: { value: [seme * 0.37, seme * 0.61] },
    })
    const mesh = new Mesh(pianoBase, m)
    mesh.position.set(x, y, z)
    mesh.scale.set(lato, lato, 1)
    mesh.rotation.z = seme * 1.3
    return { mesh, materiale: m, base: alfa }
  }

  const stelle = (posizioni: number[], raggi: number[], colori: { spento: number[]; acceso: number[]; nucleo: number[]; finale: number[] }) => {
    const n = raggi.length
    const g = new BufferGeometry()
    g.setAttribute('position', new BufferAttribute(new Float32Array(posizioni), 3))
    g.setAttribute('aR', new BufferAttribute(new Float32Array(raggi), 1))
    const aLuce = new Float32Array(n)
    const aFinale = new Float32Array(n)
    const aLampo = new Float32Array(n)
    g.setAttribute('aLuce', new BufferAttribute(aLuce, 1))
    g.setAttribute('aFinale', new BufferAttribute(aFinale, 1))
    g.setAttribute('aLampo', new BufferAttribute(aLampo, 1))
    eliminabili.push(g)
    const m = materiale(STELLE_FRAG, STELLE_VERT, {
      uPx,
      uAlfa: { value: 1 },
      uSpento: { value: v3(colori.spento) },
      uAcceso: { value: v3(colori.acceso) },
      uNucleo: { value: v3(colori.nucleo) },
      uFinale: { value: v3(colori.finale) },
    })
    const punti = new Points(g, m)
    punti.frustumCulled = false
    return { punti, geometria: g, materiale: m, aLuce, aFinale, aLampo }
  }

  /* ----- campo stellare di fondo + polvere vicina alla rotta ----- */
  {
    const caso = mulberry32(20260927)
    const nStelle = mobile ? 3200 : 7000
    const nPolvere = mobile ? 700 : 1500
    const totale = nStelle + nPolvere
    const pos = new Float32Array(totale * 3)
    const raggi = new Float32Array(totale)
    const fasi = new Float32Array(totale)
    const colori = new Float32Array(totale * 3)
    for (let i = 0; i < totale; i++) {
      const polvere = i >= nStelle
      pos[i * 3] = (caso() - 0.5) * (polvere ? 16 : 150)
      pos[i * 3 + 1] = (caso() - 0.5) * (polvere ? 11 : 95)
      pos[i * 3 + 2] = 40 - caso() * (40 - Z_FINE + 140)
      raggi[i] = polvere ? 0.03 + caso() * 0.04 : 0.06 + Math.pow(caso(), 3) * 0.24
      fasi[i] = caso()
      const c = caso()
      const tinta = c < 0.72 ? COLORI.bianco : c < 0.92 ? COLORI.celeste : c < 0.97 ? COLORI.giallo : COLORI.arancio
      const forza = polvere ? 0.45 : 1
      colori[i * 3] = tinta[0] * forza
      colori[i * 3 + 1] = tinta[1] * forza
      colori[i * 3 + 2] = tinta[2] * forza
    }
    const g = new BufferGeometry()
    g.setAttribute('position', new BufferAttribute(pos, 3))
    g.setAttribute('aR', new BufferAttribute(raggi, 1))
    g.setAttribute('aFase', new BufferAttribute(fasi, 1))
    g.setAttribute('aColore', new BufferAttribute(colori, 3))
    eliminabili.push(g)
    const campo = new Points(g, materiale(CAMPO_FRAG, CAMPO_VERT, { uPx, uTempo }))
    campo.frustumCulled = false
    scena.add(campo)
  }

  /* ----- nebulose di atmosfera: partenza e arrivo ----- */
  const nebuleLibere: { materiale: ShaderMaterial; base: number; z: number }[] = []
  const nebulaLibera = (...args: Parameters<typeof nebula>) => {
    const n = nebula(...args)
    scena.add(n.mesh)
    nebuleLibere.push({ materiale: n.materiale, base: n.base, z: args[2] })
  }
  nebulaLibera(-6, 3, -75, 46, COLORI.blu, COLORI.celeste, 0.12, 1)
  nebulaLibera(9, -5, -130, 60, COLORI.bluLuce, COLORI.blu, 0.1, 2)
  nebulaLibera(-4, 2, Z_FINE - 45, 70, COLORI.blu, COLORI.celeste, 0.4, 3)
  nebulaLibera(8, -3, Z_FINE - 62, 95, COLORI.bluLuce, COLORI.blu, 0.3, 4)
  nebulaLibera(-10, 6, Z_FINE - 85, 120, COLORI.celeste, COLORI.bluLuce, 0.2, 5)

  /* ----- le quattro perdite: stelle arancioni che si spengono ----- */
  const perdite = stelle(
    [0, 0, zPerdita(0), 0, 0, zPerdita(1), 0, 0, zPerdita(2), 0, 0, zPerdita(3)],
    [1.25, 1.25, 1.25, 1.25],
    { spento: COLORI.arancioScuro, acceso: COLORI.arancio, nucleo: COLORI.caldo, finale: COLORI.arancio },
  )
  scena.add(perdite.punti)
  const tappePerdita = TAPPE.filter((t) => t.tipo === 'perdita')
  const nebulePerdita = tappePerdita.map((t, i) => {
    const n = nebula(0, 0, zPerdita(i) - 4, 13, COLORI.arancioScuro, COLORI.arancio, 0.13, 10 + i)
    scena.add(n.mesh)
    return n
  })

  /* ----- le sei costellazioni ----- */
  const moduli: ModuloScena[] = TAPPE.filter((t) => t.tipo === 'modulo').map((tappa) => {
    const modulo = MODULI[tappa.indice]
    const cost = COSTELLAZIONI[modulo.cielo.chiave]
    const gruppo = new Group()
    const z = zModulo(tappa.indice)
    gruppo.position.z = z
    const mondo = (x: number, y: number) => [((x - cost.larghezza / 2) / 100) * LATO, (-(y - cost.altezza / 2) / 100) * LATO]

    const posizioni: number[] = []
    const raggi: number[] = []
    for (const s of cost.stelle) {
      const [x, y] = mondo(s.x, s.y)
      posizioni.push(x, y, 0)
      raggi.push((s.r / 100) * LATO * 4.6)
    }
    const st = stelle(posizioni, raggi, {
      spento: COLORI.arancio,
      acceso: COLORI.celeste,
      nucleo: COLORI.bianco,
      finale: COLORI.giallo,
    })
    gruppo.add(st.punti)

    const linee = cost.linee.map((l) => {
      // la linea parte sempre dalla stella che si accende prima
      const prima = (l.da.passo ?? Infinity) <= (l.a.passo ?? Infinity)
      const da = prima ? l.da : l.a
      const a = prima ? l.a : l.da
      const [x1, y1] = mondo(da.x, da.y)
      const [x2, y2] = mondo(a.x, a.y)
      const m = materiale(LINEA_FRAG, VERT_UV, {
        uProg: { value: 0 },
        uColore: { value: v3(COLORI.celeste) },
        uAlfa: { value: 1 },
        uTratteggio: { value: l.tratteggiata ? 1 : 0 },
      })
      const mesh = new Mesh(pianoLinea, m)
      mesh.position.set(x1, y1, 0)
      mesh.rotation.z = Math.atan2(y2 - y1, x2 - x1)
      mesh.scale.set(Math.hypot(x2 - x1, y2 - y1), 0.075, 1)
      gruppo.add(mesh)
      return { materiale: m, passo: l.passo }
    })

    const nebule = [
      nebula(0.4, 0.2, -1.5, LATO * 2.6, COLORI.celeste, COLORI.bluLuce, 0.3, tappa.indice * 3 + 1),
      nebula(-1.2, -0.6, -4.5, LATO * 3.5, COLORI.blu, COLORI.celeste, 0.22, tappa.indice * 3 + 2),
      ...(mobile ? [] : [nebula(1.5, 1.2, -8, LATO * 4.6, COLORI.bluLuce, COLORI.celeste, 0.15, tappa.indice * 3 + 3)]),
    ]
    nebule.forEach((n) => gruppo.add(n.mesh))

    scena.add(gruppo)
    return {
      tappa,
      gruppo,
      z,
      materialeStelle: st.materiale,
      geometriaStelle: st.geometria,
      aLuce: st.aLuce,
      aFinale: st.aFinale,
      aLampo: st.aLampo,
      passi: cost.stelle.map((s) => s.passo),
      totale: cost.totale,
      linee,
      nebule: nebule.map((n) => ({ materiale: n.materiale, base: n.base })),
    }
  })

  /* ----- la rotta: una scia luminosa con tre tappe ----- */
  const tappaRotta = TAPPE.find((t) => t.tipo === 'rotta')!
  const puntiRotta = [
    new Vector3(-1.8, 0.1, Z_ROTTA[0] + 22),
    new Vector3(-1.1, 0.5, Z_ROTTA[0]),
    new Vector3(1.2, -0.35, Z_ROTTA[1]),
    new Vector3(0, 0.9, Z_ROTTA[2]),
    new Vector3(0.1, 1.2, Z_ROTTA[2] - 12),
  ]
  const curva = new CatmullRomCurve3(puntiRotta)
  const geometriaScia = new TubeGeometry(curva, 260, 0.028, 6, false)
  eliminabili.push(geometriaScia)
  const materialeScia = materiale(SCIA_FRAG, SCIA_VERT, {
    uProg: { value: 0 },
    uAlfa: { value: 1 },
    uTempo,
    uColore: { value: v3(COLORI.celeste) },
  })
  const scia = new Mesh(geometriaScia, materialeScia)
  scia.frustumCulled = false
  scena.add(scia)
  const tappeRotta = stelle(
    [puntiRotta[1], puntiRotta[2], puntiRotta[3]].flatMap((p) => [p.x, p.y, p.z]),
    [0.5, 0.5, 0.62],
    { spento: COLORI.arancio, acceso: COLORI.celeste, nucleo: COLORI.bianco, finale: COLORI.giallo },
  )
  scena.add(tappeRotta.punti)

  /* ----- impaginazione e percorso ----- */
  let imp = impagina(1.6)
  let punti = percorso(imp)

  const ridimensiona = () => {
    const w = contenitore.clientWidth || window.innerWidth
    const h = contenitore.clientHeight || window.innerHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    uPx.value = (h * renderer.getPixelRatio()) / (2 * TAN)
    imp = impagina(camera.aspect)
    punti = percorso(imp)
    for (const m of moduli) m.gruppo.position.set(imp.xFigura, imp.yFigura, m.z)
    const posPerdite = perdite.geometria.getAttribute('position') as BufferAttribute
    tappePerdita.forEach((_, i) => {
      const lato = i % 2 === 0 ? 1 : -0.6
      posPerdite.setXYZ(i, imp.xPerdita * lato, imp.yPerdita, zPerdita(i))
      nebulePerdita[i].mesh.position.set(imp.xPerdita * lato, imp.yPerdita, zPerdita(i) - 4)
    })
    posPerdite.needsUpdate = true
  }
  ridimensiona()

  /* ----- stato e aggiornamento ----- */
  let uLiscio = 0
  let zPrima = zAl(punti, 0)
  let velocita = 0
  const mira = { x: 0, y: 0 }
  const scarto = { x: 0, y: 0 }

  const aggiornaModulo = (m: ModuloScena, u: number, distanza: number) => {
    const frazione = clamp((u - m.tappa.inizio) / m.tappa.durata, 0, 1)
    const accesi = passiAccesi(frazione, m.totale)
    const luce = liscia(0.72, 0.78, frazione)
    for (let j = 0; j < m.passi.length; j++) {
      const passo = m.passi[j]
      let accesa = 0
      let lampo = 0
      if (passo === null) {
        accesa = luce
      } else {
        const accensione = passo === 1 ? 0.15 : passo - 1 + 0.85
        accesa = liscia(accensione - 0.04, accensione + 0.04, accesi)
        if (accesi >= accensione) lampo = 1 - liscia(0, 0.45, accesi - accensione)
        accesa = Math.max(accesa, luce)
      }
      m.aLuce[j] = accesa
      m.aLampo[j] = lampo
      m.aFinale[j] = passo === m.totale ? luce : 0
    }
    m.geometriaStelle.getAttribute('aLuce').needsUpdate = true
    m.geometriaStelle.getAttribute('aLampo').needsUpdate = true
    m.geometriaStelle.getAttribute('aFinale').needsUpdate = true

    // svanisce da lontano e mentre la camera attraversa il suo piano
    const alfa = liscia(190, 100, distanza) * liscia(-1, 4, distanza)
    m.materialeStelle.uniforms.uAlfa.value = alfa
    for (const l of m.linee) {
      const prog = Number.isFinite(l.passo) ? clamp((accesi - (l.passo - 1)) / 0.85, 0, 1) : 0
      l.materiale.uniforms.uProg.value = Math.max(prog, liscia(0.72, 0.82, frazione))
      l.materiale.uniforms.uAlfa.value = alfa
    }
    for (const n of m.nebule) n.materiale.uniforms.uAlfa.value = n.base * liscia(230, 110, distanza) * liscia(2, 12, distanza) * (1 + 0.5 * (accesi / m.totale) + 0.6 * luce)
  }

  const aggiorna = (u: number, dt: number, tempo: number) => {
    // inerzia: la camera insegue lo scroll con una morbidezza indipendente dai fotogrammi
    uLiscio += (u - uLiscio) * (1 - Math.exp(-dt * 6))
    if (Math.abs(u - uLiscio) < 0.005) uLiscio = u
    uTempo.value = tempo

    const z = zAl(punti, uLiscio)
    velocita += ((Math.abs(z - zPrima) / Math.max(dt, 0.001)) - velocita) * 0.12
    zPrima = z
    scarto.x += (mira.x - scarto.x) * 0.05
    scarto.y += (mira.y - scarto.y) * 0.05
    camera.position.set(
      0.22 * Math.sin(uLiscio * 0.011) + scarto.x * 0.35,
      0.16 * Math.sin(uLiscio * 0.0083 + 1.2) + scarto.y * 0.25,
      z,
    )
    // "effetto velocita": il campo visivo si allarga quando si scorre in fretta
    const fov = FOV + clamp(velocita * 0.035, 0, 9)
    if (Math.abs(camera.fov - fov) > 0.02) {
      camera.fov = fov
      camera.updateProjectionMatrix()
    }

    for (const m of moduli) {
      const distanza = z - m.z
      const vicino = distanza < 240 && distanza > -30
      m.gruppo.visible = vicino
      if (vicino) aggiornaModulo(m, uLiscio, distanza)
    }

    tappePerdita.forEach((t, i) => {
      const f = (uLiscio - t.inizio) / t.durata
      perdite.aLuce[i] = f < 0 ? 1 : f > 1 ? 0 : 1 - liscia(0.45, 0.95, f)
      const d = z - zPerdita(i)
      nebulePerdita[i].materiale.uniforms.uAlfa.value = nebulePerdita[i].base * liscia(200, 60, d) * liscia(1, 6, d) * (0.4 + 0.6 * perdite.aLuce[i])
    })
    perdite.geometria.getAttribute('aLuce').needsUpdate = true

    for (const n of nebuleLibere) {
      const d = z - n.z
      n.materiale.uniforms.uAlfa.value = n.base * liscia(330, 160, d) * liscia(2, 14, d)
    }

    // la scia corre una dozzina di unita davanti alla camera
    const inizioScia = puntiRotta[0].z
    const fineScia = puntiRotta[puntiRotta.length - 1].z
    const prog = clamp((inizioScia - (z - 12)) / (inizioScia - fineScia), 0, 1)
    const fr = (uLiscio - tappaRotta.inizio) / tappaRotta.durata
    materialeScia.uniforms.uProg.value = fr < -0.05 ? 0 : prog
    materialeScia.uniforms.uAlfa.value = liscia(-0.1, 0.05, fr)
    ;[1, 2, 3].forEach((k, i) => {
      const quota = (inizioScia - puntiRotta[k].z) / (inizioScia - fineScia)
      tappeRotta.aLuce[i] = liscia(quota - 0.02, quota + 0.02, prog)
      tappeRotta.aFinale[i] = i === 2 ? liscia(quota, quota + 0.05, prog) : 0
    })
    tappeRotta.geometria.getAttribute('aLuce').needsUpdate = true
    tappeRotta.geometria.getAttribute('aFinale').needsUpdate = true

    renderer.render(scena, camera)
    return Math.abs(u - uLiscio) > 0.02 || velocita > 0.5
  }

  return {
    aggiorna,
    puntatore: (x, y) => {
      mira.x = x
      mira.y = y
    },
    ridimensiona,
    distruggi: () => {
      renderer.domElement.removeEventListener('webglcontextlost', alPerso)
      eliminabili.forEach((e) => e.dispose())
      renderer.dispose()
      renderer.domElement.remove()
    },
  }
}
