import type { MetadataRoute } from 'next'

// /demo resta aperta ai crawler: le pagine hanno già noindex, e Google deve poterlo leggere
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/api/' },
    sitemap: 'https://www.agentistudio.it/sitemap.xml',
  }
}
