// Le regie dei blocchi di sezione della home v2: il titolo «I nostri servizi», i quattro servizi con la mascotte
// (una fabbrica: cambiano materia e punti), la squadra che si riunisce, il finale verso il modulo. Funzioni pure (R18).
import type { Regia } from '../kit.ts'
import type { Materia, Vec2 } from '../tipi.ts'

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x)
const liscia = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}
const fuoco = (k: Parameters<Regia>[2], v: number, p: Vec2) => {
  if (v > 0.05 && v < 1) k.fuoco(p)
}
const CENTRO: Vec2 = [0.5, 0.5]

/** «I nostri servizi»: le mascotte girano accanto al titolo (le muove la coreografia), la polvere dei fiumi si infittisce verso la camera */
export const intro: Regia = (t, f, k) => {
  k.getto('fiumi-in-arrivo', { da: CENTRO, verso: 'camera', colore: 'polvere', n: 100, ampiezza: 1.6 }, t.titolo)
  k.luce('soglia-servizi', { a: CENTRO, raggio: 0.5, colore: 'blu' }, 0.3 * liscia(0, 0.5, t.titolo) * (1 - liscia(0.7, 1, t.titolo)))
}

/**
 * Un servizio con la sua mascotte: col titolo la creatura si accende, col paragrafo le sue particelle in orbita prendono il colore
 * una dopo l'altra, col collegamento una riga della materia sottolinea. `centro` = il centro della creatura nella sua foto.
 */
export function mascotte(materia: Materia, centro: Vec2): Regia {
  return (t, f, k) => {
    k.luce('mascotte', { a: centro, raggio: 0.3, colore: materia }, 0.45 * liscia(0, 0.6, t.titolo))
    k.orbita('aura', { centro, raggio: [0.55, 0.38], n: 24, colore: materia }, { accese: 24 * t.paragrafo, ordine: 0.2 + 0.8 * t.paragrafo, velocita: 0.8, alfa: 0.9 * f.foto[1] })
    k.linea('sottolinea', { punti: [[0.06, 1.03], [0.6, 1.03]], colore: materia, spessore: 1.2, gocce: 6 }, t.link)
    // le tre cartoline: dove si posa ognuna, un piccolo battito della materia della mascotte
    CARTOLINE.forEach((punto, i) => k.pulsa(`cartolina-${i + 1}`, { a: punto, raggio: 0.07, colore: materia }, t[`foto-${i + 1}`] ?? 0))
    fuoco(k, t.paragrafo, centro)
  }
}

/** dove si posano le cartoline, nel quadro (a metà fra telefono e computer: è solo il battito che le accompagna) */
const CARTOLINE: Vec2[] = [[0.15, 0.32], [0.88, 0.5], [0.15, 0.68]]

// Punti misurati con Read su public/film/scene/<mascotte>-2-720.webp: il centro della creatura (x da sinistra, y dall'alto, in frazioni)
export const CENTRI: Record<'atlas' | 'janus' | 'prometheus' | 'hermes', Vec2> = {
  atlas: [0.52, 0.5],
  janus: [0.5, 0.5],
  prometheus: [0.5, 0.5],
  hermes: [0.5, 0.48],
}

/**
 * la squadra: le quattro mascotte tornano dall'alto e si abbracciano al centro (il moto lo fa la coreografia); la luce calda le
 * accoglie e il pavimento si accende di blu sotto i loro piedi. Questa regia vive nel quadro al centro dello schermo.
 */
export const squadra: Regia = (t, f, k) => {
  k.luce('raduno', { a: CENTRO, raggio: 0.6, colore: 'luce' }, 0.35 * liscia(0, 0.5, t.sopra))
  k.luce('pavimento', { a: [0.5, 0.6], raggio: 0.32, colore: 'blu' }, 0.16 * liscia(0, 0.5, t.sotto))
  fuoco(k, t.sopra, [0.5, 0.1])
  fuoco(k, t.sotto, [0.5, 0.82])
}

/** il finale: le quattro materie si avvicinano al centro, si chiudono in un piccolo cerchio attorno al pulsante, che si accende */
export const finale: Regia = (t, f, k) => {
  const materie: Materia[] = ['polvere', 'vetro', 'saette', 'cromo']
  const angoli: Vec2[] = [[0.2, 0.3], [0.8, 0.3], [0.8, 0.7], [0.2, 0.7]]
  const v = liscia(0, 0.6, t['1'])
  materie.forEach((m, i) => {
    const a: Vec2 = [angoli[i][0] + (0.5 - angoli[i][0]) * 0.6 * t['2'], angoli[i][1] + (0.5 - angoli[i][1]) * 0.6 * t['2']]
    k.luce(`materia-${m}`, { a, raggio: 0.14, colore: m }, 0.4 * v)
  })
  // il cerchio di particelle attorno al pulsante non c'è più: c'è la grafica dei posti (Varco.tsx, D45)
  k.luce('pulsante', { a: CENTRO, raggio: 0.3, colore: 'blu' }, 0.3 * t.pulsante)
  fuoco(k, t['2'], CENTRO)
}
