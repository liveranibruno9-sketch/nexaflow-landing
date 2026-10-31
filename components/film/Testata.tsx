// La testata delle pagine film (D35): marchio, indice del blocco (lo scrive Varco), barra di avanzamento e menu.
// Componente server: l'unica parte con stato è il Menu. Ogni collegamento è un <a> semplice, mai next/link
// (le classi su <html> e lo script del varco non si rieseguono in navigazione morbida).
// Barra: una riga blu che avanza lungo tutto il percorso; in home, dall'1.9 della soglia, si divide in quattro segmenti
// colorati (uno per tratto), ognuno pieno per la frazione del suo tratto (lo decide Varco con `html.porte` e `--p`).
import type { PaginaCorrente } from './dati/contatti'
import Menu from './Menu'

const MATERIE = ['polvere', 'vetro', 'saette', 'cromo'] as const

/** indice: il numero e il nome fissi per le pagine senza film (le approfondimento delle automazioni); il film lo aggiorna da sé */
export default function Testata({ corrente, indice = ['00', 'Apertura'] }: { corrente: PaginaCorrente; indice?: [string, string] }) {
  return (
    <header className="testata" data-corrente={corrente}>
      <div className="avanz" aria-hidden="true">
        <i className="avanz-blu" data-seg="blu" />
        {corrente === 'home' ? MATERIE.map((m) => <i key={m} className="seg" data-materia={m} />) : null}
      </div>
      <a className="marchio" href="/">Agenti Studio</a>
      {/* decorativo: il blocco in corso, aggiornato da Varco dall'`etichetta` del blocco */}
      <p className="indice" aria-hidden="true">
        <span className="indice-num">{indice[0]}</span>
        <span className="indice-nome">{indice[1]}</span>
      </p>
      <Menu corrente={corrente} />
    </header>
  )
}
