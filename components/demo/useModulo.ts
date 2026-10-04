'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { ModuloDemo, RispostaDemo, StatoBase } from '@/lib/demo/tipi'

const OGNI_MS = 2000
const ARRENDITI_MS = 60000

// Collega una pagina demo al suo workflow n8n. Mentre l'AI lavora (stato.lavorazione) interroga
// lo stato ogni 2 secondi; la lettura non scrive mai sul server, quindi non può perdere i testi.
export function useModulo<S extends StatoBase>(modulo: ModuloDemo) {
  const [stato, setStato] = useState<S | null>(null)
  const [errore, setErrore] = useState<string | null>(null)
  const [inVolo, setInVolo] = useState(false)
  const montato = useRef(true)

  const chiama = useCallback(
    async (azione: string, dati: Record<string, unknown> = {}, silenziosa = false): Promise<RispostaDemo<S>> => {
      if (!silenziosa) setInVolo(true)
      try {
        const r = await fetch(`/api/demo/${modulo}`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ ...dati, azione }),
        })
        if (r.status === 401) {
          window.location.href = '/demo/accesso'
          return { ok: false }
        }
        const d = (await r.json()) as RispostaDemo<S>
        if (!montato.current) return d
        if (d.stato) setStato(d.stato)
        if (!silenziosa || !d.ok) setErrore(d.ok ? null : d.errore || 'Qualcosa non ha funzionato, riprova')
        return d
      } catch {
        if (montato.current) setErrore('Demo momentaneamente non disponibile')
        return { ok: false, errore: 'Demo momentaneamente non disponibile' }
      } finally {
        if (!silenziosa && montato.current) setInVolo(false)
      }
    },
    [modulo],
  )

  useEffect(() => {
    montato.current = true
    chiama('leggi', {}, true)
    return () => {
      montato.current = false
    }
  }, [chiama])

  const inLavorazione = !!stato?.lavorazione
  useEffect(() => {
    if (!inLavorazione) return
    const inizio = Date.now()
    const id = window.setInterval(() => {
      if (Date.now() - inizio > ARRENDITI_MS) {
        window.clearInterval(id)
        setErrore('Il sistema ci sta mettendo più del solito: ricarica la pagina tra qualche secondo')
        return
      }
      chiama('leggi', {}, true)
    }, OGNI_MS)
    return () => window.clearInterval(id)
  }, [inLavorazione, chiama])

  return {
    stato,
    errore: errore ?? stato?.errore ?? null,
    inLavorazione,
    occupato: inVolo || inLavorazione,
    invia: (azione: string, dati?: Record<string, unknown>) => chiama(azione, dati),
  }
}
