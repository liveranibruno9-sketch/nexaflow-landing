'use client'

// Il menu (D35). Telefono: pulsante `Menu` che apre un pannello a tutto schermo con le quattro pagine e il preventivo.
// Computer: niente pulsante, le voci stanno in linea nella testata (lo decide il CSS; il <nav> è sempre lo stesso).
// Il <nav> è nel DOM anche da chiuso (Google legge i collegamenti), con `hidden`.
import { useCallback, useEffect, useRef, useState } from 'react'
import { CONTATTI, VOCI_MENU } from './dati/contatti'
import type { Servizio } from './dati/contatti'

const COMPUTER = '(min-width: 901px) and (orientation: landscape)'

export default function Menu({ corrente }: { corrente: 'home' | Servizio }) {
  const [aperto, setAperto] = useState(false)
  const bottone = useRef<HTMLButtonElement>(null)
  const staAperto = useRef(false)   // Escape deve agire solo a menu aperto (e non rubare il fuoco altrove)

  // lo scorrimento della pagina si blocca mentre il menu è aperto (come components/Nav.tsx); si imposta qui dentro,
  // non in un effetto, così vale subito anche per i comandi che arrivano fuori da un evento di React
  const imposta = useCallback((v: boolean) => {
    staAperto.current = v
    setAperto(v)
    document.body.style.overflow = v ? 'hidden' : ''
  }, [])

  useEffect(() => {
    const suTasto = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || !staAperto.current) return
      imposta(false)
      bottone.current?.focus()
    }
    // se il telefono si gira e il menu diventa la riga in testata, lo scorrimento torna libero
    const pc = window.matchMedia(COMPUTER)
    const suCambio = () => { if (pc.matches) imposta(false) }
    document.addEventListener('keydown', suTasto)
    pc.addEventListener('change', suCambio)
    return () => {
      document.removeEventListener('keydown', suTasto)
      pc.removeEventListener('change', suCambio)
      document.body.style.overflow = ''
    }
  }, [imposta])

  return (
    <>
      <button
        ref={bottone}
        type="button"
        className="menu-bottone"
        data-menu=""
        aria-expanded={aperto}
        aria-controls="menu-film"
        aria-label={aperto ? 'Chiudi il menu' : 'Apri il menu'}
        onClick={() => imposta(!aperto)}
      >
        {aperto ? (
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M5 5l14 14M19 5L5 19" />
          </svg>
        ) : (
          <span aria-hidden="true">Menu</span>
        )}
      </button>
      <nav id="menu-film" className="menu-film" aria-label="Pagine del sito" hidden={!aperto}>
        <ul className="menu-voci">
          {VOCI_MENU.map((v) => (
            <li key={v.href}>
              <a
                className="menu-voce"
                href={v.href}
                data-materia={v.materia}
                aria-current={corrente === v.href.slice(1) ? 'page' : undefined}
                onClick={() => imposta(false)}
              >
                <span className="menu-num">{v.num}</span>
                <span className="menu-testo">{v.testo}</span>
              </a>
            </li>
          ))}
        </ul>
        <a className="menu-preventivo" href="#preventivo" onClick={() => imposta(false)}>
          <span className="solo-telefono">Richiedi un preventivo</span>
          <span className="solo-computer">Preventivo</span>
        </a>
        <a className="menu-riga" href={CONTATTI.whatsapp} target="_blank" rel="noopener">
          WhatsApp · {CONTATTI.telefonoLeggibile}
        </a>
      </nav>
    </>
  )
}
