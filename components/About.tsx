export default function About() {
  return (
    <section id="chi-sono" className="py-24 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="bg-[#f7f5ff] border border-violet-100 rounded-2xl p-8 md:p-10 flex flex-col sm:flex-row gap-7 items-start">
          {/* Monogram avatar */}
          <div className="w-20 h-20 rounded-2xl bg-violet-600 flex items-center justify-center shrink-0 shadow-lg shadow-violet-200">
            <span className="text-white text-2xl font-bold tracking-wide">BL</span>
          </div>

          <div>
            <p className="text-xs font-semibold text-violet-600 uppercase tracking-widest mb-2">
              Chi c&apos;è dietro
            </p>
            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-3">Bruno Liverani</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Nexaflow è un progetto founder-led: ogni sistema lo progetto, lo costruisco e lo
              mantengo io, senza intermediari. Lavoro con uno stack moderno — n8n, Claude AI e le
              API native degli strumenti che il tuo studio usa già — e ogni automazione che
              propongo gira prima nei miei stessi processi: email, contenuti, reportistica.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mb-5">
              Niente call center, niente account manager: parli direttamente con chi costruisce il
              tuo sistema. Base in Romagna, clienti seguiti in tutta Italia, da remoto.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-violet-700 bg-violet-50 border border-violet-200 rounded-full px-3 py-1 font-medium">
                Stack: n8n + Claude AI
              </span>
              <span className="text-xs text-violet-700 bg-violet-50 border border-violet-200 rounded-full px-3 py-1 font-medium">
                Risposta entro 24h
              </span>
              <span className="text-xs text-violet-700 bg-violet-50 border border-violet-200 rounded-full px-3 py-1 font-medium">
                Faenza · tutta Italia
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
