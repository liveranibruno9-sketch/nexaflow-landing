'use client'

import { useState } from 'react'
import { SERVIZI_DEMO } from '@/lib/demo/servizi'

// Prima di un incontro: riporta tutte e 5 le demo allo stato iniziale, una dopo l'altra.
export default function RipristinaTutto() {
  const [esiti, setEsiti] = useState<{ nome: string; ok: boolean }[] | null>(null)
  const [invio, setInvio] = useState(false)

  async function ripristina() {
    setInvio(true)
    const risultati: { nome: string; ok: boolean }[] = []
    for (const s of SERVIZI_DEMO) {
      try {
        const r = await fetch(`/api/demo/${s.modulo}`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ azione: 'ripristina' }),
        })
        const d = await r.json()
        risultati.push({ nome: s.nome, ok: !!d.ok })
      } catch {
        risultati.push({ nome: s.nome, ok: false })
      }
      setEsiti([...risultati])
    }
    setInvio(false)
  }

  return (
    <div className="card mt-10 flex flex-wrap items-center justify-between gap-5 p-6">
      <div className="max-w-[52ch]">
        <p className="text-s0 font-medium text-[var(--bianco)]">Prima di un incontro</p>
        <p className="mt-1 text-s-1 text-[var(--neutro)]">Riporta tutte le demo ai dati iniziali, così il titolare vede uno studio pulito.</p>
        {esiti && (
          <ul data-prova="esiti-ripristino" className="mono mt-3 space-y-1 text-s-2">
            {esiti.map((e) => (
              <li key={e.nome} className={e.ok ? 'text-[var(--verde)]' : 'text-[var(--arancio)]'}>
                {e.ok ? '✓' : '✗'} {e.nome}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button type="button" data-prova="ripristina-tutto" onClick={ripristina} disabled={invio} className="btn btn-primario disabled:opacity-50">
        {invio ? 'Ripristino…' : 'Ripristina tutte le demo'}
      </button>
    </div>
  )
}
