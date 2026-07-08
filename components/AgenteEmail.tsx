const features = [
  {
    title: 'Classifica ogni email',
    description: 'Urgenza alta, media o bassa. Richiesta cliente, scadenza, fornitore. In tempo reale, 24/7.',
  },
  {
    title: 'Prepara le bozze di risposta',
    description: 'Per le email routinarie trovi la bozza già pronta: approvi in 1 click o modifichi.',
  },
  {
    title: 'Ti avvisa subito delle urgenze',
    description: 'Le email che non possono aspettare arrivano come notifica immediata su Telegram.',
  },
  {
    title: 'Digest ogni mattina',
    description: 'Un riepilogo con le sole cose che richiedono una tua decisione. Il resto è già gestito.',
  },
]

export default function AgenteEmail() {
  return (
    <section id="agente-email" className="py-24 px-6 bg-[#0a0a14] relative overflow-hidden">
      {/* Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(124,58,237,0.14) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-3">
            Il servizio di punta
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Agente Email — il primo collaboratore AI del tuo studio
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Un agente AI presidia la casella dello studio, ogni giorno. Lui prepara, tu approvi:
            il controllo resta sempre a te.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8 items-start">
          {/* Features */}
          <div className="md:col-span-3 grid sm:grid-cols-2 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-5"
              >
                <h3 className="text-white font-semibold mb-2 text-sm flex items-center gap-2">
                  <span className="text-violet-400">✓</span> {f.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
            <div className="sm:col-span-2 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 text-sm text-gray-500 leading-relaxed">
              <span className="text-gray-300 font-medium">Setup:</span> accesso alla casella via
              OAuth (nessuna password condivisa), 1–2 ore di training iniziale sui tuoi esempi
              reali, 1 settimana di calibrazione sul vivo. I dati restano sulla tua infrastruttura.
            </div>
          </div>

          {/* Pricing card */}
          <div className="md:col-span-2 bg-white/[0.04] border border-violet-500/30 rounded-2xl p-7 relative">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Servizio in abbonamento
            </p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-bold text-white">€290</span>
              <span className="text-gray-400 text-sm">/mese</span>
            </div>
            <p className="text-gray-500 text-sm mb-6">Nessun vincolo annuale. Disdici quando vuoi.</p>

            <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-4 mb-6">
              <p className="text-violet-300 text-sm font-semibold mb-1.5">
                🎯 2 posti pilota questo mese
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Setup gratuito + 30 giorni di prova, in cambio di un feedback onesto a fine
                periodo. Se non ti libera ore reali, finisce lì — non hai perso nulla.
              </p>
            </div>

            <a
              href="#contatti"
              className="block bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3.5 rounded-xl transition-all text-sm text-center shadow-lg shadow-violet-900/40 hover:-translate-y-0.5"
            >
              Candidati per un posto pilota
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
