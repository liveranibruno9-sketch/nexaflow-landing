import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PaginaDedicata from '@/components/varco/sezioni/PaginaDedicata'
import { PAGINE_DEDICATE, SERVIZI_DEDICATI, trovaDedicata } from '@/components/varco/dati/dedicate'

// Pagina dedicata a una voce di /automazioni («Come funziona»): modello unico v1, dati in dati/dedicate.ts. Fuori da Google finché Bruno non la approva (noindex).

export const dynamicParams = false

export function generateStaticParams() {
  return PAGINE_DEDICATE.filter((p) => p.servizio === 'automazioni').map((p) => ({ voce: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ voce: string }> }): Promise<Metadata> {
  const { voce } = await params
  const v = trovaDedicata('automazioni', voce)
  if (!v) return {}
  return { title: { absolute: `${v.titolo} | ${SERVIZI_DEDICATI['automazioni'].nome} | Agenti Studio` }, description: v.riga, robots: { index: false, follow: true } }
}

export default async function Pagina({ params }: { params: Promise<{ voce: string }> }) {
  const { voce } = await params
  if (!trovaDedicata('automazioni', voce)) notFound()
  return <PaginaDedicata servizio="automazioni" slug={voce} />
}
