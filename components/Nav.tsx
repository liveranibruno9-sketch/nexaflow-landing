'use client'

import { useEffect, useState } from 'react'

const VOCI = [
  { href: '#perdite', label: 'Il problema' },
  { href: '#cielo', label: 'Cosa facciamo' },
  { href: '#processo', label: 'Come si parte' },
  { href: '#conformita', label: 'Regole' },
  { href: '#domande', label: 'Domande' },
]

export default function Nav() {
  const [aperto, setAperto] = useState(false)
  const [staccato, setStaccato] = useState(false)

  useEffect(() => {
    const onScroll = () => setStaccato(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = aperto ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [aperto])

  return (
    <>
      {/* barra di progresso della lettura, CSS puro */}
      <div className="fixed inset-x-0 top-0 z-[60] h-[2px] bg-transparent">
        <div className="barra-progresso h-full w-full origin-left bg-[linear-gradient(90deg,var(--blu),var(--celeste))]" />
      </div>

      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-soft ${staccato ? 'py-2' : 'py-4'}`}>
        <div className="wrap">
          <div
            className={`flex items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 ease-soft sm:px-5 ${
              staccato ? 'vetro shadow-[0_14px_40px_-22px_rgba(0,0,0,.9)]' : 'border border-transparent'
            }`}
          >
            <a href="#top" className="flex items-center gap-2.5" aria-label="Agenti Studio, torna su">
              <Marchio />
              <span className="text-s0 font-medium tracking-[-0.02em]">Agenti Studio</span>
            </a>

            <nav className="hidden items-center gap-7 md:flex" aria-label="Principale">
              {VOCI.map((v) => (
                <a key={v.href} href={v.href} className="text-s-1 tenue transition-colors hover:text-[var(--bianco)]">
                  {v.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <a href="#verifica" className="btn btn-primario hidden !min-h-0 !px-5 !py-2.5 sm:inline-flex">
                Verifica gratuita
              </a>
              <button
                type="button"
                onClick={() => setAperto((v) => !v)}
                aria-expanded={aperto}
                aria-label={aperto ? 'Chiudi il menu' : 'Apri il menu'}
                className="grid h-11 w-11 place-items-center rounded-full border border-[var(--bordo-forte)] md:hidden"
              >
                <span className="relative block h-3 w-4">
                  <span
                    className={`absolute left-0 block h-[1.5px] w-4 bg-current transition-transform duration-300 ease-soft ${
                      aperto ? 'top-1.5 rotate-45' : 'top-0'
                    }`}
                  />
                  <span
                    className={`absolute left-0 block h-[1.5px] w-4 bg-current transition-transform duration-300 ease-soft ${
                      aperto ? 'top-1.5 -rotate-45' : 'top-3'
                    }`}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* menu mobile */}
      <div
        className={`fixed inset-0 z-40 bg-[color-mix(in_srgb,#05070F_96%,transparent)] backdrop-blur-xl transition-opacity duration-500 ease-soft md:hidden ${
          aperto ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="wrap flex h-full flex-col justify-center gap-2 pt-16">
          {VOCI.map((v) => (
            <a
              key={v.href}
              href={v.href}
              onClick={() => setAperto(false)}
              className="serif border-b border-[var(--bordo)] py-5 text-s3"
            >
              {v.label}
            </a>
          ))}
          <a href="#verifica" onClick={() => setAperto(false)} className="btn btn-primario mt-8 w-full">
            Richiedi la verifica gratuita
          </a>
        </div>
      </div>
    </>
  )
}

/** Il marchio: la A di Agenti, con la barra arancione. Due stelle ai piedi. */
function Marchio() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true" className="shrink-0">
      <rect x="0.7" y="0.7" width="26.6" height="26.6" rx="7.6" stroke="var(--celeste)" strokeOpacity="0.35" strokeWidth="1.4" />
      <path d="M8 19.5 L14 8 L20 19.5" stroke="var(--blu-luce)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.6 15 H17.4" stroke="var(--arancio)" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="14" cy="8" r="1.6" fill="var(--giallo)" />
    </svg>
  )
}
