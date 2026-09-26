import { MODULI } from './dati'
import { ILLUSTRAZIONI } from './Illustrazioni'

/**
 * I sei servizi.
 * Per ognuno: illustrazione 2D del meccanismo, promessa, guadagno in ore e
 * in euro, e un carosello di quattro schede che spiegano il funzionamento
 * senza entrare nel tecnico.
 *
 * Il carosello usa scroll-snap nativo: momentum del dispositivo, funziona
 * con la tastiera, e non pesa un byte di JavaScript.
 */
export default function Servizi() {
  return (
    <section id="servizi" className="scuro grana sezione">
      <div className="wrap">
        <div className="max-w-3xl">
          <span className="occhiello rivela">Sei moduli, un problema ciascuno</span>
          <div className="filetto mt-5" />
          <h2 className="serif rivela mt-7 text-s4">
            Ogni modulo risolve una cosa sola, e si misura con un numero solo.
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
                  {/* illustrazione 2D del meccanismo */}
                  <div className="rivela-scala">
                    <div className="rounded-xl3 border border-[var(--bordo-scuro)] bg-[color-mix(in_srgb,#122239_80%,transparent)] p-4 sm:p-6">
                      {Illustrazione ? <Illustrazione /> : null}
                    </div>
                  </div>

                  <div className="rivela">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="num serif text-s2 text-[var(--brass)]">{m.sigla}</span>
                      <span
                        className="chip"
                        style={
                          m.stato === 'pronto'
                            ? { borderColor: 'color-mix(in srgb, #1F8A78 55%, transparent)', color: 'var(--jade-2)' }
                            : undefined
                        }
                      >
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ background: m.stato === 'pronto' ? 'var(--jade-2)' : 'var(--brass)' }}
                        />
                        {m.statoNota}
                      </span>
                    </div>

                    <h3 className="serif mt-5 text-s3 text-[var(--paper)]">{m.nome}</h3>
                    <p className="misura mt-4 text-s1 leading-[1.45]">{m.promessa}</p>

                    {/* guadagno in ore e in euro */}
                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                      <Guadagno etichetta="Ore liberate" valore={m.ore} nota={m.oreNota} />
                      <Guadagno etichetta="Quanto vale" valore={m.euro} nota={m.euroNota} />
                    </div>

                    <p className="mt-6 !text-s-1 !text-[color-mix(in_srgb,#F7F4EF_50%,transparent)]">
                      Si misura con: <span className="text-[var(--jade-2)]">{m.metrica}</span>
                    </p>
                  </div>
                </div>

                {/* carosello di spiegazione */}
                <div className="mt-10">
                  <div className="carosello -mx-[clamp(1.25rem,4vw,3rem)] px-[clamp(1.25rem,4vw,3rem)]">
                    {m.posts.map((post, k) => (
                      <div
                        key={post.titolo}
                        className="card flex flex-col p-6"
                        style={{ background: 'color-mix(in srgb, #122239 88%, transparent)' }}
                      >
                        <div className="flex items-baseline gap-3">
                          <span className="num text-s-2 text-[var(--brass)]">{`0${k + 1}`}</span>
                          <h4 className="text-s0 font-medium text-[var(--paper)]">{post.titolo}</h4>
                        </div>
                        <p className="mt-4 !text-s-1 leading-relaxed">{post.testo}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 !text-s-2 !text-[color-mix(in_srgb,#F7F4EF_38%,transparent)]">
                    Scorri le schede per capire come funziona →
                  </p>
                </div>
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
      <span className="occhiello !text-[color-mix(in_srgb,#F7F4EF_45%,transparent)]">{etichetta}</span>
      <div className="num serif mt-2 text-s2 text-[var(--paper)]">{valore}</div>
      <p className="mt-2 !text-s-2 leading-snug !text-[color-mix(in_srgb,#F7F4EF_55%,transparent)]">{nota}</p>
    </div>
  )
}
