import type { Viewport } from 'next'
import BarraContatti from '@/components/film/BarraContatti'
import '@/components/film/film.css'
import '@/components/varco/varco.css'
import { SCELTA_VARCO } from '@/components/varco/livello'

// `js`: c'è JavaScript (il pulsante Menu serve solo allora). `varco`: il dispositivo fa il mondo 3D (SCELTA_VARCO decide
// prima del primo disegno: movimento ridotto, risparmio dati, poca memoria, niente WebGL2 o grafica software → pagina normale).
const SCELTA = "document.documentElement.classList.add('js');" + SCELTA_VARCO

export const viewport: Viewport = { themeColor: '#000000', colorScheme: 'dark' }

export default function FilmLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Primo figlio del body: mette le classi su <html> prima del disegno (SCELTA). */}
      <script dangerouslySetInnerHTML={{ __html: SCELTA }} />
      {/* la barra dei contatti è su tutte le pagine film (R10), dopo i figli */}
      <div className="film-radice">
        {children}
        <BarraContatti />
      </div>
    </>
  )
}
