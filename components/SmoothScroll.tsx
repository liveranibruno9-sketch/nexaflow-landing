'use client'

import { ReactLenis } from 'lenis/react'

/**
 * Smooth scroll con Lenis.
 *
 * Note operative:
 * - Lenis rispetta gia `prefers-reduced-motion` di default: quando l'utente
 *   chiede meno movimento, lo smoothing si disattiva da solo e la preferenza
 *   viene letta a caldo, senza ricaricare la pagina.
 * - `smoothWheel: true` ma niente smoothing sul touch: i dispositivi touch
 *   hanno gia un momentum nativo tarato sul loro input, sovrascriverlo peggiora.
 * - Montato sulla radice (`root`) per non rompere gli elementi `position: sticky`
 *   usati dalla pila di card.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.1,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.6,
      }}
    >
      {children}
    </ReactLenis>
  )
}
