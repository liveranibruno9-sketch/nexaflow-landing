'use client'

import { useEffect, useRef, useState } from 'react'
import Costellazione, { type Fase } from './cielo/Costellazione'
import { COSTELLAZIONI } from './cielo/stelle'
import type { Modulo } from './dati'

/** la linea del viewport su cui "passa" il testo: il 62% dall'alto */
const LINEA = 0.62

type Stato = { fase: Fase; accese: number }

/**
 * Un modulo raccontato come costellazione, in tre fasi:
 *   Buio          il problema: stelle spente e arancioni
 *   Collegamento  cosa fa e come funziona: le stelle si accendono nell'ordine
 *                 del flusso mentre il blocco scorre
 *   Luce          cosa ci guadagna: figura completa, ultima stella gialla
 *
 * Il cielo resta fermo a lato (in alto su telefono), il testo scorre
 * normalmente: lo scroll non viene mai bloccato.
 *
 * Robustezza: nel markup la costellazione arriva gia accesa (fase luce).
 * La spegne solo il JavaScript, e solo se puo animarla. Senza JS, o con
 * "movimento ridotto", si vede tutto disegnato.
 */
export default function ModuloCielo({ modulo }: { modulo: Modulo }) {
  const cost = COSTELLAZIONI[modulo.cielo.chiave]
  const passi = modulo.cielo.passi
  const totale = cost.totale

  if (process.env.NODE_ENV !== 'production' && passi.length !== totale) {
    // errore di contenuto: etichette e stelle devono coincidere
    console.error(`[${modulo.sigla}] ${passi.length} etichette per ${totale} stelle in ${modulo.cielo.chiave}`)
  }

  const [stato, setStato] = useState<Stato>({ fase: 'luce', accese: totale })
  const [scelto, setScelto] = useState<number | null>(null)

  const sezione = useRef<HTMLElement>(null)
  const collegamento = useRef<HTMLDivElement>(null)
  const luce = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const menoMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (menoMovimento || !sezione.current || !collegamento.current || !luce.current) return

    // attributo scritto a mano, non stato React: evita un secondo render per modulo
    sezione.current.dataset.animabile = 'true'
    let raf = 0
    let attivo = false

    const calcola = () => {
      raf = 0
      const c = collegamento.current
      const l = luce.current
      if (!c || !l) return
      const linea = window.innerHeight * LINEA
      const bc = c.getBoundingClientRect()
      const bl = l.getBoundingClientRect()

      let prossimo: Stato
      if (bl.top < linea) {
        prossimo = { fase: 'luce', accese: totale }
      } else {
        const progresso = (linea - bc.top) / bc.height
        if (progresso <= 0) prossimo = { fase: 'buio', accese: 0 }
        else prossimo = { fase: 'collegamento', accese: Math.min(totale, 1 + Math.floor(progresso * totale)) }
      }
      setStato((prima) => (prima.fase === prossimo.fase && prima.accese === prossimo.accese ? prima : prossimo))
    }

    const alloScroll = () => {
      if (!raf) raf = requestAnimationFrame(calcola)
    }

    // L'ascolto dello scroll e attivo solo quando il modulo e vicino allo schermo,
    // e lo stato si calcola solo da li: i moduli lontani restano come arrivano
    // dal server, senza lavoro al caricamento.
    const osservatore = new IntersectionObserver(
      ([voce]) => {
        if (voce.isIntersecting && !attivo) {
          attivo = true
          window.addEventListener('scroll', alloScroll, { passive: true })
          window.addEventListener('resize', alloScroll)
          calcola()
        } else if (!voce.isIntersecting && attivo) {
          attivo = false
          window.removeEventListener('scroll', alloScroll)
          window.removeEventListener('resize', alloScroll)
        }
      },
      { rootMargin: '25% 0px 25% 0px' },
    )
    osservatore.observe(sezione.current)

    return () => {
      osservatore.disconnect()
      window.removeEventListener('scroll', alloScroll)
      window.removeEventListener('resize', alloScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [totale])

  // la stella toccata vale finche il flusso non cambia passo
  useEffect(() => setScelto(null), [stato.accese, stato.fase])

  const [problema, cosaFa, comeFunziona, guadagno] = modulo.posts
  const passoMostrato = scelto ?? (stato.fase === 'collegamento' ? stato.accese : null)

  const didascalia =
    passoMostrato !== null
      ? `${passoMostrato} · ${passi[passoMostrato - 1]}`
      : stato.fase === 'buio'
        ? 'I punti ci sono. Nessuno li collega.'
        : `Flusso completo · ${totale} passaggi`

  return (
    <article
      id={modulo.slug}
      ref={sezione}
      className="modulo-cielo scroll-mt-20 border-t border-[var(--bordo)] pt-[clamp(4rem,8vw,7rem)]"
    >
      <div className="grid gap-x-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        {/* ---------- il cielo, fermo ---------- */}
        <div className="sticky top-[4.6rem] z-10 -mx-1 lg:top-[13vh] lg:mx-0 lg:self-start">
          <div className="vetro reticolo overflow-hidden rounded-xl2 p-4 sm:p-5 lg:rounded-xl3 lg:p-7">
            <div className="flex items-baseline justify-between gap-3">
              <span className="occhiello">
                {modulo.sigla} · {modulo.cielo.nome}
              </span>
              <span className="mono hidden text-s-2 tenue sm:inline">{cost.coordinate}</span>
            </div>

            <div className="mx-auto mt-3 aspect-square h-[25vh] max-h-[260px] lg:mt-5 lg:h-auto lg:max-h-[44vh] lg:w-full">
              <Costellazione
                cost={cost}
                fase={stato.fase}
                accese={stato.accese}
                idBase={`modulo-${modulo.slug}`}
                scelto={scelto}
                onScegli={setScelto}
                etichetta={`Costellazione ${modulo.cielo.nome}: il flusso di ${modulo.nome} in ${totale} passaggi`}
              />
            </div>

            {/* telefono: una riga con il passo corrente */}
            <p className="mono mt-3 min-h-[2.6em] text-center text-s-2 leading-snug text-[var(--bianco)] lg:hidden" aria-live="polite">
              {didascalia}
            </p>

            {/* schermo grande: l'elenco completo, che si accende con le stelle */}
            <ol className="mt-6 hidden gap-1.5 lg:grid">
              {passi.map((p, i) => {
                const n = i + 1
                const acceso = stato.fase === 'luce' || n <= stato.accese
                const finale = stato.fase === 'luce' && n === totale
                const attuale = n === passoMostrato
                return (
                  <li
                    key={p}
                    className={`flex items-start gap-3 rounded-lg px-2 py-1 text-s-2 leading-snug transition-colors duration-500 ease-soft ${
                      attuale ? 'bg-[color-mix(in_srgb,#9ED8FF_9%,transparent)]' : ''
                    }`}
                  >
                    <span
                      className={`mono num w-4 shrink-0 ${
                        finale ? 'text-[var(--giallo)]' : acceso ? 'text-[var(--celeste)]' : 'text-[var(--neutro)]'
                      }`}
                    >
                      {n}
                    </span>
                    <span className={acceso ? 'text-[var(--bianco)]' : 'tenue'}>{p}</span>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>

        {/* ---------- il racconto, che scorre ---------- */}
        <div className="mt-10 lg:mt-0">
          <header>
            <div className="flex flex-wrap items-center gap-3">
              <span className="mono text-s-1 text-[var(--celeste)]">{modulo.sigla}</span>
              <span className="chip !whitespace-normal !rounded-2xl leading-snug">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: modulo.stato === 'pronto' ? 'var(--blu-luce)' : 'var(--neutro)' }}
                />
                {modulo.stato === 'pronto' ? 'Pronto' : 'Dopo la verifica'} · {modulo.statoNota}
              </span>
            </div>
            <h3 className="serif mt-5 text-s4">{modulo.nome}</h3>
            <p className="misura mt-5 text-s1 leading-[1.45] text-[color-mix(in_srgb,#F2F5FF_82%,transparent)]">
              {modulo.promessa}
            </p>
            <p className="misura mt-5 text-s-1 italic tenue">{modulo.cielo.perche}</p>
          </header>

          {/* 01 · Buio */}
          <div className="flex min-h-[48vh] flex-col justify-center py-14">
            <EtichettaFase n="01" nome="Buio" colore="var(--arancio)" />
            <h4 className="serif mt-4 text-s2">{problema.titolo}</h4>
            <p className="misura mt-4 text-s0 leading-relaxed tenue">{problema.testo}</p>
          </div>

          {/* 02 · Collegamento: e qui che le stelle si accendono */}
          <div ref={collegamento} className="min-h-[85vh] py-14">
            <EtichettaFase n="02" nome="Collegamento" colore="var(--celeste)" />
            <h4 className="serif mt-4 text-s2">{cosaFa.titolo}</h4>
            <p className="misura mt-4 text-s0 leading-relaxed tenue">{cosaFa.testo}</p>
            <h4 className="serif mt-[16vh] text-s2">{comeFunziona.titolo}</h4>
            <p className="misura mt-4 text-s0 leading-relaxed tenue">{comeFunziona.testo}</p>

            {/* telefono: l'elenco completo dei passi, leggibile anche senza guardare il cielo */}
            <ol className="mt-10 grid gap-2 rounded-xl2 border border-[var(--bordo)] p-5 lg:hidden">
              {passi.map((p, i) => (
                <li key={p} className="flex gap-3 text-s-1 leading-snug">
                  <span className="mono num w-4 shrink-0 text-[var(--celeste)]">{i + 1}</span>
                  <span className="tenue">{p}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* 03 · Luce */}
          <div ref={luce} className="pb-[18vh] pt-14">
            <EtichettaFase n="03" nome="Luce" colore="var(--giallo)" />
            <h4 className="serif mt-4 text-s2">{guadagno.titolo}</h4>
            <p className="misura mt-4 text-s0 leading-relaxed tenue">{guadagno.testo}</p>

            <dl className="mt-9 grid gap-4 sm:grid-cols-2">
              <Cifra valore={modulo.ore} nota={modulo.oreNota} colore="var(--blu-luce)" />
              <Cifra valore={modulo.euro} nota={modulo.euroNota} colore="var(--giallo)" />
            </dl>
            <p className="mt-6 text-s-2 tenue">
              <span className="mono uppercase tracking-[0.12em] text-[var(--celeste)]">Si misura con</span> ·{' '}
              {modulo.metrica}
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}

function EtichettaFase({ n, nome, colore }: { n: string; nome: string; colore: string }) {
  return (
    <span className="occhiello flex items-center gap-3" style={{ color: colore }}>
      <span aria-hidden="true" className="h-px w-8" style={{ background: colore }} />
      {n} · {nome}
    </span>
  )
}

function Cifra({ valore, nota, colore }: { valore: string; nota: string; colore: string }) {
  return (
    <div className="card p-5">
      <dt className="serif text-s3 leading-none" style={{ color: colore }}>
        {valore}
      </dt>
      <dd className="mt-3 text-s-2 leading-snug tenue">{nota}</dd>
    </div>
  )
}
