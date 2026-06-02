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
    <section id="servizi" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Scegli il piano giusto per il tuo studio
          </h2>
          <p className="text-slate-400 text-lg">Prezzi fissi. Nessun canone nascosto. Consegna garantita.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((s) => (
            <div
              key={s.name}
              className={`rounded-xl p-6 flex flex-col ${
                s.highlighted
                  ? 'bg-cyan-500/10 border-2 border-cyan-500/50'
                  : 'bg-slate-900 border border-slate-800'
              }`}
            >
              {s.highlighted && (
                <div className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-4">
                  Più scelto
                </div>
              )}
              <div className="mb-6">
                <p className="text-sm text-slate-400 mb-1">{s.name}</p>
                <h3 className="text-xl font-bold mb-3">{s.tagline}</h3>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-4xl font-bold">€{s.price}</span>
                  <span className="text-slate-400 text-sm">{s.period}</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{s.description}</p>
              </div>

              <ul className="flex-1 space-y-3 mb-8">
                {s.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="text-cyan-400 mt-0.5 shrink-0">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contatti"
                className={`text-center py-3 rounded-lg font-semibold text-sm transition-colors ${
                  s.highlighted
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                    : 'border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white'
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
