'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Contatore che sale quando entra nel viewport.
 *
 * Note:
 * - Rispetta `prefers-reduced-motion`: chi chiede meno movimento vede subito
 *   il numero finale, senza animazione.
 * - Il numero e renderizzato con cifre tabulari: senza, mentre sale le cifre
 *   cambiano larghezza e il numero "balla".
 * - Parte solo una volta, poi l'observer si disconnette.
 */
export default function Contatore({
  a,
  da = 0,
  durata = 1400,
  prefisso = '',
  suffisso = '',
  decimali = 0,
  className = '',
}: {
  a: number
  da?: number
  durata?: number
  prefisso?: string
  suffisso?: string
  decimali?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [valore, setValore] = useState(da)
  const partito = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const menoMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (menoMovimento) {
      setValore(a)
      return
    }

    let chiusura = 0

    const osservatore = new IntersectionObserver(
      (voci) => {
        if (!voci[0].isIntersecting || partito.current) return
        partito.current = true
        osservatore.disconnect()

        const inizio = performance.now()
        // stessa curva delle transizioni CSS: parte veloce, si posa piano
        const morbida = (t: number) => 1 - Math.pow(1 - t, 3)

        const passo = (ora: number) => {
          const t = Math.min((ora - inizio) / durata, 1)
          setValore(da + (a - da) * morbida(t))
          if (t < 1) requestAnimationFrame(passo)
        }
        requestAnimationFrame(passo)

        // Rete di sicurezza: se requestAnimationFrame viene strozzato (scheda in
        // background, browser headless, risparmio energetico) il contatore
        // resterebbe fermo a meta. Qui arriva comunque al valore finale.
        chiusura = window.setTimeout(() => setValore(a), durata + 400)
      },
      { threshold: 0.4 },
    )

    osservatore.observe(el)
    return () => {
      osservatore.disconnect()
      if (chiusura) window.clearTimeout(chiusura)
    }
  }, [a, da, durata])

  const formattato = new Intl.NumberFormat('it-IT', {
    minimumFractionDigits: decimali,
    maximumFractionDigits: decimali,
    useGrouping: true,
  }).format(valore)

  return (
    <span ref={ref} className={`num ${className}`}>
      {prefisso}
      {formattato}
      {suffisso}
    </span>
  )
}
