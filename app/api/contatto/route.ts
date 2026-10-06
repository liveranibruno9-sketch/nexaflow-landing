import { NextResponse, type NextRequest } from 'next/server'
import { inviaRichiestaSito } from '@/lib/demo/n8n'

export const dynamic = 'force-dynamic'

const MASSIMO_BYTE = 10 * 1024

// Modulo "Verifica gratuita" della home: pubblico (nessun cookie), inoltra la richiesta a n8n con la chiave.
export async function POST(req: NextRequest) {
  if (Number(req.headers.get('content-length') || 0) > MASSIMO_BYTE) {
    return NextResponse.json({ ok: false, errore: 'Richiesta troppo grande' }, { status: 413 })
  }
  let corpo: unknown
  try {
    corpo = await req.json()
  } catch {
    return NextResponse.json({ ok: false, errore: 'Richiesta non valida' }, { status: 400 })
  }
  const risposta = await inviaRichiestaSito(corpo)
  // gli errori di collegamento parlano di "demo": al visitatore basta sapere che l'invio non è riuscito
  const errore = risposta.ok ? undefined : /non disponibile|non configurata/i.test(risposta.errore ?? '') ? 'Invio non riuscito' : risposta.errore
  return NextResponse.json({ ok: risposta.ok, errore }, { status: risposta.ok ? 200 : 422, headers: { 'cache-control': 'no-store' } })
}
