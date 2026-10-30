import type { MetadataRoute } from 'next'

// Con www: è l'indirizzo finale, il dominio nudo fa redirect qui.
// Solo le 6 pagine da indicizzare: niente /privacy, /demo, /lavori/*, /prova-tipografia.
const SITO = 'https://www.agentistudio.it'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITO}/`, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITO}/automazioni`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITO}/siti-web`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITO}/contenuti`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITO}/campagne`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITO}/studi-dentistici`, changeFrequency: 'monthly', priority: 0.7 },
  ]
}
