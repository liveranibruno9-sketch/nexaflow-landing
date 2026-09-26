import { MODULI } from './dati'
import { ILLUSTRAZIONI } from './Illustrazioni'
import Carosello from './Carosello'

/**
 * I sei servizi.
 * Per ognuno: illustrazione 2D del meccanismo, promessa, guadagno in ore e in
 * euro, e un carosello di quattro schede che spiega il funzionamento senza
 * entrare nel tecnico.
 *
 * Il carosello ha barra di scorrimento visibile, frecce e indicatore di
 * posizione: con la barra nascosta l'ultima scheda restava tagliata e chi
 * leggeva non capiva che ce n'erano altre.
 */
export default function Servizi() {
  return (
    <section id="servizi" className="scuro grana sezione">
      <div className="wrap">
        <div className="max-w-3xl">
          <span className="occhiello rivela">Sei moduli, un problema ciascuno</span>
          <div className="filetto mt-5" />
          <h2 className="serif mt-7 text-s4">
            <span className="riga">
              <span>Un modulo, un problema.</span>
            </span>
            <span className="riga">
              <span className="text-[var(--blu-2)]">Un numero solo.</span>
            </span>
          </h2>
          <p className="rivela rit-1 misura mt-6 text-s0">
            Al primo incontro se ne propone uno, quello che la verifica indica. Gli altri sono la mappa di
            quello che si può fare dopo, se il primo funziona.
          </p>
        </div>

        <div className="mt-20 space-y-[clamp(5rem,9vw,8rem)] md:mt-28">
          {MODULI.map((m, i) => {
            const Illustrazione = ILLUSTRAZIONI[m.slug]
            const inverso = i % 2 === 1
            return (
              <article key={m.sigla} id={m.slug} className="scroll-mt-28">
                <div
                  className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
                    inverso ? 'lg:[&>*:first-child]:order-2' : ''
                  }`}
                >
                  <div className="rivela-scala">
                    <div className="rounded-xl3 border border-[var(--bordo-scuro)] bg-[color-mix(in_srgb,#111A2E_82%,transparent)] p-4 sm:p-6">
                      {Illustrazione ? <Illustrazione /> : null}
                    </div>
                  </div>

                  <div className="rivela">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="num serif text-s2 text-[var(--blu-2)]">{m.sigla}</span>
                      <span
                        className="chip"
                        style={
                          m.stato === 'pronto'
                            ? {
                                borderColor: 'color-mix(in srgb, #C9F24D 40%, transparent)',
                                color: 'var(--lime)',
                              }
                            : undefined
                        }
                      >
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ background: m.stato === 'pronto' ? 'var(--lime)' : 'var(--arancio)' }}
                        />
                        {m.statoNota}
                      </span>
                    </div>

                    <h3 className="serif mt-5 text-s3 text-[var(--paper)]">{m.nome}</h3>
                    <p className="misura mt-4 text-s1 leading-[1.45]">{m.promessa}</p>

                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                      <Guadagno etichetta="Ore liberate" valore={m.ore} nota={m.oreNota} />
                      <Guadagno etichetta="Quanto vale" valore={m.euro} nota={m.euroNota} />
                    </div>

                    <p className="mt-6 !text-s-1 !text-[color-mix(in_srgb,#FAF6EF_50%,transparent)]">
                      Si misura con: <span className="text-[var(--blu-2)]">{m.metrica}</span>
                    </p>
                  </div>
                </div>

                <Carosello className="mt-10" etichetta={`Come funziona ${m.nome}`}>
                  {m.posts.map((post, k) => (
                    <div
                      key={post.titolo}
                      className="card flex flex-col p-6"
                      style={{ background: 'color-mix(in srgb, #111A2E 90%, transparent)' }}
                    >
                      <div className="flex items-baseline gap-3">
                        <span className="num text-s-2 text-[var(--blu-2)]">{`0${k + 1}`}</span>
                        <h4 className="text-s0 font-medium text-[var(--paper)]">{post.titolo}</h4>
                      </div>
                      <p className="mt-4 !text-s-1 leading-relaxed">{post.testo}</p>
                    </div>
                  ))}
                </Carosello>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Guadagno({ etichetta, valore, nota }: { etichetta: string; valore: string; nota: string }) {
  return (
    <div className="rounded-2xl border border-[var(--bordo-scuro)] bg-[color-mix(in_srgb,#ffffff_4%,transparent)] p-5">
      <span className="occhiello !text-[color-mix(in_srgb,#FAF6EF_45%,transparent)]">{etichetta}</span>
      <div className="num serif mt-2 text-s2 text-[var(--blu-2)]">{valore}</div>
      <p className="mt-2 !text-s-2 leading-snug !text-[color-mix(in_srgb,#FAF6EF_55%,transparent)]">{nota}</p>
    </div>
  )
}
