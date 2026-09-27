import Contatore from './Contatore'
import { PERDITE } from './dati'

/**
 * Stelle che si spengono: le quattro perdite.
 *
 * Ogni scheda ha una stella che entra accesa e celeste e, mentre la si
 * legge, vira in arancione e si attenua (CSS guidato dallo scroll, zero JS).
 * Dove il browser non lo supporta, la stella e gia nello stato finale.
 * Pagina ferma: le schede si leggono scorrendo normalmente, niente scroll
 * orizzontale.
 */
export default function Perdite() {
  return (
    <section id="perdite" className="sezione scroll-mt-20">
      <div className="wrap">
        <div className="max-w-3xl">
          <span className="occhiello rivela">Il problema</span>
          <div className="filetto filetto-caldo mt-5" />
          <h2 className="serif rivela mt-7 text-s4">Quattro perdite. Nessuna compare nei report.</h2>
          <p className="rivela rit-1 misura mt-6 text-s0 tenue">
            Non sono errori di qualcuno. Sono punti che nessuno ha il tempo di collegare, e ognuno si spegne in
            silenzio, ogni settimana.
          </p>
        </div>

        <ol className="mt-16 grid gap-5 md:mt-20 md:grid-cols-2">
          {PERDITE.map((p, i) => (
            <li key={p.n} className={`card rivela flex flex-col p-7 sm:p-9 ${i % 2 === 1 ? 'rit-1' : ''}`}>
              <div className="flex items-center justify-between gap-4">
                <StellaPerdita />
                <span className="mono num text-s-2 tenue">{p.n} / 04</span>
              </div>

              <h3 className="serif mt-7 text-s2 leading-[1.08]">{p.titolo}</h3>
              <p className="mt-4 text-s-1 leading-relaxed tenue">{p.testo}</p>

              <div className="mt-auto border-t border-[var(--bordo)] pt-6">
                <Contatore
                  a={p.valore}
                  prefisso={p.prefisso}
                  suffisso={p.suffisso}
                  className="serif block text-s4 leading-none text-[var(--arancio)]"
                />
                <p className="mt-3 text-s-2 leading-snug tenue">{p.datoNota}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function StellaPerdita() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true" className="stella-perdita">
      <circle cx="22" cy="22" r="13" fill="currentColor" opacity="0.14" />
      <path
        d="M22 6 C23 17 27 21 38 22 C27 23 23 27 22 38 C21 27 17 23 6 22 C17 21 21 17 22 6 Z"
        fill="currentColor"
      />
    </svg>
  )
}
