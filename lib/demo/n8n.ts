import type { ModuloDemo, RispostaDemo } from './tipi'

// Tramite verso i workflow n8n della demo. Da importare solo nelle route /api/demo (server):
// la chiave non deve mai arrivare al browser.

export const MODULI_DEMO: readonly ModuloDemo[] = ['m1', 'm2', 'm3', 'm5', 'm6']
const NON_DISPONIBILE = 'Demo momentaneamente non disponibile'

export async function chiamaN8n(modulo: ModuloDemo | 'accesso', corpo: unknown): Promise<RispostaDemo<unknown>> {
  const url = process.env.N8N_DEMO_URL
  const chiave = process.env.N8N_DEMO_CHIAVE
  if (!url || !chiave) return { ok: false, errore: 'Demo non configurata' }
  const controllo = new AbortController()
  const timer = setTimeout(() => controllo.abort(), 20000)
  try {
    const r = await fetch(`${url}/webhook/demo-studio-${modulo}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'X-Demo-Chiave': chiave },
      body: JSON.stringify(corpo),
      signal: controllo.signal,
      cache: 'no-store',
    })
    if (!r.ok) return { ok: false, errore: NON_DISPONIBILE }
    return (await r.json()) as RispostaDemo<unknown>
  } catch {
    return { ok: false, errore: NON_DISPONIBILE }
  } finally {
    clearTimeout(timer)
  }
}
