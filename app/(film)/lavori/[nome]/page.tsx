import { notFound } from 'next/navigation'
import { LAVORI, pubblicabile } from '@/components/film/dati/lavori'

// Pagina del lavoro (spec §10). La bacheca è vuota al lancio (R7): ogni /lavori/x risponde 404.
// Il film breve del lavoro (00 cliente e problema · 01 il prodotto · 02 cosa è cambiato · 03 preventivo)
// si scrive quando arriva il primo lavoro.
export const dynamicParams = false

export function generateStaticParams() {
  return LAVORI.filter(pubblicabile).map((l) => ({ nome: l.slug }))
}

export default function PaginaLavoro({ params }: { params: { nome: string } }) {
  const lavoro = LAVORI.find((l) => l.slug === params.nome && pubblicabile(l))
  if (!lavoro) notFound()
  // finché non c'è il film del lavoro, anche un lavoro pubblicabile non ha una pagina
  notFound()
}
