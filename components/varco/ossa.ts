// Le pose delle ossa delle mascotte 3D (home v2.2, D45): dove puntano braccia e avambracci, come gira la testa, quanto saltella.
// Direzioni nello spazio del modello: la mascotte guarda verso +z, x verso la destra dello schermo, y in alto. Indice 0 = braccio a
// sinistra dello schermo, 1 = a destra. Funzione pura: si prova con `npm test`; il mondo la applica allo scheletro (mascotte-glb.ts).
import type { Lato } from './coreografia.ts'

export type V3 = [number, number, number]
/** I gesti delle pagine dei servizi (spec pagine §8.6): ognuno è una funzione di t (0..1, tempo di gioco) sulle direzioni delle ossa */
export type NomeGesto = 'prendi' | 'solleva' | 'modella' | 'presenta' | 'lancia' | 'salta'
/** `lato` = il braccio che agisce (dove serve); `tieni` = il gesto resta alla posa piena invece di tornare a riposo (solleva) */
export type Gesto = { nome: NomeGesto; t: number; lato: Lato; tieni?: boolean }
export type PosaOssa = {
  presenza: number; saluto: number; lato: Lato; abbraccio: number; abbraccioSx: boolean; abbraccioDx: boolean
  gesto?: Gesto
  felice?: number; sguardo?: [number, number]
  /** D50: il braccio dal lato `lato` indica verso il centro (il pulsante del finale) */
  indica?: number
}
export type Mire = {
  braccio: [V3, V3]
  avambraccio: [V3, V3]
  /** radianti: giro (verso destra dello schermo), su (in basso se positivo), inclina (rollio) */
  testa: { giro: number; su: number; inclina: number }
  /** il saltello del saluto, in altezze della mascotte */
  salto: number
  /** i gesti: spostamento del corpo in altezze (su), rollio in avanti in radianti (avanti); assente = nessun gesto */
  corpo?: { su: number; avanti: number }
}

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x)
const norm = (v: V3): V3 => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1
  return [v[0] / l, v[1] / l, v[2] / l]
}
const verso = (a: V3, b: V3, t: number): V3 => norm([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t])

/** il saluto: una mano veloce (circa 2 battiti al secondo) che oscilla dal gomito, col braccio alto e un po' in avanti */
const BATTITO = 13


const fase = (t: number, a: number, b: number) => clamp01((t - a) / (b - a))
const lis = (x: number) => x * x * (3 - 2 * x)

/** direzioni di braccio e avambraccio per il gesto `g` sul lato L (-1 sinistra dello schermo, +1 destra), partendo da quelle correnti */
function gestoBraccio(g: Gesto, L: -1 | 1, b: V3, a: V3): { b: V3; a: V3; corpo?: { su: number; avanti: number } } {
  const t = clamp01(g.t)
  const agisce = (g.lato === 'destro' ? 1 : -1) === L
  const k = g.nome
  if (k === 'prendi') {
    if (!agisce) return { b, a, corpo: undefined }
    // riposo → verso l'alto e in fuori (la scintilla arriva) → al petto → riposo
    const arriva = lis(fase(t, 0, 0.32))
    const petto = lis(fase(t, 0.42, 0.72))
    const torna = lis(fase(t, 0.82, 1))
    let nb = verso(b, [L * 0.78, 0.55, 0.28], arriva)
    let na = verso(a, [L * 0.92, 0.42, 0.22], arriva)
    nb = verso(nb, [L * 0.22, -0.5, 0.6], petto)
    na = verso(na, [-L * 0.4, 0.22, 0.88], petto)
    nb = verso(nb, b, torna)
    na = verso(na, a, torna)
    return { b: nb, a: na, corpo: { su: 0.012 * Math.sin(Math.PI * t), avanti: 0.05 * Math.sin(Math.PI * fase(t, 0.3, 0.8)) } }
  }
  if (k === 'solleva') {
    // tutte e due le braccia in alto, come il cielo del mito; con `tieni` restano su
    const su = lis(fase(t, 0, 0.42)) * (g.tieni ? 1 : 1 - lis(fase(t, 0.75, 1)))
    return {
      b: verso(b, [L * 0.28, 0.95, 0.12], su),
      a: verso(a, [L * 0.04, 1, 0.05], su),
      corpo: { su: 0.03 * su + 0.012 * Math.sin(t * 9) * su, avanti: -0.04 * su },
    }
  }
  if (k === 'modella') {
    // due zampe in avanti che plasmano una lastra
    const e = lis(fase(t, 0, 0.18)) * (1 - lis(fase(t, 0.82, 1)))
    return {
      b: verso(b, [L * 0.42, -0.55, 0.58], e),
      a: verso(a, [L * (0.1 + 0.14 * Math.sin(t * 12 + L)), 0.1 + 0.22 * Math.sin(t * 9.5), 0.95], e),
      corpo: { su: 0, avanti: 0.06 * e },
    }
  }
  if (k === 'presenta') {
    // il braccio si apre di lato: «prego»
    if (!agisce) return { b, a }
    const e = lis(fase(t, 0, 0.3)) * (1 - lis(fase(t, 0.78, 1)))
    return { b: verso(b, [L * 0.96, 0.06, 0.28], e), a: verso(a, [L * 1, 0.2 + 0.05 * Math.sin(t * 10), 0.18], e) }
  }
  if (k === 'lancia') {
    if (!agisce) return { b, a }
    const carica = lis(fase(t, 0, 0.38))
    const scatta = lis(fase(t, 0.38, 0.5))
    const segue = lis(fase(t, 0.62, 1))
    let nb = verso(b, [L * 0.55, 0.76, -0.55], carica)
    let na = verso(a, [L * 0.38, 0.92, -0.72], carica)
    nb = verso(nb, [L * 0.18, 0.28, 0.95], scatta)
    na = verso(na, [L * 0.04, 0.1, 1], scatta)
    nb = verso(nb, b, segue)
    na = verso(na, a, segue)
    return { b: nb, a: na, corpo: { su: 0, avanti: -0.1 * carica * (1 - scatta) + 0.14 * scatta * (1 - segue) } }
  }
  // salta: si accuccia, scatta, plana con le braccia aperte, atterra
  const giu = lis(fase(t, 0, 0.22)) * (1 - lis(fase(t, 0.22, 0.32)))
  const volo = lis(fase(t, 0.22, 0.4)) * (1 - lis(fase(t, 0.72, 0.95)))
  let nb = verso(b, [L * 0.5, -0.7, -0.5], giu)
  let na = verso(a, [L * 0.4, -0.8, -0.4], giu)
  nb = verso(nb, [L * 0.95, 0.18, -0.12], volo)
  na = verso(na, [L, 0.1, -0.1], volo)
  return { b: nb, a: na, corpo: { su: -0.1 * giu + 0.34 * Math.sin(Math.PI * fase(t, 0.24, 0.8)), avanti: 0.38 * volo } }
}

export function mire(p: PosaOssa, tempo: number, fase: number): Mire {
  const s = clamp01(p.saluto)
  const h = clamp01(p.abbraccio)
  const latoSaluto = p.lato === 'destro' ? 1 : -1
  const braccio: V3[] = []
  const avambraccio: V3[] = []
  let corpo: { su: number; avanti: number } | undefined
  for (const L of [-1, 1] as const) {
    const k = L === -1 ? 0 : 1
    const saluta = latoSaluto === L
    const abbraccia = L === -1 ? p.abbraccioSx : p.abbraccioDx
    // a riposo le braccia pendono appena aperte e dondolano; l'avambraccio un po' in avanti, come chi sta tranquillo
    let b: V3 = norm([L * 0.34, -0.94, 0.06 + 0.05 * Math.sin(tempo * 1.4 + fase + k)])
    let a: V3 = norm([L * 0.18, -0.92, 0.3])
    if (saluta && s > 0) {
      b = verso(b, [L * 0.55, 0.78, 0.3], s)
      a = verso(a, [L * 0.08 + 0.62 * Math.sin(tempo * BATTITO + fase), 0.8, 0.32], s)
    }
    // indicare: il braccio dal lato `lato` si alza verso il centro, l'avambraccio teso come un dito puntato
    const ind = clamp01(p.indica ?? 0)
    if (ind > 0 && latoSaluto === L) {
      b = verso(b, [L * 0.9, 0.28, 0.32], ind)
      a = verso(a, [L * 0.95, 0.12, 0.28], ind)
    }
    // l'abbraccio: il braccio va verso il vicino passandogli dietro la schiena, l'avambraccio gira in avanti sulla sua spalla
    if (abbraccia && h > 0) {
      b = verso(b, [L * 0.9, 0.18, -0.4], h)
      a = verso(a, [L * 0.68, 0.06, 0.73], h)
    }
    if (p.gesto) {
      const r = gestoBraccio(p.gesto, L, b, a)
      b = r.b
      a = r.a
      if (r.corpo) corpo = r.corpo
    }
    braccio.push(b)
    avambraccio.push(a)
  }
  const [gx, gy] = p.sguardo ?? [0, 0]
  return {
    braccio: braccio as [V3, V3],
    avambraccio: avambraccio as [V3, V3],
    testa: {
      giro: 0.5 * gx + 0.08 * Math.sin(tempo * 0.6 + fase) + 0.12 * s * latoSaluto,
      su: 0.25 * gy + 0.04 * Math.sin(tempo * 0.8 + fase) - 0.08 * (p.felice ?? 0),
      // salutando piega la testa verso la mano, felici la piegano verso il vicino
      inclina: 0.05 * Math.sin(tempo * 0.7 + fase * 1.3) - 0.16 * s * latoSaluto,
    },
    salto: 0.045 * s * Math.abs(Math.sin(tempo * (BATTITO / 2) + fase)),
    ...(corpo ? { corpo } : {}),
  }
}
