'use client'

import { useState } from 'react'
import { dataLunga } from '@/lib/demo/formato'
import type { StatoM3 } from '@/lib/demo/tipi'

const FASCE: Record<string, string> = { f12_18: '12–18 mesi', f18_36: '18–36 mesi', oltre36: 'oltre 3 anni' }
const PRIMI = 8

function Elenco<T>({ titolo, righe, voce, prova }: { titolo: string; righe: T[]; voce: (r: T) => React.ReactNode; prova: string }) {
  const [tutti, setTutti] = useState(false)
  if (!righe.length) return null
  const visibili = tutti ? righe : righe.slice(0, PRIMI)
  return (
    <div className="mt-5 border-t border-[var(--bordo)] pt-4">
      <p className="text-s-1 font-medium text-[var(--bianco)]">
        {titolo} <span className="num ml-1 text-[var(--neutro)]">{righe.length}</span>
      </p>
      <ul className="mt-2 space-y-1.5">
        {visibili.map((r, i) => (
          <li key={i} data-prova={prova} className="flex flex-wrap justify-between gap-x-3 text-s-1">
            {voce(r)}
          </li>
        ))}
      </ul>
      {righe.length > PRIMI && (
        <button type="button" onClick={() => setTutti(!tutti)} className="mt-2 text-s-2 text-[var(--celeste)] underline-offset-4 hover:underline">
          {tutti ? 'Mostra meno' : `Mostra tutti (${righe.length})`}
        </button>
      )}
    </div>
  )
}

// Il conto dell'export: quanti da riattivare, quanti esclusi e perché, chi ha risposto.
export default function Analisi({ stato }: { stato: StatoM3 }) {
  const c = stato.conteggi
  const daRiattivare = stato.pazienti.filter((p) => stato.daRiattivare.includes(p.id))
  return (
    <div className="card p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="display text-s1">Analisi dell’export</h2>
        {stato.export && <span className="mono text-s-2 text-[var(--neutro)]">{stato.export.nome}</span>}
      </div>
      {!stato.export ? (
        <p className="mt-3 text-s-1 text-[var(--neutro)]">Carichi un export o usi quello d’esempio.</p>
      ) : (
        <>
          <dl className="mt-4 grid grid-cols-3 gap-3 [&>div]:flex [&>div]:flex-col [&_dd]:mt-auto [&_dd]:pt-1">
            <div>
              <dt className="mono text-s-2 uppercase tracking-[0.12em] text-[var(--neutro)]">Pazienti</dt>
              <dd className="num display mt-1 text-s3 text-[var(--bianco)]">{c.totale}</dd>
            </div>
            <div>
              <dt className="mono text-s-2 uppercase tracking-[0.12em] text-[var(--neutro)]">Da riattivare</dt>
              <dd data-prova="conteggio-da-riattivare" className="num display mt-1 text-s3 text-[var(--verde)]">
                {c.daRiattivare}
              </dd>
            </div>
            <div>
              <dt className="mono text-s-2 uppercase tracking-[0.12em] text-[var(--neutro)]">Esclusi</dt>
              <dd className="num display mt-1 text-s3 text-[var(--neutro)]">{c.esclusi}</dd>
            </div>
          </dl>
          {stato.senzaColonnaConsenso && (
            <p className="mt-4 rounded-xl border border-[color-mix(in_srgb,var(--arancio)_45%,transparent)] px-3.5 py-2.5 text-s-1 text-[var(--arancio)]">
              L’export non indica il consenso al contatto: prima di un invio reale va verificato con lo studio.
            </p>
          )}
          <Elenco
            titolo="Hanno risposto: vorrei fissare"
            prova="ha-risposto"
            righe={stato.risposte.filter((r) => r.risposta === 'fissare')}
            voce={(r) => (
              <>
                <span className="text-[var(--bianco)]">{r.nome}</span>
                <span className="mono text-[var(--verde)]">{r.telefono}</span>
              </>
            )}
          />
          <Elenco
            titolo="Da riattivare"
            prova="da-riattivare"
            righe={daRiattivare}
            voce={(p) => (
              <>
                <span className="text-[var(--bianco)]">{p.nomeCompleto}</span>
                <span className="text-[var(--neutro)]">
                  assente da {FASCE[p.fascia]} · ultima visita {dataLunga(p.ultimaVisita)}
                </span>
              </>
            )}
          />
          <Elenco
            titolo="Esclusi, con il motivo"
            prova="escluso"
            righe={stato.esclusi}
            voce={(e) => (
              <>
                <span className="text-[var(--bianco)]">{e.nome || '—'}</span>
                <span className="text-[var(--neutro)]">{e.motivo}</span>
              </>
            )}
          />
        </>
      )}
    </div>
  )
}
