import { NextResponse, type NextRequest } from 'next/server'
import { inviaRichiestaSito } from '@/lib/demo/n8n'

export const dynamic = 'force-dynamic'

const MASSIMO_BYTE = 10 * 1024
const LUNGHEZZA_CAMPO = 200
const CAMPI_TESTO = ['studio', 'titolare', 'citta', 'telefono', 'gestionale'] as const
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const risposta = (ok: boolean, errore: string | undefined, stato: number) =>
  NextResponse.json({ ok, errore }, { status: stato, headers: { 'cache-control': 'no-store' } })

// Modulo "Verifica gratuita" della home: pubblico (nessun cookie), inoltra la richiesta a n8n con la chiave.
// Il controllo del browser non basta: qui si ripetono i controlli, si tengono solo i campi previsti e si
// scartano in silenzio le richieste del campo trappola (il bot crede di avercela fatta).
export async function POST(req: NextRequest) {
  if (Number(req.headers.get('content-length') || 0) > MASSIMO_BYTE) return risposta(false, 'Richiesta troppo grande', 413)
  const origine = req.headers.get('origin')
  if (origine && new URL(origine).host !== req.nextUrl.host) return risposta(false, 'Richiesta non valida', 403)

  let corpo: unknown
  try {
    corpo = await req.json()
  } catch {
    return risposta(false, 'Richiesta non valida', 400)
  }
  if (typeof corpo !== 'object' || corpo === null || Array.isArray(corpo)) return risposta(false, 'Richiesta non valida', 400)
  const dati = corpo as Record<string, unknown>

  if (typeof dati._gotcha === 'string' && dati._gotcha.trim() !== '') return risposta(true, undefined, 200)

  const pulito: Record<string, string | boolean> = {}
  for (const campo of [...CAMPI_TESTO, 'email'] as const) {
    const v = dati[campo]
    if (v !== undefined && typeof v !== 'string') return risposta(false, 'Richiesta non valida', 400)
    // niente a capo: i valori finiscono in email e fogli di calcolo
    pulito[campo] = (v ?? '').replace(/[\r\n\t]+/g, ' ').trim().slice(0, LUNGHEZZA_CAMPO)
  }
  if (!pulito.studio || !pulito.titolare || !pulito.citta || !pulito.telefono) return risposta(false, 'Compila i campi obbligatori', 422)
  if (!EMAIL.test(String(pulito.email))) return risposta(false, 'Indirizzo email non valido', 422)
  if (dati.consenso !== true) return risposta(false, 'Serve il consenso al trattamento dei dati', 422)
  pulito.consenso = true
  pulito._gotcha = ''

  const esito = await inviaRichiestaSito(pulito)
  // gli errori di collegamento parlano di "demo": al visitatore basta sapere che l'invio non è riuscito
  const errore = esito.ok ? undefined : /non disponibile|non configurata/i.test(esito.errore ?? '') ? 'Invio non riuscito' : esito.errore
  return risposta(esito.ok, errore, esito.ok ? 200 : 422)
}
