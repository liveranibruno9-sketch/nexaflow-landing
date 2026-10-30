// Calcoli puri della materia (le particelle del film): nessun accesso al DOM, si provano con `npm test`.
// Solo TypeScript "cancellabile" (Node toglie i tipi): niente enum, namespace o parametri-proprietà.
import { liscio } from './calcoli.ts'
import type { Modo } from './modo.ts'
import type { Materia } from './regia.ts'

export type Forma = 'punto' | 'scheggia' | 'segmento' | 'goccia'

/**
 * L'aspetto di ogni materia. Colori d'accento di D23. raggio in px CSS (per il segmento è la lunghezza),
 * vita in secondi, gravità in px/s² (verso il basso).
 */
export const PRESET: Record<Materia, { colore: string; colore2?: string; raggio: [number, number]; vita: [number, number]; gravita: number; forma: Forma }> = {
  // punti morbidi blu che si posano piano: vita lunga, nessuna gravità
  polvere: { colore: '#5B8CFF', raggio: [0.8, 2.2], vita: [1.4, 2.6], gravita: 0, forma: 'punto' },
  // schegge ciano angolari che si staccano e cadono un poco
  vetro: { colore: '#35E0F0', raggio: [1.6, 3.6], vita: [0.8, 1.5], gravita: 140, forma: 'scheggia' },
  // segmenti corti bianchi col filo viola, nervosi: vita breve
  saette: { colore: '#F4F1FF', colore2: '#B48CFF', raggio: [4, 10], vita: [0.15, 0.45], gravita: 0, forma: 'segmento' },
  // gocce d'argento caldo col riflesso della luce dello studio, che colano
  cromo: { colore: '#D9D4C7', colore2: '#F2C27A', raggio: [1.4, 3], vita: [0.9, 1.6], gravita: 260, forma: 'goccia' },
}

/** l'ordine delle materie (anche quello del 'ciclo' del nome in apertura) */
export const MATERIE: readonly Materia[] = ['polvere', 'vetro', 'saette', 'cromo']

/** quante particelle al massimo: nessuna col modo minimo, 400 sul telefono (larghezza ≤ 900, come modo.ts), 900 sul computer */
export function limiteParticelle(modo: Modo, larghezza: number): number {
  if (modo === 'minimo') return 0
  return larghezza <= 900 ? 400 : 900
}

/** quante lettere su n sono scritte a t ∈ [0, 1]: intero, monotona; la prima compare appena t > 0 */
export function letteraVisibile(n: number, t: number): number {
  if (!(n > 0) || !(t > 0)) return 0
  if (t >= 1) return n
  return Math.min(n, Math.max(0, Math.ceil(t * n - 1e-9)))
}

/**
 * posizione lungo una curva da p alla meta, t ∈ [0, 1] reso liscio: arco di Bézier quadratico con il punto di controllo
 * spostato di lato (la particella gira verso la meta invece di andarci dritta). La distanza dalla meta cala sempre.
 */
export function convergenza(t: number, p: [number, number], meta: [number, number]): [number, number] {
  const out: [number, number] = [0, 0]
  convergenzaIn(out, t, p[0], p[1], meta[0], meta[1])
  return out
}

/** come `convergenza`, ma scrive il risultato in `out`: nessuna allocazione nel ciclo delle particelle */
export function convergenzaIn(out: [number, number] | Float32Array, t: number, px: number, py: number, mx: number, my: number): void {
  const s = liscio(0, 1, t)
  if (s <= 0) { out[0] = px; out[1] = py; return }
  if (s >= 1) { out[0] = mx; out[1] = my; return }
  const dx = mx - px
  const dy = my - py
  const cx = (px + mx) / 2 - dy * 0.35
  const cy = (py + my) / 2 + dx * 0.35
  const a = (1 - s) * (1 - s)
  const b = 2 * (1 - s) * s
  const c = s * s
  out[0] = a * px + b * cx + c * mx
  out[1] = a * py + b * cy + c * my
}

/** la materia di una scena dal prefisso del nome (atlas-2 → polvere); studio e apertura non ne hanno */
export function materiaScena(nome: string): Materia | undefined {
  const agente = nome.split('-')[0]
  if (agente === 'atlas') return 'polvere'
  if (agente === 'janus') return 'vetro'
  if (agente === 'prometheus') return 'saette'
  if (agente === 'hermes') return 'cromo'
  return undefined
}

/**
 * il rettangolo dove sta il fotogramma 9:16 su uno schermo W x H (come lo disegna il motore):
 * sul computer la colonna intera al centro (containRect), sul telefono copre lo schermo e si tagliano i lati (coverRect).
 * In tutti e due i casi l'altezza è quella dello schermo: cambia solo se la larghezza avanza (nero) o manca (lati tagliati).
 */
export function rettangoloFotogramma(W: number, H: number): { x: number; y: number; w: number; h: number } {
  const w = (H * 9) / 16
  return { x: (W - w) / 2, y: 0, w, h: H }
}
