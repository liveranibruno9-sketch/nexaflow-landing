'use client'

import { useMemo } from 'react'
import BarraDemo from '@/components/demo/BarraDemo'
import ComeSiUsa from '@/components/demo/ComeSiUsa'
import DueViste from '@/components/demo/DueViste'
import Telefono, { type Conversazione } from '@/components/demo/Telefono'
import { useModulo } from '@/components/demo/useModulo'
import NuovaPratica from '@/components/demo/fondi/NuovaPratica'
import SchedaPratica from '@/components/demo/fondi/SchedaPratica'
import { servizio } from '@/lib/demo/servizi'
import type { StatoM6 } from '@/lib/demo/tipi'

const S = servizio('m6')

const PASSI = [
  'Quando un paziente in convenzione diretta fissa una prestazione, sceglie qui paziente, fondo e forma.',
  'Esce la scheda con i documenti da chiedere al paziente: la stampa o la tiene aperta mentre prepara la pratica.',
  'Se il paziente è in forma indiretta, la pratica la gestisce lui con il suo fondo: la scheda lo dice e non serve altro.',
  'In autunno, con un tocco, i pazienti con un fondo ricevono un messaggio informativo: nessun messaggio dice mai che una prestazione è coperta.',
]

export default function PaginaFondi() {
  const { stato, errore, inLavorazione, occupato, invia } = useModulo<StatoM6>('m6')

  const conversazioni: Conversazione[] = useMemo(
    () =>
      (stato?.messaggi ?? []).map((m) => ({
        id: m.pazienteId ?? m.id,
        nome: m.nome,
        bolle: [{ id: m.id, daStudio: true, testo: m.testo, giorno: m.giorno, etichetta: m.etichetta }],
      })),
    [stato],
  )
  const bloccati = stato?.campagna.filter((c) => c.bloccato.length) ?? []

  return (
    <div>
      <BarraDemo
        sigla={S.sigla}
        nome={S.nome}
        strumento="Pratiche fondi"
        giorno={stato?.giorno}
        occupato={occupato}
        inLavorazione={inLavorazione}
        errore={errore}
        messaggioLavoro="L’AI scrive i messaggi della campagna e il sistema li controlla uno per uno…"
        onRipristina={() => invia('ripristina')}
        azioni={
          <button type="button" data-prova="campagna" disabled={occupato || !stato} onClick={() => invia('campagna')} className="btn btn-primario !min-h-[44px] !px-5 !py-2.5 disabled:opacity-50">
            Prepara la campagna d’autunno
          </button>
        }
      />

      {!stato ? (
        <p className="text-s0 text-[var(--neutro)]">Carico lo studio demo…</p>
      ) : (
        <DueViste
          nuoviMessaggi={stato.messaggi.length}
          segreteria={
            <div className="space-y-5">
              <NuovaPratica pazienti={stato.elencoPazienti} fondi={stato.fondi} occupato={occupato} onCrea={(d) => invia('pratica', d)} />
              {stato.campagna.length > 0 && (
                <div data-prova="esito-campagna" className="vetro rounded-2xl px-5 py-4">
                  <p className="text-s0 text-[var(--bianco)]">
                    Campagna d’autunno: <span className="num text-[var(--verde)]">{stato.messaggi.length}</span> messaggi pronti
                    {bloccati.length > 0 && (
                      <>
                        , <span className="num text-[var(--arancio)]">{bloccati.length}</span> bloccati dal controllo
                      </>
                    )}
                  </p>
                  {bloccati.map((c) => (
                    <p key={c.pazienteId} data-prova="bloccato" className="mt-2 text-s-2 text-[var(--arancio)]">
                      {c.nome}: {c.bloccato.join('; ')}
                    </p>
                  ))}
                </div>
              )}
              <div className="space-y-4">
                {stato.pratiche.map((p) => (
                  <SchedaPratica key={p.id} p={p} />
                ))}
              </div>
            </div>
          }
          telefono={<Telefono conversazioni={conversazioni} vuoto="Qui compaiono i messaggi informativi della campagna d’autunno." />}
        />
      )}

      <ComeSiUsa titolo="Pratiche dei fondi sanitari" passi={PASSI} nota="L’elenco dei documenti va validato con la centrale operativa di ogni fondo prima dell’uso reale." />
    </div>
  )
}
