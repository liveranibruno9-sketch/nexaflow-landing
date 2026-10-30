'use client'

// «Quattro servizi, un unico studio» (DESIGN_SPEC-pagine §13): le quattro mascotte in fila, ognuna sopra il suo servizio. La cosa da fare
// con la mano di questa pagina: al passaggio del mouse o al fuoco su un servizio la sua mascotte fa la sua capacità in piccolo; sul
// telefono la fa una volta quando entra nello schermo. Il collegamento è un collegamento normale (mai il doppio tocco).
import { useEffect, useRef } from 'react'
import type { DatiChiSiamo } from '../dati/chi-siamo.ts'

export default function Servizi({ h2, voci }: DatiChiSiamo['servizi']) {
  const radice = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = radice.current
    if (!el) return
    const fatti = new Set<string>()
    const o = new IntersectionObserver((v) => {
      for (const x of v) {
        const id = (x.target as HTMLElement).dataset.mascotte
        if (x.isIntersecting && id && !fatti.has(id) && window.matchMedia('(hover: none)').matches) {
          fatti.add(id)
          window.setTimeout(() => window.dispatchEvent(new CustomEvent('pagina:gesto-servizio', { detail: { id } })), 500)
        }
      }
    }, { threshold: 0.7 })
    el.querySelectorAll('.servizio-posto').forEach((p) => o.observe(p))
    return () => o.disconnect()
  }, [])

  const gesto = (id: string) => window.dispatchEvent(new CustomEvent('pagina:gesto-servizio', { detail: { id } }))

  return (
    <section ref={radice} className="sezione servizi-chi" data-modo="servizi" aria-labelledby="servizi-t">
      <h2 id="servizi-t" className="sezione-titolo cresce">{h2}</h2>
      <ul className="servizi-lista">
        {voci.map((v) => (
          <li className="servizio-voce cresce" key={v.id} data-materia={v.materia} onMouseEnter={() => gesto(v.id)} onFocus={() => gesto(v.id)}>
            <div className="servizio-posto" data-ancora="servizi" data-mascotte={v.id} data-scala="0.95" aria-hidden="true" />
            <a className="servizio-link" href={v.href}>
              <span className="servizio-nome">{v.nome}</span>
              <span className="servizio-riga">{v.riga}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
