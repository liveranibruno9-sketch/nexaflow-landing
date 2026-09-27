import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/react'
import SmoothScroll from '@/components/SmoothScroll'
import Cielo from '@/components/cielo/Cielo'
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
const serif = localFont({
  src: '../node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2',
  weight: '400',
  variable: '--font-serif',
  display: 'swap',
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

const SITO = 'https://agentistudio.it'

export const metadata: Metadata = {
  metadataBase: new URL(SITO),
  title: {
    default: 'Agenti Studio — automazioni AI per studi dentistici',
    template: '%s · Agenti Studio',
  },
  description:
    'Recuperiamo il fatturato che il suo studio dentistico sta già perdendo: chiamate senza risposta, preventivi fermi, pazienti mai richiamati, poltrone vuote. Misurato prima e dopo.',
  keywords: [
    'automazione studio dentistico',
    'segreteria AI dentista',
    'recupero preventivi odontoiatria',
    'anti no-show dentista',
    'agenti AI studi dentistici',
    'Romagna',
  ],
  authors: [{ name: 'Bruno Liverani' }],
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: SITO,
    siteName: 'Agenti Studio',
    title: 'Agenti Studio — automazioni AI per studi dentistici',
    description:
      'Chiamate senza risposta, preventivi fermi, poltrone vuote. Misuriamo quanto le costano oggi, poi lo recuperiamo.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agenti Studio — automazioni AI per studi dentistici',
    description:
      'Chiamate senza risposta, preventivi fermi, poltrone vuote. Misuriamo quanto le costano oggi, poi lo recuperiamo.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITO },
}

export const viewport: Viewport = {
  themeColor: '#05070F',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <body>
        <a
          href="#contenuto"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[var(--blu)] focus:px-5 focus:py-3 focus:text-white"
        >
          Vai al contenuto
        </a>
        <Cielo />
        <div className="pagina">
          <SmoothScroll>{children}</SmoothScroll>
        </div>
        <Analytics />
      </body>
    </html>
  )
}
