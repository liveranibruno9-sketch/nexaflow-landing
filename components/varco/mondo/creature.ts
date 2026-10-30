// Le quattro mascotte in codice (home v2.1, brief di Bruno del 30/10 sera): non più foto ma animaletti fatti di forme morbide e di una
// pelle di materia. Atlas orso di polvere di stelle con la luna sulla schiena, Janus volpe di vetro davanti alla sua porta, Prometheus
// scoiattolo di saette con la fiamma in mano, Hermes lepre di cromo con le ali ai piedi. Nella home fluttuano, salutano, guardano il
// puntatore e si abbracciano; nelle pagine dei servizi avranno altre capacità. Niente texture né modelli da scaricare: si costruiscono
// in un attimo e anche in Node (i test). La creatura guarda verso +z; i piedi stanno a y = 0 del modello, il centro nella radice.
import { AdditiveBlending, Box3, BufferAttribute, BufferGeometry, CapsuleGeometry, ConeGeometry, CylinderGeometry, ExtrudeGeometry, Group, Mesh, MeshBasicMaterial, Object3D, PlaneGeometry, Points, ShaderMaterial, Shape, SphereGeometry, TorusGeometry, Vector2, Vector3 } from 'three'
import type { Material } from 'three'
import { mulberry32 } from '../campiona.ts'
import { ALTEZZA_CREATURA, ORDINE, PASSO_SQUADRA } from '../coreografia.ts'
import type { Mascotte, Posa } from '../coreografia.ts'
import { ALONE_FRAG, ALONE_VERT } from './shader.ts'
import { AURA_FRAG, AURA_VERT, LUCE_FRAG, PELLE_FRAG, PELLE_VERT } from './shader-creature.ts'

export type PosaCorpo = Pick<Posa, 'presenza' | 'saluto' | 'lato' | 'abbraccio' | 'abbraccioSx' | 'abbraccioDx'> & { felice?: number; sguardo?: [number, number] }

export type Creatura = {
  id: Mascotte
  /** la si mette in scena e la si sposta da fuori (posizione, scala, giro) */
  radice: Group
  /** dentro la radice: il corpo che fluttua e compare */
  corpo: Group
  /** [sinistro, destro]: i perni delle spalle (sinistro = verso x negative, il lato sinistro dello schermo) */
  braccia: [Object3D, Object3D]
  /** [sinistra, destra]: le mani, in fondo alle braccia (ci si potranno appendere oggetti nelle pagine dei servizi) */
  mani: [Object3D, Object3D]
  /** dai piedi alla cima della testa, orecchie comprese, nelle sue unità */
  altezza: number
  aggiorna(tempo: number, posa: PosaCorpo): void
}
export type Creature = Record<Mascotte, Creatura> & {
  /** le luci che le illuminano (solo le mascotte 3D): il mondo le mette nel palco */
  luci?: Group
  /** px per unità a distanza 1 (come gli altri strati), per la grandezza della polvere attorno */
  imposta(px: number): void
  dispose(): void
}

type V = [number, number, number]
type Vivo = (tempo: number, posa: PosaCorpo) => void

const v3 = (hex: number) => new Vector3(((hex >> 16) & 255) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255)
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x)
const mix = (a: number, b: number, t: number) => a + (b - a) * t

/** il braccio a riposo: dalla spalla al centro della mano */
const BRACCIO = 0.31
/**
 * L'abbraccio: il braccio passa dietro la schiena del vicino (che sta a PASSO_SQUADRA) e la mano spunta davanti alla sua spalla
 * lontana (0,3 oltre il suo centro). Il braccio si allunga quanto serve: è un cartone, dell'abbraccio si vede la mano.
 */
const AVANTI = 0.15
const LUNGO_ABBRACCIO = Math.hypot(PASSO_SQUADRA, AVANTI) / BRACCIO
const GIRO_ABBRACCIO = Math.asin(AVANTI / Math.hypot(PASSO_SQUADRA, AVANTI))

/** la pelle di ogni creatura: tipo di materia, colori del corpo, della pancia e del muso, della polvere attorno e dell'alone */
const PELLI: Record<Mascotte, { tipo: number; base: number; chiaro: number; bordo: number; scintille: number; pancia: [number, number]; aura: number; alone: number; vel: number; punti: number }> = {
  atlas: { tipo: 0, base: 0x1c2c78, chiaro: 0x6b95ff, bordo: 0x9fbfff, scintille: 0xffe0a0, pancia: [0x3d5bc0, 0xb4cbff], aura: 0xa8c4ff, alone: 0x5b8cff, vel: 0.35, punti: 170 },
  janus: { tipo: 1, base: 0x08525e, chiaro: 0x7ff0ff, bordo: 0xc2fbff, scintille: 0xffffff, pancia: [0x2a8f9c, 0xd8fdff], aura: 0x8ff3ff, alone: 0x35e0f0, vel: 0.25, punti: 90 },
  prometheus: { tipo: 2, base: 0x4b32b0, chiaro: 0xe6dcff, bordo: 0xffffff, scintille: 0xfff6ff, pancia: [0x8a6cf0, 0xffffff], aura: 0xd8c4ff, alone: 0xb48cff, vel: 0.9, punti: 130 },
  hermes: { tipo: 3, base: 0xe9e2d2, chiaro: 0xffffff, bordo: 0xfff1d6, scintille: 0xffffff, pancia: [0xfff6e6, 0xffffff], aura: 0xfff0d0, alone: 0xd9d4c7, vel: 0.3, punti: 90 },
}

/** la luna di Atlas: una falce fra due cerchi, poi estrusa con un bordo morbido */
export function falce(): ExtrudeGeometry {
  const fuori = 0.25
  const a = 2.0
  const fine = new Vector2(fuori * Math.cos(a), fuori * Math.sin(a))
  const c = -0.16
  const dentro = Math.hypot(fine.x - c, fine.y)
  const b = Math.atan2(fine.y, fine.x - c)
  const punti: Vector2[] = []
  for (let i = 0; i <= 24; i++) {
    const t = -a + (2 * a * i) / 24
    punti.push(new Vector2(fuori * Math.cos(t), fuori * Math.sin(t)))
  }
  for (let i = 1; i < 24; i++) {
    const t = b - (2 * b * i) / 24
    punti.push(new Vector2(c + dentro * Math.cos(t), dentro * Math.sin(t)))
  }
  const g = new ExtrudeGeometry(new Shape(punti), { depth: 0.05, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.025, bevelSegments: 3, curveSegments: 4 })
  g.translate(0, 0, -0.025)
  return g
}

export function creaCreature(): Creature {
  const geometrie: BufferGeometry[] = []
  const materiali: Material[] = []
  const tieni = <T extends BufferGeometry>(g: T) => (geometrie.push(g), g)
  const usa = <T extends Material>(m: T) => (materiali.push(m), m)
  const uTempo = { value: 0 }
  const uPx = { value: 1 }

  const G = {
    sfera: tieni(new SphereGeometry(1, 32, 22)),
    pallina: tieni(new SphereGeometry(1, 14, 10)),
    cono: tieni(new ConeGeometry(1, 1, 24)),
    braccio: tieni(new CapsuleGeometry(0.072, 0.2, 6, 14).translate(0, -0.13, 0)),
    piano: tieni(new PlaneGeometry(1, 1)),
    falce: tieni(falce()),
    arco: tieni(new TorusGeometry(0.66, 0.028, 8, 48, Math.PI)),
    stipite: tieni(new CylinderGeometry(0.028, 0.028, 1.12, 8)),
  }
  const occhio = usa(new MeshBasicMaterial({ color: 0x070914 }))
  const lucciola = usa(new MeshBasicMaterial({ color: 0xffffff }))
  const guancia = usa(new MeshBasicMaterial({ color: 0xff8fb8, transparent: true, opacity: 0.38, depthWrite: false }))
  const nasoRosa = usa(new MeshBasicMaterial({ color: 0xd46a8c }))
  const pelle = (tipo: number, base: number, chiaro: number, bordo: number, scintille: number) =>
    usa(new ShaderMaterial({
      vertexShader: PELLE_VERT, fragmentShader: PELLE_FRAG,
      uniforms: { uBase: { value: v3(base) }, uChiaro: { value: v3(chiaro) }, uBordo: { value: v3(bordo) }, uScintille: { value: v3(scintille) }, uTipo: { value: tipo }, uTempo },
    }))
  const luce = (colore: number, cuore: number, trema = 0) =>
    usa(new ShaderMaterial({ vertexShader: PELLE_VERT, fragmentShader: LUCE_FRAG, uniforms: { uColore: { value: v3(colore) }, uCuore: { value: v3(cuore) }, uTempo, uTrema: { value: trema } } }))

  const pezzo = (padre: Object3D, geo: BufferGeometry, mat: Material, p: V, s: V | number, r?: V): Mesh => {
    const m = new Mesh(geo, mat)
    m.position.set(p[0], p[1], p[2])
    if (typeof s === 'number') m.scale.setScalar(s)
    else m.scale.set(s[0], s[1], s[2])
    if (r) m.rotation.set(r[0], r[1], r[2])
    padre.add(m)
    return m
  }

  function costruisci(id: Mascotte, indice: number): Creatura {
    const P = PELLI[id]
    const corpoM = pelle(P.tipo, P.base, P.chiaro, P.bordo, P.scintille)
    const panciaM = pelle(P.tipo, P.pancia[0], P.pancia[1], P.bordo, P.scintille)
    const fase = indice * 1.9 + 0.4
    const vivi: Vivo[] = []

    const radice = new Group()
    const corpo = new Group()
    const modello = new Group()
    radice.add(corpo)
    corpo.add(modello)

    // il corpo: pancia, piedi, testa con occhi grandi, guance; le orecchie e il muso cambiano da animale ad animale
    pezzo(modello, G.sfera, corpoM, [0, 0.5, 0], [0.34, 0.42, 0.31])
    pezzo(modello, G.sfera, panciaM, [0, 0.46, 0.17], [0.24, 0.29, 0.16])
    for (const x of [-0.15, 0.15]) pezzo(modello, G.sfera, corpoM, [x, 0.07, 0.06], id === 'hermes' ? [0.11, 0.07, 0.19] : [0.12, 0.08, 0.15])
    const testa = new Group()
    testa.position.set(0, 1.06, 0.02)
    modello.add(testa)
    const misuraTesta: V = id === 'atlas' || id === 'janus' ? [0.4, 0.365, 0.36] : [0.38, 0.35, 0.35]
    pezzo(testa, G.sfera, corpoM, [0, 0, 0], misuraTesta)
    const occhi: Object3D[] = []
    for (const x of [-0.135, 0.135]) {
      const o = new Group()
      o.position.set(x, 0.035, misuraTesta[2] * 0.85)
      testa.add(o)
      pezzo(o, G.pallina, occhio, [0, 0, 0], [0.068, 0.078, 0.05])
      pezzo(o, G.pallina, lucciola, [0.022, 0.03, 0.04], 0.022)
      occhi.push(o)
    }
    for (const x of [-0.215, 0.215]) pezzo(testa, G.pallina, guancia, [x, -0.075, misuraTesta[2] * 0.72], [0.06, 0.032, 0.02])

    // le braccia: un perno alla spalla, il braccio pende lungo -y, la mano in fondo
    const arti = [-1, 1].map((lato) => {
      const perno = new Group()
      perno.position.set(lato * 0.3, 0.74, 0.02)
      modello.add(perno)
      const braccio = pezzo(perno, G.braccio, corpoM, [0, 0, 0], 1)
      const mano = new Group()
      mano.position.set(0, -BRACCIO, 0.01)
      perno.add(mano)
      pezzo(mano, G.pallina, panciaM, [0, 0, 0], 0.08)
      return { perno, braccio, mano }
    })
    const braccia = arti.map((a) => a.perno) as [Group, Group]
    const mani = arti.map((a) => a.mano) as [Group, Group]

    if (id === 'atlas') {
      // orso: orecchie tonde, muso corto, coda a pallina
      for (const x of [-0.25, 0.25]) {
        pezzo(testa, G.sfera, corpoM, [x, 0.27, -0.04], [0.115, 0.115, 0.075])
        pezzo(testa, G.sfera, panciaM, [x, 0.27, 0.0], [0.066, 0.066, 0.045])
      }
      pezzo(testa, G.sfera, panciaM, [0, -0.11, 0.28], [0.15, 0.105, 0.11])
      pezzo(testa, G.pallina, occhio, [0, -0.065, 0.385], [0.052, 0.036, 0.035])
    } else if (id === 'janus') {
      // volpe: orecchie a punta, muso lungo, guance bianche
      for (const x of [-0.2, 0.2]) {
        const r: V = [0, 0, -Math.sign(x) * 0.3]
        pezzo(testa, G.cono, corpoM, [x, 0.33, -0.03], [0.11, 0.3, 0.075], r)
        pezzo(testa, G.cono, panciaM, [x, 0.31, 0.01], [0.06, 0.19, 0.03], r)
        pezzo(testa, G.sfera, panciaM, [x, -0.1, 0.24], [0.11, 0.08, 0.08])
      }
      pezzo(testa, G.cono, panciaM, [0, -0.1, 0.31], [0.13, 0.26, 0.1], [Math.PI / 2, 0, 0])
      pezzo(testa, G.pallina, occhio, [0, -0.1, 0.445], 0.036)
    } else if (id === 'prometheus') {
      // scoiattolo: orecchie piccole con il ciuffo di saetta, guance gonfie
      const ciuffo = luce(0xb48cff, 0xffffff, 0.6)
      for (const x of [-0.19, 0.19]) {
        pezzo(testa, G.cono, corpoM, [x, 0.3, -0.02], [0.085, 0.2, 0.06], [0, 0, -Math.sign(x) * 0.2])
        pezzo(testa, G.cono, ciuffo, [x * 1.06, 0.43, -0.02], [0.04, 0.14, 0.03], [0, 0, -Math.sign(x) * 0.35])
        pezzo(testa, G.sfera, panciaM, [x * 0.9, -0.11, 0.22], [0.1, 0.075, 0.08])
      }
      pezzo(testa, G.sfera, panciaM, [0, -0.1, 0.27], [0.11, 0.08, 0.09])
      pezzo(testa, G.pallina, occhio, [0, -0.07, 0.355], [0.04, 0.03, 0.03])
    } else {
      // lepre: orecchie lunghe che ondeggiano, dentini, coda di cotone
      const orecchie = [-0.12, 0.12].map((x) => {
        const o = new Group()
        o.position.set(x, 0.26, -0.04)
        testa.add(o)
        pezzo(o, G.sfera, corpoM, [0, 0.26, 0], [0.075, 0.28, 0.05])
        pezzo(o, G.sfera, panciaM, [0, 0.26, 0.03], [0.04, 0.2, 0.025])
        return o
      })
      vivi.push((t) => {
        orecchie.forEach((o, k) => {
          const lato = k === 0 ? -1 : 1
          o.rotation.z = -lato * (0.12 + 0.07 * Math.sin(t * 2.1 + k))
          o.rotation.x = -0.12 + 0.05 * Math.sin(t * 1.7 + k * 2)
        })
      })
      pezzo(testa, G.sfera, panciaM, [0, -0.1, 0.28], [0.11, 0.08, 0.09])
      pezzo(testa, G.pallina, nasoRosa, [0, -0.07, 0.365], [0.038, 0.028, 0.028])
      pezzo(testa, G.pallina, lucciola, [0, -0.185, 0.335], [0.032, 0.035, 0.012])
    }

    // l'altezza si misura qui: corpo, testa e orecchie (la coda e gli oggetti della materia stanno dietro o accanto)
    const box = new Box3().setFromObject(modello)
    const altezza = box.max.y - Math.min(0, box.min.y)
    modello.position.y = -ALTEZZA_CREATURA / 2

    if (id === 'atlas') {
      pezzo(modello, G.pallina, panciaM, [0, 0.3, -0.29], 0.075)
      // la luna sulla schiena: spunta da dietro la spalla destra, con due stelline
      const oro = luce(0xffc56b, 0xfff4d6)
      const luna = pezzo(modello, G.falce, oro, [0.3, 1.32, -0.34], 1.25, [0, 0, -0.35])
      const stelle = [pezzo(modello, G.pallina, oro, [-0.38, 1.47, -0.3], 0.03), pezzo(modello, G.pallina, oro, [0.56, 0.98, -0.36], 0.022)]
      vivi.push((t) => {
        luna.rotation.z = -0.35 + 0.06 * Math.sin(t * 0.8)
        stelle.forEach((s, k) => s.scale.setScalar((k ? 0.022 : 0.03) * (0.7 + 0.5 * Math.max(0, Math.sin(t * 2.3 + k * 2.1)))))
      })
    } else if (id === 'janus') {
      // la coda folta con la punta chiara; la porta ad arco dietro di lui
      const coda = new Group()
      coda.position.set(0.12, 0.22, -0.22)
      modello.add(coda)
      pezzo(coda, G.sfera, corpoM, [0.1, 0.04, -0.04], 0.12)
      pezzo(coda, G.sfera, corpoM, [0.24, 0.2, -0.08], 0.16)
      pezzo(coda, G.sfera, corpoM, [0.32, 0.42, -0.1], 0.15)
      pezzo(coda, G.sfera, panciaM, [0.34, 0.62, -0.08], 0.11)
      const ciano = luce(0x35e0f0, 0xd6fdff)
      const porta = new Group()
      porta.position.set(0, 0, -0.55)
      modello.add(porta)
      pezzo(porta, G.arco, ciano, [0, 1.12, 0], 1)
      for (const x of [-0.66, 0.66]) pezzo(porta, G.stipite, ciano, [x, 0.56, 0], 1)
      vivi.push((t) => {
        coda.rotation.z = 0.12 * Math.sin(t * 2.4 + fase)
        coda.rotation.y = 0.15 * Math.sin(t * 1.6 + fase)
      })
    } else if (id === 'prometheus') {
      // la coda a esse che sale dietro la testa; la fiamma nella mano sinistra, sempre dritta
      const coda = new Group()
      coda.position.set(0, 0.22, -0.24)
      modello.add(coda)
      const pal: [V, number][] = [[[0, 0.05, -0.05], 0.12], [[0.12, 0.25, -0.14], 0.16], [[0.2, 0.52, -0.18], 0.19], [[0.17, 0.82, -0.16], 0.18], [[0.05, 1.02, -0.12], 0.14]]
      for (const [p, r] of pal) pezzo(coda, G.sfera, corpoM, p, r)
      pezzo(coda, G.sfera, panciaM, [-0.06, 1.12, -0.08], 0.1)
      const fiamma = new Group()
      fiamma.position.set(0, -0.05, 0.04)
      mani[0].add(fiamma)
      const fuoco = luce(0xff8a3d, 0xfff2c4, 1)
      const cuore = luce(0xfff6e0, 0xffffff, 1)
      const lingua = pezzo(fiamma, G.pallina, fuoco, [0, 0.1, 0], [0.075, 0.14, 0.075])
      pezzo(fiamma, G.pallina, cuore, [0, 0.07, 0.02], [0.04, 0.08, 0.04])
      vivi.push((t) => {
        coda.rotation.z = 0.08 * Math.sin(t * 1.9 + fase)
        fiamma.rotation.z = -braccia[0].rotation.z
        lingua.scale.set(0.075 * (1 + 0.08 * Math.sin(t * 13)), 0.14 * (1 + 0.15 * Math.sin(t * 9 + 1)), 0.075)
      })
    } else {
      pezzo(modello, G.sfera, panciaM, [0, 0.28, -0.3], 0.1)
      // le ali ai piedi: tre piume per piede, a ventaglio, che battono
      const piuma = luce(0xfff4dc, 0xffffff)
      const ali = [-1, 1].map((lato) => {
        const ala = new Group()
        ala.position.set(lato * 0.2, 0.1, -0.04)
        modello.add(ala)
        for (let k = 0; k < 3; k++) {
          const perno = new Group()
          perno.rotation.z = lato * (0.25 + 0.38 * k)
          ala.add(perno)
          pezzo(perno, G.pallina, piuma, [lato * 0.1, 0, 0], [0.11 - 0.015 * k, 0.026, 0.018])
        }
        return ala
      })
      vivi.push((t) => ali.forEach((a, k) => (a.rotation.y = (k ? 1 : -1) * (0.25 + 0.35 * Math.sin(t * 7 + k)))))
    }

    // l'alone della sua materia dietro, e la polvere che le gira intorno
    const alone = new Mesh(G.piano, usa(new ShaderMaterial({ vertexShader: ALONE_VERT, fragmentShader: ALONE_FRAG, uniforms: { uColore: { value: v3(P.alone) }, uAlfa: { value: 0.24 } }, transparent: true, depthWrite: false, blending: AdditiveBlending })))
    alone.position.set(0, 0.78, -0.75)
    alone.scale.set(2.6, 2.9, 1)
    modello.add(alone)
    const caso = mulberry32(11 + indice * 97)
    const datiAura = new Float32Array(P.punti * 4).map(() => caso())
    const geoAura = tieni(new BufferGeometry())
    geoAura.setAttribute('position', new BufferAttribute(new Float32Array(P.punti * 3), 3))
    geoAura.setAttribute('aCaso', new BufferAttribute(datiAura, 4))
    const aura = new Points(geoAura, usa(new ShaderMaterial({
      vertexShader: AURA_VERT, fragmentShader: AURA_FRAG,
      uniforms: { uTempo, uPx, uVel: { value: P.vel }, uColore: { value: v3(P.aura) }, uAlfa: { value: 0.9 } },
      transparent: true, depthWrite: false, blending: AdditiveBlending,
    })))
    aura.frustumCulled = false
    modello.add(aura)

    return {
      id, radice, corpo, braccia, mani, altezza,
      aggiorna(tempo, posa) {
        const pres = posa.presenza
        corpo.visible = pres > 0.001
        corpo.scale.setScalar(Math.max(pres, 1e-4))
        if (!corpo.visible) return
        uTempo.value = tempo
        // fluttua e dondola anche da fermo
        corpo.position.y = 0.05 * Math.sin(tempo * 1.7 + fase) + 0.02 * Math.sin(tempo * 0.9 + fase * 2)
        corpo.rotation.z = 0.035 * Math.sin(tempo * 1.1 + fase)
        corpo.rotation.x = 0.02 * Math.sin(tempo * 1.3 + fase)
        // la testa segue il puntatore (o guarda chi la guarda), con un po' di vita sua
        const [gx, gy] = posa.sguardo ?? [0, 0]
        testa.rotation.y = 0.45 * gx + 0.08 * Math.sin(tempo * 0.6 + fase)
        testa.rotation.x = 0.22 * gy + 0.03 * Math.sin(tempo * 0.8 + fase)
        testa.rotation.z = 0.05 * Math.sin(tempo * 0.7 + fase * 1.3)
        // gli occhi battono ogni tanto; felici, si socchiudono
        const ciclo = (tempo + fase * 3) % 3.7
        const batte = ciclo < 0.14 ? Math.sin((ciclo / 0.14) * Math.PI) : 0
        const sy = Math.max(0.08, (1 - 0.92 * batte) * (1 - 0.6 * (posa.felice ?? 0)))
        for (const o of occhi) o.scale.y = sy
        // le braccia: a riposo dondolano; il saluto alza la mano sopra la spalla e la fa oscillare; nell'abbraccio ogni braccio passa
        // dietro la schiena del vicino e la mano spunta sulla sua spalla lontana, come nelle foto fra amici
        const s = clamp01(posa.saluto)
        const h = clamp01(posa.abbraccio)
        arti.forEach((a, k) => {
          const lato = k === 0 ? -1 : 1
          const saluta = (posa.lato === 'destro') === (lato === 1)
          const abbraccia = lato === -1 ? posa.abbraccioSx : posa.abbraccioDx
          let z = lato * (0.2 + 0.06 * Math.sin(tempo * 1.4 + fase + k))
          let y = 0
          let lungo = 1
          if (saluta) z = mix(z, lato * (2.55 + 0.35 * Math.sin(tempo * 9 + fase)), s)
          if (abbraccia) {
            z = mix(z, lato * (Math.PI / 2 + 0.04), h)
            y = -lato * GIRO_ABBRACCIO * h
            lungo = mix(1, LUNGO_ABBRACCIO, h)
          }
          a.perno.rotation.set(0, y, z)
          a.braccio.scale.y = lungo
          a.mano.position.y = -BRACCIO * lungo
        })
        for (const v of vivi) v(tempo, posa)
      },
    }
  }

  const tutte = Object.fromEntries(ORDINE.map((id, i) => [id, costruisci(id, i)])) as Record<Mascotte, Creatura>
  return {
    ...tutte,
    imposta(px) {
      uPx.value = px
    },
    dispose() {
      for (const id of ORDINE) tutte[id].radice.removeFromParent()
      for (const g of geometrie) g.dispose()
      for (const m of materiali) m.dispose()
    },
  }
}
