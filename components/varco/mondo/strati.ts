// Gli strati del Kit in Three.js (piano-costruzione-v2, compito 5): modo immediato. A ogni fotogramma `inizia` azzera i
// flag, ogni chiamata del Kit accende uno strato e ne imposta lo stato, `fine` nasconde quelli non chiamati e applica
// il quadro. Riserve fisse, nessuna allocazione nel ciclo. Tutto dipende solo da `t`: tornando indietro si riavvolge.
// Presenti: luce, getto, orbita, galassia, linea, onda, pulsa, foto, fuoco. Non ancora (arrivano coi compiti che li usano):
// saetta e raggi (Prometheus, Janus), anello (compito 6), campo (finale): oggi sono vuoti.
import { AdditiveBlending, BufferAttribute, BufferGeometry, Group, LineBasicMaterial, LineSegments, Mesh, Object3D, PlaneGeometry, Points, ShaderMaterial, Vector2, Vector3 } from 'three'
import { mulberry32 } from '../campiona.ts'
import type { Colore, Kit } from '../kit.ts'
import { CONTEGGI } from '../livello.ts'
import type { Livello, Vec2 } from '../tipi.ts'
import { ALONE_FRAG, ALONE_VERT } from './shader.ts'
import { ANELLO_FRAG, GALASSIA_FRAG, GALASSIA_VERT, GETTO_VERT, LINEA_VERT, ORBITA_FRAG, ORBITA_VERT, PUNTI_FRAG } from './shader-strati.ts'

export type ColoriStrati = { polvere: number[]; vetro: number[]; saette: number[]; cromo: number[]; luce: number[] }

export type Strati = {
  kit: Kit
  radice: Group
  inizia(): void
  fine(quadro: Object3D | null, tempo: number): void
  /** il punto della scena da cui partono le particelle verso la parola d'accento (null se la regia non l'ha dato) */
  fuoco(): Vec2 | null
  /** l'esposizione di ogni foto (Kit.foto); 1 se la regia non la tocca */
  esposizione(): [number, number, number]
  /** px per unità a distanza 1 (altezza dello schermo in pixel / (2 · tan(fov / 2))) */
  imposta(px: number): void
  dispose(): void
}

const LARGHEZZA = 2.25
const ALTEZZA = 4
const MAX_LUCI = 8
const MAX_ANELLI = 5
const MAX_GETTI = 6
const MAX_ORBITE = 2
const MAX_LINEE = 3
const PUNTI_ORBITA = 64
const PUNTI_GALASSIA = 2600
const NP = 16

const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x))
const piano = (p: Vec2, z = 0.05) => new Vector3((p[0] - 0.5) * LARGHEZZA, (0.5 - p[1]) * ALTEZZA, z)

/** una riserva di oggetti con assegnazione per id: un id tiene lo stesso posto finché lo si chiama ogni fotogramma */
function riserva<T>(n: number, crea: (i: number) => T) {
  const oggetti = Array.from({ length: n }, (_, i) => crea(i))
  const usati = new Array<boolean>(n).fill(false)
  const perId = new Map<string, number>()
  return {
    oggetti,
    usati,
    prendi(id: string): number {
      let i = perId.get(id)
      if (i === undefined) {
        i = usati.findIndex((u, k) => !u && !Array.from(perId.values()).includes(k))
        if (i < 0) return -1
        perId.set(id, i)
      }
      usati[i] = true
      return i
    },
    /** libera gli id non chiamati in questo fotogramma */
    chiudi() {
      for (const [id, i] of Array.from(perId)) if (!usati[i]) perId.delete(id)
    },
    azzera() {
      usati.fill(false)
    },
  }
}

export function creaStrati(livello: Livello, colori: ColoriStrati): Strati {
  const radice = new Group()
  const eliminabili: { dispose: () => void }[] = []
  const uTempo = { value: 0 }
  const uPx = { value: 1 }
  const v3 = (c: number[]) => new Vector3(c[0], c[1], c[2])
  const colore = (c: Colore): Vector3 => v3(c === 'luce' ? colori.luce : c === 'perla' ? colori.saette : c === 'blu' ? colori.polvere : colori[c])
  const additivo = (vert: string, frag: string, uniforms: Record<string, { value: unknown }>) => {
    const m = new ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms, transparent: true, depthWrite: false, blending: AdditiveBlending })
    eliminabili.push(m)
    return m
  }
  const pianoBase = new PlaneGeometry(1, 1)
  eliminabili.push(pianoBase)

  let fuocoPunto: Vec2 | null = null
  let esposizioni: [number, number, number] = [1, 1, 1]

  /* ----- luci: alone caldo o colorato, mai sopra 0,85 ----- */
  const luci = riserva(MAX_LUCI, () => {
    const m = additivo(ALONE_VERT, ALONE_FRAG, { uColore: { value: new Vector3() }, uAlfa: { value: 0 } })
    const mesh = new Mesh(pianoBase, m)
    mesh.visible = false
    mesh.frustumCulled = false
    radice.add(mesh)
    return { mesh, m }
  })

  /* ----- anelli: onde e pulsazioni ----- */
  const anelli = riserva(MAX_ANELLI, () => {
    const m = additivo(ALONE_VERT, ANELLO_FRAG, { uColore: { value: new Vector3() }, uAlfa: { value: 0 }, uR: { value: 0 }, uSp: { value: 0.09 } })
    const mesh = new Mesh(pianoBase, m)
    mesh.visible = false
    mesh.frustumCulled = false
    radice.add(mesh)
    return { mesh, m }
  })

  /* ----- getti: un Points ciascuno, il moto lo calcola lo shader da t ----- */
  const nGetto = Math.max(40, Math.floor(CONTEGGI[livello].getti / MAX_GETTI))
  const casoGetto = mulberry32(4242)
  const getti = riserva(MAX_GETTI, () => {
    const g = new BufferGeometry()
    g.setAttribute('position', new BufferAttribute(new Float32Array(nGetto * 3), 3))
    const c = new Float32Array(nGetto * 4)
    for (let i = 0; i < c.length; i++) c[i] = casoGetto()
    g.setAttribute('aCaso', new BufferAttribute(c, 4))
    eliminabili.push(g)
    const m = additivo(GETTO_VERT, PUNTI_FRAG, {
      uColore: { value: new Vector3() }, uDa: { value: new Vector3() }, uVerso: { value: new Vector3() }, uCamera: { value: 0 },
      uT: { value: 0 }, uN: { value: 0 }, uGrav: { value: 0 }, uAmp: { value: 0 }, uPx,
    })
    const punti = new Points(g, m)
    punti.frustumCulled = false
    punti.visible = false
    radice.add(punti)
    return { punti, m }
  })

  /* ----- orbite: n punti su un'ellisse, accesi in ordine ----- */
  const casoOrbita = mulberry32(777)
  const orbite = riserva(MAX_ORBITE, () => {
    const g = new BufferGeometry()
    g.setAttribute('position', new BufferAttribute(new Float32Array(PUNTI_ORBITA * 3), 3))
    g.setAttribute('aK', new BufferAttribute(Float32Array.from({ length: PUNTI_ORBITA }, (_, i) => i / PUNTI_ORBITA), 1))
    g.setAttribute('aCaso', new BufferAttribute(Float32Array.from({ length: PUNTI_ORBITA * 3 }, () => casoOrbita()), 3))
    eliminabili.push(g)
    const m = additivo(ORBITA_VERT, ORBITA_FRAG, {
      uColore: { value: new Vector3() }, uSpento: { value: new Vector3(0.28, 0.34, 0.5) }, uCentro: { value: new Vector3() }, uRaggio: { value: new Vector2() },
      uN: { value: 0 }, uAccese: { value: 0 }, uOrdine: { value: 0 }, uVel: { value: 1 }, uAlfa: { value: 0 }, uTempo, uPx,
    })
    const punti = new Points(g, m)
    punti.frustumCulled = false
    punti.visible = false
    radice.add(punti)
    return { punti, m }
  })

  /* ----- la galassia a spirale, in codice ----- */
  const casoGalassia = mulberry32(99)
  const galassie = riserva(1, () => {
    const g = new BufferGeometry()
    g.setAttribute('position', new BufferAttribute(new Float32Array(PUNTI_GALASSIA * 3), 3))
    g.setAttribute('aCaso', new BufferAttribute(Float32Array.from({ length: PUNTI_GALASSIA * 4 }, () => casoGalassia()), 4))
    eliminabili.push(g)
    const m = additivo(GALASSIA_VERT, GALASSIA_FRAG, {
      uColore: { value: v3(colori.polvere) }, uCentro: { value: new Vector3() }, uRaggio: { value: 1 }, uBracci: { value: 2 }, uGiro: { value: 0 }, uAlfa: { value: 0 }, uTempo, uPx,
    })
    const punti = new Points(g, m)
    punti.frustumCulled = false
    punti.visible = false
    radice.add(punti)
    return { punti, m }
  })

  /* ----- linee: una spezzata che si disegna fino a t, con gocce che la percorrono e segni sui vertici ----- */
  const casoLinea = mulberry32(31337)
  const N_LINEA = 200
  const N_GOCCE = 36
  const linee = riserva(MAX_LINEE, () => {
    const totale = N_LINEA + N_GOCCE + NP
    const aS = new Float32Array(totale)
    const aTipo = new Float32Array(totale)
    const aCaso = new Float32Array(totale * 2)
    for (let i = 0; i < N_LINEA; i++) aS[i] = i / (N_LINEA - 1)
    for (let i = 0; i < N_GOCCE; i++) { aS[N_LINEA + i] = casoLinea(); aTipo[N_LINEA + i] = 1 }
    for (let i = 0; i < NP; i++) { aS[N_LINEA + N_GOCCE + i] = i / (NP - 1); aTipo[N_LINEA + N_GOCCE + i] = 2 }
    for (let i = 0; i < aCaso.length; i++) aCaso[i] = casoLinea()
    const g = new BufferGeometry()
    g.setAttribute('position', new BufferAttribute(new Float32Array(totale * 3), 3))
    g.setAttribute('aS', new BufferAttribute(aS, 1))
    g.setAttribute('aTipo', new BufferAttribute(aTipo, 1))
    g.setAttribute('aCaso', new BufferAttribute(aCaso, 2))
    eliminabili.push(g)
    const m = additivo(LINEA_VERT, PUNTI_FRAG, {
      uColore: { value: new Vector3() }, uP: { value: Array.from({ length: NP }, () => new Vector2()) }, uCum: { value: new Array<number>(NP).fill(1) }, uNP: { value: 2 },
      uT: { value: 0 }, uTempo, uPx, uGocce: { value: 0 }, uSegni: { value: 0 }, uSp: { value: 1 },
    })
    const punti = new Points(g, m)
    punti.frustumCulled = false
    punti.visible = false
    radice.add(punti)
    return { punti, m }
  })


  /* ----- saette: un fulmine ramificato per slot; cambia forma al massimo 2,5 volte al secondo (nessun lampo oltre 3 al secondo) ----- */
  const MAX_SAETTE = 3
  const SEGMENTI = 14
  let tempoStrati = 0
  const matSaetta = new LineBasicMaterial({ color: 0xece4ff, transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false })
  eliminabili.push(matSaetta)
  const saette = riserva(MAX_SAETTE, () => {
    const g = new BufferGeometry()
    g.setAttribute('position', new BufferAttribute(new Float32Array(SEGMENTI * 2 * 3 * 3 * 2), 3))
    eliminabili.push(g)
    const m = matSaetta.clone()
    eliminabili.push(m)
    const linee = new LineSegments(g, m)
    linee.frustumCulled = false
    linee.visible = false
    radice.add(linee)
    return { linee, g, m, seme: -1 }
  })
  const rnd = (x: number) => { const v = Math.sin(x * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v) }

  /* ----- raggi di luce a ventaglio ----- */
  const MAX_RAGGI = 2
  const raggi = riserva(MAX_RAGGI, () => {
    const g = new BufferGeometry()
    g.setAttribute('position', new BufferAttribute(new Float32Array(24 * 2 * 3), 3))
    eliminabili.push(g)
    const m = new LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false })
    eliminabili.push(m)
    const linee = new LineSegments(g, m)
    linee.frustumCulled = false
    linee.visible = false
    radice.add(linee)
    return { linee, g, m }
  })

  /* ----- la lastra di vetro: bordo acceso, riflesso, calore che dilaga; ruota e si apre come una porta ----- */
  const LASTRA_VERT = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`
  const LASTRA_FRAG = `
    uniform vec3 uColore; uniform vec3 uCaldo; uniform float uAlfa; uniform float uCalore; uniform float uTempo;
    varying vec2 vUv;
    void main(){
      vec2 p = vUv - 0.5;
      vec2 e = 0.5 - abs(p);
      float bordo = 1.0 - smoothstep(0.0, 0.028, min(e.x, e.y));
      float dentro = smoothstep(0.0, 0.2, min(e.x, e.y));
      float riflesso = smoothstep(0.0, 1.0, 0.5 + 0.5 * sin((vUv.x * 1.4 - vUv.y * 2.2 + uTempo * 0.05) * 5.0)) * 0.05;
      float dg = vUv.x - vUv.y * 0.35 + 0.1;
      float diagonale = smoothstep(0.42, 0.5, dg) * (1.0 - smoothstep(0.5, 0.58, dg)) * 0.16;
      float caldo = uCalore * (1.0 - length(p) * 1.15);
      vec3 c = uColore * (0.1 + riflesso + diagonale) + uColore * bordo * 1.4 + uCaldo * max(caldo, 0.0) * 1.2;
      float a = clamp(0.18 * dentro + bordo * 0.95 + diagonale + max(caldo, 0.0) * 0.9, 0.0, 1.0) * uAlfa;
      gl_FragColor = vec4(c, a);
    }`
  const lastre = riserva(2, () => {
    const g = new PlaneGeometry(1, 1)
    g.translate(0.5, 0, 0) // la cerniera è sul lato sinistro
    eliminabili.push(g)
    const m = new ShaderMaterial({ vertexShader: LASTRA_VERT, fragmentShader: LASTRA_FRAG, uniforms: { uColore: { value: new Vector3() }, uCaldo: { value: v3(colori.luce) }, uAlfa: { value: 0 }, uCalore: { value: 0 }, uTempo }, transparent: true, depthWrite: false, blending: AdditiveBlending })
    eliminabili.push(m)
    const perno = new Group()
    const mesh = new Mesh(g, m)
    perno.add(mesh)
    perno.visible = false
    radice.add(perno)
    return { perno, mesh, m }
  })

  /* ----- punti: le luci della mappa ----- */
  const MAX_PUNTI = 64
  const PUNTI_VERT = `
    attribute float aPeso; attribute float aK;
    uniform float uAccese; uniform float uAlfa; uniform float uPx; varying float vAlfa; varying float vLit;
    void main(){
      float lit = clamp(uAccese - aK, 0.0, 1.0);
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      float d = max(-mv.z, 0.001);
      gl_PointSize = clamp(uPx * (0.035 + 0.07 * aPeso) * (0.5 + 0.5 * lit) / d, 1.5, 22.0);
      gl_Position = projectionMatrix * mv;
      vLit = lit; vAlfa = uAlfa * (0.25 + 0.75 * lit);
    }`
  const PUNTI_FRAG2 = `
    uniform vec3 uColore; uniform vec3 uCaldo; varying float vAlfa; varying float vLit;
    void main(){
      float r = length(gl_PointCoord - 0.5) * 2.0; if (r > 1.0) discard;
      float a = smoothstep(1.0, 0.0, r); float nu = smoothstep(0.4, 0.0, r);
      vec3 c = mix(uColore, uCaldo, vLit) + vec3(1.0) * nu * 0.5;
      gl_FragColor = vec4(c, (a * a * 0.75 + nu * 0.4) * vAlfa);
    }`
  const mappe = riserva(1, () => {
    const g = new BufferGeometry()
    g.setAttribute('position', new BufferAttribute(new Float32Array(MAX_PUNTI * 3), 3))
    g.setAttribute('aPeso', new BufferAttribute(new Float32Array(MAX_PUNTI), 1))
    g.setAttribute('aK', new BufferAttribute(Float32Array.from({ length: MAX_PUNTI }, (_, i) => i), 1))
    g.setDrawRange(0, 0)
    eliminabili.push(g)
    const m = new ShaderMaterial({ vertexShader: PUNTI_VERT, fragmentShader: PUNTI_FRAG2, uniforms: { uColore: { value: new Vector3() }, uCaldo: { value: v3(colori.luce) }, uAccese: { value: 0 }, uAlfa: { value: 0 }, uPx }, transparent: true, depthWrite: false, blending: AdditiveBlending })
    eliminabili.push(m)
    const punti = new Points(g, m)
    punti.frustumCulled = false
    punti.visible = false
    radice.add(punti)
    return { punti, g, m }
  })

  /* ----- pulsa: due battiti a tempo, una volta per passaggio ----- */
  const DURATA_PULSA = 0.9
  type Pulsa = { armato: boolean; inizio: number; richiesto: boolean; o: { a: Vec2; raggio: number; colore: Colore }; t: number }
  const pulse = new Map<string, Pulsa>()

  const kit: Kit = {
    soggetto: { centro: [0.5, 0.5], altezza: 0.45 },
    getto(id, o, t) {
      const i = getti.prendi(id)
      if (i < 0) return
      const { punti, m } = getti.oggetti[i]
      const u = m.uniforms
      u.uColore.value.copy(colore(o.colore))
      u.uDa.value.copy(piano(o.da))
      u.uCamera.value = o.verso === 'camera' ? 1 : 0
      if (o.verso !== 'camera') u.uVerso.value.copy(piano(o.verso))
      u.uT.value = clamp(t, 0, 1)
      u.uN.value = clamp(o.n / 100, 0, 1)
      u.uGrav.value = o.gravita ?? 0
      u.uAmp.value = o.ampiezza ?? 0
      punti.visible = true
    },
    luce(id, o, intensita) {
      const i = luci.prendi(id)
      if (i < 0) return
      const { mesh, m } = luci.oggetti[i]
      m.uniforms.uColore.value.copy(colore(o.colore))
      m.uniforms.uAlfa.value = clamp(intensita, 0, 0.85)
      mesh.position.copy(piano(o.a))
      const d = 2 * o.raggio * LARGHEZZA
      mesh.scale.set(d, d, 1)
      mesh.visible = intensita > 0.002
    },
    orbita(id, o, s) {
      const i = orbite.prendi(id)
      if (i < 0) return
      const { punti, m } = orbite.oggetti[i]
      const u = m.uniforms
      u.uColore.value.copy(colore(o.colore))
      u.uCentro.value.copy(piano(o.centro))
      u.uRaggio.value.set(o.raggio[0] * LARGHEZZA, o.raggio[1] * ALTEZZA)
      u.uN.value = Math.min(PUNTI_ORBITA, o.n)
      u.uAccese.value = s.accese
      u.uOrdine.value = clamp(s.ordine, 0, 1)
      u.uVel.value = s.velocita
      u.uAlfa.value = clamp(s.alfa, 0, 1)
      punti.visible = s.alfa > 0.002
    },
    galassia(id, o, s) {
      const i = galassie.prendi(id)
      if (i < 0) return
      const { punti, m } = galassie.oggetti[i]
      m.uniforms.uCentro.value.copy(piano(o.centro))
      m.uniforms.uRaggio.value = o.raggio * LARGHEZZA
      m.uniforms.uBracci.value = Math.max(1, Math.round(o.bracci))
      m.uniforms.uGiro.value = s.giro
      m.uniforms.uAlfa.value = clamp(s.alfa, 0, 1)
      punti.visible = s.alfa > 0.002
    },
    linea(id, o, t) {
      const i = linee.prendi(id)
      if (i < 0) return
      const { punti, m } = linee.oggetti[i]
      const u = m.uniforms
      const pp = o.punti.slice(0, NP).map((p) => piano(p))
      const cum = [0]
      for (let k = 1; k < pp.length; k++) cum.push(cum[k - 1] + pp[k].distanceTo(pp[k - 1]))
      const tot = cum[cum.length - 1] || 1
      for (let k = 0; k < NP; k++) {
        u.uP.value[k].set(pp[Math.min(k, pp.length - 1)].x, pp[Math.min(k, pp.length - 1)].y)
        u.uCum.value[k] = k < pp.length ? cum[k] / tot : 1
      }
      u.uNP.value = pp.length
      u.uColore.value.copy(colore(o.colore))
      u.uT.value = clamp(t, 0, 1)
      u.uGocce.value = o.gocce ? clamp(o.gocce / 10, 0, 1) : 0
      u.uSegni.value = o.segni ? 1 : 0
      u.uSp.value = o.spessore
      punti.visible = t > 0.001
    },

    saetta(id, o, t) {
      const i = saette.prendi(id)
      if (i < 0) return
      const sl = saette.oggetti[i]
      const seme = Math.floor(tempoStrati * 2.5) + i * 7 + id.length
      if (sl.seme !== seme) {
        sl.seme = seme
        const a = piano(o.da, 0.06), b = piano(o.a, 0.06)
        const pos = sl.g.attributes.position as BufferAttribute
        const arr = pos.array as Float32Array
        arr.fill(0)
        const dx = b.x - a.x, dy = b.y - a.y
        const len = Math.hypot(dx, dy) || 1
        const nx = -dy / len, ny = dx / len
        let prima = a.clone()
        let w = 0
        const rami = Math.min(3, o.rami ?? 2)
        for (let k = 1; k <= SEGMENTI; k++) {
          const f = k / SEGMENTI
          const scarto = (rnd(seme * 13 + k) - 0.5) * 0.16 * len * (1 - Math.abs(f - 0.5) * 0.6)
          const q = new Vector3(a.x + dx * f + nx * scarto, a.y + dy * f + ny * scarto, 0.06)
          if (k === SEGMENTI) q.copy(b)
          arr.set([prima.x, prima.y, 0.06, q.x, q.y, 0.06], w)
          w += 6
          if (k % 4 === 2 && Math.floor(k / 4) < rami) {
            const dir = rnd(seme * 7 + k) > 0.5 ? 1 : -1
            let r0 = q.clone()
            for (let j = 1; j <= 3; j++) {
              const r1 = new Vector3(r0.x + (dx / len) * 0.023 * len + nx * dir * 0.027 * len, r0.y + (dy / len) * 0.023 * len + ny * dir * 0.027 * len, 0.06)
              arr.set([r0.x, r0.y, 0.06, r1.x, r1.y, 0.06], w)
              w += 6
              r0 = r1
            }
          }
          prima = q
        }
        pos.needsUpdate = true
      }
      sl.m.opacity = clamp(t, 0, 1) * 0.95
      sl.linee.visible = t > 0.01
    },
    raggi(id, o, t) {
      const i = raggi.prendi(id)
      if (i < 0) return
      const r = raggi.oggetti[i]
      const a = piano(o.da, 0.04), b = piano(o.verso, 0.04)
      const base = Math.atan2(b.y - a.y, b.x - a.x)
      const lunga = a.distanceTo(b) * clamp(t, 0, 1)
      const attr = r.g.attributes.position as BufferAttribute
      const arr = attr.array as Float32Array
      arr.fill(0)
      const n = Math.min(24, Math.max(2, Math.round(o.n)))
      for (let k = 0; k < n; k++) {
        const ang = base + (k / (n - 1) - 0.5) * o.apertura
        const l = lunga * (0.7 + 0.3 * rnd(k * 3.1))
        arr.set([a.x, a.y, 0.04, a.x + Math.cos(ang) * l, a.y + Math.sin(ang) * l, 0.04], k * 6)
      }
      attr.needsUpdate = true
      r.m.color.setRGB(0.9, 0.97, 1)
      r.m.opacity = 0.35 * clamp(t, 0, 1)
      r.linee.visible = t > 0.01
    },
    lastra(id, o, s) {
      const i = lastre.prendi(id)
      if (i < 0) return
      const l = lastre.oggetti[i]
      const c = piano(o.a)
      const w = o.larghezza * LARGHEZZA, h = o.altezza * ALTEZZA
      l.perno.position.set(c.x - w / 2, c.y, 0.05)
      l.perno.rotation.set(s.ruota, -s.apri * 1.25, 0)
      l.mesh.scale.set(w, h, 1)
      l.m.uniforms.uColore.value.copy(colore(o.colore))
      l.m.uniforms.uAlfa.value = clamp(s.alfa, 0, 1)
      l.m.uniforms.uCalore.value = clamp(s.calore, 0, 1)
      l.perno.visible = s.alfa > 0.005
    },
    punti(id, o, s) {
      const i = mappe.prendi(id)
      if (i < 0) return
      const m = mappe.oggetti[i]
      const n = Math.min(MAX_PUNTI, o.punti.length)
      const pos = m.g.attributes.position as BufferAttribute
      const peso = m.g.attributes.aPeso as BufferAttribute
      for (let k = 0; k < n; k++) {
        pos.setXYZ(k, o.punti[k][0] * s.scala * LARGHEZZA, -o.punti[k][1] * s.scala * LARGHEZZA, 0)
        peso.setX(k, o.punti[k][2])
      }
      pos.needsUpdate = true
      peso.needsUpdate = true
      m.g.setDrawRange(0, n)
      m.punti.position.copy(piano(s.centro))
      m.punti.rotation.x = -s.inclina
      m.m.uniforms.uColore.value.copy(colore(o.colore))
      m.m.uniforms.uAccese.value = s.accese
      m.m.uniforms.uAlfa.value = clamp(s.alfa, 0, 1)
      m.punti.visible = s.alfa > 0.005
    },
    onda(id, o, t) {
      const i = anelli.prendi(id)
      if (i < 0) return
      const { mesh, m } = anelli.oggetti[i]
      m.uniforms.uColore.value.copy(colore(o.colore))
      m.uniforms.uR.value = clamp(t, 0, 1)
      m.uniforms.uAlfa.value = (1 - clamp(t, 0, 1)) * (t > 0.001 ? 0.9 : 0)
      mesh.position.copy(piano(o.a))
      const d = 2 * o.raggio * LARGHEZZA
      mesh.scale.set(d, d, 1)
      mesh.visible = t > 0.001 && t < 0.999
    },
    pulsa(id, o, t) {
      let p = pulse.get(id)
      if (!p) {
        p = { armato: true, inizio: -1e9, richiesto: false, o, t }
        pulse.set(id, p)
      }
      p.o = o
      p.t = t
      p.richiesto = true
    },
    foto(i, s) {
      esposizioni[i] = clamp(s.esposizione, 0, 1)
    },
    fuoco(a) {
      fuocoPunto = a
    },
    // l'anello delle quattro materie arriva nel compito 6, il campo di luci del finale più avanti
    anello: { nome() {}, ritorno() {}, arco() {}, giro() {}, caldo() {}, punto() {}, apri() {} },
    campo: { accese() {}, cercatore() {}, fiumi() {}, vuoto() {} },
  }

  return {
    kit,
    radice,
    inizia() {
      luci.azzera(); anelli.azzera(); getti.azzera(); orbite.azzera(); galassie.azzera(); linee.azzera(); saette.azzera(); raggi.azzera(); lastre.azzera(); mappe.azzera()
      for (const p of Array.from(pulse.values())) p.richiesto = false
      fuocoPunto = null
      esposizioni = [1, 1, 1]
    },
    fine(quadro, tempo) {
      uTempo.value = tempo
      tempoStrati = tempo
      if (!quadro) {
        radice.visible = false
        return
      }
      radice.visible = true
      if (radice.parent !== quadro) quadro.add(radice)
      // le pulsazioni: due battiti di 0,9 s che partono quando t supera 0,5 andando avanti e si riarmano quando t torna a 0
      for (const [id, p] of Array.from(pulse)) {
        if (!p.richiesto) { pulse.delete(id); continue }
        if (p.t <= 0.001) p.armato = true
        else if (p.t >= 0.5 && p.armato) { p.armato = false; p.inizio = tempo }
        const k = (tempo - p.inizio) / DURATA_PULSA
        const i = k >= 0 && k < 1 ? anelli.prendi('pulsa:' + id) : -1
        if (i >= 0) {
          const { mesh, m } = anelli.oggetti[i]
          const fase = (k * 2) % 1 // due battiti
          m.uniforms.uColore.value.copy(colore(p.o.colore))
          m.uniforms.uR.value = 0.25 + 0.75 * fase
          m.uniforms.uAlfa.value = 0.85 * (1 - fase) * Math.sin(Math.PI * k)
          mesh.position.copy(piano(p.o.a))
          const d = 2 * p.o.raggio * LARGHEZZA
          mesh.scale.set(d, d, 1)
          mesh.visible = true
        }
      }
      for (const r of [luci, anelli]) r.oggetti.forEach((o, i) => { if (!r.usati[i]) o.mesh.visible = false })
      for (const r of [getti, orbite, galassie, linee]) r.oggetti.forEach((o, i) => { if (!r.usati[i]) o.punti.visible = false })
      for (const r of [saette, raggi]) r.oggetti.forEach((o, i) => { if (!r.usati[i]) o.linee.visible = false })
      lastre.oggetti.forEach((o, i) => { if (!lastre.usati[i]) o.perno.visible = false })
      mappe.oggetti.forEach((o, i) => { if (!mappe.usati[i]) o.punti.visible = false })
      luci.chiudi(); anelli.chiudi(); getti.chiudi(); orbite.chiudi(); galassie.chiudi(); linee.chiudi(); saette.chiudi(); raggi.chiudi(); lastre.chiudi(); mappe.chiudi()
    },
    fuoco: () => fuocoPunto,
    esposizione: () => esposizioni,
    imposta(px) {
      uPx.value = px
    },
    dispose() {
      radice.removeFromParent()
      for (const e of eliminabili) e.dispose()
    },
  }
}

