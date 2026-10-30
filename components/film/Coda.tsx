// La coda di ogni pagina film: preventivo (modulo del compito 6), Bruno (solo in home), contatti, informazioni.
// Sta sul nero con la luce calda dello studio, in CSS. Testi da testi.md §3 tempo 4, §4 fine, §5; copiati lettera per lettera.
import type { ReactNode } from 'react'
import ModuloPreventivo from './ModuloPreventivo'
import { CONTATTI, VOCI_MENU, profiliSocial } from './dati/contatti'
import FermaMovimento from './FermaMovimento'
import type { Servizio } from './dati/contatti'

const FRASI_BRUNO = [
  "Dietro Agenti Studio c'è una persona.",
  'Mi chiamo Bruno Liverani, sono di Faenza.',
  'Ogni lavoro lo seguo io, dalla prima chiamata alla consegna.',
  'Atlas, Janus, Prometheus e Hermes lavorano con me.',
]

type Props = {
  servizio?: Servizio
  conBruno?: boolean
  /** S23: la riga sotto «Richiedi un preventivo», diversa per pagina (sostituisce quella fissa) */
  riga?: string
  /** Chi siamo ha già i quattro servizi sopra: la coda non li ripete */
  senzaAltri?: boolean
  children?: ReactNode
}

export default function Coda({ servizio, conBruno, riga, senzaAltri, children }: Props) {
  const altre = VOCI_MENU.filter((v) => v.href !== `/${servizio}`)
  return (
    <section className="coda" aria-label="Contatti e informazioni">
      <div className="fondale" aria-hidden="true" />
      <div className="coda-dentro">
        <div id="preventivo" className="coda-preventivo">
          <h2 className="coda-titolo">Richiedi un preventivo</h2>
          <p className="coda-sotto">{riga ?? 'Raccontaci cosa ti serve. Senza impegno, ti risponde Bruno entro un giorno lavorativo.'}</p>
          {riga ? <p className="coda-nota">Senza impegno. Ti risponde Bruno entro un giorno lavorativo.</p> : null}
          {/* il servizio della pagina è già scelto nel modulo; `children` resta per un contenuto diverso dal modulo */}
          {children ?? <ModuloPreventivo servizio={servizio} />}
        </div>

        {conBruno ? (
          <div className="coda-bruno">
            <div className="coda-frasi">
              {FRASI_BRUNO.map((f) => <p className="coda-frase" key={f}>{f}</p>)}
            </div>
            {CONTATTI.fotoBruno ? (
              <div className="ritratto">
                <img src={CONTATTI.fotoBruno} alt="Bruno Liverani" loading="lazy" decoding="async" style={{ filter: 'grayscale(1)' }} />
              </div>
            ) : (
              // segnaposto neutro: mai un volto generato (D25); la foto vera la consegna Bruno dopo la costruzione
              <div className="ritratto" aria-hidden="true" />
            )}
          </div>
        ) : senzaAltri ? null : (
          <nav className="coda-altre" aria-label="Gli altri servizi">
            {altre.map((v) => (
              <a className="coda-altra" href={v.href} data-materia={v.materia} key={v.href}>
                <span className="menu-num">{v.num}</span>
                <span className="coda-altra-testo">{v.testo}</span>
              </a>
            ))}
          </nav>
        )}

        <div className="coda-contatti">
          <a href={CONTATTI.whatsapp} target="_blank" rel="noopener">WhatsApp</a>
          <a href={`tel:${CONTATTI.telefono}`}>{CONTATTI.telefonoLeggibile}</a>
          <a href={`mailto:${CONTATTI.email}`}>{CONTATTI.email}</a>
          {profiliSocial().map((p) => (
            <a href={p.href} target="_blank" rel="noopener" key={p.id}>{p.testo}</a>
          ))}
        </div>

        <p className="coda-info">
          Agenti Studio di Bruno Liverani · Faenza (RA) · {CONTATTI.piva ? <>P.IVA {CONTATTI.piva} · </> : null}
          <a href="/privacy">Privacy</a> · <a href="/privacy#cookie">Cookie</a>
        </p>
        <FermaMovimento className="coda-ferma" />
      </div>
    </section>
  )
}
