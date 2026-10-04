import { MODULI } from '@/components/dati'
import type { ModuloDemo } from './tipi'

// I 5 servizi della demo: nome, sigla e promessa vengono dal sito (components/dati.ts), una sola fonte.
type Base = { modulo: ModuloDemo; slugSito: string; percorso: string; strumento: string }

const BASE: Base[] = [
  { modulo: 'm1', slugSito: 'preventivi', percorso: '/demo/preventivi', strumento: 'Pagina "Preventivi"' },
  { modulo: 'm2', slugSito: 'segreteria', percorso: '/demo/chiamate', strumento: 'Registro "Chiamate ricevute"' },
  { modulo: 'm3', slugSito: 'richiami', percorso: '/demo/riattivazione', strumento: 'Pagina "Carica l’export"' },
  { modulo: 'm5', slugSito: 'recensioni', percorso: '/demo/recensioni', strumento: 'Pagina "Visite di oggi"' },
  { modulo: 'm6', slugSito: 'fondi', percorso: '/demo/fondi', strumento: 'Pagina "Pratiche fondi"' },
]

export const SERVIZI_DEMO = BASE.map((b) => {
  const m = MODULI.find((x) => x.slug === b.slugSito)
  if (!m) throw new Error(`Servizio ${b.slugSito} assente da components/dati.ts`)
  return { ...b, sigla: m.sigla, nome: m.nome, promessa: m.promessa }
})

export type ServizioDemo = (typeof SERVIZI_DEMO)[number]

export const servizio = (modulo: ModuloDemo): ServizioDemo => SERVIZI_DEMO.find((s) => s.modulo === modulo)!
