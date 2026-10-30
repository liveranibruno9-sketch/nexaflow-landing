'use client'

import { Fragment, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import Testata from '../film/Testata'
import type { Servizio } from '../film/dati/contatti'
import { bloccoAl, conSoggetto, statoFrase, trattiDaTenere } from './percorso.ts'
import { livelloDopoMisura, livelloIniziale } from './livello.ts'
import { posizioneAccento } from './testo.ts'
import { creaTocco } from './tocco.ts'
import { letteraVisibile } from '../film/materia-calcoli.ts'
import type { Battuta, Blocco, Percorso } from './tipi.ts'
import type { Mondo } from './mondo/mondo'

/**
 * Il varco.
 *
 * Una "traccia" alta (lunghezza + 1) schermate contiene un palco sticky a tutto schermo. Scorrendo la traccia si avanza
 * nel percorso: `u` sono le schermate percorse. Sul palco stanno le battute (frasi, nomi, motti, collegamenti), ognuna
 * con la sua finestra [data-da, data-a]; dietro, fisso, il canvas del mondo Three.js, che legge la stessa `u`.
 *
 * Due modi, decisi PRIMA del primo disegno da uno script nel layout (SCELTA_VARCO in livello.ts):
 * - html.varco: il varco completo
 * - senza classe: pagina normale, poster e testi in colonna sul nero, le immagini delle creature. Vale senza
 *   JavaScript, con "movimento ridotto", senza WebGL2, sui telefoni più vecchi e dove la grafica è solo software.
 * Tutto il testo è HTML vero in entrambi i modi: Google e gli screen reader lo leggono per intero.
 */

/** la scia del cursore, prima leva di R12 se il peso non regge (solo mouse) */
const SCIA = true
const INERZIA = 3.2 // più basso = più morbido e più lento a fermarsi (come i dentisti)

const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x))
const liscia = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}

type Props = {
  percorso: Percorso
  h1: string
  corrente: 'home' | Servizio
  poster: { src720: string; src1080: string; alt: string }
  children?: ReactNode
}

/** il testo con la parola d'accento in <em class="accento"> (la prima occorrenza come parola intera) */
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

function VoceBattuta({ b, apertura }: { b: Battuta; apertura: boolean }) {
  const dati = { 'data-da': b.da, 'data-a': b.a, 'data-ruolo': b.ruolo }
  const classe = `battuta battuta-${b.tipo}`
  switch (b.tipo) {
    case 'link':
      return <a className={classe} href={b.href} {...dati}>{b.testo}</a>
    case 'cartolina':
      return (
        <a className={`${classe} cartolina`} href={b.href} {...dati}>
          <span>{b.testo}</span>
          {b.nota ? <span className="cartolina-nota">{b.nota}</span> : null}
        </a>
      )
    case 'pulsante':
      return (
        <div className={classe} {...dati}>
          <a className="pulsante" href={b.href}>{b.testo}</a>
          {b.nota ? <p className="pulsante-sotto">{b.nota}</p> : null}
        </div>
      )
    case 'scorri':
      return <p className={`${classe} scorri`} {...dati}><span className="scorri-linea" aria-hidden="true" />{b.testo}</p>
    case 'nome':
      // il nome dell'apertura è decorativo (l'H1 è la riga piccola); quello di una creatura è un titolo vero
      return apertura
        ? <p className={`${classe} nome-apertura`} aria-hidden="true" data-nascosto="si" {...dati}><span>{b.testo}</span></p>
        : <p className={classe} style={{ ['--lettere' as string]: b.testo.length }} {...dati}>{b.testo}</p>
    case 'etichetta':
      if (b.ruolo === 'servizi') {
        const materie = ['polvere', 'vetro', 'saette', 'cromo']
        return (
          <p className={classe} {...dati}>
            {b.testo.split(' · ').map((parola, i) => (
              <Fragment key={parola}>
                {i > 0 ? ' · ' : null}
                <span className="servizio-parola" data-materia={materie[i]}>{parola}</span>
              </Fragment>
            ))}
          </p>
        )
      }
      return <p className={classe} {...dati}>{b.testo}</p>
    case 'motto':
      // le lettere si scrivono con lo scroll (Varco le accende); il motto intero resta per chi usa un lettore di schermo
      return (
        <p className={classe} {...dati}>
          <span className="solo-lettore">{b.testo}</span>
          <span aria-hidden="true">{Array.from(b.testo).map((c, i) => <span className="lettera scritta" key={i}>{c}</span>)}</span>
        </p>
      )
    case 'foto':
      return (
        <figure className={classe} {...dati}>
          <span className="cartolina-carta"><img src={b.src} alt={b.testo} width={560} height={700} loading="lazy" decoding="async" /></span>
        </figure>
      )
    case 'titolo':
      return <h2 className={classe} {...dati}>{conAccento(b.testo, b.accento)}</h2>
    case 'paragrafo':
      return <p className={classe} {...dati}>{conAccento(b.testo, b.accento)}</p>
    case 'passo':
      return (
        <div className={classe} {...dati}>
          <p className="passo-etichetta">{b.testo}</p>
          {b.nota ? <p className="passo-riga">{b.nota}</p> : null}
        </div>
      )
    default:
      return <p className={classe} {...dati}>{conAccento(b.testo, b.accento)}</p>
  }
}

/**
 * La grafica del finale (D45): un campo di attività nel buio e un riflettore che ne tiene poche alla volta. Con «Seguiamo poche
 * attività alla volta.» quattro punti delle quattro materie entrano nella luce; con «La prossima può essere la tua.» compare il
 * posto libero, che pulsa sopra il pulsante. Nessun nome di cliente: è una metafora, non un elenco.
 */
const CAMPO = Array.from({ length: 30 }, (_, i) => {
  const a = i * 2.39996
  const r = 58 + ((i * 37) % 34)
  return { x: Math.cos(a) * r, y: Math.sin(a) * r * 0.82, d: (i % 5) * 0.4 }
})
const DENTRO: { x: number; y: number; da: [number, number]; m: string }[] = [
  { x: -22, y: -14, da: [-78, -40], m: 'polvere' },
  { x: 20, y: -18, da: [82, -52], m: 'vetro' },
  { x: -26, y: 14, da: [-90, 46], m: 'saette' },
  { x: 24, y: 12, da: [76, 60], m: 'cromo' },
]
function GraficaPosti() {
  return (
    <div className="posti-strato solo-varco" aria-hidden="true">
      <svg viewBox="-100 -100 200 200" className="posti">
        <defs>
          <radialGradient id="riflettore">
            <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
            <stop offset="0.7" stopColor="#9fb8ff" stopOpacity="0.06" />
            <stop offset="1" stopColor="#9fb8ff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="quattro" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--polvere)" />
            <stop offset="0.35" stopColor="var(--vetro)" />
            <stop offset="0.7" stopColor="var(--saette-viola)" />
            <stop offset="1" stopColor="var(--cromo)" />
          </linearGradient>
        </defs>
        {CAMPO.map((p, i) => <circle key={i} className="posti-campo" cx={p.x} cy={p.y} r={2.2} style={{ animationDelay: `${p.d}s` }} />)}
        <circle className="posti-luce" r={56} fill="url(#riflettore)" />
        <circle className="posti-bordo" r={56} />
        {DENTRO.map((p, i) => (
          <g key={p.m} className="posti-dentro" style={{ ['--da-x' as string]: `${p.da[0] - p.x}px`, ['--da-y' as string]: `${p.da[1] - p.y}px`, transitionDelay: `${0.12 * i}s` }}>
            <circle cx={p.x} cy={p.y} r={6} className="posti-punto" style={{ fill: `var(--${p.m === 'saette' ? 'saette-viola' : p.m})` }} />
          </g>
        ))}
        <g className="posti-tuo">
          <circle className="posti-onda" cx={0} cy={30} r={11} />
          <circle className="posti-libero" cx={0} cy={30} r={10.5} />
          <circle className="posti-pieno" cx={0} cy={30} r={8.5} fill="url(#quattro)" />
        </g>
      </svg>
    </div>
  )
}

/** le immagini della pagina normale: la creatura (X-2) e il beneficio (X-3), con la sfumatura nel nero */
function Immagine({ nome, alt }: { nome: string; alt: string }) {
  return (
    <div className="solo-statico statico-immagine">
      <img
        src={`/film/scene/${nome}-720.webp`}
        srcSet={`/film/scene/${nome}-720.webp 720w, /film/scene/${nome}-1080.webp 1080w`}
        sizes="(min-width: 901px) 520px, 100vw"
        width={720}
        height={1280}
        alt={alt}
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}

function VoceBlocco({ bl, h1 }: { bl: Blocco; h1: string }) {
  if (bl.tipo === 'apertura') {
    // il nome sta nel cerchio; sotto l'apertura passa il banner (chi siamo = l'H1, cosa facciamo, dove siamo, D45); `Scorri` in basso
    const di = (ruolo: string) => bl.battute.find((b) => b.ruolo === ruolo)!
    return (
      <div className="blocco" data-id={bl.id} data-tipo={bl.tipo}>
        <VoceBattuta b={di('nome')} apertura />
        <div className="apertura-banner">
          <div className="banner-voce">
            <p className="banner-etichetta">Chi siamo</p>
            <h1 className="banner-h1">{h1}</h1>
          </div>
          <div className="banner-voce">
            <p className="banner-etichetta">Cosa facciamo</p>
            <VoceBattuta b={di('servizi')} apertura />
          </div>
          <div className="banner-voce">
            <p className="banner-etichetta">Dove siamo</p>
            <VoceBattuta b={di('luogo')} apertura />
          </div>
        </div>
        <VoceBattuta b={di('scorri')} apertura />
      </div>
    )
  }
  const mascotte = (bl.immagini ?? [])[0]
  return (
    <div className="blocco" data-id={bl.id} data-tipo={bl.tipo} data-materia={bl.materia}>
      {bl.tipo !== 'intro' ? <p className="solo-statico etichetta-blocco">{bl.etichetta}</p> : null}
      {bl.tipo === 'squadra' ? (
        <div className="solo-statico statico-squadra">
          {(bl.immagini ?? []).map((nome) => <Immagine nome={nome} alt="" key={nome} />)}
        </div>
      ) : null}
      {bl.battute.map((b) => b.tipo === 'foto' ? (
        <figure className="solo-statico statico-cartolina" key={b.ruolo}><img src={b.src} alt={b.testo} width={560} height={700} loading="lazy" decoding="async" /></figure>
      ) : (
        <Fragment key={b.ruolo}>
          {bl.tipo === 'tratto' && b.ruolo === 'nome' ? <Immagine nome={`${bl.id}-2`} alt={`${b.testo}, la creatura di ${bl.etichetta.replace(/^\d+ · /, '')}`} /> : null}
          {bl.tipo === 'tratto' && b.ruolo === 'beneficio-1' ? <Immagine nome={`${bl.id}-3`} alt="" /> : null}
          <VoceBattuta b={b} apertura={false} />
          {bl.tipo === 'mascotte' && b.ruolo === 'titolo' && mascotte ? <Immagine nome={mascotte} alt={`La mascotte di ${b.testo.toLowerCase()}`} /> : null}
        </Fragment>
      ))}
    </div>
  )
}

export default function Varco({ percorso, h1, corrente, poster, children }: Props) {
  const traccia = useRef<HTMLDivElement>(null)
  const palco = useRef<HTMLDivElement>(null)
  const tela = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const html = document.documentElement
    const tr = traccia.current
    const pa = palco.current
    const contenitore = tela.current
    // pagina normale (senza il mondo): le parole d'accento sono già toccate, nessuna particella
    if (!html.classList.contains('varco') && pa) pa.querySelectorAll('.accento').forEach((e) => e.classList.add('toccata'))
    if (!html.classList.contains('varco') || !tr || !pa || !contenitore) return

    const L = percorso.lunghezza
    const frasi = Array.from(pa.querySelectorAll<HTMLElement>('.battuta')).map((el) => {
      const a = Number(el.dataset.a)
      // una battuta che arriva alla fine del percorso (il pulsante del finale) resta accesa: niente uscita sull'ultimo tratto
      return { el, da: Number(el.dataset.da), a: a >= L ? L + 1 : a, o: -1, t: '' }
    })
    const indiceNum = pa.querySelector<HTMLElement>('.indice-num')
    const indiceNome = pa.querySelector<HTMLElement>('.indice-nome')
    const barraBlu = pa.querySelector<HTMLElement>('[data-seg="blu"]')
    const segmenti = Array.from(pa.querySelectorAll<HTMLElement>('.seg'))
    const tratti = percorso.blocchi.filter(conSoggetto)
    const primoTratto = tratti[0]
    // la barra della testata si divide nei quattro colori all'1.9 della soglia («Quattro agenti. Uno studio.»)
    const battuteSoglia = percorso.blocchi.find((b) => b.tipo === 'soglia')?.battute ?? []
    // la barra della testata si divide nei quattro colori con l'ultima frase della soglia
    const porteDa = battuteSoglia.length ? battuteSoglia[battuteSoglia.length - 1].da : primoTratto ? primoTratto.da - 1.4 : Infinity

    /* ----- misure: dove sta la traccia e quanto si scorre ----- */
    let inizio = 0
    let corsa = 1
    let altezzaVista = window.innerHeight
    const misura = () => {
      altezzaVista = window.innerHeight
      const r = tr.getBoundingClientRect()
      inizio = r.top + window.scrollY
      corsa = Math.max(1, tr.offsetHeight - pa.offsetHeight)
    }
    misura()
    const uCorrente = () => clamp((window.scrollY - inizio) / corsa, 0, 1) * L
    const yDi = (u: number) => inizio + (u / L) * corsa

    // ?u=<schermate> porta subito a quel punto, senza inerzia (per le catture e per i link)
    const uChiesta = new URLSearchParams(window.location.search).get('u')
    const uIniziale = uChiesta !== null && Number.isFinite(Number(uChiesta)) ? clamp(Number(uChiesta), 0, L) : null
    if (uIniziale !== null) window.scrollTo({ top: yDi(uIniziale), behavior: 'instant' })

    /* ----- la materia sopra le frasi: il tocco della parola d'accento, i motti scritti, la scia del cursore ----- */
    const telaMateria = pa.querySelector<HTMLCanvasElement>('.tela-materia')
    const tocco = telaMateria ? creaTocco(telaMateria) : null
    const stile = getComputedStyle(pa)
    const coloreDi = (el: Element) => getComputedStyle(el).getPropertyValue('--accento-blocco').trim() || stile.getPropertyValue('--blu').trim() || '#5b8cff'
    const coloriMateria: Record<string, string> = {}
    for (const m of ['polvere', 'vetro', 'saette', 'cromo']) coloriMateria[m] = stile.getPropertyValue(`--${m}`).trim() || '#ffffff'
    const conScia = window.matchMedia('(pointer: fine)').matches && SCIA
    const motti = Array.from(pa.querySelectorAll<HTMLElement>('.battuta-motto')).map((el) => ({
      el, lettere: Array.from(el.querySelectorAll<HTMLElement>('.lettera')), n: -1, da: Number(el.dataset.da), a: Number(el.dataset.a),
    }))
    for (const m of motti) m.el.classList.add('materia-accesa')
    /* ----- le battute: opacità, salita e sfocatura dalla stessa u ----- */
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
    const aggiornaMateria = (u: number) => {
      // il tocco: quando la frase è piena le particelle partono dall'àncora della scena e arrivano sulla parola, che prende il colore
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
          // tornando indietro la parola torna perla e si ritocca al passaggio dopo
          a.el.classList.remove('toccata')
          a.stato = 'no'
        }
      }
      // i motti: le lettere si scrivono sulla prima metà abbondante della finestra
      for (const m of motti) {
        const t = clamp((u - m.da) / (0.6 * (m.a - m.da)), 0, 1)
        const n = livello === 'minimo' ? m.lettere.length : letteraVisibile(m.lettere.length, t)
        if (n === m.n) continue
        m.lettere.forEach((l, i) => l.classList.toggle('scritta', i < n))
        m.n = n
      }
    }

    /* ----- testata: indice, barra di avanzamento; stato della pagina ----- */
    let bloccoPrima = ''
    let trattiPrima = ''
    const aggiornaTestata = (u: number) => {
      const bl = percorso.blocchi[bloccoAl(percorso, u)]
      if (bl.id !== bloccoPrima) {
        bloccoPrima = bl.id
        html.dataset.blocco = bl.tipo
        const m = /^(\d\d) · (.+)$/.exec(bl.etichetta)
        if (indiceNum) indiceNum.textContent = m ? m[1] : ''
        if (indiceNome) indiceNome.textContent = m ? m[2] : bl.etichetta
      }
      const porte = u >= porteDa
      html.classList.toggle('porte', porte)
      barraBlu?.style.setProperty('--p', (primoTratto && corrente === 'home' ? clamp(u / primoTratto.da, 0, 1) : clamp(u / L, 0, 1)).toFixed(3))
      if (porte) segmenti.forEach((s, i) => { const t = tratti[i]; if (t) s.style.setProperty('--p', clamp((u - t.da) / (t.a - t.da), 0, 1).toFixed(3)) })
      const tieni = trattiDaTenere(percorso, u).join(',')
      if (tieni !== trattiPrima) {
        trattiPrima = tieni
        html.dataset.tratti = tieni
      }
      html.classList.toggle('in-orbita', window.scrollY > inizio + corsa + window.innerHeight * 0.3)
      // D45: l'apertura nasce dal nulla (un punto, poi il big bang): il poster del cerchio torna solo se l'anello non c'è
      const senzaAnello = senzaMondo || (mondo?.anelloFallito() ?? false)
      pa.style.setProperty('--poster', senzaAnello ? (1 - liscia(0.25, 0.9, u)).toFixed(3) : '0')
      pa.style.setProperty('--puntino', mondo?.anelloPronto() || senzaAnello ? '0' : '1')
      // il banner passa come una fascia di pagina, un po' più veloce dello scroll
      if (banner && bandaDa !== null) {
        const y = (1 - 1.3 * (u - bandaDa)) * altezzaVista
        const dentro = y < altezzaVista && y > -banner.offsetHeight
        banner.style.visibility = dentro ? 'visible' : 'hidden'
        if (dentro) banner.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`
      }
      const fase = finale && u >= finale.da ? (u >= finale.due ? '2' : u >= finale.uno ? '1' : '0') : '0'
      if (fase !== pa.dataset.posti) pa.dataset.posti = fase
      // il nome HTML compare sotto le lettere di particelle quando sono complete, e sparisce quando tornano nell'anello (D38)
      const formato = mondo ? mondo.nomeFormato() : senzaMondo
      if (formato !== nomeVisibile) {
        nomeVisibile = formato
        if (formato) nomeHtml?.removeAttribute('data-nascosto')
        else nomeHtml?.setAttribute('data-nascosto', 'si')
      }
      // le parole dei servizi: quella dell'arco che passa in alto prende il colore della sua materia
      const alto = mondo && bandaDa !== null && u < bandaDa + 1.3 ? mondo.arcoInAlto() : null
      if (alto !== acceso) {
        acceso = alto
        for (const w of paroleServizi) w.dataset.acceso = String(w.dataset.materia === alto)
      }
    }

    /* ----- l'apertura: il nome HTML segue le lettere di particelle (mondo.nomeFormato); senza mondo dopo 8 s compare comunque ----- */
    const nomeHtml = pa.querySelector<HTMLElement>('.nome-apertura')
    const banner = pa.querySelector<HTMLElement>('.apertura-banner')
    const bandaDa = percorso.blocchi[0]?.battute.find((b) => b.ruolo === 'servizi')?.da ?? null
    const bloccoFinale = percorso.blocchi.find((b) => b.tipo === 'finale')
    const finale = bloccoFinale ? { da: bloccoFinale.da, uno: bloccoFinale.battute.find((b) => b.ruolo === '1')?.da ?? Infinity, due: bloccoFinale.battute.find((b) => b.ruolo === '2')?.da ?? Infinity } : null
    const paroleServizi = Array.from(pa.querySelectorAll<HTMLElement>('.servizio-parola'))
    let acceso: string | null = null
    let nomeVisibile = false
    let senzaMondo = false
    const salvagente = window.setTimeout(() => { if (!mondo) senzaMondo = true }, 8000)

    /* ----- il mondo, caricato quando il browser è libero ----- */
    let mondo: Mondo | null = null
    let chiuso = false
    // ?livello=alto|medio|minimo forza il livello e spegne la misura adattiva (per provare R12 e per le catture)
    const livelloChiesto = new URLSearchParams(window.location.search).get('livello')
    const forzato = livelloChiesto === 'alto' || livelloChiesto === 'medio' || livelloChiesto === 'minimo' ? livelloChiesto : null
    let livello = forzato ?? livelloIniziale({ ritratto: window.innerWidth / window.innerHeight < 1, larghezza: window.innerWidth })
    const campioni: number[] = []
    let misurato = forzato !== null
    const t0 = performance.now()

    const passaAllaPagina = () => {
      // qualcosa non va con la grafica: si torna alla pagina normale
      ferma()
      mondo?.distruggi()
      mondo = null
      for (const q of frasi) {
        q.el.style.opacity = ''
        q.el.style.visibility = ''
        q.el.style.transform = ''
        q.el.style.filter = ''
      }
      pa.style.removeProperty('--poster')
      tocco?.svuota()
      for (const a of accenti) a.el.classList.remove('toccata')
      for (const m of motti) { m.el.classList.remove('materia-accesa'); m.lettere.forEach((l) => l.classList.add('scritta')) }
      nomeHtml?.removeAttribute('data-nascosto')
      delete html.dataset.tratti
      html.classList.remove('varco', 'in-orbita', 'porte')
    }

    const carica = () => {
      Promise.all([import('./mondo/mondo'), import('./regie/indice.ts')])
        .then(([{ creaMondo }, { REGIE }]) => {
          if (chiuso) return
          try {
            mondo = creaMondo(contenitore, { percorso, livello, regie: REGIE, onPerso: passaAllaPagina })
            contenitore.dataset.pronto = 'true'
            avvia()
          } catch {
            passaAllaPagina()
          }
        })
        .catch(passaAllaPagina)
    }
    const conIdle = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void }
    const attesa = conIdle.requestIdleCallback ? conIdle.requestIdleCallback(carica, { timeout: 1800 }) : window.setTimeout(carica, 700)

    /* ----- il ciclo: testi e mondo seguono la stessa posizione morbida ----- */
    let raf = 0
    let inVista = true
    let ultimo = performance.now()
    let ultimoMondo = ultimo
    let uLiscio = -1
    let uPrima = -1
    let fermi = 0
    const fotogramma = (ora: number) => {
      raf = 0
      const dt = Math.min(0.1, (ora - ultimo) / 1000)
      const msFotogramma = ora - ultimo
      ultimo = ora
      const obiettivo = uCorrente()
      if (uLiscio < 0) uLiscio = obiettivo
      uLiscio += (obiettivo - uLiscio) * (1 - Math.exp(-dt * INERZIA))
      if (Math.abs(obiettivo - uLiscio) < 0.002) uLiscio = obiettivo
      if (inVista) {
        aggiornaFrasi(uLiscio)
        aggiornaMateria(uLiscio)
        aggiornaTestata(uLiscio)
      }

      if (mondo) {
        const inMoto = Math.abs(uLiscio - uPrima) > 0.0004
        fermi = inMoto ? 0 : fermi + 1
        // misura dei tempi di fotogramma in moto: 120 valori dopo i primi 2 secondi
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
        // piena fluidità mentre ci si muove; da fermi (dopo un secondo) o in orbita, 30 al secondo
        const pieno = inVista && fermi < 60
        if (pieno || fermi % 2 === 0) {
          const vivo = mondo.aggiorna(uLiscio, Math.min(0.1, (ora - ultimoMondo) / 1000), ora / 1000)
          ultimoMondo = ora
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

    const osservatore = new IntersectionObserver(
      ([voce]) => {
        inVista = voce.isIntersecting
        if (!inVista) aggiornaTestata(uCorrente())
        avvia()
      },
      { rootMargin: '10% 0px 10% 0px' },
    )
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
      if (conScia && tocco && e.pointerType === 'mouse' && livello !== 'minimo') tocco.scia(e.clientX, e.clientY, coloriMateria[percorso.blocchi[bloccoAl(percorso, uLiscio)].materia ?? ''] ?? stile.getPropertyValue('--blu').trim())
      mondo?.puntatore((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1, e.pointerType === 'mouse' ? 'mouse' : 'touch')
    }

    // ancore #…: scorrimento morbido fino all'elemento (il modulo sta sotto la traccia)
    const alClic = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null
      const id = a?.getAttribute('href')?.slice(1)
      const el = id ? document.getElementById(id) : null
      if (!a || !el) return
      e.preventDefault()
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      history.replaceState(null, '', `#${id}`)
    }

    window.addEventListener('scroll', alloScroll, { passive: true })
    window.addEventListener('resize', alRidimensionamento)
    window.addEventListener('pointermove', alPuntatore, { passive: true })
    document.addEventListener('visibilitychange', allaVisibilita)
    document.addEventListener('click', alClic, true)
    // il primo disegno è già lo stato di u: nessun salto quando parte il ciclo
    aggiornaFrasi(uIniziale ?? uCorrente())
    aggiornaMateria(uIniziale ?? uCorrente())
    aggiornaTestata(uIniziale ?? uCorrente())
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
      document.removeEventListener('visibilitychange', allaVisibilita)
      document.removeEventListener('click', alClic, true)
      window.clearTimeout(salvagente)
      tocco?.dispose()
      for (const m of motti) { m.el.classList.remove('materia-accesa'); m.lettere.forEach((l) => l.classList.add('scritta')) }
      for (const a of accenti) a.el.classList.remove('toccata')
      nomeHtml?.removeAttribute('data-nascosto')
      mondo?.distruggi()
    }
  }, [percorso, corrente])

  return (
    <>
      <div ref={tela} className="varco-tela solo-varco" aria-hidden="true" />

      <section className="varco" aria-label="Il viaggio">
        <div ref={traccia} className="varco-traccia" style={{ ['--lunghezza' as string]: percorso.lunghezza }}>
          <div ref={palco} className="varco-palco">
            <Testata corrente={corrente} />
            <picture className="varco-poster">
              <source media="(min-width: 901px)" srcSet={poster.src1080} />
              {/* è l'immagine più grande della prima schermata (LCP): priorità alta, come l'hero dei dentisti */}
              <img src={poster.src720} alt={poster.alt} width={720} height={1280} decoding="async" fetchPriority="high" />
            </picture>
            {/* il punto da cui nasce tutto (D45): visibile dal primo fotogramma, sparisce quando parte il big bang */}
            <span className="varco-puntino solo-varco" aria-hidden="true" />
            <canvas className="tela-materia" aria-hidden="true" />
            {/* l'apertura sta sopra tutto il palco (il nome nel cerchio); le altre battute nella fascia del testo */}
            <div className="apertura-strato">
              {percorso.blocchi.filter((bl) => bl.tipo === 'apertura').map((bl) => <VoceBlocco key={bl.id} bl={bl} h1={h1} />)}
            </div>
            <div className="fascia">
              {percorso.blocchi.filter((bl) => bl.tipo !== 'apertura' && bl.tipo !== 'squadra').map((bl) => <VoceBlocco key={bl.id} bl={bl} h1={h1} />)}
            </div>
            {/* le cartoline dei servizi: volano accanto alla mascotte una alla volta */}
            <div className="cartoline-strato solo-varco">
              {percorso.blocchi.filter((bl) => bl.tipo === 'mascotte').map((bl) => (
                <div className="blocco" key={bl.id} data-id={bl.id}>
                  {bl.battute.filter((b) => b.tipo === 'foto').map((b) => <VoceBattuta key={b.ruolo} b={b} apertura={false} />)}
                </div>
              ))}
            </div>
            {/* il finale: pochi posti nella luce, poi quello libero (D45) */}
            {percorso.blocchi.some((bl) => bl.tipo === 'finale') ? <GraficaPosti /> : null}
            {/* la squadra: la frase sopra e sotto le quattro mascotte riunite */}
            <div className="squadra-strato">
              {percorso.blocchi.filter((bl) => bl.tipo === 'squadra').map((bl) => <VoceBlocco key={bl.id} bl={bl} h1={h1} />)}
            </div>
          </div>
        </div>
      </section>

      {children}
    </>
  )
}
