// La testata delle pagine film (D35): marchio, indice del blocco (lo scrive Varco), barra di avanzamento e menu.
// Componente server: l'unica parte con stato è il Menu. Ogni collegamento è un <a> semplice, mai next/link
// (le classi su <html> e lo script del varco non si rieseguono in navigazione morbida).
// Barra: una riga blu che avanza lungo tutto il percorso; in home, dall'1.9 della soglia, si divide in quattro segmenti
// colorati (uno per tratto), ognuno pieno per la frazione del suo tratto (lo decide Varco con `html.porte` e `--p`).
import type { PaginaCorrente } from './dati/contatti'
import Menu from './Menu'

const MATERIE = ['polvere', 'vetro', 'saette', 'cromo'] as const

export default function Testata({ corrente }: { corrente: PaginaCorrente }) {
  return (
    <header className="testata" data-corrente={corrente}>
      <div className="avanz" aria-hidden="true">
        <i className="avanz-blu" data-seg="blu" />
        {corrente === 'home' ? MATERIE.map((m) => <i key={m} className="seg" data-materia={m} />) : null}
      </div>
      <a className="marchio" href="/">Agenti Studio</a>
      {/* decorativo: il blocco in corso, aggiornato da Varco dall'`etichetta` del blocco */}
      <p className="indice" aria-hidden="true">
        <span className="indice-num">00</span>
        <span className="indice-nome">Apertura</span>
      </p>
      <Menu corrente={corrente} />
    </header>
  )
}
