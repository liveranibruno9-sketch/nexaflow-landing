'use client'

import { useEffect, useRef } from 'react'

/**
 * Il cielo di fondo, fisso dietro tutta la pagina.
 *
 * Tre strati di stelle a profondita diverse, ognuno disegnato UNA volta su un
 * canvas. Niente ciclo di animazione in JavaScript: la prima versione
 * ridisegnava 30 volte al secondo e su un telefono medio costava oltre un
 * secondo di processore bloccato (Lighthouse, 27/9/2026).
 *
 * - Parallasse: gli strati vicini salgono piano mentre si scorre la pagina,
 *   con un'animazione CSS legata allo scroll. La muove il compositore grafico,
 *   non il processore principale.
 * - Scintillio: una trentina di stelle in HTML con un'animazione CSS di sola
 *   opacita, anche questa sul compositore.
 * - Movimento ridotto: niente parallasse e niente scintillio (vedi globals.css).
 * - Senza canvas o senza JavaScript resta il colore di fondo, piu le stelle
 *   che scintillano, che sono gia nell'HTML.
 */

type Strato = { densita: number; rMin: number; rMax: number; alfaMin: number; alfaMax: number }

const STRATI: Strato[] = [
  { densita: 0.00016, rMin: 0.3, rMax: 0.75, alfaMin: 0.22, alfaMax: 0.55 }, // lontano, fermo
  { densita: 0.00006, rMin: 0.55, rMax: 1.05, alfaMin: 0.35, alfaMax: 0.8 }, // medio
  { densita: 0.000016, rMin: 0.85, rMax: 1.5, alfaMin: 0.55, alfaMax: 0.95 }, // vicino
]

/** generatore pseudo-casuale con seme: il cielo e lo stesso a ogni visita, e
 *  le stelle che scintillano sono identiche fra server e browser */
function mulberry32(seme: number) {
  return () => {
    seme |= 0
    seme = (seme + 0x6d2b79f5) | 0
    let t = Math.imul(seme ^ (seme >>> 15), 1 | seme)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function colore(caso: () => number) {
  const c = caso()
  if (c < 0.72) return '242,245,255' // bianco stella
  if (c < 0.92) return '158,216,255' // celeste
  if (c < 0.97) return '255,226,74' // giallo, raro
  return '255,107,44' // arancione, rarissimo
}

const SCINTILLE = (() => {
  const caso = mulberry32(7)
  return Array.from({ length: 30 }, () => ({
    x: +(caso() * 100).toFixed(2),
    y: +(caso() * 100).toFixed(2),
    r: +(1 + caso() * 1.4).toFixed(2),
    durata: +(2.4 + caso() * 3.6).toFixed(2),
    ritardo: +(-caso() * 6).toFixed(2),
    colore: caso() < 0.75 ? '#F2F5FF' : '#9ED8FF',
  }))
})()

export default function Cielo() {
  const radice = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = radice.current
    if (!el) return
    const tele = Array.from(el.querySelectorAll('canvas'))

    const disegna = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const caso = mulberry32(20260927)
      tele.forEach((canvas, i) => {
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        const w = canvas.clientWidth
        const h = canvas.clientHeight
        canvas.width = Math.round(w * dpr)
        canvas.height = Math.round(h * dpr)
        ctx.scale(dpr, dpr)
        const s = STRATI[i]
        const quante = Math.round(w * h * s.densita)
        for (let k = 0; k < quante; k++) {
          const x = caso() * w
          const y = caso() * h
          const r = s.rMin + caso() * (s.rMax - s.rMin)
          const alfa = s.alfaMin + caso() * (s.alfaMax - s.alfaMin)
          ctx.beginPath()
          ctx.arc(x, y, r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${colore(caso)},${alfa.toFixed(2)})`
          ctx.fill()
        }
      })
    }

    disegna()

    // sui telefoni l'altezza cambia di continuo con la barra degli indirizzi:
    // si ridisegna solo se cambia la larghezza
    let larghezza = window.innerWidth
    let attesa = 0
    const alRidimensionamento = () => {
      window.clearTimeout(attesa)
      attesa = window.setTimeout(() => {
        if (window.innerWidth === larghezza) return
        larghezza = window.innerWidth
        disegna()
      }, 200)
    }
    window.addEventListener('resize', alRidimensionamento)
    return () => {
      window.clearTimeout(attesa)
      window.removeEventListener('resize', alRidimensionamento)
    }
  }, [])

  return (
    <div ref={radice} className="cielo" aria-hidden="true">
      {STRATI.map((_, i) => (
        <div key={i} className={`cielo-strato cielo-strato-${i}`}>
          <canvas />
          {i === 2
            ? SCINTILLE.map((s, k) => (
                <span
                  key={k}
                  className="scintilla"
                  style={{
                    left: `${s.x}%`,
                    top: `${s.y}%`,
                    width: s.r * 2,
                    height: s.r * 2,
                    background: s.colore,
                    boxShadow: `0 0 ${Math.round(s.r * 5)}px ${s.colore}`,
                    animationDuration: `${s.durata}s`,
                    animationDelay: `${s.ritardo}s`,
                  }}
                />
              ))
            : null}
        </div>
      ))}
    </div>
  )
}
