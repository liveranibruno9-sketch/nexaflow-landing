// La regia della soglia (home v2.4, D47): «Chi pensa al resto mentre lavori?» / «Noi.». Arriva dopo la consegna: le quattro
// correnti del vortice sono uscite dallo schermo e il centro è vuoto e calmo. Con la domanda si accende una sola luce calda al
// centro (chi lavora); con «Noi.» le quattro materie tornano come luci dai quattro angoli verso il centro, da dove erano uscite,
// e un'onda parte dalla parola. Funzione pura (R18).
import type { Regia } from '../kit.ts'
import type { Materia, Vec2 } from '../tipi.ts'

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x)
const liscia = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}

const CENTRO: Vec2 = [0.5, 0.5]
/** da dove erano uscite le quattro correnti (stesso ordine di scaglie.ts) */
const ANGOLI: [Materia, Vec2][] = [['polvere', [0.08, 0.1]], ['vetro', [0.92, 0.1]], ['saette', [0.92, 0.9]], ['cromo', [0.08, 0.9]]]

export const soglia: Regia = (t, f, k) => {
  // 1: una luce calda sola, al centro: chi lavora
  k.luce('chi-lavora', { a: CENTRO, raggio: 0.38, colore: 'luce' }, 0.35 * liscia(0, 0.4, t['1']) * (1 - 0.4 * liscia(0, 0.5, t['2'])))
  // 2 «Noi.»: le quattro materie rientrano dagli angoli verso il centro, un'onda dalla parola
  const v = liscia(0, 0.6, t['2'])
  for (const [m, da] of ANGOLI) {
    const a: Vec2 = [da[0] + (CENTRO[0] - da[0]) * 0.55 * v, da[1] + (CENTRO[1] - da[1]) * 0.55 * v]
    k.luce(`rientra-${m}`, { a, raggio: 0.22, colore: m }, 0.45 * liscia(0, 0.3, t['2']))
  }
  k.onda('noi', { a: CENTRO, raggio: 0.45, colore: 'blu' }, t['2'])

  const fuoco = (p: number, dove: Vec2) => {
    if (p > 0.05 && p < 1) k.fuoco(dove)
  }
  fuoco(t['1'], [0.45, 0.45])
  fuoco(t['2'], CENTRO)
}
