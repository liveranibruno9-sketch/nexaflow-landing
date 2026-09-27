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
 * Sta al posto del muro di loghi clienti: non avendo clienti, un muro di loghi
 * sarebbe una bugia che il primo titolare che chiama smonta in dieci secondi.
 * Al suo posto va l'unica prova che esiste davvero, cioe il metodo.
 *
 * Il contenuto e duplicato due volte: senza, alla fine del ciclo si vede il salto.
 */
export default function Fascia() {
  const doppio = [...VOCI, ...VOCI]
  return (
    <section aria-label="Cosa misura la verifica gratuita" className="livello-notte overflow-hidden py-5">
      <div className="marquee items-center gap-10">
        {doppio.map((v, i) => (
          <span key={i} className="flex shrink-0 items-center gap-10" aria-hidden={i >= VOCI.length}>
            <span className="text-s-1 tenue">{v}</span>
            <span
              aria-hidden="true"
              className="h-1 w-1 rounded-full"
              style={{ background: 'var(--celeste)', boxShadow: '0 0 8px var(--celeste)' }}
            />
          </span>
        ))}
      </div>
    </section>
  )
}
