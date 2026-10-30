// Calcoli puri sulle lettere dei motti e sul tetto delle particelle sopra le frasi: nessun accesso al DOM, si provano con `npm test`.
// Solo TypeScript "cancellabile" (Node toglie i tipi): niente enum, namespace o parametri-proprietà.
import type { Livello } from '../varco/tipi.ts'

/** quante particelle al massimo sopra le frasi, per livello (piano-costruzione-v2): 900 computer, 400 telefono, 150 minimo */
export function limiteParticelle(livello: Livello): number {
  return { alto: 900, medio: 400, minimo: 150 }[livello]
}

/** quante lettere su n sono scritte a t ∈ [0, 1]: intero, monotona; la prima compare appena t > 0 */
export function letteraVisibile(n: number, t: number): number {
  if (!(n > 0) || !(t > 0)) return 0
  if (t >= 1) return n
  return Math.min(n, Math.max(0, Math.ceil(t * n - 1e-9)))
}
