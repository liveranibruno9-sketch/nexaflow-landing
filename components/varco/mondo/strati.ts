// Gli strati del Kit in Three.js (piano-costruzione-v2, compito 5): modo immediato. A ogni fotogramma `inizia` azzera i
// flag, ogni chiamata del Kit accende uno strato e ne imposta lo stato, `fine` nasconde quelli non chiamati e applica
// il quadro. Riserve fisse, nessuna allocazione nel ciclo. Tutto dipende solo da `t`: tornando indietro si riavvolge.
// Presenti: luce, getto, orbita, galassia, linea, onda, pulsa, foto, fuoco. Non ancora (arrivano coi compiti che li usano):
// saetta e raggi (Prometheus, Janus), anello (compito 6), campo (finale): oggi sono vuoti.
import { AdditiveBlending, BufferAttribute, BufferGeometry, Group, Mesh, Object3D, PlaneGeometry, Points, ShaderMaterial, Vector2, Vector3 } from 'three'
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

  /* ----- pulsa: due battiti a tempo, una volta per passaggio ----- */
  const DURATA_PULSA = 0.9
  type Pulsa = { armato: boolean; inizio: number; richiesto: boolean; o: { a: Vec2; raggio: number; colore: Colore }; t: number }
  const pulse = new Map<string, Pulsa>()

  const kit: Kit = {
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
    // Prometheus e Janus (compiti 9 e 10): per ora non disegnano nulla
    saetta() {},
    raggi() {},
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
      luci.azzera(); anelli.azzera(); getti.azzera(); orbite.azzera(); galassie.azzera(); linee.azzera()
      for (const p of Array.from(pulse.values())) p.richiesto = false
      fuocoPunto = null
      esposizioni = [1, 1, 1]
    },
    fine(quadro, tempo) {
      uTempo.value = tempo
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
      luci.chiudi(); anelli.chiudi(); getti.chiudi(); orbite.chiudi(); galassie.chiudi(); linee.chiudi()
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

