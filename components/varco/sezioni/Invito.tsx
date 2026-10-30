'use client'

// L'invito (DESIGN_SPEC-pagine §8.8): la frase al centro con il battito (quattro battiti, poi ferma), il pulsante sotto, e l'eco della
// mascotte sul pulsante. Il battito parte all'ingresso, una volta. Movimento ridotto: nessun battito.
import { useEffect, useRef } from 'react'
import type { Frase } from '../dati/pagine.ts'
import { posizioneAccento } from '../testo.ts'

function conAccento(testo: string, accento?: string) {
  const i = posizioneAccento(testo, accento)
  if (!accento || i < 0) return testo
  return (
    <>
      {testo.slice(0, i)}
      <em className="accento toccata">{accento}</em>
      {testo.slice(i + accento.length)}
    </>
  )
}

export default function Invito({ frasi, nota }: { frasi: Frase[]; nota: string }) {
  const radice = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = radice.current
    if (!el) return
    const o = new IntersectionObserver(([v]) => {
      if (v.isIntersecting) {
        el.dataset.attivo = 'true'
        o.disconnect()
      }
    }, { threshold: 0.45 })
    o.observe(el)
    return () => o.disconnect()
  }, [])

  return (
    <section ref={radice} className="sezione invito" data-modo="invito" aria-label="Invito">
      <div className="invito-ancora" data-ancora="invito" data-scala="0.85" aria-hidden="true" />
      <p className="invito-frase">
        {frasi.map((f) => <span className="invito-riga" key={f[0]}>{conAccento(f[0], f[1])}</span>)}
      </p>
      <div className="invito-pulsante" data-scena="invito" data-scala="3.2">
        <a className="pulsante" href="#preventivo">Richiedi un preventivo</a>
        <p className="pulsante-sotto">{nota}</p>
      </div>
    </section>
  )
}
