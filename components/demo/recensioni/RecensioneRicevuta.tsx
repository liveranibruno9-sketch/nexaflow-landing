'use client'

import { useEffect, useState } from 'react'
import { dataBreve } from '@/lib/demo/formato'
import type { Recensione, RispostaDemo } from '@/lib/demo/tipi'

// Una recensione arrivata su Google, con la bozza di risposta che il titolare approva o corregge.
export default function RecensioneRicevuta({
  r,
  occupato,
  onApprova,
}: {
  r: Recensione
  occupato: boolean
  onApprova: (testo: string) => Promise<RispostaDemo<unknown>>
}) {
  const [bozza, setBozza] = useState(r.bozza)
  const [rifiuto, setRifiuto] = useState<string | null>(null)
  useEffect(() => setBozza(r.bozza), [r.bozza])

  return (
    <li data-prova="riga-recensione" className="px-5 py-5 sm:px-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-s0 font-medium text-[var(--bianco)]">
          <span className={r.stelle >= 4 ? 'text-[var(--giallo)]' : 'text-[var(--arancio)]'} aria-label={`${r.stelle} stelle su 5`}>
            {'★'.repeat(r.stelle)}
            <span className="opacity-25">{'★'.repeat(5 - r.stelle)}</span>
          </span>
          <span className="ml-2">{r.autore}</span>
        </p>
        <span className="mono text-s-2 text-[var(--neutro)]">{dataBreve(r.giorno)}</span>
      </div>
      <p className="mt-2 text-s-1 leading-relaxed text-[var(--bianco)]">“{r.testo}”</p>

      <div className="mt-4 rounded-2xl border border-[var(--bordo)] bg-[#0B1020] p-4">
        <p className="mono text-[0.68rem] uppercase tracking-[0.12em] text-[var(--celeste)]">{r.approvata ? 'Risposta pubblicata' : 'Bozza di risposta da approvare'}</p>
        {r.approvata ? (
          <p data-prova="approvata" className="mt-2 text-s-1 leading-relaxed text-[var(--bianco)]">
            {r.bozza}
          </p>
        ) : (
          <>
            <textarea
              data-prova="bozza"
              value={bozza}
              onChange={(e) => setBozza(e.target.value)}
              rows={4}
              className="mt-2 w-full resize-y rounded-xl border border-[var(--bordo-forte)] bg-transparent px-3 py-2.5 text-s-1 leading-relaxed text-[var(--bianco)] outline-none focus:border-[var(--celeste)]"
            />
            {r.problemi.length > 0 && bozza === r.bozza && (
              <p data-prova="da-rivedere" className="mt-2 text-s-2 text-[var(--arancio)]">
                Da rivedere prima di pubblicare: {r.problemi.join('; ')}
              </p>
            )}
            <button
              type="button"
              data-prova="approva"
              disabled={occupato || !bozza.trim()}
              onClick={async () => {
                const esito = await onApprova(bozza)
                setRifiuto(esito.ok ? null : esito.errore ?? 'Non approvata, riprova')
              }}
              className="btn btn-primario mt-3 !min-h-[40px] !py-2 text-s-2 disabled:opacity-40"
            >
              Approva e pubblica
            </button>
            {rifiuto && (
              <p role="alert" data-prova="rifiuto-approvazione" className="mt-2 text-s-2 text-[var(--arancio)]">
                {rifiuto}
              </p>
            )}
          </>
        )}
      </div>
    </li>
  )
}
