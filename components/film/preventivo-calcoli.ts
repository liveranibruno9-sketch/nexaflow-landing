// Il modulo "Richiedi un preventivo" (spec §9, D34): scelte, riconoscimento del contatto e controllo della richiesta.
// Modulo puro, senza DOM: lo usano il modulo, la route /api/preventivo e i test di Node (`npm test`).
// La stessa logica, in JavaScript, gira nel nodo "Valida" del workflow n8n "SITO - Richiesta preventivo"
// (vault: agenzia-360/strumenti/valida-preventivo.js): se cambia qui, va cambiata anche lì.
// Solo TypeScript "cancellabile" (Node toglie i tipi): niente enum, namespace o parametri-proprietà.

export const SERVIZI = ['automazioni', 'siti-web', 'contenuti', 'campagne', 'non-so'] as const
export const BUDGET = ['fino-1000', '1000-3000', 'oltre-3000', 'non-so'] as const

export type ServizioRichiesta = (typeof SERVIZI)[number]
export type Budget = (typeof BUDGET)[number]

/** testi delle scelte, da testi.md §5. Le cifre sono il budget del cliente, non i nostri prezzi (R4) */
export const ETICHETTE_SERVIZIO: Record<ServizioRichiesta, string> = {
  automazioni: 'Automazioni',
  'siti-web': 'Siti web',
  contenuti: 'Contenuti',
  campagne: 'Campagne',
  'non-so': 'Non lo so ancora',
}
export const ETICHETTE_BUDGET: Record<Budget, string> = {
  'fino-1000': 'Fino a 1.000 €',
  '1000-3000': '1.000-3.000 €',
  'oltre-3000': 'Oltre 3.000 €',
  'non-so': 'Non lo so',
}

export type Richiesta = {
  nome: string
  attivita: string
  contatto: string
  servizio: ServizioRichiesta
  budget: Budget
  messaggio: string
  consenso: true
  prova: boolean
}

export const LUNGHEZZA_MASSIMA = 200
export const LUNGHEZZA_MESSAGGIO = 1000
const NON_VALIDA = 'Richiesta non valida'

/** email se c'è una chiocciola con un punto dopo; telefono se, tolti spazi, punti, trattini e "+", restano 8-15 cifre */
export function tipoContatto(s: string): 'email' | 'telefono' | null {
  const t = String(s ?? '').trim()
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)) return 'email'
  if (/^\d{8,15}$/.test(t.replace(/[\s.+-]/g, ''))) return 'telefono'
  return null
}

/** testo a riga singola: caratteri di controllo (a capo, tabulazioni, NUL) diventano uno spazio, gli spazi si riducono a uno
 *  (niente "\r\nBcc: …" che finisce in un'intestazione email), poi trim */
function testo(v: unknown): string {
  const t = typeof v === 'string' ? v : typeof v === 'number' && Number.isFinite(v) ? String(v) : ''
  return t.replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim()
}

/** testo libero (messaggio): via i caratteri di controllo tranne l'a capo; "\r\n" diventa "\n"; poi trim */
function testoLibero(v: unknown): string {
  const t = typeof v === 'string' ? v : typeof v === 'number' && Number.isFinite(v) ? String(v) : ''
  return t.replace(/\r\n?/g, '\n').replace(/[\u0000-\u0009\u000b-\u001f\u007f]+/g, '').trim()
}

/** false sul dominio vero (agentistudio.it, www, con eventuale porta o punto finale): lì `prova: true` non vale.
 *  Anteprime Vercel e localhost sì. Si guarda l'intestazione `host`, che Vercel imposta sul dominio richiesto. */
export function provaAmmessa(host: string): boolean {
  return !/^(www\.)?agentistudio\.it\.?(:\d+)?$/.test(String(host ?? '').trim().toLowerCase())
}

function fra<T extends string>(scelte: readonly T[], v: string): v is T {
  return (scelte as readonly string[]).includes(v)
}

export function validaPreventivo(corpo: unknown): { ok: true; dati: Richiesta } | { ok: false; errore: string } {
  if (!corpo || typeof corpo !== 'object' || Array.isArray(corpo)) return { ok: false, errore: NON_VALIDA }
  const c = corpo as Record<string, unknown>
  // campo trappola: lo compilano solo i bot
  if (testo(c._gotcha)) return { ok: false, errore: NON_VALIDA }

  const nome = testo(c.nome)
  const attivita = testo(c.attivita)
  const contatto = testo(c.contatto)
  const servizio = testo(c.servizio)
  const budget = testo(c.budget)
  const messaggio = testoLibero(c.messaggio)

  if (!nome) return { ok: false, errore: 'Manca il nome' }
  if (!attivita) return { ok: false, errore: "Manca l'attività" }
  if (!contatto) return { ok: false, errore: 'Manca il telefono o l’email' }
  if (nome.length > LUNGHEZZA_MASSIMA || attivita.length > LUNGHEZZA_MASSIMA || contatto.length > LUNGHEZZA_MASSIMA) {
    return { ok: false, errore: 'Testo troppo lungo' }
  }
  if (messaggio.length > LUNGHEZZA_MESSAGGIO) return { ok: false, errore: 'Messaggio troppo lungo' }
  if (!tipoContatto(contatto)) return { ok: false, errore: 'Il contatto non sembra un telefono o un’email' }
  if (!fra(SERVIZI, servizio)) return { ok: false, errore: 'Servizio non valido' }
  if (!fra(BUDGET, budget)) return { ok: false, errore: 'Fascia di budget non valida' }
  if (c.consenso !== true) return { ok: false, errore: 'Serve il consenso al trattamento dei dati' }

  return { ok: true, dati: { nome, attivita, contatto, servizio, budget, messaggio, consenso: true, prova: c.prova === true } }
}
