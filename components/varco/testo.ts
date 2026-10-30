// Funzioni pure sui testi del varco (nessun accesso al DOM): si provano con `npm test`.
// Solo TypeScript "cancellabile" (Node toglie i tipi): niente enum, namespace o parametri-proprietà.

/**
 * Dove comincia la parola d'accento dentro la frase: la prima occorrenza come parola intera (non dentro un'altra:
 * "te" in "intestati a te" è l'ultima, non quella di "intestati"). -1 se non c'è o se manca l'accento.
 */
export function posizioneAccento(testo: string, accento?: string): number {
  if (!accento) return -1
  // niente espressioni regolari con lookbehind o proprietà Unicode: Safari prima della 16.4 le rifiuta e romperebbe il disegno dei testi
  const lettera = (c: string) => c !== '' && (c.toLowerCase() !== c.toUpperCase() || (c >= '0' && c <= '9'))
  for (let i = testo.indexOf(accento); i >= 0; i = testo.indexOf(accento, i + 1)) {
    const prima = i > 0 ? testo[i - 1] : ''
    const dopo = testo[i + accento.length] ?? ''
    if (!lettera(prima) && !lettera(dopo)) return i
  }
  return -1
}
