// Calcoli puri della creatura nella scena del beneficio (D32): nessun accesso al DOM né al canvas, si provano con `npm test`.
// Solo TypeScript "cancellabile" (Node toglie i tipi): niente enum, namespace o parametri-proprietà.
import { liscio, tra01 } from './calcoli.ts'

/** il rettangolo del fotogramma 9:16 sul canvas (px del canvas) */
export type Fotogramma = { dx: number; dy: number; dw: number; dh: number }
export type Posto = { x: number; y: number; w: number; h: number }

export const DURATA_INGRESSO = 0.4   // u: la creatura entra da sinistra in b+3,0 → b+3,4
export const DURATA_USCITA = 0.3     // u: sfuma negli ultimi 0,3 della sua finestra
const LARGHEZZA = 0.38               // della colonna
const PIEDE = 0.96                   // del fotogramma, dall'alto
const MARGINE_X = 0.04               // la posa finale parte a 0,04 della colonna
const PARTENZA_X = -0.4              // l'ingresso parte a -0,4 della colonna
const BALZO = 4                      // px a 500 px di colonna: la creatura sale e scende
const GIRO = (1.5 * Math.PI) / 180   // rad: rotazione massima
const COLONNA_RIF = 500

const dentro = (n: number) => (typeof n === 'number' && isFinite(n) ? n : NaN)

/** dove siamo nella finestra della creatura: ingresso 0..1 (lineare), uscita = opacità 1..0 */
export function faseCreatura(c: { da: number; a: number }, u: number): { visibile: boolean; ingresso: number; uscita: number } {
  const x = dentro(u)
  if (isNaN(x) || !(c.a > c.da) || x < c.da || x > c.a) return { visibile: false, ingresso: 0, uscita: 0 }
  const durata = Math.min(DURATA_INGRESSO, c.a - c.da)
  return {
    visibile: true,
    ingresso: tra01((x - c.da) / durata),
    uscita: 1 - liscio(c.a - DURATA_USCITA, c.a, x),
  }
}

/**
 * Dove sta la creatura (px del canvas): larghezza 0,38 della colonna, piede a 0,96 dell'altezza, posa finale a 0,04 dalla
 * sinistra della colonna e ingresso da -0,4, liscio lungo `ingresso`. aspetto = larghezza / altezza del ritaglio.
 * xMin: la posa finale non va più a sinistra di così (sul telefono la colonna è più larga dello schermo);
 * piedeMax: il piede non va più in basso di così (c'è un testo sotto).
 */
export function postoCreatura(fot: Fotogramma, aspetto: number, ingresso: number, limiti?: { xMin?: number; piedeMax?: number }): Posto {
  const w = LARGHEZZA * fot.dw
  const h = w / aspetto
  const finale = Math.max(fot.dx + MARGINE_X * fot.dw, limiti?.xMin ?? -Infinity)
  const partenza = finale - (MARGINE_X - PARTENZA_X) * fot.dw
  const x = partenza + (finale - partenza) * liscio(0, 1, tra01(ingresso))
  const piede = Math.min(fot.dy + PIEDE * fot.dh, limiti?.piedeMax ?? Infinity)
  return { x, y: piede - h, w, h }
}

/** il moto a regime: dy in px (sale e scende), rot in radianti; nessuno scarto a tempo 0 */
export function ritmoCreatura(tempo: number, colonna: number): { dy: number; rot: number } {
  return {
    dy: BALZO * (colonna / COLONNA_RIF) * Math.sin(tempo * Math.PI),
    rot: GIRO * Math.sin(tempo * 2.2),
  }
}

/** il bagliore della fiammella di Prometheus: alfa 0,3 + 0,2·sin(6t) */
export function bagliore(tempo: number): number {
  return 0.3 + 0.2 * Math.sin(tempo * 6)
}

/**
 * fin dove può scendere il piede perché la creatura non copra un testo: se il testo (x0, x1, y0 = il suo bordo alto) sta sotto
 * la creatura in orizzontale, y0 meno il margine; altrimenti nessun limite (sul computer le frasi stanno fuori dalla colonna)
 */
export function piedeMassimo(creatura: { x0: number; x1: number }, testo: { x0: number; x1: number; y0: number } | null, margine: number): number | undefined {
  if (!testo) return undefined
  if (testo.x0 >= creatura.x1 || testo.x1 <= creatura.x0) return undefined
  return testo.y0 - margine
}
