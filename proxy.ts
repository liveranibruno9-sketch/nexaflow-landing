import { NextResponse, type NextRequest } from 'next/server'
import { COOKIE_DEMO, cookieValido } from '@/lib/demo/firma'

// Protegge le pagine e le API della demo: senza il cookie firmato si torna alla pagina del codice.
// Next 16: «middleware» si chiama «proxy» e gira su Node (Web Crypto c'è anche lì: vedi lib/demo/firma.ts).
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (pathname === '/demo/accesso' || pathname === '/api/demo/accesso') return NextResponse.next()
  if (await cookieValido(req.cookies.get(COOKIE_DEMO)?.value)) return NextResponse.next()
  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ ok: false, errore: 'Accesso alla demo scaduto: inserisci di nuovo il codice' }, { status: 401 })
  }
  const url = req.nextUrl.clone()
  url.pathname = '/demo/accesso'
  url.search = ''
  return NextResponse.redirect(url)
}

export const config = { matcher: ['/demo/:path*', '/api/demo/:path*'] }
