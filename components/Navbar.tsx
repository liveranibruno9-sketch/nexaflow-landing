export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#faf8ff]/80 backdrop-blur-sm border-b border-violet-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="text-xl font-bold text-[#1a1a2e]">
          Nexa<span className="text-violet-600">flow</span>
        </span>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-500">
          <a href="#servizi" className="hover:text-[#1a1a2e] transition-colors">Servizi</a>
          <a href="#come-funziona" className="hover:text-[#1a1a2e] transition-colors">Come funziona</a>
          <a href="#esempi" className="hover:text-[#1a1a2e] transition-colors">Esempi</a>
          <a href="#faq" className="hover:text-[#1a1a2e] transition-colors">FAQ</a>
        </div>
        <a
          href="#contatti"
          className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors shadow-sm"
        >
          Prenota una call
        </a>
      </div>
    </nav>
  )
}
