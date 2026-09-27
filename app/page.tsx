import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Fascia from '@/components/Fascia'
import Perdite from '@/components/Perdite'
import MappaCielo from '@/components/MappaCielo'
import Costellazioni from '@/components/Costellazioni'
import Rotta from '@/components/Rotta'
import Regole from '@/components/Regole'
import Fondatore from '@/components/Fondatore'
import Domande from '@/components/Domande'
import Verifica from '@/components/Verifica'
import Footer from '@/components/Footer'

/**
 * Un viaggio dal buio alla rotta.
 * Ritmo di profondita: nebulosa, notte, spazio, notte, spazio, notte,
 * spazio, notte, spazio, nebulosa. Mai tre livelli uguali di fila.
 */
export default function Home() {
  return (
    <>
      <Nav />
      <main id="contenuto">
        <Hero />
        <Fascia />
        <Perdite />
        <MappaCielo />
        <Costellazioni />
        <Rotta />
        <Regole />
        <Fondatore />
        <Domande />
        <Verifica />
      </main>
      <Footer />
    </>
  )
}
