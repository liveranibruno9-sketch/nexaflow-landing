// La pagina dedicata a una voce di un elenco (Automazioni, Siti web, Contenuti, Campagne): modello unico v1 (31/10).
// Cosa è (con la scena animata della voce) · Per chi è · Come funziona in tre passi · Esempi (solo se ce n'è almeno uno, R7) · Domande · Modulo.
import Testata from '../../film/Testata'
import Coda from '../../film/Coda'
import Domande from './Domande'
import Vignetta from './Vignetta'
import { NOMI_MESTIERE, SERVIZI_DEDICATI, trovaDedicata } from '../dati/dedicate'
import type { Servizio } from '../../film/dati/contatti'

export default function PaginaDedicata({ servizio, slug }: { servizio: keyof typeof SERVIZI_DEDICATI; slug: string }) {
  const v = trovaDedicata(servizio, slug)
  if (!v) return null
  const s = SERVIZI_DEDICATI[servizio]
  const richiesta = slug === 'su-misura' ? 'Vorrei una soluzione su misura per: ' : `Mi interessa: ${v.titolo}.`
  return (
    <main id="contenuto" className="dedicata">
      <Testata corrente={servizio} indice={s.indice} />
      <section className="dedicata-testa">
        <div className="dedicata-testo">
          <p className="dedicata-sopra">{s.indice[0]} · {s.nome}</p>
          <h1>{v.titolo}</h1>
          <p className="dedicata-riga">{v.cosa}</p>
          <div className="dedicata-azioni">
            <a className="pulsante" href="#preventivo" data-richiesta={richiesta}>Chiedi un preventivo</a>
            <a className="dedicata-indietro" href={s.indietro.href}>{s.indietro.testo}</a>
          </div>
        </div>
        <div className="dedicata-scena" aria-hidden="true"><div className="dedicata-scena-corpo"><Vignetta id={v.vignetta} /></div></div>
      </section>

      <section className="sezione dedicata-sezione" aria-labelledby="dedicata-chi">
        <h2 id="dedicata-chi" className="sezione-titolo">Per chi è.</h2>
        <ul className="dedicata-pills">{v.perChi.map((m) => <li key={m} className="dedicata-pill">{NOMI_MESTIERE[m]}</li>)}</ul>
      </section>

      <section className="sezione dedicata-sezione" aria-labelledby="dedicata-come">
        <h2 id="dedicata-come" className="sezione-titolo">Come funziona.</h2>
        <ol className="dedicata-passi">
          {v.passi.map((t, i) => (
            <li key={i} className="dedicata-passo">
              <span className="dedicata-passo-nome">{`0${i + 1} · ${s.tappe[i]}`}</span>
              <p>{t}</p>
            </li>
          ))}
        </ol>
      </section>

      {v.esempi?.length ? (
        <section className="sezione dedicata-sezione" aria-labelledby="dedicata-esempi">
          <h2 id="dedicata-esempi" className="sezione-titolo">Un esempio vero.</h2>
          <div className="dedicata-esempi">
            {v.esempi.map((e) => (
              <a key={e.nome} className="dedicata-esempio" href={e.href} target="_blank" rel="noopener">
                <img src={e.immagine} alt={e.alt} width={960} height={600} loading="lazy" decoding="async" />
                <span className="dedicata-esempio-nome">{e.nome}</span>
                <span className="dedicata-esempio-testo">{e.testo}</span>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <Domande h2="Le domande più frequenti." voci={v.faq} />
      <Coda servizio={servizio as Servizio} riga={`Raccontaci la tua attività: ti diciamo come funzionerebbe «${v.titolo}» da te.`} />
    </main>
  )
}
