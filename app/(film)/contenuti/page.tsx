import type { Metadata } from 'next'
import { ANTEPRIMA } from '@/lib/anteprima'
import PaginaServizio from '@/components/varco/sezioni/PaginaServizio'
import { CONTENUTI } from '@/components/varco/dati/contenuti'

// Titolo, descrizione e testi dal file di dati (copy-contenuti.md). L'H1 è la frase che dice cosa fa; il nome grande è il servizio.
const { titolo, descrizione } = CONTENUTI.seo

export const metadata: Metadata = {
  title: { absolute: titolo },
  description: descrizione,
  alternates: { canonical: '/contenuti' },
  openGraph: { type: 'website', locale: 'it_IT', url: '/contenuti', siteName: 'Agenti Studio', title: titolo, description: descrizione, images: [ANTEPRIMA] },
  twitter: { card: 'summary_large_image', title: titolo, description: descrizione, images: [ANTEPRIMA.url] },
}

export default function Contenuti() {
  return <PaginaServizio dati={CONTENUTI} />
}
