'use client'

import { useState, type FormEvent } from 'react'

export default function Accesso() {
  const [codice, setCodice] = useState('')
  const [errore, setErrore] = useState<string | null>(null)
  const [invio, setInvio] = useState(false)

  async function entra(e: FormEvent) {
    e.preventDefault()
    if (!codice.trim()) return setErrore('Inserisca il codice')
    setInvio(true)
    setErrore(null)
    try {
      const r = await fetch('/api/demo/accesso', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ codice }),
      })
      const d = await r.json()
      if (d.ok) {
        window.location.href = '/demo'
        return
      }
      setErrore(d.errore || 'Codice non valido')
    } catch {
      setErrore('Demo momentaneamente non disponibile')
    }
    setInvio(false)
  }

  return (
    <div className="mx-auto mt-[8vh] max-w-[440px]">
      <form onSubmit={entra} className="vetro rounded-xl3 p-7 sm:p-9">
        <span className="occhiello">Area riservata</span>
        <h1 className="display mt-3 text-s3 leading-[1.05]">Le demo di Agenti Studio</h1>
        <p className="mt-3 text-s-1 text-[var(--neutro)]">Inserisca il codice d’accesso per provare i servizi su uno studio dentistico inventato.</p>
        <label htmlFor="codice" className="mono mt-7 block text-s-2 uppercase tracking-[0.12em] text-[var(--neutro)]">
          Codice d’accesso
        </label>
        <input
          id="codice"
          data-prova="codice"
          type="password"
          autoComplete="current-password"
          value={codice}
          onChange={(e) => setCodice(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-[var(--bordo-forte)] bg-[#0B1020] px-4 py-3.5 text-s0 text-[var(--bianco)] outline-none transition-colors focus:border-[var(--celeste)]"
        />
        <p role="alert" className="mt-3 min-h-[1.4rem] text-s-1 text-[var(--arancio)]">
          {errore}
        </p>
        <button type="submit" data-prova="entra" disabled={invio} className="btn btn-primario mt-2 w-full disabled:opacity-50">
          {invio ? 'Verifico…' : 'Entra'}
        </button>
      </form>
    </div>
  )
}
