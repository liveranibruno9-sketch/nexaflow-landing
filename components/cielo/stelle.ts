/**
 * Le sei costellazioni del sito, con le posizioni vere delle stelle.
 *
 * Coordinate equatoriali, epoca J2000: ascensione retta (ar) in ore decimali,
 * declinazione (dec) in gradi decimali. Magnitudine apparente: piu bassa =
 * piu luminosa, e la stella viene disegnata piu grande.
 *
 * Ogni costellazione ha un ORDINE: la sequenza in cui le stelle si accendono,
 * che coincide con i passaggi del flusso del modulo (le etichette stanno in
 * components/dati.ts). Una linea compare quando entrambe le sue stelle sono
 * accese: la figura si completa da sola mentre il flusso avanza.
 *
 * Proiezione gnomonica sul piano tangente al centro della figura, con il nord
 * in alto e l'est a sinistra, come si vede il cielo guardando in su.
 * Nessuna figura e specchiata: sarebbe un cielo che non esiste.
 */

export type ChiaveCostellazione = 'orione' | 'lira' | 'carro' | 'cassiopea' | 'corona' | 'cigno'

/** da che lato della stella sta il suo numero: serve dove le stelle sono vicine */
export type Lato = 'n' | 'ne' | 'e' | 'se' | 's' | 'so' | 'o' | 'no'

type Catalogo = { id: string; nome: string; ar: number; dec: number; mag: number; lato?: Lato }

type Definizione = {
  stelle: Catalogo[]
  linee: [string, string][]
  /** stelle nell'ordine del flusso: la prima e il passo 1 */
  ordine: string[]
  /** linee disegnate tratteggiate (indicano una direzione, non un tratto della figura) */
  tratteggiate?: [string, string][]
  /** avvicina una stella lontana lungo la sua direzione reale */
  accorcia?: { id: string; ancora: string; fattore: number }
}

const DEFINIZIONI: Record<ChiaveCostellazione, Definizione> = {
  orione: {
    stelle: [
      { id: 'betelgeuse', nome: 'Betelgeuse', ar: 5.91953, dec: 7.4069, mag: 0.5 },
      { id: 'bellatrix', nome: 'Bellatrix', ar: 5.41886, dec: 6.3497, mag: 1.64 },
      // la cintura: tre stelle vicine, i numeri vanno sparpagliati
      { id: 'mintaka', nome: 'Mintaka', ar: 5.53344, dec: -0.2992, mag: 2.23, lato: 'e' },
      { id: 'alnilam', nome: 'Alnilam', ar: 5.60356, dec: -1.2019, mag: 1.69, lato: 'se' },
      { id: 'alnitak', nome: 'Alnitak', ar: 5.67931, dec: -1.9428, mag: 1.77, lato: 'o' },
      { id: 'saiph', nome: 'Saiph', ar: 5.79594, dec: -9.6697, mag: 2.09 },
      { id: 'rigel', nome: 'Rigel', ar: 5.24231, dec: -8.2017, mag: 0.13 },
      { id: 'meissa', nome: 'Meissa', ar: 5.58564, dec: 9.9342, mag: 3.33 },
    ],
    linee: [
      ['betelgeuse', 'bellatrix'],
      ['bellatrix', 'mintaka'],
      ['mintaka', 'alnilam'],
      ['alnilam', 'alnitak'],
      ['alnitak', 'betelgeuse'],
      ['alnitak', 'saiph'],
      ['mintaka', 'rigel'],
      ['saiph', 'rigel'],
      ['meissa', 'betelgeuse'],
      ['meissa', 'bellatrix'],
    ],
    // Betelgeuse, rossa, e il preventivo fermo. La cintura sono i tre messaggi.
    ordine: ['betelgeuse', 'bellatrix', 'mintaka', 'alnilam', 'alnitak', 'saiph', 'rigel'],
  },

  lira: {
    stelle: [
      { id: 'vega', nome: 'Vega', ar: 18.61564, dec: 38.7836, mag: 0.03 },
      { id: 'epsilon', nome: 'Epsilon Lyrae', ar: 18.7389, dec: 39.667, mag: 4.6 },
      { id: 'zeta', nome: 'Zeta Lyrae', ar: 18.74619, dec: 37.605, mag: 4.36 },
      { id: 'delta', nome: 'Delta Lyrae', ar: 18.90842, dec: 36.8986, mag: 4.3 },
      { id: 'sulafat', nome: 'Sulafat', ar: 18.98239, dec: 32.6894, mag: 3.25 },
      { id: 'sheliak', nome: 'Sheliak', ar: 18.83467, dec: 33.3628, mag: 3.52 },
    ],
    linee: [
      ['vega', 'epsilon'],
      ['vega', 'zeta'],
      ['zeta', 'delta'],
      ['delta', 'sulafat'],
      ['sulafat', 'sheliak'],
      ['sheliak', 'zeta'],
    ],
    ordine: ['vega', 'epsilon', 'zeta', 'delta', 'sulafat', 'sheliak'],
  },

  carro: {
    stelle: [
      { id: 'alkaid', nome: 'Alkaid', ar: 13.79233, dec: 49.3133, mag: 1.86 },
      { id: 'mizar', nome: 'Mizar', ar: 13.39875, dec: 54.9253, mag: 2.23 },
      { id: 'alioth', nome: 'Alioth', ar: 12.90047, dec: 55.9597, mag: 1.77 },
      { id: 'megrez', nome: 'Megrez', ar: 12.25711, dec: 57.0325, mag: 3.31 },
      { id: 'phecda', nome: 'Phecda', ar: 11.89717, dec: 53.6947, mag: 2.44 },
      { id: 'merak', nome: 'Merak', ar: 11.03069, dec: 56.3825, mag: 2.37 },
      { id: 'dubhe', nome: 'Dubhe', ar: 11.06214, dec: 61.7508, mag: 1.79 },
      { id: 'polare', nome: 'Stella Polare', ar: 2.53031, dec: 89.2642, mag: 1.98 },
    ],
    linee: [
      ['alkaid', 'mizar'],
      ['mizar', 'alioth'],
      ['alioth', 'megrez'],
      ['megrez', 'phecda'],
      ['phecda', 'merak'],
      ['merak', 'dubhe'],
      ['dubhe', 'megrez'],
      ['dubhe', 'polare'],
    ],
    tratteggiate: [['dubhe', 'polare']],
    ordine: ['alkaid', 'mizar', 'alioth', 'megrez', 'phecda', 'merak', 'dubhe', 'polare'],
    // La Polare vera sta cinque volte piu lontana della distanza fra i due
    // "puntatori": disegnata li, il Carro diventerebbe minuscolo. Resta sulla
    // sua direzione reale, a una distanza accorciata.
    accorcia: { id: 'polare', ancora: 'dubhe', fattore: 0.4 },
  },

  cassiopea: {
    stelle: [
      { id: 'caph', nome: 'Caph', ar: 0.15297, dec: 59.1497, mag: 2.27 },
      { id: 'schedar', nome: 'Schedar', ar: 0.67511, dec: 56.5372, mag: 2.24 },
      { id: 'navi', nome: 'Gamma Cassiopeiae', ar: 0.94514, dec: 60.7167, mag: 2.47 },
      { id: 'ruchbah', nome: 'Ruchbah', ar: 1.43028, dec: 60.2353, mag: 2.68 },
      { id: 'segin', nome: 'Segin', ar: 1.90658, dec: 63.67, mag: 3.37 },
    ],
    linee: [
      ['caph', 'schedar'],
      ['schedar', 'navi'],
      ['navi', 'ruchbah'],
      ['ruchbah', 'segin'],
    ],
    ordine: ['caph', 'schedar', 'navi', 'ruchbah', 'segin'],
  },

  corona: {
    stelle: [
      { id: 'theta', nome: 'Theta Coronae', ar: 15.54883, dec: 31.3592, mag: 4.14 },
      { id: 'nusakan', nome: 'Nusakan', ar: 15.46381, dec: 29.1058, mag: 3.68 },
      { id: 'gemma', nome: 'Gemma', ar: 15.57814, dec: 26.7147, mag: 2.23 },
      { id: 'gamma', nome: 'Gamma Coronae', ar: 15.71239, dec: 26.2956, mag: 3.84 },
      { id: 'delta', nome: 'Delta Coronae', ar: 15.82656, dec: 26.0683, mag: 4.63 },
      { id: 'epsilon', nome: 'Epsilon Coronae', ar: 15.95981, dec: 26.8778, mag: 4.15 },
      { id: 'iota', nome: 'Iota Coronae', ar: 16.02406, dec: 29.8511, mag: 4.99 },
    ],
    linee: [
      ['theta', 'nusakan'],
      ['nusakan', 'gemma'],
      ['gemma', 'gamma'],
      ['gamma', 'delta'],
      ['delta', 'epsilon'],
      ['epsilon', 'iota'],
    ],
    ordine: ['theta', 'nusakan', 'gemma', 'gamma', 'delta', 'epsilon', 'iota'],
  },

  cigno: {
    stelle: [
      { id: 'albireo', nome: 'Albireo', ar: 19.51203, dec: 27.9597, mag: 3.05 },
      { id: 'eta', nome: 'Eta Cygni', ar: 19.93844, dec: 35.0833, mag: 3.89 },
      { id: 'sadr', nome: 'Sadr', ar: 20.37047, dec: 40.2567, mag: 2.23 },
      { id: 'fawaris', nome: 'Fawaris', ar: 19.74958, dec: 45.1308, mag: 2.87 },
      { id: 'gienah', nome: 'Gienah', ar: 20.77019, dec: 33.9703, mag: 2.48 },
      { id: 'deneb', nome: 'Deneb', ar: 20.69053, dec: 45.2803, mag: 1.25 },
    ],
    linee: [
      ['albireo', 'eta'],
      ['eta', 'sadr'],
      ['sadr', 'fawaris'],
      ['sadr', 'gienah'],
      ['sadr', 'deneb'],
    ],
    ordine: ['albireo', 'eta', 'sadr', 'fawaris', 'gienah', 'deneb'],
  },
}

/* ---------------------------------------------------------------------------
   Proiezione
   --------------------------------------------------------------------------- */

export type StellaDisegnata = {
  id: string
  nome: string
  x: number
  y: number
  /** raggio del nucleo, in unita del viewBox */
  r: number
  /** 1-based; null per le stelle che completano la figura senza essere un passo */
  passo: number | null
  lato: Lato
}

export type LineaDisegnata = {
  da: StellaDisegnata
  a: StellaDisegnata
  /** si accende quando e acceso questo passo; Infinity = solo a figura completa */
  passo: number
  tratteggiata: boolean
}

export type CostellazioneDisegnata = {
  chiave: ChiaveCostellazione
  stelle: StellaDisegnata[]
  linee: LineaDisegnata[]
  larghezza: number
  altezza: number
  totale: number
  /** coordinate del centro, per l'etichetta "da strumento" */
  coordinate: string
}

const RAD = Math.PI / 180
const LATO = 100 // il lato lungo della figura, in unita del viewBox
const MARGINE = 12

function gnomonica(ar: number, dec: number, ar0: number, dec0: number) {
  const a = ar * 15 * RAD
  const d = dec * RAD
  const a0 = ar0 * 15 * RAD
  const d0 = dec0 * RAD
  const cosc = Math.sin(d0) * Math.sin(d) + Math.cos(d0) * Math.cos(d) * Math.cos(a - a0)
  const x = (Math.cos(d) * Math.sin(a - a0)) / cosc
  const y = (Math.cos(d0) * Math.sin(d) - Math.sin(d0) * Math.cos(d) * Math.cos(a - a0)) / cosc
  // est a sinistra, nord in alto: sullo schermo x cresce a destra e y verso il basso
  return { x: -x, y: -y }
}

function raggio(mag: number) {
  // mag 0 -> 2.6, mag 5 -> 0.95
  return Math.min(2.6, Math.max(0.95, 2.6 - mag * 0.33))
}

function formattaCoordinate(ar: number, dec: number) {
  const ore = Math.floor(ar)
  const minuti = Math.round((ar - ore) * 60)
  const hh = String(minuti === 60 ? ore + 1 : ore).padStart(2, '0')
  const mm = String(minuti === 60 ? 0 : minuti).padStart(2, '0')
  const gradi = Math.round(dec)
  const segno = gradi > 0 ? '+' : gradi < 0 ? '−' : ''
  return `AR ${hh}h ${mm}m · DEC ${segno}${Math.abs(gradi)}°`
}

function disegna(chiave: ChiaveCostellazione): CostellazioneDisegnata {
  const def = DEFINIZIONI[chiave]
  const accorciata = def.accorcia?.id

  // il centro si calcola solo sulle stelle della figura vera e propria
  const base = def.stelle.filter((s) => s.id !== accorciata)
  const ar0 = base.reduce((t, s) => t + s.ar, 0) / base.length
  const dec0 = base.reduce((t, s) => t + s.dec, 0) / base.length

  const grezze = new Map(def.stelle.map((s) => [s.id, gnomonica(s.ar, s.dec, ar0, dec0)]))

  if (def.accorcia) {
    const { id, ancora, fattore } = def.accorcia
    const p = grezze.get(id)!
    const q = grezze.get(ancora)!
    grezze.set(id, { x: q.x + (p.x - q.x) * fattore, y: q.y + (p.y - q.y) * fattore })
  }

  const punti = Array.from(grezze.values())
  const minX = Math.min(...punti.map((p) => p.x))
  const maxX = Math.max(...punti.map((p) => p.x))
  const minY = Math.min(...punti.map((p) => p.y))
  const maxY = Math.max(...punti.map((p) => p.y))
  const scala = LATO / Math.max(maxX - minX, maxY - minY)

  const stelle: StellaDisegnata[] = def.stelle.map((s) => {
    const p = grezze.get(s.id)!
    const indice = def.ordine.indexOf(s.id)
    return {
      id: s.id,
      nome: s.nome,
      x: +((p.x - minX) * scala + MARGINE).toFixed(2),
      y: +((p.y - minY) * scala + MARGINE).toFixed(2),
      r: +raggio(s.mag).toFixed(2),
      passo: indice === -1 ? null : indice + 1,
      lato: s.lato ?? 'ne',
    }
  })

  const perId = new Map(stelle.map((s) => [s.id, s]))
  const passoDi = (s: StellaDisegnata) => s.passo ?? Infinity
  const tratteggiate = new Set((def.tratteggiate ?? []).map(([a, b]) => `${a}|${b}`))

  const linee: LineaDisegnata[] = def.linee.map(([a, b]) => {
    const da = perId.get(a)!
    const al = perId.get(b)!
    return {
      da,
      a: al,
      passo: Math.max(passoDi(da), passoDi(al)),
      tratteggiata: tratteggiate.has(`${a}|${b}`),
    }
  })

  return {
    chiave,
    stelle,
    linee,
    larghezza: +((maxX - minX) * scala + MARGINE * 2).toFixed(2),
    altezza: +((maxY - minY) * scala + MARGINE * 2).toFixed(2),
    totale: def.ordine.length,
    coordinate: formattaCoordinate(ar0, dec0),
  }
}

export const COSTELLAZIONI: Record<ChiaveCostellazione, CostellazioneDisegnata> = {
  orione: disegna('orione'),
  lira: disegna('lira'),
  carro: disegna('carro'),
  cassiopea: disegna('cassiopea'),
  corona: disegna('corona'),
  cigno: disegna('cigno'),
}
