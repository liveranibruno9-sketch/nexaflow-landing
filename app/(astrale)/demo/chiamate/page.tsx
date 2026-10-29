'use client'

import { useMemo } from 'react'
import BarraDemo from '@/components/demo/BarraDemo'
import ComeSiUsa from '@/components/demo/ComeSiUsa'
import DueViste from '@/components/demo/DueViste'
import Telefono, { type Conversazione } from '@/components/demo/Telefono'
import { useModulo } from '@/components/demo/useModulo'
import { dataBreve, ora } from '@/lib/demo/formato'
import { servizio } from '@/lib/demo/servizi'
import type { Chiamata, StatoM2 } from '@/lib/demo/tipi'

const S = servizio('m2')

const PASSI = [
  'Quando lei non riesce a rispondere (pausa pranzo, sera, paziente al banco), risponde l’assistente virtuale, che dice subito di essere virtuale.',
  'Ogni chiamata finisce qui: ora, nome, numero, motivo e urgenza. Le urgenze stanno in cima.',
  'Richiama i pazienti partendo dagli urgenti e tocca “Richiamato” quando l’ha fatto: il contatore scende.',
  'L’assistente risponde da solo alle domande pratiche (orari, indirizzo, parcheggio) e non dà mai indicazioni cliniche: per dolore o gonfiore usa solo la frase decisa dallo studio.',
]

// urgenti da richiamare, poi le altre da richiamare dalla più recente, infine quelle già richiamate
function ordina(chiamate: Chiamata[]) {
  const peso = (c: Chiamata) => (c.richiamato ? 2 : c.urgenza === 'alta' ? 0 : 1)
  return [...chiamate].sort((a, b) => peso(a) - peso(b) || b.ora.localeCompare(a.ora))
}

export default function PaginaChiamate() {
  const { stato, errore, inLavorazione, occupato, invia } = useModulo<StatoM2>('m2')

  const conversazioni: Conversazione[] = useMemo(
    () =>
      (stato?.chiamate ?? [])
        .slice()
        .reverse()
        .map((c) => ({
          id: c.id,
          nome: c.nome,
          sottotitolo: `${c.nome}, ${dataBreve(c.ora)} ${ora(c.ora)}`,
          bolle: c.trascrizione.map((b, i) => ({ id: `${c.id}-${i}`, daStudio: b.chi === 'assistente', testo: b.testo })),
        })),
    [stato],
  )

  return (
    <div>
      <BarraDemo
        sigla={S.sigla}
        nome={S.nome}
        strumento="Chiamate ricevute"
        giorno={stato?.giorno}
        occupato={occupato}
        inLavorazione={inLavorazione}
        errore={errore}
        messaggioLavoro="Arriva una chiamata: l’assistente virtuale sta rispondendo…"
        onRipristina={() => invia('ripristina')}
        azioni={
          <button type="button" data-prova="simula-chiamata" disabled={occupato || !stato} onClick={() => invia('simula_chiamata')} className="btn btn-primario !min-h-[44px] !px-5 !py-2.5 disabled:opacity-50">
            Simula una chiamata persa
          </button>
        }
      />

      {!stato ? (
        <p className="text-s0 text-[var(--neutro)]">Carico lo studio demo…</p>
      ) : (
        <DueViste
          segreteria={
            <div className="space-y-5">
              <div data-prova="contatore" className="vetro flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl px-5 py-4">
                <p className="text-s1 text-[var(--bianco)]">
                  <span className="num display text-s3">{stato.daRichiamare}</span> da richiamare
                </p>
                {stato.urgenti > 0 && (
                  <p className="flex items-center gap-2 text-s0 text-[var(--arancio)]">
                    <span className="h-2.5 w-2.5 rounded-full bg-[var(--arancio)]" aria-hidden="true" />
                    {stato.urgenti} {stato.urgenti === 1 ? 'urgente' : 'urgenti'}
                  </p>
                )}
              </div>

              <div className="card overflow-hidden">
                <div className="border-b border-[var(--bordo)] px-5 py-4 sm:px-6">
                  <h2 className="display text-s1">Registro</h2>
                </div>
                <ul className="divide-y divide-[var(--bordo)]">
                  {ordina(stato.chiamate).map((c) => (
                    <li key={c.id} data-prova="riga-chiamata" className={`px-5 py-4 sm:px-6 ${c.richiamato ? 'opacity-55' : ''}`}>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="mono text-s-2 text-[var(--neutro)]">
                            {dataBreve(c.ora)} · {ora(c.ora)}
                          </p>
                          <p className="mt-1 text-s0 font-medium text-[var(--bianco)]">
                            {c.nome} <span className="mono ml-1 text-s-2 font-normal text-[var(--neutro)]">{c.numero}</span>
                          </p>
                          <p className="mt-0.5 text-s-1 text-[var(--bianco)]">{c.motivo}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {c.urgenza === 'alta' && !c.richiamato && (
                            <span className="chip border-[color-mix(in_srgb,var(--arancio)_50%,transparent)] text-[var(--arancio)]">Urgente</span>
                          )}
                          {c.richiamato ? (
                            <span className="chip text-[var(--verde)]">✓ Richiamato</span>
                          ) : (
                            <button type="button" data-prova="richiamato" disabled={occupato} onClick={() => invia('richiamato', { id: c.id })} className="chip text-[var(--bianco)] disabled:opacity-40">
                              Richiamato
                            </button>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          }
          telefono={<Telefono conversazioni={conversazioni} modo="chiamata" vuoto="Qui compare la trascrizione della chiamata." />}
        />
      )}

      <ComeSiUsa
        titolo="Chiamate ricevute"
        passi={PASSI}
        nota="In questa demo le chiamate sono simulate dall’AI. Con il servizio attivo arrivano dalla voce vera dell’assistente, nello stesso registro."
      />
    </div>
  )
}
