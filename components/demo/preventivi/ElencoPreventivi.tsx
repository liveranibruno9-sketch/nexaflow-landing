'use client'

import { useState } from 'react'
import { dataBreve, euro } from '@/lib/demo/formato'
import type { Preventivo } from '@/lib/demo/tipi'

const STATI: { valore: Preventivo['stato']; etichetta: string }[] = [
  { valore: 'aperto', etichetta: 'Aperto' },
  { valore: 'accettato', etichetta: 'Accettato' },
  { valore: 'rifiutato', etichetta: 'Rifiutato' },
]

function Sequenza({ p }: { p: Preventivo }) {
  return (
    <span className="flex items-center gap-1.5" aria-label={`${p.passo} messaggi su 3 inviati`}>
      {['+2', '+7', '+21'].map((t, i) => (
        <span
          key={t}
          className={`mono rounded-md px-1.5 py-0.5 text-[0.68rem] ${
            i < p.passo ? 'bg-[var(--blu)] text-white' : 'border border-[var(--bordo-forte)] text-[var(--neutro)]'
          }`}
        >
          {t}
        </span>
      ))}
    </span>
  )
}

function stato(p: Preventivo): { testo: string; colore: string } {
  if (p.stato === 'accettato') return { testo: 'Piano accettato', colore: 'text-[var(--verde)]' }
  if (p.stato === 'rifiutato') return { testo: 'Piano rifiutato', colore: 'text-[var(--neutro)]' }
  if (p.stato === 'risposto') return { testo: 'Ha risposto: da richiamare', colore: 'text-[var(--celeste)]' }
  if (!p.consenso) return { testo: 'Senza consenso: nessun messaggio', colore: 'text-[var(--neutro)]' }
  if (p.testi.length !== 3) return { testo: 'Testi da generare', colore: 'text-[var(--arancio)]' }
  if (p.pausa) return { testo: 'In pausa: da confermare', colore: 'text-[var(--arancio)]' }
  if (p.passo >= 3) return { testo: 'Sequenza completata', colore: 'text-[var(--neutro)]' }
  return { testo: `Messaggi pronti · prossimo ${p.prossimaEtichetta}, ${dataBreve(p.prossimoInvio)}`, colore: 'text-[var(--bianco)]' }
}

// L'elenco dei preventivi della segreteria: stato con un tocco, sequenza visibile, testi consultabili.
export default function ElencoPreventivi({
  preventivi,
  onStato,
  onRigenera,
  occupato,
}: {
  preventivi: Preventivo[]
  onStato: (id: string, nuovo: string) => void
  onRigenera: (id: string) => void
  occupato: boolean
}) {
  const [aperto, setAperto] = useState<string | null>(null)
  const ordinati = [...preventivi].reverse()

  return (
    <div className="card overflow-hidden">
      <div className="flex items-baseline justify-between gap-3 border-b border-[var(--bordo)] px-5 py-4 sm:px-6">
        <h2 className="display text-s1">Preventivi in sospeso</h2>
        <span className="mono num text-s-2 text-[var(--neutro)]">{preventivi.length}</span>
      </div>
      <ul className="divide-y divide-[var(--bordo)]">
        {ordinati.map((p) => {
          const s = stato(p)
          return (
            <li key={p.id} data-prova="riga-preventivo" className="px-5 py-4 sm:px-6">
              <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                <div className="min-w-0">
                  <p className="text-s0 font-medium text-[var(--bianco)]">{p.nome}</p>
                  <p className="text-s-1 text-[var(--neutro)]">
                    {p.piano} · <span className="num">{euro(p.importo)}</span> · consegnato {dataBreve(p.consegna)}
                  </p>
                </div>
                <select
                  aria-label={`Stato del preventivo di ${p.nome}`}
                  data-prova="stato-preventivo"
                  value={p.stato === 'risposto' ? 'aperto' : p.stato}
                  disabled={occupato}
                  onChange={(e) => onStato(p.id, e.target.value)}
                  className="rounded-full border border-[var(--bordo-forte)] bg-[#0B1020] px-3 py-1.5 text-s-2 text-[var(--bianco)] outline-none focus:border-[var(--celeste)]"
                >
                  {STATI.map((x) => (
                    <option key={x.valore} value={x.valore}>
                      {x.etichetta}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                {p.consenso && <Sequenza p={p} />}
                <span className={`text-s-2 ${s.colore}`}>{s.testo}</span>
                {p.testi.length === 3 && (
                  <button type="button" onClick={() => setAperto(aperto === p.id ? null : p.id)} className="text-s-2 text-[var(--celeste)] underline-offset-4 hover:underline">
                    {aperto === p.id ? 'Nascondi i testi' : 'Leggi i 3 messaggi'}
                  </button>
                )}
                {p.consenso && p.testi.length !== 3 && p.stato === 'aperto' && (
                  <button type="button" disabled={occupato} onClick={() => onRigenera(p.id)} className="text-s-2 text-[var(--celeste)] underline-offset-4 hover:underline disabled:opacity-40">
                    Genera i testi
                  </button>
                )}
              </div>
              {aperto === p.id && (
                <ol className="mt-3 space-y-2">
                  {p.testi.map((t, i) => (
                    <li key={i} className="rounded-xl border border-[var(--bordo)] bg-[#0B1020] px-3.5 py-2.5 text-s-1 leading-snug text-[var(--bianco)]">
                      <span className="mono mb-1 block text-[0.68rem] uppercase tracking-[0.12em] text-[var(--celeste)]">{['+2 giorni', '+7 giorni', '+21 giorni'][i]}</span>
                      {t}
                    </li>
                  ))}
                </ol>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
