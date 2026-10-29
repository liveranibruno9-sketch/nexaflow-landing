import Film from '@/components/film/Film'
import { HOME } from '@/components/film/dati/home'

// La home: il film in quattro tempi. La coda (modulo, Bruno, informazioni) arriva al compito 5.
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
      />
    </main>
  )
}
