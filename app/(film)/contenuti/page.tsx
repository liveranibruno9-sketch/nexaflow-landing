import type { Metadata } from 'next'
import Coda from '@/components/film/Coda'
import ModuloPreventivo from '@/components/film/ModuloPreventivo'

// Titolo, descrizione e H1 da testi.md §6 (lettera per lettera). Il nome grande è decorativo: l'H1 è la riga piccola.
const TITOLO = 'Gestione social e contenuti in Romagna | Agenti Studio'
const DESCRIZIONE =
  "Post, caroselli e video brevi che raccontano la tua attività com'è davvero. Pronti ogni settimana, li approvi dal telefono. Agenti Studio, Faenza."

export const metadata: Metadata = {
  title: { absolute: TITOLO },
  description: DESCRIZIONE,
  alternates: { canonical: '/contenuti' },
  openGraph: { type: 'website', locale: 'it_IT', url: '/contenuti', siteName: 'Agenti Studio', title: TITOLO, description: DESCRIZIONE },
  twitter: { card: 'summary_large_image', title: TITOLO, description: DESCRIZIONE },
}

export default function Contenuti() {
  return (
    <main id="contenuto">
      {/* provvisoria: il mondo del varco arriva nel Blocco B (compito 13) */}
      <h1>Contenuti e gestione social per le attività della Romagna</h1>
      <Coda servizio="contenuti">
        <ModuloPreventivo servizio="contenuti" />
      </Coda>
    </main>
  )
}
