'use client'

// La comparsa delle sezioni normali (DESIGN_SPEC-pagine §8.8): titolo, poi testo, poi elementi, una volta sola, sfalsati di 70 ms.
// Senza JavaScript tutto è visibile; con movimento ridotto cambia solo l'opacità (lo decide il CSS).
import { useEffect } from 'react'

export default function Rivela() {
  useEffect(() => {
    const el = Array.from(document.querySelectorAll<HTMLElement>('.cresce:not(.visto)'))
    if (!('IntersectionObserver' in window)) {
      el.forEach((e) => e.classList.add('visto'))
      return
    }
    const o = new IntersectionObserver((voci) => {
      for (const v of voci) {
        if (!v.isIntersecting) continue
        const e = v.target as HTMLElement
        const fratelli = Array.from(e.parentElement?.querySelectorAll(':scope > .cresce') ?? [])
        e.style.transitionDelay = `${Math.max(0, fratelli.indexOf(e)) * 70}ms`
        e.classList.add('visto')
        o.unobserve(e)
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })
    el.forEach((e) => o.observe(e))
    return () => o.disconnect()
  }, [])
  return null
}
