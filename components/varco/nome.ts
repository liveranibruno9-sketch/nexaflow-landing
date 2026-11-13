// Il nome dell'apertura (home v2.5, 13/11/2026, brief di Bruno: «il vortice e il nome dell'agenzia con i servizi compaiano appena si
// apre, non legati allo scroll»). «Agenti Studio» si compone DA SOLO, a tempo, una lettera alla volta, ogni lettera fatta dalle scaglie
// del vortice che le volano dentro; subito dopo i servizi in breve. Poi, con lo scroll: il nome torna nel vortice, nel cerchio compare
// l'invito, il vortice si apre in quattro correnti, una per materia, che escono dallo schermo. Funzioni pure: `npm test`.

export const APERTURA = {
  /** l'ingresso a tempo: le lettere arrivano fra questi due istanti, in SECONDI dalla nascita del vortice (non dipende dallo scroll) */
  ingresso: [0.5, 1.9] as const,
  /** da qui in giù, schermate dall'inizio dell'apertura. Il nome torna nel vortice */
  scioglie: [0.3, 0.55] as const,
  /** il vortice si apre in quattro correnti che escono dallo schermo (prima, nel cerchio, c'è l'invito) */
  consegna: [1.3, 2.0] as const,
  /** D50: con «Noi.» (soglia, battuta 2) le correnti rientrano a metà dagli angoli e riescono portandosi via le parole del resto */
  spazzata: [4.3, 4.9] as const,
}
/** quanto dura il volo di una lettera, in frazione del tratto del nome (le lettere si accavallano un po') */
const VOLO = 0.2

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x)
const liscia = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}

/** quanto è avanti l'ingresso del nome, 0..1, dai secondi passati dalla nascita del vortice (negativi = non ancora nato) */
export const ingressoNome = (secondi: number) => clamp01((secondi - APERTURA.ingresso[0]) / (APERTURA.ingresso[1] - APERTURA.ingresso[0]))

/**
 * Per ogni lettera, 0 = ancora nel vortice, 1 = arrivata al suo posto (spazi esclusi: n = lettere vere). `ingresso` 0..1 è il tempo
 * (ingressoNome): le lettere arrivano da sole; `u` le fa solo tornare nel vortice quando si scorre.
 */
export function voloLettere(u: number, n: number, ingresso = 1): number[] {
  const x = clamp01(ingresso)
  const torna = liscia(APERTURA.scioglie[0], APERTURA.scioglie[1], u)
  return Array.from({ length: n }, (_, i) => {
    const parte = n > 1 ? (i / (n - 1)) * (1 - VOLO) : 0
    const p = (x - parte) / VOLO
    return (p > 1 - 1e-9 ? 1 : clamp01(p)) * (1 - torna)
  })
}

/** quanto si vede la lettera HTML: compare quando le scaglie sono quasi arrivate, si spegne quando tornano nel vortice */
export const lucelettera = (volo: number) => liscia(0.72, 1, volo)

/** la consegna: 0 = vortice intero, 1 = le quattro correnti sono uscite dallo schermo; con «Noi.» rientrano a metà e riescono */
export const consegna = (u: number) => {
  const [a, b] = APERTURA.spazzata
  const dentro = liscia(a, a + 0.22 * (b - a) / 0.6, u) * (1 - liscia(a + 0.25 * (b - a) / 0.6, b, u))
  return Math.max(0, liscia(APERTURA.consegna[0], APERTURA.consegna[1], u) - 0.5 * dentro)
}

/** D50: la parola i del resto (su n) viene portata via fra 0 e 1, una dopo l'altra, mentre le correnti riescono */
export function portataVia(u: number, i: number, n: number): number {
  const [a, b] = APERTURA.spazzata
  const parte = a + 0.08 + (i / Math.max(1, n - 1)) * 0.2
  return u > b + 0.5 ? 1 : liscia(parte, parte + 0.32, u)
}
