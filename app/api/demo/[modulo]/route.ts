import { NextResponse, type NextRequest } from 'next/server'
import { chiamaN8n, MODULI_DEMO } from '@/lib/demo/n8n'
import type { ModuloDemo } from '@/lib/demo/tipi'

export const dynamic = 'force-dynamic'

const MASSIMO_BYTE = 3 * 1024 * 1024

// Inoltra l'azione della pagina al workflow n8n del modulo, aggiungendo la chiave segreta.
// L'accesso è già stato verificato dal middleware.
export async function POST(req: NextRequest, { params }: { params: { modulo: string } }) {
  if (!MODULI_DEMO.includes(params.modulo as ModuloDemo)) {
    return NextResponse.json({ ok: false, errore: 'Modulo inesistente' }, { status: 404 })
  }
  const lunghezza = Number(req.headers.get('content-length') || 0)
  if (lunghezza > MASSIMO_BYTE) {
    return NextResponse.json({ ok: false, errore: 'File troppo grande: il massimo è 2 MB' }, { status: 413 })
  }
  let corpo: unknown
  try {
    corpo = await req.json()
  } catch {
    return NextResponse.json({ ok: false, errore: 'Richiesta non valida' }, { status: 400 })
  }
  const risposta = await chiamaN8n(params.modulo as ModuloDemo, corpo)
  const nonRaggiungibile = !risposta.ok && risposta.errore === 'Demo momentaneamente non disponibile'
  return NextResponse.json(risposta, { status: nonRaggiungibile ? 503 : 200, headers: { 'cache-control': 'no-store' } })
}
