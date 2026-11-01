// La pagina Chi siamo (DESIGN_SPEC-pagine §13): il film (la sola apertura), poi missione, visione, valori, «io» (la persona), la squadra
// (i quattro servizi), dove trovarci, invito e coda. Ordine deciso da Bruno il 1/11/2026. Componente server: i testi vengono da dati/chi-siamo.ts.
import Coda from '../../film/Coda'
import ModuloPreventivo from '../../film/ModuloPreventivo'
import { CONTATTI, profiliSocial } from '../../film/dati/contatti'
import PaginaVarco from '../PaginaVarco'
import { posizioneAccento } from '../testo.ts'
import type { DatiChiSiamo } from '../dati/chi-siamo.ts'
import Invito from './Invito'
import Rivela from './Rivela'
import Servizi from './Servizi'

/** la frase con la parola d'accento già «toccata» (fuori dal film non c'è la materia che la raggiunge) */
function conAccento(testo: string, accento?: string) {
  const i = posizioneAccento(testo, accento)
  if (!accento || i < 0) return testo
  return (
    <>
      {testo.slice(0, i)}
      <em className="accento toccata">{accento}</em>
      {testo.slice(i + accento.length)}
    </>
  )
}

export default function PaginaChiSiamo({ dati }: { dati: DatiChiSiamo }) {
  const social = profiliSocial()
  return (
    <main id="contenuto" data-materia="polvere" data-pagina="chi-siamo">
      <PaginaVarco dati={dati}>
        <div className="pagina-corpo">
          <section className="sezione chi-missione" data-modo="quiete" aria-labelledby="missione-t">
            <h2 id="missione-t" className="sezione-titolo cresce">{dati.missione.h2}</h2>
            <p className="chi-grande cresce">{dati.missione.testo}</p>
          </section>
          <section className="sezione chi-visione" data-modo="quiete" aria-labelledby="visione-t">
            <h2 id="visione-t" className="sezione-titolo cresce">{dati.visione.h2}</h2>
            <p className="chi-testo cresce">{dati.visione.testo}</p>
          </section>
          <section className="sezione chi-valori" data-modo="quiete" aria-labelledby="valori-t">
            <h2 id="valori-t" className="sezione-titolo cresce">{dati.valori.h2}</h2>
            <ul className="valori-lista">
              {dati.valori.voci.map((v) => (
                <li className="valore cresce" key={v.parola} data-materia={v.materia === 'luce' ? undefined : v.materia} data-luce={v.materia === 'luce' ? 'true' : undefined}>
                  <span className="valore-parola">{v.parola}</span>
                  <span className="valore-riga">{v.riga}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="sezione chi-persona" data-modo="persona" aria-labelledby="persona-t">
            <h2 id="persona-t" className="sezione-titolo cresce">{dati.persona.h2}</h2>
            <p className="chi-nome-luce cresce">{dati.persona.nome}</p>
            {CONTATTI.fotoBruno ? <figure className="chi-foto cresce"><img src={CONTATTI.fotoBruno} alt="Bruno Liverani" width={600} height={800} loading="lazy" decoding="async" style={{ filter: 'grayscale(1)' }} /></figure> : null}
            <div className="chi-frasi">
              {dati.persona.frasi.map(([testo, accento]) => <p className="chi-frase cresce" key={testo}>{conAccento(testo, accento)}</p>)}
            </div>
          </section>
          <Servizi h2={dati.servizi.h2} voci={dati.servizi.voci} />
          <section className="sezione chi-dove" data-modo="quiete" aria-labelledby="dove-t">
            <h2 id="dove-t" className="sezione-titolo cresce">{dati.dove.h2}</h2>
            <ul className="dove-lista cresce">
              {social.map((p) => <li key={p.id}><a href={p.href} target="_blank" rel="noopener">{p.testo}</a></li>)}
              <li><a href={CONTATTI.whatsapp} target="_blank" rel="noopener">WhatsApp {CONTATTI.telefonoLeggibile}</a></li>
              <li><a href={`mailto:${CONTATTI.email}`}>{CONTATTI.email}</a></li>
              <li className="dove-luogo">{dati.dove.luogo}</li>
            </ul>
          </section>
          <Invito frasi={[[dati.invito.frase]]} nota="Senza impegno. Ti risponde Bruno entro un giorno lavorativo." senzaAncora />
        </div>
        <Coda riga={dati.coda.riga} senzaAltri>
          <ModuloPreventivo />
        </Coda>
        <Rivela />
      </PaginaVarco>
    </main>
  )
}
