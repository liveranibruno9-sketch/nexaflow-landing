const automations = [
  {
    title: 'Raccolta documenti automatica',
    tag: 'Studio commercialista',
    before: '3–4 ore/mese di reminder manuali via email e telefono',
    after: 'Link automatico al cliente, reminder ogni 3 giorni, notifica quando tutto è completo',
    saving: '3–4 ore risparmiate/mese',
    tools: ['Gmail', 'Google Drive', 'WhatsApp'],
  },
  {
    title: 'Onboarding cliente zero-click',
    tag: 'Studio avvocato / commercialista',
    before: '45–60 minuti di setup manuale per ogni nuovo cliente',
    after: 'Form compilato → cartella Drive + email personalizzata + CRM + contratto pre-compilato in 30 secondi',
    saving: '45 min → 30 sec per cliente',
    tools: ['Google Drive', 'Gmail', 'Notion'],
  },
  {
    title: 'Reportistica mensile automatica',
    tag: 'Agenzia / studio di consulenza',
    before: '2–3 ore/mese a compilare e inviare gli stessi report',
    after: 'Ogni primo del mese: PDF generato e inviato ai clienti in automatico, zero intervento manuale',
    saving: '2–3 ore risparmiate/mese',
    tools: ['Google Sheets', 'Gmail', 'Drive'],
  },
  {
    title: 'Classificazione email in entrata',
    tag: 'Qualsiasi studio con alto volume email',
    before: 'Email importanti perse nel volume, risposte lente, nessuna prioritizzazione',
    after: 'Email categorizzate, inoltrate alla persona giusta, FAQ risposte automaticamente con AI',
    saving: '1–2 ore risparmiate/giorno',
    tools: ['Gmail', 'Slack', 'Claude AI'],
  },
]

export default function Automations() {
  return (
    <section id="esempi" className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1a1a2e]">Esempi di automazioni reali</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Workflow concreti, con impatto misurabile in ore risparmiate ogni mese.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {automations.map((a) => (
            <div
              key={a.title}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="text-xs font-medium text-violet-700 bg-violet-50 border border-violet-100 rounded-full px-3 py-1 inline-block">
                    {a.tag}
                  </div>
                  <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1 whitespace-nowrap">
                    ↓ {a.saving}
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-5 text-[#1a1a2e]">{a.title}</h3>

                <div className="space-y-3 mb-5">
                  <div className="flex gap-3 bg-red-50 rounded-xl p-3">
                    <span className="text-red-500 text-xs font-bold uppercase tracking-wide w-12 shrink-0 pt-0.5">Prima</span>
                    <p className="text-gray-600 text-sm leading-relaxed">{a.before}</p>
                  </div>
                  <div className="flex gap-3 bg-emerald-50 rounded-xl p-3">
                    <span className="text-emerald-600 text-xs font-bold uppercase tracking-wide w-12 shrink-0 pt-0.5">Dopo</span>
                    <p className="text-gray-700 text-sm leading-relaxed">{a.after}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {a.tools.map((t) => (
                    <span
                      key={t}
                      className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-md px-2.5 py-1 font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
