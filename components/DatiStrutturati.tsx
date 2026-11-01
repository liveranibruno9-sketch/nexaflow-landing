// I dati strutturati della home (schema.org, JSON-LD): dicono a Google chi è Agenti Studio, dove sta e che sito è il suo, così il nome
// viene riconosciuto come un'agenzia di Faenza e non come le parole «agenti» e «studio». Solo dati veri e già pubblicati sul sito
// (regola zero delle regole di pubblicazione): niente via, niente Partita IVA finché non ci sono. `sameAs` riceve i profili social
// solo quando Bruno ne ha confermato l'indirizzo (contatti.ts).
import { CONTATTI } from './film/dati/contatti'

const SITO = 'https://www.agentistudio.it'

/** i profili confermati da Bruno: finché sono «da verificare» restano fuori dai dati per Google */
const PROFILI_CONFERMATI: string[] = []

const DATI = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITO}/#sito`,
      url: `${SITO}/`,
      name: 'Agenti Studio',
      alternateName: ['AgentiStudio', 'agentistudio.it'],
      inLanguage: 'it-IT',
      publisher: { '@id': `${SITO}/#agenzia` },
    },
    {
      '@type': 'Organization',
      '@id': `${SITO}/#agenzia`,
      name: 'Agenti Studio',
      alternateName: 'AgentiStudio',
      url: `${SITO}/`,
      logo: `${SITO}/icon.png`,
      description:
        'Agenzia di Faenza per le attività della Romagna: automazioni aziendali, siti web e app, creazione di contenuti per i social e campagne pubblicitarie.',
      email: CONTATTI.email,
      telephone: CONTATTI.telefono,
      address: { '@type': 'PostalAddress', addressLocality: 'Faenza', addressRegion: 'RA', addressCountry: 'IT' },
      areaServed: [
        { '@type': 'City', name: 'Faenza' },
        { '@type': 'AdministrativeArea', name: 'Provincia di Ravenna' },
        { '@type': 'AdministrativeArea', name: 'Romagna' },
      ],
      founder: { '@type': 'Person', name: 'Bruno Liverani' },
      knowsAbout: ['Automazioni aziendali', 'Siti web', 'Creazione di contenuti per i social', 'Campagne pubblicitarie', 'AI per le piccole e medie imprese'],
      ...(PROFILI_CONFERMATI.length ? { sameAs: PROFILI_CONFERMATI } : {}),
    },
  ],
}

// ogni `<` diventa la sua sequenza di escape unicode: nessun testo può chiudere lo script prima del tempo
const JSON_LD = JSON.stringify(DATI).replace(/</g, '\\u003c')

export default function DatiStrutturati() {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON_LD }} />
}
