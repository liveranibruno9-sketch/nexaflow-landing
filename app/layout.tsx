import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

// Font serviti dal nostro dominio, dai file woff2 dei pacchetti npm Fontsource.
//
// Perche non `next/font/google`: quello scarica i caratteri da Google in fase
// di compilazione, quindi il build non parte se la rete non raggiunge
// fonts.googleapis.com. Qui i file sono gia dentro node_modules: il build
// funziona offline e a Google non parte nessuna richiesta.
//
// Perche `next/font/local` e non gli import CSS di Fontsource: genera un
// carattere di ripiego con le stesse metriche, cosi il testo non salta quando
// arriva il font vero, e permette di precaricare solo il carattere del titolo.
// Gli altri non si precaricano: su rete lenta toglierebbero banda all'immagine
// dell'hero, che su telefono e l'elemento piu grande (misurato con Lighthouse).
const sans = localFont({
  src: '../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
  weight: '100 900',
  variable: '--font-sans',
  display: 'swap',
  preload: false,
})
// Variante "profondita": i titoli sono in Space Grotesk, grotesk da startup tech
const display = localFont({
  src: '../node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2',
  weight: '300 700',
  variable: '--font-display',
  display: 'swap',
})

// Titoli delle pagine film: Archivio variabile con tutti gli assi (peso 100-900,
// larghezza 62-125%). La larghezza si sceglie col CSS (font-stretch).
const titoli = localFont({
  src: '../node_modules/@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2',
  weight: '100 900',
  variable: '--font-titoli',
  display: 'swap',
  preload: false,
  declarations: [{ prop: 'font-stretch', value: '62% 125%' }],
})
const mono = localFont({
  src: [
    { path: '../node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2', weight: '400' },
    { path: '../node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2', weight: '500' },
  ],
  variable: '--font-mono',
  display: 'swap',
  preload: false,
  adjustFontFallback: false,
})

// Con www: è l'indirizzo finale, il dominio nudo fa redirect qui
const SITO = 'https://www.agentistudio.it'

export const metadata: Metadata = {
  metadataBase: new URL(SITO),
  title: {
    default: 'Agenzia AI a Faenza e in Romagna | Agenti Studio',
    template: '%s',
  },
  description:
    'Automazioni, siti web, contenuti e campagne per le attività della Romagna. Agenti Studio, Faenza: richiedi un preventivo senza impegno.',
  authors: [{ name: 'Bruno Liverani' }],
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: SITO,
    siteName: 'Agenti Studio',
    title: 'Agenzia AI a Faenza e in Romagna | Agenti Studio',
    description:
      'Automazioni, siti web, contenuti e campagne per le attività della Romagna. Agenti Studio, Faenza: richiedi un preventivo senza impegno.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agenzia AI a Faenza e in Romagna | Agenti Studio',
    description:
      'Automazioni, siti web, contenuti e campagne per le attività della Romagna. Agenti Studio, Faenza: richiedi un preventivo senza impegno.',
  },
  robots: { index: true, follow: true },
  verification: { google: 'fx_Z6ORU-XMLUH3dfJB1J0DrH52mF74qpbV81DSyl5U' },
}

export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${sans.variable} ${display.variable} ${titoli.variable} ${mono.variable}`} suppressHydrationWarning>
      <body>
        <a
          href="#contenuto"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[var(--blu)] focus:px-5 focus:py-3 focus:text-white"
        >
          Vai al contenuto
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
