// Le regie di /campagne · Hermes, «la rotta» (DESIGN_SPEC-pagine §12). Hermes vola sopra la mappa notturna della Romagna, si divide in
// gocce di cromo che colpiscono solo le luci giuste e tornano alla tua porta. La mappa è fatta di coordinate vere (le città e la costa
// adriatica); sulla mappa nessun numero e nessuna scritta. Se somiglia a un'infografica a punti si passa al piano B (§17.3).
import type { Kit, Regia } from '../../kit.ts'
import { fuoco, lis, vicino } from './comune.ts'
import type { RegiePagina } from './comune.ts'

const apertura: Regia = (t, f, k) => {
  // le due cartoline si posano a destra della mascotte: un piccolo battito della materia per ciascuna
  k.pulsa('cartolina-1', { a: [0.88, 0.2], raggio: 0.07, colore: 'cromo' }, t['foto-1'])
  k.pulsa('cartolina-2', { a: [0.9, 0.5], raggio: 0.07, colore: 'cromo' }, t['foto-2'])
  const c = k.soggetto.centro
  k.luce('hermes', { a: c, raggio: 0.42, colore: 'cromo' }, 0.1 + 0.2 * t.servizio)
  k.orbita('gocce-piedi', { centro: vicino(k, 0, 0.5), raggio: [0.3 * k.soggetto.altezza * 1.78, 0.02], n: 30, colore: 'cromo' }, { accese: 30 * t.h1, ordine: 0.3 + 0.7 * t.sotto, velocita: 0.9, alfa: 0.35 + 0.5 * t.indice })
  k.getto('gocce', { da: vicino(k, 1.2, 0.8), verso: vicino(k, 0, 0.1), colore: 'cromo', n: 30 * t.sotto, ampiezza: 0.8 }, t.h1)
  k.luce('caldo', { a: vicino(k, -0.2, -0.4), raggio: 0.14, colore: 'luce' }, 0.08 + 0.14 * t.pulsante)
}

/** l'elenco delle campagne (v2): una vignetta per voce; qui l'anello di gocce, il gesto, una luce e un'onda per voce */
const STELLE = 42
const elenco: Regia = (t, f, k) => {
  const c = k.soggetto.centro
  const h = k.soggetto.altezza
  const v = ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7'].map((r) => t[r] ?? 0)
  const fatte = v.reduce((x, y) => x + y, 0)
  k.orbita('gocce', { centro: vicino(k, 0, 0.0), raggio: [0.46 * h * 1.78, 0.1 * h], n: STELLE, colore: 'cromo' },
    { accese: 6 * fatte, ordine: 0.4 + 0.08 * fatte + 0.04 * t.ben1, velocita: 0.4 + 0.9 * t.ben1, alfa: 0.4 + 0.25 * t.h2 + 0.3 * t.ben1 })
  k.luce('hermes', { a: c, raggio: 0.42, colore: 'cromo' }, 0.22 + 0.04 * fatte)
  v.forEach((x, i) => {
    if (x <= 0 || x >= 1) return
    const mano = vicino(k, i % 2 ? 0.24 : -0.24, -0.05)
    k.onda('tocco', { a: mano, raggio: 0.3, colore: 'cromo' }, lis(0.05, 0.85, x))
    k.luce('voce', { a: mano, raggio: 0.14, colore: 'luce' }, 0.4 * lis(0, 0.22, x) * (1 - lis(0.82, 1, x)))
    fuoco(k, x, mano)
  })
  // beneficio: nessuno può garantire quante richieste (luce fredda e ferma), ma sapere cosa è successo e perché (la luce calda arriva)
  k.luce('onesta', { a: c, raggio: 0.5, colore: 'cromo' }, 0.28 * lis(0, 0.7, t.ben1))
  k.luce('caldo-finale', { a: vicino(k, 0, 0.1), raggio: 0.3, colore: 'luce' }, 0.35 * lis(0, 0.8, t.ben2))
  k.onda('sapere', { a: c, raggio: 0.6, colore: 'cromo' }, t.ben2)
  fuoco(k, t.ben1, vicino(k, 0, -0.05)); fuoco(k, t.ben2, vicino(k, 0, -0.05))
}

export const REGIE_CAMPAGNE: RegiePagina = {
  film: { 'campagne-a': apertura, 'campagne-f': elenco },
  gioco: ({ scelta, t }, k) => {
    const c = k.soggetto.centro
    k.onda('cambio', { a: c, raggio: 0.5, colore: 'cromo' }, t)
    k.luce('hermes', { a: c, raggio: 0.42, colore: 'cromo' }, 0.22)
    k.getto('gocce', { da: c, verso: [c[0], c[1] + 0.6], colore: 'cromo', n: 20, ampiezza: scelta === 4 ? 1.6 : 0.8 }, t)
  },
  // l'invito: Hermes porta una goccia fino al pulsante e la linea di cromo finisce lì
  invito: (t, k) => {
    k.linea('rotta', { punti: [[0.1, 0.2], [0.35, 0.45], [0.5, 0.5]], colore: 'cromo', spessore: 1.2, gocce: 5 }, lis(0, 0.8, t))
    k.luce('pulsante', { a: [0.5, 0.5], raggio: 0.4, colore: 'cromo' }, 0.25 * lis(0.3, 1, t))
  },
}
