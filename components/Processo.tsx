import { PASSI } from './dati'

export default function Processo() {
  return (
    <section id="processo" className="sezione">
      <div className="wrap">
        <div className="max-w-3xl">
          <span className="occhiello rivela">Come si parte</span>
          <div className="filetto mt-5" />
          <h2 className="serif rivela mt-7 text-s4">Tre passi. Il primo non costa niente e non impegna a niente.</h2>
        </div>

        <ol className="mt-16 grid gap-6 md:mt-20 md:grid-cols-3 md:gap-5">
          {PASSI.map((p, i) => (
            <li key={p.n} className={`card rivela flex flex-col p-7 sm:p-8 ${i === 1 ? 'rit-1' : i === 2 ? 'rit-2' : ''}`}>
              <div className="flex items-baseline justify-between gap-4">
                <span className="num serif text-s3 text-[var(--arancio)]">{p.n}</span>
                <span className="chip">{p.durata}</span>
              </div>

              <h3 className="mt-6 text-s1 font-medium tracking-[-0.02em]">{p.titolo}</h3>
              <p className="mt-4 text-s-1 leading-relaxed text-[var(--slate)]">{p.testo}</p>

              <p className="mt-auto border-t border-[var(--bordo)] pt-5 text-s-2 leading-relaxed text-[var(--slate-2)]">
                {p.dettaglio}
              </p>
            </li>
          ))}
        </ol>

        {/* la demo: cosa si vede dal vivo */}
        <div className="card rivela mt-6 overflow-hidden p-7 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14">
            <div>
              <span className="occhiello">Durante l’incontro</span>
              <h3 className="serif mt-4 text-s3">I sistemi glieli faccio vedere girare. Dal telefono, in quindici secondi.</h3>
              <p className="misura mt-5 text-s0 text-[var(--slate)]">
                Non una presentazione: i moduli sono costruiti e funzionano. Apro un indirizzo dal telefono e
                i messaggi partono davvero, su dati di esempio. Vede il messaggio che riceverebbe il paziente,
                il riepilogo che riceverebbe la sua segretaria, e l’elenco di chi il sistema ha deciso di{' '}
                <strong className="font-medium text-[var(--ink)]">non</strong> contattare, con il motivo.
              </p>
              <p className="mt-5 text-s-1 text-[var(--slate)]">
                Sui dati del suo studio non gira ancora: quello è il lavoro del setup, e glielo dico prima,
                non dopo.
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
                  className="flex items-start gap-4 rounded-2xl border border-[var(--bordo)] bg-[var(--paper)] p-4"
                >
                  <span className="num mt-0.5 text-s-2 text-[var(--arancio)]">{`0${i + 1}`}</span>
                  <span>
                    <span className="block text-s-1 font-medium">{t}</span>
                    <span className="block text-s-2 text-[var(--slate)]">{s}</span>
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
