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
// Variante "profondita": i titoli sono in Space Grotesk, grotesk da startup tech
const display = localFont({
  src: '../node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2',
  weight: '300 700',
  variable: '--font-display',
  display: 'swap',
})

/**
 * Decide PRIMA del primo disegno se questo dispositivo fa il volo 3D.
 * Se si, aggiunge la classe `volo` a <html>; se no, resta la pagina normale.
 * Deciderlo dopo, in React, farebbe saltare tutta la pagina da una
 * disposizione all'altra.
 *
 * Niente volo con: movimento ridotto, risparmio dati, meno di 4 core o di
 * 3 GB di memoria, niente WebGL2, grafica solo software (per esempio i
 * browser senza scheda grafica usati dai test automatici).
 * `?volo=forza` salta i controlli, per provarlo su qualsiasi macchina.
 * `?palette=ciano` o `?palette=bianco` mostra le palette alternative (la base e l aurora).
 */
const SCELTA_VOLO = `(function(){try{
var d=document.documentElement,f=location.search.indexOf('volo=forza')>-1,n=navigator,c=n.connection;
var p=/[?&]palette=(ciano|bianco)/.exec(location.search);if(p)d.setAttribute('data-palette',p[1]);
if(!f){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
if((n.deviceMemory&&n.deviceMemory<3)||(n.hardwareConcurrency&&n.hardwareConcurrency<4)||(c&&c.saveData))return;}
var cv=document.createElement('canvas'),gl=cv.getContext('webgl2');if(!gl)return;
if(!f){var e=gl.getExtension('WEBGL_debug_renderer_info'),r=e?String(gl.getParameter(e.UNMASKED_RENDERER_WEBGL)):'';
if(/swiftshader|llvmpipe|software|basic render/i.test(r))return;}
var l=gl.getExtension('WEBGL_lose_context');if(l)l.loseContext();
d.classList.add('volo');}catch(x){}})();`
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
    'Recuperiamo il fatturato che il suo studio dentistico sta già perdendo: chiamate senza risposta, preventivi fermi, pazienti che non tornano, recensioni ferme. Misurato prima e dopo.',
  keywords: [
    'automazione studio dentistico',
    'segreteria AI dentista',
    'recupero preventivi odontoiatria',
    'riattivazione pazienti dentista',
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
      'Chiamate senza risposta, preventivi fermi, pazienti che non tornano. Misuriamo quanto le costano oggi, poi lo recuperiamo.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agenti Studio — automazioni AI per studi dentistici',
    description:
      'Chiamate senza risposta, preventivi fermi, pazienti che non tornano. Misuriamo quanto le costano oggi, poi lo recuperiamo.',
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
    <html lang="it" className={`${sans.variable} ${display.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCELTA_VOLO }} />
      </head>
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
