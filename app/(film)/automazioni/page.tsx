import type { Metadata } from 'next'
import Coda from '@/components/film/Coda'
import Film from '@/components/film/Film'
import ModuloPreventivo from '@/components/film/ModuloPreventivo'
import { AUTOMAZIONI } from '@/components/film/dati/automazioni'

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
      <Film
        regia={AUTOMAZIONI}
        corrente="automazioni"
        h1="Automazioni AI per le attività della Romagna"
        poster={{
          src: '/film/scene/atlas-2-720.webp',
          alt: "Atlas, l'orsetto di polvere di stelle che rappresenta le automazioni di Agenti Studio",
        }}
      >
        <Coda servizio="automazioni">
          <ModuloPreventivo servizio="automazioni" />
        </Coda>
      </Film>
    </main>
  )
}
