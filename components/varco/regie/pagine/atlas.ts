// Le regie di /automazioni · Atlas. v2 (31/10): dopo l'apertura il film è l'ELENCO delle automazioni, una per schermata (vault:
// pagine/automazioni-v2.md §3). Filo unico: ogni automazione accende sei stelle dell'anello attorno ad Atlas; con «Il resto va da
// solo.» l'anello si chiude e lui lo solleva. In più ogni voce ha la sua figura, che nasce e si spegne nella sua schermata.
// Lati delle zampe in termini di schermo: «sinistro» = a sinistra di chi guarda (come `indica` e i gesti di mondo/pagina.ts).
import type { Regia } from '../../kit.ts'
import { fuoco, largo, lis, vicino } from './comune.ts'
import type { RegiePagina } from './comune.ts'

/** le stelle dell'anello: sei per ognuna delle sette voci dell'elenco; si chiude con «Il resto va da solo.» */
const STELLE = 42

const apertura: Regia = (t, f, k) => {
  // le due cartoline si posano a destra della mascotte: un piccolo battito della materia per ciascuna
  k.pulsa('cartolina-1', { a: [0.88, 0.2], raggio: 0.07, colore: 'polvere' }, t['foto-1'])
  k.pulsa('cartolina-2', { a: [0.9, 0.5], raggio: 0.07, colore: 'polvere' }, t['foto-2'])
  const c = k.soggetto.centro
  // la polvere blu gira in un piccolo vortice ai piedi e compone Atlas; la luna calda dietro
  k.orbita('piedi', { centro: vicino(k, 0, 0.5), raggio: [largo(k, 0.3), 0.02], n: 30, colore: 'polvere' }, { accese: 30 * t.h1, ordine: 0.3 + 0.7 * t.sotto, velocita: 0.9, alfa: 0.35 + 0.5 * t.servizio })
  k.luce('atlas', { a: c, raggio: 0.42, colore: 'polvere' }, 0.1 + 0.2 * t.servizio)
  k.luce('luna', { a: vicino(k, -0.2, -0.38), raggio: 0.16, colore: 'luce' }, 0.08 + 0.18 * t.indice * (0.5 + 0.5 * t.pulsante))
  k.getto('polvere', { da: vicino(k, 1.2, 0.9), verso: vicino(k, 0, 0.1), colore: 'polvere', n: 30 * t.sotto, ampiezza: 0.8 }, t.h1)
}

/** la voce è «accesa» dalla sua finestra: nasce e si spegne dentro la sua schermata */
const finestra = (v: number) => lis(0, 0.22, v) * (1 - lis(0.82, 1, v))
const VOCI = ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7']

const elenco: Regia = (t, f, k) => {
  const c = k.soggetto.centro
  const h = k.soggetto.altezza
  const v = VOCI.map((r) => t[r] ?? 0)
  const fatte = v.reduce((x, y) => x + y, 0)

  // il filo: sei stelle per automazione; l'anello si ordina man mano e con la chiusura gira più svelto
  k.orbita('anello', { centro: vicino(k, 0, 0.0), raggio: [largo(k, 0.46), 0.1 * h], n: STELLE, colore: 'polvere' },
    { accese: 6 * fatte, ordine: 0.4 + 0.08 * fatte + 0.04 * t.ben1, velocita: 0.4 + 0.9 * t.ben1, alfa: 0.4 + 0.25 * t.h2 + 0.3 * t.ben1 })
  k.luce('atlas', { a: c, raggio: 0.44, colore: 'polvere' }, 0.24 + 0.04 * fatte + 0.12 * t.ben1)

  // ogni voce: Atlas fa il suo gesto (dai dati) e dalla mano parte un'onda verso la vignetta; la luce calda segue la voce
  v.forEach((x, i) => {
    if (x <= 0 || x >= 1) return
    const mano = vicino(k, i % 2 ? 0.24 : -0.24, -0.05)
    k.onda('tocco', { a: mano, raggio: 0.3, colore: 'polvere' }, lis(0.05, 0.85, x))
    k.luce('voce', { a: mano, raggio: 0.14, colore: 'luce' }, 0.4 * finestra(x))
    fuoco(k, x, mano)
  })

  // la chiusura: l'anello si chiude tutto blu, un'onda, un punto caldo; lui lo solleva (gesto tenuto, dai dati)
  if (t.ben1 > 0) {
    k.luce('chiusura', { a: vicino(k, 0, -0.05), raggio: 0.6, colore: 'polvere' }, 0.35 * lis(0, 0.6, t.ben1))
    k.onda('chiude', { a: vicino(k, 0, -0.05), raggio: 0.7, colore: 'polvere' }, t.ben1)
    k.luce('punto-caldo', { a: [Math.min(0.94, c[0] + 0.3), Math.max(0.08, c[1] - 0.3)], raggio: 0.08, colore: 'luce' }, 0.5 * lis(0.4, 1, t.ben1))
    fuoco(k, t.ben1, vicino(k, 0, -0.05))
  }
}

export const REGIE_AUTOMAZIONI: RegiePagina = {
  film: { 'automazioni-a': apertura, 'automazioni-f': elenco },
  // il gioco: ad ogni scelta una scintilla arriva dal lato, Atlas la prende e un'altra stella dell'orbita si accende
  gioco: ({ scelta, t }, k) => {
    const mano = vicino(k, scelta % 2 ? 0.25 : -0.25, -0.05)
    k.getto('scintilla', { da: [scelta % 2 ? 1.2 : -0.2, 0.2 + 0.1 * (scelta % 3)], verso: mano, colore: 'polvere', n: 10, ampiezza: 0.25 }, t)
    k.orbita('anello', { centro: vicino(k, 0, 0.0), raggio: [largo(k, 0.42), 0.1 * k.soggetto.altezza], n: STELLE, colore: 'polvere' },
      { accese: 30 + 10 * lis(0.5, 1, t), ordine: 1, velocita: 0.8, alfa: 0.7 })
    k.luce('atlas', { a: k.soggetto.centro, raggio: 0.44, colore: 'polvere' }, 0.32)
    if (scelta === 0) k.orbita('costellazione', { centro: vicino(k, 0.9, -0.5), raggio: [0.25, 0.12], n: 7, colore: 'polvere' }, { accese: 7 * lis(0.3, 1, t), ordine: 0.2, velocita: 0.5, alfa: 0.8 })
    k.pulsa('presa', { a: mano, raggio: 0.08, colore: 'polvere' }, t)
  },
  // l'invito: Atlas prende un'ultima scintilla e la mette in orbita attorno al pulsante: un piccolo anello blu
  invito: (t, k) => {
    k.orbita('pulsante', { centro: [0.5, 0.5], raggio: [0.46, 0.05], n: 40, colore: 'polvere' }, { accese: 40 * lis(0.1, 0.9, t), ordine: 1, velocita: 0.9, alfa: 0.9 * lis(0, 0.3, t) })
    k.getto('ultima', { da: [1.2, 0.1], verso: [0.5, 0.5], colore: 'polvere', n: 10, ampiezza: 0.2 }, lis(0, 0.7, t))
    k.luce('pulsante', { a: [0.5, 0.5], raggio: 0.4, colore: 'polvere' }, 0.2 * lis(0.2, 1, t))
  },
}
