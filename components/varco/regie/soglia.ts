// La regia della soglia (home v2): due frasi sole, «Tu fai il tuo mestiere.» e «Al resto pensiamo noi.». L'anello si scalda
// con la luce dello studio, poi si apre in quattro porte verso i servizi. PROVVISORIA: Bruno vuole un'animazione diversa qui
// (un piano infografico che accompagni lo scroll), da studiare dopo con le skill giuste. Funzione pura (R18).
import type { Regia } from '../kit.ts'
import type { Vec2 } from '../tipi.ts'

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x)
const liscia = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}

const ANELLO: Vec2 = [0.5, 0.5]

export const soglia: Regia = (t, f, k) => {
  // le lettere sono già tornate nell'anello
  k.anello.nome(0)
  // 1 «Tu fai il tuo mestiere.»: si accende la luce calda in alto a sinistra e l'anello si scalda dal lato della lampada
  k.anello.caldo(liscia(0, 0.8, t['1']))
  k.luce('luce-studio', { a: [0.03, 0.06], raggio: 0.45, colore: 'luce' }, 0.45 * t['1'])
  // 2 «Al resto pensiamo noi.»: le quattro materie si accendono, l'anello accelera e si apre in quattro porte in fila
  for (const m of ['polvere', 'vetro', 'saette', 'cromo'] as const) k.anello.arco(m, 0.35 + 0.65 * t['2'])
  k.anello.giro(0.5 + 1.0 * t['2'])
  k.anello.apri(liscia(0.35, 1, t['2']))
  k.getto('verso-i-servizi', { da: ANELLO, verso: 'camera', colore: 'polvere', n: 60, ampiezza: 1.2 }, liscia(0.5, 1, t['2']))

  const fuoco = (v: number, p: Vec2) => {
    if (v > 0.05 && v < 1) k.fuoco(p)
  }
  fuoco(t['1'], [0.3, 0.45])
  fuoco(t['2'], ANELLO)
}
