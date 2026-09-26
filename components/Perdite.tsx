import { PERDITE } from './dati'

/**
 * Le quattro perdite, in pila sticky.
 * Ogni card si ferma sotto la precedente, si rimpicciolisce e sfuma quando
 * esce: e la gerarchia di profondita che rende leggibile un elenco lungo
 * senza costringere a scorrere quattro schermate piatte.
 */
export default function Perdite() {
  return (
    <section id="perdite" className="sezione">
      <div className="wrap">
        <div className="max-w-3xl">
          <span className="occhiello rivela">Dove se ne vanno i soldi</span>
          <div className="filetto mt-5" />
          <h2 className="serif rivela mt-7 text-s4">
            Nessuna di queste perdite compare in un bilancio. Succedono e basta.
          </h2>
          <p className="rivela rit-1 misura mt-6 text-s0 text-[var(--slate)]">
            Non sono problemi di qualità dello studio. Sono buchi nel percorso fra il momento in cui un paziente
            ha bisogno di lei e il momento in cui si siede sulla poltrona.
          </p>
        </div>

        <div className="pila mt-16 md:mt-24">
          {PERDITE.map((p) => (
            <article
              key={p.n}
              className="strato card overflow-hidden p-7 shadow-[0_24px_60px_-40px_rgba(10,22,40,.5)] sm:p-10"
            >
              <div className="grid gap-8 md:grid-cols-[auto_1fr_auto] md:items-start md:gap-12">
                <span className="num serif text-s3 text-[var(--brass)]">{p.n}</span>

                <div>
                  <h3 className="text-s2 font-medium tracking-[-0.02em]">{p.titolo}</h3>
                  <p className="misura mt-4 text-s0 text-[var(--slate)]">{p.testo}</p>
                </div>

                <div className="shrink-0 border-t border-[var(--bordo)] pt-5 md:w-56 md:border-l md:border-t-0 md:pl-8 md:pt-0">
                  <div className="num serif text-s3 leading-none">{p.dato}</div>
                  <p className="mt-3 text-s-1 leading-snug text-[var(--slate)]">{p.datoNota}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="rivela mx-auto mt-16 max-w-2xl text-center text-s-1 text-[var(--slate)]">
          I riferimenti sopra vengono dalla letteratura di settore e da verifiche fatte su studi reali.
          Sul suo studio non valgono finché non li misuriamo: è esattamente quello che fa la verifica gratuita.
        </p>
      </div>
    </section>
  )
}
