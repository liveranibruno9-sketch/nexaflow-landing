import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PaginaDedicata from '@/components/varco/sezioni/PaginaDedicata'
import { PAGINE_DEDICATE, SERVIZI_DEDICATI, trovaDedicata } from '@/components/varco/dati/dedicate'

// Pagina dedicata a una voce di /siti-web («Come funziona»): modello unico v1, dati in dati/dedicate.ts. Fuori da Google finché Bruno non la approva (noindex).

export const dynamicParams = false

export function generateStaticParams() {
  return PAGINE_DEDICATE.filter((p) => p.servizio === 'siti-web').map((p) => ({ tipo: p.slug }))
}

export function generateMetadata({ params }: { params: { tipo: string } }): Metadata {
  const v = trovaDedicata('siti-web', params.tipo)
  if (!v) return {}
  return { title: { absolute: `${v.titolo} | ${SERVIZI_DEDICATI['siti-web'].nome} | Agenti Studio` }, description: v.riga, robots: { index: false, follow: true } }
}

export default function Pagina({ params }: { params: { tipo: string } }) {
  if (!trovaDedicata('siti-web', params.tipo)) notFound()
  return <PaginaDedicata servizio="siti-web" slug={params.tipo} />
}
