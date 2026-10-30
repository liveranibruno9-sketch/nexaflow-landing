'use client'

// «Ferma il movimento» (WCAG 2.2.2, DESIGN_SPEC-pagine §8.11): ferma davvero il respiro delle mascotte, la deriva della materia, i
// battiti e le animazioni continue. Mette `fermo` su <html>: lo leggono il CSS e il mondo (il suo tempo non avanza più).
// Lo scroll resta libero: ciò che si muove perché lo muove la mano non è automatico. La scelta si ricorda nella sessione.
import { useEffect, useState } from 'react'

export default function FermaMovimento({ className = '' }: { className?: string }) {
  const [fermo, setFermo] = useState(false)

  useEffect(() => {
    let salvato = false
    try { salvato = sessionStorage.getItem('fermo') === '1' } catch {}
    if (salvato) {
      document.documentElement.classList.add('fermo')
      setFermo(true)
    }
  }, [])

  const alterna = () => {
    const v = !fermo
    setFermo(v)
    document.documentElement.classList.toggle('fermo', v)
    try { sessionStorage.setItem('fermo', v ? '1' : '0') } catch {}
    window.dispatchEvent(new Event('pagina:fermo'))
  }

  return (
    <button type="button" className={`ferma-movimento ${className}`} aria-pressed={fermo} onClick={alterna}>
      {fermo ? 'Riprendi il movimento' : 'Ferma il movimento'}
    </button>
  )
}
