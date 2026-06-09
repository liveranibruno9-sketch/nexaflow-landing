export default function Footer() {
  return (
    <footer className="bg-[#0a0a14] border-t border-white/[0.06] py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8">
          <div>
            <div className="text-xl font-bold text-white mb-1">
              Nexa<span className="text-violet-400">flow</span>
            </div>
            <p className="text-gray-500 text-sm">Automazione B2B per studi professionali italiani</p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
            <a href="#servizi" className="hover:text-white transition-colors">Servizi</a>
            <a href="#come-funziona" className="hover:text-white transition-colors">Come funziona</a>
            <a href="#esempi" className="hover:text-white transition-colors">Esempi</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <a href="#contatti" className="hover:text-white transition-colors">Contatti</a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com/nexaflow_it"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.10] transition-all"
              aria-label="Instagram"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          </div>
        </div>

        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <span>© 2026 Nexaflow. Tutti i diritti riservati.</span>
          <a href="mailto:info@nexaflow.it" className="hover:text-gray-400 transition-colors">
            info@nexaflow.it
          </a>
        </div>
      </div>
    </footer>
  )
}
