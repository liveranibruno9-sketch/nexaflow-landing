import { NextResponse, type NextRequest } from 'next/server'
import { validaPreventivo } from '@/components/film/preventivo-calcoli'
import { inviaRichiestaPreventivo } from '@/lib/demo/n8n'

export const dynamic = 'force-dynamic'

const MASSIMO_BYTE = 10 * 1024
const SENZA_CACHE = { 'cache-control': 'no-store' }

// Modulo "Richiedi un preventivo" delle pagine film (spec §9, D34): pubblico (nessun cookie). Controlla la richiesta
// e solo se è valida la inoltra a n8n con la chiave (workflow "SITO - Richiesta preventivo").
export async function POST(req: NextRequest) {
  if (Number(req.headers.get('content-length') || 0) > MASSIMO_BYTE) {
    return NextResponse.json({ ok: false, errore: 'Richiesta troppo grande' }, { status: 413, headers: SENZA_CACHE })
  }
  let corpo: unknown
  try {
    const testo = await req.text()
    // senza content-length (invio a pezzi) il limite si controlla sul testo ricevuto
    if (testo.length > MASSIMO_BYTE) {
      return NextResponse.json({ ok: false, errore: 'Richiesta troppo grande' }, { status: 413, headers: SENZA_CACHE })
    }
    corpo = JSON.parse(testo)
  } catch {
    return NextResponse.json({ ok: false, errore: 'Richiesta non valida' }, { status: 400, headers: SENZA_CACHE })
  }
  const v = validaPreventivo(corpo)
  if (!v.ok) return NextResponse.json({ ok: false, errore: v.errore }, { status: 422, headers: SENZA_CACHE })

  // a n8n arrivano solo i campi controllati e ripuliti (niente campo trappola)
  const risposta = await inviaRichiestaPreventivo(v.dati)
  // gli errori di collegamento parlano di "demo": al visitatore basta sapere che l'invio non è riuscito
  const errore = risposta.ok ? undefined : /non disponibile|non configurata/i.test(risposta.errore ?? '') ? 'Invio non riuscito' : risposta.errore
  return NextResponse.json({ ok: risposta.ok, errore }, { status: risposta.ok ? 200 : 422, headers: SENZA_CACHE })
}
