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

/**
 * Il percorso di una particella del tocco: Bézier quadratica da `da` ad `a`, con il punto di controllo a metà strada
 * e alzato del 30% della distanza (sullo schermo la y cresce verso il basso, quindi "alzato" = y minore). t in 0..1.
 */
export function curvaTocco(t: number, da: [number, number], a: [number, number]): [number, number] {
  const u = t <= 0 ? 0 : t >= 1 ? 1 : t
  const d = Math.hypot(a[0] - da[0], a[1] - da[1])
  const cx = (da[0] + a[0]) / 2
  const cy = (da[1] + a[1]) / 2 - 0.3 * d
  const k0 = (1 - u) * (1 - u)
  const k1 = 2 * (1 - u) * u
  const k2 = u * u
  return [k0 * da[0] + k1 * cx + k2 * a[0], k0 * da[1] + k1 * cy + k2 * a[1]]
}
