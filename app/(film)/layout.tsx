import type { Viewport } from 'next'
import BarraContatti from '@/components/film/BarraContatti'
import '@/components/film/film.css'

// `film`: fondo nero. `film-js`: c'è JavaScript, il primo disegno è già lo stato del film a u = 0 (poster a tutto
// schermo, accese solo le battute da 0) invece dei testi in fila: nessun salto quando il motore mette `film-attivo`.
// Salvagente: se dopo 6 s il motore non è partito (`film-attivo` assente) si toglie `film-js` e la pagina torna
// al layout in fila, leggibile.
const SCELTA_FILM =
  "(function(){var h=document.documentElement;h.classList.add('film');h.classList.add('film-js');" +
  "setTimeout(function(){if(!h.classList.contains('film-attivo'))h.classList.remove('film-js')},6000)})()"

export const viewport: Viewport = { themeColor: '#000000', colorScheme: 'dark' }

export default function FilmLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Primo figlio del body: mette le classi su <html> prima del disegno (SCELTA_FILM). */}
      <script dangerouslySetInnerHTML={{ __html: SCELTA_FILM }} />
      {/* la barra dei contatti è su tutte le pagine film (R10), dopo i figli */}
      <div className="film-radice">
        {children}
        <BarraContatti />
      </div>
    </>
  )
}
