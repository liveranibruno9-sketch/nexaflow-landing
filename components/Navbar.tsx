'use client'

import { useState, useEffect } from 'react'

const links = [
  ['#servizi', 'Servizi'],
  ['#come-funziona', 'Come funziona'],
  ['#esempi', 'Esempi'],
  ['#faq', 'FAQ'],
] as const

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0a0a14]/95 backdrop-blur-md border-b border-white/[0.07]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="text-xl font-bold text-white">
          Nexa<span className="text-violet-400">flow</span>
        </a>

        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          {links.map(([href, label]) => (
            <a key={href} href={href} className="hover:text-white transition-colors">
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#contatti"
            className="hidden md:block bg-violet-600 hover:bg-violet-500 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Prenota una call
          </a>
          <button
            className="md:hidden text-gray-300 hover:text-white p-1"
            onClick={() => setOpen(!open)}
            aria-label="Apri menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="7" x2="21" y2="7" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="17" x2="21" y2="17" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-[#0a0a14]/98 border-b border-white/[0.07] px-6 py-5 space-y-1">
          {links.map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="block text-gray-300 hover:text-white text-sm py-2.5"
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}
          <div className="pt-3">
            <a
              href="#contatti"
              className="block bg-violet-600 hover:bg-violet-500 text-white font-semibold px-4 py-3 rounded-lg text-sm text-center"
              onClick={() => setOpen(false)}
            >
              Prenota una call gratuita
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
