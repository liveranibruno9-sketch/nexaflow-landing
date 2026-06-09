const steps = [
  {
    number: '01',
    title: 'Audit gratuito',
    description:
      'Call di 30 minuti. Analizziamo i processi del tuo studio e identifichiamo le 3 automazioni con più impatto immediato.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.9 1.18h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7a2 2 0 0 1 1.72 2.02z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Costruiamo su misura',
    description:
      'Sviluppiamo i workflow e li integriamo con i tuoi strumenti esistenti. Nessuna installazione complicata da parte tua.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Consegna e vai operativo',
    description:
      'Deploy, test completo, training di 1 ora per il team. Sei operativo entro 1–2 settimane dalla call iniziale.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
]

export default function HowItWorks() {
  return (
    <section id="come-funziona" className="py-24 px-6 bg-[#f7f5ff]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1a1a2e]">Come funziona</h2>
          <p className="text-gray-500 text-lg">Tre step. Nessuna complessità tecnica da parte tua.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line — desktop only */}
          <div className="absolute top-8 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-px bg-gradient-to-r from-violet-200 via-violet-300 to-violet-200 hidden md:block" />

          {steps.map((step, i) => (
            <div key={step.number} className="relative">
              {/* Number circle */}
              <div className="relative z-10 w-16 h-16 rounded-2xl bg-white border border-violet-200 shadow-sm flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-violet-300">{step.number}</span>
              </div>

              <h3 className="text-lg font-semibold mb-3 text-[#1a1a2e]">{step.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm">{step.description}</p>

              {i < 2 && (
                <div className="flex justify-center mt-6 md:hidden">
                  <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
                    <line x1="8" y1="0" x2="8" y2="16" stroke="#c4b5fd" strokeWidth="1.5" />
                    <polyline points="4,14 8,20 12,14" stroke="#c4b5fd" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-14">
          <a
            href="#contatti"
            className="inline-flex items-center gap-2 bg-[#1a1a2e] hover:bg-[#2a2a3e] text-white font-semibold px-7 py-3.5 rounded-xl transition-colors text-sm"
          >
            Inizia con la call gratuita
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
