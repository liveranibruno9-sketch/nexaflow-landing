const steps = [
  {
    number: '01',
    title: 'Audit gratuito',
    description:
      'Call di 30 minuti. Analizziamo i processi del tuo studio e identifichiamo le 3 automazioni con più impatto immediato.',
  },
  {
    number: '02',
    title: 'Costruiamo su misura',
    description:
      'Sviluppiamo i workflow e li integriamo con i tuoi strumenti esistenti. Nessuna installazione complicata da parte tua.',
  },
  {
    number: '03',
    title: 'Consegna e vai operativo',
    description:
      'Deploy, test completo, training di 1 ora per il team. Sei operativo entro 1–2 settimane dalla call iniziale.',
  },
]

export default function HowItWorks() {
  return (
    <section id="come-funziona" className="py-24 px-6 bg-[#f3f0ff]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1a1a2e]">Come funziona</h2>
          <p className="text-gray-500 text-lg">Tre step. Nessuna complessità tecnica da parte tua.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((step) => (
            <div key={step.number}>
              <div className="text-6xl font-bold text-violet-200 mb-4 leading-none">{step.number}</div>
              <h3 className="text-xl font-semibold mb-3 text-[#1a1a2e]">{step.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
