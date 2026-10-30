import type { Metadata } from 'next'
import Coda from '@/components/film/Coda'
import ModuloPreventivo from '@/components/film/ModuloPreventivo'

// Titolo, descrizione e H1 da testi.md §6 (lettera per lettera). Il nome grande è decorativo: l'H1 è la riga piccola.
const TITOLO = 'Campagne pubblicitarie a Faenza e in Romagna | Agenti Studio'
const DESCRIZIONE =
  'Pubblicità su Instagram, Facebook e Google per portare clienti nuovi alla tua attività. Un obiettivo chiaro e il costo di ogni contatto. Faenza.'

export const metadata: Metadata = {
  title: { absolute: TITOLO },
  description: DESCRIZIONE,
  alternates: { canonical: '/campagne' },
  openGraph: { type: 'website', locale: 'it_IT', url: '/campagne', siteName: 'Agenti Studio', title: TITOLO, description: DESCRIZIONE },
  twitter: { card: 'summary_large_image', title: TITOLO, description: DESCRIZIONE },
}

export default function Campagne() {
  return (
    <main id="contenuto">
      {/* provvisoria: il mondo del varco arriva nel Blocco B (compito 13) */}
      <h1>Campagne pubblicitarie per le attività della Romagna</h1>
      <Coda servizio="campagne">
        <ModuloPreventivo servizio="campagne" />
      </Coda>
    </main>
  )
}
