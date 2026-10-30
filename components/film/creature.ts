// La creatura animata dentro la scena del beneficio (D32): il ritaglio del fotogramma X-2 (l'orsetto, la volpe, lo scoiattolo,
// il leprotto) disegnato in codice sopra X-3, in basso a sinistra, con la materia dell'agente. Niente testo nel canvas.
//
// Il ritaglio si prepara UNA volta per creatura (canvas fuori schermo, con la maschera morbida sui bordi che nasconde il
// pavimento); a ogni fotogramma resta un solo drawImage con trasformazione e alfa. La composizione è `screen`: il nero dello
// studio diventa trasparente e restano solo luce e materia (le creature sono state generate su fondo nero).
import { bagliore, postoCreatura, ritmoCreatura } from './creature-calcoli.ts'
import type { Fotogramma } from './creature-calcoli.ts'
import { liscio } from './calcoli'
import type { Creatura } from './regia'

/** la maschera: rampa morbida (smoothstep a 5 punti) su ogni bordo, in frazioni del ritaglio */
const BORDO = { sinistra: 0.1, destra: 0.1, alto: 0.07, basso: 0.1 }
/** la maschera radiale (ellisse del ritaglio, r = 1 al bordo): piena fino a DENTRO, a zero a FUORI: toglie gli angoli e il pavimento */
const DENTRO = 0.88
const FUORI = 1.28
const RAMPA = [0, 0.25, 0.5, 0.75, 1].map((t) => [t, t * t * (3 - 2 * t)] as const)
/** il livello di nero toglie almeno questo (su 255): attorno alla creatura c'è sempre un po' di luce diffusa */
const SFONDO_MIN = 20
/** la fiammella di Prometheus: bagliore additivo caldo, raggio 0,06 della colonna */
const RAGGIO_FIAMMA = 0.06
const FIAMMA = '255, 176, 80'

type Pronta = { cv: HTMLCanvasElement; aspetto: number }
const pronte = new WeakMap<HTMLImageElement, Pronta>()

export type OpzioniCreatura = {
  /** la posa finale non va più a sinistra di così (px del canvas): sul telefono la colonna esce dallo schermo */
  xMin?: number
  /** il piede non scende più di così (px del canvas): c'è una frase sotto */
  piedeMax?: number
  /** senza movimento: niente ingresso da sinistra, niente balzo, solo la posa finale con la dissolvenza */
  fermo?: boolean
}

/** una rampa di alfa lungo un asse: da 0 a 1 in `da`, 1 fino a `1 - a`, di nuovo 0 alla fine */
function rampa(g: CanvasRenderingContext2D, x1: number, y1: number, da: number, a: number): CanvasGradient {
  const gr = g.createLinearGradient(0, 0, x1, y1)
  for (const [t, v] of RAMPA) gr.addColorStop(t * da, `rgba(0,0,0,${v})`)
  gr.addColorStop(da, 'rgba(0,0,0,1)')
  gr.addColorStop(1 - a, 'rgba(0,0,0,1)')
  for (const [t, v] of RAMPA) gr.addColorStop(1 - a + t * a, `rgba(0,0,0,${1 - v})`)
  return gr
}

/**
 * Toglie il "nero" dello sfondo: il fondo delle immagini non è nero puro (navy per Atlas, 7-26 su 255 secondo la creatura, più la luce diffusa attorno) e
 * con `screen` si vedrebbe come un riquadro più chiaro sulla scena. Il livello è il 25° percentile del bordo del ritaglio
 * (dove c'è solo sfondo), mai sotto SFONDO_MIN; da ogni canale si toglie e si riscala il resto, così i gradienti della creatura restano.
 */
function togliSfondo(g: CanvasRenderingContext2D, ow: number, oh: number): void {
  try {
    const d = g.getImageData(0, 0, ow, oh)
    const px = d.data
    const spessore = Math.max(2, Math.round(Math.min(ow, oh) * 0.03))
    const istogramma = new Uint32Array(256)
    let n = 0
    for (let y = 0; y < oh; y++) {
      const bordoY = y < spessore || y >= oh - spessore
      for (let x = 0; x < ow; x++) {
        if (!bordoY && x >= spessore && x < ow - spessore) { x = ow - spessore - 1; continue }
        const i = (y * ow + x) * 4
        istogramma[Math.max(px[i], px[i + 1], px[i + 2])]++
        n++
      }
    }
    let lo = 0
    for (let acc = 0, v = 0; v < 256; v++) { acc += istogramma[v]; if (acc >= n * 0.25) { lo = v; break } }
    lo = Math.max(lo, SFONDO_MIN)
    const tabella = new Uint8ClampedArray(256)
    for (let v = 0; v < 256; v++) tabella[v] = Math.max(0, v - lo) * (255 / (255 - lo))
    for (let i = 0; i < px.length; i += 4) { px[i] = tabella[px[i]]; px[i + 1] = tabella[px[i + 1]]; px[i + 2] = tabella[px[i + 2]] }
    g.putImageData(d, 0, 0)
  } catch {
    // canvas "sporco" (immagine di un altro dominio): si usa il ritaglio com'è
  }
}

/** il ritaglio con la maschera, a una larghezza di `larg` px (mai oltre quella del file) */
function prepara(img: HTMLImageElement, c: Creatura, larg: number): Pronta | null {
  const sw = c.ritaglio[2] * img.naturalWidth, sh = c.ritaglio[3] * img.naturalHeight
  if (!(sw > 0 && sh > 0)) return null
  const ow = Math.max(1, Math.round(Math.min(sw, Math.max(160, larg))))
  const oh = Math.max(1, Math.round((ow * sh) / sw))
  const cv = document.createElement('canvas')
  cv.width = ow
  cv.height = oh
  const g = cv.getContext('2d')
  if (!g) return null
  g.imageSmoothingQuality = 'high'
  g.drawImage(img, c.ritaglio[0] * img.naturalWidth, c.ritaglio[1] * img.naturalHeight, sw, sh, 0, 0, ow, oh)
  togliSfondo(g, ow, oh)
  g.globalCompositeOperation = 'destination-in'
  g.fillStyle = rampa(g, ow, 0, BORDO.sinistra, BORDO.destra)
  g.fillRect(0, 0, ow, oh)
  g.fillStyle = rampa(g, 0, oh, BORDO.alto, BORDO.basso)
  g.fillRect(0, 0, ow, oh)
  // l'ellisse: il gradiente radiale è in uno spazio schiacciato (scala oh/ow) così r = 1 tocca i quattro lati
  g.save()
  g.translate(ow / 2, oh / 2)
  g.scale(1, oh / ow)
  const R = ow / 2
  const ra = g.createRadialGradient(0, 0, 0, 0, 0, R * FUORI)
  ra.addColorStop(0, 'rgba(0,0,0,1)')
  ra.addColorStop(DENTRO / FUORI, 'rgba(0,0,0,1)')
  for (const [t, v] of RAMPA) ra.addColorStop((DENTRO + t * (FUORI - DENTRO)) / FUORI, `rgba(0,0,0,${1 - v})`)
  g.fillStyle = ra
  g.fillRect(-ow, -ow, 2 * ow, 2 * ow)
  g.restore()
  const p = { cv, aspetto: sw / sh }
  pronte.set(img, p)
  return p
}

/**
 * Disegna la creatura c (ritaglio di `img` = il fotogramma X-2) sul fotogramma `fot` (px del canvas).
 * ingresso ∈ [0, 1]: l'entrata da sinistra; tempo in secondi per il moto a regime (0 = posa ferma).
 * L'alfa che c'è già su ctx (per esempio l'uscita) si moltiplica con quello dell'ingresso.
 * Il disegno resta dentro il fotogramma (e dentro lo schermo).
 */
export function disegnaCreatura(
  ctx: CanvasRenderingContext2D, img: HTMLImageElement, c: Creatura, fot: Fotogramma, ingresso: number, tempo: number,
  opz: OpzioniCreatura = {},
): void {
  if (!img.naturalWidth || !img.naturalHeight) return
  // preparata una volta; si rifà solo se lo schermo è cresciuto molto (resize) e il ritaglio era più piccolo del bisogno
  const voluta = 0.38 * fot.dw * 1.7
  let p = pronte.get(img)
  if (!p || (p.cv.width < voluta * 0.75 && p.cv.width < c.ritaglio[2] * img.naturalWidth - 1)) p = prepara(img, c, voluta) || p
  if (!p) return

  const entra = opz.fermo ? 1 : ingresso
  const alfa = ctx.globalAlpha * liscio(0, 0.7, ingresso)
  if (alfa <= 0.003) return
  const posto = postoCreatura(fot, p.aspetto, entra, opz)
  const moto = ritmoCreatura(opz.fermo ? 0 : tempo, fot.dw)

  ctx.save()
  // dentro la colonna e dentro lo schermo: l'ingresso "esce" dal bordo del fotogramma
  const x0 = Math.max(fot.dx, 0), x1 = Math.min(fot.dx + fot.dw, ctx.canvas.width)
  ctx.beginPath()
  ctx.rect(x0, fot.dy, x1 - x0, fot.dh)
  ctx.clip()
  // il perno è il piede, al centro: il balzo e la rotazione partono da lì
  ctx.translate(posto.x + posto.w / 2, posto.y + posto.h + moto.dy)
  ctx.rotate(moto.rot)
  ctx.imageSmoothingQuality = 'high'
  ctx.globalAlpha = alfa
  ctx.globalCompositeOperation = 'screen'
  ctx.drawImage(p.cv, -posto.w / 2, -posto.h, posto.w, posto.h)
  if (c.fiamma) {
    // il bagliore sulla fiammella, additivo, pulsa
    const r = RAGGIO_FIAMMA * fot.dw
    const fx = -posto.w / 2 + c.fiamma[0] * posto.w, fy = -posto.h + c.fiamma[1] * posto.h
    const g = ctx.createRadialGradient(fx, fy, 0, fx, fy, r)
    g.addColorStop(0, `rgba(${FIAMMA}, 1)`)
    g.addColorStop(0.45, `rgba(${FIAMMA}, 0.45)`)
    g.addColorStop(1, `rgba(${FIAMMA}, 0)`)
    ctx.globalAlpha = alfa * bagliore(opz.fermo ? 0 : tempo)
    ctx.globalCompositeOperation = 'lighter'
    ctx.fillStyle = g
    ctx.fillRect(fx - r, fy - r, 2 * r, 2 * r)
  }
  ctx.restore()
}
