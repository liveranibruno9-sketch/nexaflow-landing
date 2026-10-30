// Le regie di /siti-web · Janus, «compone il vetro» (DESIGN_SPEC-pagine §10). Una lastra di vetro si compone dalle schegge, ruota dal
// computer al telefono e, sul beneficio, si apre come una porta: la luce calda dilaga (il punto più caldo della pagina, mai il bianco pieno).
import type { Kit, Regia } from '../../kit.ts'
import type { Vec2 } from '../../tipi.ts'
import { fuoco, largo, lis, vicino } from './comune.ts'
import type { RegiePagina } from './comune.ts'

/** dove sta la lastra: a sinistra di Janus sul computer, davanti e più in basso sul telefono (la mascotte è più piccola nel quadro) */
function lastraDi(k: Kit) {
  const h = k.soggetto.altezza
  const telefono = h < 0.45
  const altezza = 1.15 * h
  const larghezza = Math.min(0.9, altezza * 1.07)
  const c = k.soggetto.centro
  const a: Vec2 = telefono ? [0.5, c[1] + 0.1 * h] : [c[0] - 0.62 * h * 1.78, c[1] + 0.02]
  return { a, altezza, larghezza, telefono }
}

const apertura: Regia = (t, f, k) => {
  const c = k.soggetto.centro
  k.luce('janus', { a: c, raggio: 0.42, colore: 'vetro' }, 0.1 + 0.2 * t.servizio)
  k.orbita('schegge', { centro: vicino(k, 0, 0.5), raggio: [largo(k, 0.3), 0.02], n: 30, colore: 'vetro' }, { accese: 30 * t.h1, ordine: 0.3 + 0.7 * t.sotto, velocita: 0.9, alfa: 0.35 + 0.5 * t.indice })
  k.getto('schegge-in', { da: vicino(k, 1.3, 0.8), verso: vicino(k, 0, 0.1), colore: 'vetro', n: 30 * t.sotto, ampiezza: 0.8 }, t.h1)
  k.luce('caldo', { a: vicino(k, -0.2, -0.4), raggio: 0.14, colore: 'luce' }, 0.08 + 0.14 * t.pulsante)
}

const problema: Regia = (t, f, k) => {
  const L = lastraDi(k)
  // la lastra è appannata: poco alfa, nessun calore; con l'ultima riga si pulisce
  k.lastra('lastra', { a: L.a, larghezza: L.larghezza, altezza: L.altezza, colore: 'vetro' }, { ruota: 0, apri: 0, alfa: 0.22 + 0.4 * t.r3, calore: 0 })
  // 1: scie di luce (chi cerca) arrivano alla lastra e tornano indietro
  k.raggi('scie', { da: [-0.1, 0.5], verso: L.a, apertura: 0.5, n: 10, colore: 'vetro' }, t.r1)
  // 2: vanno verso altre luci lontane (social, elenchi: casa d'altri)
  k.getto('lontane', { da: L.a, verso: [1.2, 0.1], colore: 'vetro', n: 22 * t.r2, ampiezza: 0.5 }, t.r2)
  k.getto('lontane-b', { da: L.a, verso: [1.1, 0.95], colore: 'vetro', n: 22 * t.r2, ampiezza: 0.5 }, t.r2)
  // 3: la lastra si pulisce, Janus soffia sul vetro
  k.onda('soffio', { a: L.a, raggio: 0.5, colore: 'vetro' }, t.r3)
  k.luce('janus', { a: k.soggetto.centro, raggio: 0.4, colore: 'vetro' }, 0.16)
  fuoco(k, t.r1, L.a); fuoco(k, t.r2, [0.8, 0.4]); fuoco(k, t.r3, L.a)
}

const capacita: Regia = (t, f, k) => {
  const L = lastraDi(k)
  const c = k.soggetto.centro
  // 1: la lastra ruota da orizzontale a verticale (pensato prima per il telefono)
  const ruota = -1.25 * (1 - lis(0, 1, t.b1))
  const limpida = 0.55 + 0.25 * t.b3
  const calore = 0.12 * t.b3 + 0.25 * t.b6 + 0.55 * t.ben1
  k.lastra('lastra', { a: L.a, larghezza: L.larghezza, altezza: L.altezza, colore: 'vetro' }, { ruota: ruota * (1 - 0.0 * t.h2), apri: lis(0, 1, t.ben1), alfa: 0.5 * t.h2 + 0.3 * limpida, calore })
  k.luce('janus', { a: c, raggio: 0.42, colore: 'vetro' }, 0.2 + 0.1 * t.b6)
  // 2: le scie lontane piegano verso la lastra (si fa trovare su Google)
  k.raggi('scie', { da: [1.15, 0.12], verso: L.a, apertura: 0.7 * (1 - 0.6 * t.b2), n: 14, colore: 'vetro' }, t.b2)
  // 3: un anello di tocco si propaga sul vetro (chi arriva capisce)
  k.onda('tocco', { a: L.a, raggio: 0.4, colore: 'vetro' }, t.b3)
  // 4: piccole luci entrano nella lastra una alla volta, in fila
  k.getto('richieste', { da: [1.15, L.a[1]], verso: L.a, colore: 'vetro', n: 12 * t.b4, ampiezza: 0.15 }, t.b4)
  // 5: il riflesso di Janus nel vetro guarda dall'altra parte: due volti
  k.luce('riflesso', { a: [L.a[0] + 0.05, L.a[1] - 0.05], raggio: 0.14, colore: 'vetro' }, 0.35 * lis(0, 0.5, t.b5) * (1 - 0.4 * lis(0.6, 1, t.b5)))
  k.pulsa('volti', { a: [L.a[0] + 0.05, L.a[1] - 0.05], raggio: 0.1, colore: 'vetro' }, t.b5)
  // 6: Janus spinge la lastra verso di te e il bordo prende la luce calda
  k.luce('bordo-caldo', { a: L.a, raggio: 0.3, colore: 'luce' }, 0.4 * lis(0, 0.7, t.b6))
  // beneficio: la lastra si apre come una porta e la luce calda dilaga
  k.luce('dilaga', { a: [L.a[0] - 0.1, L.a[1]], raggio: 0.75, colore: 'luce' }, 0.7 * lis(0.1, 0.9, t.ben1))
  k.raggi('luce-porta', { da: [L.a[0] - L.larghezza / 2, L.a[1]], verso: [1.2, L.a[1]], apertura: 1.1, n: 14, colore: 'luce' }, t.ben1)
  k.onda('prego', { a: c, raggio: 0.6, colore: 'luce' }, t.ben2)
  fuoco(k, t.b1, L.a); fuoco(k, t.b2, L.a); fuoco(k, t.b3, L.a); fuoco(k, t.b4, L.a); fuoco(k, t.b5, L.a); fuoco(k, t.b6, L.a)
  fuoco(k, t.ben1, L.a); fuoco(k, t.ben2, [0.7, 0.5])
}

export const REGIE_SITI: RegiePagina = {
  film: { 'siti-web-a': apertura, 'siti-web-p': problema, 'siti-web-f': capacita },
  // il gioco: alla scelta la lastra si gira verso di te e dentro compare un luogo di quel mestiere (la foto sta nel palco HTML, sfumata)
  gioco: ({ scelta, t }, k) => {
    const L = lastraDi(k)
    k.lastra('lastra', { a: L.a, larghezza: L.larghezza, altezza: L.altezza, colore: 'vetro' }, { ruota: 0, apri: 0, alfa: 0.7, calore: 0.25 + 0.25 * lis(0, 1, t) })
    k.onda('cambio', { a: L.a, raggio: 0.5, colore: 'vetro' }, t)
    k.luce('janus', { a: k.soggetto.centro, raggio: 0.42, colore: 'vetro' }, 0.22)
    k.getto('schegge', { da: k.soggetto.centro, verso: L.a, colore: 'vetro', n: 14, ampiezza: 0.3 }, t * (1 + 0 * scelta))
  },
  // l'invito: una piccola lastra-porta si apre attorno al pulsante, che sta nel varco
  invito: (t, k) => {
    k.lastra('porta', { a: [0.5, 0.5], larghezza: 0.62, altezza: 0.2, colore: 'vetro' }, { ruota: 0, apri: 0.9 * lis(0.1, 0.9, t), alfa: 0.8 * lis(0, 0.3, t), calore: 0.4 * lis(0.3, 1, t) })
    k.luce('varco', { a: [0.5, 0.5], raggio: 0.4, colore: 'luce' }, 0.35 * lis(0.2, 1, t))
  },
}
