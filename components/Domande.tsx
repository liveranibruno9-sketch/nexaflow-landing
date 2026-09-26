import { FAQ } from './dati'

export default function Domande() {
  return (
    <section id="domande" className="sezione">
      <div className="wrap">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <span className="occhiello rivela">Domande</span>
            <div className="filetto mt-5" />
            <h2 className="serif rivela mt-7 text-s4">Le sei che arrivano sempre.</h2>
            <p className="rivela rit-1 mt-6 text-s0 text-[var(--slate)]">
              Se ne ha una settima, me la scriva: rispondo io.
            </p>
          </div>

          <div className="rivela">
            {FAQ.map((f, i) => (
              <details key={f.d} className="group border-b border-[var(--bordo)] first:border-t">
                <summary className="flex items-start justify-between gap-6 py-6 text-s1 font-medium tracking-[-0.02em] transition-colors hover:text-[var(--jade)]">
                  <span className="flex gap-5">
                    <span className="num mt-1.5 text-s-2 text-[var(--brass)]">{`0${i + 1}`}</span>
                    <span className="max-w-[34ch]">{f.d}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="piu mt-1.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[var(--bordo)] transition-transform duration-300 ease-soft"
                  >
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <path d="M5.5 1v9M1 5.5h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                  </span>
                </summary>
                <p className="misura pb-7 pl-0 text-s0 leading-relaxed text-[var(--slate)] sm:pl-[3.1rem]">
                  {f.r}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
