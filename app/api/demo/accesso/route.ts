import { NextResponse, type NextRequest } from 'next/server'
import { COOKIE_DEMO, firma, hash, uguali } from '@/lib/demo/firma'
import { chiamaN8n } from '@/lib/demo/n8n'

export const dynamic = 'force-dynamic'

const TRENTA_GIORNI = 60 * 60 * 24 * 30

// Verifica il codice d'accesso alla demo. I tentativi sbagliati li conta n8n per IP (solo l'hash):
// dopo 10 in un'ora l'IP resta bloccato finché i tentativi non escono dalla finestra.
export async function POST(req: NextRequest) {
  const codiceGiusto = process.env.DEMO_CODICE
  const chiave = process.env.N8N_DEMO_CHIAVE
  if (!codiceGiusto || !chiave) return NextResponse.json({ ok: false, errore: 'Demo non configurata' }, { status: 503 })

  let codice = ''
  try {
    const corpo = await req.json()
    codice = typeof corpo?.codice === 'string' ? corpo.codice.trim() : ''
  } catch {
    return NextResponse.json({ ok: false, errore: 'Richiesta non valida' }, { status: 400 })
  }

  const indirizzo = req.ip || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'locale'
  const ip = await hash(`${chiave}:${indirizzo}`)
  const controllo = await chiamaN8n('accesso', { azione: 'controlla', ip })
  if (!controllo.ok) return NextResponse.json({ ok: false, errore: controllo.errore }, { status: 503 })
  if (controllo.bloccato) {
    return NextResponse.json({ ok: false, errore: 'Troppi tentativi. Riprova tra un’ora.' }, { status: 429 })
  }

  const valido = codice.length > 0 && uguali(await firma(codice, chiave), await firma(codiceGiusto, chiave))
  if (!valido) {
    await chiamaN8n('accesso', { azione: 'errore', ip })
    return NextResponse.json({ ok: false, errore: 'Codice non valido' }, { status: 401 })
  }

  const risposta = NextResponse.json({ ok: true })
  risposta.cookies.set(COOKIE_DEMO, await firma(codiceGiusto, chiave), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: TRENTA_GIORNI,
  })
  return risposta
}
