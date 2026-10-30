// Le regie di /campagne · Hermes, «la rotta» (DESIGN_SPEC-pagine §12). Hermes vola sopra la mappa notturna della Romagna, si divide in
// gocce di cromo che colpiscono solo le luci giuste e tornano alla tua porta. La mappa è fatta di coordinate vere (le città e la costa
// adriatica); sulla mappa nessun numero e nessuna scritta. Se somiglia a un'infografica a punti si passa al piano B (§17.3).
import type { Kit, Regia } from '../../kit.ts'
import type { Vec2 } from '../../tipi.ts'
import { fuoco, lis, vicino } from './comune.ts'
import type { RegiePagina } from './comune.ts'

/** [longitudine, latitudine, peso]: i comuni attorno a Faenza e qualche città più lontana (coordinate geografiche pubbliche) */
const CITTA: [number, number, number][] = [
  [11.883, 44.285, 1], // Faenza: il punto caldo, la tua porta
  [11.7671, 44.2237, 0.2], [11.8007, 44.3197, 0.25], [11.7266, 44.2755, 0.15], [11.7143, 44.3534, 0.6], [11.9097, 44.4217, 0.4],
  [11.9732, 44.4143, 0.3], [12.0407, 44.2227, 0.8], [12.1288, 44.1883, 0.25], [12.061, 44.122, 0.2], [12.138, 44.1468, 0.2],
  [12.2035, 44.4184, 0.8], [12.3484, 44.2616, 0.35], [12.2431, 44.1391, 0.7], [12.4, 44.1989, 0.3], [12.4476, 44.0642, 0.3],
  [12.5695, 44.0678, 0.9], [12.656, 44.0, 0.5], [11.98, 44.1, 0.15],
  [11.3426, 44.4949, 1], [11.6198, 44.8381, 0.7], [10.9252, 44.6471, 0.7], [10.3279, 44.8015, 0.6], [11.2558, 43.7696, 0.9], [12.9137, 43.9096, 0.4],
  [12.3155, 45.4408, 0.8], [11.8768, 45.4064, 0.6], [10.9916, 45.4384, 0.7], [9.19, 45.4642, 1], [11.582, 48.1351, 1],
]
/** la costa adriatica, da Pesaro alla laguna (16 punti al massimo per una linea del Kit) */
const COSTA: [number, number][] = [[12.91, 43.91], [12.74, 43.96], [12.57, 44.06], [12.4, 44.2], [12.36, 44.26], [12.3, 44.38], [12.28, 44.49], [12.25, 44.6], [12.25, 44.68], [12.3, 44.8], [12.3, 44.95], [12.28, 45.1], [12.28, 45.22], [12.35, 45.35], [12.45, 45.45]]

const DISTA = (c: [number, number, number]) => Math.hypot((c[0] - 11.883) * 0.72, c[1] - 44.285)
const ORDINATE = [...CITTA].sort((a, b) => DISTA(a) - DISTA(b))
const INCLINA = 0.78 // la prospettiva bassa: la latitudine si accorcia (nessuna mappa vista dall'alto e piatta)

/** la mappa per una scala e un centro: punti relativi a Faenza (3° ≈ una larghezza di quadro a scala 1) */
const puntiMappa = (pari = false) => ORDINATE.map((c): [number, number, number] => [((c[0] - 11.883) * 0.72) / 3, ((c[1] - 44.285) / 3) * INCLINA, pari ? 0.5 : c[2]])
const MAPPA = puntiMappa()
const MAPPA_PARI = puntiMappa(true)
const costaIn = (centro: Vec2, scala: number): Vec2[] => COSTA.map(([lo, la]) => [centro[0] + (((lo - 11.883) * 0.72) / 3) * scala, centro[1] - (((la - 44.285) / 3) * INCLINA * scala * 2.25) / 4])

/** dove si pone la mappa nel quadro: sotto Hermes sul computer (in basso), nel cuore della scena sul telefono */
function posto(k: Kit): Vec2 {
  const c = k.soggetto.centro
  return [c[0] - 0.04, c[1] + 0.3 * k.soggetto.altezza]
}

const apertura: Regia = (t, f, k) => {
  // le due cartoline si posano a destra della mascotte: un piccolo battito della materia per ciascuna
  k.pulsa('cartolina-1', { a: [0.88, 0.2], raggio: 0.07, colore: 'cromo' }, t['foto-1'])
  k.pulsa('cartolina-2', { a: [0.9, 0.5], raggio: 0.07, colore: 'cromo' }, t['foto-2'])
  const c = k.soggetto.centro
  k.luce('hermes', { a: c, raggio: 0.42, colore: 'cromo' }, 0.1 + 0.2 * t.servizio)
  k.orbita('gocce-piedi', { centro: vicino(k, 0, 0.5), raggio: [0.3 * k.soggetto.altezza * 1.78, 0.02], n: 30, colore: 'cromo' }, { accese: 30 * t.h1, ordine: 0.3 + 0.7 * t.sotto, velocita: 0.9, alfa: 0.35 + 0.5 * t.indice })
  k.getto('gocce', { da: vicino(k, 1.2, 0.8), verso: vicino(k, 0, 0.1), colore: 'cromo', n: 30 * t.sotto, ampiezza: 0.8 }, t.h1)
  k.luce('caldo', { a: vicino(k, -0.2, -0.4), raggio: 0.14, colore: 'luce' }, 0.08 + 0.14 * t.pulsante)
}

const problema: Regia = (t, f, k) => {
  const c = k.soggetto.centro
  const p = posto(k)
  // 1: una goccia cade e si apre a corona in centinaia di gocce che si perdono nel buio
  k.getto('corona', { da: [0.5, -0.05], verso: [0.5, 0.55], colore: 'cromo', n: 8, ampiezza: 0.1 }, Math.min(1, t.r1 * 1.0))
  k.getto('corona-b', { da: [0.5, 0.5], verso: [0.5, 0.5], colore: 'cromo', n: 70 * lis(0.55, 1, t.r1), ampiezza: 2.4, gravita: 0.3 }, lis(0.5, 1, t.r1))
  // 2: qualche luce si accende un attimo e si spegne (i like)
  k.punti('mappa', { punti: MAPPA_PARI, colore: 'cromo' }, { centro: p, scala: 0.7, inclina: 0, accese: 5 * Math.sin(Math.PI * t.r2), alfa: 0.25 * t.h2 + 0.35 * lis(0, 0.3, t.r2) })
  // 3: la stessa cifra, con un obiettivo: le gocce si raccolgono in una
  k.getto('raccolta', { da: [1.1, 0.9], verso: c, colore: 'cromo', n: 16, ampiezza: 1.2 }, t.r3)
  k.luce('goccia', { a: c, raggio: 0.2, colore: 'cromo' }, 0.3 * lis(0.2, 1, t.r3))
  fuoco(k, t.r1, [0.5, 0.4]); fuoco(k, t.r2, p); fuoco(k, t.r3, c)
}

const capacita: Regia = (t, f, k) => {
  const c = k.soggetto.centro
  const centro = posto(k)
  // la camera arretra sul beneficio e mostra tutta la linea (la scala della mappa scende)
  const scala = 1.7 - 0.7 * t.ben1
  const accese = 1 * t.b1 + 9 * t.b2 + 0 * t.b3 + 0 * t.b4 + 6 * t.b5 + 4 * t.b6 + 10 * t.ben1
  k.punti('mappa', { punti: MAPPA, colore: 'cromo' }, { centro, scala, inclina: 0, accese, alfa: 0.8 * lis(0, 1, t.h2) })
  // la costa, appena visibile
  k.linea('costa', { punti: costaIn(centro, scala), colore: 'cromo', spessore: 0.7 }, 0.9 * t.h2)
  k.luce('hermes', { a: c, raggio: 0.42, colore: 'cromo' }, 0.2)
  // 1: un solo punto si accende e la linea di cromo si disegna fino a lì
  const lontano = costaIn(centro, scala)[2]
  k.linea('rotta', { punti: [centro, [(centro[0] + lontano[0]) / 2, centro[1] - 0.05], lontano], colore: 'cromo', spessore: 1.2, gocce: 4 }, lis(0, 1, t.b1) * (1 - 0 * scala))
  // 2: la firma: Hermes salta e plana; lo stormo di gocce colpisce solo le luci giuste
  k.getto('stormo', { da: vicino(k, 0, 0.1), verso: centro, colore: 'cromo', n: 70 * lis(0.1, 1, t.b2), ampiezza: 1.0 }, t.b2)
  k.getto('stormo-b', { da: vicino(k, 0, 0.1), verso: [centro[0] + 0.3, centro[1] - 0.1], colore: 'cromo', n: 50 * lis(0.2, 1, t.b2), ampiezza: 0.6 }, t.b2)
  k.onda('picchiata', { a: centro, raggio: 0.5, colore: 'cromo' }, lis(0.4, 1, t.b2))
  // 3: il riflesso della luce calda sulle gocce (testi e immagini fatti per te)
  k.luce('riflesso-caldo', { a: vicino(k, 0.2, 0.1), raggio: 0.18, colore: 'luce' }, 0.4 * lis(0, 0.5, t.b3) * (1 - 0.4 * lis(0.7, 1, t.b3)))
  // 4: la linea parte da un punto di luce calda, il tuo
  k.pulsa('tuo', { a: centro, raggio: 0.1, colore: 'luce' }, t.b4)
  k.luce('porta', { a: centro, raggio: 0.2, colore: 'luce' }, 0.5 * lis(0, 0.5, t.b4))
  // 5: le gocce che sbagliano si spengono, sulla linea giusta se ne aggiungono (la mappa accende/spegne le luci)
  k.getto('correzione', { da: lontano, verso: centro, colore: 'cromo', n: 30 * t.b5, ampiezza: 0.3 }, t.b5)
  // 6: ogni goccia che arriva lascia un segno acceso sulla linea
  k.linea('segni', { punti: [lontano, [(centro[0] + lontano[0]) / 2 + 0.05, (centro[1] + lontano[1]) / 2], centro], colore: 'cromo', spessore: 1, gocce: 6, segni: true }, t.b6)
  // beneficio: tutta la linea, dal punto caldo al traguardo; sapere cosa è successo e perché
  k.luce('traguardo', { a: lontano, raggio: 0.14, colore: 'luce' }, 0.45 * lis(0.2, 1, t.ben1))
  k.luce('caldo-finale', { a: centro, raggio: 0.3, colore: 'luce' }, 0.35 * lis(0, 0.8, t.ben2))
  fuoco(k, t.b1, centro); fuoco(k, t.b2, centro); fuoco(k, t.b3, c); fuoco(k, t.b4, centro); fuoco(k, t.b5, centro); fuoco(k, t.b6, centro)
  fuoco(k, t.ben1, centro); fuoco(k, t.ben2, centro)
}

/** il gioco: ogni mestiere ha la sua mappa (raggio, distanza, mirino); lo studio sanitario non «mira» a nessuno: gocce distribuite uguali */
const SCALE = [2.3, 0.26, 1.6, 1.1, 1.1, 1.6]
const ACCESE = [8, 22, 14, 11, 11, 18]

export const REGIE_CAMPAGNE: RegiePagina = {
  film: { 'campagne-a': apertura, 'campagne-p': problema, 'campagne-f': capacita },
  gioco: ({ scelta, t }, k) => {
    const centro = posto(k)
    const sanitario = scelta === 5
    k.punti('mappa', { punti: sanitario ? MAPPA_PARI : MAPPA, colore: 'cromo' }, { centro, scala: SCALE[scelta % SCALE.length], inclina: 0, accese: ACCESE[scelta % ACCESE.length] * lis(0, 1, t), alfa: 0.85 })
    k.linea('costa', { punti: costaIn(centro, SCALE[scelta % SCALE.length]), colore: 'cromo', spessore: 0.7 }, 0.9)
    k.getto('gocce', { da: vicino(k, 0, 0.1), verso: centro, colore: 'cromo', n: 50, ampiezza: sanitario ? 1.6 : 0.8 }, t)
    k.luce('hermes', { a: k.soggetto.centro, raggio: 0.4, colore: 'cromo' }, 0.2)
    k.luce('porta', { a: centro, raggio: 0.16, colore: 'luce' }, 0.4)
  },
  // l'invito: Hermes porta una goccia fino al pulsante e la linea di cromo finisce lì
  invito: (t, k) => {
    k.linea('rotta', { punti: [[0.1, 0.2], [0.35, 0.45], [0.5, 0.5]], colore: 'cromo', spessore: 1.2, gocce: 5 }, lis(0, 0.8, t))
    k.luce('pulsante', { a: [0.5, 0.5], raggio: 0.4, colore: 'cromo' }, 0.25 * lis(0.3, 1, t))
  },
}
