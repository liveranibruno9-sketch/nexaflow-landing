import Coda from '@/components/film/Coda'
import Film from '@/components/film/Film'
import { HOME } from '@/components/film/dati/home'

// La home: il film in quattro tempi. In fondo la coda: preventivo, Bruno, contatti, informazioni.
export default function Home() {
  return (
    <main id="contenuto">
      <Film
        regia={HOME}
        corrente="home"
        h1="Agenti Studio, agenzia AI per le attività della Romagna"
        poster={{
          src: '/film/apertura-poster-720.webp',
          alt: "Anello di polvere di stelle, vetro, saette e cromo attorno al buio: l'apertura del sito di Agenti Studio",
        }}
      >
        <Coda conBruno />
      </Film>
    </main>
  )
}
