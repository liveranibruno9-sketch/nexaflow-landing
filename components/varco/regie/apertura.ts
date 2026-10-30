// La regia dell'apertura (home v2.2, D45): il big bang lo fa l'anello da solo (da un punto nasce il cerchio che gira forte);
// scorrendo, le particelle compongono il nome «Agenti Studio» nel foro e lo tengono a lungo, poi tornano nell'anello mentre passa
// il banner (chi siamo, cosa facciamo, dove siamo). Funzione pura: ogni battuta ha il suo evento (R18).
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
export const GIRO_FERMO = 2.4
const GIRO_SCORSO = 1.1

export const apertura: Regia = (t, f, k) => {
  // «Agenti Studio»: le lettere si compongono appena si scorre (3-20% del blocco), restano pieno fino al 55%, tornano nell'anello col banner
  k.anello.nome(liscia(0.03, 0.2, t.nome) * (1 - liscia(0.55, 0.68, t.nome)))
  // da fermo l'anello gira con forza; scorrendo si calma un po'
  k.anello.giro(GIRO_FERMO - (GIRO_FERMO - GIRO_SCORSO) * liscia(0, 0.4, t.nome))
  // «Faenza, Romagna» (nel banner): l'alone blu attorno all'anello si spegne mentre il banner passa
  k.luce('alone-anello', { a: ANELLO, raggio: 0.55, colore: 'blu' }, 0.22 * (1 - t.luogo))
  // «Automazioni · Siti web · Contenuti · Campagne» (nel banner): gli archi pieni fino al banner, poi si abbassano
  for (const m of ['polvere', 'vetro', 'saette', 'cromo'] as const) k.anello.arco(m, 1 - 0.65 * t.servizi)
  // «Scorri»: un filo di particelle scende dall'anello verso la scritta, finché non si scorre
  k.getto('filo', { da: [0.5, 0.9], verso: [0.5, 1.2], colore: 'blu', n: 40 * (1 - t.scorri), ampiezza: 0.1 }, 0.5)
}
