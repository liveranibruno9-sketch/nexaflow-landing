export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-16 relative overflow-hidden">
      {/* Radial violet glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center top, rgba(139,92,246,0.22) 0%, transparent 70%)',
        }}
      />
      {/* Bottom fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0d0d1f] pointer-events-none" />
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #6d28d9 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-block bg-violet-500/10 border border-violet-500/30 rounded-full px-4 py-1.5 text-violet-400 text-sm font-medium mb-8">
          Automazione B2B per studi professionali
        </div>

        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 tracking-tight">
          Il tuo studio,<br />
          <span className="text-violet-400">senza lavoro ripetitivo</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Nexaflow costruisce workflow automatici su misura per commercialisti, avvocati e agenzie.
          Configuri una volta — il sistema lavora sempre.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#contatti"
            className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 py-4 rounded-lg transition-colors text-base shadow-lg shadow-violet-900/40"
          >
            Prenota una call gratuita
          </a>
          <a
            href="#servizi"
            className="border border-slate-700 hover:border-violet-500/60 text-slate-300 hover:text-white font-semibold px-8 py-4 rounded-lg transition-colors text-base"
          >
            Vedi i pacchetti
          </a>
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-slate-500">
          <span>✓ Integrazione con i tuoi strumenti esistenti</span>
          <span>✓ Nessun costo nascosto</span>
          <span>✓ Consegna entro 7–14 giorni</span>
        </div>
      </div>
    </section>
  )
}
