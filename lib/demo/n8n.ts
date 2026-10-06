import type { ModuloDemo, RispostaDemo } from './tipi'

// Tramite verso i workflow n8n (demo e modulo "Verifica gratuita"). Da importare solo nelle route
// /api (server): la chiave non deve mai arrivare al browser.

export const MODULI_DEMO: readonly ModuloDemo[] = ['m1', 'm2', 'm3', 'm5', 'm6']
const NON_DISPONIBILE = 'Demo momentaneamente non disponibile'

export function chiamaN8n(modulo: ModuloDemo | 'accesso', corpo: unknown): Promise<RispostaDemo<unknown>> {
  return chiamaWebhook(`demo-studio-${modulo}`, corpo)
}

// il modulo "Verifica gratuita" del sito: salva la richiesta e avvisa Bruno (workflow "SITO - Richiesta verifica gratuita")
export function inviaRichiestaSito(corpo: unknown): Promise<RispostaDemo<unknown>> {
  return chiamaWebhook('sito-richiesta-verifica', corpo)
}

async function chiamaWebhook(percorso: string, corpo: unknown): Promise<RispostaDemo<unknown>> {
  const url = process.env.N8N_DEMO_URL
  const chiave = process.env.N8N_DEMO_CHIAVE
  if (!url || !chiave) return { ok: false, errore: 'Demo non configurata' }
  for (let tentativo = 1; ; tentativo++) {
    const controllo = new AbortController()
    const timer = setTimeout(() => controllo.abort(), 20000)
    try {
      const r = await fetch(`${url}/webhook/${percorso}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'X-Demo-Chiave': chiave },
        body: JSON.stringify(corpo),
        signal: controllo.signal,
        cache: 'no-store',
      })
      if (!r.ok) return { ok: false, errore: NON_DISPONIBILE }
      return (await r.json()) as RispostaDemo<unknown>
    } catch (e) {
      // si riprova solo se la richiesta non è partita: rifarla non può eseguire due volte un'azione
      if (tentativo < 3 && nonPartita(e)) {
        await new Promise((ok) => setTimeout(ok, 800))
        continue
      }
      return { ok: false, errore: NON_DISPONIBILE }
    } finally {
      clearTimeout(timer)
    }
  }
}

const ERRORI_PRIMA_DELL_INVIO = ['ENOTFOUND', 'EAI_AGAIN', 'ECONNREFUSED', 'UND_ERR_CONNECT_TIMEOUT']

function nonPartita(e: unknown): boolean {
  const codice = (e as { cause?: { code?: string } })?.cause?.code
  return !!codice && ERRORI_PRIMA_DELL_INVIO.includes(codice)
}
