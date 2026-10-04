'use client'

import { useRef } from 'react'

// "Come si usa": i passi per la segreteria, stampabili da soli su un foglio A4.
export function stampaSezione(el: HTMLElement | null) {
  if (!el) return
  const fine = () => {
    document.body.classList.remove('stampa-attiva')
    el.classList.remove('in-stampa')
    window.removeEventListener('afterprint', fine)
  }
  document.body.classList.add('stampa-attiva')
  el.classList.add('in-stampa')
  window.addEventListener('afterprint', fine)
  window.print()
}

export default function ComeSiUsa({ titolo, passi, nota }: { titolo: string; passi: string[]; nota?: string }) {
  const sezione = useRef<HTMLElement>(null)
  return (
    <section ref={sezione} className="card mt-8 p-6 sm:p-8" aria-label="Come si usa">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="occhiello">Per la segreteria</span>
          <h2 className="display mt-2 text-s2">Come si usa: {titolo}</h2>
        </div>
        <button type="button" onClick={() => stampaSezione(sezione.current)} className="btn btn-fantasma non-stampare !min-h-[40px] !py-2 text-s-2">
          Stampa
        </button>
      </div>
      <ol className="mt-6 space-y-4">
        {passi.map((p, i) => (
          <li key={i} className="flex gap-4">
            <span className="num mono grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[var(--bordo-forte)] text-s-2 text-[var(--celeste)]">
              {i + 1}
            </span>
            <span className="pt-0.5 text-s0 leading-relaxed text-[var(--bianco)]">{p}</span>
          </li>
        ))}
      </ol>
      {nota && <p className="mt-6 border-t border-[var(--bordo)] pt-4 text-s-1 text-[var(--neutro)]">{nota}</p>}
    </section>
  )
}
