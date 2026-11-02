import type { Metadata } from 'next'
import { ANTEPRIMA } from '@/lib/anteprima'
import PaginaServizio from '@/components/varco/sezioni/PaginaServizio'
import { CAMPAGNE } from '@/components/varco/dati/campagne'

// Titolo, descrizione e testi dal file di dati (copy-campagne.md). L'H1 è la frase che dice cosa fa; il nome grande è il servizio.
const { titolo, descrizione } = CAMPAGNE.seo

export const metadata: Metadata = {
  title: { absolute: titolo },
  description: descrizione,
  alternates: { canonical: '/campagne' },
  openGraph: { type: 'website', locale: 'it_IT', url: '/campagne', siteName: 'Agenti Studio', title: titolo, description: descrizione, images: [ANTEPRIMA] },
  twitter: { card: 'summary_large_image', title: titolo, description: descrizione, images: [ANTEPRIMA.url] },
}

export default function Campagne() {
  return <PaginaServizio dati={CAMPAGNE} />
}
