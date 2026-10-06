'use client'

import { useState, type FormEvent } from 'react'
import { CONTATTO } from './dati'

const CAMPI = [
  { id: 'studio', label: 'Nome dello studio', type: 'text', required: true, auto: 'organization' },
  { id: 'titolare', label: 'Il suo nome', type: 'text', required: true, auto: 'name' },
  { id: 'citta', label: 'Città', type: 'text', required: true, auto: 'address-level2' },
  { id: 'telefono', label: 'Telefono dello studio', type: 'tel', required: true, auto: 'tel' },
  { id: 'email', label: 'Email', type: 'email', required: true, auto: 'email' },
  { id: 'gestionale', label: 'Gestionale in uso (se lo sa)', type: 'text', required: false, auto: 'off' },
]

// Il modulo della verifica gratuita: invia a /api/contatto (poi n8n salva, avvisa Bruno e gli manda l'email).
export default function ModuloVerifica() {
  const [stato, setStato] = useState<'pronto' | 'invio' | 'inviato'>('pronto')
  const [errore, setErrore] = useState<string | null>(null)

  async function invia(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const dati = Object.fromEntries(new FormData(e.currentTarget).entries())
    setStato('invio')
    setErrore(null)
    try {
      const r = await fetch('/api/contatto', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...dati, consenso: dati.consenso === 'on' }),
      })
      const d = await r.json()
      if (d.ok) return setStato('inviato')
      setErrore(d.errore || 'Invio non riuscito')
    } catch {
      setErrore('Invio non riuscito')
    }
    setStato('pronto')
  }

  if (stato === 'inviato') {
    return (
      <div role="status" data-prova="richiesta-inviata" className="vetro rounded-xl3 p-6 sm:p-8">
        <span className="occhiello">Richiesta ricevuta</span>
        <p className="display mt-4 text-s2 leading-tight">Grazie, la richiamo entro due giorni lavorativi.</p>
        <p className="mt-4 text-s-1 tenue">
          Se nel frattempo vuole aggiungere qualcosa, scriva a{' '}
          <a href={`mailto:${CONTATTO.email}`} className="underline underline-offset-2 hover:text-[var(--blu-luce)]">
            {CONTATTO.email}
          </a>
          .
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={invia} className="vetro rounded-xl3 p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        {CAMPI.map((c) => (
          <div key={c.id} className={c.id === 'studio' || c.id === 'gestionale' ? 'sm:col-span-2' : ''}>
            <label htmlFor={c.id} className="occhiello !text-[var(--neutro)]">
              {c.label}
              {c.required ? <span className="text-[var(--blu-luce)]"> *</span> : null}
            </label>
            <input
              id={c.id}
              name={c.id}
              type={c.type}
              required={c.required}
              autoComplete={c.auto}
              maxLength={200}
              className="mt-2 w-full rounded-xl border border-[var(--bordo-forte)] bg-[color-mix(in_srgb,#05070F_55%,transparent)] px-4 py-3 text-s0 text-[var(--bianco)] outline-none transition-colors focus:border-[var(--celeste)]"
            />
          </div>
        ))}
      </div>

      {/* campo trappola anti-spam, invisibile agli umani */}
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      <label className="mt-7 flex cursor-pointer items-start gap-3">
        <input type="checkbox" name="consenso" required className="mt-1 h-4 w-4 shrink-0 accent-[var(--blu)]" />
        <span className="text-s-2 leading-relaxed tenue">
          Acconsento al trattamento dei dati per essere ricontattato su questa richiesta, come descritto nella{' '}
          <a href="/privacy" className="underline underline-offset-2 hover:text-[var(--blu-luce)]">
            privacy policy
          </a>
          .
        </span>
      </label>

      <button type="submit" data-prova="invia-richiesta" disabled={stato === 'invio'} className="btn btn-primario mt-7 w-full disabled:opacity-60">
        {stato === 'invio' ? 'Invio in corso…' : 'Richiedi la verifica gratuita'}
      </button>

      {errore && (
        <p role="alert" className="mt-4 text-s-1 text-[var(--arancio)]">
          {errore}. Se non riesce, scriva direttamente a {CONTATTO.email}.
        </p>
      )}

      <p className="mt-5 text-s-2 tenue">
        Oppure scriva direttamente a{' '}
        <a href={`mailto:${CONTATTO.email}`} className="underline underline-offset-2 hover:text-[var(--blu-luce)]">
          {CONTATTO.email}
        </a>
      </p>
    </form>
  )
}
