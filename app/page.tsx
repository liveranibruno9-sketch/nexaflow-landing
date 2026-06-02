import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Problem from '@/components/Problem'
import Services from '@/components/Services'
import HowItWorks from '@/components/HowItWorks'
import Automations from '@/components/Automations'
import FAQ from '@/components/FAQ'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="bg-slate-950 text-white min-h-screen">
      <Navbar />
      <Hero />
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
