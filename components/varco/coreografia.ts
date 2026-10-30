// La coreografia delle quattro mascotte in codice (home v2.1, brief di Bruno del 30/10 sera): dove stanno sullo schermo, quanto
// sono grandi, quando salutano, quando si abbracciano. Funzione pura di u, del tempo e della forma dello schermo: si prova con `npm test`.
// Il verso segue lo scroll: ogni mascotte entra dal basso ed esce in alto; nella squadra tornano dall'alto, dalle sezioni sopra.
import type { Blocco, Percorso } from './tipi.ts'

export const ORDINE = ['atlas', 'janus', 'prometheus', 'hermes'] as const
export type Mascotte = (typeof ORDINE)[number]
export type Lato = 'destro' | 'sinistro'
/**
 * x, y = centro della creatura in frazioni dello schermo (y dall'alto); altezza in altezze di schermo; z = davanti/dietro in unità
 * del mondo; giro = rotazione su sé stessa; inclina = rollio. saluto e abbraccio 0..1; il lato del saluto è quello dello schermo.
 */
export type Posa = {
  x: number; y: number; altezza: number; z: number; giro: number; inclina: number
  presenza: number; saluto: number; lato: Lato; abbraccio: number; abbraccioSx: boolean; abbraccioDx: boolean; felice: number
}
export type Schermo = { ritratto: boolean; aspetto: number; basso: boolean }

/** le misure di una creatura nelle sue unità: altezza dai piedi alla testa (orecchie escluse) e larghezza delle spalle con le braccia */
export const ALTEZZA_CREATURA = 1.55
export const LARGHEZZA_CREATURA = 0.95
/** distanza fra due creature abbracciate, nelle loro unità: si toccano spalla a spalla (le braccia dell'abbraccio la usano) */
export const PASSO_SQUADRA = 0.7

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x)
const liscia = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}
const mix = (a: number, b: number, t: number) => a + (b - a) * t
/** arriva, supera appena e torna (easeOutBack): il "pop" delle creature che compaiono */
const rimbalzo = (t: number) => {
  if (t <= 0) return 0
  if (t >= 1) return 1
  const c = 1.70158
  return 1 + (c + 1) * (t - 1) ** 3 + c * (t - 1) ** 2
}

const NASCOSTA: Posa = { x: 0.5, y: 0.5, altezza: 0.3, z: 0, giro: 0, inclina: 0, presenza: 0, saluto: 0, lato: 'destro', abbraccio: 0, abbraccioSx: false, abbraccioDx: false, felice: 0 }

/** dove sta la mascotte del servizio: sul telefono sopra il testo, sul computer a destra della colonna del testo */
export function ribalta(s: Schermo): { x: number; y: number; altezza: number; lato: Lato } {
  if (s.ritratto) return { x: 0.5, y: 0.35, altezza: 0.33, lato: 'destro' }
  if (s.basso) return { x: 0.68, y: 0.5, altezza: 0.62, lato: 'sinistro' }
  return { x: 0.67, y: 0.52, altezza: 0.56, lato: 'sinistro' }
}

/** la giostra di «I nostri servizi»: sul computer a destra del titolo, sul telefono sopra (non c'è posto accanto) */
function giostra(s: Schermo) {
  if (s.ritratto) return { cx: 0.5, cy: 0.4, rx: 0.3, ry: 0.035, altezza: 0.21 }
  if (s.basso) return { cx: 0.69, cy: 0.5, rx: 0.17, ry: 0.04, altezza: 0.4 }
  return { cx: 0.69, cy: 0.5, rx: 0.17, ry: 0.04, altezza: 0.34 }
}

/** la squadra al centro: quattro in fila, alte quanto entra nella larghezza del telefono */
export function squadraAlCentro(s: Schermo): { y: number; altezza: number; passo: number } {
  const span = 3 * PASSO_SQUADRA + LARGHEZZA_CREATURA
  const altezza = Math.min(0.4, (ALTEZZA_CREATURA * 0.9 * s.aspetto) / span)
  return { y: s.basso ? 0.47 : 0.46, altezza, passo: (PASSO_SQUADRA * altezza) / ALTEZZA_CREATURA / s.aspetto }
}

function posaGiostra(i: number, u: number, tempo: number, intro: Blocco, s: Schermo): Posa {
  const g = giostra(s)
  const l = clamp01((u - intro.da) / (intro.a - intro.da))
  const th = (i * Math.PI) / 2 + 0.45 * tempo + 1.6 * l
  const davanti = Math.cos(th)
  const x = g.cx + g.rx * Math.sin(th)
  return {
    ...NASCOSTA,
    x,
    y: g.cy + g.ry * davanti,
    altezza: g.altezza * (0.8 + 0.2 * davanti),
    z: 0.6 * davanti,
    giro: -0.45 * Math.sin(th), // si guardano fra loro, come in un girotondo
    presenza: rimbalzo(liscia(0.02 + 0.07 * i, 0.3 + 0.07 * i, l)),
    saluto: Math.max(0, davanti) ** 4, // chi passa davanti saluta
    lato: x < g.cx ? 'sinistro' : 'destro',
  }
}

function posaRibalta(u: number, b: Blocco, s: Schermo, entraDalBasso: boolean): Posa {
  const r = ribalta(s)
  const entra = liscia(b.da - 0.15, b.da + 0.4, u)
  const esce = liscia(b.a - 0.5, b.a + 0.05, u)
  return {
    ...NASCOSTA,
    x: r.x,
    y: r.y + (entraDalBasso ? 0.3 * (1 - entra) ** 2 : 0) - 0.8 * esce * esce,
    altezza: r.altezza,
    giro: s.ritratto ? 0 : -0.18,
    presenza: (entraDalBasso ? rimbalzo(entra) : 1) * (1 - liscia(0.75, 1, esce)),
    saluto: liscia(b.da + 0.2, b.da + 0.5, u) * (1 - liscia(b.da + 1.3, b.da + 1.7, u)), // arriva e saluta
    lato: r.lato,
  }
}

function posaSquadra(i: number, u: number, b: Blocco, s: Schermo): Posa {
  const q = squadraAlCentro(s)
  const sotto = b.battute.find((x) => x.ruolo === 'sotto')
  const t0 = (sotto ? sotto.da : b.da + 0.8) - 0.1
  const arrivo = liscia(t0 + 0.07 * i, t0 + 0.5 + 0.07 * i, u)
  const abbraccio = liscia(t0 + 0.55, t0 + 0.85, u)
  const esce = liscia(b.a - 0.35, b.a + 0.05, u)
  const esterna = i === 0 || i === ORDINE.length - 1
  const c = i - (ORDINE.length - 1) / 2
  return {
    ...NASCOSTA,
    x: 0.5 + c * q.passo,
    // scendono da sopra lo schermo (y < 0) e risalgono quando la sezione finisce
    y: q.y - (q.y + 0.35) * (1 - arrivo) ** 2 - 0.9 * esce * esce,
    altezza: q.altezza,
    giro: -0.06 * c,
    inclina: -0.05 * c * abbraccio,
    presenza: liscia(0, 0.12, arrivo) * (1 - liscia(0.8, 1, esce)),
    // le due esterne salutano col braccio libero; scendendo, tutte hanno un braccio in alto
    saluto: esterna ? Math.max(abbraccio, 0.7 * (1 - arrivo)) : 0.7 * (1 - arrivo) * (1 - abbraccio),
    lato: i < (ORDINE.length - 1) / 2 ? 'sinistro' : 'destro',
    abbraccio,
    abbraccioSx: i > 0,
    abbraccioDx: i < ORDINE.length - 1,
    felice: abbraccio,
  }
}

/**
 * La posa di ogni mascotte a u. `scorre` 0..1 = quanto in fretta si sta scorrendo: mentre si scorre le mascotte in scena salutano.
 * Senza blocchi `mascotte` con il loro nome (le altre pagine) restano tutte nascoste.
 */
export function coreografia(p: Percorso, u: number, tempo: number, s: Schermo, scorre = 0): Record<Mascotte, Posa> {
  const intro = p.blocchi.find((b) => b.tipo === 'intro')
  const squadra = p.blocchi.find((b) => b.tipo === 'squadra')
  const out = {} as Record<Mascotte, Posa>
  ORDINE.forEach((id, i) => {
    const proprio = p.blocchi.find((b) => b.id === id && b.tipo === 'mascotte')
    const primo = proprio !== undefined && intro !== undefined && proprio.da === intro.a
    let posa = NASCOSTA
    if (proprio && u >= proprio.da - 0.3 && u < proprio.a + 0.1) {
      posa = posaRibalta(u, proprio, s, !primo)
      if (primo && intro) {
        // la prima mascotte passa dalla giostra al suo posto, senza sparire
        const e = liscia(proprio.da - 0.3, proprio.da + 0.35, u)
        const g = posaGiostra(i, u, tempo, intro, s)
        posa = { ...posa, x: mix(g.x, posa.x, e), y: mix(g.y, posa.y, e), altezza: mix(g.altezza, posa.altezza, e), z: mix(g.z, 0, e), giro: mix(g.giro, posa.giro, e), saluto: Math.max(posa.saluto, g.saluto * (1 - e)), lato: e < 0.5 ? g.lato : posa.lato }
      }
    } else if (intro && u >= intro.da && u < intro.a + 0.1) {
      // le altre tre salgono e se ne vanno quando la giostra finisce: torneranno nella squadra
      const g = posaGiostra(i, u, tempo, intro, s)
      const via = liscia(intro.a - 0.35, intro.a + 0.1, u)
      posa = { ...g, y: g.y - 0.75 * via * via, presenza: g.presenza * (1 - liscia(0.7, 1, via)) }
    } else if (squadra && u >= squadra.da && u < squadra.a + 0.1) {
      posa = posaSquadra(i, u, squadra, s)
    }
    out[id] = posa.presenza > 0 ? { ...posa, saluto: clamp01(Math.max(posa.saluto, 0.9 * clamp01(scorre))) } : posa
  })
  return out
}
