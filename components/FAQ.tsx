'use client'

import { useState } from 'react'

const faqs = [
  {
    q: 'Devo sapere programmare o avere competenze tecniche?',
    a: 'No. Costruiamo noi tutto e ti consegniamo il sistema funzionante. Forniamo documentazione e training di 1 ora per il team. Non devi toccare una riga di codice.',
  },
  {
    q: 'Con quali strumenti si integra?',
    a: 'Gmail, Outlook, Google Drive, SharePoint, WhatsApp Business, Notion, Airtable, HubSpot, Salesforce, e oltre 400 altri. Se lo usi già nel tuo studio, quasi certamente si integra.',
  },
  {
    q: 'Quanto tempo ci vuole per avere tutto attivo?',
    a: 'Il pacchetto Starter è operativo entro 7 giorni dalla call iniziale. Il Professional in 2–3 settimane. I tempi dipendono anche dalla disponibilità del tuo team per il testing finale.',
  },
  {
    q: "Cosa succede se un'automazione smette di funzionare?",
    a: 'Il pacchetto Professional include 30 giorni di supporto post-deploy. Il Partner include manutenzione continua. Per il Starter, interveniamo a tariffa oraria di €80/h.',
  },
  {
    q: 'Posso richiedere modifiche dopo la consegna?',
    a: 'Sì. Forniamo sempre documentazione completa. Piccole modifiche sono coperte nel periodo di supporto incluso. Per modifiche sostanziali, valutiamo insieme il costo aggiuntivo.',
  },
  {
    q: 'I dati dei miei clienti sono al sicuro?',
    a: 'Sì. I workflow girano sulla tua infrastruttura — i tuoi account Google, i tuoi tool. Nexaflow non ospita né ha accesso ai dati dei tuoi clienti. Costruiamo lo strumento, non lo gestiamo.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="py-24 px-6 bg-slate-900/40">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Domande frequenti</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <button
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-medium text-sm md:text-base">{faq.q}</span>
                <span
                  className={`text-violet-400 text-xl shrink-0 transition-transform duration-200 ${
                    open === i ? 'rotate-45' : ''
                  }`}
                >
                  +
                </span>
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-slate-400 text-sm leading-relaxed border-t border-slate-800 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
