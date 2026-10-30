// Le pose delle ossa delle mascotte 3D (home v2.2, D45): dove puntano braccia e avambracci, come gira la testa, quanto saltella.
// Direzioni nello spazio del modello: la mascotte guarda verso +z, x verso la destra dello schermo, y in alto. Indice 0 = braccio a
// sinistra dello schermo, 1 = a destra. Funzione pura: si prova con `npm test`; il mondo la applica allo scheletro (mascotte-glb.ts).
import type { Lato } from './coreografia.ts'

export type V3 = [number, number, number]
export type PosaOssa = {
  presenza: number; saluto: number; lato: Lato; abbraccio: number; abbraccioSx: boolean; abbraccioDx: boolean
  felice?: number; sguardo?: [number, number]
}
export type Mire = {
  braccio: [V3, V3]
  avambraccio: [V3, V3]
  /** radianti: giro (verso destra dello schermo), su (in basso se positivo), inclina (rollio) */
  testa: { giro: number; su: number; inclina: number }
  /** il saltello del saluto, in altezze della mascotte */
  salto: number
}

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x)
const norm = (v: V3): V3 => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1
  return [v[0] / l, v[1] / l, v[2] / l]
}
const verso = (a: V3, b: V3, t: number): V3 => norm([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t])

/** il saluto: una mano veloce (circa 2 battiti al secondo) che oscilla dal gomito, col braccio alto e un po' in avanti */
const BATTITO = 13

export function mire(p: PosaOssa, tempo: number, fase: number): Mire {
  const s = clamp01(p.saluto)
  const h = clamp01(p.abbraccio)
  const latoSaluto = p.lato === 'destro' ? 1 : -1
  const braccio: V3[] = []
  const avambraccio: V3[] = []
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
    // l'abbraccio: il braccio va verso il vicino passandogli dietro la schiena, l'avambraccio gira in avanti sulla sua spalla
    if (abbraccia && h > 0) {
      b = verso(b, [L * 0.9, 0.18, -0.4], h)
      a = verso(a, [L * 0.68, 0.06, 0.73], h)
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
  }
}
