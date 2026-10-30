import type { Metadata } from 'next'
import Coda from '@/components/film/Coda'
import Film from '@/components/film/Film'
import ModuloPreventivo from '@/components/film/ModuloPreventivo'
import { CAMPAGNE } from '@/components/film/dati/campagne'

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
      <Film
        regia={CAMPAGNE}
        corrente="campagne"
        h1="Campagne pubblicitarie per le attività della Romagna"
        poster={{
          src: '/film/scene/hermes-2-720.webp',
          alt: 'Hermes, il leprotto di cromo che rappresenta le campagne di Agenti Studio',
        }}
      >
        <Coda servizio="campagne">
          <ModuloPreventivo servizio="campagne" />
        </Coda>
      </Film>
    </main>
  )
}
