'use client'

// Il componente Film: markup della scena (poster, due canvas, atti e battute come testo HTML vero) e avvio del motore.
// Senza JavaScript resta il poster fisso coi testi in fila (manca la classe `film-attivo` su <html>).
// Ogni collegamento è un <a> semplice, mai next/link (Ruling 9: la classe `film` su <html> non si rimette in
// navigazione morbida).
import { Fragment, useEffect, useRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import type { Servizio } from './dati/contatti'
import { scegliModo } from './modo'
import Testata from './Testata'
import { avviaFilm } from './motore'
import { posizioneAccento } from './regia'
import type { Atto, Battuta, Regia } from './regia'

type Props = {
  regia: Regia
  poster: { src: string; alt: string }
  h1: string
  corrente: 'home' | Servizio
  children?: ReactNode
}

type Finestra = { 'data-da': number; 'data-a': number; 'data-s': number }

const finestra = (da: number, a: number, s?: number): Finestra => ({ 'data-da': da, 'data-a': a, 'data-s': s ?? 0.18 })

/** la frase con la parola d'accento colorata (la prima occorrenza di `accento` come parola intera dentro `testo`) */
function Testo({ testo, accento }: { testo: string; accento?: string }) {
  const i = posizioneAccento(testo, accento)
  if (!accento || i < 0) return <>{testo}</>
  return (
    <>
      {testo.slice(0, i)}
      <em className="accento">{accento}</em>
      {testo.slice(i + accento.length)}
    </>
  )
}

/** la parola più lunga: serve al CSS per non far uscire dallo schermo i nomi lunghi (Prometheus) */
const lettere = (testo: string) => Math.max(...testo.split(/\s+/).map((p) => p.length))

/** ogni carattere in uno <span class="lettera"> (testo vero, già nell'HTML del server); gli spazi restano testo */
function spezza(testo: string, chiave: string): ReactNode[] {
  return Array.from(testo).map((c, i) => (/\s/.test(c) ? c : <span className="lettera" key={chiave + i}>{c}</span>))
}

/**
 * Il testo in lettere, che il motore scrive una per volta con la materia (D26); la parola d'accento resta un <em>.
 * Senza JavaScript, col movimento ridotto o senza particelle le lettere sono tutte accese (film.css).
 */
function Lettere({ testo, accento }: { testo: string; accento?: string }) {
  const i = posizioneAccento(testo, accento)
  if (!accento || i < 0) return <>{spezza(testo, 't')}</>
  return (
    <>
      {spezza(testo.slice(0, i), 'p')}
      <em className="accento">{spezza(accento, 'a')}</em>
      {spezza(testo.slice(i + accento.length), 'd')}
    </>
  )
}

function BattutaHtml({ b }: { b: Battuta }) {
  const f = finestra(b.da, b.a, b.s)
  switch (b.tipo) {
    case 'nome':
      // decorativo: l'H1 è la riga piccola (testi §6)
      return (
        <p className="battuta battuta-nome nome" aria-hidden="true" style={{ '--lettere': lettere(b.testo) } as CSSProperties} {...f}>
          <Lettere testo={b.testo} />
        </p>
      )
    case 'motto':
      // chi usa un lettore di schermo sente il motto intero, non lettera per lettera
      return (
        <p className="battuta battuta-motto" {...f}>
          <span className="solo-lettore">{b.testo}</span>
          <span aria-hidden="true"><Lettere testo={b.testo} accento={b.accento} /></span>
        </p>
      )
    case 'frase':
      return (
        <p className="battuta battuta-frase" data-burst={b.burst ? '1' : undefined} {...f}>
          <Testo testo={b.testo} accento={b.accento} />
        </p>
      )
    case 'link':
      return <a className="battuta battuta-link" href={b.href} {...f}><Testo testo={b.testo} accento={b.accento} /></a>
    case 'cartolina':
      return (
        <a className="battuta cartolina" href={b.href} {...f}>
          <span className="cartolina-testo"><Testo testo={b.testo} accento={b.accento} /></span>
          {b.nota ? <span className="cartolina-nota">{b.nota}</span> : null}
        </a>
      )
    case 'passo':
      // "01 · Chiamata" e la sua riga (in `nota`): i passi di "Come lavoriamo" si danno il cambio nello stesso punto
      return (
        <p className="battuta battuta-passo" {...f}>
          <span className="passo-etichetta">{b.testo}</span>
          {b.nota ? <span className="passo-riga">{b.nota}</span> : null}
        </p>
      )
    case 'scorri':
      return <p className="battuta scorri" {...f}><span className="scorri-linea" aria-hidden="true" />{b.testo}</p>
    default:
      return <p className={`battuta battuta-${b.tipo}`} {...f}><Testo testo={b.testo} accento={b.accento} /></p>
  }
}

/** le frasi (e i passi) consecutivi stanno nello stesso punto e si danno il cambio: si raggruppano in un .frasi */
const siAvvicenda = (b: Battuta) => b.tipo === 'frase' || b.tipo === 'passo'
function gruppi(battute: Battuta[]): (Battuta | Battuta[])[] {
  const out: (Battuta | Battuta[])[] = []
  for (const b of battute) {
    const ultimo = out[out.length - 1]
    if (siAvvicenda(b) && Array.isArray(ultimo) && ultimo[0].tipo === b.tipo) ultimo.push(b)
    else out.push(siAvvicenda(b) ? [b] : b)
  }
  return out
}

function AttoHtml({ atto, h1, regia, ultimo }: { atto: Atto; h1?: string; regia: Regia; ultimo: boolean }) {
  // l'H1 (riga piccola in mono) va sotto il nome del primo atto; acceso dall'arrivo fino alla fine dell'atto
  const titolo = h1 ? <h1 className="battuta h1-piccolo" {...finestra(0, atto.a)}>{h1}</h1> : null
  const conNome = atto.battute.some((b) => b.tipo === 'nome')
  return (
    <section className="atto" id={atto.id} data-id={atto.id} data-materia={atto.materia} aria-label={atto.nome}>
      {conNome ? null : titolo}
      {gruppi(atto.battute).map((g, i) =>
        Array.isArray(g) ? (
          <div className={g[0].tipo === 'passo' ? 'frasi passi' : 'frasi'} key={i}>
            {g.map((b, j) => <BattutaHtml b={b} key={j} />)}
          </div>
        ) : (
          <Fragment key={i}>
            <BattutaHtml b={g} />
            {g.tipo === 'nome' && conNome && atto.battute.find((b) => b.tipo === 'nome') === g ? titolo : null}
          </Fragment>
        ),
      )}
      {ultimo && regia.pulsante ? (
        // il pulsante nasce dalle quattro materie che convergono (D22, motore + materia.ts): è un collegamento vero al suo
        // posto finale; come le altre battute, si raggiunge col Tab solo mentre è visibile
        <div className="chiusura">
          <a className="battuta pulsante" href={regia.pulsante.href} {...finestra(regia.pulsante.da, Infinity)}>{regia.pulsante.testo}</a>
          <p className="battuta pulsante-sotto" {...finestra(regia.pulsante.da, Infinity)}>{regia.pulsante.sotto}</p>
        </div>
      ) : null}
    </section>
  )
}

export default function Film({ regia, poster, h1, corrente, children }: Props) {
  const radice = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = radice.current
    if (!el) return
    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string }
      deviceMemory?: number
    }
    const modo = scegliModo({
      ridotto: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      risparmioDati: !!(nav.connection && nav.connection.saveData),
      memoriaGB: nav.deviceMemory,
      core: nav.hardwareConcurrency || undefined,
      rete: nav.connection ? nav.connection.effectiveType : undefined,
      larghezza: window.innerWidth,
      verticale: window.matchMedia('(orientation: portrait)').matches,
    })
    el.dataset.modo = modo.modo
    return avviaFilm(el, regia, modo)
  }, [regia])

  const primo = regia.atti[0]
  return (
    <>
      <div className="film-scena" ref={radice} style={{ '--T': regia.T } as CSSProperties}>
        <div className="palco">
          <picture className="locandina">
            <img src={poster.src} alt={poster.alt} width={720} height={1280} fetchPriority="high" decoding="async" />
          </picture>
          <canvas className="tela" aria-hidden="true" />
          <canvas className="tela-materia" aria-hidden="true" />
          <div className="interfaccia">
            <Testata corrente={corrente} />
            {regia.atti.map((at, i) => (
              <AttoHtml atto={at} h1={at === primo ? h1 : undefined} regia={regia} ultimo={i === regia.atti.length - 1} key={at.id} />
            ))}
          </div>
        </div>
      </div>
      {children}
    </>
  )
}
