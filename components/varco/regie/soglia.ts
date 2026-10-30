// La regia della soglia (tempo 1, storyboard §3.2 S1-S3 e tabella «Àncora» 1.1-1.11). L'anello è il protagonista: si scalda
// con la luce dello studio, accende un arco per problema, gira veloce, mostra la persona, si apre in quattro porte.
// Funzione pura: ogni battuta ha il suo evento (R18) e ogni parola d'accento il suo fuoco.
import type { Colore, Regia } from '../kit.ts'
import type { Vec2 } from '../tipi.ts'

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x)
const liscia = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}
/** un evento: sale con la frase, è pieno quando si legge tutta, si chiude prima della frase dopo */
const evento = (t: number) => liscia(0, 0.35, t) * (1 - liscia(0.75, 1, t))

/** il centro dell'anello nel quadro virtuale e i punti dei quattro archi (polvere in alto a sinistra, poi in senso orario) */
const ANELLO: Vec2 = [0.5, 0.5]
const ARCHI: Record<'polvere' | 'vetro' | 'saette' | 'cromo', Vec2> = {
  polvere: [0.3, 0.32],
  vetro: [0.7, 0.32],
  saette: [0.7, 0.68],
  cromo: [0.3, 0.68],
}

export const soglia: Regia = (t, f, k) => {
  // il nome è già tornato nell'anello (apertura): resta disfatto
  k.anello.ritorno(1)
  // 1.1 «Tu fai il tuo mestiere.»: si accende la luce calda in alto a sinistra e l'anello si scalda dal lato della lampada
  k.anello.caldo(liscia(0, 0.8, t['1']))
  k.luce('luce-studio', { a: [0.03, 0.06], raggio: 0.45, colore: 'luce' }, 0.45 * t['1'])
  // 1.2 «Al resto pensiamo noi.»: l'anello accelera, le quattro materie si svegliano
  const giro = 0.35 + 0.8 * t['2'] + 1.2 * t['7']
  k.anello.giro(giro)
  // 1.3-1.6: i quattro problemi, un arco acceso alla volta, con un getto della sua materia verso la camera
  const problemi: [string, 'polvere' | 'vetro' | 'saette' | 'cromo'][] = [['3', 'polvere'], ['4', 'vetro'], ['5', 'saette'], ['6', 'cromo']]
  for (const [ruolo, m] of problemi) {
    const e = evento(t[ruolo])
    // 1.7: l'anello intero si accende e resta acceso
    k.anello.arco(m, Math.max(e, t['7']))
    const colore: Colore = m
    k.getto(`getto-${m}`, { da: ARCHI[m], verso: 'camera', colore, n: 45, ampiezza: 0.7 }, t[ruolo])
  }
  k.luce('lampo-saette', { a: ARCHI.saette, raggio: 0.18, colore: 'saette' }, 0.6 * evento(t['5']))
  // 1.8 «E con una persona vera che risponde.»: nel foro nasce il punto di luce calda
  k.anello.punto(t['8'])
  // 1.9 «Quattro agenti. Uno studio.»: l'anello si apre in quattro archi che diventano quattro porte in fila
  k.anello.apri(t['9'])
  // 1.10 «Nomi antichi, lavoro nuovo.»: la camera attraversa il piano del cerchio e si aprono i fiumi di particelle
  k.getto('fiumi', { da: ANELLO, verso: 'camera', colore: 'polvere', n: 100, ampiezza: 1.6 }, t['10'])
  // 1.11 «Te li presentiamo.»: la prima porta, di polvere, viene incontro
  k.luce('porta-polvere', { a: ANELLO, raggio: 0.4, colore: 'polvere' }, 0.55 * evento(t['11']))
  k.getto('polvere-in-arrivo', { da: [0.5, 0.5], verso: 'camera', colore: 'polvere', n: 70, ampiezza: 0.9 }, t['11'])

  // il fuoco: da dove partono le particelle verso la parola d'accento, mentre la sua frase è in corso
  const fuoco = (v: number, p: Vec2) => {
    if (v > 0.05 && v < 1) k.fuoco(p)
  }
  fuoco(t['1'], [0.3, 0.45])
  fuoco(t['2'], ANELLO)
  fuoco(t['7'], ANELLO)
  fuoco(t['8'], ANELLO)
  fuoco(t['9'], ANELLO)
}
