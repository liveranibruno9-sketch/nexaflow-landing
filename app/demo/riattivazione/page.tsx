'use client'

import { useMemo } from 'react'
import BarraDemo from '@/components/demo/BarraDemo'
import ComeSiUsa from '@/components/demo/ComeSiUsa'
import DueViste from '@/components/demo/DueViste'
import Telefono, { type Conversazione } from '@/components/demo/Telefono'
import { useModulo } from '@/components/demo/useModulo'
import Analisi from '@/components/demo/riattivazione/Analisi'
import CaricaExport from '@/components/demo/riattivazione/CaricaExport'
import { servizio } from '@/lib/demo/servizi'
import type { StatoM3 } from '@/lib/demo/tipi'

const S = servizio('m3')
const MASSIMO_CONVERSAZIONI = 40

const PASSI = [
  'Una volta a settimana esporta dal gestionale l’elenco pazienti con la data dell’ultima visita (Excel o CSV) e lo carica qui.',
  'La prima volta, se il sistema non riconosce i nomi delle colonne, le abbina con i menu: poi resta così.',
  'Il sistema tiene solo chi non viene da più di 12 mesi e scarta, con il motivo, chi ha già un appuntamento, chi è stato ricontattato negli ultimi 6 mesi e chi non ha dato il consenso.',
  'Ai pazienti da riattivare arriva un messaggio informativo. Nessuno viene contattato due volte nello stesso semestre.',
  'Chi risponde “vorrei fissare” compare in cima all’analisi con il numero: lo richiama lei e fissa la visita.',
]

export default function PaginaRiattivazione() {
  const { stato, errore, inLavorazione, occupato, invia } = useModulo<StatoM3>('m3')

  const conversazioni: Conversazione[] = useMemo(() => {
    if (!stato) return []
    const perRiga = new Map<string, Conversazione>()
    for (const m of stato.messaggi) {
      if (!m.rigaId) continue
      if (!perRiga.has(m.rigaId)) perRiga.set(m.rigaId, { id: m.rigaId, nome: m.nome, bolle: [] })
      perRiga.get(m.rigaId)!.bolle.push({ id: m.id, daStudio: m.verso === 'out', testo: m.testo, giorno: m.giorno, etichetta: m.etichetta })
    }
    // chi ha risposto per ultimo resta in fondo, cioè selezionato
    const risposte = new Set(stato.risposte.map((r) => r.id))
    const tutte = Array.from(perRiga.values())
    return tutte
      .filter((c) => !risposte.has(c.id))
      .slice(0, MASSIMO_CONVERSAZIONI)
      .concat(tutte.filter((c) => risposte.has(c.id)))
  }, [stato])

  return (
    <div>
      <BarraDemo
        sigla={S.sigla}
        nome={S.nome}
        strumento="Carica l’export"
        giorno={stato?.giorno}
        occupato={occupato}
        inLavorazione={inLavorazione}
        errore={errore}
        messaggioLavoro="Analizzo l’export e l’AI scrive i messaggi…"
        onRipristina={() => invia('ripristina')}
        azioni={
          <button type="button" data-prova="usa-esempio" disabled={occupato || !stato} onClick={() => invia('carica_esempio')} className="btn btn-primario !min-h-[44px] !px-5 !py-2.5 disabled:opacity-50">
            Usa l’export d’esempio
          </button>
        }
      />

      <p data-prova="avviso-dati-reali" className="non-stampare mb-5 rounded-2xl border border-[var(--bordo-forte)] px-4 py-3 text-s-1 text-[var(--neutro)]">
        <span className="font-medium text-[var(--bianco)]">Demo:</span> non carichi dati reali dei pazienti. Usi l’export d’esempio o un file di prova.
      </p>

      {!stato ? (
        <p className="text-s0 text-[var(--neutro)]">Carico lo studio demo…</p>
      ) : (
        <DueViste
          nuoviMessaggi={stato.messaggi.filter((m) => m.verso === 'out').length}
          segreteria={
            <div className="space-y-5">
              <CaricaExport
                colonne={stato.colonneFile}
                mancanti={stato.mancanti}
                occupato={occupato}
                onFile={(nome, base64) => invia('carica_file', { nome, base64 })}
                onMappa={(mappatura) => invia('mappa', { mappatura })}
              />
              <Analisi stato={stato} />
            </div>
          }
          telefono={
            <Telefono
              conversazioni={conversazioni}
              vuoto="Qui compaiono i messaggi che ricevono i pazienti da riattivare."
              risposte={(c) => {
                if (stato.risposte.some((r) => r.id === c.id)) return []
                return [
                  { etichetta: 'Sì, vorrei fissare un controllo', prova: 'risposta-fissare', disabilitata: occupato, onClick: () => invia('rispondi', { id: c.id, risposta: 'fissare' }) },
                  { etichetta: 'Per ora no, grazie', prova: 'risposta-no', disabilitata: occupato, onClick: () => invia('rispondi', { id: c.id, risposta: 'no' }) },
                ]
              }}
            />
          }
        />
      )}

      <ComeSiUsa titolo="Riattivazione dei pazienti" passi={PASSI} nota="I modelli dei messaggi li approva il direttore sanitario. Il sistema non legge dati clinici: solo nome, telefono e date." />
    </div>
  )
}
