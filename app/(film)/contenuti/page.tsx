import type { Metadata } from 'next'
import Coda from '@/components/film/Coda'
import Film from '@/components/film/Film'
import ModuloPreventivo from '@/components/film/ModuloPreventivo'
import { CONTENUTI } from '@/components/film/dati/contenuti'

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
      <Film
        regia={CONTENUTI}
        corrente="contenuti"
        h1="Contenuti e gestione social per le attività della Romagna"
        poster={{
          src: '/film/scene/prometheus-2-720.webp',
          alt: 'Prometheus, lo scoiattolo di saette che rappresenta i contenuti di Agenti Studio',
        }}
      >
        <Coda servizio="contenuti">
          <ModuloPreventivo servizio="contenuti" />
        </Coda>
      </Film>
    </main>
  )
}
