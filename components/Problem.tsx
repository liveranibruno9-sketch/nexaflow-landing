const problems = [
  {
    icon: '📄',
    title: 'Raccolta documenti infinita',
    description:
      'I clienti non mandano i documenti in tempo. Passi ore a mandare reminder, telefonare, aspettare. Ogni mese lo stesso copione.',
  },
  {
    icon: '🔁',
    title: 'Onboarding sempre uguale',
    description:
      'Ogni nuovo cliente richiede le stesse azioni: cartella Drive, email di benvenuto, CRM, contratto. A mano, ogni volta.',
  },
  {
    icon: '📊',
    title: 'Reportistica che mangia tempo',
    description:
      'Ogni mese copi gli stessi dati, compili gli stessi fogli, mandi le stesse email. Ore di lavoro che potrebbero non esistere.',
  },
]

export default function Problem() {
  return (
    <section className="py-24 px-6 bg-[#f3f0ff]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1a1a2e]">
            Ogni settimana perdi ore in task che si ripetono identici
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Non perché sei poco efficiente. Ma perché nessuno ha ancora automatizzato quello che nel tuo studio si fa sempre a mano.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((p) => (
            <div key={p.title} className="bg-white border border-violet-100 rounded-xl p-6 shadow-sm">
              <div className="text-3xl mb-4">{p.icon}</div>
              <h3 className="text-lg font-semibold mb-2 text-[#1a1a2e]">{p.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
