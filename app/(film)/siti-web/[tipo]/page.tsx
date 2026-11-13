import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PaginaDedicata from '@/components/varco/sezioni/PaginaDedicata'
import { PAGINE_DEDICATE, SERVIZI_DEDICATI, trovaDedicata } from '@/components/varco/dati/dedicate'

// Pagina dedicata a una voce di /siti-web («Come funziona»): modello unico v1, dati in dati/dedicate.ts. Fuori da Google finché Bruno non la approva (noindex).

export const dynamicParams = false

export function generateStaticParams() {
  return PAGINE_DEDICATE.filter((p) => p.servizio === 'siti-web').map((p) => ({ tipo: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ tipo: string }> }): Promise<Metadata> {
  const { tipo } = await params
  const v = trovaDedicata('siti-web', tipo)
  if (!v) return {}
  return { title: { absolute: `${v.titolo} | ${SERVIZI_DEDICATI['siti-web'].nome} | Agenti Studio` }, description: v.riga, robots: { index: false, follow: true } }
}

export default async function Pagina({ params }: { params: Promise<{ tipo: string }> }) {
  const { tipo } = await params
  if (!trovaDedicata('siti-web', tipo)) notFound()
  return <PaginaDedicata servizio="siti-web" slug={tipo} />
}
