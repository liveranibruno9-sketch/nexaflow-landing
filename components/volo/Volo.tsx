'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { useLenis } from 'lenis/react'
import Costellazione from '../cielo/Costellazione'
import { COSTELLAZIONI } from '../cielo/stelle'
import { MODULI, PASSI, PERDITE } from '../dati'
import Report from '../Report'
import { FASI, LUNGHEZZA, TAPPE, passiAccesi, tappaAl, type Tappa } from './rotta'
import type { Scena } from './scena'

/**
 * Il volo.
 *
 * Una "traccia" alta quanto la rotta (LUNGHEZZA vh) contiene un palco sticky
 * a tutto schermo. Scorrendo la traccia si avanza nella rotta: `u` sono i vh
 * percorsi. Sul palco ci sono i "quadri", i testi di ogni tappa, ognuno con
 * la sua finestra [data-da, data-a] in cui compare. Dietro, fisso, il canvas
 * della scena 3D, che legge la stessa `u`.
 *
 * Due modi, decisi prima del primo disegno da uno script in <head> (vedi
 * app/layout.tsx), cosi la pagina non salta:
 * - html.volo: il volo completo
 * - senza classe: pagina normale, le tappe una sotto l'altra, costellazioni
 *   in SVG. Vale senza JavaScript, con "movimento ridotto", senza WebGL2,
 *   sui telefoni piu vecchi e dove la grafica e solo software.
 *
 * Tutto il testo e HTML vero in entrambi i modi: Google e gli screen reader
 * lo leggono per intero.
 */

const SFUMATURA = 13 // vh di dissolvenza di ogni quadro: lunga, come una dissolvenza incrociata al cinema

const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x))
const liscia = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}

/** la finestra di un quadro: da dove a dove della rotta e visibile */
function finestra(t: Tappa, da: number, a: number) {
  return { 'data-da': (t.inizio + da * t.durata).toFixed(1), 'data-a': (t.inizio + a * t.durata).toFixed(1) }
}

const numero = new Intl.NumberFormat('it-IT')

const T_PARTENZA = TAPPE[0]
const T_PERDITE = TAPPE.filter((t) => t.tipo === 'perdita')
const T_MODULI = TAPPE.filter((t) => t.tipo === 'modulo')
const T_ROTTA = TAPPE.find((t) => t.tipo === 'rotta')!
const T_ARRIVO = TAPPE.find((t) => t.tipo === 'arrivo')!

/** voci degli strumenti di bordo: le perdite contano come una sola tappa */
const BORDO = [
  { id: 'top', nome: 'Partenza' },
  { id: 'perdite', nome: 'Le perdite' },
  ...MODULI.map((m) => ({ id: m.slug, nome: `${m.sigla} · ${m.cielo.nome}` })),
  { id: 'processo', nome: 'La rotta' },
  { id: 'arrivo', nome: 'Arrivo' },
]

export default function Volo() {
  const traccia = useRef<HTMLDivElement>(null)
  const palco = useRef<HTMLDivElement>(null)
  const cielo3d = useRef<HTMLDivElement>(null)
  const didascalia = useRef<HTMLParagraphElement>(null)
  const bordoMini = useRef<HTMLParagraphElement>(null)
  const lenis = useLenis()
  const lenisRef = useRef(lenis)
  lenisRef.current = lenis

  useEffect(() => {
    const html = document.documentElement
    const tr = traccia.current
    const pa = palco.current
    const contenitore3d = cielo3d.current
    if (!html.classList.contains('volo') || !tr || !pa || !contenitore3d) return

    const quadri = Array.from(pa.querySelectorAll<HTMLElement>('.quadro')).map((el) => ({
      el,
      da: Number(el.dataset.da),
      a: Number(el.dataset.a),
      subito: el.hasAttribute('data-subito'),
      fine: el.hasAttribute('data-fine'),
      o: -1,
      t: '',
    }))
    const vociBordo = Array.from(document.querySelectorAll<HTMLElement>('[data-bordo]'))

    /* ----- misure: dove sta la traccia e quanto si scorre ----- */
    let inizio = 0
    let corsa = 1
    const misura = () => {
      const r = tr.getBoundingClientRect()
      inizio = r.top + window.scrollY
      corsa = Math.max(1, tr.offsetHeight - pa.offsetHeight)
    }
    misura()
    const uCorrente = () => clamp((window.scrollY - inizio) / corsa, 0, 1) * LUNGHEZZA
    const yDi = (u: number) => inizio + (u / LUNGHEZZA) * corsa

    const vaiA = (u: number, morbido: boolean) => {
      const y = yDi(u)
      const l = lenisRef.current
      if (morbido && l) l.scrollTo(y, { duration: 2.4 })
      else window.scrollTo({ top: y, behavior: morbido ? 'smooth' : 'instant' })
    }

    /* ----- i quadri: opacita e profondita ----- */
    // curva morbida in entrata e in uscita: niente accelerazioni a scatto
    const morbida = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
    const aggiornaQuadri = (u: number) => {
      for (const q of quadri) {
        const entrata = q.subito ? 1 : morbida(clamp((u - q.da) / SFUMATURA, 0, 1))
        const uscita = q.fine ? 0 : morbida(clamp((u - (q.a - SFUMATURA)) / SFUMATURA, 0, 1))
        const o = u < q.da || (!q.fine && u > q.a) ? 0 : Math.min(entrata, 1 - uscita)
        // il testo arriva dalla profondita (sale e si avvicina) e poi ti supera (sale ancora e si ingrandisce)
        const ty = (1 - entrata) * 28 - uscita * 28
        const s = 0.965 + 0.035 * entrata + 0.04 * uscita
        const oR = Math.round(o * 100) / 100
        const tR = `translate3d(0, ${ty.toFixed(1)}px, 0) scale(${s.toFixed(3)})`
        if (oR !== q.o) {
          q.el.style.opacity = String(oR)
          q.el.dataset.attivo = oR > 0.5 ? 'true' : 'false'
          q.o = oR
        }
        if (tR !== q.t) {
          q.el.style.transform = tR
          q.t = tR
        }
      }
    }

    /* ----- strumenti di bordo: tappa corrente e passo del flusso ----- */
    let bordoAttivo = ''
    let testoDidascalia = '-'
    const aggiornaBordo = (u: number) => {
      const t = tappaAl(u)
      const id = t.tipo === 'perdita' ? 'perdite' : t.id
      if (id !== bordoAttivo) {
        bordoAttivo = id
        vociBordo.forEach((el) => (el.dataset.attiva = String(el.dataset.bordo === id)))
        const i = BORDO.findIndex((b) => b.id === id)
        if (bordoMini.current) bordoMini.current.textContent = `${String(i + 1).padStart(2, '0')} / ${BORDO.length} · ${BORDO[i].nome}`
      }
      let testo = ''
      if (t.tipo === 'modulo') {
        const f = (u - t.inizio) / t.durata
        const passi = MODULI[t.indice].cielo.passi
        if (f >= FASI.cosaFa[0] && f <= FASI.comeFunziona[1]) {
          const k = clamp(Math.ceil(passiAccesi(f, passi.length)), 1, passi.length)
          testo = `${k} / ${passi.length} · ${passi[k - 1]}`
        }
      }
      if (testo !== testoDidascalia && didascalia.current) {
        didascalia.current.textContent = testo
        didascalia.current.dataset.vuota = String(!testo)
        testoDidascalia = testo
      }
      html.classList.toggle('in-orbita', window.scrollY > inizio + corsa + window.innerHeight * 0.3)
    }

    /* ----- la scena 3D, caricata quando il browser e libero ----- */
    let scena: Scena | null = null
    let chiuso = false
    const mobile = window.matchMedia('(max-aspect-ratio: 1/1), (pointer: coarse)').matches

    const passaAllaPagina = () => {
      // qualcosa non va con la grafica: si torna alla pagina normale
      ferma()
      scena?.distruggi()
      scena = null
      quadri.forEach((q) => {
        q.el.style.opacity = ''
        q.el.style.transform = ''
      })
      html.classList.remove('volo', 'in-orbita')
    }

    const carica = () => {
      import('./scena')
        .then(({ creaScena }) => {
          if (chiuso) return
          try {
            scena = creaScena(contenitore3d, { mobile, onPerso: passaAllaPagina })
            contenitore3d.dataset.pronto = 'true'
            avvia()
          } catch {
            passaAllaPagina()
          }
        })
        .catch(passaAllaPagina)
    }
    const conIdle = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number
      cancelIdleCallback?: (id: number) => void
    }
    const attesa = conIdle.requestIdleCallback ? conIdle.requestIdleCallback(carica, { timeout: 1800 }) : window.setTimeout(carica, 700)

    /* ----- il ciclo: gira solo quando il volo e sullo schermo ----- */
    let raf = 0
    let inVista = true
    let ultimo = performance.now()
    let ultimaScena = ultimo
    let uLiscio = -1
    let uPrima = -1
    let fermi = 0

    /**
     * La "macchina da presa": testi e scena 3D seguono la stessa posizione
     * morbida, che insegue lo scroll con un'inerzia indipendente dai
     * fotogrammi. Lo scroll resta libero; e il racconto che scivola dietro,
     * con un filo di ritardo, come una camera su un carrello.
     */
    const INERZIA = 3.6 // piu basso = piu morbido e piu lento a fermarsi
    const fotogramma = (ora: number) => {
      raf = 0
      const dt = Math.min(0.1, (ora - ultimo) / 1000)
      ultimo = ora
      const obiettivo = uCorrente()
      if (uLiscio < 0) uLiscio = obiettivo
      uLiscio += (obiettivo - uLiscio) * (1 - Math.exp(-dt * INERZIA))
      if (Math.abs(obiettivo - uLiscio) < 0.01) uLiscio = obiettivo
      aggiornaQuadri(uLiscio)
      aggiornaBordo(uLiscio)

      if (scena) {
        const inMoto = Math.abs(uLiscio - uPrima) > 0.002
        fermi = inMoto ? 0 : fermi + 1
        // da fermo, dopo un secondo e mezzo, un fotogramma su due: lo scintillio non ha bisogno di 60 al secondo
        if (fermi < 90 || fermi % 2 === 0) {
          const vivo = scena.aggiorna(uLiscio, Math.min(0.1, (ora - ultimaScena) / 1000), ora / 1000)
          ultimaScena = ora
          if (vivo) fermi = 0
        }
      }
      uPrima = uLiscio
      if (inVista && !document.hidden) raf = requestAnimationFrame(fotogramma)
    }
    const avvia = () => {
      if (!raf && inVista && !document.hidden && html.classList.contains('volo')) raf = requestAnimationFrame(fotogramma)
    }
    const ferma = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    }

    const osservatore = new IntersectionObserver(
      ([voce]) => {
        inVista = voce.isIntersecting
        if (inVista) avvia()
        else {
          // ultimo aggiornamento prima di fermarsi: in orbita resta la scena d'arrivo
          aggiornaBordo(uCorrente())
          ferma()
        }
      },
      { rootMargin: '10% 0px 10% 0px' },
    )
    osservatore.observe(tr)

    const alloScroll = () => {
      avvia()
      if (!inVista) aggiornaBordo(uCorrente())
    }
    const alRidimensionamento = () => {
      misura()
      scena?.ridimensiona()
      avvia()
    }
    const allaVisibilita = () => (document.hidden ? ferma() : avvia())
    const alPuntatore = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      scena?.puntatore((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1)
    }

    /* ----- ancore: #preventivi porta alla sua tappa, non in cima al palco ----- */
    const perId = new Map(TAPPE.map((t) => [t.id, t]))
    const uDellaTappa = (t: Tappa) => t.inizio + (t.tipo === 'modulo' ? 0.05 : t.tipo === 'perdita' ? 0.1 : 0) * t.durata
    const alClic = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null
      if (!a) return
      const t = perId.get(a.getAttribute('href')!.slice(1))
      if (!t) return
      e.preventDefault()
      vaiA(uDellaTappa(t), true)
      history.replaceState(null, '', `#${t.id}`)
    }
    const iniziale = perId.get(window.location.hash.slice(1))
    if (iniziale) vaiA(uDellaTappa(iniziale), false)

    // con la tastiera: se il focus finisce su un testo non ancora visibile, la camera ci va
    const alFocus = (e: FocusEvent) => {
      const q = (e.target as HTMLElement).closest<HTMLElement>('.quadro')
      if (!q) return
      const da = Number(q.dataset.da)
      const a = Number(q.dataset.a)
      const u = uCorrente()
      if (u < da + SFUMATURA || u > a - SFUMATURA) vaiA(Math.min(da + SFUMATURA + 2, a), false)
    }

    window.addEventListener('scroll', alloScroll, { passive: true })
    window.addEventListener('resize', alRidimensionamento)
    window.addEventListener('pointermove', alPuntatore, { passive: true })
    document.addEventListener('visibilitychange', allaVisibilita)
    document.addEventListener('click', alClic, true)
    pa.addEventListener('focusin', alFocus)
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
      pa.removeEventListener('focusin', alFocus)
      scena?.distruggi()
    }
  }, [])

  return (
    <>
      <div ref={cielo3d} className="cielo3d solo-volo" aria-hidden="true" />

      <section className="volo" aria-label="Il viaggio: dal problema alla soluzione">
        <div ref={traccia} className="volo-traccia" style={{ height: `${LUNGHEZZA + 100}vh` }}>
          <div ref={palco} className="volo-palco">
            {/* ================= PARTENZA ================= */}
            <div id="top" className="tappa tappa--partenza">
              <div className="quadro quadro--sfondo quadro--iniziale" {...finestra(T_PARTENZA, 0, 0.95)} data-subito>
                <Image
                  src="/cielo/carena.jpg"
                  alt=""
                  fill
                  priority
                  quality={55}
                  sizes="100vw"
                  className="object-cover object-[50%_78%] opacity-70"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,#05070F_0%,rgba(5,7,15,0.35)_30%,rgba(5,7,15,0.25)_60%,#05070F_100%)]" />
              </div>

              <div className="quadro quadro--centro quadro--iniziale" {...finestra(T_PARTENZA, 0, 0.82)} data-subito>
                <div className="wrap text-center">
                  <span className="occhiello">Agenti Studio · automazioni per studi dentistici · Romagna</span>
                  <h1 className="display mx-auto mt-7 max-w-[15ch] text-[clamp(2.9rem,8.2vw,7.4rem)] leading-[0.94]">
                    Colleghiamo i punti. <span className="testo-sfumato">Lei ritrova i pazienti.</span>
                  </h1>
                  <p className="mx-auto mt-7 max-w-[46ch] text-s1 leading-[1.45] text-[color-mix(in_srgb,var(--bianco)_84%,transparent)]">
                    Chiamate senza risposta, preventivi fermi da mesi, poltrone vuote. Prima lo misuro sul suo studio. Poi
                    lo recuperiamo, e lo contiamo insieme ogni mese.
                  </p>
                  <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <a href="#verifica" className="btn btn-primario">
                      Richiedi la verifica gratuita
                    </a>
                    <a href="#perdite" className="btn btn-fantasma">
                      Inizia il viaggio
                    </a>
                  </div>
                  <p className="mono mt-10 text-s-2 uppercase tracking-[0.18em] tenue solo-volo">
                    Scorri per partire ↓ ·{' '}
                    <a href="#orbita" className="underline underline-offset-4 hover:text-[var(--bianco)]">
                      salta il viaggio
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* ================= LE QUATTRO PERDITE ================= */}
            {T_PERDITE.map((t, i) => {
              const p = PERDITE[i]
              return (
                <div key={t.id} id={t.id} className="tappa">
                  {i === 0 ? (
                    <div className="quadro quadro--lato" {...finestra(t, 0.02, 0.34)}>
                      <span className="occhiello text-[var(--arancio)]">Il problema</span>
                      <h2 className="display mt-5 text-s4 leading-[1]">Quattro perdite. Nessuna compare nei report.</h2>
                      <p className="mt-6 max-w-[42ch] text-s0 tenue">
                        Non sono errori di qualcuno. Sono punti che nessuno ha il tempo di collegare, e ognuno si spegne in
                        silenzio, ogni settimana.
                      </p>
                    </div>
                  ) : null}
                  <div className="quadro quadro--lato" {...finestra(t, i === 0 ? 0.33 : 0.05, 0.95)}>
                    <span className="occhiello text-[var(--arancio)]">
                      Perdita {p.n} / 04
                    </span>
                    <h3 className="display mt-5 text-s4 leading-[1.02]">{p.titolo}</h3>
                    <p className="mt-5 max-w-[46ch] text-s0 leading-relaxed tenue">{p.testo}</p>
                    <p className="display num mt-8 text-s5 leading-none text-[var(--arancio)]">
                      {p.prefisso}
                      {numero.format(p.valore)}
                      {p.suffisso}
                    </p>
                    <p className="mt-3 max-w-[40ch] text-s-1 tenue">{p.datoNota}</p>
                  </div>
                </div>
              )
            })}

            {/* ================= LE SEI COSTELLAZIONI ================= */}
            {T_MODULI.map((t) => {
              const m = MODULI[t.indice]
              const [problema, cosaFa, comeFunziona, guadagno] = m.posts
              const cost = COSTELLAZIONI[m.cielo.chiave]
              return (
                <div key={t.id} id={t.id} className="tappa tappa--modulo">
                  <div className="quadro quadro--lato" {...finestra(t, FASI.avvicinamento[0], FASI.avvicinamento[1])}>
                    <span className="occhiello">
                      {m.sigla} · {m.cielo.nome} · <span className="tenue">{cost.coordinate}</span>
                    </span>
                    <h2 className="display mt-5 text-s5 leading-[0.98]">{m.nome}</h2>
                    <p className="mt-6 max-w-[40ch] text-s1 leading-[1.4] text-[color-mix(in_srgb,var(--bianco)_88%,transparent)]">
                      {m.promessa}
                    </p>
                    <p className="mt-5 max-w-[46ch] text-s-1 italic tenue">{m.cielo.perche}</p>
                    <p className="chip mt-6 self-start !whitespace-normal !rounded-2xl leading-snug">
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: m.stato === 'pronto' ? 'var(--blu-luce)' : 'var(--neutro)' }}
                      />
                      {m.stato === 'pronto' ? 'Pronto' : 'Dopo la verifica'} · {m.statoNota}
                    </p>
                  </div>

                  {/* pagina normale: la costellazione disegnata, gia accesa */}
                  <div className="solo-statico cost-statica reticolo vetro-nebulosa">
                    <Costellazione
                      cost={cost}
                      fase="luce"
                      accese={cost.totale}
                      idBase={`statico-${m.slug}`}
                      etichetta={`Costellazione ${m.cielo.nome}: il flusso di ${m.nome} in ${cost.totale} passaggi`}
                    />
                  </div>

                  <div className="quadro quadro--lato" {...finestra(t, FASI.buio[0], FASI.buio[1])}>
                    <Fase n="01" nome="Buio" colore="var(--arancio)" />
                    <h3 className="display mt-4 text-s3">{problema.titolo}</h3>
                    <p className="mt-4 max-w-[46ch] text-s0 leading-relaxed tenue">{problema.testo}</p>
                  </div>
                  <div className="quadro quadro--lato" {...finestra(t, FASI.cosaFa[0], FASI.cosaFa[1])}>
                    <Fase n="02" nome="Collegamento" colore="var(--celeste)" />
                    <h3 className="display mt-4 text-s3">{cosaFa.titolo}</h3>
                    <p className="mt-4 max-w-[46ch] text-s0 leading-relaxed tenue">{cosaFa.testo}</p>
                  </div>
                  <div className="quadro quadro--lato" {...finestra(t, FASI.comeFunziona[0], FASI.comeFunziona[1])}>
                    <Fase n="02" nome="Collegamento" colore="var(--celeste)" />
                    <h3 className="display mt-4 text-s3">{comeFunziona.titolo}</h3>
                    <p className="mt-4 max-w-[46ch] text-s0 leading-relaxed tenue">{comeFunziona.testo}</p>
                  </div>

                  <ol className="solo-statico passi-statici">
                    {m.cielo.passi.map((p, i) => (
                      <li key={p}>
                        <span className="mono num text-[var(--celeste)]">{i + 1}</span>
                        <span className="tenue">{p}</span>
                      </li>
                    ))}
                  </ol>

                  <div className="quadro quadro--lato" {...finestra(t, FASI.luce[0], FASI.luce[1])}>
                    <Fase n="03" nome="Luce" colore="var(--verde)" />
                    <h3 className="display mt-4 text-s3">{guadagno.titolo}</h3>
                    <p className="mt-4 max-w-[46ch] text-s0 leading-relaxed tenue">{guadagno.testo}</p>
                    <dl className="mt-7 grid max-w-[34rem] gap-3 sm:grid-cols-2">
                      <div className="card p-4">
                        <dt className="display text-s3 leading-none text-[var(--blu-luce)]">{m.ore}</dt>
                        <dd className="mt-2 text-s-2 leading-snug tenue">{m.oreNota}</dd>
                      </div>
                      <div className="card p-4">
                        <dt className="display text-s3 leading-none text-[var(--verde)]">{m.euro}</dt>
                        <dd className="mt-2 text-s-2 leading-snug tenue">{m.euroNota}</dd>
                      </div>
                    </dl>
                    <p className="mt-5 text-s-2 tenue">
                      <span className="mono uppercase tracking-[0.12em] text-[var(--celeste)]">Si misura con</span> · {m.metrica}
                    </p>
                  </div>
                </div>
              )
            })}

            {/* ================= LA ROTTA ================= */}
            <div id="processo" className="tappa">
              {PASSI.map((p, i) => (
                <div key={p.n} className="quadro quadro--lato" {...finestra(T_ROTTA, i / 3 + (i === 0 ? 0.02 : 0), (i + 1) / 3)}>
                  <span className="occhiello">La rotta · passo {p.n} / 03</span>
                  {i === 0 ? (
                    <p className="display mt-5 text-s2 leading-tight tenue">
                      Tre passi. Il primo non costa niente e non impegna a niente.
                    </p>
                  ) : null}
                  <h2 className="display mt-5 text-s5 leading-[0.98]">{p.titolo}</h2>
                  <p className="chip mt-5 self-start">{p.durata}</p>
                  <p className="mt-5 max-w-[46ch] text-s0 leading-relaxed tenue">{p.testo}</p>
                  <p className="mt-4 max-w-[46ch] text-s-1 leading-relaxed tenue">{p.dettaglio}</p>
                </div>
              ))}
            </div>

            {/* ================= ARRIVO ================= */}
            <div id="arrivo" className="tappa">
              {/* due colonne: il pulsante sta sotto il testo, il report accanto.
                  Incolonnati superavano l'altezza di un portatile e il pulsante veniva tagliato */}
              <div className="quadro quadro--lato quadro--arrivo" {...finestra(T_ARRIVO, 0.06, 1)} data-fine>
                <div className="arrivo-griglia">
                  <div className="flex flex-col">
                    <span className="occhiello text-[var(--verde)]">Arrivo</span>
                    <h2 className="display mt-4 text-s4 leading-[1]">Il primo passo è una verifica. Gratuita.</h2>
                    <p className="mt-5 max-w-[44ch] text-s0 tenue">
                      Trenta minuti di lavoro mio, zero suo. Poi le mando una pagina così, con l’ora esatta di ogni
                      prova.
                    </p>
                    <a href="#verifica" className="btn btn-primario mt-7 self-start">
                      Richiedi la verifica gratuita
                    </a>
                  </div>
                  <Report compatto />
                </div>
              </div>
            </div>

            {/* ================= STRUMENTI DI BORDO ================= */}
            <p ref={didascalia} className="didascalia mono solo-volo" data-vuota="true" aria-hidden="true" />
          </div>
        </div>
      </section>

      <nav className="bordo solo-volo" aria-label="Tappe del viaggio">
        <ol>
          {BORDO.map((b) => (
            <li key={b.id}>
              <a href={`#${b.id}`} data-bordo={b.id} data-attiva={b.id === 'top'}>
                <span className="bordo-nome">{b.nome}</span>
                <span className="bordo-punto" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ol>
        <a href="#orbita" className="bordo-salta">
          Salta il viaggio
        </a>
      </nav>
      <p ref={bordoMini} className="bordo-mini mono solo-volo" aria-hidden="true">
        01 / {BORDO.length} · Partenza
      </p>
    </>
  )
}

function Fase({ n, nome, colore }: { n: string; nome: string; colore: string }) {
  return (
    <span className="occhiello flex items-center gap-3" style={{ color: colore }}>
      <span aria-hidden="true" className="h-px w-8" style={{ background: colore }} />
      {n} · {nome}
    </span>
  )
}
