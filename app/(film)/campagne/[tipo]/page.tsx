import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Testata from '@/components/film/Testata'
import Coda from '@/components/film/Coda'
import { TIPI_CAMPAGNA_TUTTI } from '@/components/varco/dati/campagne'

// Le pagine dedicate ai tipi di campagna (link «Come funziona» del film di /campagne). PROVVISORIE: titolo, una riga e il modulo;
// Bruno le struttura in un passo successivo. Fuori da Google finché non sono pronte (noindex).

export const dynamicParams = false

export function generateStaticParams() {
  return TIPI_CAMPAGNA_TUTTI.map((t) => ({ tipo: t.slug }))
}

const trova = (slug: string) => TIPI_CAMPAGNA_TUTTI.find((t) => t.slug === slug)

export function generateMetadata({ params }: { params: { tipo: string } }): Metadata {
  const t = trova(params.tipo)
  if (!t) return {}
  return {
    title: { absolute: `${t.titolo[0]} | Campagne | Agenti Studio` },
    description: t.riga,
    robots: { index: false, follow: true },
  }
}

export default function Approfondimento({ params }: { params: { tipo: string } }) {
  const t = trova(params.tipo)
  if (!t) notFound()
  return (
    <main id="contenuto" className="approfondimento">
      <Testata corrente="campagne" indice={['04', 'Campagne']} />
      <section className="approfondimento-testa">
        <h1>{t.titolo[0]}</h1>
        <p className="approfondimento-riga">{t.riga}</p>
        <a className="approfondimento-indietro" href="/campagne">Tutte le campagne</a>
      </section>
      <Coda servizio="campagne" riga={`Raccontaci la tua attività e l'obiettivo: ti diciamo come sarebbe «${t.titolo[0]}» per te.`} />
    </main>
  )
}
