import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  CatmullRomCurve3,
  DataTexture,
  Group,
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  RepeatWrapping,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
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
 * `u`, i vh percorsi nella rotta. Tutto il resto e fermo nel mondo:
 * - quattro galassie a spirale, una per perdita, che la camera attraversa
 * - sei costellazioni su piani perpendicolari alla rotta, avvolte da nebulose,
 *   con il loro nome scritto all'angolo della figura
 * - la scia della rotta e la nebulosa d'arrivo
 *
 * Colori: la palette si legge dalle variabili CSS (app/globals.css), quindi
 * `?palette=ciano` o `?palette=bianco` cambiano anche la scena. Agli shader i
 * colori arrivano come sRGB diretto, senza la gestione del colore di three.js,
 * cosi in pagina si vede esattamente la palette del sito.
 *
 * Costo per fotogramma: pochi draw call, attributi aggiornati solo per le
 * costellazioni vicine, oggetti lontani nascosti, nessuna allocazione.
 */

/* ---------------------------------------------------------------------------
   Costanti del mondo
   --------------------------------------------------------------------------- */

const FOV = 50
const TAN = Math.tan(((FOV / 2) * Math.PI) / 180)
const LATO = 5.4 // lato lungo di una costellazione, in unita del mondo
const DISTANZA_MODULI = 100
const Z_PRIMO_MODULO = -290
const AVVICINAMENTO = 40
const RAGGIO_GALASSIA = 13
const zGalassia = (i: number) => -60 - i * 45
const zModulo = (i: number) => Z_PRIMO_MODULO - i * DISTANZA_MODULI
const Z_ROTTA = [zModulo(5) - 80, zModulo(5) - 115, zModulo(5) - 150]
const Z_FINE = Z_ROTTA[2] - 30

/** colori fissi: non cambiano con la palette */
const FISSI = {
  arancio: [1, 0.42, 0.172],
  giallo: [1, 0.886, 0.29],
  bianco: [0.949, 0.961, 1],
}

/** le quattro galassie delle perdite: una per colore */
const GALASSIE = [
  { nucleo: '#FFE2BE', bracci: '#FF6B2C', bordo: '#D81B60', nBracci: 2, giro: 0.36, inclinazione: 0.22, rotazione: 0.3 }, // fuoco
  { nucleo: '#FFE0F7', bracci: '#FF3DCB', bordo: '#7B2CFF', nBracci: 3, giro: 0.42, inclinazione: 0.3, rotazione: 2.1 }, // magenta
  { nucleo: '#DDFFF8', bracci: '#1FE3C4', bordo: '#1B5CFF', nBracci: 4, giro: 0.3, inclinazione: 0.18, rotazione: 4.0 }, // smeraldo
  { nucleo: '#E6F0FF', bracci: '#5B8CFF', bordo: '#3A1CFF', nBracci: 5, giro: 0.48, inclinazione: 0.26, rotazione: 5.2 }, // ghiaccio
]

const hexRgb = (hex: string, riserva: number[] = [1, 1, 1]) => {
  const h = hex.trim().replace('#', '')
  if (h.length !== 6) return riserva
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
}
const v3 = (c: number[]) => new Vector3(c[0], c[1], c[2])

/** la palette corrente, dalle variabili CSS */
function leggiPalette() {
  const cs = getComputedStyle(document.documentElement)
  const grezzo = (nome: string, riserva: string) => cs.getPropertyValue(nome).trim() || riserva
  const hex = {
    accento: grezzo('--accento', '#3DF2FF'),
    azioneLuce: grezzo('--azione-luce', '#B39BFF'),
    nebula1: grezzo('--nebula-1', '#7B2CFF'),
    nebula2: grezzo('--nebula-2', '#FF3DCB'),
    nebula3: grezzo('--nebula-3', '#2D4BFF'),
    verde: grezzo('--verde', '#4AE89A'),
  }
  return {
    hex,
    accento: hexRgb(hex.accento),
    azioneLuce: hexRgb(hex.azioneLuce),
    nebula1: hexRgb(hex.nebula1),
    nebula2: hexRgb(hex.nebula2),
    nebula3: hexRgb(hex.nebula3),
    verde: hexRgb(hex.verde),
  }
}

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

/** stelle delle costellazioni e delle tappe della rotta */
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
const PUNTO_FRAG = /* glsl */ `
  varying vec3 vColore;
  varying float vAlfa;
  void main() {
    float r = length(gl_PointCoord - 0.5) * 2.0;
    if (r > 1.0) discard;
    float a = smoothstep(1.0, 0.0, r);
    gl_FragColor = vec4(vColore, a * a * vAlfa);
  }
`

/** galassia: particelle sul piano del disco, rotazione differenziale (il centro gira piu in fretta) */
const GALASSIA_VERT = /* glsl */ `
  attribute float aR;
  attribute float aDistanza;
  attribute vec3 aColore;
  uniform float uPx;
  uniform float uTempo;
  uniform float uAlfa;
  varying vec3 vColore;
  varying float vAlfa;
  void main() {
    float angolo = uTempo * 0.05 / (0.3 + aDistanza * 0.11);
    float c = cos(angolo);
    float s = sin(angolo);
    vec3 p = vec3(position.x * c - position.y * s, position.x * s + position.y * c, position.z);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float d = max(-mv.z, 0.001);
    gl_PointSize = clamp(aR * uPx / d, 1.0, 14.0);
    gl_Position = projectionMatrix * mv;
    vColore = aColore;
    vAlfa = uAlfa * smoothstep(0.25, 1.8, d);
  }
`

/** bagliore radiale (nucleo di una galassia) */
const BAGLIORE_FRAG = /* glsl */ `
  uniform vec3 uColore;
  uniform float uAlfa;
  varying vec2 vUv;
  void main() {
    float r = length(vUv - 0.5) * 2.0;
    float a = exp(-r * r * 9.0) * 0.5 + exp(-r * r * 2.2) * 0.14;
    gl_FragColor = vec4(uColore, a * uAlfa);
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

/** la scia della rotta: svanisce vicino alla camera, altrimenti passa davanti all'obiettivo come un fascio enorme */
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
  xGalassia: number
  yGalassia: number
  ritratto: boolean
}

function impagina(aspetto: number): Impaginazione {
  if (aspetto >= 1) {
    // schermo largo: testo a sinistra, costellazione nella meta destra
    const sosta = Math.max(LATO / (0.8 * TAN * aspetto), LATO / (0.75 * 2 * TAN))
    const mezzaLarghezza = sosta * TAN * aspetto
    return { sosta, xFigura: mezzaLarghezza * 0.44, yFigura: 0, xGalassia: 1.4, yGalassia: 0.2, ritratto: false }
  }
  // telefono: la figura occupa al massimo il 32% dell'altezza, centrata al 30% dall'alto
  const sosta = Math.max(LATO / (0.86 * 2 * TAN * aspetto), LATO / (0.64 * TAN))
  const mezzaAltezza = sosta * TAN
  return { sosta, xFigura: 0, yFigura: mezzaAltezza * 0.4, xGalassia: 0.4, yGalassia: 1.2, ritratto: true }
}

type Punto = { u: number; z: number }

/** i punti chiave della camera lungo la rotta; fra un punto e l'altro si interpola morbido */
function percorso(imp: Impaginazione): Punto[] {
  const punti: Punto[] = []
  for (const t of TAPPE) {
    const f = (frazione: number) => t.inizio + frazione * t.durata
    if (t.tipo === 'partenza') punti.push({ u: f(0), z: 10 })
    if (t.tipo === 'perdita') {
      // si entra nella galassia e se ne attraversa il nucleo verso il 62% della tappa
      const zg = zGalassia(t.indice)
      punti.push({ u: f(0), z: zg + 26 }, { u: f(0.62), z: zg - 1 })
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

/**
 * Il percorso della camera come curva continua (interpolazione cubica
 * monotona di Fritsch-Carlson), non come una serie di tratti che partono e
 * si fermano: prima la camera rallentava fino a zero a ogni punto chiave,
 * ed era quello che dava al volo l'aria "meccanica". Monotona vuol dire che
 * non torna mai indietro e non supera i punti chiave.
 */
type Percorso = { u: number[]; z: number[]; m: number[] }

function preparaPercorso(punti: Punto[]): Percorso {
  const u = punti.map((p) => p.u)
  const z = punti.map((p) => p.z)
  const n = punti.length
  const h = u.slice(1).map((x, i) => x - u[i])
  const d = h.map((hi, i) => (z[i + 1] - z[i]) / hi)
  const m = new Array<number>(n)
  m[0] = d[0]
  m[n - 1] = d[n - 2]
  for (let i = 1; i < n - 1; i++) {
    if (d[i - 1] * d[i] <= 0) m[i] = 0
    else {
      const w1 = 2 * h[i] + h[i - 1]
      const w2 = h[i] + 2 * h[i - 1]
      m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i])
    }
  }
  return { u, z, m }
}

function zAl(p: Percorso, uu: number) {
  const { u, z, m } = p
  if (uu <= u[0]) return z[0]
  if (uu >= u[u.length - 1]) return z[z.length - 1]
  let i = 0
  while (i < u.length - 2 && uu > u[i + 1]) i++
  const h = u[i + 1] - u[i]
  const t = (uu - u[i]) / h
  const t2 = t * t
  const t3 = t2 * t
  return (2 * t3 - 3 * t2 + 1) * z[i] + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * z[i + 1] + (t3 - t2) * h * m[i + 1]
}

/* ---------------------------------------------------------------------------
   Il nome della costellazione, scritto nello spazio
   --------------------------------------------------------------------------- */

const CORPO = 150 // altezza del nome nel canvas, in pixel
/** altezza del nome nel mondo: piu grande sul telefono, dove la camera sta piu lontana */
const altezzaNome = (ritratto: boolean) => (ritratto ? 1.35 : 0.62)

function disegnaNome(
  canvas: HTMLCanvasElement,
  nome: string,
  sotto: string,
  famiglie: { display: string; mono: string },
  colori: { a: string; b: string },
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return { w: 1, h: 1 }
  const fontNome = `500 ${CORPO}px ${famiglie.display}`
  const corpoSotto = Math.round(CORPO * 0.3)
  const fontSotto = `500 ${corpoSotto}px ${famiglie.mono}`
  const lettere = Array.from(nome.toUpperCase())
  const spaziatura = CORPO * 0.14
  const spaziaturaSotto = corpoSotto * 0.16

  ctx.font = fontNome
  const larghezzeNome = lettere.map((l) => ctx.measureText(l).width)
  const larghezzaNome = larghezzeNome.reduce((t, x) => t + x, 0) + spaziatura * (lettere.length - 1)
  ctx.font = fontSotto
  const caratteriSotto = Array.from(sotto.toUpperCase())
  const larghezzeSotto = caratteriSotto.map((c) => ctx.measureText(c).width)
  const larghezzaSotto = larghezzeSotto.reduce((t, x) => t + x, 0) + spaziaturaSotto * (caratteriSotto.length - 1)

  const margine = CORPO * 0.2
  const w = Math.ceil(Math.max(larghezzaNome, larghezzaSotto) + margine * 2)
  const h = Math.ceil(CORPO * 1.05 + corpoSotto * 1.9 + margine * 2)
  canvas.width = w
  canvas.height = h
  ctx.clearRect(0, 0, w, h)

  // il nome: sfumato con i colori della palette, con un alone morbido
  ctx.font = fontNome
  ctx.textBaseline = 'alphabetic'
  const sfumatura = ctx.createLinearGradient(margine, 0, margine + larghezzaNome, 0)
  sfumatura.addColorStop(0, colori.a)
  sfumatura.addColorStop(1, colori.b)
  ctx.fillStyle = sfumatura
  ctx.shadowColor = colori.a
  ctx.shadowBlur = CORPO * 0.22
  const yNome = margine + CORPO * 0.8
  let x = margine
  lettere.forEach((l, i) => {
    ctx.fillText(l, x, yNome)
    x += larghezzeNome[i] + spaziatura
  })

  // sotto: sigla e coordinate, in mono
  ctx.shadowBlur = 0
  ctx.font = fontSotto
  ctx.fillStyle = 'rgba(242, 245, 255, 0.72)'
  x = margine
  const ySotto = yNome + corpoSotto * 1.75
  caratteriSotto.forEach((c, i) => {
    ctx.fillText(c, x, ySotto)
    x += larghezzeSotto[i] + spaziaturaSotto
  })
  return { w, h }
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
  nome: { mesh: Mesh; materiale: MeshBasicMaterial; w: number; h: number }
  metaLarghezza: number
  metaAltezza: number
}

type GalassiaScena = {
  gruppo: Group
  z: number
  materiale: ShaderMaterial
  bagliore: ShaderMaterial
  alone: ShaderMaterial
}

export function creaScena(contenitore: HTMLElement, opzioni: { mobile: boolean; onPerso: () => void }): Scena {
  const { mobile } = opzioni
  const P = leggiPalette()
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
      const tinta = c < 0.72 ? FISSI.bianco : c < 0.92 ? P.accento : c < 0.97 ? FISSI.giallo : P.nebula2
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
    const campo = new Points(g, materiale(PUNTO_FRAG, CAMPO_VERT, { uPx, uTempo }))
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
  nebulaLibera(-8, 5, -120, 60, P.nebula3, P.nebula1, 0.12, 2)
  nebulaLibera(-4, 2, Z_FINE - 45, 70, P.nebula1, P.nebula2, 0.4, 3)
  nebulaLibera(8, -3, Z_FINE - 62, 95, P.nebula3, P.nebula1, 0.3, 4)
  nebulaLibera(-10, 6, Z_FINE - 85, 120, P.nebula2, P.accento, 0.2, 5)

  /* ----- le quattro galassie delle perdite ----- */
  const tappePerdita = TAPPE.filter((t) => t.tipo === 'perdita')
  const galassie: GalassiaScena[] = GALASSIE.map((def, i) => {
    const caso = mulberry32(100 + i)
    const n = mobile ? 5500 : 9000
    const pos = new Float32Array(n * 3)
    const raggi = new Float32Array(n)
    const distanze = new Float32Array(n)
    const colori = new Float32Array(n * 3)
    const cNucleo = hexRgb(def.nucleo)
    const cBracci = hexRgb(def.bracci)
    const cBordo = hexRgb(def.bordo)
    const sparso = (k: number) => Math.pow(caso(), 3) * (caso() < 0.5 ? 1 : -1) * k
    for (let k = 0; k < n; k++) {
      const r = Math.pow(caso(), 1.45) * RAGGIO_GALASSIA
      const t = r / RAGGIO_GALASSIA
      const braccio = ((k % def.nBracci) / def.nBracci) * Math.PI * 2
      const spirale = r * def.giro
      const dispersione = 0.28 + t * 0.35
      pos[k * 3] = Math.cos(braccio + spirale) * r + sparso(dispersione * r * 0.6)
      pos[k * 3 + 1] = Math.sin(braccio + spirale) * r + sparso(dispersione * r * 0.6)
      // disco sottile, rigonfio al centro
      pos[k * 3 + 2] = sparso(0.25 + 1.4 * Math.pow(1 - t, 3))
      distanze[k] = r
      const giovane = caso() < 0.07
      raggi[k] = 0.05 + Math.pow(caso(), 4) * 0.14 + (t < 0.12 ? 0.02 : 0) + (giovane ? 0.08 : 0)
      const verso = liscia(0, 0.35, t)
      const fuori = liscia(0.55, 1, t)
      const luminosita = (0.6 + caso() * 0.4) * (giovane ? 1.2 : 1)
      for (let c = 0; c < 3; c++) {
        const base = cNucleo[c] + (cBracci[c] - cNucleo[c]) * verso
        const col = base + (cBordo[c] - base) * fuori
        colori[k * 3 + c] = Math.min(1, (giovane ? col * 0.6 + 0.4 : col) * luminosita)
      }
    }
    const g = new BufferGeometry()
    g.setAttribute('position', new BufferAttribute(pos, 3))
    g.setAttribute('aR', new BufferAttribute(raggi, 1))
    g.setAttribute('aDistanza', new BufferAttribute(distanze, 1))
    g.setAttribute('aColore', new BufferAttribute(colori, 3))
    eliminabili.push(g)
    const mat = materiale(PUNTO_FRAG, GALASSIA_VERT, { uPx, uTempo, uAlfa: { value: 1 } })
    const punti = new Points(g, mat)
    punti.frustumCulled = false

    const bagliore = materiale(BAGLIORE_FRAG, VERT_UV, { uColore: { value: v3(cNucleo) }, uAlfa: { value: 1 } })
    const nucleo = new Mesh(pianoBase, bagliore)
    nucleo.scale.set(RAGGIO_GALASSIA * 0.9, RAGGIO_GALASSIA * 0.9, 1)
    const alone = nebula(0, 0, -0.2, RAGGIO_GALASSIA * 2.3, cBracci, cBordo, 0.14, 20 + i)

    const gruppo = new Group()
    gruppo.add(alone.mesh, punti, nucleo)
    // prima la rotazione nel piano del disco, poi l'inclinazione verso chi guarda
    gruppo.rotation.set(def.inclinazione, 0, def.rotazione)
    scena.add(gruppo)
    return { gruppo, z: zGalassia(i), materiale: mat, bagliore, alone: alone.materiale }
  })

  /* ----- le sei costellazioni ----- */
  const famiglie = { display: 'sans-serif', mono: 'monospace' }
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
    const st = stelle(posizioni, raggi, { spento: FISSI.arancio, acceso: P.accento, nucleo: FISSI.bianco, finale: P.verde })
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
        uColore: { value: v3(P.accento) },
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
      nebula(0.4, 0.2, -1.5, LATO * 2.6, P.nebula1, P.nebula2, 0.3, tappa.indice * 3 + 1),
      nebula(-1.2, -0.6, -4.5, LATO * 3.5, P.nebula3, P.nebula1, 0.22, tappa.indice * 3 + 2),
      ...(mobile ? [] : [nebula(1.5, 1.2, -8, LATO * 4.6, P.nebula2, P.accento, 0.15, tappa.indice * 3 + 3)]),
    ]
    nebule.forEach((n) => gruppo.add(n.mesh))

    // il nome: la texture si disegna quando i caratteri del sito sono pronti
    const canvasNome = document.createElement('canvas')
    const texturaNome = new CanvasTexture(canvasNome)
    texturaNome.colorSpace = SRGBColorSpace
    texturaNome.minFilter = LinearFilter
    texturaNome.generateMipmaps = false
    eliminabili.push(texturaNome)
    const materialeNome = new MeshBasicMaterial({
      map: texturaNome,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      opacity: 0,
      toneMapped: false,
    })
    eliminabili.push(materialeNome)
    const meshNome = new Mesh(pianoBase, materialeNome)
    meshNome.visible = false
    gruppo.add(meshNome)

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
      nome: { mesh: meshNome, materiale: materialeNome, w: 1, h: 1 },
      metaLarghezza: ((cost.larghezza / 2 - 12) / 100) * LATO,
      metaAltezza: ((cost.altezza / 2 - 12) / 100) * LATO,
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
    uColore: { value: v3(P.accento) },
  })
  const scia = new Mesh(geometriaScia, materialeScia)
  scia.frustumCulled = false
  scena.add(scia)
  const tappeRotta = stelle(
    [puntiRotta[1], puntiRotta[2], puntiRotta[3]].flatMap((p) => [p.x, p.y, p.z]),
    [0.5, 0.5, 0.62],
    { spento: FISSI.arancio, acceso: P.accento, nucleo: FISSI.bianco, finale: P.verde },
  )
  scena.add(tappeRotta.punti)

  /* ----- impaginazione e percorso ----- */
  let imp = impagina(1.6)
  let percorsoCamera = preparaPercorso(percorso(imp))

  /**
   * Il nome: sullo schermo largo sta all'angolo in alto a sinistra della figura;
   * sul telefono lo spazio sotto la figura e occupato dal testo, quindi diventa
   * una filigrana grande e tenue dietro la costellazione.
   */
  const posizionaNome = (m: ModuloScena) => {
    const k = altezzaNome(imp.ritratto) / CORPO
    const w = m.nome.w * k
    const h = m.nome.h * k
    m.nome.mesh.rotation.z = 0
    if (imp.ritratto) m.nome.mesh.position.set(0, 0, -1)
    else if (m.metaAltezza > m.metaLarghezza * 1.3) {
      // figure alte (Orione, Lira): sopra non c'e spazio, finirebbe sotto il menu.
      // Il nome corre in verticale lungo il fianco sinistro e finisce all'angolo in alto
      m.nome.mesh.rotation.z = Math.PI / 2
      m.nome.mesh.position.set(-m.metaLarghezza - 0.3 - h / 2, m.metaAltezza - w / 2, -0.6)
    } else m.nome.mesh.position.set(-m.metaLarghezza + w / 2, m.metaAltezza + 0.3 + h / 2, -0.6)
    m.nome.mesh.scale.set(w, h, 1)
  }

  const ridimensiona = () => {
    const w = contenitore.clientWidth || window.innerWidth
    const h = contenitore.clientHeight || window.innerHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    uPx.value = (h * renderer.getPixelRatio()) / (2 * TAN)
    imp = impagina(camera.aspect)
    percorsoCamera = preparaPercorso(percorso(imp))
    for (const m of moduli) {
      m.gruppo.position.set(imp.xFigura, imp.yFigura, m.z)
      posizionaNome(m)
    }
    galassie.forEach((g, i) => g.gruppo.position.set(imp.xGalassia * (i % 2 === 0 ? 1 : -1), imp.yGalassia, g.z))
  }
  ridimensiona()

  // i nomi delle costellazioni: stessi caratteri del sito, quando sono caricati
  let chiusa = false
  {
    const display = document.querySelector('.display')
    const mono = document.querySelector('.mono, .occhiello')
    if (display) famiglie.display = getComputedStyle(display).fontFamily
    if (mono) famiglie.mono = getComputedStyle(mono).fontFamily
    const pronti: Promise<unknown> = document.fonts
      ? Promise.all([
          document.fonts.load(`500 ${CORPO}px ${famiglie.display}`),
          document.fonts.load(`500 ${Math.round(CORPO * 0.3)}px ${famiglie.mono}`),
        ]).catch(() => undefined)
      : Promise.resolve()
    pronti.then(() => {
      if (chiusa) return
      moduli.forEach((m) => {
        const modulo = MODULI[m.tappa.indice]
        const canvas = (m.nome.materiale.map as CanvasTexture).image as HTMLCanvasElement
        const { w, h } = disegnaNome(canvas, modulo.cielo.nome, `${modulo.sigla} · ${COSTELLAZIONI[modulo.cielo.chiave].coordinate}`, famiglie, {
          a: P.hex.accento,
          b: P.hex.azioneLuce,
        })
        m.nome.w = w
        m.nome.h = h
        m.nome.materiale.map!.needsUpdate = true
        m.nome.mesh.visible = true
        posizionaNome(m)
      })
    })
  }

  /* ----- stato e aggiornamento ----- */
  let uLiscio = 0
  let zPrima = zAl(percorsoCamera, 0)
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
    // la nebulosa si illumina man mano che la costellazione si completa
    for (const n of m.nebule) {
      n.materiale.uniforms.uAlfa.value = n.base * liscia(230, 110, distanza) * liscia(2, 12, distanza) * (1 + 0.5 * (accesi / m.totale) + 0.6 * luce)
    }
    // il nome compare quando le stelle cominciano a collegarsi
    m.nome.materiale.opacity = (imp.ritratto ? 0.34 : 0.85) * liscia(0.3, 0.45, frazione) * alfa
  }

  /**
   * `u` arriva gia morbida da Volo.tsx: testi e scena condividono la stessa
   * "macchina da presa", cosi si muovono insieme invece di rincorrersi.
   */
  const aggiorna = (u: number, dt: number, tempo: number) => {
    uLiscio = u
    uTempo.value = tempo

    const z = zAl(percorsoCamera, uLiscio)
    const passo = Math.max(dt, 0.001)
    velocita += (Math.abs(z - zPrima) / passo - velocita) * (1 - Math.exp(-passo * 5))
    zPrima = z
    // il puntatore sposta appena l'inquadratura, con molta calma
    scarto.x += (mira.x - scarto.x) * (1 - Math.exp(-passo * 2.2))
    scarto.y += (mira.y - scarto.y) * (1 - Math.exp(-passo * 2.2))
    camera.position.set(
      0.24 * Math.sin(uLiscio * 0.0095) + scarto.x * 0.35,
      0.17 * Math.sin(uLiscio * 0.0071 + 1.2) + scarto.y * 0.25,
      z,
    )
    // un rollio leggerissimo, come una camera a mano ferma: meno di un grado e mezzo
    camera.rotation.z = 0.02 * Math.sin(uLiscio * 0.0042 + 0.6) + scarto.x * -0.012
    // "effetto velocita": il campo visivo si allarga appena quando si scorre in fretta
    const fov = FOV + clamp(velocita * 0.03, 0, 7)
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

    galassie.forEach((g, i) => {
      const d = z - g.z
      const vicina = d < 320 && d > -25
      g.gruppo.visible = vicina
      if (!vicina) return
      // da lontano compare piano; dopo averla attraversata si spegne alle spalle
      const t = tappePerdita[i]
      const f = (uLiscio - t.inizio) / t.durata
      const dopo = f > 0.62 ? 1 - liscia(0.62, 1.05, f) * 0.6 : 1
      const alfa = liscia(320, 150, d) * dopo
      g.materiale.uniforms.uAlfa.value = alfa * 0.62
      g.bagliore.uniforms.uAlfa.value = alfa * liscia(1.5, 8, Math.abs(d))
      g.alone.uniforms.uAlfa.value = 0.14 * alfa * liscia(1, 7, Math.abs(d))
    })

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
    return velocita > 0.3
  }

  return {
    aggiorna,
    puntatore: (x, y) => {
      mira.x = x
      mira.y = y
    },
    ridimensiona,
    distruggi: () => {
      chiusa = true
      renderer.domElement.removeEventListener('webglcontextlost', alPerso)
      eliminabili.forEach((e) => e.dispose())
      renderer.dispose()
      renderer.domElement.remove()
    },
  }
}
