const problems = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    title: 'Raccolta documenti infinita',
    description:
      'I clienti non mandano i documenti in tempo. Passi ore a mandare reminder, telefonare, aspettare. Ogni mese lo stesso copione.',
    cost: '3–4 ore/mese di solleciti manuali',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17 1 21 5 17 9" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <polyline points="7 23 3 19 7 15" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </svg>
    ),
    title: 'Onboarding sempre uguale',
    description:
      'Ogni nuovo cliente richiede le stesse azioni: cartella Drive, email di benvenuto, CRM, contratto. A mano, ogni volta.',
    cost: '45–60 min per ogni nuovo cliente',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
        <line x1="2" y1="20" x2="22" y2="20" />
      </svg>
    ),
    title: 'Reportistica che mangia tempo',
    description:
      'Ogni mese copi gli stessi dati, compili gli stessi fogli, mandi le stesse email. Ore di lavoro che potrebbero non esistere.',
    cost: '2–3 ore/mese solo per i report',
  },
]

export default function Problem() {
  return (
    <section className="py-24 px-6 bg-[#f7f5ff]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1a1a2e]">
            Ogni settimana perdi ore in task che si ripetono identici
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Non perché sei poco efficiente. Ma perché nessuno ha ancora automatizzato quello
            che nel tuo studio si fa sempre a mano.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((p) => (
            <div
              key={p.title}
              className="bg-white border border-violet-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 mb-4">
                {p.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-[#1a1a2e]">{p.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">{p.description}</p>
              <div className="inline-flex items-center gap-1.5 bg-red-50 border border-red-100 rounded-lg px-3 py-1.5 text-xs font-medium text-red-600">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {p.cost}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
