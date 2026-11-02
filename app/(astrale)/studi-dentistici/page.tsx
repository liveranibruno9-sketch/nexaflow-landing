import type { Metadata } from 'next'
import { ANTEPRIMA } from '@/lib/anteprima'
import Nav from '@/components/Nav'
import Volo from '@/components/volo/Volo'
import MappaCielo from '@/components/MappaCielo'
import Regole from '@/components/Regole'
import Fondatore from '@/components/Fondatore'
import Demo from '@/components/Demo'
import Domande from '@/components/Domande'
import Verifica from '@/components/Verifica'
import Footer from '@/components/Footer'

const DESCRIZIONE =
  'Recuperiamo il fatturato che il suo studio dentistico perde: chiamate senza risposta, preventivi fermi, pazienti che non tornano. Misurato prima e dopo.'

export const metadata: Metadata = {
  title: { absolute: 'Automazioni AI per studi dentistici | Agenti Studio' },
  description: DESCRIZIONE,
  alternates: { canonical: '/studi-dentistici' },
  openGraph: {
    images: [ANTEPRIMA],
    type: 'website',
    locale: 'it_IT',
    url: '/studi-dentistici',
    siteName: 'Agenti Studio',
    title: 'Agenti Studio — automazioni AI per studi dentistici',
    description:
      'Chiamate senza risposta, preventivi fermi, pazienti che non tornano. Misuriamo quanto le costano oggi, poi lo recuperiamo.',
  },
  twitter: {
    images: [ANTEPRIMA.url],
    card: 'summary_large_image',
    title: 'Agenti Studio — automazioni AI per studi dentistici',
    description:
      'Chiamate senza risposta, preventivi fermi, pazienti che non tornano. Misuriamo quanto le costano oggi, poi lo recuperiamo.',
  },
}

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
