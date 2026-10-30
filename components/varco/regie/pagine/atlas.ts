// Le regie di /automazioni · Atlas, «prende al volo» (DESIGN_SPEC-pagine §9). I messaggi dei clienti sono scintille nel buio: Atlas
// le prende una a una e le mette in orbita, in ordine; sulla firma l'anello si chiude tutto e lui lo solleva come il cielo del mito.
import type { Regia } from '../../kit.ts'
import { fuoco, largo, lis, vicino } from './comune.ts'
import type { RegiePagina } from './comune.ts'

/** le stelle dell'orbita: l'anello si chiude quando sono tutte accese */
const STELLE = 40

const apertura: Regia = (t, f, k) => {
  const c = k.soggetto.centro
  // la polvere blu gira in un piccolo vortice ai piedi e compone Atlas; la luna calda dietro
  k.orbita('piedi', { centro: vicino(k, 0, 0.5), raggio: [largo(k, 0.3), 0.02], n: 30, colore: 'polvere' }, { accese: 30 * t.h1, ordine: 0.3 + 0.7 * t.sotto, velocita: 0.9, alfa: 0.35 + 0.5 * t.servizio })
  k.luce('atlas', { a: c, raggio: 0.42, colore: 'polvere' }, 0.1 + 0.2 * t.servizio)
  k.luce('luna', { a: vicino(k, -0.2, -0.38), raggio: 0.16, colore: 'luce' }, 0.08 + 0.18 * t.indice * (0.5 + 0.5 * t.pulsante))
  k.getto('polvere', { da: vicino(k, 1.2, 0.9), verso: vicino(k, 0, 0.1), colore: 'polvere', n: 30 * t.sotto, ampiezza: 0.8 }, t.h1)
}

const problema: Regia = (t, f, k) => {
  const c = k.soggetto.centro
  // 1: tre scintille arrivano da tre direzioni e si spengono senza che nessuno le prenda
  k.getto('s-alto', { da: [1.1, -0.1], verso: [0.35, 0.5], colore: 'polvere', n: 12, ampiezza: 0.3 }, t.r1)
  k.getto('s-sinistra', { da: [-0.15, 0.3], verso: [0.5, 0.7], colore: 'polvere', n: 12, ampiezza: 0.3 }, t.r1)
  k.getto('s-basso', { da: [0.8, 1.15], verso: [0.2, 0.2], colore: 'polvere', n: 12, ampiezza: 0.3 }, t.r1)
  // 2: corrono più veloci e si disperdono
  k.getto('veloci', { da: [0.5, 0.5], verso: [-0.6, -0.1], colore: 'polvere', n: 28 * t.r2, ampiezza: 1.5, gravita: 0.4 }, t.r2)
  k.getto('veloci-b', { da: [0.6, 0.5], verso: [1.5, 1.1], colore: 'polvere', n: 28 * t.r2, ampiezza: 1.5 }, t.r2)
  // 3: una rallenta davanti ad Atlas
  const verso = vicino(k, 0.2, -0.1)
  k.getto('si-ferma', { da: [1.1, 0.1], verso, colore: 'polvere', n: 6, ampiezza: 0.15 }, t.r3)
  k.luce('attenzione', { a: verso, raggio: 0.22, colore: 'polvere' }, 0.3 * lis(0.1, 0.8, t.r3))
  // la scena è fredda e un po' spenta; il titolo la scurisce appena
  k.luce('freddo', { a: c, raggio: 0.5, colore: 'polvere' }, 0.2 * (1 - 0.5 * t.h2))
  fuoco(k, t.r1, [0.5, 0.35]); fuoco(k, t.r2, [0.4, 0.5]); fuoco(k, t.r3, verso)
}

const capacita: Regia = (t, f, k) => {
  const c = k.soggetto.centro
  const mano = vicino(k, 0.2, -0.05)
  const stelle = 1 * t.b1 + 3 * t.b2 + 2 * t.b3 + 9 * t.b4 + 1 * t.b5 + 2 * t.b6 + (STELLE - 18) * t.ben1
  // l'orbita comincia a comparire col titolo e diventa un anello regolare mentre le stelle si accendono
  const ordine = 0.35 + 0.25 * t.b2 + 0.15 * t.b4 + 0.25 * t.ben1
  k.orbita('anello', { centro: vicino(k, 0, 0.0), raggio: [largo(k, 0.42), 0.1 * k.soggetto.altezza], n: STELLE, colore: 'polvere' },
    { accese: stelle, ordine, velocita: 0.5 + 0.8 * t.ben1, alfa: 0.55 + 0.45 * t.h2 })
  k.luce('atlas', { a: c, raggio: 0.44, colore: 'polvere' }, 0.3 + 0.2 * t.ben1)
  // 1 Risponde subito: una scintilla arriva veloce, Atlas la prende e va in orbita
  k.getto('subito', { da: [1.1, 0.0], verso: mano, colore: 'polvere', n: 8, ampiezza: 0.2 }, t.b1)
  // 2 Raccoglie la richiesta: la scintilla si apre in tre puntini in fila
  k.getto('richiesta', { da: [-0.1, 0.45], verso: mano, colore: 'polvere', n: 14, ampiezza: 0.3 }, t.b2)
  // 3 Riprende i preventivi: una stella spenta lontana si riaccende e lui la tira a sé
  k.luce('stella-lontana', { a: [0.1, 0.18], raggio: 0.12, colore: 'polvere' }, 0.5 * lis(0, 0.5, t.b3) * (1 - lis(0.5, 1, t.b3)))
  k.getto('tira', { da: [0.1, 0.18], verso: mano, colore: 'polvere', n: 10, ampiezza: 0.2 }, lis(0.3, 1, t.b3))
  // 4 Chiede le recensioni: le stelle dell'orbita brillano una dopo l'altra (le accende `stelle`); un'onda corre sull'anello
  k.onda('recensioni', { a: vicino(k, 0, -0.05), raggio: 0.5, colore: 'polvere' }, t.b4)
  // 5 Ti avvisa solo quando serve: una sola stella diventa calda e lui la abbassa verso la frase
  k.luce('stella-calda', { a: [0.5 - 0.3 * t.b5, 0.28 + 0.4 * t.b5], raggio: 0.1, colore: 'luce' }, 0.6 * lis(0, 0.4, t.b5) * (1 - 0.3 * lis(0.7, 1, t.b5)))
  // 6 Dice sempre chi è: la polvere si dirada, Atlas resta nitido, zampa sul petto
  k.pulsa('petto', { a: vicino(k, 0, 0.05), raggio: 0.1, colore: 'polvere' }, t.b6)
  k.luce('nitido', { a: c, raggio: 0.3, colore: 'perla' }, 0.12 * t.b6)
  // beneficio: l'anello si chiude tutto blu, un punto caldo
  k.luce('chiusura', { a: vicino(k, 0, -0.05), raggio: 0.6, colore: 'polvere' }, 0.35 * lis(0, 0.6, t.ben1))
  k.onda('chiude', { a: vicino(k, 0, -0.05), raggio: 0.7, colore: 'polvere' }, t.ben1)
  k.luce('punto-caldo', { a: vicino(k, 0.45, -0.55), raggio: 0.08, colore: 'luce' }, 0.5 * lis(0.4, 1, t.ben1))
  fuoco(k, t.b1, mano); fuoco(k, t.b2, mano); fuoco(k, t.b3, mano); fuoco(k, t.b4, c); fuoco(k, t.b5, [0.3, 0.55]); fuoco(k, t.b6, c)
  fuoco(k, t.ben1, vicino(k, 0, -0.05))
}

export const REGIE_AUTOMAZIONI: RegiePagina = {
  film: { 'automazioni-a': apertura, 'automazioni-p': problema, 'automazioni-f': capacita },
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
