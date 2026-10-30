'use client'

// Le tappe (DESIGN_SPEC-pagine §8.1): chiamata, proposta, consegna. Una scia si disegna scorrendo; ogni punto si accende quando entra
// il suo testo. Senza JavaScript e con movimento ridotto la scia è già intera e i punti sono accesi (lista ordinata normale).
import { useEffect, useRef } from 'react'
import type { Passo } from '../dati/pagine.ts'

export default function Tappe({ h2, nomi, passi, riga }: { h2: string; nomi: [string, string, string]; passi: Passo[]; riga: string }) {
  const radice = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = radice.current
    if (!el) return
    const ridotto = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const tappe = Array.from(el.querySelectorAll<HTMLElement>('.tappa'))
    const lista = el.querySelector<HTMLElement>('.tappe-lista')
    if (!lista) return
    if (ridotto) {
      el.style.setProperty('--p', '1')
      tappe.forEach((t) => (t.dataset.acceso = 'true'))
      return
    }
    el.classList.add('anima')
    const aggiorna = () => {
      const r = lista.getBoundingClientRect()
      const linea = window.innerHeight * 0.68
      const p = Math.min(1, Math.max(0, (linea - r.top) / Math.max(1, r.height)))
      el.style.setProperty('--p', p.toFixed(3))
      tappe.forEach((t) => {
        const acceso = t.getBoundingClientRect().top < linea
        if ((t.dataset.acceso === 'true') !== acceso) t.dataset.acceso = acceso ? 'true' : 'false'
      })
    }
    aggiorna()
    window.addEventListener('scroll', aggiorna, { passive: true })
    window.addEventListener('resize', aggiorna)
    return () => {
      window.removeEventListener('scroll', aggiorna)
      window.removeEventListener('resize', aggiorna)
    }
  }, [])

  return (
    <section ref={radice} className="sezione tappe" data-modo="tappe" aria-labelledby="tappe-t">
      <div className="tappe-testa">
        <h2 id="tappe-t" className="sezione-titolo cresce">{h2}</h2>
        <div className="tappe-ancora" data-ancora="tappe" data-scala="0.9" aria-hidden="true" />
      </div>
      <ol className="tappe-lista">
        <li className="tappe-scia" aria-hidden="true" />
        {nomi.map((nome, k) => (
          <li className="tappa cresce" key={nome} data-acceso="true">
            <span className="tappa-punto" aria-hidden="true" />
            <h3 className="tappa-nome">{nome}</h3>
            <ol className="passi">
              {passi.filter((p) => p.tappa === k).map((p) => (
                <li className="passo-voce" key={p.titolo}>
                  <h4 className="passo-titolo">{p.titolo}</h4>
                  <p className="passo-testo">{p.testo}</p>
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ol>
      <p className="tappe-riga cresce">{riga}</p>
    </section>
  )
}
