import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Testata from '@/components/film/Testata'
import Coda from '@/components/film/Coda'
import { TIPI_CONTENUTO_TUTTI } from '@/components/varco/dati/contenuti'

// Le pagine dedicate ai tipi di contenuto (link «Come funziona» del film di /contenuti). PROVVISORIE: titolo, una riga e il modulo;
// Bruno le struttura in un passo successivo. Fuori da Google finché non sono pronte (noindex).

export const dynamicParams = false

export function generateStaticParams() {
  return TIPI_CONTENUTO_TUTTI.map((t) => ({ tipo: t.slug }))
}

const trova = (slug: string) => TIPI_CONTENUTO_TUTTI.find((t) => t.slug === slug)

export function generateMetadata({ params }: { params: { tipo: string } }): Metadata {
  const t = trova(params.tipo)
  if (!t) return {}
  return {
    title: { absolute: `${t.titolo[0]} | Contenuti | Agenti Studio` },
    description: t.riga,
    robots: { index: false, follow: true },
  }
}

export default function Approfondimento({ params }: { params: { tipo: string } }) {
  const t = trova(params.tipo)
  if (!t) notFound()
  return (
    <main id="contenuto" className="approfondimento">
      <Testata corrente="contenuti" indice={['03', 'Contenuti']} />
      <section className="approfondimento-testa">
        <h1>{t.titolo[0]}</h1>
        <p className="approfondimento-riga">{t.riga}</p>
        <a className="approfondimento-indietro" href="/contenuti">Tutto quello che creiamo</a>
      </section>
      <Coda servizio="contenuti" riga={`Raccontaci la tua attività: ti diciamo come sarebbe «${t.titolo[0]}» per te.`} />
    </main>
  )
}
