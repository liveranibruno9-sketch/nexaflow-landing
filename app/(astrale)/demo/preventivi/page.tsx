'use client'

import { useMemo } from 'react'
import BarraDemo from '@/components/demo/BarraDemo'
import ComeSiUsa from '@/components/demo/ComeSiUsa'
import DueViste from '@/components/demo/DueViste'
import Telefono, { type Conversazione } from '@/components/demo/Telefono'
import { useModulo } from '@/components/demo/useModulo'
import AvvisiPreventivi from '@/components/demo/preventivi/AvvisiPreventivi'
import ElencoPreventivi from '@/components/demo/preventivi/ElencoPreventivi'
import NuovoPreventivo from '@/components/demo/preventivi/NuovoPreventivo'
import RiepilogoPreventivi from '@/components/demo/preventivi/RiepilogoPreventivi'
import { servizio } from '@/lib/demo/servizi'
import type { StatoM1 } from '@/lib/demo/tipi'

const S = servizio('m1')

const PASSI = [
  'Quando consegna un preventivo importante, lo inserisce qui dal telefono: paziente, telefono, piano di cure, importo e consenso al contatto. Bastano dieci secondi.',
  'Da quel momento il sistema manda al paziente tre messaggi informativi, a 2, 7 e 21 giorni. Lei non deve ricordarsi niente.',
  'Quando il paziente risponde, la sequenza si ferma e qui compare "Da richiamare": lo richiama lei e segna com’è andata.',
  'Quando il paziente accetta o rifiuta, cambia lo stato con un tocco: i messaggi si fermano subito.',
  'Ogni lunedì conferma con un tocco i preventivi ancora aperti. Se uno resta senza conferma per più di 7 giorni, i messaggi vanno in pausa: così nessuno riceve un sollecito dopo aver già detto sì.',
]

export default function PaginaPreventivi() {
  const { stato, errore, inLavorazione, occupato, invia } = useModulo<StatoM1>('m1')

  const conversazioni: Conversazione[] = useMemo(() => {
    if (!stato) return []
    const ultimo = new Map<string, number>()
    stato.messaggi.forEach((m, i) => m.preventivoId && ultimo.set(m.preventivoId, i))
    return Array.from(ultimo.entries())
      .sort((a, b) => a[1] - b[1])
      .map(([id]) => {
        const p = stato.preventivi.find((x) => x.id === id)
        return {
          id,
          nome: p?.nome ?? id,
          bolle: stato.messaggi
            .filter((m) => m.preventivoId === id)
            .map((m) => ({ id: m.id, daStudio: m.verso === 'out', testo: m.testo, giorno: m.giorno, etichetta: m.etichetta })),
        }
      })
  }, [stato])

  const oggi = stato?.messaggi.filter((m) => m.giorno === stato.giorno).length ?? 0

  return (
    <div>
      <BarraDemo
        sigla={S.sigla}
        nome={S.nome}
        strumento="Preventivi"
        giorno={stato?.giorno}
        occupato={occupato}
        inLavorazione={inLavorazione}
        errore={errore}
        messaggioLavoro="L’AI sta scrivendo i 3 messaggi per il paziente…"
        onRipristina={() => invia('ripristina')}
        azioni={
          <button type="button" data-prova="avanza" disabled={occupato || !stato} onClick={() => invia('avanza')} className="btn btn-primario !min-h-[44px] !px-5 !py-2.5 disabled:opacity-50">
            Avanza al prossimo invio
          </button>
        }
      />

      {!stato ? (
        <p className="text-s0 text-[var(--neutro)]">Carico lo studio demo…</p>
      ) : (
        <DueViste
          nuoviMessaggi={oggi}
          segreteria={
            <div className="space-y-5">
              <AvvisiPreventivi
                avvisi={stato.avvisi}
                occupato={occupato}
                onConferma={(id) => invia('conferma', { id })}
                onConfermaTutti={() => invia('conferma_tutti')}
                onStato={(id, nuovo) => invia('cambia_stato', { id, nuovo })}
              />
              <NuovoPreventivo occupato={occupato} onInvia={async (d) => (await invia('aggiungi', d)).ok} />
              <ElencoPreventivi
                preventivi={stato.preventivi}
                occupato={occupato}
                onStato={(id, nuovo) => invia('cambia_stato', { id, nuovo })}
                onRigenera={(id) => invia('rigenera', { id })}
              />
              <RiepilogoPreventivi riepilogo={stato.riepilogo} />
            </div>
          }
          telefono={
            <Telefono
              conversazioni={conversazioni}
              vuoto="Qui compaiono i messaggi che il paziente riceve. Tocchi “Avanza al prossimo invio”."
              risposte={(c) => {
                const p = stato.preventivi.find((x) => x.id === c.id)
                if (!p || p.stato !== 'aperto' || p.passo === 0) return []
                return [
                  { etichetta: 'Sì, vorrei parlarne', prova: 'risposta-interessato', disabilitata: occupato, onClick: () => invia('rispondi', { id: p.id, risposta: 'interessato' }) },
                  { etichetta: 'Ci sto ancora pensando', prova: 'risposta-ci_penso', disabilitata: occupato, onClick: () => invia('rispondi', { id: p.id, risposta: 'ci_penso' }) },
                ]
              }}
            />
          }
        />
      )}

      <ComeSiUsa titolo="Preventivi" passi={PASSI} nota="I testi dei messaggi li approva il direttore sanitario prima dell’avvio. Nei messaggi non passano dati clinici." />
    </div>
  )
}
