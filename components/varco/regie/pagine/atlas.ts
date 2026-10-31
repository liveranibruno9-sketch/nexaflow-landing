// Le regie di /automazioni · Atlas. v2 (31/10): dopo l'apertura il film è l'ELENCO delle automazioni, una per schermata (vault:
// pagine/automazioni-v2.md §3). Filo unico: ogni automazione accende sei stelle dell'anello attorno ad Atlas; con «Il resto va da
// solo.» l'anello si chiude e lui lo solleva. In più ogni voce ha la sua figura, che nasce e si spegne nella sua schermata.
// Lati delle zampe in termini di schermo: «sinistro» = a sinistra di chi guarda (come `indica` e i gesti di mondo/pagina.ts).
import type { Regia } from '../../kit.ts'
import type { Vec2 } from '../../tipi.ts'
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

/** la figura di una voce nasce e si spegne nella sua schermata */
const finestra = (v: number) => lis(0, 0.22, v) * (1 - lis(0.82, 1, v))
/** un punto tenuto dentro il quadro (sul computer Atlas sta a destra: le figure non escono dallo schermo) */
const nelQuadro = (p: Vec2): Vec2 => [Math.min(0.94, Math.max(0.06, p[0])), Math.min(0.92, Math.max(0.08, p[1]))]
const VOCI = ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7']

const elenco: Regia = (t, f, k) => {
  const c = k.soggetto.centro
  const h = k.soggetto.altezza
  const zSx = vicino(k, -0.24, -0.05)
  const zDx = vicino(k, 0.24, -0.05)
  const [v1, v2, v3, v4, v5, v6, v7] = VOCI.map((r) => t[r] ?? 0)
  const fatte = v1 + v2 + v3 + v4 + v5 + v6 + v7

  // il filo: sei stelle per automazione; l'anello si ordina man mano e con la chiusura gira più svelto
  k.orbita('anello', { centro: vicino(k, 0, 0.0), raggio: [largo(k, 0.46), 0.1 * h], n: STELLE, colore: 'polvere' },
    { accese: 6 * fatte, ordine: 0.4 + 0.08 * fatte + 0.04 * t.ben1, velocita: 0.4 + 0.9 * t.ben1, alfa: 0.35 + 0.25 * t.h2 + 0.3 * t.ben1 })
  k.luce('atlas', { a: c, raggio: 0.44, colore: 'polvere' }, 0.24 + 0.04 * fatte + 0.12 * t.ben1)

  // 1 · Assistente ai messaggi: tre canali (WhatsApp, Instagram, email), tre linee con le gocce che corrono una dopo l'altra verso
  // la zampa; a ogni presa un'onda di risposta. Le linee si leggono meglio dei getti sopra la polvere di Atlas
  if (v1 > 0 && v1 < 1) {
    const w = finestra(v1)
    // le partenze restano sotto la testata (sul computer andrebbero sopra il menu)
    const fonti: Vec2[] = [vicino(k, -1.0, -0.55), vicino(k, -1.1, 0.12), vicino(k, -0.55, -0.85)].map((x) => nelQuadro([x[0], Math.max(0.2, x[1])]))
    fonti.forEach((da, i) => {
      const curva: Vec2 = [(da[0] + zSx[0]) / 2 + 0.03 * (i - 1), (da[1] + zSx[1]) / 2 - 0.03]
      k.linea(`canale-${i + 1}`, { punti: [da, curva, zSx], colore: 'polvere', spessore: 1.2, gocce: 4 }, lis(0.15 * i, 0.15 * i + 0.35, v1) * (1 - lis(0.85, 1, v1)))
    })
    k.onda('risposta', { a: zSx, raggio: 0.24, colore: 'polvere' }, lis(0.45, 0.95, v1))
    k.luce('presa', { a: zSx, raggio: 0.12, colore: 'luce' }, 0.45 * w * lis(0.3, 0.6, v1))
  }

  // 2 · Segreteria telefonica: la voce, un'onda sonora che si disegna attraverso di lui; due anelli partono dalla zampa come suono
  if (v2 > 0 && v2 < 1) {
    const w = finestra(v2)
    const n = 17, larga = largo(k, 0.62), y = c[1] + 0.06 * h
    const onda: Vec2[] = Array.from({ length: n }, (_, i) => {
      const inv = Math.sin((Math.PI * i) / (n - 1))
      return [c[0] - larga + (2 * larga * i) / (n - 1), y + (i % 2 ? 1 : -1) * 0.11 * h * inv * (0.45 + 0.55 * Math.abs(Math.sin(i * 1.7)))]
    })
    k.linea('voce', { punti: onda, colore: 'polvere', spessore: 1.4, gocce: 6 }, lis(0, 0.5, v2) * (1 - lis(0.85, 1, v2)))
    k.onda('suono-1', { a: zDx, raggio: 0.2, colore: 'polvere' }, lis(0.2, 0.65, v2))
    k.onda('suono-2', { a: zDx, raggio: 0.3, colore: 'polvere' }, lis(0.4, 0.9, v2))
    k.luce('telefono', { a: zDx, raggio: 0.12, colore: 'luce' }, 0.35 * w)
  }

  // 3 · Conferme e promemoria: un quadrante dietro la testa. La linea gira come la lancetta e accende i segni delle dodici ore;
  // in testa alla corsa una luce calda; finito il giro, un battito (l'appuntamento è confermato)
  if (v3 > 0 && v3 < 1) {
    const w = finestra(v3)
    const centro = vicino(k, 0, -0.32), r = 0.36
    const ora = (i: number): Vec2 => {
      const a = -Math.PI / 2 + (2 * Math.PI * i) / 12
      return [centro[0] + Math.cos(a) * largo(k, r), centro[1] + Math.sin(a) * r * h]
    }
    const giro = lis(0.05, 0.7, v3)
    k.linea('quadrante', { punti: Array.from({ length: 13 }, (_, i) => ora(i)), colore: 'polvere', spessore: 1.2, segni: true }, giro * (1 - lis(0.88, 1, v3)))
    const ang = -Math.PI / 2 + 2 * Math.PI * giro
    const punta: Vec2 = [centro[0] + Math.cos(ang) * largo(k, r), centro[1] + Math.sin(ang) * r * h]
    k.luce('lancetta', { a: punta, raggio: 0.06, colore: 'luce' }, 0.7 * w)
    k.pulsa('confermato', { a: ora(0), raggio: 0.09, colore: 'luce' }, lis(0.62, 0.85, v3))
  }

  // 4 · Ricontatto dei preventivi: una stella spenta lontana; una linea parte dalla zampa e la raggiunge, la stella si riaccende e
  // lui la tira a sé
  if (v4 > 0 && v4 < 1) {
    const w = finestra(v4)
    const lontana = nelQuadro(vicino(k, 0.62, -0.62))
    const curva: Vec2 = [(zDx[0] + lontana[0]) / 2 + 0.04, Math.min(zDx[1], lontana[1]) - 0.04]
    k.luce('lontana', { a: lontana, raggio: 0.09, colore: 'luce' }, (0.12 + 0.6 * lis(0.35, 0.6, v4)) * w)
    k.linea('richiamo', { punti: [zDx, curva, lontana], colore: 'polvere', spessore: 1.2, gocce: 5 }, lis(0, 0.4, v4) * (1 - lis(0.6, 0.9, v4)))
    k.getto('torna', { da: lontana, verso: zDx, colore: 'polvere', n: 12 * w, ampiezza: 0.2 }, lis(0.5, 0.95, v4))
  }

  // 5 · Clienti che tornano: una galassia gira dietro di lui e due scie di polvere rientrano verso il centro
  if (v5 > 0 && v5 < 1) {
    const w = finestra(v5)
    k.galassia('ritorno', { centro: vicino(k, 0, -0.05), raggio: largo(k, 0.55), bracci: 3 }, { alfa: 0.6 * w, giro: 1.4 * v5 })
    k.getto('scia-1', { da: [-0.1, 0.85], verso: zDx, colore: 'polvere', n: 12 * w, ampiezza: 0.5 }, lis(0.2, 0.8, v5))
    k.getto('scia-2', { da: [1.1, 0.7], verso: zDx, colore: 'polvere', n: 12 * w, ampiezza: 0.5 }, lis(0.3, 0.9, v5))
  }

  // 6 · Recensioni su Google: cinque stelle d'oro ad arco sopra la testa, si accendono una dopo l'altra; poi un battito
  if (v6 > 0 && v6 < 1) {
    const w = finestra(v6)
    const sopra = vicino(k, 0, -0.62)
    for (let i = 0; i < 5; i++) {
      const stella: Vec2 = [sopra[0] + (i - 2) * largo(k, 0.2), sopra[1] + 0.035 * h * (i - 2) ** 2]
      k.luce(`stella-${i + 1}`, { a: stella, raggio: 0.035, colore: 'luce' }, 0.8 * w * lis(0.08 + 0.12 * i, 0.22 + 0.12 * i, v6))
    }
    k.pulsa('cinque-stelle', { a: sopra, raggio: 0.14, colore: 'luce' }, lis(0.7, 0.9, v6))
  }

  // 7 · Su misura: una nuvola informe di polvere che, mentre lui la modella, diventa un anello preciso
  if (v7 > 0 && v7 < 1) {
    const w = finestra(v7)
    k.orbita('materia', { centro: vicino(k, 0, 0.02), raggio: [largo(k, 0.22), 0.08 * h], n: 30, colore: 'polvere' },
      { accese: 30, ordine: lis(0.1, 0.85, v7), velocita: 0.3 + 0.9 * lis(0.4, 1, v7), alfa: 0.9 * w })
    k.luce('forma', { a: vicino(k, 0, 0.02), raggio: 0.16, colore: 'perla' }, 0.3 * w)
    k.onda('presa-forma', { a: vicino(k, 0, 0.02), raggio: 0.3, colore: 'polvere' }, lis(0.7, 1, v7))
  }

  // la chiusura: l'anello si chiude tutto blu, un'onda, un punto caldo; lui lo solleva (gesto tenuto, dai dati)
  if (t.ben1 > 0) {
    k.luce('chiusura', { a: vicino(k, 0, -0.05), raggio: 0.6, colore: 'polvere' }, 0.35 * lis(0, 0.6, t.ben1))
    k.onda('chiude', { a: vicino(k, 0, -0.05), raggio: 0.7, colore: 'polvere' }, t.ben1)
    k.luce('punto-caldo', { a: nelQuadro(vicino(k, 0.45, -0.55)), raggio: 0.08, colore: 'luce' }, 0.5 * lis(0.4, 1, t.ben1))
  }

  // R18: la parola d'accento di ogni voce ha il suo fuoco vicino alla figura
  fuoco(k, v1, zSx); fuoco(k, v2, zDx); fuoco(k, v3, vicino(k, 0, -0.32)); fuoco(k, v4, zDx)
  fuoco(k, v5, c); fuoco(k, v6, vicino(k, 0, -0.62)); fuoco(k, v7, vicino(k, 0, 0.02)); fuoco(k, t.ben1, vicino(k, 0, -0.05))
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
