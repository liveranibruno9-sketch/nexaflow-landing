// Tempi del varco: dove sta ogni blocco sul percorso, in che fase è il suo soggetto, che stato ha una frase (nessun
// accesso al DOM): si provano con `npm test`. u = posizione in schermate (1 = 100 svh) dall'inizio del percorso.
// Solo TypeScript "cancellabile" (Node toglie i tipi): niente enum, namespace o parametri-proprietà.
import { liscio } from '../film/calcoli.ts'
import type { Blocco, Fasi, Materia, Percorso, Tempi } from './tipi.ts'

/** unità del mondo per schermata (0,5 per vh, come i dentisti) */
export const VELOCITA = 50
export const zCamera = (u: number) => 10 - VELOCITA * u

/** un tratto dura 5,5 schermate: problema → creatura → beneficio → passaggio nella materia dopo */
const LUNGHEZZA_TRATTO = 5.5

const tra01 = (x: number) => (x > 0 ? (x < 1 ? x : 1) : 0)

/** indice dell'ultimo blocco con da <= u (0 prima del primo) */
export function bloccoAl(p: Percorso, u: number): number {
  let i = 0
  for (let k = 0; k < p.blocchi.length; k++) if (p.blocchi[k].da <= u) i = k
  return i
}

/** per ruolo: clamp((u - da) / (a - da), 0, 1), cioè t di ogni battuta del blocco */
export function tempi(b: Blocco, u: number): Tempi {
  const t: Tempi = {}
  for (const f of b.battute) t[f.ruolo] = f.a > f.da ? tra01((u - f.da) / (f.a - f.da)) : u >= f.a ? 1 : 0
  return t
}

/**
 * La finestra di un tratto che comincia in b: la polvere si raccoglie sul problema, si riordina nella creatura, poi nel
 * beneficio; le foto salgono e scendono una alla volta (mai due piene insieme); alla fine il tratto si sparge e passa nel dopo.
 */
export function fasiTratto(b: number, u: number): Fasi {
  const su = (da: number, a: number) => liscio(b + da, b + a, u)
  return {
    locale: tra01((u - b) / LUNGHEZZA_TRATTO),
    composto: su(0, 0.4) * (1 - su(5.0, 5.5)),
    forma: su(1.0, 2.1) + su(2.4, 2.8),
    foto: [
      su(0.15, 0.4) * (1 - su(1.0, 1.25)),
      su(1.75, 2.1) * (1 - su(2.4, 2.55)),
      su(2.65, 2.8) * (1 - su(5.0, 5.3)),
    ],
    uscita: su(4.4, 5.0),
  }
}

/** le fasi del soggetto di un blocco: tratto → fasiTratto; servizio e passi → la creatura già composta; gli altri → niente soggetto */
export function fasiBlocco(bl: Blocco, u: number): Fasi {
  if (bl.tipo === 'tratto') return fasiTratto(bl.da, u)
  const locale = bl.a > bl.da ? tra01((u - bl.da) / (bl.a - bl.da)) : u >= bl.a ? 1 : 0
  if (bl.tipo === 'servizio') return { locale, composto: 1, forma: 1, foto: [0, 1, 0], uscita: 0 }
  if (bl.tipo === 'passi') return { locale, composto: 1, forma: 1, foto: [0, 1, 0], uscita: liscio(bl.da, bl.a, u) }
  if (bl.tipo === 'mascotte') {
    // la mascotte si compone dalle particelle in mezza schermata, la foto affiora subito dopo, alla fine si disfa
    const su = (da: number, a: number) => liscio(bl.da + da, bl.da + a, u)
    const giu = (da: number, a: number) => 1 - liscio(bl.a - da, bl.a - a, u)
    return { locale, composto: su(0, 0.5) * giu(0.5, 0), forma: 1, foto: [0, su(0.35, 0.65) * giu(0.55, 0.3), 0], uscita: 0 }
  }
  return { locale, composto: 1, forma: 0, foto: [0, 0, 0], uscita: 0 }
}

const ENTRATA = 0.12 // schermate: dissolvenza incrociata, salita di 12 px, sfocatura 6 → 0
const USCITA = 0.08 // schermate: esce salendo di 8 px

/**
 * Opacità, spostamento verticale (px) e sfocatura (px) di una frase a u. Una frase che comincia a da <= 0 è visibile
 * subito (nessuna entrata). Se la finestra è più corta di entrata + uscita, le due metà si dividono lo spazio.
 */
export function statoFrase(f: { da: number; a: number }, u: number): { o: number; y: number; sfoca: number } {
  const meta = Math.max(0, (f.a - f.da) / 2)
  const entra = f.da <= 0 ? 1 : liscio(f.da, f.da + Math.min(ENTRATA, meta), u)
  const esce = liscio(f.a - Math.min(USCITA, meta), f.a, u)
  return { o: entra * (1 - esce), y: 12 * (1 - entra) - 8 * esce, sfoca: 6 * (1 - entra) }
}

/* ---------------------------------------------------------------------------
   Curva continua: interpolazione cubica monotona di Fritsch-Carlson, COPIATA da components/volo/scena.ts
   (il volo non si tocca). Non torna mai indietro, non supera i punti chiave, niente soste a scatti.
   --------------------------------------------------------------------------- */

export type Curva = { u: number[]; z: number[]; m: number[] }

export function preparaPercorso(punti: { u: number; z: number }[]): Curva {
  const u = punti.map((p) => p.u)
  const z = punti.map((p) => p.z)
  const n = punti.length
  const h = u.slice(1).map((x, i) => x - u[i])
  const d = h.map((hi, i) => (z[i + 1] - z[i]) / hi)
  const m = new Array<number>(n)
  m[0] = d[0]
  m[n - 1] = d[n - 2]
  for (let i = 1; i < n - 1; i++) {
    if (d[i - 1] * d[i] <= 0) m[i] = 0
    else {
      const w1 = 2 * h[i] + h[i - 1]
      const w2 = h[i] + 2 * h[i - 1]
      m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i])
    }
  }
  return { u, z, m }
}

export function zAl(c: Curva, uu: number): number {
  const { u, z, m } = c
  if (uu <= u[0]) return z[0]
  if (uu >= u[u.length - 1]) return z[z.length - 1]
  let i = 0
  while (i < u.length - 2 && uu > u[i + 1]) i++
  const h = u[i + 1] - u[i]
  const t = (uu - u[i]) / h
  const t2 = t * t
  const t3 = t2 * t
  return (2 * t3 - 3 * t2 + 1) * z[i] + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * z[i + 1] + (t3 - t2) * h * m[i + 1]
}

/**
 * Distanza fra la camera e il quadro di un tratto (u relativa all'inizio del tratto): all'inizio viene incontro alla
 * camera, durante le frasi la accompagna (si avvicina piano), alla fine la camera lo supera. `sosta` = la distanza di riposo.
 */
export function profiloDistanza(sosta: number, lunghezza = 5.5): Curva {
  return preparaPercorso([
    { u: -0.5, z: sosta + 28 },
    { u: 0.4, z: sosta + 3 },
    { u: lunghezza - 1.1, z: sosta },
    { u: lunghezza - 0.5, z: -2 },
    { u: lunghezza, z: -27 },
  ])
}

/** gli id dei tratti da tenere in memoria: quelli con [da - 0,5; a + 0,3] ∋ u, poi il primo tratto dopo u; al massimo 2 */
export function trattiDaTenere(p: Percorso, u: number): string[] {
  const tratti = p.blocchi.filter((b) => conSoggetto(b))
  const id = tratti.filter((b) => u >= b.da - 0.5 && u <= b.a + 0.3).map((b) => b.id)
  const dopo = tratti.find((b) => b.da > u)
  if (dopo && !id.includes(dopo.id)) id.push(dopo.id)
  return id.slice(0, 2)
}

/** i blocchi che hanno un soggetto di particelle nel mondo (un tratto completo o una mascotte) */
export const conSoggetto = (b: Blocco) => b.tipo === 'tratto' || b.tipo === 'mascotte'

type Pesi = [number, number, number, number]
const INDICE: Record<Materia, number> = { polvere: 0, vetro: 1, saette: 2, cromo: 3 }
const UGUALI: Pesi = [0.25, 0.25, 0.25, 0.25]

const pesiDi = (b: Blocco): Pesi => {
  if (!conSoggetto(b) || !b.materia) return UGUALI
  const w: Pesi = [0, 0, 0, 0]
  w[INDICE[b.materia]] = 1
  return w
}

/**
 * Quanto pesa ogni materia a u (polvere, vetro, saette, cromo; somma 1): dentro un tratto 1 sulla sua; nell'ultima mezza
 * schermata di ogni blocco passa in modo liscio ai pesi del blocco dopo (fra tratti: nella materia dopo; dalla soglia
 * al primo tratto e dall'ultimo al finale: senza scatti di colore dei fiumi); apertura, soglia e finale: quattro 0,25.
 */
export function pesiMateria(p: Percorso, u: number): Pesi {
  const i = bloccoAl(p, u)
  const b = p.blocchi[i]
  const dopo = p.blocchi[i + 1]
  const a = pesiDi(b)
  if (!dopo) return a
  const s = liscio(b.a - 0.5, b.a, u)
  if (s <= 0) return a
  const c = pesiDi(dopo)
  return [a[0] * (1 - s) + c[0] * s, a[1] * (1 - s) + c[1] * s, a[2] * (1 - s) + c[2] * s, a[3] * (1 - s) + c[3] * s]
}
