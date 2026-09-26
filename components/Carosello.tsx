'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Carosello orizzontale.
 *
 * Il problema che risolve: con la barra di scorrimento nascosta, chi consulta
 * il sito non capisce che ci sono altre schede e l'ultima resta tagliata.
 * Qui la barra e visibile e stilizzata, ci sono due frecce che si disattivano
 * agli estremi, e un indicatore di posizione.
 *
 * Lo scorrimento resta quello nativo del browser: momentum sul telefono,
 * navigazione da tastiera, e zero dipendenze.
 */
export default function Carosello({
  children,
  etichetta,
  className = '',
  largo = false,
}: {
  children: React.ReactNode
  etichetta: string
  className?: string
  /** schede piu larghe, per contenuti con piu testo */
  largo?: boolean
}) {
  const pista = useRef<HTMLDivElement>(null)
  const [aSinistra, setASinistra] = useState(true)
  const [aDestra, setADestra] = useState(false)
  const [avanzamento, setAvanzamento] = useState(0)

  const aggiorna = useCallback(() => {
    const el = pista.current
    if (!el) return
    const massimo = el.scrollWidth - el.clientWidth
    setASinistra(el.scrollLeft <= 2)
    setADestra(el.scrollLeft >= massimo - 2)
    setAvanzamento(massimo > 0 ? el.scrollLeft / massimo : 0)
  }, [])

  useEffect(() => {
    const el = pista.current
    if (!el) return
    aggiorna()
    el.addEventListener('scroll', aggiorna, { passive: true })
    const ro = new ResizeObserver(aggiorna)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', aggiorna)
      ro.disconnect()
    }
  }, [aggiorna])

  const scorri = (verso: 1 | -1) => {
    const el = pista.current
    if (!el) return
    const prima = el.firstElementChild as HTMLElement | null
    const passo = prima ? prima.getBoundingClientRect().width + 16 : el.clientWidth * 0.8
    el.scrollBy({ left: passo * verso, behavior: 'smooth' })
  }

  return (
    <div className={className}>
      <div
        ref={pista}
        className={`carosello ${largo ? 'carosello--largo' : ''} -mx-[clamp(1.25rem,4vw,3rem)] px-[clamp(1.25rem,4vw,3rem)]`}
        role="group"
        aria-label={etichetta}
        tabIndex={0}
      >
        {children}
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            className="freccia-car"
            onClick={() => scorri(-1)}
            disabled={aSinistra}
            aria-label="Scheda precedente"
          >
            <Chevron verso="sinistra" />
          </button>
          <button
            type="button"
            className="freccia-car"
            onClick={() => scorri(1)}
            disabled={aDestra}
            aria-label="Scheda successiva"
          >
            <Chevron verso="destra" />
          </button>
        </div>

        <div className="car-barra" aria-hidden="true">
          <div className="car-barra__fill" style={{ width: `${Math.max(12, avanzamento * 100)}%` }} />
        </div>

        <span className="car-stato">{aDestra ? 'fine' : 'scorri'}</span>
      </div>
    </div>
  )
}

function Chevron({ verso }: { verso: 'sinistra' | 'destra' }) {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d={verso === 'destra' ? 'M6 3l5 5-5 5' : 'M10 3L5 8l5 5'}
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
