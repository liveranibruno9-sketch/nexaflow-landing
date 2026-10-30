// Campionamento delle immagini del varco: da un'immagine a una nuvola di punti (nessun accesso al DOM): si prova con `npm test`.
// Solo TypeScript "cancellabile" (Node toglie i tipi): niente enum, namespace o parametri-proprietà.
import type { Materia } from './tipi.ts'

/** generatore pseudo-casuale con seme: stessa sequenza a ogni caricamento, così una particella ha sempre la stessa posizione */
export function mulberry32(seme: number): () => number {
  let a = seme >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export type Pixel = { dati: Uint8ClampedArray; w: number; h: number } // RGBA

/**
 * n punti presi dall'immagine con passo variabile: fitti dove è luminosa, quasi nessuno nel nero (D40).
 * pos = n·3 (x, y nel quadro 0..1 dall'alto, z = profondità 0..1 dalla mappa, 0,5 senza mappa);
 * col = n·3 in 0..1 (sRGB, il colore del pixel scelto).
 * Peso di un pixel: max(0, L − 0,04)^0,8 con L = luminanza 0..1. Immagine tutta nera: punti uniformi (mai NaN).
 */
export function campiona(img: Pixel, prof: Pixel | null, n: number, seme: number): { pos: Float32Array; col: Float32Array } {
  const pos = new Float32Array(Math.max(0, n) * 3)
  const col = new Float32Array(Math.max(0, n) * 3)
  if (!(n > 0) || img.w <= 0 || img.h <= 0) return { pos, col }
  const caso = mulberry32(seme)
  const totale = img.w * img.h
  const cumulata = new Float64Array(totale)
  let somma = 0
  for (let i = 0; i < totale; i++) {
    const o = i * 4
    const L = (0.2126 * img.dati[o] + 0.7152 * img.dati[o + 1] + 0.0722 * img.dati[o + 2]) / 255
    somma += Math.pow(Math.max(0, L - 0.04), 0.8)
    cumulata[i] = somma
  }
  for (let k = 0; k < n; k++) {
    let i: number
    if (somma > 0) {
      // il primo pixel la cui cumulata supera r: i pixel senza peso hanno la stessa cumulata del precedente e non vengono mai scelti
      const r = caso() * somma
      let a = 0
      let b = totale - 1
      while (a < b) {
        const m = (a + b) >> 1
        if (cumulata[m] > r) b = m
        else a = m + 1
      }
      i = a
    } else {
      i = Math.min(totale - 1, Math.floor(caso() * totale))
    }
    const px = i % img.w
    const py = (i - px) / img.w
    const x = (px + caso()) / img.w
    const y = (py + caso()) / img.h
    pos[k * 3] = x
    pos[k * 3 + 1] = y
    if (prof && prof.w > 0 && prof.h > 0) {
      const qx = Math.min(prof.w - 1, Math.floor(x * prof.w))
      const qy = Math.min(prof.h - 1, Math.floor(y * prof.h))
      pos[k * 3 + 2] = prof.dati[(qy * prof.w + qx) * 4] / 255
    } else {
      pos[k * 3 + 2] = 0.5
    }
    const o = i * 4
    col[k * 3] = img.dati[o] / 255
    col[k * 3 + 1] = img.dati[o + 1] / 255
    col[k * 3 + 2] = img.dati[o + 2] / 255
  }
  return { pos, col }
}

/**
 * La materia di un colore (0..255), in HSL, regole in ordine: molto chiaro → saette · poco saturo → cromo ·
 * tinte 250-300 → saette (il viola) · 165-200 → vetro · 200-250 → polvere · tutto il resto (i caldi) → cromo.
 */
export function materiaDaColore(r: number, g: number, b: number): Materia {
  const R = r / 255
  const G = g / 255
  const B = b / 255
  const max = Math.max(R, G, B)
  const min = Math.min(R, G, B)
  const l = (max + min) / 2
  if (l > 0.9) return 'saette'
  const d = max - min
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))
  if (s < 0.25) return 'cromo'
  let h: number
  if (max === R) h = 60 * (((G - B) / d) % 6)
  else if (max === G) h = 60 * ((B - R) / d + 2)
  else h = 60 * ((R - G) / d + 4)
  if (h < 0) h += 360
  if (h >= 250 && h < 300) return 'saette'
  if (h >= 165 && h < 200) return 'vetro'
  if (h >= 200 && h < 250) return 'polvere'
  return 'cromo'
}
