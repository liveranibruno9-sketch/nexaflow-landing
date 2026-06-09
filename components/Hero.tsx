type NodeColor = 'violet' | 'blue' | 'slate' | 'green'

function WorkflowNode({ icon, label, sub, color }: { icon: string; label: string; sub: string; color: NodeColor }) {
  const styles: Record<NodeColor, string> = {
    violet: 'border-violet-500/40 bg-violet-500/10',
    blue: 'border-blue-500/40 bg-blue-500/10',
    slate: 'border-white/10 bg-white/[0.04]',
    green: 'border-green-500/40 bg-green-500/10',
  }
  return (
    <div className={`flex-1 border ${styles[color]} rounded-xl p-2.5 md:p-3 text-center min-w-0`}>
      <div className="text-xl md:text-2xl mb-1">{icon}</div>
      <div className="text-xs font-medium text-gray-300 truncate leading-tight">{label}</div>
      <div className="text-[10px] text-gray-600 mt-0.5">{sub}</div>
    </div>
  )
}

function Arrow() {
  return (
    <div className="flex items-center text-gray-700 flex-shrink-0 px-0.5">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </div>
  )
}

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-16 relative overflow-hidden bg-[#0a0a14]">
      {/* Top glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 110% 55% at 50% -5%, rgba(124,58,237,0.22) 0%, transparent 68%)',
        }}
      />
      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(124,58,237,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.05) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10 w-full py-12">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 text-violet-400 text-sm font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse inline-block" />
            Automazione B2B · Studi professionali italiani
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold leading-[1.06] mb-6 tracking-tight text-white text-center">
          Il tuo studio lavora.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-300">
            Anche quando non ci sei.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed text-center">
          Nexaflow costruisce workflow automatici su misura per commercialisti, avvocati e agenzie.
          Configuri una volta — il sistema lavora sempre.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
          <a
            href="#contatti"
            className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 py-4 rounded-lg transition-all text-base shadow-lg shadow-violet-900/50 hover:-translate-y-0.5 text-center"
          >
            Prenota una call gratuita
          </a>
          <a
            href="#esempi"
            className="border border-white/10 hover:border-violet-500/40 text-gray-300 hover:text-white font-semibold px-8 py-4 rounded-lg transition-all text-base bg-white/[0.04] hover:bg-white/[0.07] text-center"
          >
            Vedi automazioni reali
          </a>
        </div>

        {/* Workflow visualization */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 md:p-6">
            <div className="flex items-stretch gap-2 md:gap-3">
              <WorkflowNode icon="📧" label="Email cliente" sub="Trigger" color="violet" />
              <Arrow />
              <WorkflowNode icon="🤖" label="Claude AI" sub="Analizza" color="blue" />
              <Arrow />
              <WorkflowNode icon="📁" label="Drive + CRM" sub="Aggiorna" color="slate" />
              <Arrow />
              <WorkflowNode icon="✅" label="Notifica" sub="Completato" color="green" />
            </div>
            <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                Workflow attivo — gira in automatico
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <span>47 esecuzioni oggi</span>
                <span className="text-green-500/80">0 errori</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer bullets */}
        <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-gray-500">
          <span className="flex items-center gap-2">
            <span className="text-violet-400">✓</span> Integra con gli strumenti che già usi
          </span>
          <span className="flex items-center gap-2">
            <span className="text-violet-400">✓</span> Nessun costo nascosto
          </span>
          <span className="flex items-center gap-2">
            <span className="text-violet-400">✓</span> Operativo entro 7–14 giorni
          </span>
        </div>
      </div>
    </section>
  )
}
