// I tipi dei dati delle pagine dei servizi e di Chi siamo (DESIGN_SPEC-pagine §8-13) e il costruttore del loro percorso-film.
// I testi stanno nei file di dati di ogni pagina (automazioni.ts, siti-web.ts, ...), mai nel codice dei componenti: cambiare un
// testo non tocca il codice. Modulo puro: lo importano anche i test di Node (solo TypeScript «cancellabile»).
import type { Mascotte } from '../coreografia.ts'
import type { Azione, Battuta, Blocco, GestoPagina, Materia, Percorso } from '../tipi.ts'

/** una frase: [testo, parola d'accento?] */
export type Frase = [string, string?]
export type IdPagina = 'automazioni' | 'siti-web' | 'contenuti' | 'campagne' | 'chi-siamo'

export type Scheda = { id: string; nome: string; testo: string; link?: { testo: string; href: string }; /** una foto vera del mestiere (Pexels), mostrata nel palco del gioco */ foto?: string }
export type Passo = { tappa: 0 | 1 | 2; titolo: string; testo: string }

/** quello che serve al film di ogni pagina (servizi e Chi siamo): le mascotte (una, o tutte e quattro), la materia, il percorso, il poster */
export type DatiFilm = {
  id: IdPagina
  /** una sola mascotte (pagine dei servizi, R12) oppure `tutte` (Chi siamo: le quattro, caricate dopo il primo disegno) */
  mascotte: Mascotte | 'tutte'
  materia: Materia
  percorso: Percorso
  h1: string
  poster: { src720: string; src1080: string; alt: string }
}

export type DatiPagina = DatiFilm & {
  id: Exclude<IdPagina, 'chi-siamo'>
  mascotte: Mascotte
  seo: { titolo: string; descrizione: string }
  /** facoltativo: la sezione propria (Automazioni «Resti tu a decidere», Siti «E quando serve un'app») */
  extra?: { h2: string; testo?: string; elenco?: string[]; dopo: 'film' | 'tappe' }
  gioco: { h2: string; scelte: Scheda[] }
  tappe: { h2: string; nomi: [string, string, string]; passi: Passo[]; riga: string }
  domande: { h2: string; voci: { d: string; r: string }[] }
  invito: { frasi: Frase[] }
  coda: { riga: string }
}

export const PAGINA_A = 1.0
export const PAGINA_P = 2.5
export const PAGINA_L = 6.0

const r = (x: number) => Math.round(x * 1000) / 1000

export type DefFilm = {
  id: Exclude<IdPagina, 'chi-siamo'>
  indice: string // «01 · Automazioni»
  materia: Materia
  servizio: string // S1, il titolo del servizio (lo stesso della home)
  h1: string
  sotto: string
  nota: string
  cartoline: { nome: string; alt: string }[]
  /** senza problema (Automazioni v2) il film è apertura + elenco, e la capacità comincia subito dopo l'apertura */
  problema?: { h2: string; righe: [Frase, Frase, Frase] }
  capacita: {
    h2: string
    /** riga facoltativa (l'elenco di Automazioni ha solo il titolo e i link); azioni = i link sotto la voce */
    blocchi: { titolo: Frase; riga?: string; gesto: GestoPagina; azioni?: Azione[] }[]
    /** schermate per voce (0,42 di base; l'elenco di Automazioni 0,6, una voce per schermata) */
    passo?: number
    beneficio: Frase[]
    gestoBeneficio?: GestoPagina
    /** una foto che compare nel film con il blocco `blocco` (1-6) */ foto?: { blocco: number; src: string; alt: string }
  }
}

const f = (ruolo: string, tipo: Battuta['tipo'], testo: string, da: number, a: number, extra: Partial<Battuta> = {}): Battuta => ({ tipo, testo, ruolo, da: r(da), a: r(a), ...extra })

/**
 * apertura, problema, capacità del film di una pagina servizio: stessa struttura, stessi tempi (cambiano i testi, la materia, i gesti).
 * Senza problema (Automazioni v2): apertura e poi l'elenco, una voce per schermata; la lunghezza segue l'elenco.
 */
export function percorsoServizio(d: DefFilm): Percorso {
  const A = PAGINA_A
  const P = d.problema ? PAGINA_P : A
  const passo = d.capacita.passo ?? 0.42
  const c0 = P + 0.45
  const cB = c0 + passo * d.capacita.blocchi.length
  const L = d.problema ? PAGINA_L : r(cB + 0.6)
  const apertura: Blocco = {
    id: `${d.id}-a`, tipo: 'pagina', da: 0, a: A, etichetta: d.indice, materia: d.materia,
    battute: [
      f('indice', 'etichetta', d.indice, 0, A),
      f('servizio', 'titolo', d.servizio, 0, A),
      f('h1', 'h1', d.h1, 0, A),
      f('sotto', 'paragrafo', d.sotto, 0, A),
      f('pulsante', 'pulsante', 'Richiedi un preventivo', 0, A, { href: '#preventivo', nota: d.nota }),
      ...d.cartoline.map((c, i) => f(`foto-${i + 1}`, 'foto', c.alt, 0.05 + 0.15 * i, A - 0.05, { src: `/film/cartoline/${c.nome}.webp` })),
    ],
  }
  const riga = (n: number, fr: Frase, da: number, a: number) => f(`r${n}`, 'riga', fr[0], da, a, fr[1] ? { accento: fr[1] } : {})
  const pr = d.problema
  const problema: Blocco | null = pr ? {
    id: `${d.id}-p`, tipo: 'pagina', da: A, a: P, etichetta: d.indice, materia: d.materia,
    battute: [f('h2', 'titolo', pr.h2, A, A + 0.5), riga(1, pr.righe[0], A + 0.5, A + 0.88), riga(2, pr.righe[1], A + 0.88, A + 1.2), riga(3, pr.righe[2], A + 1.2, P)],
  } : null
  // capacità: titolo di sezione 0,45, i blocchi da `passo` schermate, il beneficio (1 o 2 frasi) fino alla fine
  const blocchi = d.capacita.blocchi.map((b, i) =>
    f(`b${i + 1}`, 'blocco', b.titolo[0], c0 + passo * i, c0 + passo * (i + 1), {
      ...(b.riga ? { nota: b.riga } : {}), gesto: b.gesto, ...(b.titolo[1] ? { accento: b.titolo[1] } : {}), ...(b.azioni ? { azioni: b.azioni } : {}),
    }))
  const nB = d.capacita.beneficio.length
  const ben = d.capacita.beneficio.map((fr, i) => f(`ben${i + 1}`, 'frase', fr[0], i ? cB + 0.34 : cB, i < nB - 1 ? cB + 0.4 : L, {
    ...(fr[1] ? { accento: fr[1] } : {}), ...(i === 0 && d.capacita.gestoBeneficio ? { gesto: d.capacita.gestoBeneficio } : {}),
  }))
  const ft = d.capacita.foto
  const foto = ft ? [f('foto-1', 'foto', ft.alt, c0 + passo * (ft.blocco - 1), c0 + passo * (ft.blocco + 1.2), { src: ft.src })] : []
  const capacita: Blocco = {
    id: `${d.id}-f`, tipo: 'pagina', da: P, a: L, etichetta: d.indice, materia: d.materia,
    battute: [f('h2', 'titolo', d.capacita.h2, P, P + 0.45), ...blocchi, ...ben, ...foto],
  }
  return { lunghezza: L, blocchi: problema ? [apertura, problema, capacita] : [apertura, capacita] }
}
