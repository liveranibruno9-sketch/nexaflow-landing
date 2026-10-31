// Le regie di /siti-web · Janus, «compone il vetro» (DESIGN_SPEC-pagine §10). Una lastra di vetro si compone dalle schegge, ruota dal
// computer al telefono e, sul beneficio, si apre come una porta: la luce calda dilaga (il punto più caldo della pagina, mai il bianco pieno).
import type { Kit, Regia } from '../../kit.ts'
import type { Vec2 } from '../../tipi.ts'
import { fuoco, largo, lis, vicino } from './comune.ts'
import type { RegiePagina } from './comune.ts'

/** dove sta la lastra: a sinistra di Janus sul computer, davanti e più in basso sul telefono (la mascotte è più piccola nel quadro) */
function lastraDi(k: Kit) {
  const h = k.soggetto.altezza
  const telefono = h < 0.45
  const altezza = 1.15 * h
  const larghezza = Math.min(0.9, altezza * 1.07)
  const c = k.soggetto.centro
  const a: Vec2 = telefono ? [0.5, c[1] + 0.1 * h] : [c[0] - 0.62 * h * 1.78, c[1] + 0.02]
  return { a, altezza, larghezza, telefono }
}

const apertura: Regia = (t, f, k) => {
  // le due cartoline si posano a destra della mascotte: un piccolo battito della materia per ciascuna
  k.pulsa('cartolina-1', { a: [0.88, 0.2], raggio: 0.07, colore: 'vetro' }, t['foto-1'])
  k.pulsa('cartolina-2', { a: [0.9, 0.5], raggio: 0.07, colore: 'vetro' }, t['foto-2'])
  const c = k.soggetto.centro
  k.luce('janus', { a: c, raggio: 0.42, colore: 'vetro' }, 0.1 + 0.2 * t.servizio)
  k.orbita('schegge', { centro: vicino(k, 0, 0.5), raggio: [largo(k, 0.3), 0.02], n: 30, colore: 'vetro' }, { accese: 30 * t.h1, ordine: 0.3 + 0.7 * t.sotto, velocita: 0.9, alfa: 0.35 + 0.5 * t.indice })
  k.getto('schegge-in', { da: vicino(k, 1.3, 0.8), verso: vicino(k, 0, 0.1), colore: 'vetro', n: 30 * t.sotto, ampiezza: 0.8 }, t.h1)
  k.luce('caldo', { a: vicino(k, -0.2, -0.4), raggio: 0.14, colore: 'luce' }, 0.08 + 0.14 * t.pulsante)
}

/** l'elenco dei tipi di sito (v2): una vignetta per voce; qui l'anello di schegge di vetro, il gesto, una luce e un'onda per voce */
const STELLE = 42
const elenco: Regia = (t, f, k) => {
  const c = k.soggetto.centro
  const h = k.soggetto.altezza
  const v = ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7'].map((r) => t[r] ?? 0)
  const fatte = v.reduce((x, y) => x + y, 0)
  k.orbita('schegge', { centro: vicino(k, 0, 0.0), raggio: [largo(k, 0.46), 0.1 * h], n: STELLE, colore: 'vetro' },
    { accese: 6 * fatte, ordine: 0.4 + 0.08 * fatte + 0.04 * t.ben1, velocita: 0.4 + 0.9 * t.ben1, alfa: 0.4 + 0.25 * t.h2 + 0.3 * t.ben1 })
  k.luce('janus', { a: c, raggio: 0.42, colore: 'vetro' }, 0.22 + 0.04 * fatte)
  v.forEach((x, i) => {
    if (x <= 0 || x >= 1) return
    const mano = vicino(k, i % 2 ? 0.24 : -0.24, -0.05)
    k.onda('tocco', { a: mano, raggio: 0.3, colore: 'vetro' }, lis(0.05, 0.85, x))
    k.luce('voce', { a: mano, raggio: 0.14, colore: 'luce' }, 0.4 * lis(0, 0.22, x) * (1 - lis(0.82, 1, x)))
    fuoco(k, x, mano)
  })
  // beneficio: chi arriva capisce (la luce calda dilaga piano), chi capisce prenota (un'onda dal centro)
  k.luce('dilaga', { a: c, raggio: 0.7, colore: 'luce' }, 0.45 * lis(0.1, 0.9, t.ben1))
  k.onda('capisce', { a: c, raggio: 0.5, colore: 'vetro' }, t.ben1)
  k.onda('prenota', { a: c, raggio: 0.7, colore: 'luce' }, t.ben2)
  fuoco(k, t.ben1, vicino(k, 0, -0.05)); fuoco(k, t.ben2, vicino(k, 0, -0.05))
}

export const REGIE_SITI: RegiePagina = {
  film: { 'siti-web-a': apertura, 'siti-web-f': elenco },
  // il gioco: alla scelta la lastra si gira verso di te e dentro compare un luogo di quel mestiere (la foto sta nel palco HTML, sfumata)
  gioco: ({ scelta, t }, k) => {
    const L = lastraDi(k)
    k.lastra('lastra', { a: L.a, larghezza: L.larghezza, altezza: L.altezza, colore: 'vetro' }, { ruota: 0, apri: 0, alfa: 0.7, calore: 0.25 + 0.25 * lis(0, 1, t) })
    k.onda('cambio', { a: L.a, raggio: 0.5, colore: 'vetro' }, t)
    k.luce('janus', { a: k.soggetto.centro, raggio: 0.42, colore: 'vetro' }, 0.22)
    k.getto('schegge', { da: k.soggetto.centro, verso: L.a, colore: 'vetro', n: 14, ampiezza: 0.3 }, t * (1 + 0 * scelta))
  },
  // l'invito: una piccola lastra-porta si apre attorno al pulsante, che sta nel varco
  invito: (t, k) => {
    k.lastra('porta', { a: [0.5, 0.5], larghezza: 0.62, altezza: 0.2, colore: 'vetro' }, { ruota: 0, apri: 0.9 * lis(0.1, 0.9, t), alfa: 0.8 * lis(0, 0.3, t), calore: 0.4 * lis(0.3, 1, t) })
    k.luce('varco', { a: [0.5, 0.5], raggio: 0.4, colore: 'luce' }, 0.35 * lis(0.2, 1, t))
  },
}
