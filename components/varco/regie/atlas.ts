// La regia di Atlas · polvere (storyboard §3.3, AT1-AT3 e tabella «Àncora»). Funzione pura: dati i tempi di ogni battuta
// e le fasi del soggetto, comanda il Kit. Ogni battuta ha il suo evento nella scena (R18) e ogni parola d'accento il suo fuoco.
// Gli strati dipendono da `fasi` solo per l'opacità (mai per decidere se chiamarli): l'àncora di una frase esiste sempre.
import type { Regia } from '../kit.ts'
import type { Vec2 } from '../tipi.ts'

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x)
const liscia = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}

/** un evento: sale con la frase, è pieno quando la frase si legge tutta, si chiude prima di quella dopo (storyboard, regola 4) */
const evento = (t: number) => liscia(0, 0.35, t) * (1 - liscia(0.75, 1, t))

// Punti misurati a occhio con Read su public/film/scene/atlas-{1,2,3}-720.webp (720x1280): x da sinistra e y dall'alto, in frazioni.
const TELEFONO: Vec2 = [0.5, 0.645] // atlas-1: lo schermo del telefono sul bancone, da cui parte la raffica di scintille
const ORSETTO: Vec2 = [0.52, 0.5] // atlas-2: il centro di Atlas
const LUNA: Vec2 = [0.25, 0.45] // atlas-2: la luna sulla schiena
const GALASSIA: Vec2 = [0.5, 0.27] // atlas-3: il centro della galassia (raggio circa 0,44 della larghezza)
const STELLA_SPENTA: Vec2 = [0.86, 0.3] // atlas-3: sul bordo destro della galassia
const ANELLO: Vec2 = [0.2, 0.45] // atlas-3: un punto dell'anello esterno, dove brillano le stelle una dopo l'altra
const TAZZA: Vec2 = [0.74, 0.585] // atlas-3: la tazza di caffè, da cui sale il vapore
const TELEFONINO: Vec2 = [0.82, 0.62] // atlas-3: il telefono sul bancone

export const atlas: Regia = (t, f, k) => {
  /* AT1 · il problema vivo (2.1 «23:47. Un cliente scrive.»): lo schermo si accende e spara una raffica verso la camera */
  k.luce('telefono', { a: TELEFONO, raggio: 0.2, colore: 'polvere' }, 0.75 * evento(t.problema))
  k.getto('raffica', { da: TELEFONO, verso: 'camera', colore: 'polvere', n: 100, ampiezza: 1 }, t.problema)
  // prolungamento di atlas-1: le scintille in codice riempiono anche i lati dello schermo, fuori dai bordi della foto
  k.getto('lati-sinistra', { da: [-0.25, 0.55], verso: 'camera', colore: 'polvere', n: 55, ampiezza: 1.3 }, t.problema)
  k.getto('lati-destra', { da: [1.25, 0.5], verso: 'camera', colore: 'polvere', n: 55, ampiezza: 1.3 }, t.problema)

  /* AT2 · Atlas si compone (nome, motto): le scintille girano a spirale e si dispongono attorno all'orsetto; la luna per ultima */
  const orso = f.foto[1]
  k.orbita('orso', { centro: ORSETTO, raggio: [0.62, 0.42], n: 30, colore: 'polvere' }, { accese: 30 * t.nome, ordine: 0.15 + 0.7 * t.nome, velocita: 1, alfa: 0.95 * orso })
  k.luce('luna', { a: LUNA, raggio: 0.16, colore: 'luce' }, 0.7 * liscia(0.6, 1, t.nome) * clamp01(orso * 1.2))
  // il motto: la polvere si posa verso il basso, dove sta la scritta
  k.getto('posa', { da: ORSETTO, verso: [0.5, 1.0], colore: 'polvere', n: 70, gravita: 0.4, ampiezza: 0.5 }, t.motto)

  /* AT3 · il beneficio vivo (2.2-2.5): la galassia in codice, più grande della foto (il suo prolungamento) */
  const gal = clamp01(f.forma - 1) * f.composto
  const b1 = t['beneficio-1']
  const b2 = t['beneficio-2']
  const b3 = t['beneficio-3']
  const b4 = t['beneficio-4']
  k.galassia('galassia', { centro: GALASSIA, raggio: 0.62, bracci: 2 }, { alfa: 0.8 * gal, giro: 0.35 * (b1 + b2 + b3 + b4) })
  // 2.2 «secondi»: una scintilla arriva dal buio, entra in orbita nella galassia e diventa blu
  k.getto('scintilla', { da: [0.05, 0.92], verso: GALASSIA, colore: 'polvere', n: 25, ampiezza: 0.3 }, b1)
  // 2.3 «Ricontattato»: una stella spenta sul bordo si riaccende e torna in orbita
  k.luce('stella-spenta', { a: STELLA_SPENTA, raggio: 0.05, colore: 'polvere' }, 0.8 * evento(b2))
  // 2.4 «Chiesta»: tutte le stelle di un anello brillano una dopo l'altra, fino all'ultima
  k.orbita('galassia', { centro: GALASSIA, raggio: [0.4, 0.22], n: 24, colore: 'polvere' }, { accese: b1 + b2 + 22 * b3, ordine: clamp01(0.3 + b3), velocita: 0.6, alfa: 0.9 * gal })
  // 2.5 «E tu stavi dormendo»: il vapore del caffè sale, lo schermo del telefono sul bancone si spegne, la galassia continua da sola
  k.getto('vapore', { da: TAZZA, verso: [0.74, 0.46], colore: 'perla', n: 35, ampiezza: 0.15 }, b4)
  k.luce('schermo', { a: TELEFONINO, raggio: 0.05, colore: 'polvere' }, 0.7 * (1 - b4) * gal)
  // «Le automazioni →»: una riga di polvere sottolinea il collegamento (in fondo al quadro, dove sta la fascia del testo)
  k.linea('sottolinea', { punti: [[0.06, 1.03], [0.55, 1.03]], colore: 'polvere', spessore: 1.2, gocce: 6 }, t.link)

  // il fuoco: il punto della scena da cui partono le particelle verso la parola d'accento, mentre la sua frase è in corso
  const fuoco = (v: number, p: Vec2) => {
    if (v > 0.05 && v < 1) k.fuoco(p)
  }
  fuoco(b1, GALASSIA)
  fuoco(b2, STELLA_SPENTA)
  fuoco(b3, ANELLO)
}
