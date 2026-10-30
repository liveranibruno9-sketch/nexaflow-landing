// Il nome dell'apertura (home v2.4, D47): «Agenti Studio» si compone allo scroll una lettera alla volta, ogni lettera fatta dalle
// scaglie del vortice che le volano dentro; poi i servizi in breve; poi la consegna: il nome torna nel vortice, il vortice si apre
// in quattro correnti, una per materia, che escono dallo schermo (il resto lo fanno gli agenti). Funzioni pure: `npm test`.

/** in schermate dall'inizio dell'apertura */
export const APERTURA = {
  /** le lettere arrivano fra questi due punti dello scroll */
  nome: [0.05, 0.85] as const,
  /** il nome torna nel vortice */
  scioglie: [1.35, 1.6] as const,
  /** il vortice si apre in quattro correnti che escono dallo schermo */
  consegna: [1.5, 2.2] as const,
}
/** quanto dura il volo di una lettera, in frazione del tratto del nome (le lettere si accavallano un po') */
const VOLO = 0.2

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x)
const liscia = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}

/** per ogni lettera, 0 = ancora nel vortice, 1 = arrivata al suo posto (spazi esclusi: n = lettere vere) */
export function voloLettere(u: number, n: number): number[] {
  const x = clamp01((u - APERTURA.nome[0]) / (APERTURA.nome[1] - APERTURA.nome[0]))
  const torna = liscia(APERTURA.scioglie[0], APERTURA.scioglie[1], u)
  return Array.from({ length: n }, (_, i) => {
    const parte = n > 1 ? (i / (n - 1)) * (1 - VOLO) : 0
    const p = (x - parte) / VOLO
    return (p > 1 - 1e-9 ? 1 : clamp01(p)) * (1 - torna)
  })
}

/** quanto si vede la lettera HTML: compare quando le scaglie sono quasi arrivate, si spegne quando tornano nel vortice */
export const lucelettera = (volo: number) => liscia(0.72, 1, volo)

/** la consegna: 0 = vortice intero, 1 = le quattro correnti sono uscite dallo schermo */
export const consegna = (u: number) => liscia(APERTURA.consegna[0], APERTURA.consegna[1], u)
