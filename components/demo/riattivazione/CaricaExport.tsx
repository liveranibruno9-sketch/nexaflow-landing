'use client'

import { useState, type ChangeEvent } from 'react'

const MASSIMO_BYTE = 2 * 1024 * 1024
const CAMPI: { chiave: string; etichetta: string; obbligatorio: boolean }[] = [
  { chiave: 'nome', etichetta: 'Nome del paziente', obbligatorio: true },
  { chiave: 'cognome', etichetta: 'Cognome', obbligatorio: false },
  { chiave: 'telefono', etichetta: 'Telefono', obbligatorio: true },
  { chiave: 'ultimaVisita', etichetta: 'Data dell’ultima visita', obbligatorio: true },
  { chiave: 'prossimoAppuntamento', etichetta: 'Prossimo appuntamento', obbligatorio: false },
  { chiave: 'consenso', etichetta: 'Consenso al contatto', obbligatorio: false },
]

function base64(file: File): Promise<string> {
  return new Promise((ok, ko) => {
    const r = new FileReader()
    r.onload = () => ok(String(r.result).split(',')[1] ?? '')
    r.onerror = () => ko(r.error)
    r.readAsDataURL(file)
  })
}

// Il caricamento dell'export settimanale, con l'abbinamento delle colonne quando i nomi non si riconoscono.
export default function CaricaExport({
  colonne,
  mancanti,
  occupato,
  onFile,
  onMappa,
}: {
  colonne: string[] | null
  mancanti: string[] | null
  occupato: boolean
  onFile: (nome: string, base64: string) => void
  onMappa: (mappatura: Record<string, string>) => void
}) {
  const [errore, setErrore] = useState<string | null>(null)
  const [mappa, setMappa] = useState<Record<string, string>>({})
  const daAbbinare = !!(colonne && mancanti && mancanti.length)

  async function scegli(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    e.target.value = ''
    if (!f) return
    if (!/\.(xlsx|xls|csv)$/i.test(f.name)) return setErrore('Usi un file Excel (.xlsx) o CSV')
    if (f.size > MASSIMO_BYTE) return setErrore('Il file supera 2 MB: per la demo usi un estratto')
    setErrore(null)
    setMappa({})
    onFile(f.name, await base64(f))
  }

  const pronta = CAMPI.filter((c) => c.obbligatorio).every((c) => mappa[c.chiave])

  return (
    <div className="card p-5 sm:p-6">
      <h2 className="display text-s1">Carica l’export</h2>
      <p className="mt-1 text-s-1 text-[var(--neutro)]">Una volta a settimana, l’elenco pazienti esportato dal gestionale (Excel o CSV).</p>
      <label className={`btn btn-fantasma mt-4 cursor-pointer ${occupato ? 'pointer-events-none opacity-40' : ''}`}>
        Scegli il file
        <input data-prova="file-export" type="file" accept=".xlsx,.xls,.csv" onChange={scegli} disabled={occupato} className="sr-only" />
      </label>
      {errore && (
        <p role="alert" className="mt-3 text-s-1 text-[var(--arancio)]">
          {errore}
        </p>
      )}

      {daAbbinare && (
        <div className="mt-5 rounded-2xl border border-[var(--bordo-forte)] p-4">
          <p className="text-s0 font-medium text-[var(--bianco)]">Non riconosco alcune colonne: me le indica?</p>
          <p className="mt-1 text-s-2 text-[var(--neutro)]">Basta farlo la prima volta: con lo stesso gestionale l’abbinamento resta uguale.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {CAMPI.map((c) => (
              <label key={c.chiave} className="block">
                <span className="mono block text-s-2 uppercase tracking-[0.12em] text-[var(--neutro)]">
                  {c.etichetta}
                  {c.obbligatorio ? ' *' : ''}
                </span>
                <select
                  data-prova={`mappa-${c.chiave}`}
                  value={mappa[c.chiave] ?? ''}
                  onChange={(e) => setMappa((m) => ({ ...m, [c.chiave]: e.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-[var(--bordo-forte)] bg-[#0B1020] px-3 py-2.5 text-s-1 text-[var(--bianco)] outline-none focus:border-[var(--celeste)]"
                >
                  <option value="">{c.obbligatorio ? 'Scelga la colonna' : 'Non presente'}</option>
                  {colonne!.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          <button
            type="button"
            data-prova="applica-mappatura"
            disabled={!pronta || occupato}
            onClick={() => onMappa(Object.fromEntries(Object.entries(mappa).filter(([, v]) => v)))}
            className="btn btn-primario mt-4 disabled:opacity-40"
          >
            Applica e analizza
          </button>
        </div>
      )}
    </div>
  )
}
