// Una pagina servizio intera (DESIGN_SPEC-pagine §8.1): il film (apertura, problema, capacità), poi gioco, tappe, domande, invito, coda.
// Componente server: i testi vengono dal file di dati della pagina, mai dal codice. L'ordine è quello dei copy; la sezione propria
// (Automazioni «Resti tu a decidere», Siti «E quando serve un'app») sta dove dice il suo file di dati.
import Coda from '../../film/Coda'
import ModuloPreventivo from '../../film/ModuloPreventivo'
import type { Servizio } from '../../film/dati/contatti'
import PaginaVarco from '../PaginaVarco'
import type { DatiPagina } from '../dati/pagine.ts'
import Domande from './Domande'
import Extra from './Extra'
import Gioco from './Gioco'
import Invito from './Invito'
import Rivela from './Rivela'
import Tappe from './Tappe'

const NOMI = { atlas: 'Atlas', janus: 'Janus', prometheus: 'Prometheus', hermes: 'Hermes' } as const

export default function PaginaServizio({ dati }: { dati: DatiPagina }) {
  const nota = 'Senza impegno. Ti risponde Bruno entro un giorno lavorativo.'
  const extra = dati.extra ? <Extra h2={dati.extra.h2} testo={dati.extra.testo} elenco={dati.extra.elenco} /> : null
  return (
    <main id="contenuto" data-materia={dati.materia} data-pagina={dati.id}>
      <PaginaVarco dati={dati} nome={NOMI[dati.mascotte]}>
        <div className="pagina-corpo">
          {dati.extra?.dopo === 'film' ? extra : null}
          <Gioco h2={dati.gioco.h2} scelte={dati.gioco.scelte} />
          <Tappe h2={dati.tappe.h2} nomi={dati.tappe.nomi} passi={dati.tappe.passi} riga={dati.tappe.riga} />
          {dati.extra?.dopo === 'tappe' ? extra : null}
          <Domande h2={dati.domande.h2} voci={dati.domande.voci} />
          <Invito frasi={dati.invito.frasi} nota={nota} />
        </div>
        <Coda servizio={dati.id as Servizio} riga={dati.coda.riga}>
          <ModuloPreventivo servizio={dati.id as Servizio} />
        </Coda>
        <Rivela />
      </PaginaVarco>
    </main>
  )
}
