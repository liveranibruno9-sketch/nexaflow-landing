export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-16 relative overflow-hidden bg-[#faf8ff]">
      {/* Radial violet glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center top, rgba(139,92,246,0.1) 0%, transparent 70%)',
        }}
      />
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #7c3aed 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-block bg-violet-100 border border-violet-200 rounded-full px-4 py-1.5 text-violet-700 text-sm font-medium mb-8">
          Automazione B2B per studi professionali
        </div>

        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 tracking-tight text-[#1a1a2e]">
          Il tuo studio,<br />
          <span className="text-violet-600">senza lavoro ripetitivo</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Nexaflow costruisce workflow automatici su misura per commercialisti, avvocati e agenzie.
          Configuri una volta — il sistema lavora sempre.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#contatti"
            className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 py-4 rounded-lg transition-colors text-base shadow-lg shadow-violet-200"
          >
            Prenota una call gratuita
          </a>
          <a
            href="#servizi"
            className="border border-gray-300 hover:border-violet-400 text-gray-600 hover:text-violet-700 font-semibold px-8 py-4 rounded-lg transition-colors text-base bg-white"
          >
            Vedi i pacchetti
          </a>
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-gray-400">
          <span>✓ Integrazione con i tuoi strumenti esistenti</span>
          <span>✓ Nessun costo nascosto</span>
          <span>✓ Consegna entro 7–14 giorni</span>
        </div>
      </div>
    </section>
  )
}
