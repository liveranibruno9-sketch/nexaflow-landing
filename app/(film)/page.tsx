import type { Metadata } from 'next'
import Coda from '@/components/film/Coda'

// Titolo, descrizione e H1 da testi.md §6 (lettera per lettera). Il nome grande è decorativo: l'H1 è la riga piccola.
const TITOLO = 'Agenzia AI a Faenza e in Romagna | Agenti Studio'
const DESCRIZIONE =
  'Automazioni, siti web, contenuti e campagne per le attività della Romagna. Agenti Studio, Faenza: richiedi un preventivo senza impegno.'

export const metadata: Metadata = {
  title: { absolute: TITOLO },
  description: DESCRIZIONE,
  alternates: { canonical: '/' },
  openGraph: { type: 'website', locale: 'it_IT', url: '/', siteName: 'Agenti Studio', title: TITOLO, description: DESCRIZIONE },
  twitter: { card: 'summary_large_image', title: TITOLO, description: DESCRIZIONE },
}

// La home (provvisoria fino al compito 4). In fondo la coda: preventivo, Bruno, contatti, informazioni.
export default function Home() {
  return (
    <main id="contenuto">
      {/* provvisoria: il componente Varco arriva nel compito 4 */}
      <h1>Agenti Studio, agenzia AI per le attività della Romagna</h1>
      <Coda conBruno />
    </main>
  )
}
