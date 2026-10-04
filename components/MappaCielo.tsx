import Costellazione from './cielo/Costellazione'
import { COSTELLAZIONI } from './cielo/stelle'
import { MODULI } from './dati'

/**
 * La mappa del cielo: l'indice dei moduli.
 * Ogni costellazione e un collegamento alla sua sezione. Tutte disegnate per
 * intero: qui servono a riconoscerle, il racconto passo per passo viene dopo.
 */
export default function MappaCielo() {
  return (
    <section id="cielo" className="livello-notte sezione scroll-mt-20">
      <div className="wrap">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-20">
          <div>
            <span className="occhiello rivela">Mappa del cielo</span>
            <div className="filetto mt-5" />
            <h2 className="serif rivela mt-7 text-s4">I punti ci sono già. Mancano le linee.</h2>
          </div>
          <p className="rivela rit-1 misura text-s0 tenue">
            Ogni modulo è un flusso di passaggi automatici. Qui li vede come costellazioni: le stelle sono i
            passaggi, e si accendono nell’ordine in cui il sistema li esegue. Si parte sempre da un modulo solo,
            quello che indica la verifica.
          </p>
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-20 lg:grid-cols-3">
          {MODULI.map((m, i) => (
            <li key={m.slug} className={`rivela ${i % 3 === 1 ? 'rit-1' : i % 3 === 2 ? 'rit-2' : ''}`}>
              <a
                href={`#${m.slug}`}
                className="mappa-voce vetro-nebulosa reticolo group flex h-full flex-col rounded-xl2 p-4 sm:p-6"
              >
                <span className="flex items-baseline justify-between gap-3">
                  <span className="mono text-s-2 text-[var(--celeste)]">{m.sigla}</span>
                  <span className="mono hidden text-s-2 tenue sm:inline">{m.cielo.nome}</span>
                </span>
                <span className="mx-auto my-4 block aspect-square w-full max-w-[210px] sm:my-6">
                  <Costellazione
                    cost={COSTELLAZIONI[m.cielo.chiave]}
                    fase="luce"
                    accese={COSTELLAZIONI[m.cielo.chiave].totale}
                    idBase={`mappa-${m.slug}`}
                    compatta
                    etichetta={`Costellazione ${m.cielo.nome}`}
                  />
                </span>
                <span className="mt-auto">
                  <span className="serif block text-s1 leading-tight sm:text-s2">{m.nome}</span>
                  <span className="mono mt-1 block text-s-2 tenue sm:hidden">{m.cielo.nome}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
