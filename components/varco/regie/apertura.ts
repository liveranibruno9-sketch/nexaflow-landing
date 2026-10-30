// La regia dell'apertura (home v2): il cerchio gira da solo, un po' impetuoso; scorrendo, le particelle compongono il nome
// «Agenti Studio» nel foro (anello.ts), e il nome HTML vero compare sotto quando le lettere sono complete. Le etichette e
// `Scorri` sfumano con lo scroll. Funzione pura: ogni battuta ha il suo evento (R18).
import type { Regia } from '../kit.ts'
import type { Vec2 } from '../tipi.ts'

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x)
const liscia = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}

/** il centro dell'anello nel quadro virtuale */
const ANELLO: Vec2 = [0.5, 0.5]
/** quanto gira l'anello da fermo (impetuoso ma non troppo) e quando si è scorso fino in fondo */
export const GIRO_FERMO = 0.9
const GIRO_SCORSO = 0.45

export const apertura: Regia = (t, f, k) => {
  // «Agenti Studio»: le lettere si compongono fra il 10 e il 50% del blocco, restano, poi tornano nell'anello sull'ultimo 20%
  k.anello.nome(liscia(0.1, 0.5, t.nome) * (1 - liscia(0.8, 1, t.nome)))
  // da fermo l'anello gira con forza; scorrendo si calma
  k.anello.giro(GIRO_FERMO - (GIRO_FERMO - GIRO_SCORSO) * t.nome)
  // «Agenzia AI · Faenza, Romagna»: un alone blu attorno all'anello che sfuma con l'etichetta
  k.luce('alone-anello', { a: ANELLO, raggio: 0.55, colore: 'blu' }, 0.22 * (1 - t.luogo))
  // «Automazioni · Siti web · Contenuti · Campagne»: gli archi pieni finché la riga è visibile (le parole prendono il colore dell'arco in alto)
  for (const m of ['polvere', 'vetro', 'saette', 'cromo'] as const) k.anello.arco(m, 1 - 0.65 * t.servizi)
  // «Scorri»: un filo di particelle scende dall'anello verso la scritta, finché non si scorre
  k.getto('filo', { da: [0.5, 0.9], verso: [0.5, 1.2], colore: 'blu', n: 40 * (1 - t.scorri), ampiezza: 0.1 }, 0.5)
}
