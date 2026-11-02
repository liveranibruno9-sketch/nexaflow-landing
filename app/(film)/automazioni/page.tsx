import type { Metadata } from 'next'
import { ANTEPRIMA } from '@/lib/anteprima'
import PaginaServizio from '@/components/varco/sezioni/PaginaServizio'
import { AUTOMAZIONI } from '@/components/varco/dati/automazioni'

// Titolo, descrizione e testi dal file di dati (copy-automazioni.md). L'H1 è la frase che dice cosa fa; il nome grande è il servizio.
const { titolo, descrizione } = AUTOMAZIONI.seo

export const metadata: Metadata = {
  title: { absolute: titolo },
  description: descrizione,
  alternates: { canonical: '/automazioni' },
  openGraph: { type: 'website', locale: 'it_IT', url: '/automazioni', siteName: 'Agenti Studio', title: titolo, description: descrizione, images: [ANTEPRIMA] },
  twitter: { card: 'summary_large_image', title: titolo, description: descrizione, images: [ANTEPRIMA.url] },
}

export default function Automazioni() {
  return <PaginaServizio dati={AUTOMAZIONI} />
}
