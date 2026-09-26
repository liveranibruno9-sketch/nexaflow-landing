const VOCI = [
  'Tre chiamate in tre fasce orarie',
  'Tempo di risposta su WhatsApp',
  'Il form del sito',
  'Recensioni Google e data dell’ultima',
  'Risposte del titolare alle recensioni',
  'Convenzioni con i fondi dichiarate',
  'Gestionale in uso',
]

/**
 * Striscia infinita con cosa misura la verifica gratuita.
 *
 * Sta al posto del muro di loghi clienti che usano tutti e tre i player
 * analizzati. Non avendo clienti, un muro di loghi sarebbe una bugia che il
 * primo titolare che chiama smonta in dieci secondi: al suo posto va l'unica
 * prova che esiste davvero, cioe il metodo.
 *
 * Il contenuto e duplicato due volte: senza, alla fine del ciclo si vede il salto.
 */
export default function Fascia() {
  const doppio = [...VOCI, ...VOCI]
  return (
    <section
      aria-label="Cosa misura la verifica gratuita"
      className="scuro overflow-hidden border-y border-[var(--bordo-scuro)] py-5"
      style={{ background: 'var(--ink-2)' }}
    >
      <div className="marquee items-center gap-10">
        {doppio.map((v, i) => (
          <span key={i} className="flex shrink-0 items-center gap-10">
            <span className="text-s-1 text-[color-mix(in_srgb,#FAF6EF_66%,transparent)]">{v}</span>
            <span aria-hidden="true" className="h-1 w-1 rounded-full" style={{ background: 'var(--blu-2)' }} />
          </span>
        ))}
      </div>
    </section>
  )
}
