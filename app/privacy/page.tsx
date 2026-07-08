import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Nexaflow',
  description: 'Informativa sul trattamento dei dati personali del sito Nexaflow.',
}

export default function Privacy() {
  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <a href="/" className="text-sm text-violet-600 hover:text-violet-500 font-medium">
          ← Torna al sito
        </a>

        <h1 className="text-3xl font-bold text-[#1a1a2e] mt-6 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-10">Ultimo aggiornamento: luglio 2026</p>

        <div className="space-y-8 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-[#1a1a2e] mb-2">Titolare del trattamento</h2>
            <p>
              Bruno Liverani — contatto:{' '}
              <a href="mailto:nexaflow.automation.b2b@gmail.com" className="text-violet-600 underline">
                nexaflow.automation.b2b@gmail.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a1a2e] mb-2">Quali dati raccogliamo</h2>
            <p>
              Solo i dati che inserisci volontariamente nel modulo di contatto: nome, indirizzo
              email, tipo di studio e l&apos;eventuale descrizione del processo che vuoi
              automatizzare. Il sito non usa cookie di profilazione e non raccoglie dati di
              navigazione riconducibili alla persona.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a1a2e] mb-2">Perché li usiamo</h2>
            <p>
              Esclusivamente per rispondere alla tua richiesta e, se lo richiedi, organizzare una
              call conoscitiva (base giuridica: misure precontrattuali su richiesta
              dell&apos;interessato, art. 6.1.b GDPR). Nessuna newsletter, nessuna cessione a
              terzi per marketing.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a1a2e] mb-2">Come vengono gestiti</h2>
            <p>
              Il modulo di contatto è gestito tramite Formspree Inc. (USA), che inoltra il
              messaggio alla nostra casella email e agisce come responsabile del trattamento
              secondo i propri{' '}
              <a
                href="https://formspree.io/legal/privacy-policy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-600 underline"
              >
                termini privacy
              </a>
              . I messaggi vengono conservati per il tempo necessario a gestire la richiesta e le
              eventuali comunicazioni successive.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a1a2e] mb-2">I tuoi diritti</h2>
            <p>
              Puoi chiedere in qualsiasi momento accesso, rettifica o cancellazione dei tuoi dati,
              o opporti al trattamento, scrivendo a{' '}
              <a href="mailto:nexaflow.automation.b2b@gmail.com" className="text-violet-600 underline">
                nexaflow.automation.b2b@gmail.com
              </a>
              . Hai inoltre diritto di reclamo al Garante per la Protezione dei Dati Personali.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
