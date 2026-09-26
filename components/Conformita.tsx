import { CONFORMITA } from './dati'

/**
 * Le regole. In questo settore non sono burocrazia: sono l obiezione
 * principale del compratore, e affrontarle per prime e un differenziatore.
 */
export default function Conformita() {
  return (
    <section id="conformita" className="scuro grana sezione">
      <div className="wrap">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <span className="occhiello rivela">Le regole</span>
            <div className="filetto mt-5" />
            <h2 className="serif rivela mt-7 text-s4">
              In sanità si può automatizzare, ma non tutto e non comunque.
            </h2>
            <p className="rivela rit-1 misura mt-6 text-s0">
              Queste quattro cose non sono una nota a piè di pagina: sono dentro al modo in cui i sistemi sono
              costruiti. Alcune agenzie vendono esattamente ciò che qui è vietato, e il rischio ricadrebbe sul
              suo studio.
            </p>
            <div className="mt-8 rounded-2xl border border-[var(--bordo-scuro)] bg-[color-mix(in_srgb,#ffffff_4%,transparent)] p-5">
              <p className="!text-s-1">
                Per GDPR e deontologia serve comunque il parere di un professionista prima del primo contratto.
                Non lo sostituisco io, e non le dirò mai il contrario.
              </p>
            </div>
          </div>

          <ul className="grid gap-4">
            {CONFORMITA.map((c, i) => (
              <li key={c.titolo} className={`card rivela p-7 ${i === 1 ? 'rit-1' : i === 2 ? 'rit-2' : i === 3 ? 'rit-3' : ''}`}>
                <div className="flex items-start gap-4">
                  <Scudo />
                  <div>
                    <h3 className="text-s0 font-medium text-[var(--paper)]">{c.titolo}</h3>
                    <p className="mt-3 !text-s-1 leading-relaxed">{c.testo}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function Scudo() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true" className="mt-0.5 shrink-0">
      <path
        d="M11 2.5 L18 5.2 v5.3 c0 4.2 -2.9 8 -7 9 -4.1 -1 -7 -4.8 -7 -9 V5.2 z"
        stroke="var(--blu-2)"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M7.8 11.2 l2.3 2.3 l4.3 -4.6" stroke="var(--blu-2)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
