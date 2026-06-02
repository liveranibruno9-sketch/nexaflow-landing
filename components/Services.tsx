const services = [
  {
    name: 'Starter',
    tagline: 'Primo Workflow',
    price: '490',
    period: 'una tantum',
    description:
      'Il punto di partenza. Un workflow custom che risolve il tuo problema più urgente, consegnato in una settimana.',
    features: [
      '1 workflow automatizzato su misura',
      'Integrazione con 3 strumenti (es. Gmail + Drive + Sheets)',
      'Setup, test e documentazione inclusi',
      'Consegna entro 7 giorni',
    ],
    cta: 'Inizia con Starter',
    highlighted: false,
  },
  {
    name: 'Professional',
    tagline: 'Studio Automatizzato',
    price: '1.490',
    period: 'una tantum',
    description:
      "L'automazione completa del tuo studio. Più workflow interconnessi, AI opzionale, supporto incluso.",
    features: [
      '3–5 workflow interconnessi',
      'Integrazione con suite completa (Google/M365, WhatsApp, CRM)',
      'Layer AI opzionale (classificazione email, generazione documenti)',
      '1h di training per il team',
      '30 giorni di supporto post-deploy',
    ],
    cta: 'Scegli Professional',
    highlighted: true,
  },
  {
    name: 'Partner',
    tagline: 'Automazione Continua',
    price: '490',
    period: '/mese',
    description:
      'Automazione come servizio. Nuovi workflow ogni mese, manutenzione inclusa, audit periodico.',
    features: [
      '2 nuovi workflow ogni mese',
      'Manutenzione e aggiornamenti continui',
      'Audit processi mensile',
      'Supporto prioritario',
    ],
    cta: 'Attiva Partner',
    highlighted: false,
  },
]

export default function Services() {
  return (
    <section id="servizi" className="py-24 px-6 bg-[#faf8ff]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1a1a2e]">
            Scegli il piano giusto per il tuo studio
          </h2>
          <p className="text-gray-500 text-lg">Prezzi fissi. Nessun canone nascosto. Consegna garantita.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((s) => (
            <div
              key={s.name}
              className={`rounded-xl p-6 flex flex-col ${
                s.highlighted
                  ? 'bg-white border-2 border-violet-500 shadow-lg shadow-violet-100'
                  : 'bg-white border border-gray-200 shadow-sm'
              }`}
            >
              {s.highlighted && (
                <div className="text-xs font-semibold text-violet-600 uppercase tracking-widest mb-4">
                  Più scelto
                </div>
              )}
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-1">{s.name}</p>
                <h3 className="text-xl font-bold mb-3 text-[#1a1a2e]">{s.tagline}</h3>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-4xl font-bold text-[#1a1a2e]">€{s.price}</span>
                  <span className="text-gray-400 text-sm">{s.period}</span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{s.description}</p>
              </div>

              <ul className="flex-1 space-y-3 mb-8">
                {s.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-gray-600">
                    <span className="text-violet-500 mt-0.5 shrink-0">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contatti"
                className={`text-center py-3 rounded-lg font-semibold text-sm transition-colors ${
                  s.highlighted
                    ? 'bg-violet-600 hover:bg-violet-500 text-white'
                    : 'border border-gray-300 hover:border-violet-400 text-gray-600 hover:text-violet-700'
                }`}
              >
                {s.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
