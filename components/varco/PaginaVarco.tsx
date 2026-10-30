'use client'

import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import Testata from '../film/Testata'
import type { Servizio } from '../film/dati/contatti'
import { bloccoAl, statoFrase } from './percorso.ts'
import { livelloDopoMisura, livelloIniziale } from './livello.ts'
import { posizioneAccento } from './testo.ts'
import { creaTocco } from './tocco.ts'
import type { Battuta, Blocco, GestoPagina } from './tipi.ts'
import type { DatiPagina } from './dati/pagine.ts'
import type { ModoPagina, MondoPagina, StatoPagina } from './mondo/pagina'
import type { Ancora } from './coreografia-pagina.ts'

/**
 * Il film di una pagina servizio (DESIGN_SPEC-pagine §8.1): apertura, problema e capacità per circa sei schermate, poi lo scroll
 * normale (i figli: gioco, tappe, domande, invito, coda) con il mondo che resta acceso dietro in quiete. Stesso schema del varco della
 * home (una traccia alta, un palco sticky, una `u` morbida letta da testi e mondo), ma con il mondo di pagina: una sola mascotte (R12).
 * Due modi, decisi PRIMA del primo disegno da SCELTA_VARCO: html.varco (il mondo) oppure la pagina normale (poster e testi in colonna).
 * I gesti delle mascotte per il gioco e l'invito: una scelta per ogni mascotte.
 */

const INERZIA = 3.2
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x))

type Props = {
  dati: DatiPagina
  /** il nome sotto i piedi della mascotte */
  nome: string
  children?: ReactNode
}

function conAccento(testo: string, accento?: string): ReactNode {
  const i = posizioneAccento(testo, accento)
  if (!accento || i < 0) return testo
  return (
    <>
      {testo.slice(0, i)}
      <em className="accento">{accento}</em>
      {testo.slice(i + accento.length)}
    </>
  )
}

function Voce({ b }: { b: Battuta }) {
  const dati = { 'data-da': b.da, 'data-a': b.a, 'data-ruolo': b.ruolo }
  const classe = `battuta battuta-${b.tipo}`
  switch (b.tipo) {
    case 'etichetta':
      return <p className={classe} {...dati}>{b.testo}</p>
    case 'titolo':
      // il titolo del servizio nell'apertura non è un titolo: l'H1 è la frase che dice cosa fa
      return b.ruolo === 'servizio' ? <p className="battuta battuta-servizio" {...dati}>{b.testo}</p> : <h2 className={classe} {...dati}>{conAccento(b.testo, b.accento)}</h2>
    case 'h1':
      return <h1 className={classe} {...dati}>{b.testo}</h1>
    case 'paragrafo':
      return <p className={classe} {...dati}>{b.testo}</p>
    case 'pulsante':
      return (
        <div className={classe} {...dati}>
          <a className="pulsante" href={b.href}>{b.testo}</a>
          {b.nota ? <p className="pulsante-sotto">{b.nota}</p> : null}
        </div>
      )
    case 'blocco':
      return (
        <div className={classe} {...dati}>
          <h3 className="blocco-titolo">{conAccento(b.testo, b.accento)}</h3>
          <p className="blocco-riga">{b.nota}</p>
        </div>
      )
    case 'foto':
      return (
        <figure className={classe} {...dati}>
          <span className="cartolina-carta"><img src={b.src} alt={b.testo} width={560} height={700} loading="lazy" decoding="async" /></span>
        </figure>
      )
    default:
      // riga del problema e frase del beneficio
      return <p className={classe} {...dati}><span className="frase-corpo">{conAccento(b.testo, b.accento)}</span></p>
  }
}

function VoceBlocco({ bl }: { bl: Blocco }) {
  const fase = bl.id.slice(bl.id.lastIndexOf('-') + 1)
  return (
    <div className="blocco" data-id={bl.id} data-tipo={bl.tipo} data-fase={fase} data-materia={bl.materia}>
      {bl.battute.map((b) => b.tipo === 'foto' ? (
        <figure className="solo-statico statico-cartolina" key={b.ruolo}><img src={b.src} alt={b.testo} width={560} height={700} loading="lazy" decoding="async" /></figure>
      ) : (
        <Voce b={b} key={b.ruolo} />
      ))}
    </div>
  )
}

/** una scelta del gioco per ogni mascotte: il gesto che la mascotte fa quando il titolare sceglie il suo mestiere */
const GESTO_SCELTA: Record<string, (i: number) => GestoPagina> = {
  atlas: (i) => ({ nome: 'prendi', lato: i % 2 ? 'destro' : 'sinistro' }),
  janus: (i) => ({ nome: i % 2 ? 'presenta' : 'modella', lato: 'sinistro' }),
  prometheus: () => ({ nome: 'lancia', lato: 'destro' }),
  hermes: () => ({ nome: 'salta' }),
}

export default function PaginaVarco({ dati, nome, children }: Props) {
  const traccia = useRef<HTMLDivElement>(null)
  const palco = useRef<HTMLDivElement>(null)
  const tela = useRef<HTMLDivElement>(null)
  const { percorso } = dati
  const corrente = dati.id as Servizio

  useEffect(() => {
    const html = document.documentElement
    const tr = traccia.current
    const pa = palco.current
    const contenitore = tela.current
    if (!html.classList.contains('varco') && pa) pa.querySelectorAll('.accento').forEach((e) => e.classList.add('toccata'))
    if (!html.classList.contains('varco') || !tr || !pa || !contenitore) return

    const L = percorso.lunghezza
    const frasi = Array.from(pa.querySelectorAll<HTMLElement>('.battuta')).map((el) => {
      const a = Number(el.dataset.a)
      return { el, da: Number(el.dataset.da), a: a >= L ? L + 1 : a, o: -1, t: '' }
    })
    const indiceNum = pa.querySelector<HTMLElement>('.indice-num')
    const indiceNome = pa.querySelector<HTMLElement>('.indice-nome')
    const barraBlu = pa.querySelector<HTMLElement>('[data-seg="blu"]')
    const nomeEl = pa.querySelector<HTMLElement>('.nome-mascotte')

    let inizio = 0
    let corsa = 1
    const misura = () => {
      const r = tr.getBoundingClientRect()
      inizio = r.top + window.scrollY
      corsa = Math.max(1, tr.offsetHeight - pa.offsetHeight)
    }
    misura()
    const uCorrente = () => clamp((window.scrollY - inizio) / corsa, 0, 1) * L
    const yDi = (u: number) => inizio + (u / L) * corsa
    // ?u=<schermate> porta subito a quel punto (per le catture e per i link); oltre la lunghezza del film, scorre nelle sezioni
    const uChiesta = new URLSearchParams(window.location.search).get('u')
    const uIniziale = uChiesta !== null && Number.isFinite(Number(uChiesta)) ? Math.max(0, Number(uChiesta)) : null
    if (uIniziale !== null) window.scrollTo({ top: uIniziale <= L ? yDi(uIniziale) : inizio + corsa + (uIniziale - L) * window.innerHeight, behavior: 'instant' })

    /* ----- la materia sopra le frasi: il tocco della parola d'accento ----- */
    const telaMateria = pa.querySelector<HTMLCanvasElement>('.tela-materia')
    const tocco = telaMateria ? creaTocco(telaMateria) : null
    const stile = getComputedStyle(pa)
    const coloreDi = (el: Element) => getComputedStyle(el).getPropertyValue('--accento-blocco').trim() || stile.getPropertyValue('--blu').trim() || '#5b8cff'

    const aggiornaFrasi = (u: number) => {
      for (const q of frasi) {
        const s = statoFrase(q, u)
        const o = Math.round(s.o * 100) / 100
        if (o !== q.o) {
          q.el.style.opacity = String(o)
          q.el.style.visibility = o > 0 ? 'visible' : 'hidden'
          q.el.dataset.attivo = o > 0.5 ? 'true' : 'false'
          q.o = o
        }
        const y = Math.round(s.y * 10) / 10 + 0
        const t = o > 0 && y !== 0 ? `translate3d(0, ${y}px, 0)` : ''
        const f = o > 0 && s.sfoca > 0.05 ? `blur(${s.sfoca.toFixed(1)}px)` : ''
        const chiave = `${t}|${f}`
        if (chiave !== q.t) {
          q.el.style.transform = t
          q.el.style.filter = f
          q.t = chiave
        }
      }
    }
    const accenti = Array.from(pa.querySelectorAll<HTMLElement>('.battuta .accento')).map((el) => ({
      el, q: frasi.find((f) => f.el === el.closest('.battuta'))!, colore: coloreDi(el), stato: 'no' as 'no' | 'volo' | 'si',
    })).filter((a) => a.q)
    const aggiornaMateria = () => {
      for (const a of accenti) {
        if (a.q.o >= 0.999 && a.stato === 'no') {
          const subito = livello === 'minimo' || !mondo || !tocco
          if (subito) {
            a.el.classList.add('toccata')
            a.stato = 'si'
          } else {
            a.stato = 'volo'
            const origine = mondo?.fuocoSchermo() ?? [window.innerWidth / 2, window.innerHeight * 0.4]
            tocco.tocca(origine, a.el, a.colore, livello === 'alto' ? 36 : 24, () => {
              if (a.stato !== 'volo') return
              a.el.classList.add('toccata')
              a.stato = 'si'
            })
          }
        } else if (a.q.o <= 0.001 && a.stato !== 'no') {
          a.el.classList.remove('toccata')
          a.stato = 'no'
        }
      }
    }

    /* ----- gli spazi che le sezioni offrono alla mascotte e alla scena; la sezione che sta al centro dello schermo decide il «modo» ----- */
    const ancore = Array.from(document.querySelectorAll<HTMLElement>('[data-ancora]'))
    const scene = Array.from(document.querySelectorAll<HTMLElement>('[data-scena]'))
    const sezioni = Array.from(document.querySelectorAll<HTMLElement>('[data-modo]'))
    const misuraAncora = (el: HTMLElement): Ancora | null => {
      const r = el.getBoundingClientRect()
      if (r.width < 4 || r.height < 4 || r.bottom < 0 || r.top > window.innerHeight) return null
      const k = Number(el.dataset.scala ?? 1)
      return { x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight, altezza: (r.height / window.innerHeight) * k }
    }
    const primaAncora = (lista: HTMLElement[], modo?: string): Ancora | null => {
      for (const el of lista) {
        if (modo && el.dataset.ancora !== modo && el.dataset.scena !== modo) continue
        const a = misuraAncora(el)
        if (a) return a
      }
      return null
    }
    const stato: StatoPagina = { modo: 'quiete', ancora: null, ancoraScena: null, scelta: 0, dallaScelta: 99, dallInvito: 0, fermo: false, dopo: 0 }
    let tScelta = -1e9
    let tInvito = -1
    const allaScelta = (e: Event) => {
      const i = (e as CustomEvent<{ indice: number }>).detail?.indice ?? 0
      stato.scelta = i
      tScelta = performance.now()
      mondo?.gesto((GESTO_SCELTA[dati.mascotte] ?? GESTO_SCELTA.atlas)(i))
    }
    window.addEventListener('pagina:scelta', allaScelta)
    const aggiornaSezioni = (u: number) => {
      stato.fermo = html.classList.contains('fermo')
      stato.dopo = Math.max(0, (window.scrollY - (inizio + corsa)) / window.innerHeight)
      if (u < percorso.lunghezza - 0.05) {
        stato.modo = 'quiete'
        stato.ancora = null
        stato.ancoraScena = null
        return
      }
      const centro = window.innerHeight * 0.55
      let modo: ModoPagina = 'quiete'
      for (const s of sezioni) {
        const r = s.getBoundingClientRect()
        if (r.top <= centro && r.bottom >= centro) modo = (s.dataset.modo as ModoPagina) ?? 'quiete'
      }
      if (modo === 'invito' && stato.modo !== 'invito') tInvito = performance.now()
      if (modo !== 'invito') tInvito = -1
      stato.modo = modo
      stato.ancora = modo === 'quiete' || modo === 'tappe' && window.innerWidth < 901 ? null : primaAncora(ancore, modo)
      stato.ancoraScena = primaAncora(scene, modo) ?? stato.ancora
      stato.dallaScelta = (performance.now() - tScelta) / 1000
      stato.dallInvito = tInvito < 0 ? 0 : (performance.now() - tInvito) / 1000
    }

    /* ----- testata e nome ----- */
    let bloccoPrima = ''
    const aggiornaTestata = (u: number) => {
      const bl = percorso.blocchi[bloccoAl(percorso, Math.min(u, L))]
      if (bl.id !== bloccoPrima) {
        bloccoPrima = bl.id
        html.dataset.blocco = `pagina-${bl.id.slice(bl.id.lastIndexOf('-') + 1)}`
        const m = /^(\d\d) · (.+)$/.exec(bl.etichetta)
        if (indiceNum) indiceNum.textContent = m ? m[1] : ''
        if (indiceNome) indiceNome.textContent = m ? m[2] : bl.etichetta
      }
      barraBlu?.style.setProperty('--p', clamp(u / L, 0, 1).toFixed(3))
      html.classList.toggle('in-orbita', window.scrollY > inizio + corsa + window.innerHeight * 0.3)
      html.classList.toggle('dopo-film', u >= L - 0.05)
      const p = mondo?.piedi()
      if (nomeEl && p) {
        const o = Math.round(p.luce * 100) / 100
        nomeEl.style.opacity = String(o)
        if (o > 0) nomeEl.style.transform = `translate3d(${p.x.toFixed(1)}px, ${(p.y + 10).toFixed(1)}px, 0) translate(-50%, 0)`
      }
    }

    /* ----- il mondo, caricato quando il browser è libero ----- */
    let mondo: MondoPagina | null = null
    let chiuso = false
    const livelloChiesto = new URLSearchParams(window.location.search).get('livello')
    const forzato = livelloChiesto === 'alto' || livelloChiesto === 'medio' || livelloChiesto === 'minimo' ? livelloChiesto : null
    let livello = forzato ?? livelloIniziale({ ritratto: window.innerWidth / window.innerHeight < 1, larghezza: window.innerWidth })
    const campioni: number[] = []
    let misurato = forzato !== null
    const t0 = performance.now()

    const passaAllaPagina = () => {
      ferma()
      mondo?.distruggi()
      mondo = null
      for (const q of frasi) {
        q.el.style.opacity = ''
        q.el.style.visibility = ''
        q.el.style.transform = ''
        q.el.style.filter = ''
      }
      tocco?.svuota()
      for (const a of accenti) a.el.classList.remove('toccata')
      html.classList.remove('varco', 'in-orbita', 'dopo-film')
    }
    const carica = () => {
      Promise.all([import('./mondo/pagina'), import('./regie/pagine/indice.ts')])
        .then(([{ creaMondoPagina }, { REGIE_PAGINE }]) => {
          if (chiuso) return
          try {
            mondo = creaMondoPagina(contenitore, { percorso, mascotte: dati.mascotte, materia: dati.materia, regie: REGIE_PAGINE[dati.id], livello, onPerso: passaAllaPagina })
            contenitore.dataset.pronto = 'true'
            avvia()
          } catch (e) {
            console.error('varco: mondo di pagina non creato:', e)
            passaAllaPagina()
          }
        })
        .catch(passaAllaPagina)
    }
    const conIdle = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void }
    const attesa = conIdle.requestIdleCallback ? conIdle.requestIdleCallback(carica, { timeout: 1500 }) : window.setTimeout(carica, 600)

    /* ----- il ciclo ----- */
    let raf = 0
    let ultimo = performance.now()
    let uLiscio = -1
    let uPrima = -1
    let scrollPrima = window.scrollY
    let fermi = 0
    let inVista = true
    const fotogramma = (ora: number) => {
      raf = 0
      const dt = Math.min(0.1, (ora - ultimo) / 1000)
      const msFotogramma = ora - ultimo
      ultimo = ora
      const scrollTotale = window.scrollY
      // la u del film si ferma alla lunghezza; più giù contano solo le sezioni
      const obiettivo = uCorrente()
      if (uLiscio < 0) uLiscio = obiettivo
      uLiscio += (obiettivo - uLiscio) * (1 - Math.exp(-dt * INERZIA))
      if (Math.abs(obiettivo - uLiscio) < 0.002) uLiscio = obiettivo
      const dopoFilm = scrollTotale > inizio + corsa - 2
      const uMondo = dopoFilm ? Math.max(uLiscio, L) : uLiscio
      if (inVista || dopoFilm) {
        aggiornaFrasi(uLiscio)
        aggiornaMateria()
      }
      aggiornaSezioni(uMondo)
      aggiornaTestata(uMondo)
      if (mondo) {
        const inMoto = Math.abs(uLiscio - uPrima) > 0.0004 || Math.abs(scrollTotale - scrollPrima) > 0.5
        scrollPrima = scrollTotale
        fermi = inMoto ? 0 : fermi + 1
        if (!misurato && inMoto && ora - t0 > 2000) {
          campioni.push(msFotogramma)
          if (campioni.length >= 120) {
            misurato = true
            const nuovo = livelloDopoMisura(livello, campioni)
            if (nuovo !== livello) {
              livello = nuovo
              mondo.impostaLivello(nuovo)
            }
          }
        }
        // sempre fluido finché c'è qualcosa che si muove; da fermi, dopo un secondo, 30 al secondo
        const pieno = fermi < 60
        if (pieno || fermi % 2 === 0) {
          const vivo = mondo.aggiorna(uMondo, Math.min(0.1, dt), ora / 1000, stato)
          if (vivo) fermi = 0
        }
      }
      uPrima = uLiscio
      if (!document.hidden) raf = requestAnimationFrame(fotogramma)
    }
    const avvia = () => {
      if (!raf && !document.hidden && html.classList.contains('varco')) raf = requestAnimationFrame(fotogramma)
    }
    const ferma = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    }
    // fuori dallo schermo il film non serve: il ciclo continua solo se il mondo ha da disegnare (sezioni normali con la mascotte)
    const osservatore = new IntersectionObserver(([voce]) => { inVista = voce.isIntersecting; avvia() }, { rootMargin: '10% 0px 10% 0px' })
    osservatore.observe(tr)
    const alloScroll = () => avvia()
    const alRidimensionamento = () => {
      misura()
      tocco?.ridimensiona()
      mondo?.ridimensiona()
      avvia()
    }
    const allaVisibilita = () => (document.hidden ? ferma() : avvia())
    const alPuntatore = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && livello !== 'minimo' && tocco) tocco.scia(e.clientX, e.clientY, coloreDi(pa))
      mondo?.puntatore((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1, e.pointerType === 'mouse' ? 'mouse' : 'touch')
    }
    const alClic = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null
      const id = a?.getAttribute('href')?.slice(1)
      const el = id ? document.getElementById(id) : null
      if (!a || !el) return
      e.preventDefault()
      el.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
      history.replaceState(null, '', `#${id}`)
    }
    const alFermo = () => avvia()
    window.addEventListener('scroll', alloScroll, { passive: true })
    window.addEventListener('resize', alRidimensionamento)
    window.addEventListener('pointermove', alPuntatore, { passive: true })
    window.addEventListener('pagina:fermo', alFermo)
    document.addEventListener('visibilitychange', allaVisibilita)
    document.addEventListener('click', alClic, true)
    aggiornaFrasi(uIniziale !== null ? Math.min(uIniziale, L) : uCorrente())
    aggiornaTestata(uIniziale !== null ? Math.min(uIniziale, L) : uCorrente())
    avvia()

    return () => {
      chiuso = true
      ferma()
      if (conIdle.cancelIdleCallback) conIdle.cancelIdleCallback(attesa)
      else window.clearTimeout(attesa)
      osservatore.disconnect()
      window.removeEventListener('scroll', alloScroll)
      window.removeEventListener('resize', alRidimensionamento)
      window.removeEventListener('pointermove', alPuntatore)
      window.removeEventListener('pagina:fermo', alFermo)
      window.removeEventListener('pagina:scelta', allaScelta)
      document.removeEventListener('visibilitychange', allaVisibilita)
      document.removeEventListener('click', alClic, true)
      tocco?.dispose()
      for (const a of accenti) a.el.classList.remove('toccata')
      mondo?.distruggi()
    }
  }, [percorso, dati])

  return (
    <>
      <div ref={tela} className="varco-tela solo-varco" aria-hidden="true" />

      <section className="varco pagina-film" aria-label="Il film della pagina" data-pagina={dati.id}>
        <div ref={traccia} className="varco-traccia" style={{ ['--lunghezza' as string]: percorso.lunghezza }}>
          <div ref={palco} className="varco-palco" data-materia={dati.materia}>
            <Testata corrente={corrente} />
            <picture className="varco-poster">
              <source media="(min-width: 901px)" srcSet={dati.poster.src1080} />
              <img src={dati.poster.src720} alt={dati.poster.alt} width={720} height={1280} decoding="async" fetchPriority="high" />
            </picture>
            <canvas className="tela-materia" aria-hidden="true" />
            <div className="pagina-fascia">
              {percorso.blocchi.map((bl) => <VoceBlocco key={bl.id} bl={bl} />)}
            </div>
            {/* le due cartoline dell'apertura: come in home, volano accanto alla mascotte una alla volta */}
            <div className="cartoline-strato solo-varco">
              {percorso.blocchi.filter((bl) => bl.id.endsWith('-a')).map((bl) => (
                <div className="blocco" key={bl.id} data-id={bl.id}>
                  {bl.battute.filter((b) => b.tipo === 'foto').map((b) => <Voce key={b.ruolo} b={b} />)}
                </div>
              ))}
            </div>
            <div className="nomi-mascotte solo-varco" aria-hidden="true">
              <span className="nome-mascotte" data-mascotte={dati.mascotte}>{nome}</span>
            </div>
          </div>
        </div>
      </section>

      {children}
    </>
  )
}

