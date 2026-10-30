// La materia sopra le frasi (canvas 2D a tutto schermo, sopra il testo): le particelle che toccano la parola d'accento
// (storyboard regola 5, D41) e la scia del cursore (prima leva di R12). Solo canvas 2D, nessuna dipendenza da three.
// Si disegna solo finché ci sono particelle: da fermo non costa nulla. Piano-costruzione-v2, compito 7.
import { curvaTocco } from './testo.ts'

type Particella = { t0: number; durata: number; da: [number, number]; a: [number, number]; raggio: number; colore: string; arrivo: boolean; tipo: 'tocco' | 'scia'; onArrivo?: () => void }

export type Tocco = {
  /** n particelle volano da `da` (px CSS) al centro di `el` in 450 ms e poi `alArrivo` */
  tocca(da: [number, number], el: HTMLElement, colore: string, n: number, alArrivo: () => void): void
  /** una particella della scia del cursore, che si spegne in 600 ms */
  scia(x: number, y: number, colore: string): void
  svuota(): void
  ridimensiona(): void
  dispose(): void
}

const DURATA_TOCCO = 450
const DURATA_SCIA = 600
const MASSIMO = 220
/** curva morbida (0,16, 1, 0,3, 1) approssimata: parte veloce, si posa piano */
const morbida = (t: number) => 1 - Math.pow(1 - t, 3)

export function creaTocco(canvas: HTMLCanvasElement): Tocco {
  const ctx = canvas.getContext('2d')
  let particelle: Particella[] = []
  let raf = 0
  let dpr = 1

  const ridimensiona = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(window.innerWidth * dpr)
    canvas.height = Math.round(window.innerHeight * dpr)
  }
  ridimensiona()

  const disegna = (ora: number) => {
    raf = 0
    if (!ctx) return
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    const vive: Particella[] = []
    for (const p of particelle) {
      const k = (ora - p.t0) / p.durata
      if (k < 0) {
        vive.push(p)
        continue
      }
      if (k >= 1) {
        if (!p.arrivo && p.onArrivo) {
          p.arrivo = true
          p.onArrivo()
        }
        continue
      }
      vive.push(p)
      ctx.globalAlpha = p.tipo === 'scia' ? (1 - k) * 0.7 : 0.35 + 0.65 * Math.sin(Math.PI * Math.min(1, k * 1.15))
      ctx.fillStyle = p.colore
      const [x, y] = p.tipo === 'scia' ? p.da : curvaTocco(morbida(k), p.da, p.a)
      ctx.beginPath()
      ctx.arc(x, y, p.tipo === 'scia' ? p.raggio * (1 - k * 0.5) : p.raggio, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1
    particelle = vive
    if (particelle.length) raf = requestAnimationFrame(disegna)
    else ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
  }
  const avvia = () => {
    if (!raf) raf = requestAnimationFrame(disegna)
  }

  return {
    tocca(da, el, colore, n, alArrivo) {
      const r = el.getBoundingClientRect()
      const ora = performance.now()
      const quante = Math.min(n, MASSIMO)
      for (let i = 0; i < quante; i++) {
        const ultima = i === quante - 1
        particelle.push({
          t0: ora + (i / quante) * 90,
          durata: DURATA_TOCCO,
          da: [da[0] + (Math.random() - 0.5) * 36, da[1] + (Math.random() - 0.5) * 36],
          a: [r.left + Math.random() * r.width, r.top + r.height * (0.25 + Math.random() * 0.5)],
          raggio: 1.2 + Math.random() * 1.6,
          colore,
          arrivo: false,
          tipo: 'tocco',
          // la parola prende il colore quando arriva l'ultima particella
          onArrivo: ultima ? alArrivo : undefined,
        })
      }
      if (quante === 0) alArrivo()
      avvia()
    },
    scia(x, y, colore) {
      if (particelle.length >= MASSIMO) return
      particelle.push({ t0: performance.now(), durata: DURATA_SCIA, da: [x + (Math.random() - 0.5) * 6, y + (Math.random() - 0.5) * 6], a: [x, y], raggio: 1.4 + Math.random() * 1.4, colore, arrivo: true, tipo: 'scia' })
      avvia()
    },
    svuota() {
      particelle = []
      if (ctx) ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    },
    ridimensiona,
    dispose() {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
      particelle = []
    },
  }
}
