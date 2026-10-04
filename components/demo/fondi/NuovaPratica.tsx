'use client'

import { useState } from 'react'
import type { PazienteFondo } from '@/lib/demo/tipi'

const scelta =
  'mt-1.5 w-full rounded-xl border border-[var(--bordo-forte)] bg-[#0B1020] px-3 py-2.5 text-s-1 text-[var(--bianco)] outline-none focus:border-[var(--celeste)]'
const etichetta = 'mono block text-s-2 uppercase tracking-[0.12em] text-[var(--neutro)]'

// La segreteria sceglie paziente, fondo e forma: esce la scheda con i documenti da chiedere.
export default function NuovaPratica({
  pazienti,
  fondi,
  occupato,
  onCrea,
}: {
  pazienti: PazienteFondo[]
  fondi: string[]
  occupato: boolean
  onCrea: (d: { pazienteId: string; fondo: string; forma: string }) => void
}) {
  const conFondo = pazienti.filter((p) => p.fondo)
  const [pazienteId, setPazienteId] = useState(conFondo[0]?.id ?? '')
  const [fondo, setFondo] = useState(conFondo[0]?.fondo ?? fondi[0] ?? '')
  const [forma, setForma] = useState(conFondo[0]?.forma ?? 'diretta')

  function scegliPaziente(id: string) {
    setPazienteId(id)
    const p = pazienti.find((x) => x.id === id)
    if (p?.fondo) setFondo(p.fondo)
    if (p?.forma) setForma(p.forma)
  }

  return (
    <div className="card p-5 sm:p-6">
      <h2 className="display text-s1">Nuova pratica</h2>
      <div className="mt-4 grid gap-3.5 sm:grid-cols-3">
        <label className="block sm:col-span-3">
          <span className={etichetta}>Paziente</span>
          <select data-prova="pratica-paziente" value={pazienteId} onChange={(e) => scegliPaziente(e.target.value)} className={scelta}>
            {pazienti.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
                {p.fondo ? ` · ${p.fondo}` : ''}
              </option>
            ))}
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className={etichetta}>Fondo</span>
          <select data-prova="pratica-fondo" value={fondo} onChange={(e) => setFondo(e.target.value)} className={scelta}>
            {fondi.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={etichetta}>Forma</span>
          <select data-prova="pratica-forma" value={forma} onChange={(e) => setForma(e.target.value)} className={scelta}>
            <option value="diretta">Diretta</option>
            <option value="indiretta">Indiretta</option>
          </select>
        </label>
      </div>
      <button type="button" data-prova="crea-pratica" disabled={occupato || !pazienteId} onClick={() => onCrea({ pazienteId, fondo, forma })} className="btn btn-primario mt-5 disabled:opacity-50">
        Prepara la scheda
      </button>
    </div>
  )
}
