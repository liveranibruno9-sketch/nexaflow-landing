import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import TrustBar from '@/components/TrustBar'
import Problem from '@/components/Problem'
import AgenteEmail from '@/components/AgenteEmail'
import Services from '@/components/Services'
import HowItWorks from '@/components/HowItWorks'
import Automations from '@/components/Automations'
import About from '@/components/About'
import FAQ from '@/components/FAQ'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <TrustBar />
      <Problem />
      <AgenteEmail />
      <Services />
      <HowItWorks />
      <Automations />
      <About />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  )
}
