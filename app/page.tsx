import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Perdite from '@/components/Perdite'
import Servizi from '@/components/Servizi'
import Processo from '@/components/Processo'
import Conformita from '@/components/Conformita'
import Fondatore from '@/components/Fondatore'
import Domande from '@/components/Domande'
import Verifica from '@/components/Verifica'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Nav />
      <main id="contenuto">
        {/* Ritmo verticale: scuro, chiaro, scuro, chiaro, scuro, chiaro, chiaro, scuro.
            Mai tre sezioni consecutive dello stesso tono. */}
        <Hero />
        <Perdite />
        <Servizi />
        <Processo />
        <Conformita />
        <Fondatore />
        <Domande />
        <Verifica />
      </main>
      <Footer />
    </>
  )
}
