// La materia: le particelle delle quattro materie (polvere, vetro, saette, cromo) sul canvas `tela-materia`,
// sopra la scena e sotto i testi. Scrive il nome e i motti lettera per lettera (le lettere sono <span class="lettera">
// di testo vero, rese dal Film), fa il velo nei passaggi fra gli agenti (D31), la convergenza nel pulsante (D22),
// la scia del cursore e l'anello al tocco (D26), il burst delle frasi delle pagine servizio (D28).
// Le frasi restano testo HTML: nel canvas vanno solo particelle.
//
// Prestazioni (spec §15, R12): un solo array per proprietà (Float32Array), nessuna allocazione per particella nel ciclo;
// le morte si tolgono scambiandole con l'ultima viva; con la riserva piena si riusa a rotazione. Quattro "timbri"
// disegnati una volta (uno per materia) e copiati con drawImage. Quando non c'è niente di vivo il canvas si pulisce
// una volta e `passo` dice al motore che può fermarsi.
import { liscio } from './calcoli'
import { MATERIE, PRESET, convergenzaIn, letteraVisibile, rettangoloFotogramma } from './materia-calcoli'
import type { Materia } from '../varco/tipi'

export type Materie = {
  /** n particelle della materia m attorno a (x, y) in px CSS del palco; `anello` = in cerchio (il tocco sul telefono) */
  burst(x: number, y: number, m: Materia, n: number, anello?: boolean): void
  /**
   * scrive le prime lettere (span.lettera) di el fino a t ∈ [0, 1]; a ogni lettera nuova un burst dove sta.
   * scoppio = false: le lettere si scrivono senza particelle (scroll veloce o primo disegno)
   */
  scrivi(el: HTMLElement, m: Materia | 'ciclo', t: number, scoppio?: boolean): void
  /**
   * il velo di un passaggio fra due scene: emette in proporzione a quanto t si è mosso dall'ultima chiamata.
   * emetti = false: segue t senza emettere (scroll veloce)
   */
  velo(da: Materia, a: Materia, t: number, emetti?: boolean): void
  /** le particelle delle materie m vanno verso la meta lungo una curva; t ∈ (0, 1), fuori non si vede nulla */
  convergi(meta: [number, number], t: number, m: Materia[]): void
  /** la scia del cursore */
  scia(x: number, y: number, m: Materia): void
  /** avanza di dt secondi e disegna; W, H = palco in px CSS. true se servono altri fotogrammi (particelle vive) */
  passo(dt: number, W: number, H: number): boolean
  /** spegne tutto: particelle, lettere scritte, canvas */
  svuota(): void
}

// per materia (indici di MATERIE): velocità iniziale [min, max] in px/s, attrito per fotogramma a 60 Hz,
// rotazione massima in rad/s, larghezza disegnata = raggio × scala
const VEL_MIN = [8, 40, 20, 6]
const VEL_MAX = [34, 150, 90, 40]
const ATTRITO = [0.955, 0.965, 0.9, 0.985]
const GIRO = [0, 9, 0, 0]
const SCALA = [8, 6, 2.6, 5.5]
const POLVERE = 0, VETRO = 1, SAETTE = 2, CROMO = 3
const TIMBRO = 64                       // lato del timbro in pixel
const DUE_PI = Math.PI * 2
const DURATA_CONV = 0.45                // ogni particella della convergenza viaggia per 0,45 della finestra
const RITARDO_CONV = 0.3                // e parte con un ritardo fino a 0,3: arrivano fra 0,45 e 0,75

const indice = (m: Materia): number => MATERIE.indexOf(m)
const caso = (a: number, b: number) => a + Math.random() * (b - a)

/** il timbro di una materia: disegnato una volta su un canvas fuori schermo, centrato, orientato verso +x */
function timbro(m: Materia): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = c.height = TIMBRO
  const g = c.getContext('2d')
  if (!g) return c
  const p = PRESET[m]
  const h = TIMBRO / 2
  g.translate(h, h)
  if (p.forma === 'punto') {
    // punto morbido: cuore bianco, alone del colore
    const r = g.createRadialGradient(0, 0, 0, 0, 0, h)
    r.addColorStop(0, 'rgba(255,255,255,1)')
    r.addColorStop(0.16, p.colore)
    r.addColorStop(0.42, p.colore + '59')
    r.addColorStop(1, p.colore + '00')
    g.fillStyle = r
    g.fillRect(-h, -h, TIMBRO, TIMBRO)
  } else if (p.forma === 'scheggia') {
    // scheggia angolare con un filo di luce su un lato
    g.beginPath(); g.moveTo(-28, -7); g.lineTo(28, 0); g.lineTo(-16, 10); g.closePath()
    g.fillStyle = p.colore + 'd9'
    g.fill()
    g.beginPath(); g.moveTo(-28, -7); g.lineTo(28, 0)
    g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 2.5; g.stroke()
  } else if (p.forma === 'segmento') {
    // segmento spezzato bianco col filo viola attorno
    g.beginPath(); g.moveTo(-30, 1); g.lineTo(-11, -8); g.lineTo(4, 7); g.lineTo(30, -2)
    g.lineJoin = 'miter'
    g.shadowColor = p.colore2 || p.colore; g.shadowBlur = 10
    g.strokeStyle = p.colore; g.lineWidth = 3.5; g.stroke()
    g.shadowBlur = 0; g.lineWidth = 1.5; g.stroke()
  } else {
    // goccia: testa tonda verso +x, coda sottile; argento con il riflesso caldo della luce
    g.beginPath()
    g.moveTo(-30, 0)
    g.quadraticCurveTo(-4, -12, 12, -12)
    g.arc(12, 0, 12, -Math.PI / 2, Math.PI / 2)
    g.quadraticCurveTo(-4, 12, -30, 0)
    g.closePath()
    const r = g.createRadialGradient(16, -5, 0, 10, 0, 18)
    r.addColorStop(0, p.colore2 || '#ffffff')
    r.addColorStop(0.35, p.colore)
    r.addColorStop(1, 'rgba(120,116,108,.9)')
    g.fillStyle = r
    g.fill()
  }
  return c
}

type Scritto = { el: HTMLElement; lettere: HTMLElement[]; n: number }

export function creaMateria(canvas: HTMLCanvasElement, limite: number): Materie {
  const ctx = canvas.getContext('2d')
  const N = ctx ? Math.max(0, Math.floor(limite)) : 0
  const nConv = Math.round(N * 0.4)           // la convergenza ha le sue (calcolate da t, non simulate)
  const cap = N - nConv

  // la riserva: una proprietà per array
  const X = new Float32Array(cap), Y = new Float32Array(cap)
  const VX = new Float32Array(cap), VY = new Float32Array(cap)
  const VITA = new Float32Array(cap), DURATA = new Float32Array(cap)
  const R = new Float32Array(cap), ANG = new Float32Array(cap), VANG = new Float32Array(cap)
  const MAT = new Uint8Array(cap)
  let vivi = 0
  let cursore = 0

  // la convergenza: partenza in frazioni del fotogramma (si adatta al ridimensionamento), ritardo, misura, materia
  const CFX = new Float32Array(nConv), CFY = new Float32Array(nConv)
  const CRIT = new Float32Array(nConv), CR = new Float32Array(nConv)
  const CMAT = new Uint8Array(nConv)
  let convPronta = false
  let convT = 0
  let convMx = 0, convMy = 0
  const punto: [number, number] = [0, 0]

  const timbri = ctx ? MATERIE.map(timbro) : []
  const att = new Float32Array(4)             // attrito del passo (dipende da dt)
  const GRAV = MATERIE.map((m) => PRESET[m].gravita)

  let larg = 0, alt = 0                        // palco in px CSS (dall'ultimo passo)
  let sporco = false                           // c'è qualcosa sul canvas
  let veloChiave = '', veloT = 0, veloResto = 0
  let sciaX = -1, sciaY = -1, sciaOra = 0
  const scritti = new Map<HTMLElement, Scritto>()

  function misura() {
    if (!larg || !alt) { larg = canvas.clientWidth; alt = canvas.clientHeight }
  }

  /** una particella nuova della materia k in (x, y); ritorna l'indice (−1 se la riserva è vuota) */
  function nasci(k: number, x: number, y: number): number {
    if (cap <= 0) return -1
    let i: number
    if (vivi < cap) i = vivi++
    else { i = cursore; cursore = (cursore + 1) % cap }  // piena: si riusa a rotazione
    const p = PRESET[MATERIE[k]]
    MAT[i] = k
    X[i] = x; Y[i] = y
    R[i] = caso(p.raggio[0], p.raggio[1])
    DURATA[i] = VITA[i] = caso(p.vita[0], p.vita[1])
    const dir = Math.random() * DUE_PI
    const v = caso(VEL_MIN[k], VEL_MAX[k])
    VX[i] = Math.cos(dir) * v
    VY[i] = Math.sin(dir) * v
    if (k === CROMO) { VX[i] *= 0.4; VY[i] = Math.abs(VY[i]) * 0.5 + 12 }   // il cromo cola
    ANG[i] = Math.random() * DUE_PI
    VANG[i] = (Math.random() - 0.5) * 2 * GIRO[k]
    return i
  }

  function burst(x: number, y: number, m: Materia, n: number, anello = false) {
    const k = indice(m)
    if (k < 0) return
    for (let j = 0; j < n; j++) {
      if (anello) {
        // tutte uguali in cerchio; la velocità tiene conto dell'attrito della materia: l'anello si apre di ~44 px
        const a = (j / n) * DUE_PI
        const v = 44 * -Math.log(ATTRITO[k]) * 60
        const i = nasci(k, x + Math.cos(a) * 4, y + Math.sin(a) * 4)
        if (i < 0) return
        VX[i] = Math.cos(a) * v; VY[i] = Math.sin(a) * v
        DURATA[i] = VITA[i] = 0.55
        ANG[i] = a
      } else if (nasci(k, x + (Math.random() - 0.5) * 12, y + (Math.random() - 0.5) * 12) < 0) return
    }
  }

  function scrivi(el: HTMLElement, m: Materia | 'ciclo', t: number, scoppio = true) {
    let s = scritti.get(el)
    if (!s) {
      s = { el, lettere: Array.from(el.querySelectorAll<HTMLElement>('.lettera')), n: 0 }
      scritti.set(el, s)
    }
    const k = letteraVisibile(s.lettere.length, t)
    if (k === s.n) return
    if (k > s.n) {
      // prima tutte le letture (posizioni), poi le scritture (classi): niente ricalcoli a ogni lettera.
      // Se si salta avanti di molto (scroll veloce) il burst va solo alle ultime 6.
      const da = Math.max(s.n, k - 6)
      if (scoppio && cap > 0 && k > da) {
        const c = canvas.getBoundingClientRect()
        for (let i = da; i < k; i++) {
          const r = s.lettere[i].getBoundingClientRect()
          if (!r.width || !r.height) continue
          const kk = m === 'ciclo' ? i % MATERIE.length : indice(m)
          const quante = Math.round(Math.min(16, Math.max(4, r.height * 0.12)))
          for (let j = 0; j < quante; j++) {
            if (nasci(kk, r.left - c.left + Math.random() * r.width, r.top - c.top + r.height * caso(0.2, 0.9)) < 0) break
          }
        }
      }
      for (let i = s.n; i < k; i++) s.lettere[i].classList.add('scritta')
    } else {
      for (let i = k; i < s.n; i++) s.lettere[i].classList.remove('scritta')
    }
    const prima = s.n
    s.n = k
    const tutte = s.lettere.length
    if ((prima === tutte) !== (k === tutte)) el.classList.toggle('scritto', k === tutte)
  }

  function velo(da: Materia, a: Materia, t: number, emetti = true) {
    if (cap <= 0) return
    const chiave = da + '>' + a
    if (chiave !== veloChiave) { veloChiave = chiave; veloT = t; veloResto = 0; return }
    const passo = Math.abs(t - veloT)
    veloT = t
    if (!passo || !emetti) return
    // emissione proporzionale al cammino di t, più fitta a metà del passaggio (sin πt)
    veloResto += passo * cap * 0.95 * Math.sin(Math.PI * Math.min(1, Math.max(0, t)))
    const n = Math.min(60, Math.floor(veloResto))
    veloResto -= n
    if (!n) return
    misura()
    const fr = rettangoloFotogramma(larg, alt)
    const x0 = Math.max(0, fr.x), x1 = Math.min(larg, fr.x + fr.w)
    const kDa = indice(da), kA = indice(a)
    for (let j = 0; j < n; j++) {
      // prima della metà più materia vecchia, dopo più materia nuova
      const i = nasci(Math.random() < t ? kA : kDa, caso(x0, x1), caso(fr.y + 0.06 * fr.h, fr.y + 0.94 * fr.h))
      if (i < 0) return
      VX[i] *= 0.6; VY[i] *= 0.6
    }
  }

  function convergi(meta: [number, number], t: number, m: Materia[]) {
    convT = t
    convMx = meta[0]; convMy = meta[1]
    if (convPronta || nConv <= 0 || !m.length) return
    // le partenze: ogni materia dal suo quarto del fotogramma (polvere in alto a sinistra, vetro in alto a destra,
    // saette in basso a sinistra, cromo in basso a destra), lontano dalla testata e dalla barra
    for (let i = 0; i < nConv; i++) {
      const k = Math.max(0, indice(m[i % m.length]))
      const qx = k & 1, qy = k >> 1
      CMAT[i] = k
      CFX[i] = qx * 0.5 + Math.random() * 0.5
      CFY[i] = 0.1 + (qy * 0.5 + Math.random() * 0.5) * 0.74
      CRIT[i] = Math.random() * RITARDO_CONV
      const p = PRESET[MATERIE[k]]
      CR[i] = caso(p.raggio[0], p.raggio[1]) * 1.25
    }
    convPronta = true
  }

  function scia(x: number, y: number, m: Materia) {
    const k = indice(m)
    if (k < 0 || cap <= 0) return
    const ora = performance.now()
    const vecchia = ora - sciaOra > 120 || sciaX < 0
    const n = vecchia ? 1 : Math.min(4, Math.floor(Math.hypot(x - sciaX, y - sciaY) / 9))
    for (let j = 1; j <= n; j++) {
      const q = vecchia ? 1 : j / n
      const i = nasci(k, sciaX + (x - sciaX) * q, sciaY + (y - sciaY) * q)
      if (i < 0) break
      // la scia: più piccola, più lenta, più breve
      R[i] *= 0.7
      VX[i] *= 0.25; VY[i] *= 0.25
      DURATA[i] = VITA[i] = VITA[i] * 0.55
    }
    if (n > 0 || vecchia) { sciaX = x; sciaY = y; sciaOra = ora }
  }

  function aggiorna(dt: number) {
    for (let k = 0; k < 4; k++) att[k] = Math.pow(ATTRITO[k], dt * 60)
    for (let i = 0; i < vivi;) {
      VITA[i] -= dt
      if (VITA[i] <= 0) {
        // morta: al suo posto l'ultima viva
        const u = --vivi
        if (i !== u) {
          X[i] = X[u]; Y[i] = Y[u]; VX[i] = VX[u]; VY[i] = VY[u]; VITA[i] = VITA[u]; DURATA[i] = DURATA[u]
          R[i] = R[u]; ANG[i] = ANG[u]; VANG[i] = VANG[u]; MAT[i] = MAT[u]
        }
        continue
      }
      const k = MAT[i]
      VX[i] *= att[k]
      VY[i] = VY[i] * att[k] + GRAV[k] * dt
      X[i] += VX[i] * dt
      Y[i] += VY[i] * dt
      ANG[i] += VANG[i] * dt
      if (k === SAETTE) {
        // nervose: piccoli scatti e cambi di direzione
        X[i] += (Math.random() - 0.5) * 3
        Y[i] += (Math.random() - 0.5) * 3
        if (Math.random() < 0.35) ANG[i] = Math.random() * DUE_PI
      }
      i++
    }
    if (cursore >= vivi) cursore = 0
  }

  function disegna(k: number, x: number, y: number, raggio: number, ang: number, alfa: number, dpr: number) {
    if (!ctx || alfa <= 0.01 || x < -40 || y < -40 || x > larg + 40 || y > alt + 40) return
    const s = (raggio * SCALA[k] * dpr) / TIMBRO
    const c = Math.cos(ang) * s, sn = Math.sin(ang) * s
    ctx.setTransform(c, sn, -sn, c, x * dpr, y * dpr)
    ctx.globalAlpha = alfa > 1 ? 1 : alfa
    ctx.drawImage(timbri[k], -TIMBRO / 2, -TIMBRO / 2)
  }

  function passo(dt: number, W: number, H: number): boolean {
    larg = W; alt = H
    if (vivi > 0) aggiorna(dt)
    const conv = convPronta && convT > 0 && convT < DURATA_CONV + RITARDO_CONV
    if (!ctx || !canvas.width) return vivi > 0
    if (!vivi && !conv) {
      if (sporco) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height); sporco = false }
      return false
    }
    const dpr = canvas.width / Math.max(1, W)
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.globalCompositeOperation = 'lighter'
    for (let i = 0; i < vivi; i++) {
      const k = MAT[i]
      const f = VITA[i] / DURATA[i]             // 1 alla nascita, 0 alla morte
      let a: number
      if (k === POLVERE) a = Math.min(1, (1 - f) * 8) * Math.min(1, f * 1.6)
      else if (k === SAETTE) a = (Math.random() < 0.22 ? 0.3 : 1) * Math.min(1, f * 3)
      else a = Math.min(1, f * (k === VETRO ? 2 : 2.5))
      const ang = k === CROMO ? Math.atan2(VY[i], VX[i]) : k === POLVERE ? 0 : ANG[i]
      disegna(k, X[i], Y[i], R[i], ang, a * 0.92, dpr)
    }
    if (conv) {
      const fr = rettangoloFotogramma(W, H)
      const x0 = Math.max(0, fr.x), w = Math.min(W, fr.x + fr.w) - x0
      for (let i = 0; i < nConv; i++) {
        const tt = (convT - CRIT[i]) / DURATA_CONV
        if (tt <= 0 || tt >= 1) continue
        const sx = x0 + CFX[i] * w, sy = fr.y + CFY[i] * fr.h
        convergenzaIn(punto, tt, sx, sy, convMx, convMy)
        const k = CMAT[i]
        const a = liscio(0, 0.15, tt) * (1 - liscio(0.78, 1, tt))
        const ang = k === POLVERE ? 0 : k === SAETTE ? Math.random() * DUE_PI : Math.atan2(convMy - punto[1], convMx - punto[0])
        disegna(k, punto[0], punto[1], CR[i] * (1 - 0.35 * tt), ang, a, dpr)
      }
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'source-over'
    sporco = true
    return vivi > 0
  }

  function svuota() {
    vivi = 0; cursore = 0
    convT = 0
    veloChiave = ''; veloResto = 0
    sciaX = sciaY = -1
    scritti.forEach((s) => {
      for (const l of s.lettere) l.classList.remove('scritta')
      s.el.classList.remove('scritto')
    })
    scritti.clear()
    if (ctx && canvas.width) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height) }
    sporco = false
  }

  return { burst, scrivi, velo, convergi, scia, passo, svuota }
}
