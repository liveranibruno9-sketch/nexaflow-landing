import { PASSI } from './dati'

/**
 * La rotta: i tre passi come tappe su una traiettoria che sale.
 * La traccia si disegna scorrendo (CSS guidato dallo scroll); senza supporto
 * resta disegnata per intero.
 */
export default function Rotta() {
  return (
    <section id="processo" className="livello-notte sezione scroll-mt-20">
      <div className="wrap">
        <div className="max-w-3xl">
          <span className="occhiello rivela">La rotta</span>
          <div className="filetto mt-5" />
          <h2 className="serif rivela mt-7 text-s4">Tre passi. Il primo non costa niente e non impegna a niente.</h2>
        </div>

        <div className="relative mt-16 md:mt-20">
          {/* traiettoria, solo su schermo largo */}
          <svg
            viewBox="0 0 1000 120"
            className="pointer-events-none hidden h-auto w-full md:block"
            aria-hidden="true"
          >
            <path
              className="rotta-traccia"
              d="M167 96 C 300 24, 420 30, 500 66 S 720 112, 833 28"
              pathLength={1}
              fill="none"
              stroke="var(--celeste)"
              strokeOpacity="0.65"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            {[
              [167, 96],
              [500, 66],
              [833, 28],
            ].map(([x, y], i) => (
              <g key={x} transform={`translate(${x} ${y})`}>
                <circle r="14" fill={i === 2 ? 'var(--giallo)' : 'var(--celeste)'} opacity="0.14" />
                <circle r="4.5" fill={i === 2 ? 'var(--giallo)' : 'var(--bianco)'} />
              </g>
            ))}
          </svg>

          <ol className="grid gap-5 border-l border-[var(--bordo-forte)] pl-6 md:mt-6 md:grid-cols-3 md:border-l-0 md:pl-0">
            {PASSI.map((p, i) => (
              <li key={p.n} className={`card rivela relative flex flex-col p-7 sm:p-8 ${i === 1 ? 'rit-1' : i === 2 ? 'rit-2' : ''}`}>
                {/* tappa sulla linea verticale, solo su telefono */}
                <span
                  aria-hidden="true"
                  className="absolute -left-[1.85rem] top-9 h-2.5 w-2.5 rounded-full md:hidden"
                  style={{
                    background: i === 2 ? 'var(--giallo)' : 'var(--bianco)',
                    boxShadow: `0 0 12px ${i === 2 ? 'var(--giallo)' : 'var(--celeste)'}`,
                  }}
                />
                <div className="flex items-baseline justify-between gap-4">
                  <span className="mono num text-s1 text-[var(--celeste)]">{p.n}</span>
                  <span className="chip">{p.durata}</span>
                </div>
                <h3 className="serif mt-6 text-s2">{p.titolo}</h3>
                <p className="mt-4 text-s-1 leading-relaxed tenue">{p.testo}</p>
                <p className="mt-auto border-t border-[var(--bordo)] pt-5 text-s-2 leading-relaxed tenue">{p.dettaglio}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* la demo: cosa si vede dal vivo */}
        <div className="card rivela mt-6 overflow-hidden p-7 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14">
            <div>
              <span className="occhiello">Durante l’incontro</span>
              <h3 className="serif mt-4 text-s3">I sistemi glieli faccio vedere girare. Dal telefono, in quindici secondi.</h3>
              <p className="misura mt-5 text-s0 tenue">
                Non una presentazione: i moduli sono costruiti e funzionano. Apro un indirizzo dal telefono e i
                messaggi partono davvero, su dati di esempio. Vede il messaggio che riceverebbe il paziente, il
                riepilogo che riceverebbe la sua segretaria, e l’elenco di chi il sistema ha deciso di{' '}
                <strong className="font-medium text-[var(--bianco)]">non</strong> contattare, con il motivo.
              </p>
              <p className="mt-5 text-s-1 tenue">
                Sui dati del suo studio non gira ancora: quello è il lavoro del setup, e glielo dico prima, non dopo.
              </p>
            </div>

            <ul className="grid gap-3">
              {[
                ['Il messaggio al paziente', 'scritto sul momento, non preconfezionato'],
                ['Il riepilogo alla segreteria', 'cosa è partito, cosa no, e perché'],
                ['Il controllo di conformità', 'blocca il messaggio se contiene parole vietate'],
                ['Lo slot che si riempie', 'una disdetta, e il posto va alla lista d’attesa'],
              ].map(([t, s], i) => (
                <li
                  key={t}
                  className="flex items-start gap-4 rounded-2xl border border-[var(--bordo)] bg-[color-mix(in_srgb,#05070F_45%,transparent)] p-4"
                >
                  <span className="mono num mt-0.5 text-s-2 text-[var(--celeste)]">{`0${i + 1}`}</span>
                  <span>
                    <span className="block text-s-1 font-medium">{t}</span>
                    <span className="block text-s-2 tenue">{s}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
