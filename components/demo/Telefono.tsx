'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { dataBreve } from '@/lib/demo/formato'

export type Bolla = { id: string; daStudio: boolean; testo: string; giorno?: string; etichetta?: string | null }
export type Conversazione = { id: string; nome: string; sottotitolo?: string; bolle: Bolla[] }
export type RispostaRapida = { etichetta: string; prova: string; onClick: () => void; disabilitata?: boolean }

// Il telefono del paziente: la conversazione con lo studio come la vede lui, in stile WhatsApp.
// I messaggi dello studio arrivano a sinistra, le risposte del paziente partono a destra.
export default function Telefono({
  conversazioni,
  titolo = 'Studio Dentistico Demo',
  modo = 'whatsapp',
  vuoto,
  risposte,
}: {
  conversazioni: Conversazione[]
  titolo?: string
  modo?: 'whatsapp' | 'chiamata'
  vuoto: string
  risposte?: (c: Conversazione) => RispostaRapida[]
}) {
  // si apre sull'ultima conversazione che ha ricevuto qualcosa
  const piuRecente = conversazioni[conversazioni.length - 1]?.id
  const [scelta, setScelta] = useState<string | undefined>(piuRecente)
  const ultimoNumero = useRef(conversazioni.length)
  useEffect(() => {
    if (conversazioni.length !== ultimoNumero.current || !conversazioni.some((c) => c.id === scelta)) setScelta(piuRecente)
    ultimoNumero.current = conversazioni.length
  }, [conversazioni, piuRecente, scelta])

  const attuale = useMemo(() => conversazioni.find((c) => c.id === scelta) ?? conversazioni[conversazioni.length - 1], [conversazioni, scelta])
  const fondo = useRef<HTMLDivElement>(null)
  useEffect(() => {
    fondo.current?.scrollTo({ top: fondo.current.scrollHeight, behavior: 'smooth' })
  }, [attuale?.bolle.length, attuale?.id])

  const azioni = attuale && risposte ? risposte(attuale) : []

  return (
    <div className="mx-auto w-full max-w-[400px]">
      {conversazioni.length > 1 && (
        <div data-lenis-prevent className="non-stampare mb-3 flex gap-2 overflow-x-auto pb-1">
          {conversazioni.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setScelta(c.id)}
              className={`chip shrink-0 ${c.id === attuale?.id ? 'text-[var(--bianco)]' : 'text-[var(--neutro)] opacity-70'}`}
            >
              {c.nome}
            </button>
          ))}
        </div>
      )}

      <div className="overflow-hidden rounded-[34px] border border-[var(--bordo-forte)] bg-[#0B1020] shadow-[0_30px_80px_-40px_rgba(109,59,255,0.6)]">
        <div className="flex items-center gap-3 border-b border-[var(--bordo)] bg-[#111833] px-5 py-3.5">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--blu)] text-s-2 font-semibold text-white">SD</div>
          <div className="min-w-0">
            <p className="truncate text-s-1 font-medium text-[var(--bianco)]">{titolo}</p>
            <p className="mono truncate text-s-2 text-[var(--neutro)]">
              {modo === 'chiamata' ? 'Chiamata · trascrizione' : 'WhatsApp · simulazione'}
              {attuale ? ` · ${attuale.sottotitolo ?? attuale.nome}` : ''}
            </p>
          </div>
        </div>

        <div data-lenis-prevent ref={fondo} className="h-[440px] space-y-2.5 overflow-y-auto px-4 py-5 sm:h-[480px]">
          {!attuale || attuale.bolle.length === 0 ? (
            <p className="mx-auto mt-16 max-w-[26ch] text-center text-s-1 text-[var(--neutro)]">{vuoto}</p>
          ) : (
            attuale.bolle.map((b) => (
              <div key={b.id} className={`flex ${b.daStudio ? 'justify-start' : 'justify-end'}`}>
                <div
                  data-prova="bolla"
                  className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 text-[0.93rem] leading-snug ${
                    b.daStudio
                      ? 'rounded-tl-md border border-[var(--bordo)] bg-[#161E3B] text-[var(--bianco)]'
                      : 'rounded-tr-md bg-[var(--blu)] text-white'
                  }`}
                >
                  {b.etichetta && <span className="mono mb-1 block text-[0.68rem] uppercase tracking-[0.12em] text-[var(--celeste)]">{b.etichetta}</span>}
                  <span className="whitespace-pre-line">{b.testo}</span>
                  {b.giorno && <span className="mono mt-1.5 block text-right text-[0.68rem] opacity-60">{dataBreve(b.giorno)}</span>}
                </div>
              </div>
            ))
          )}
        </div>

        {azioni.length > 0 && (
          <div className="non-stampare flex flex-wrap gap-2 border-t border-[var(--bordo)] bg-[#111833] px-4 py-3">
            <span className="mono w-full text-[0.68rem] uppercase tracking-[0.12em] text-[var(--neutro)]">Rispondi come il paziente</span>
            {azioni.map((a) => (
              <button
                key={a.prova}
                type="button"
                data-prova={a.prova}
                disabled={a.disabilitata}
                onClick={a.onClick}
                className="rounded-full border border-[var(--bordo-forte)] px-3.5 py-2 text-s-2 text-[var(--bianco)] transition-colors hover:border-[var(--celeste)] disabled:opacity-40"
              >
                {a.etichetta}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
