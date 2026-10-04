// Firma del cookie d'accesso alla demo: HMAC-SHA256 del codice con la chiave condivisa con n8n.
// Usa solo Web Crypto, così funziona sia nel middleware (edge) sia nelle route (node).
// Se il codice cambia su Vercel, i cookie vecchi smettono di valere da soli.

export const COOKIE_DEMO = 'demo_accesso'

const esadecimale = (buf: ArrayBuffer) =>
  Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('')

export async function firma(codice: string, chiave: string): Promise<string> {
  const enc = new TextEncoder()
  const k = await crypto.subtle.importKey('raw', enc.encode(chiave), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  return esadecimale(await crypto.subtle.sign('HMAC', k, enc.encode(codice)))
}

export async function hash(testo: string): Promise<string> {
  return esadecimale(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(testo)))
}

// confronto a tempo costante tra due stringhe esadecimali della stessa lunghezza
export function uguali(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

export async function cookieValido(valore: string | undefined): Promise<boolean> {
  const codice = process.env.DEMO_CODICE
  const chiave = process.env.N8N_DEMO_CHIAVE
  if (!valore || !codice || !chiave) return false
  return uguali(valore, await firma(codice, chiave))
}
