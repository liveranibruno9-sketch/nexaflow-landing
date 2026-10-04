'use client'

import { useMemo } from 'react'
import BarraDemo from '@/components/demo/BarraDemo'
import ComeSiUsa from '@/components/demo/ComeSiUsa'
import DueViste from '@/components/demo/DueViste'
import Telefono, { type Conversazione } from '@/components/demo/Telefono'
import { useModulo } from '@/components/demo/useModulo'
import RecensioneRicevuta from '@/components/demo/recensioni/RecensioneRicevuta'
import { servizio } from '@/lib/demo/servizi'
import type { StatoM5 } from '@/lib/demo/tipi'

const S = servizio('m5')

const PASSI = [
  'A fine giornata apre “Visite di oggi” e tocca “Invia a tutti”: ogni paziente passato riceve lo stesso invito.',
  'L’invito è uguale per tutti, senza chiedere prima se il paziente è soddisfatto: è la regola di Google, e protegge il profilo dello studio.',
  'Quando arriva una recensione, il sistema prepara una bozza di risposta. Il titolare la legge, la corregge se vuole e la approva con un tocco.',
  'Se una bozza contiene qualcosa che non si può scrivere in pubblico (dettagli clinici, sconti, conferma che l’autore è un paziente), viene segnata “da rivedere”.',
]

export default function PaginaRecensioni() {
  const { stato, errore, inLavorazione, occupato, invia } = useModulo<StatoM5>('m5')

  const conversazioni: Conversazione[] = useMemo(
    () =>
      (stato?.messaggi ?? [])
        .filter((m) => m.visitaId)
        .map((m) => ({
          id: m.visitaId!,
          nome: m.nome,
          bolle: [{ id: m.id, daStudio: true, testo: m.testo, giorno: m.giorno, etichetta: m.etichetta }],
        })),
    [stato],
  )

  const simula = (stelle: number, prova: string, etichetta: string) => (
    <button type="button" data-prova={prova} disabled={occupato || !stato} onClick={() => invia('simula_recensione', { stelle })} className="btn btn-primario !min-h-[44px] !px-5 !py-2.5 disabled:opacity-50">
      {etichetta}
    </button>
  )

  return (
    <div>
      <BarraDemo
        sigla={S.sigla}
        nome={S.nome}
        strumento="Visite di oggi"
        giorno={stato?.giorno}
        occupato={occupato}
        inLavorazione={inLavorazione}
        errore={errore}
        messaggioLavoro="Arriva una recensione: l’AI prepara la bozza di risposta…"
        onRipristina={() => invia('ripristina')}
        azioni={
          <>
            {simula(5, 'simula-5', 'Simula recensione ★★★★★')}
            {simula(2, 'simula-2', 'Simula recensione ★★')}
          </>
        }
      />

      {!stato ? (
        <p className="text-s0 text-[var(--neutro)]">Carico lo studio demo…</p>
      ) : (
        <DueViste
          nuoviMessaggi={stato.messaggi.length}
          segreteria={
            <div className="space-y-5">
              <div className="card overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--bordo)] px-5 py-4 sm:px-6">
                  <h2 className="display text-s1">Visite di oggi</h2>
                  <button type="button" data-prova="invita-tutti" disabled={occupato || stato.daInvitare === 0} onClick={() => invia('invita_tutti')} className="chip text-[var(--bianco)] disabled:opacity-40">
                    Invia a tutti ({stato.daInvitare})
                  </button>
                </div>
                <ul className="divide-y divide-[var(--bordo)]">
                  {stato.visite.map((v) => (
                    <li key={v.id} data-prova="riga-visita" className="flex items-center justify-between gap-3 px-5 py-3 sm:px-6">
                      <span className="text-s0 text-[var(--bianco)]">
                        <span className="mono num mr-3 text-s-2 text-[var(--neutro)]">{v.ora}</span>
                        {v.nome}
                      </span>
                      {v.invitato ? (
                        <span data-prova="invitato" className="chip text-[var(--verde)]">
                          ✓ Invitato
                        </span>
                      ) : (
                        <button type="button" data-prova="invita" disabled={occupato} onClick={() => invia('invita', { id: v.id })} className="chip text-[var(--bianco)] disabled:opacity-40">
                          Invia l’invito
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-[var(--bordo-forte)] px-5 py-4">
                <p className="mono text-[0.68rem] uppercase tracking-[0.12em] text-[var(--celeste)]">L’invito, uguale per tutti</p>
                <p className="mt-2 text-s-1 leading-relaxed text-[var(--bianco)]">{stato.invito}</p>
              </div>

              <div className="card overflow-hidden">
                <div className="flex items-baseline justify-between gap-3 border-b border-[var(--bordo)] px-5 py-4 sm:px-6">
                  <h2 className="display text-s1">Recensioni ricevute</h2>
                  {stato.daApprovare > 0 && <span className="text-s-2 text-[var(--celeste)]">{stato.daApprovare} da approvare</span>}
                </div>
                <ul className="divide-y divide-[var(--bordo)]">
                  {stato.recensioni.map((r) => (
                    <RecensioneRicevuta key={r.id} r={r} occupato={occupato} onApprova={(testo) => invia('approva', { id: r.id, testo })} />
                  ))}
                </ul>
              </div>
            </div>
          }
          telefono={<Telefono conversazioni={conversazioni} vuoto="Qui compare l’invito che riceve il paziente dopo la visita. Tocchi “Invia a tutti”." />}
        />
      )}

      <ComeSiUsa titolo="Recensioni Google" passi={PASSI} nota="Nessun incentivo e nessun filtro sulla soddisfazione: sono vietati dalle regole di Google e mettono a rischio il profilo dello studio." />
    </div>
  )
}
