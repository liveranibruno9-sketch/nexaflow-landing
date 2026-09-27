const PROVE = [
  { ora: '08:40', cosa: 'Chiamata', esito: 'nessuna risposta, 8 squilli', ko: true },
  { ora: '13:15', cosa: 'Chiamata', esito: 'segreteria telefonica', ko: true },
  { ora: '19:30', cosa: 'Chiamata', esito: 'nessuna risposta', ko: true },
  { ora: '09:12', cosa: 'WhatsApp', esito: 'nessuna risposta dopo 26 ore', ko: true },
  { ora: '—', cosa: 'Profilo Google', esito: '34 recensioni, ultima a maggio', ko: false },
]

/**
 * Il report della verifica gratuita, come esempio: e il prodotto d'ingresso
 * reale. Dichiarato come esempio, non come studio misurato (vedi la nota nel
 * design della variante astrale).
 */
export default function Report({ compatto = false }: { compatto?: boolean }) {
  return (
    <div className={`vetro rounded-xl3 ${compatto ? 'p-5 sm:p-6' : 'p-6 sm:p-8'}`}>
      <div className="flex items-baseline justify-between gap-4">
        <span className="occhiello">Verifica gratuita</span>
        <span className="mono text-s-2 tenue">esempio di report</span>
      </div>

      <p className="serif mt-3 text-s1 leading-tight">Studio a due poltrone, provincia di Ravenna</p>

      <ul className={compatto ? 'mt-4' : 'mt-6'}>
        {PROVE.map((p, i) => (
          <li
            key={i}
            className="flex items-center gap-3 border-t border-[var(--bordo)] py-2.5 first:border-t-0 first:pt-0 sm:gap-4"
          >
            <span className="mono num w-11 shrink-0 text-s-2 text-[var(--celeste)]">{p.ora}</span>
            <span className="w-[5.6rem] shrink-0 text-s-2 font-medium sm:w-[6.5rem] sm:text-s-1">{p.cosa}</span>
            <span className="flex-1 text-s-2 tenue sm:text-s-1">{p.esito}</span>
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: p.ko ? 'var(--arancio)' : 'var(--neutro)', boxShadow: p.ko ? '0 0 10px var(--arancio)' : 'none' }}
            />
          </li>
        ))}
      </ul>

      {compatto ? null : (
        <p className="mt-6 text-s-2 tenue">
          Nel report i <strong className="font-medium text-[var(--giallo)]">dati misurati</strong> portano l’ora
          dell’osservazione. Le stime stanno in una sezione separata, e portano scritto che sono stime.
        </p>
      )}
    </div>
  )
}
