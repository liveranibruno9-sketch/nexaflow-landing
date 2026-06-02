export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-sm border-b border-slate-800/50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="text-xl font-bold text-white">
          Nexa<span className="text-cyan-400">flow</span>
        </span>
        <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
          <a href="#servizi" className="hover:text-white transition-colors">Servizi</a>
          <a href="#come-funziona" className="hover:text-white transition-colors">Come funziona</a>
          <a href="#esempi" className="hover:text-white transition-colors">Esempi</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </div>
        <a
          href="#contatti"
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
        >
          Prenota una call
        </a>
      </div>
    </nav>
  )
}
