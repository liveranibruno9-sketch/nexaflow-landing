/**
 * Durante l'incontro: i sistemi si vedono girare dal vivo.
 * Nel sito astrale stava sotto i tre passi; qui apre l'orbita, dopo il volo.
 */
export default function Demo() {
  return (
    <section id="demo" className="sezione scroll-mt-20">
      <div className="wrap">
        <div className="card rivela overflow-hidden p-7 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14">
            <div>
              <span className="occhiello">Durante l’incontro</span>
              <h2 className="serif mt-4 text-s3">I sistemi glieli faccio vedere girare. Dal telefono, in quindici secondi.</h2>
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
                  className="flex items-start gap-4 rounded-2xl border border-[color-mix(in_srgb,var(--azione-luce)_22%,transparent)] bg-[color-mix(in_srgb,var(--nebula-1)_9%,transparent)] p-4"
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
