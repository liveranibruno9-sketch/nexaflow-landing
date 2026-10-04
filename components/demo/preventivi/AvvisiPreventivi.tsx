'use client'

import type { Avviso } from '@/lib/demo/tipi'

// In cima alla pagina: chi ha risposto e va richiamato, e il controllo del lunedì sui preventivi aperti.
export default function AvvisiPreventivi({
  avvisi,
  onConferma,
  onConfermaTutti,
  onStato,
  occupato,
}: {
  avvisi: Avviso[]
  onConferma: (id: string) => void
  onConfermaTutti: () => void
  onStato: (id: string, nuovo: string) => void
  occupato: boolean
}) {
  const richiamare = avvisi.filter((a) => a.tipo === 'richiamare')
  const confermare = avvisi.filter((a) => a.tipo === 'confermare')
  if (!richiamare.length && !confermare.length) return null

  return (
    <div className="space-y-4">
      {richiamare.map((a) => (
        <div key={a.id} data-prova="avviso-richiamare" className="vetro flex flex-wrap items-center justify-between gap-3 rounded-2xl px-5 py-4">
          <p className="flex items-center gap-3 text-s0 text-[var(--bianco)]">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--verde)]" aria-hidden="true" />
            {a.testo}
          </p>
          <div className="flex gap-2">
            <button type="button" disabled={occupato} onClick={() => onStato(a.preventivoId, 'accettato')} className="chip text-[var(--bianco)] disabled:opacity-40">
              Ha accettato
            </button>
            <button type="button" disabled={occupato} onClick={() => onStato(a.preventivoId, 'rifiutato')} className="chip text-[var(--neutro)] disabled:opacity-40">
              Ha rifiutato
            </button>
          </div>
        </div>
      ))}

      {confermare.length > 0 && (
        <div data-prova="banner-conferma" className="rounded-2xl border border-[color-mix(in_srgb,var(--arancio)_45%,transparent)] bg-[color-mix(in_srgb,var(--arancio)_8%,transparent)] px-5 py-4">
          <p className="text-s0 font-medium text-[var(--bianco)]">Questi preventivi risultano ancora aperti: confermi?</p>
          <p className="mt-1 text-s-2 text-[var(--neutro)]">Finché non li conferma, i messaggi restano in pausa: nessuno riceve un sollecito dopo aver già accettato.</p>
          <ul className="mt-3 space-y-2">
            {confermare.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-s-1 text-[var(--bianco)]">{a.testo.replace(': risulta ancora aperto, confermi?', '')}</span>
                <button type="button" data-prova="conferma" disabled={occupato} onClick={() => onConferma(a.preventivoId)} className="chip text-[var(--bianco)] disabled:opacity-40">
                  Confermo, è ancora aperto
                </button>
              </li>
            ))}
          </ul>
          {confermare.length > 1 && (
            <button type="button" data-prova="conferma-tutti" disabled={occupato} onClick={onConfermaTutti} className="btn btn-fantasma mt-4 !min-h-[40px] !py-2 text-s-2 disabled:opacity-40">
              Confermo tutti
            </button>
          )}
        </div>
      )}
    </div>
  )
}
