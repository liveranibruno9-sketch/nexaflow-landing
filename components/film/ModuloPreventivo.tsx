'use client'

// Il modulo "Richiedi un preventivo" (spec §9, D34): invia a /api/preventivo, poi n8n salva la richiesta, avvisa Bruno
// su Telegram e gli manda l'email. Etichette, suggerimenti ed esiti copiati lettera per lettera da testi.md §5.
// Sta sul nero della coda con i caratteri del film: righe sottili, nessun riquadro chiaro.
import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { CONTATTI } from './dati/contatti'
import type { Servizio } from './dati/contatti'
import {
  BUDGET,
  ETICHETTE_BUDGET,
  ETICHETTE_SERVIZIO,
  LUNGHEZZA_MASSIMA,
  LUNGHEZZA_MESSAGGIO,
  SERVIZI,
  tipoContatto,
} from './preventivo-calcoli'

const RIUSCITO = 'Grazie. Ho ricevuto la tua richiesta: ti scrivo io, Bruno, entro un giorno lavorativo.'

type Stato = 'pronto' | 'invio' | 'inviato' | 'errore'

export default function ModuloPreventivo({ servizio }: { servizio?: Servizio }) {
  const [stato, setStato] = useState<Stato>('pronto')
  // il pulsante si disattiva al primo clic, ma un secondo clic può arrivare prima del nuovo disegno: lo ferma questo
  const inCorso = useRef(false)
  const esito = useRef<HTMLParagraphElement>(null)
  const id = useId()

  useEffect(() => {
    if (stato === 'inviato') esito.current?.focus()
  }, [stato])

  async function invia(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (inCorso.current) return
    const modulo = e.currentTarget
    const contatto = modulo.elements.namedItem('contatto') as HTMLInputElement
    // contatto riconosciuto come telefono o email, altrimenti il browser lo segnala col suggerimento del campo
    contatto.setCustomValidity(tipoContatto(contatto.value) ? '' : 'Telefono o email')
    if (!modulo.reportValidity()) return

    const d = new FormData(modulo)
    const corpo = {
      nome: d.get('nome'),
      attivita: d.get('attivita'),
      contatto: d.get('contatto'),
      servizio: d.get('servizio'),
      budget: d.get('budget'),
      messaggio: d.get('messaggio') ?? '',
      consenso: d.get('consenso') === 'on',
      _gotcha: d.get('_gotcha') ?? '',
      // le prove (?prova=1 nell'indirizzo al momento dell'invio) finiscono nel registro con origine "prova"
      prova: new URLSearchParams(window.location.search).get('prova') === '1',
    }

    inCorso.current = true
    setStato('invio')
    try {
      const r = await fetch('/api/preventivo', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(corpo),
      })
      const risposta = (await r.json()) as { ok?: boolean }
      setStato(risposta.ok ? 'inviato' : 'errore')
    } catch {
      setStato('errore')
    } finally {
      inCorso.current = false
    }
  }

  if (stato === 'inviato') {
    return (
      <p ref={esito} tabIndex={-1} role="status" className="modulo-esito" data-prova="preventivo-inviato">
        {RIUSCITO}
      </p>
    )
  }

  return (
    <form className="modulo" method="post" onSubmit={invia}>
      <div className="modulo-campo">
        <label className="modulo-etichetta" htmlFor={`${id}-nome`}>Come ti chiami</label>
        <input className="modulo-input" id={`${id}-nome`} name="nome" type="text" required maxLength={LUNGHEZZA_MASSIMA} autoComplete="name" />
      </div>

      <div className="modulo-campo">
        <label className="modulo-etichetta" htmlFor={`${id}-attivita`}>La tua attività</label>
        <input
          className="modulo-input"
          id={`${id}-attivita`}
          name="attivita"
          type="text"
          required
          maxLength={LUNGHEZZA_MASSIMA}
          autoComplete="organization"
          placeholder="Es. agriturismo a Brisighella"
        />
      </div>

      <div className="modulo-campo">
        <label className="modulo-etichetta" htmlFor={`${id}-contatto`}>Dove ti ricontattiamo</label>
        <input
          className="modulo-input"
          id={`${id}-contatto`}
          name="contatto"
          type="text"
          required
          maxLength={LUNGHEZZA_MASSIMA}
          placeholder="Telefono o email"
          onInput={(e) => e.currentTarget.setCustomValidity('')}
        />
      </div>

      <div className="modulo-campo">
        <label className="modulo-etichetta" htmlFor={`${id}-servizio`}>Cosa ti serve</label>
        <div className="modulo-scelta">
          {/* già scelto se si arriva da una pagina servizio; altrimenti la scelta resta a chi scrive */}
          <select className="modulo-input" id={`${id}-servizio`} name="servizio" required defaultValue={servizio ?? ''}>
            <option value="" disabled />
            {SERVIZI.map((s) => <option value={s} key={s}>{ETICHETTE_SERVIZIO[s]}</option>)}
          </select>
        </div>
      </div>

      <div className="modulo-campo">
        <label className="modulo-etichetta" htmlFor={`${id}-budget`}>Quanto pensi di investire</label>
        <div className="modulo-scelta">
          <select className="modulo-input" id={`${id}-budget`} name="budget" required defaultValue="">
            <option value="" disabled />
            {BUDGET.map((b) => <option value={b} key={b}>{ETICHETTE_BUDGET[b]}</option>)}
          </select>
        </div>
      </div>

      <div className="modulo-campo modulo-largo">
        <label className="modulo-etichetta" htmlFor={`${id}-messaggio`}>Vuoi aggiungere qualcosa? (facoltativo)</label>
        <textarea className="modulo-input modulo-testo" id={`${id}-messaggio`} name="messaggio" rows={3} maxLength={LUNGHEZZA_MESSAGGIO} />
      </div>

      {/* campo trappola anti-spam: fuori vista, fuori dal tab, ignorato dai lettori di schermo */}
      <div className="modulo-trappola" aria-hidden="true">
        <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <label className="modulo-consenso modulo-largo">
        <input type="checkbox" name="consenso" required />
        <span>
          Ho letto l&apos;<a href="/privacy" target="_blank" rel="noopener">informativa sulla privacy</a>
        </span>
      </label>

      <button type="submit" className="modulo-invia modulo-largo" data-prova="invia-preventivo" disabled={stato === 'invio'} aria-busy={stato === 'invio'}>
        Invia la richiesta
      </button>

      {stato === 'errore' ? (
        <p role="alert" className="modulo-errore modulo-largo" data-prova="preventivo-non-riuscito">
          Qualcosa non ha funzionato. Scrivimi su WhatsApp al{' '}
          <a href={CONTATTI.whatsapp} target="_blank" rel="noopener">{CONTATTI.telefonoLeggibile}</a>: rispondo io.
        </p>
      ) : null}
    </form>
  )
}
