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
    <section id="contatti" className="py-24 px-6 bg-[#faf8ff]">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1a1a2e]">Inizia con una call gratuita</h2>
          <p className="text-gray-500 text-lg">
            30 minuti. Analizziamo i tuoi processi e identifichiamo le automazioni con più impatto.
            Nessun impegno.
          </p>
        </div>

        {submitted ? (
          <div className="bg-violet-50 border border-violet-200 rounded-xl p-10 text-center">
            <div className="text-5xl mb-4">✓</div>
            <h3 className="text-xl font-semibold mb-2 text-[#1a1a2e]">Messaggio ricevuto</h3>
            <p className="text-gray-500">Ti rispondo entro 24 ore per fissare la call.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-8 space-y-5 shadow-sm">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                <input
                  name="nome"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:border-violet-500 transition-colors text-sm"
                  placeholder="Mario Rossi"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:border-violet-500 transition-colors text-sm"
                  placeholder="mario@studio.it"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo di studio</label>
              <select
                name="tipo_studio"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-[#1a1a2e] focus:outline-none focus:border-violet-500 transition-colors text-sm"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrivi il processo che vuoi automatizzare
              </label>
              <textarea
                name="messaggio"
                rows={4}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:border-violet-500 transition-colors text-sm resize-none"
                placeholder="Es: ogni mese devo raccogliere documenti da 30 clienti, ci perdo 3–4 ore di reminder manuali..."
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm">
                Errore nell&apos;invio. Scrivi direttamente a{' '}
                <a href="mailto:liveranibruno9@gmail.com" className="underline">
                  liveranibruno9@gmail.com
                </a>
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white font-semibold py-4 rounded-lg transition-colors text-sm shadow-lg shadow-violet-200"
            >
              {loading ? 'Invio in corso...' : 'Invia e prenota la call gratuita'}
            </button>

            <p className="text-center text-xs text-gray-400">
              Oppure scrivimi direttamente a{' '}
              <a href="mailto:liveranibruno9@gmail.com" className="text-violet-600 hover:underline">
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
