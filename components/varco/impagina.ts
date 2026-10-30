// Spazi del varco: dove sta il quadro sullo schermo e dove sta il testo (nessun accesso al DOM): si provano con `npm test`.
// Solo TypeScript "cancellabile" (Node toglie i tipi): niente enum, namespace o parametri-proprietà.

/**
 * altezza = altezza del quadro in altezze di schermo; cx, cy = centro del quadro in frazioni dello schermo;
 * fascia = il rettangolo del testo in frazioni dello schermo (sempre nello stesso posto: storyboard regola 8).
 */
export type Impaginazione = { ritratto: boolean; altezza: number; cx: number; cy: number; fascia: { x0: number; x1: number; y0: number; y1: number } }

/**
 * Telefono dritto (aspetto < 1): il quadro largo quanto lo schermo (1,08 volte), alzato, testo in basso.
 * Computer: quadro al centro-destra, testo nella colonna di sinistra. Telefono in orizzontale (altezza < 500 px):
 * quadro un po' più piccolo e fascia più alta, perché il testo non finisca sotto la barra dei contatti.
 */
export function impagina(aspetto: number, altezzaPx: number): Impaginazione {
  if (aspetto < 1) {
    return { ritratto: true, altezza: (1.08 * aspetto * 16) / 9, cx: 0.5, cy: 0.37, fascia: { x0: 0.06, x1: 0.94, y0: 0.64, y1: 0.84 } }
  }
  if (altezzaPx < 500) {
    return { ritratto: false, altezza: 1.0, cx: 0.66, cy: 0.5, fascia: { x0: 0.06, x1: 0.4, y0: 0.14, y1: 0.8 } }
  }
  return { ritratto: false, altezza: 1.08, cx: 0.66, cy: 0.5, fascia: { x0: 0.06, x1: 0.4, y0: 0.25, y1: 0.75 } }
}

/**
 * Distanza dalla camera a cui il quadro (alto `altezzaQuadro` unità del mondo, 4 di default) occupa `imp.altezza`
 * altezze di schermo con un campo visivo verticale di `fovGradi`.
 */
export function sosta(imp: Impaginazione, fovGradi: number, altezzaQuadro = 4): number {
  return altezzaQuadro / (2 * Math.tan((fovGradi * Math.PI) / 360) * imp.altezza)
}
