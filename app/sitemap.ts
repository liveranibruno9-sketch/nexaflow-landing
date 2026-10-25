import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: 'https://www.agentistudio.it/', changeFrequency: 'monthly', priority: 1 }]
}
