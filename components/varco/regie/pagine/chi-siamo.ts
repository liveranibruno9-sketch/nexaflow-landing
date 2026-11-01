// Le regie di /chi-siamo (DESIGN_SPEC-pagine §13): il film è la sola apertura (quattro correnti di materia dalla lampada). La parte
// «io» è una sezione dopo i valori: quando sta al centro dello schermo la lampada cresce (lo fa il mondo, modo «persona»); le quattro
// mascotte compaiono nella squadra, ognuna sulla sua àncora.
import type { Regia } from '../../kit.ts'
import { lis } from './comune.ts'
import type { RegiePagina } from './comune.ts'

const apertura: Regia = (t, f, k) => {
  // quattro correnti di materia, una per colore, partono dalla luce verso i quattro bordi: «più lontano»
  k.getto('c-polvere', { da: [0.2, 0.15], verso: [-0.3, -0.1], colore: 'polvere', n: 60 * t.h1, ampiezza: 0.6 }, t.h1)
  k.getto('c-vetro', { da: [0.2, 0.15], verso: [1.3, -0.1], colore: 'vetro', n: 60 * t.h1, ampiezza: 0.6 }, t.h1)
  k.getto('c-saette', { da: [0.2, 0.15], verso: [1.3, 1.1], colore: 'saette', n: 60 * t.sotto, ampiezza: 0.6 }, t.sotto)
  k.getto('c-cromo', { da: [0.2, 0.15], verso: [-0.3, 1.1], colore: 'cromo', n: 60 * t.sotto, ampiezza: 0.6 }, t.sotto)
  k.luce('lampada', { a: [0.15, 0.1], raggio: 0.5, colore: 'luce' }, 0.18 + 0.12 * t.indice * (0.5 + 0.5 * t.pulsante))
}

/** le sezioni dopo il film: la scena non c'è (la mascotte, nella sezione dei servizi, fa le sue capacità in piccolo) */
export const REGIE_CHI_SIAMO: RegiePagina = {
  film: { 'chi-siamo-a': apertura },
  gioco: () => {},
  invito: (t, k) => {
    // l'invito: le quattro mascotte si avvicinano al pulsante (la posa la dà il mondo); qui solo la luce
    k.luce('pulsante', { a: [0.5, 0.5], raggio: 0.4, colore: 'luce' }, 0.25 * lis(0.1, 1, t))
  },
}
