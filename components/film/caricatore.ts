// Caricamento dei fotogrammi (porting della parte "Immagini" di molino-nuovo/molino.js).
// Sequenza d'apertura: si tengono in memoria solo i fotogrammi vicini alla posizione (su iPhone ognuno
// decodificato pesa circa 2 MB). Scene (13 immagini 9:16): una volta caricate restano, precaricate due per volta
// in ordine di regia quando la sequenza non sta caricando; una scena chiesta dal disegno passa davanti a tutte.
import { fuoriFinestra, prossimoDaCaricare } from './calcoli'
import type { Modo } from './modo'

const DAVANTI = 22, DIETRO = 8   // fotogrammi tenuti attorno alla posizione (≈ 30 al massimo)
const DAVANTI_FERMA = 8          // finché non si scorre se ne caricano meno: la prima apertura resta leggera
const PARALLELI = 3              // richieste di rete contemporanee per la sequenza
const PARALLELI_SCENE = 2

/** nomi di scena che non sono file: si disegnano in codice (studio) o dalla sequenza (apertura) */
const SENZA_FILE = ['studio', 'apertura']

export type Caricatore = {
  posiziona(pos: number, mosso: boolean): void
  fotogramma(i: number): HTMLImageElement | null
  pronto(i: number): boolean
  scena(nome: string): HTMLImageElement | null
  precarica(nomi: string[]): void
  ferma(): void
}

const numero = (i: number) => String(i + 1).padStart(3, '0')

/** decodifica fuori dal disegno; ok = false se il file manca o non si decodifica */
function scarica(src: string, fine: (im: HTMLImageElement, ok: boolean) => void): HTMLImageElement {
  const im = new Image()
  im.decoding = 'async'
  im.src = src
  if (im.decode) im.decode().then(() => fine(im, true), () => fine(im, false))
  else { im.onload = () => fine(im, true); im.onerror = () => fine(im, false) }
  return im
}

export function creaCaricatore(opz: { modo: Modo; misura: 720 | 1080; conteggio: number; onPronto: () => void }): Caricatore {
  const n = Math.max(0, opz.conteggio | 0)
  const img: (HTMLImageElement | null)[] = new Array(n).fill(null)
  const pronti: boolean[] = new Array(n).fill(false)
  const richiesti: boolean[] = new Array(n).fill(false)
  let inCorso = 0
  let pos = 0
  let mosso = false
  let fermo = false

  const scene = new Map<string, HTMLImageElement>()   // pronte
  const scenaInCorso = new Set<string>()
  const fallite = new Set<string>()                    // file mancanti: non si richiedono a ogni disegno
  let coda: string[] = []

  const sequenzaLibera = () => inCorso === 0 && prossimoDaCaricare(pos, richiesti, mosso ? DAVANTI : DAVANTI_FERMA, DIETRO) < 0

  function caricaFotogramma(i: number) {
    richiesti[i] = true
    inCorso++
    const im = scarica(`/film/apertura/${opz.modo}/f${numero(i)}.webp`, (im, ok) => {
      inCorso--
      if (fermo) return
      if (img[i] === im && ok) { pronti[i] = true; opz.onPronto() }
      pompa()
    })
    img[i] = im
  }

  function caricaScena(nome: string) {
    scenaInCorso.add(nome)
    scarica(`/film/scene/${nome}-${opz.misura}.webp`, (im, ok) => {
      scenaInCorso.delete(nome)
      if (fermo) return
      if (ok) { scene.set(nome, im); opz.onPronto() } else fallite.add(nome)
      pompa()
    })
  }

  function pompa() {
    if (fermo) return
    // la sequenza: via quelli lontani, poi i più vicini alla posizione (davanti costa meno di dietro)
    for (let i = 0; i < n; i++) {
      if (richiesti[i] && fuoriFinestra(i, pos, DAVANTI + 6, DIETRO + 6)) { img[i] = null; pronti[i] = false; richiesti[i] = false }
    }
    while (inCorso < PARALLELI) {
      const j = prossimoDaCaricare(pos, richiesti, mosso ? DAVANTI : DAVANTI_FERMA, DIETRO)
      if (j < 0) break
      caricaFotogramma(j)
    }
    // le scene: in ordine di coda, solo quando la sequenza ha finito la sua finestra (tranne le urgenti, vedi scena())
    while (scenaInCorso.size < PARALLELI_SCENE && coda.length && sequenzaLibera()) caricaScena(coda.shift() as string)
  }

  return {
    posiziona(p, m) {
      pos = isFinite(p) ? p : 0
      mosso = mosso || m
      pompa()
    },
    fotogramma: (i) => (pronti[i] ? img[i] : null),
    pronto: (i) => !!pronti[i],
    scena(nome) {
      if (SENZA_FILE.includes(nome)) return null
      const im = scene.get(nome)
      if (im) return im
      // serve adesso: passa davanti alla coda e parte subito, anche se la sequenza sta caricando
      if (!fermo && !scenaInCorso.has(nome) && !fallite.has(nome)) { coda = coda.filter((x) => x !== nome); caricaScena(nome) }
      return null
    },
    precarica(nomi) {
      coda = []
      for (const x of nomi) if (!SENZA_FILE.includes(x) && !scene.has(x) && !scenaInCorso.has(x) && !fallite.has(x) && !coda.includes(x)) coda.push(x)
      pompa()
    },
    ferma() {
      fermo = true
      coda = []
      img.fill(null)
      scene.clear()
    },
  }
}
