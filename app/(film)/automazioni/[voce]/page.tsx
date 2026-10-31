import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Testata from '@/components/film/Testata'
import Coda from '@/components/film/Coda'
import { VOCI_AUTOMAZIONI } from '@/components/varco/dati/automazioni'

// Le pagine di approfondimento delle automazioni (link «Come funziona» del film di /automazioni). PROVVISORIE: titolo, una riga e il
// modulo; Bruno le struttura in un passo successivo. Fuori da Google finché non sono pronte (noindex) e fuori dalla sitemap.

export const dynamicParams = false

export function generateStaticParams() {
  return VOCI_AUTOMAZIONI.map((v) => ({ voce: v.slug }))
}

const trova = (slug: string) => VOCI_AUTOMAZIONI.find((v) => v.slug === slug)

export function generateMetadata({ params }: { params: { voce: string } }): Metadata {
  const v = trova(params.voce)
  if (!v) return {}
  return {
    title: { absolute: `${v.titolo[0]} | Automazioni | Agenti Studio` },
    description: v.riga,
    robots: { index: false, follow: true },
  }
}

export default function Approfondimento({ params }: { params: { voce: string } }) {
  const v = trova(params.voce)
  if (!v) notFound()
  return (
    <main id="contenuto" className="approfondimento">
      <Testata corrente="automazioni" indice={['01', 'Automazioni']} />
      <section className="approfondimento-testa">
        <h1>{v.titolo[0]}</h1>
        <p className="approfondimento-riga">{v.riga}</p>
        <a className="approfondimento-indietro" href="/automazioni">Tutte le automazioni</a>
      </section>
      <Coda servizio="automazioni" riga={`Raccontaci la tua attività: ti diciamo come funzionerebbe «${v.titolo[0]}» da te.`} />
    </main>
  )
}
