// La regia dell'apertura (home v2.4, D47). Il vortice di scaglie, le lettere che si compongono e la consegna in quattro correnti
// li muove il mondo da u (scaglie.ts, nome.ts); la regia accompagna con la luce: il cuore del vortice si scalda mentre arrivano le
// lettere, un alone blu sotto i servizi, una luce calda vicino al riquadro, il filo di `Scorri`. Funzione pura (R18).
import type { Regia } from '../kit.ts'
import type { Vec2 } from '../tipi.ts'

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x)
const liscia = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}

/** il centro del vortice nel quadro virtuale */
const CENTRO: Vec2 = [0.5, 0.5]

export const apertura: Regia = (t, f, k) => {
  // «Agenti Studio»: il cuore del vortice si scalda mentre le lettere arrivano, si abbassa quando il nome torna nel vortice
  k.luce('cuore', { a: CENTRO, raggio: 0.35, colore: 'luce' }, 0.3 * liscia(0, 0.35, t.nome) * (1 - 0.7 * liscia(0.6, 0.75, t.nome)))
  // i servizi in breve sotto il nome: un alone blu
  k.luce('servizi', { a: [0.5, 0.64], raggio: 0.4, colore: 'blu' }, 0.18 * liscia(0, 0.3, t.servizi) * (1 - 0.8 * liscia(0.8, 1, t.servizi)))
  // il riquadro nell'angolo: una luce calda bassa accanto
  k.luce('riquadro', { a: [0.12, 0.92], raggio: 0.3, colore: 'luce' }, 0.12 * liscia(0, 0.15, t.luogo) * (1 - 0.8 * liscia(0.85, 1, t.luogo)))
  // «Scorri»: un filo di particelle scende dal vortice verso la scritta, finché non si scorre
  k.getto('filo', { da: [0.5, 0.9], verso: [0.5, 1.2], colore: 'blu', n: 40 * (1 - t.scorri), ampiezza: 0.1 }, 0.5)
}
