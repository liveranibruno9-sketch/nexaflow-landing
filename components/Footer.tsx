export default function Footer() {
  return (
    <footer className="border-t border-slate-800 py-10 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
        <div>
          <span className="text-white font-bold">
            Nexa<span className="text-violet-400">flow</span>
          </span>
          <span className="ml-2">— Automazione B2B per studi professionali</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#servizi" className="hover:text-white transition-colors">
            Servizi
          </a>
          <a href="#come-funziona" className="hover:text-white transition-colors">
            Come funziona
          </a>
          <a href="#contatti" className="hover:text-white transition-colors">
            Contatti
          </a>
          <a href="mailto:liveranibruno9@gmail.com" className="hover:text-white transition-colors">
            liveranibruno9@gmail.com
          </a>
        </div>
        <div>© 2026 Nexaflow</div>
      </div>
    </footer>
  )
}
