import type { Metadata } from 'next'
import Coda from '@/components/film/Coda'
import ModuloPreventivo from '@/components/film/ModuloPreventivo'

// Titolo, descrizione e H1 da testi.md §6 (lettera per lettera). Il nome grande è decorativo: l'H1 è la riga piccola.
const TITOLO = 'Automazioni AI a Faenza e in Romagna | Agenti Studio'
const DESCRIZIONE =
  'Risposte ai messaggi anche a negozio chiuso, preventivi ricontattati, recensioni Google: automazioni AI per attività e studi della Romagna.'

export const metadata: Metadata = {
  title: { absolute: TITOLO },
  description: DESCRIZIONE,
  alternates: { canonical: '/automazioni' },
  openGraph: { type: 'website', locale: 'it_IT', url: '/automazioni', siteName: 'Agenti Studio', title: TITOLO, description: DESCRIZIONE },
  twitter: { card: 'summary_large_image', title: TITOLO, description: DESCRIZIONE },
}

export default function Automazioni() {
  return (
    <main id="contenuto">
      {/* provvisoria: il mondo del varco arriva nel Blocco B (compito 13) */}
      <h1>Automazioni AI per le attività della Romagna</h1>
      <Coda servizio="automazioni">
        <ModuloPreventivo servizio="automazioni" />
      </Coda>
    </main>
  )
}
