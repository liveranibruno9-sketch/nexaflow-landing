import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PaginaDedicata from '@/components/varco/sezioni/PaginaDedicata'
import { PAGINE_DEDICATE, trovaDedicata } from '@/components/varco/dati/dedicate'
import { metadatiDedicata } from '@/lib/metadati-dedicata'

// Pagina dedicata a una voce di /automazioni («Come funziona»): modello unico v1, dati in dati/dedicate.ts. Su Google dal 14/11/2026 (Bruno: «Tutte e 26»); metadati in lib/metadati-dedicata.ts.

export const dynamicParams = false

export function generateStaticParams() {
  return PAGINE_DEDICATE.filter((p) => p.servizio === 'automazioni').map((p) => ({ voce: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ voce: string }> }): Promise<Metadata> {
  const { voce } = await params
  return metadatiDedicata('automazioni', voce)
}

export default async function Pagina({ params }: { params: Promise<{ voce: string }> }) {
  const { voce } = await params
  if (!trovaDedicata('automazioni', voce)) notFound()
  return <PaginaDedicata servizio="automazioni" slug={voce} />
}
