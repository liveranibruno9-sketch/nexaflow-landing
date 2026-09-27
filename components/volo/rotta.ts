import { MODULI, PERDITE } from '../dati'

/**
 * La rotta del volo: le tappe in ordine, ognuna con la sua lunghezza di
 * scroll in "vh" (centesimi di altezza dello schermo).
 *
 * E l'unica fonte di verita condivisa fra il testo (components/volo/Volo.tsx)
 * e la scena 3D (components/volo/scena.ts): entrambi leggono la posizione
 * corrente come `u`, i vh percorsi dall'inizio del volo.
 */

export type TipoTappa = 'partenza' | 'perdita' | 'modulo' | 'rotta' | 'arrivo'

export type Tappa = {
  /** id HTML della tappa: e anche l'ancora dei collegamenti (#preventivi, #processo...) */
  id: string
  tipo: TipoTappa
  indice: number
  inizio: number
  durata: number
  etichetta: string
}

const DURATA: Record<TipoTappa, number> = {
  partenza: 100,
  perdita: 80,
  modulo: 210,
  rotta: 210,
  arrivo: 110,
}

export const TAPPE: Tappa[] = (() => {
  const tappe: Tappa[] = []
  let u = 0
  const aggiungi = (id: string, tipo: TipoTappa, indice: number, etichetta: string, durata = DURATA[tipo]) => {
    tappe.push({ id, tipo, indice, inizio: u, durata, etichetta })
    u += durata
  }
  aggiungi('top', 'partenza', 0, 'Partenza')
  // la prima perdita ospita anche il titolo della sezione: e piu lunga
  PERDITE.forEach((p, i) => aggiungi(i === 0 ? 'perdite' : `perdita-${i + 1}`, 'perdita', i, `Perdita ${p.n}`, i === 0 ? 110 : DURATA.perdita))
  MODULI.forEach((m, i) => aggiungi(m.slug, 'modulo', i, m.cielo.nome))
  aggiungi('processo', 'rotta', 0, 'La rotta')
  aggiungi('arrivo', 'arrivo', 0, 'Arrivo')
  return tappe
})()

/** lunghezza totale del volo, in vh di scroll */
export const LUNGHEZZA = TAPPE.reduce((totale, t) => totale + t.durata, 0)

/** fasi di un modulo, in frazione della sua tappa */
export const FASI = {
  avvicinamento: [0, 0.17],
  buio: [0.16, 0.35],
  cosaFa: [0.34, 0.53],
  comeFunziona: [0.52, 0.71],
  luce: [0.72, 0.95],
} as const

/** intervallo del modulo in cui le stelle si accendono, una dopo l'altra */
export const ACCENSIONE = { da: 0.34, a: 0.7 } as const

/** la tappa in corso alla posizione u */
export function tappaAl(u: number): Tappa {
  for (let i = TAPPE.length - 1; i >= 0; i--) if (u >= TAPPE[i].inizio) return TAPPE[i]
  return TAPPE[0]
}

/**
 * Stato di accensione di una costellazione: t va da 0 a `totale` e dice
 * quanti passi del flusso sono stati collegati (con la parte frazionaria
 * che rappresenta la linea in viaggio verso la stella successiva).
 */
export function passiAccesi(frazioneModulo: number, totale: number) {
  const t = (frazioneModulo - ACCENSIONE.da) / (ACCENSIONE.a - ACCENSIONE.da)
  return Math.min(totale, Math.max(0, t * totale))
}
