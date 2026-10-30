// Contatti di Agenti Studio (vincoli globali). Modulo puro: lo importano anche i test di Node.

export type Servizio = 'automazioni' | 'siti-web' | 'contenuti' | 'campagne'

export const CONTATTI = {
  telefono: '+393500164456',
  telefonoLeggibile: '+39 350 016 4456',
  whatsapp: 'https://wa.me/393500164456?text=' + encodeURIComponent('Ciao Bruno, ho visto il sito di Agenti Studio e vorrei informazioni su…'),
  email: 'bruno.liverani@agentistudio.it',
  piva: '',
  fotoBruno: '' as string,
  /** i profili social: si mostrano solo quelli che esistono (qui solo i due da verificare). Niente Facebook né TikTok per ora. */
  social: {
    // DA VERIFICARE: l'indirizzo non è confermato da Bruno (30/10/2026); prima di pubblicare controllare che la pagina esista
    linkedin: 'https://www.linkedin.com/company/agentistudio',
    // DA VERIFICARE: l'indirizzo non è confermato da Bruno (30/10/2026); prima di pubblicare controllare che il profilo esista
    instagram: 'https://www.instagram.com/agentistudio',
  } as { linkedin?: string; instagram?: string; facebook?: string; tiktok?: string },
}

/** i profili social da mostrare, col testo del collegamento (solo quelli con un indirizzo) */
export function profiliSocial(): { id: string; testo: string; href: string }[] {
  const s = CONTATTI.social
  return [
    { id: 'linkedin', testo: 'Agenti Studio su LinkedIn', href: s.linkedin },
    { id: 'instagram', testo: 'Agenti Studio su Instagram', href: s.instagram },
    { id: 'facebook', testo: 'Agenti Studio su Facebook', href: s.facebook },
    { id: 'tiktok', testo: 'Agenti Studio su TikTok', href: s.tiktok },
  ].filter((x): x is { id: string; testo: string; href: string } => Boolean(x.href))
}

export type PaginaCorrente = 'home' | Servizio | 'chi-siamo'

/** le quattro pagine servizio, nell'ordine del menu (D35); il numero e il colore sono quelli dell'agente */
export const VOCI_MENU = [
  { href: '/automazioni', num: '01', testo: 'Automazioni', materia: 'polvere' },
  { href: '/siti-web', num: '02', testo: 'Siti web', materia: 'vetro' },
  { href: '/contenuti', num: '03', testo: 'Contenuti', materia: 'saette' },
  { href: '/campagne', num: '04', testo: 'Campagne', materia: 'cromo' },
] as const
