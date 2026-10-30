// Dove sta la mascotte nelle pagine dei servizi (DESIGN_SPEC-pagine §8.2, §8.6): protagonista nell'apertura, arretrata nel problema che
// «fa un passo nella luce» all'ultima riga, di nuovo protagonista nella capacità; dopo il film (u = lunghezza) esce, e ricompare solo
// dove una sezione le tiene un'àncora (il gioco, le tappe, l'invito). Funzione pura: si prova con `npm test`.
import { ribalta } from './coreografia.ts'
import type { Posa, Schermo } from './coreografia.ts'

/** il posto che una sezione offre alla mascotte: centro e altezza in frazioni dello schermo (y dall'alto) */
export type Ancora = { x: number; y: number; altezza: number }

export type ContestoPosa = {
  u: number
  /** secondi dal caricamento della pagina (la mascotte si compone in 1,8 s e saluta una volta) */
  secondi: number
  lunghezza: number
  /** u in cui comincia il problema e in cui riprende la capacità (le righe del problema: la terza «fa un passo nella luce») */
  problema: number
  terzaRiga: number
  schermo: Schermo
  ancora: Ancora | null
  /** quante schermate si sono scorse oltre la fine del film (0 durante il film): la mascotte esce quando il palco se ne va */
  dopo: number
  /** 0..1, quanto la mascotte è «ospitata» da un'àncora (con la molla del mondo) */
  pesoAncora: number
}

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x)
const liscia = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}
const mix = (a: number, b: number, t: number) => a + (b - a) * t
const rimbalzo = (t: number) => {
  if (t <= 0) return 0
  if (t >= 1) return 1
  const c = 1.70158
  return 1 + (c + 1) * (t - 1) ** 3 + c * (t - 1) ** 2
}

/** quanto dura la composizione all'arrivo e quando saluta (secondi): una volta sola per visita */
export const NASCITA = 1.8
export const SALUTO_DA = 1.6
export const SALUTO_A = 3.1

export function posaPagina(c: ContestoPosa): Posa {
  const s = c.schermo
  const r = ribalta(s)
  const L = c.lunghezza
  // arretra nel problema e torna con la terza riga
  const dentro = liscia(c.problema - 0.1, c.problema + 0.3, c.u) * (1 - liscia(c.terzaRiga - 0.05, c.terzaRiga + 0.3, c.u))
  // sul telefono, finita l'apertura, le cartoline non ci sono più: la mascotte si porta al centro
  const centro = s.ritratto ? liscia(c.problema - 0.1, c.problema + 0.2, c.u) : 0
  const x0 = mix(r.x, s.ritratto ? 0.5 : r.x, centro)
  const filmX = mix(x0, s.ritratto ? 0.7 : 0.8, dentro)
  // sul telefono il testo sta nella fascia bassa (60-90%): la mascotte sale un poco e si fa più piccola, il nome sotto i piedi sta sopra il testo
  const ry = r.y - (s.ritratto ? 0.045 : 0)
  const filmY = ry + (s.ritratto ? -0.02 : 0.025) * dentro
  const filmH = (s.ritratto ? r.altezza * 0.92 : r.altezza) * (1 - 0.3 * dentro)
  const esce = liscia(0.06, 0.7, c.dopo)
  const nasce = rimbalzo(clamp01(c.secondi / NASCITA))
  const filmPresenza = nasce * (1 - liscia(0.55, 1, esce))
  const filmSaluto = c.u < 0.4 ? liscia(SALUTO_DA, SALUTO_DA + 0.3, c.secondi) * (1 - liscia(SALUTO_A - 0.4, SALUTO_A, c.secondi)) : 0
  const w = clamp01(c.pesoAncora)
  const a = c.ancora
  const x = a ? mix(filmX, a.x, w) : filmX
  const y = (a ? mix(filmY, a.y, w) : filmY) - 0.6 * esce * esce * (1 - w)
  const altezza = a ? mix(filmH, a.altezza, w) : filmH
  return {
    x, y, altezza,
    z: 0,
    giro: s.ritratto ? 0 : -0.18 * (1 - w),
    inclina: 0,
    presenza: Math.max(filmPresenza, w),
    saluto: filmSaluto * (1 - w),
    lato: r.lato,
    abbraccio: 0, abbraccioSx: false, abbraccioDx: false, felice: 0,
  }
}

/* ---------- Chi siamo: le quattro mascotte entrano nella luce attorno a Bruno ---------- */
export type ContestoChi = {
  u: number; secondi: number; lunghezza: number
  /** u in cui comincia la frase «Con me lavorano...»: da lì le quattro entrano da quattro lati e si fermano a semicerchio */
  ingresso: number
  schermo: Schermo
  ancora: Ancora | null
  dopo: number
  pesoAncora: number
}
/** il posto di ogni mascotte nella luce: computer a semicerchio sotto il cono, telefono due sopra e due sotto il nome */
const NELLA_LUCE_PC: [number, number][] = [[0.5, 0.74], [0.6, 0.8], [0.74, 0.8], [0.84, 0.74]]
const NELLA_LUCE_TEL: [number, number][] = [[0.2, 0.4], [0.4, 0.47], [0.6, 0.47], [0.8, 0.4]]
const DA_DOVE: [number, number][] = [[-0.2, 0.9], [0.25, 1.3], [0.75, 1.3], [1.2, 0.9]]

export function posaChiSiamo(i: number, c: ContestoChi): Posa {
  const s = c.schermo
  const fine = (s.ritratto ? NELLA_LUCE_TEL : NELLA_LUCE_PC)[i]
  const da = DA_DOVE[i]
  const e = liscia(c.ingresso + 0.1 * i, c.ingresso + 0.1 * i + 0.55, c.u)
  const esce = liscia(0.06, 0.7, c.dopo)
  const w = clamp01(c.pesoAncora)
  const a = c.ancora
  const x = a ? mix(mix(da[0], fine[0], e), a.x, w) : mix(da[0], fine[0], e)
  const y = (a ? mix(mix(da[1], fine[1], e), a.y, w) : mix(da[1], fine[1], e)) - 0.5 * esce * esce * (1 - w)
  const h0 = s.ritratto ? 0.15 : 0.22
  const saluta = i === 3 ? liscia(c.ingresso + 0.7, c.ingresso + 0.9, c.u) * (1 - liscia(c.ingresso + 1.5, c.ingresso + 1.7, c.u)) : 0
  return {
    x, y, altezza: a ? mix(h0, a.altezza, w) : h0, z: 0, giro: (0.5 - x) * 0.9, inclina: 0,
    presenza: Math.max(e * rimbalzo(clamp01(c.secondi / 0.6)) * (1 - liscia(0.55, 1, esce)), w), saluto: saluta * (1 - w),
    lato: x < 0.5 ? 'destro' : 'sinistro', abbraccio: 0, abbraccioSx: false, abbraccioDx: false, felice: 0,
  }
}
