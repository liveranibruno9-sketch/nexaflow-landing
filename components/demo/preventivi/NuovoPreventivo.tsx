'use client'

import { useState, type FormEvent } from 'react'

const campo =
  'mt-1.5 w-full rounded-xl border border-[var(--bordo-forte)] bg-[#0B1020] px-3.5 py-3 text-s0 text-[var(--bianco)] outline-none transition-colors focus:border-[var(--celeste)]'
const etichetta = 'mono block text-s-2 uppercase tracking-[0.12em] text-[var(--neutro)]'

type Dati = { nome: string; telefono: string; piano: string; importo: string; consenso: boolean }
const VUOTO: Dati = { nome: '', telefono: '', piano: '', importo: '', consenso: true }

// Il modulo che la segreteria compila dal telefono quando consegna un preventivo importante.
export default function NuovoPreventivo({ onInvia, occupato }: { onInvia: (d: Dati) => Promise<boolean>; occupato: boolean }) {
  const [d, setD] = useState<Dati>(VUOTO)
  const aggiorna = (k: keyof Dati, v: string | boolean) => setD((x) => ({ ...x, [k]: v }))

  async function invia(e: FormEvent) {
    e.preventDefault()
    if (await onInvia(d)) setD(VUOTO)
  }

  return (
    <form onSubmit={invia} className="card p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="display text-s1">Nuovo preventivo</h2>
        <span className="mono text-s-2 text-[var(--neutro)]">10 secondi</span>
      </div>
      <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
        <label className="block">
          <span className={etichetta}>Paziente</span>
          <input data-prova="campo-nome" required value={d.nome} onChange={(e) => aggiorna('nome', e.target.value)} placeholder="Nome e cognome" className={campo} />
        </label>
        <label className="block">
          <span className={etichetta}>Telefono</span>
          <input data-prova="campo-telefono" required inputMode="tel" value={d.telefono} onChange={(e) => aggiorna('telefono', e.target.value)} placeholder="333 000 0000" className={campo} />
        </label>
        <label className="block">
          <span className={etichetta}>Piano di cure</span>
          <input data-prova="campo-piano" required value={d.piano} onChange={(e) => aggiorna('piano', e.target.value)} placeholder="Per esempio: impianto singolo" className={campo} />
        </label>
        <label className="block">
          <span className={etichetta}>Importo (€)</span>
          <input data-prova="campo-importo" required inputMode="decimal" value={d.importo} onChange={(e) => aggiorna('importo', e.target.value)} placeholder="2.400" className={campo} />
        </label>
      </div>
      <label className="mt-4 flex cursor-pointer items-start gap-3 text-s-1 text-[var(--bianco)]">
        <input
          data-prova="campo-consenso"
          type="checkbox"
          checked={d.consenso}
          onChange={(e) => aggiorna('consenso', e.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--blu)]"
        />
        <span>
          Il paziente ha dato il consenso a essere ricontattato
          <span className="block text-s-2 text-[var(--neutro)]">Senza consenso il preventivo si registra, ma non parte nessun messaggio.</span>
        </span>
      </label>
      <button type="submit" data-prova="aggiungi" disabled={occupato} className="btn btn-primario mt-5 w-full disabled:opacity-50 sm:w-auto">
        Salva preventivo
      </button>
    </form>
  )
}
