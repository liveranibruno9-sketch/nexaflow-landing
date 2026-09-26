import { PERDITE } from './dati'
import Contatore from './Contatore'
import Carosello from './Carosello'

/**
 * Le quattro perdite.
 *
 * Qui c'era uno scorrimento orizzontale bloccato: la sezione si fermava e le
 * card scorrevano di lato mentre si girava la rotella. E stato tolto.
 * Su un sito B2B dirottare lo scroll e un difetto, non un effetto: chi vuole
 * scendere nella pagina si ritrova a muovere delle card, e non capisce piu
 * dove si trova. Il movimento vale solo finche non toglie il controllo.
 *
 * Ora la fascia e ferma e si esplora solo se il lettore lo decide, con la
 * stessa barra orizzontale dei caroselli dei moduli. Comportamento identico
 * in tutto il sito.
 *
 * Il colore qui e caldo: in questo sito l'arancio significa "quello che stai
 * perdendo".
 */
export default function Perdite() {
  return (
    <section id="perdite" className="sezione" style={{ background: 'var(--paper-3)' }}>
      <div className="wrap">
        <div className="max-w-3xl">
          <span className="occhiello rivela">Dove se ne vanno i soldi</span>
          <div className="filetto filetto-caldo mt-5" />

          <h2 className="serif mt-7 text-s4">
            <span className="riga">
              <span>Nessuna di queste perdite</span>
            </span>
            <span className="riga">
              <span>compare in un bilancio.</span>
            </span>
          </h2>

          <p className="rivela rit-1 misura mt-6 text-s0 text-[var(--slate)]">
            Non sono problemi di qualità dello studio. Sono buchi nel percorso fra il momento in cui un
            paziente ha bisogno di lei e il momento in cui si siede sulla poltrona.
          </p>
        </div>

        <Carosello className="mt-12 md:mt-16" etichetta="Le quattro perdite" largo>
          {PERDITE.map((p) => (
            <article key={p.n} className="card flex flex-col justify-between p-7 sm:p-8">
              <div>
                <div className="flex items-center justify-between">
                  <span className="num text-s-2 font-medium tracking-[0.16em] text-[var(--slate)]">
                    {p.n}
                  </span>
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 rounded-full"
                    style={{ background: 'var(--arancio)' }}
                  />
                </div>

                <h3 className="mt-7 text-s1 font-medium tracking-[-0.025em]">{p.titolo}</h3>
                <p className="mt-4 text-s-1 leading-relaxed text-[var(--slate)]">{p.testo}</p>
              </div>

              <div className="mt-8 border-t border-[var(--bordo)] pt-6">
                <div className="serif text-s3 leading-none" style={{ color: 'var(--arancio-ink)' }}>
                  <Contatore a={p.valore} prefisso={p.prefisso} suffisso={p.suffisso} />
                </div>
                <p className="mt-3 text-s-2 leading-snug text-[var(--slate)]">{p.datoNota}</p>
              </div>
            </article>
          ))}
        </Carosello>

        <p className="mt-12 max-w-2xl text-s-2 text-[var(--slate)]">
          I riferimenti vengono dalla letteratura di settore e dai listini medi del comparto odontoiatrico.
          Sul suo studio non valgono finché non li misuriamo: è esattamente quello che fa la verifica gratuita.
        </p>
      </div>
    </section>
  )
}
