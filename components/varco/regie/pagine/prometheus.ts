// Le regie di /contenuti · Prometheus, «il lampo» (DESIGN_SPEC-pagine §11). Dove scocca il lampo, nel buio si accende un momento vero
// di un'attività e va nella sua cornice. Nessun lampo oltre 2,5 al secondo e mai più di un quarto dello schermo (la saetta del Kit
// cambia forma al massimo 2,5 volte al secondo; le luci restano sotto 0,85).
import type { Kit, Regia } from '../../kit.ts'
import type { Vec2 } from '../../tipi.ts'
import { corta, fuoco, lis, vicino } from './comune.ts'
import type { RegiePagina } from './comune.ts'

const apertura: Regia = (t, f, k) => {
  // le due cartoline si posano a destra della mascotte: un piccolo battito della materia per ciascuna
  k.pulsa('cartolina-1', { a: [0.88, 0.2], raggio: 0.07, colore: 'saette' }, t['foto-1'])
  k.pulsa('cartolina-2', { a: [0.9, 0.5], raggio: 0.07, colore: 'saette' }, t['foto-2'])
  const c = k.soggetto.centro
  k.luce('prometheus', { a: c, raggio: 0.42, colore: 'saette' }, 0.1 + 0.2 * t.servizio)
  k.orbita('saette-piedi', { centro: vicino(k, 0, 0.5), raggio: [0.3 * k.soggetto.altezza * 1.78, 0.02], n: 30, colore: 'saette' }, { accese: 30 * t.h1, ordine: 0.3 + 0.7 * t.sotto, velocita: 1.1, alfa: 0.35 + 0.5 * t.indice })
  k.getto('scintille', { da: vicino(k, 1.2, 0.8), verso: vicino(k, 0, 0.1), colore: 'saette', n: 30 * t.sotto, ampiezza: 0.8 }, t.h1)
  k.luce('caldo', { a: vicino(k, -0.2, -0.4), raggio: 0.14, colore: 'luce' }, 0.08 + 0.14 * t.pulsante)
}

/** l'elenco dei contenuti (v2): una vignetta per voce; qui l'anello di piccole saette, il gesto, una luce e un lampo per voce */
const STELLE = 36
const elenco: Regia = (t, f, k) => {
  const c = k.soggetto.centro
  const h = k.soggetto.altezza
  const v = ['b1', 'b2', 'b3', 'b4', 'b5', 'b6'].map((r) => t[r] ?? 0)
  const fatte = v.reduce((x, y) => x + y, 0)
  k.orbita('saette', { centro: vicino(k, 0, 0.0), raggio: [0.46 * h * 1.78, 0.1 * h], n: STELLE, colore: 'saette' },
    { accese: 6 * fatte, ordine: 0.4 + 0.08 * fatte + 0.04 * t.ben1, velocita: 0.4 + 0.9 * t.ben1, alfa: 0.4 + 0.25 * t.h2 + 0.3 * t.ben1 })
  k.luce('prometheus', { a: c, raggio: 0.42, colore: 'saette' }, 0.22 + 0.04 * fatte)
  v.forEach((x, i) => {
    if (x <= 0 || x >= 1) return
    const mano = vicino(k, i % 2 ? 0.24 : -0.24, -0.05)
    // un lampo breve dalla mano, mai oltre un quarto dello schermo, che si spegne prima della fine della voce
    k.saetta('lampo', { da: mano, a: corta(mano, vicino(k, i % 2 ? 0.7 : -0.7, 0.55)), rami: 1 }, 0.8 * lis(0.05, 0.3, x) * (1 - lis(0.45, 0.8, x)))
    k.luce('voce', { a: mano, raggio: 0.14, colore: 'luce' }, 0.4 * lis(0, 0.22, x) * (1 - lis(0.82, 1, x)))
    fuoco(k, x, mano)
  })
  // beneficio: chi ti segue ti riconosce (una luce fissa), chi non ti conosce si ferma (una scintilla di passaggio si ferma davanti)
  k.luce('riconosce', { a: c, raggio: 0.55, colore: 'saette' }, 0.3 * lis(0, 0.7, t.ben1))
  k.getto('di-passaggio', { da: [1.2, 0.2], verso: vicino(k, 0.3, -0.1), colore: 'saette', n: 8, ampiezza: 0.2 }, t.ben2)
  fuoco(k, t.ben1, vicino(k, 0, -0.05)); fuoco(k, t.ben2, c)
}

export const REGIE_CONTENUTI: RegiePagina = {
  film: { 'contenuti-a': apertura, 'contenuti-f': elenco },
  // il gioco: alla scelta un lampo sviluppa una foto di quell'attività (la foto sta nel palco HTML); un tocco nel buio fa un lampo
  gioco: ({ scelta, t }, k) => {
    const c = k.soggetto.centro
    k.saetta('lampo', { da: vicino(k, 0.1, -0.1), a: [Math.min(0.85, c[0] + 0.28), c[1] - 0.05 * (1 + (scelta % 2))], rami: 2 }, 0.9 * lis(0, 0.3, t) * (1 - lis(0.4, 0.9, t)))
    k.luce('sviluppo', { a: [Math.min(0.85, c[0] + 0.28), c[1]], raggio: 0.25, colore: 'saette' }, 0.4 * lis(0, 0.5, t))
    k.luce('prometheus', { a: c, raggio: 0.42, colore: 'saette' }, 0.22)
  },
  // l'invito: la fiammella di Prometheus accende il pulsante; il blu prende un guizzo caldo
  invito: (t, k) => {
    k.saetta('fiammella', { da: [0.2, 0.1], a: [0.5, 0.5], rami: 1 }, 0.8 * lis(0.05, 0.3, t) * (1 - lis(0.4, 0.8, t)))
    k.luce('guizzo', { a: [0.5, 0.5], raggio: 0.4, colore: 'luce' }, 0.35 * lis(0.3, 0.6, t) * (1 - lis(0.8, 1, t)))
    k.luce('pulsante', { a: [0.5, 0.5], raggio: 0.4, colore: 'saette' }, 0.2 * lis(0.1, 1, t))
  },
}
