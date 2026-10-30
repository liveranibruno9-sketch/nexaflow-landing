import type { Metadata } from 'next'
import PaginaChiSiamo from '@/components/varco/sezioni/PaginaChiSiamo'
import { CHI_SIAMO } from '@/components/varco/dati/chi-siamo'

// Titolo, descrizione e H1 da pagine/copy-chi-siamo.md. L'H1 è la frase grande dell'apertura.
const { titolo, descrizione } = CHI_SIAMO.seo

export const metadata: Metadata = {
  title: { absolute: titolo },
  description: descrizione,
  alternates: { canonical: '/chi-siamo' },
  openGraph: { type: 'website', locale: 'it_IT', url: '/chi-siamo', siteName: 'Agenti Studio', title: titolo, description: descrizione },
  twitter: { card: 'summary_large_image', title: titolo, description: descrizione },
}

export default function ChiSiamo() {
  return <PaginaChiSiamo dati={CHI_SIAMO} />
}
