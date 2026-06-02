'use client'

import { useState } from 'react'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(false)
    const form = e.currentTarget
    const data = new FormData(form)

    const res = await fetch('https://formspree.io/f/mrednjvj', {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' },
    })

    setLoading(false)
    if (res.ok) {
      setSubmitted(true)
    } else {
      setError(true)
    }
  }

  return (
    <section id="contatti" className="py-24 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Inizia con una call gratuita</h2>
          <p className="text-slate-400 text-lg">
            30 minuti. Analizziamo i tuoi processi e identifichiamo le automazioni con più impatto.
            Nessun impegno.
          </p>
        </div>

        {submitted ? (
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-10 text-center">
            <div className="text-5xl mb-4">✓</div>
            <h3 className="text-xl font-semibold mb-2">Messaggio ricevuto</h3>
            <p className="text-slate-400">Ti rispondo entro 24 ore per fissare la call.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-8 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nome</label>
                <input
                  name="nome"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors text-sm"
                  placeholder="Mario Rossi"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors text-sm"
                  placeholder="mario@studio.it"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Tipo di studio</label>
              <select
                name="tipo_studio"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors text-sm"
              >
                <option value="">Seleziona...</option>
                <option>Studio commercialista</option>
                <option>Studio legale</option>
                <option>Agenzia di marketing / comunicazione</option>
                <option>Studio di consulenza</option>
                <option>Altro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Descrivi il processo che vuoi automatizzare
              </label>
              <textarea
                name="messaggio"
                rows={4}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors text-sm resize-none"
                placeholder="Es: ogni mese devo raccogliere documenti da 30 clienti, ci perdo 3–4 ore di reminder manuali..."
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">
                Errore nell&apos;invio. Scrivi direttamente a{' '}
                <a href="mailto:liveranibruno9@gmail.com" className="underline">
                  liveranibruno9@gmail.com
                </a>
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-slate-950 font-semibold py-4 rounded-lg transition-colors text-sm"
            >
              {loading ? 'Invio in corso...' : 'Invia e prenota la call gratuita'}
            </button>

            <p className="text-center text-xs text-slate-500">
              Oppure scrivimi direttamente a{' '}
              <a href="mailto:liveranibruno9@gmail.com" className="text-cyan-400 hover:underline">
                liveranibruno9@gmail.com
              </a>
              {' '}· Risposta entro 24 ore
            </p>
          </form>
        )}
      </div>
    </section>
  )
}
