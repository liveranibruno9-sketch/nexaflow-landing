import type { Viewport } from 'next'
import '@/components/film/film.css'

export const viewport: Viewport = { themeColor: '#000000', colorScheme: 'dark' }

export default function FilmLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Primo figlio del body: mette la classe `film` su <html> prima del disegno. */}
      <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('film')" }} />
      <div className="film-radice">{children}</div>
    </>
  )
}
