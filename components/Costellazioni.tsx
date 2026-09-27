import ModuloCielo from './ModuloCielo'
import { MODULI } from './dati'

/**
 * Le sei costellazioni, una per modulo. Dopo le prime due il lettore ha
 * imparato la grammatica (buio, collegamento, luce) e legge le altre in fretta;
 * chi cerca un modulo preciso ci arriva dalla mappa del cielo.
 */
export default function Costellazioni() {
  return (
    <section id="servizi" className="scroll-mt-20 pb-[clamp(3rem,6vw,5rem)] pt-[var(--sezione)]">
      <div className="wrap">
        <div className="max-w-3xl pb-[clamp(3rem,6vw,5rem)]">
          <span className="occhiello rivela">Sei moduli, sei costellazioni</span>
          <div className="filetto mt-5" />
          <h2 className="serif rivela mt-7 text-s4">Una stella per ogni passaggio.</h2>
          <p className="rivela rit-1 misura mt-6 text-s0 tenue">
            Scorrendo, ogni costellazione passa per tre fasi: il problema com’è oggi, il flusso che lo risolve, e
            quello che lo studio ci guadagna. Può toccare una stella per leggere il suo passaggio.
          </p>
        </div>

        {MODULI.map((m) => (
          <ModuloCielo key={m.slug} modulo={m} />
        ))}
      </div>
    </section>
  )
}
