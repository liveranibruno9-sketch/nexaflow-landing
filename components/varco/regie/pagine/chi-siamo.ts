// Le regie di /chi-siamo (DESIGN_SPEC-pagine §13): la lampada calda che sta in alto a sinistra in ogni scena del sito si rivela una
// persona. Scorrendo la luce cresce e diventa un cono dall'alto; il nome «Bruno Liverani · Faenza» si scrive nella luce (la foto si
// monterà dopo); le quattro mascotte entrano nella luce, ognuna col suo nome sotto i piedi.
import type { Regia } from '../../kit.ts'
import { fuoco, lis } from './comune.ts'
import type { RegiePagina } from './comune.ts'

const apertura: Regia = (t, f, k) => {
  // quattro correnti di materia, una per colore, partono dalla luce verso i quattro bordi: «più lontano»
  k.getto('c-polvere', { da: [0.2, 0.15], verso: [-0.3, -0.1], colore: 'polvere', n: 60 * t.h1, ampiezza: 0.6 }, t.h1)
  k.getto('c-vetro', { da: [0.2, 0.15], verso: [1.3, -0.1], colore: 'vetro', n: 60 * t.h1, ampiezza: 0.6 }, t.h1)
  k.getto('c-saette', { da: [0.2, 0.15], verso: [1.3, 1.1], colore: 'saette', n: 60 * t.sotto, ampiezza: 0.6 }, t.sotto)
  k.getto('c-cromo', { da: [0.2, 0.15], verso: [-0.3, 1.1], colore: 'cromo', n: 60 * t.sotto, ampiezza: 0.6 }, t.sotto)
  k.luce('lampada', { a: [0.15, 0.1], raggio: 0.5, colore: 'luce' }, 0.18 + 0.12 * t.indice * (0.5 + 0.5 * t.pulsante))
}

const persona: Regia = (t, f, k) => {
  const c = k.soggetto.centro
  // la camera si gira verso la luce: l'alone cresce (lo fa il mondo) e qui diventa un cono dall'alto
  k.raggi('cono', { da: [c[0], -0.12], verso: [c[0], c[1] + 0.25], apertura: 0.9, n: 18, colore: 'luce' }, lis(0, 1, t.h2))
  k.luce('cono-luce', { a: [c[0], c[1] - 0.05], raggio: 0.5, colore: 'luce' }, 0.4 * t.h2 + 0.2 * t.f1)
  // «Mi chiamo Bruno Liverani»: il nome affiora nel cono
  k.onda('nome', { a: [c[0], c[1]], raggio: 0.45, colore: 'luce' }, t.f1)
  // «Ogni lavoro lo seguo io»: una linea sottile calda si disegna sotto il nome
  k.linea('seguo', { punti: [[c[0] - 0.28, c[1] + 0.1], [c[0] + 0.28, c[1] + 0.1]], colore: 'luce', spessore: 1.0 }, t.f2)
  // «Con me lavorano Atlas, Janus, Prometheus e Hermes»: le quattro materie entrano nella luce, una da ogni lato
  k.getto('e-polvere', { da: [-0.1, 0.9], verso: [c[0] - 0.2, c[1] + 0.3], colore: 'polvere', n: 30, ampiezza: 0.3 }, t.f3)
  k.getto('e-vetro', { da: [0.25, 1.1], verso: [c[0] - 0.08, c[1] + 0.35], colore: 'vetro', n: 30, ampiezza: 0.3 }, t.f3)
  k.getto('e-saette', { da: [0.75, 1.1], verso: [c[0] + 0.08, c[1] + 0.35], colore: 'saette', n: 30, ampiezza: 0.3 }, t.f4)
  k.getto('e-cromo', { da: [1.1, 0.9], verso: [c[0] + 0.2, c[1] + 0.3], colore: 'cromo', n: 30, ampiezza: 0.3 }, t.f4)
  // «ti risponde una persona»: una piccola scintilla calda parte dalla luce e si posa sul tasto WhatsApp (in basso a destra)
  k.getto('scintilla', { da: [c[0], c[1]], verso: [0.92, 0.94], colore: 'luce', n: 6, ampiezza: 0.05 }, t.f5)
  k.luce('whatsapp', { a: [0.92, 0.94], raggio: 0.12, colore: 'luce' }, 0.4 * lis(0.5, 1, t.f5))
  k.luce('nome-luce', { a: [c[0], c[1]], raggio: 0.3, colore: 'luce' }, 0.3 * t.nome)
  fuoco(k, t.f1, [c[0], c[1]]); fuoco(k, t.f2, [c[0], c[1] + 0.1]); fuoco(k, t.f5, [0.92, 0.94])
}

/** le sezioni dopo il film: la scena non c'è (la mascotte, nella sezione dei servizi, fa le sue capacità in piccolo) */
export const REGIE_CHI_SIAMO: RegiePagina = {
  film: { 'chi-siamo-a': apertura, 'chi-siamo-f': persona },
  gioco: () => {},
  invito: (t, k) => {
    // l'invito: le quattro mascotte si avvicinano al pulsante (la posa la dà il mondo); qui solo la luce
    k.luce('pulsante', { a: [0.5, 0.5], raggio: 0.4, colore: 'luce' }, 0.25 * lis(0.1, 1, t))
  },
}
