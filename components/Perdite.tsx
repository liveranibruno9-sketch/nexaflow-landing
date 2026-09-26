import { PERDITE } from './dati'
import Contatore from './Contatore'

/**
 * Le quattro perdite, in scorrimento orizzontale.
 *
 * Su schermo largo la sezione si blocca e la fascia scorre lateralmente
 * mentre la pagina scende: e il momento di movimento piu forte del sito, e
 * sta qui perche e la sezione che deve far sentire il problema.
 *
 * Titolo e fascia stanno dentro lo stesso viewport bloccato e vengono
 * centrati insieme: tenendo il titolo fuori restava un vuoto verticale fra
 * le due cose.
 *
 * Senza supporto alle scroll-driven animations, su mobile, o con
 * `prefers-reduced-motion`, la stessa fascia resta un carosello che si scorre
 * a mano con la barra visibile. Nessun contenuto e raggiungibile solo tramite
 * animazione.
 *
 * Il colore qui e tutto caldo: in questo sito l'arancio significa "quello che
 * stai perdendo".
 */
export default function Perdite() {
  return (
    <section id="perdite">
      <div className="orizz pt-[var(--sezione)] lg:pt-0">
        <div className="orizz__vp">
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
          </div>

          <div className="orizz__track" role="group" aria-label="Le quattro perdite" tabIndex={0}>
            {PERDITE.map((p) => (
              <article key={p.n} className="orizz__pannello card flex flex-col justify-between p-7 sm:p-9">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="num text-s-2 font-medium tracking-[0.16em] text-[var(--slate-2)]">
                      {p.n}
                    </span>
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 rounded-full"
                      style={{ background: 'var(--arancio)' }}
                    />
                  </div>

                  <h3 className="mt-7 text-s2 font-medium tracking-[-0.025em]">{p.titolo}</h3>
                  <p className="mt-4 text-s-1 leading-relaxed text-[var(--slate)]">{p.testo}</p>
                </div>

                <div className="mt-9 border-t border-[var(--bordo)] pt-6">
                  <div className="serif text-s4 leading-none" style={{ color: 'var(--arancio-ink)' }}>
                    <Contatore a={p.valore} prefisso={p.prefisso} suffisso={p.suffisso} />
                  </div>
                  <p className="mt-3 text-s-2 leading-snug text-[var(--slate)]">{p.datoNota}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="wrap pb-[var(--sezione)] pt-10">
        <p className="max-w-2xl text-s-2 text-[var(--slate)]">
          I riferimenti vengono dalla letteratura di settore e da verifiche fatte su studi reali. Sul suo
          studio non valgono finché non li misuriamo: è esattamente quello che fa la verifica gratuita.
        </p>
      </div>
    </section>
  )
}
