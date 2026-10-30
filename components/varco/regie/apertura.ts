// La regia dell'apertura (storyboard §3.1, A1-A3). Il nome nasce a tempo al caricamento (anello.ts); qui c'è ciò che segue lo
// scroll: le lettere che tornano nell'anello, l'anello che si accende con l'etichetta, le parole dei servizi nel colore del
// loro arco, il filo di particelle verso `Scorri`. Funzione pura: ogni battuta ha il suo evento (R18).
import type { Regia } from '../kit.ts'
import type { Vec2 } from '../tipi.ts'

/** il centro dell'anello nelle coordinate del quadro virtuale (telefono: cerchio al 40% dell'altezza, il quadro è centrato al 37%) */
const ANELLO: Vec2 = [0.5, 0.52]

export const apertura: Regia = (t, f, k) => {
  // «Agenti Studio»: scorrendo, le lettere si disfano e tornano nell'anello
  k.anello.nome(1 - t.nome)
  k.anello.ritorno(t.nome)
  // «Agenzia AI · Faenza, Romagna»: l'anello si accende quando l'etichetta compare
  k.luce('alone-anello', { a: ANELLO, raggio: 0.55, colore: 'blu' }, 0.25 * t.luogo)
  // «Automazioni · Siti web · Contenuti · Campagne»: ogni arco si accende nel suo colore (le parole lo seguono dal DOM)
  for (const m of ['polvere', 'vetro', 'saette', 'cromo'] as const) k.anello.arco(m, 0.35 + 0.65 * t.servizi)
  // «Scorri»: un filo di particelle scende dall'anello verso la scritta, finché non si scorre
  k.getto('filo', { da: [0.5, 0.9], verso: [0.5, 1.2], colore: 'blu', n: 40 * (1 - t.scorri), ampiezza: 0.1 }, 0.5)
}
