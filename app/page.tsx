import Nav from '@/components/Nav'
import Volo from '@/components/volo/Volo'
import MappaCielo from '@/components/MappaCielo'
import Regole from '@/components/Regole'
import Fondatore from '@/components/Fondatore'
import Demo from '@/components/Demo'
import Domande from '@/components/Domande'
import Verifica from '@/components/Verifica'
import Footer from '@/components/Footer'

/**
 * Variante "profondita": prima il volo, poi l'orbita.
 *
 * Il volo racconta (partenza, perdite, sei costellazioni, rotta, arrivo).
 * L'orbita e la parte da consultare: si scorre normalmente sopra il cielo
 * dove la camera si e fermata. Ritmo di profondita dell'orbita:
 * notte, spazio, notte, spazio, spazio, nebulosa.
 */
export default function Home() {
  return (
    <>
      <Nav />
      <main id="contenuto">
        <Volo />
        <div id="orbita" className="scroll-mt-0">
          <MappaCielo />
          <Regole />
          <Fondatore />
          <Demo />
          <Domande />
          <Verifica />
        </div>
      </main>
      <Footer />
    </>
  )
}
