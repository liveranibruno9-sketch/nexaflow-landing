'use client'

import type { ReactNode } from 'react'
import { dataBreve } from '@/lib/demo/formato'

// Intestazione di una pagina demo: servizio, giorno simulato, azioni della demo e ripristino.
export default function BarraDemo({
  sigla,
  nome,
  strumento,
  giorno,
  azioni,
  onRipristina,
  occupato,
  errore,
  inLavorazione,
  messaggioLavoro = 'Sto scrivendo…',
}: {
  sigla: string
  nome: string
  strumento: string
  giorno?: string
  azioni?: ReactNode
  onRipristina: () => void
  occupato: boolean
  errore: string | null
  inLavorazione: boolean
  messaggioLavoro?: string
}) {
  return (
    <header className="mb-6" data-prova="barra" data-occupato={String(occupato)}>
      <span className="occhiello">
        {sigla} · {nome}
      </span>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <h1 className="display text-s4 leading-[1.02]">{strumento}</h1>
        {giorno && (
          <p className="mono text-s-2 text-[var(--neutro)]">
            Giorno simulato <span className="num ml-1 text-[var(--bianco)]">{dataBreve(giorno)}</span>
          </p>
        )}
      </div>
      <div className="non-stampare mt-5 flex flex-wrap items-center gap-3">
        {azioni}
        <button
          type="button"
          data-prova="ripristina"
          onClick={onRipristina}
          className="btn btn-fantasma !min-h-[44px] !px-5 !py-2.5"
        >
          Ripristina demo
        </button>
      </div>
      <div aria-live="polite" className="non-stampare mt-4 min-h-[1.5rem]">
        {inLavorazione ? (
          <p data-prova="lavorazione" className="flex items-center gap-2.5 text-s-1 text-[var(--celeste)]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--celeste)]" aria-hidden="true" />
            {messaggioLavoro}
          </p>
        ) : errore ? (
          <p role="alert" data-prova="errore" className="text-s-1 text-[var(--arancio)]">
            {errore}
          </p>
        ) : null}
      </div>
    </header>
  )
}
