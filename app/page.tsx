import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import TrustBar from '@/components/TrustBar'
import Problem from '@/components/Problem'
import Services from '@/components/Services'
import HowItWorks from '@/components/HowItWorks'
import Automations from '@/components/Automations'
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
      <Services />
      <HowItWorks />
      <Automations />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  )
}
