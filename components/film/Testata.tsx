// La testata delle pagine film (D35): marchio, indice dell'atto (lo scrive il motore), barra di avanzamento e menu.
// Componente server: l'unica parte con stato è il Menu. Ogni collegamento è un <a> semplice, mai next/link
// (la classe `film` su <html> e lo script del volo non si rieseguono in navigazione morbida).
import type { Servizio } from './dati/contatti'
import Menu from './Menu'

export default function Testata({ corrente }: { corrente: 'home' | Servizio }) {
  return (
    <header className="testata" data-corrente={corrente}>
      <div className="avanz" aria-hidden="true" />
      <a className="marchio" href="/">Agenti Studio</a>
      {/* decorativo: l'atto in corso, aggiornato dal motore da `atto.etichetta` e `atto.nome` */}
      <p className="indice" aria-hidden="true">
        <span className="indice-num">00</span>
        <span className="indice-nome">Apertura</span>
      </p>
      <Menu corrente={corrente} />
    </header>
  )
}
