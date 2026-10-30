// Le regie di /contenuti · Prometheus, «il lampo» (DESIGN_SPEC-pagine §11). Dove scocca il lampo, nel buio si accende un momento vero
// di un'attività e va nella sua cornice. Nessun lampo oltre 2,5 al secondo e mai più di un quarto dello schermo (la saetta del Kit
// cambia forma al massimo 2,5 volte al secondo; le luci restano sotto 0,85).
import type { Regia } from '../../kit.ts'
import type { Vec2 } from '../../tipi.ts'
import { fuoco, lis, vicino } from './comune.ts'
import type { RegiePagina } from './comune.ts'

/** la griglia 3×3 di cornici: punti relativi alla sua posizione (in larghezze di quadro), a sinistra dello schermo */
const GRIGLIA: [number, number, number][] = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => [((i % 3) - 1) * 0.2, (Math.floor(i / 3) - 1) * 0.2 * (2.25 / 4) * 1.4, 0.7])

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

const problema: Regia = (t, f, k) => {
  const c = k.soggetto.centro
  const g: Vec2 = [Math.max(0.22, c[0] - 0.42), c[1] - 0.04]
  // la griglia di nove cornici spente e impolverate (il profilo fermo)
  k.punti('griglia', { punti: GRIGLIA, colore: 'saette' }, { centro: g, scala: 1, inclina: 0, accese: 3 * Math.sin(Math.PI * Math.min(1, t.r2 * 1.0)) + 1 * t.r2, alfa: 0.6 + 0.1 * t.h2 })
  // 1: la polvere cade
  k.getto('polvere', { da: [g[0], -0.05], verso: [g[0], g[1] + 0.2], colore: 'saette', n: 30, ampiezza: 0.5, gravita: 0.8 }, t.r1)
  // 2: una cornice prova ad accendersi e si spegne
  k.luce('prova', { a: g, raggio: 0.14, colore: 'saette' }, 0.4 * Math.sin(Math.PI * t.r2) + 0.1 * t.r2)
  // 3: «il bello c'è già»: una scintilla crepita davanti a Prometheus
  k.saetta('crepita', { da: vicino(k, -0.15, -0.1), a: [g[0] + 0.1, g[1]], rami: 1 }, 0.5 * lis(0, 0.5, t.r3))
  fuoco(k, t.r1, g); fuoco(k, t.r2, g); fuoco(k, t.r3, g)
}

const capacita: Regia = (t, f, k) => {
  const c = k.soggetto.centro
  const g: Vec2 = [Math.max(0.22, c[0] - 0.42), c[1] - 0.04]
  const accese = 1 * t.b1 + 3 * t.b2 + 1 * t.b3 + 1 * t.b4 + 1 * t.b5 + 1 * t.b6 + 1 * t.ben1
  k.punti('griglia', { punti: GRIGLIA, colore: 'saette' }, { centro: g, scala: 1, inclina: 0, accese: 3 * t.b1 + 6 * t.b2 + accese, alfa: 0.5 + 0.4 * t.h2 })
  k.luce('prometheus', { a: c, raggio: 0.42, colore: 'saette' }, 0.22)
  // 1: le cornici si ridisegnano in linee di saetta, riga per riga
  k.saetta('riga', { da: [g[0] - 0.2, g[1] - 0.12], a: [g[0] + 0.2, g[1] - 0.12], rami: 0 }, 0.5 * t.b1)
  // 2: il primo lampo: scocca dalla mano e sviluppa la prima foto
  k.saetta('primo', { da: vicino(k, 0.1, -0.1), a: [g[0], g[1]], rami: 2 }, 0.9 * lis(0, 0.35, t.b2) * (1 - lis(0.55, 1, t.b2)))
  k.luce('sviluppo', { a: g, raggio: 0.22, colore: 'saette' }, 0.45 * lis(0.1, 0.6, t.b2) * (1 - 0.5 * lis(0.7, 1, t.b2)))
  // 3: parole tue: le scintille ondeggiano come una voce
  k.getto('voce', { da: vicino(k, 0.3, -0.35), verso: vicino(k, 1.4, -0.35), colore: 'saette', n: 24 * t.b3, ampiezza: 0.6 }, t.b3)
  // 4: una cornice verticale scende verso la frase e pulsa due volte
  k.pulsa('verticale', { a: [g[0] + 0.3, g[1] + 0.4 * t.b4], raggio: 0.1, colore: 'saette' }, t.b4)
  // 5: anello di tocco sulla cornice, che si accende tutta
  k.onda('approvo', { a: g, raggio: 0.3, colore: 'saette' }, t.b5)
  // 6: tre cornici, tre foto: tre piccoli lampi in fila
  k.saetta('tre', { da: vicino(k, 0, -0.3), a: [g[0] + 0.2, g[1] + 0.2], rami: 0 }, 0.7 * Math.sin(Math.PI * t.b6))
  k.luce('tre-luce', { a: [g[0] + 0.2, g[1] + 0.2], raggio: 0.14, colore: 'saette' }, 0.35 * t.b6)
  // beneficio: la griglia si accende tutta; una scintilla di passaggio si ferma davanti
  k.luce('griglia-tutta', { a: g, raggio: 0.55, colore: 'saette' }, 0.3 * lis(0, 0.7, t.ben1))
  k.getto('di-passaggio', { da: [1.2, 0.2], verso: vicino(k, 0.3, -0.1), colore: 'saette', n: 8, ampiezza: 0.2 }, t.ben2)
  fuoco(k, t.b1, g); fuoco(k, t.b2, g); fuoco(k, t.b3, c); fuoco(k, t.b4, g); fuoco(k, t.b5, g); fuoco(k, t.b6, g)
  fuoco(k, t.ben1, g); fuoco(k, t.ben2, c)
  k.pulsa('foto-1', { a: g, raggio: 0.12, colore: 'saette' }, t['foto-1'] ?? 0)
}

export const REGIE_CONTENUTI: RegiePagina = {
  film: { 'contenuti-a': apertura, 'contenuti-p': problema, 'contenuti-f': capacita },
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
