// I metadati delle 26 pagine «Come funziona» (una per voce dei quattro servizi). Dal 14/11/2026 sono su Google: Bruno le ha aperte
// tutte («Tutte e 26»), con lo stesso trattamento delle pagine servizio: titolo, descrizione, indirizzo canonico, anteprima dei link.
// Un `openGraph` di pagina sostituisce quello del layout, quindi l'immagine ANTEPRIMA va ripetuta qui (skill seo-sito, S8).
import type { Metadata } from 'next'
import { ANTEPRIMA } from '@/lib/anteprima'
import { SERVIZI_DEDICATI, descrizioneDedicata, trovaDedicata } from '@/components/varco/dati/dedicate'
import type { ServizioDedicato } from '@/components/varco/dati/dedicate'

export function metadatiDedicata(servizio: ServizioDedicato, slug: string): Metadata {
  const v = trovaDedicata(servizio, slug)
  if (!v) return {}
  const titolo = `${v.titolo} | ${SERVIZI_DEDICATI[servizio].nome} | Agenti Studio`
  const descrizione = descrizioneDedicata(v)
  const url = `/${servizio}/${slug}`
  return {
    title: { absolute: titolo },
    description: descrizione,
    alternates: { canonical: url },
    openGraph: { type: 'website', locale: 'it_IT', url, siteName: 'Agenti Studio', title: titolo, description: descrizione, images: [ANTEPRIMA] },
    twitter: { card: 'summary_large_image', title: titolo, description: descrizione, images: [ANTEPRIMA.url] },
  }
}
