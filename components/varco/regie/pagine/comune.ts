// Pezzi comuni alle regie delle pagine dei servizi. Funzioni pure (R18): tutto dipende solo da `t`, tornando indietro si riavvolge.
import type { Kit, Regia } from '../../kit.ts'
import type { Vec2 } from '../../tipi.ts'

export const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x)
export const lis = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}
/** la parola d'accento ha il suo fuoco mentre la frase è in scena (R18): le particelle partono da lì */
export const fuoco = (k: Kit, v: number, p: Vec2) => {
  if (v > 0.05 && v < 1) k.fuoco(p)
}
/** un punto spostato dal centro della mascotte: dx e dy in altezze di mascotte; il quadro è 2,25 × 4, quindi dx si corregge */
export const vicino = (k: Kit, dx: number, dy: number): Vec2 => [k.soggetto.centro[0] + (dx * k.soggetto.altezza * 4) / 2.25, k.soggetto.centro[1] + dy * k.soggetto.altezza]
/** il raggio orizzontale (in larghezze di quadro) che corrisponde a `r` altezze di mascotte */
export const largo = (k: Kit, r: number) => (r * k.soggetto.altezza * 4) / 2.25

/** la scena del gioco «per la tua attività»: t = 0..1 dal momento della scelta; `scelta` = indice della scheda */
export type RegiaGioco = (s: { scelta: number; t: number }, k: Kit) => void
/** l'eco sul pulsante dell'invito: t = 0..1 dall'ingresso della sezione */
export type RegiaInvito = (t: number, k: Kit) => void
export type RegiePagina = { film: Record<string, Regia>; gioco: RegiaGioco; invito: RegiaInvito }

/** il punto d'arrivo di un lampo: lungo la direzione verso `a`, ma mai oltre 0,48 dal punto di partenza su ciascun asse (un lampo non copre più di un quarto dello schermo) */
export const corta = (da: Vec2, a: Vec2): Vec2 => {
  const dx = a[0] - da[0], dy = a[1] - da[1]
  const k = Math.min(1, 0.48 / Math.max(Math.abs(dx), 1e-6), 0.48 / Math.max(Math.abs(dy), 1e-6))
  return [da[0] + dx * k, da[1] + dy * k]
}
