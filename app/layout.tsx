import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/react'
import SmoothScroll from '@/components/SmoothScroll'

// Font serviti dal nostro dominio, dai pacchetti npm Fontsource.
//
// Perche non `next/font/google`: quello scarica i caratteri da Google in fase
// di compilazione, quindi il build non parte se la rete non raggiunge
// fonts.googleapis.com. Con Fontsource i file woff2 sono gia dentro
// node_modules: il build funziona anche offline, e a Google non viene
// inviata nessuna richiesta, ne in compilazione ne dal browser del visitatore.
import '@fontsource-variable/inter/wght.css'
import '@fontsource/instrument-serif/latin-400.css'
import './globals.css'

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
  themeColor: '#080D18',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>
        <a
          href="#contenuto"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[var(--ink)] focus:px-5 focus:py-3 focus:text-[var(--paper)]"
        >
          Vai al contenuto
        </a>
        <SmoothScroll>{children}</SmoothScroll>
        <Analytics />
      </body>
    </html>
  )
}
