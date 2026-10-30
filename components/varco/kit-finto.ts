// Il Kit finto: la versione del Kit che registra le chiamate invece di disegnare. Serve ai test delle regie
// (controllo R18, regie.test.ts); nessun accesso al DOM. Solo TypeScript "cancellabile".
import type { Kit } from './kit.ts'
import type { Materia } from './tipi.ts'

/**
 * metodo: 'getto', 'luce', ... 'anello.nome', 'campo.fiumi'; id: dove il metodo ne ha uno (per `foto`, l'indice).
 * valori: tutti i numeri della chiamata, arrotondati a 3 decimali, nell'ordine dei parametri (le stringhe non entrano).
 * Posizioni fisse che il controllo R18 legge: luce → [x, y, raggio, intensità]; saetta → [da.x, da.y, a.x, a.y, rami, t].
 */
export type Chiamata = { metodo: string; id?: string; valori: number[] }

const MATERIE: readonly Materia[] = ['polvere', 'vetro', 'saette', 'cromo']
/** al posto di 'camera' nelle coordinate di arrivo di un getto (fuori da ogni quadro) */
const CAMERA = 999

const arrotonda = (x: number) => Math.round(x * 1000) / 1000 + 0 // + 0: -0 diventa 0

export function kitFinto(): { kit: Kit; chiamate: Chiamata[]; azzera(): void } {
  const chiamate: Chiamata[] = []
  const reg = (metodo: string, valori: number[], id?: string) => {
    const v = valori.map(arrotonda)
    chiamate.push(id === undefined ? { metodo, valori: v } : { metodo, id, valori: v })
  }
  const kit: Kit = {
    soggetto: { centro: [0.5, 0.5], altezza: 0.45 },
    getto: (id, o, t) => reg('getto', [...o.da, ...(o.verso === 'camera' ? [CAMERA, CAMERA] : o.verso), o.n, o.gravita ?? 0, o.ampiezza ?? 0, t], id),
    luce: (id, o, intensita) => reg('luce', [...o.a, o.raggio, intensita], id),
    orbita: (id, o, s) => reg('orbita', [...o.centro, ...o.raggio, o.n, s.accese, s.ordine, s.velocita, s.alfa], id),
    galassia: (id, o, s) => reg('galassia', [...o.centro, o.raggio, o.bracci, s.alfa, s.giro], id),
    linea: (id, o, t) => reg('linea', [o.spessore, o.gocce ?? 0, o.segni ? 1 : 0, ...o.punti.flat(), t], id),
    saetta: (id, o, t) => reg('saetta', [...o.da, ...o.a, o.rami ?? 0, t], id),
    onda: (id, o, t) => reg('onda', [...o.a, o.raggio, t], id),
    raggi: (id, o, t) => reg('raggi', [...o.da, ...o.verso, o.apertura, o.n, t], id),
    pulsa: (id, o, t) => reg('pulsa', [...o.a, o.raggio, t], id),
    foto: (i, s) => reg('foto', [i, s.esposizione], String(i)),
    fuoco: (a) => reg('fuoco', [...a]),
    lastra: (id, o, s) => reg('lastra', [...o.a, o.larghezza, o.altezza, s.ruota, s.apri, s.alfa, s.calore], id),
    punti: (id, o, s) => reg('punti', [o.punti.length, ...s.centro, s.scala, s.inclina, s.accese, s.alfa], id),
    anello: {
      nome: (t) => reg('anello.nome', [t]),
      ritorno: (t) => reg('anello.ritorno', [t]),
      arco: (m, accensione) => reg('anello.arco', [MATERIE.indexOf(m), accensione]),
      giro: (velocita) => reg('anello.giro', [velocita]),
      caldo: (t) => reg('anello.caldo', [t]),
      punto: (t) => reg('anello.punto', [t]),
      apri: (t) => reg('anello.apri', [t]),
    },
    campo: {
      accese: (quota) => reg('campo.accese', [quota]),
      cercatore: (t) => reg('campo.cercatore', [t]),
      fiumi: (m, t) => reg('campo.fiumi', [...m.map((x) => MATERIE.indexOf(x)), t]),
      vuoto: (t) => reg('campo.vuoto', [t]),
    },
  }
  return { kit, chiamate, azzera: () => { chiamate.length = 0 } }
}
