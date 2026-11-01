import type { Metadata } from 'next'
import DatiStrutturati from '@/components/DatiStrutturati'
import Coda from '@/components/film/Coda'
import Varco from '@/components/varco/Varco'
import { HOME } from '@/components/varco/dati/home'

// Titolo, descrizione e H1 da testi.md §6 (lettera per lettera). Il nome grande è decorativo: l'H1 è la riga piccola.
// SEO (2/11/2026): il nome dell'agenzia viene prima nel titolo e l'H1 dice «di Faenza», così chi cerca «agenti studio faenza» trova la home.
const TITOLO = 'Agenti Studio | Agenzia AI a Faenza e in Romagna'
const DESCRIZIONE =
  'Automazioni, siti web, contenuti e campagne per le attività della Romagna. Agenti Studio, Faenza: richiedi un preventivo senza impegno.'

export const metadata: Metadata = {
  title: { absolute: TITOLO },
  description: DESCRIZIONE,
  alternates: { canonical: '/' },
  openGraph: { type: 'website', locale: 'it_IT', url: '/', siteName: 'Agenti Studio', title: TITOLO, description: DESCRIZIONE },
  twitter: { card: 'summary_large_image', title: TITOLO, description: DESCRIZIONE },
}

// La home: il varco in sette blocchi (apertura, soglia, quattro tratti, finale). In fondo la coda: preventivo, Bruno, contatti, informazioni.
export default function Home() {
  return (
    <main id="contenuto">
      <DatiStrutturati />
      <Varco
        percorso={HOME}
        corrente="home"
        h1="Agenti Studio, agenzia AI di Faenza per le attività della Romagna"
        poster={{
          src720: '/film/scene/apertura-720.webp',
          src1080: '/film/scene/apertura-1080.webp',
          alt: "Anello di polvere di stelle, vetro, saette e cromo attorno al buio: l'apertura del sito di Agenti Studio",
        }}
      >
        <Coda conBruno />
      </Varco>
    </main>
  )
}
