'use client'

// Il gioco «per la tua attività» (DESIGN_SPEC-pagine §8.8, §8.11): una scelta col pollice, sei mestieri. Gruppo di schede ARIA
// (tablist): frecce, Home, Fine, aria-selected, pannello con aria-live. Senza JavaScript diventa l'elenco di tutte le schede.
// Alla scelta la mascotte fa il suo gesto e la scena cambia (lo comunica l'evento `pagina:scelta` al mondo): nella scena nessun testo.
import { useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import type { Scheda } from '../dati/pagine.ts'

export default function Gioco({ h2, scelte, ancoraScala = 0.9 }: { h2: string; scelte: Scheda[]; ancoraScala?: number }) {
  const [sel, setSel] = useState(0)
  const [attivo, setAttivo] = useState(false)
  const base = useId()
  const bottoni = useRef<(HTMLButtonElement | null)[]>([])

  // dopo l'idratazione le schede diventano schede vere; prima (e senza JavaScript) sono tutte in elenco
  useEffect(() => setAttivo(true), [])

  const scegli = (i: number, daTastiera = false) => {
    setSel(i)
    window.dispatchEvent(new CustomEvent('pagina:scelta', { detail: { indice: i } }))
    if (daTastiera) bottoni.current[i]?.focus()
  }
  const suTasto = (e: KeyboardEvent<HTMLButtonElement>) => {
    const n = scelte.length
    const vai = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? (sel + 1) % n : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? (sel + n - 1) % n : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : -1
    if (vai < 0) return
    e.preventDefault()
    scegli(vai, true)
  }

  return (
    <section className="sezione gioco" data-modo="gioco" aria-labelledby={`${base}-t`}>
      <div className="gioco-palco" data-ancora="gioco" data-scena="gioco" data-scala={ancoraScala} aria-hidden="true" />
      <div className="gioco-testo">
        <h2 id={`${base}-t`} className="sezione-titolo cresce">{h2}</h2>
        <div className="gioco-scelte cresce" role="tablist" aria-label="Il tuo mestiere">
          {scelte.map((s, i) => (
            <button
              key={s.id}
              ref={(el) => { bottoni.current[i] = el }}
              type="button"
              role="tab"
              id={`${base}-s-${s.id}`}
              aria-selected={sel === i}
              aria-controls={`${base}-p-${s.id}`}
              tabIndex={sel === i ? 0 : -1}
              className="gioco-scelta"
              onClick={() => scegli(i)}
              onKeyDown={suTasto}
            >
              {s.nome}
            </button>
          ))}
        </div>
        <div className="gioco-pannelli cresce" aria-live="polite">
          {scelte.map((s, i) => (
            <div
              key={s.id}
              role={attivo ? 'tabpanel' : undefined}
              id={`${base}-p-${s.id}`}
              aria-labelledby={`${base}-s-${s.id}`}
              className="gioco-pannello"
              hidden={attivo && sel !== i}
              data-attivo={sel === i}
            >
              <h3 className="gioco-pannello-nome">{s.nome}</h3>
              <p className="gioco-pannello-testo">{s.testo}</p>
              {s.link ? <a className="gioco-link" href={s.link.href}>{s.link.testo} →</a> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
