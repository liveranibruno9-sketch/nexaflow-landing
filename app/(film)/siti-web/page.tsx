import type { Metadata } from 'next'
import { ANTEPRIMA } from '@/lib/anteprima'
import PaginaServizio from '@/components/varco/sezioni/PaginaServizio'
import { SITI_WEB } from '@/components/varco/dati/siti-web'

// Titolo, descrizione e testi dal file di dati (copy-siti-web.md). L'H1 è la frase che dice cosa fa; il nome grande è il servizio.
const { titolo, descrizione } = SITI_WEB.seo

export const metadata: Metadata = {
  title: { absolute: titolo },
  description: descrizione,
  alternates: { canonical: '/siti-web' },
  openGraph: { type: 'website', locale: 'it_IT', url: '/siti-web', siteName: 'Agenti Studio', title: titolo, description: descrizione, images: [ANTEPRIMA] },
  twitter: { card: 'summary_large_image', title: titolo, description: descrizione, images: [ANTEPRIMA.url] },
}

export default function SitiWeb() {
  return <PaginaServizio dati={SITI_WEB} />
}
