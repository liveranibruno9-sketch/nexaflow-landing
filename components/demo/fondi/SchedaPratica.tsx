'use client'

import { useRef } from 'react'
import { stampaSezione } from '@/components/demo/ComeSiUsa'
import { dataLunga } from '@/lib/demo/formato'
import type { Pratica } from '@/lib/demo/tipi'

// La scheda che la segreteria usa per chiedere i documenti al paziente. Si stampa da sola.
export default function SchedaPratica({ p }: { p: Pratica }) {
  const scheda = useRef<HTMLElement>(null)
  return (
    <article ref={scheda} data-prova="scheda-pratica" className="card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="mono text-s-2 text-[var(--neutro)]">
            {p.id} · {dataLunga(p.giorno)}
          </p>
          <h3 className="display mt-1 text-s1">{p.nome}</h3>
          <p className="mt-1 text-s-1 text-[var(--celeste)]">
            {p.fondo} · forma {p.forma}
          </p>
        </div>
        {!p.esclusa && (
          <button type="button" onClick={() => stampaSezione(scheda.current)} className="btn btn-fantasma non-stampare !min-h-[38px] !px-4 !py-1.5 text-s-2">
            Stampa
          </button>
        )}
      </div>
      {p.esclusa ? (
        <p className="mt-4 rounded-xl border border-[var(--bordo-forte)] px-3.5 py-2.5 text-s-1 text-[var(--neutro)]">{p.esclusa}</p>
      ) : (
        <>
          <p className="mt-4 text-s-1 font-medium text-[var(--bianco)]">Documenti da chiedere al paziente</p>
          <ul className="mt-2 space-y-2">
            {p.documenti.map((d) => (
              <li key={d} data-prova="documento" className="flex items-start gap-3 text-s-1 text-[var(--bianco)]">
                <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border border-[var(--bordo-forte)]" aria-hidden="true" />
                {d}
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1 border-t border-[var(--bordo)] pt-3 text-s-2 text-[var(--neutro)]">
            {p.preautorizzazione && <p>Serve l’autorizzazione del fondo prima della prestazione.</p>}
            {p.portale && <p>Portale: {p.portale}</p>}
            {p.note && <p>{p.note}</p>}
          </div>
        </>
      )}
    </article>
  )
}
