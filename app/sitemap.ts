import type { MetadataRoute } from 'next'
import { PAGINE_DEDICATE } from '@/components/varco/dati/dedicate'

// Con www: è l'indirizzo finale, il dominio nudo fa redirect qui.
// Le 6 pagine principali e, dal 14/11/2026, le 26 pagine «Come funziona». Niente /privacy, /demo, /studi-dentistici (noindex, solo link
// diretto). `lastModified` = l'ultima volta che sono cambiati i testi: Bing e IndexNow lo usano per rileggere le pagine. Va aggiornato
// quando si cambiano i testi.
const MODIFICATO = new Date('2026-11-13')
const SITO = 'https://www.agentistudio.it'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITO}/`, lastModified: MODIFICATO, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITO}/automazioni`, lastModified: MODIFICATO, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITO}/siti-web`, lastModified: MODIFICATO, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITO}/contenuti`, lastModified: MODIFICATO, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITO}/campagne`, lastModified: MODIFICATO, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITO}/chi-siamo`, lastModified: MODIFICATO, changeFrequency: 'monthly', priority: 0.6 },
    ...PAGINE_DEDICATE.map((p) => ({ url: `${SITO}/${p.servizio}/${p.slug}`, lastModified: MODIFICATO, changeFrequency: 'monthly' as const, priority: 0.5 })),
  ]
}
