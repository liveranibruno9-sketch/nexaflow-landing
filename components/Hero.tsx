export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 via-slate-950 to-slate-950 pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #475569 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-block bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-1.5 text-cyan-400 text-sm font-medium mb-8">
          Automazione B2B per studi professionali
        </div>

        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 tracking-tight">
          Il tuo studio,<br />
          <span className="text-cyan-400">senza lavoro ripetitivo</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Nexaflow costruisce workflow automatici su misura per commercialisti, avvocati e agenzie.
          Configuri una volta — il sistema lavora sempre.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#contatti"
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-8 py-4 rounded-lg transition-colors text-base"
          >
            Prenota una call gratuita
          </a>
          <a
            href="#servizi"
            className="border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold px-8 py-4 rounded-lg transition-colors text-base"
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
