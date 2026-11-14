import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PaginaDedicata from '@/components/varco/sezioni/PaginaDedicata'
import { PAGINE_DEDICATE, trovaDedicata } from '@/components/varco/dati/dedicate'
import { metadatiDedicata } from '@/lib/metadati-dedicata'

// Pagina dedicata a una voce di /campagne («Come funziona»): modello unico v1, dati in dati/dedicate.ts. Su Google dal 14/11/2026 (Bruno: «Tutte e 26»); metadati in lib/metadati-dedicata.ts.

export const dynamicParams = false

export function generateStaticParams() {
  return PAGINE_DEDICATE.filter((p) => p.servizio === 'campagne').map((p) => ({ tipo: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ tipo: string }> }): Promise<Metadata> {
  const { tipo } = await params
  return metadatiDedicata('campagne', tipo)
}

export default async function Pagina({ params }: { params: Promise<{ tipo: string }> }) {
  const { tipo } = await params
  if (!trovaDedicata('campagne', tipo)) notFound()
  return <PaginaDedicata servizio="campagne" slug={tipo} />
}
