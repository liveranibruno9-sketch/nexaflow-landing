import type { Metadata } from 'next'
import Coda from '@/components/film/Coda'
import Film from '@/components/film/Film'
import ModuloPreventivo from '@/components/film/ModuloPreventivo'
import { SITI_WEB } from '@/components/film/dati/siti-web'

// Titolo, descrizione e H1 da testi.md §6 (lettera per lettera). Il nome grande è decorativo: l'H1 è la riga piccola.
const TITOLO = 'Realizzazione siti web a Faenza e Romagna | Agenti Studio'
const DESCRIZIONE =
  'Siti web belli dal telefono e fatti per farti trovare su Google, con richieste e prenotazioni online. Per le attività di Faenza e della Romagna.'

export const metadata: Metadata = {
  title: { absolute: TITOLO },
  description: DESCRIZIONE,
  alternates: { canonical: '/siti-web' },
  openGraph: { type: 'website', locale: 'it_IT', url: '/siti-web', siteName: 'Agenti Studio', title: TITOLO, description: DESCRIZIONE },
  twitter: { card: 'summary_large_image', title: TITOLO, description: DESCRIZIONE },
}

export default function SitiWeb() {
  return (
    <main id="contenuto">
      <Film
        regia={SITI_WEB}
        corrente="siti-web"
        h1="Siti web per le attività di Faenza e della Romagna"
        poster={{
          src: '/film/scene/janus-2-720.webp',
          alt: 'Janus, la volpe di vetro che rappresenta i siti web di Agenti Studio',
        }}
      >
        <Coda servizio="siti-web">
          <ModuloPreventivo servizio="siti-web" />
        </Coda>
      </Film>
    </main>
  )
}
