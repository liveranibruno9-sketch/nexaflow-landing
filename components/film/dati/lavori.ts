// La bacheca dei lavori (spec §10, D3, D8). Modulo puro: lo importano anche i test di Node
// (solo `import type`, estensione .ts fra moduli puri).
// Al lancio l'elenco è VUOTO (R7): nessun atto "Lavori" in nessuna pagina, e /lavori/x risponde 404.
// Quando arriva il primo lavoro: lo si aggiunge qui sotto, si scrive il suo film in /lavori/[nome]
// e l'atto "03 · Lavori" si aggiunge alle regie (dati/servizio.ts, dati/home.ts) solo se lavoriDi(servizio) non è vuoto.
import type { Servizio } from './contatti.ts'

export type Lavoro = {
  slug: string
  nome: string
  servizi: Servizio[]
  /** sempre visibile sulla cartolina (D3) */
  tipo: 'cliente' | 'dimostrativo' | 'interno'
  /** il problema in una riga */
  problema: string
  /** cosa abbiamo fatto, in 3 etichette */
  fatto: [string, string, string]
  /** il prodotto vero: registrazione dello schermo e, se è online, il link */
  prodotto: { video?: string; link?: string }
  /** solo se misurato */
  risultato?: string
  /** il permesso del titolare, con la data: senza, un'attività vera non va online */
  permesso?: { di: string; data: string }
}

export const LAVORI: Lavoro[] = []

/** un lavoro di un cliente senza permesso del titolare non va online (D3); dimostrativi e interni sì */
export function pubblicabile(l: Lavoro): boolean {
  return l.tipo !== 'cliente' || l.permesso !== undefined
}

/** i lavori pubblicabili di un servizio (vuoto al lancio) */
export function lavoriDi(s: Servizio): Lavoro[] {
  return LAVORI.filter((l) => l.servizi.includes(s) && pubblicabile(l))
}
