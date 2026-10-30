// I tipi dei dati delle pagine dei servizi e di Chi siamo (DESIGN_SPEC-pagine §8-13) e il costruttore del loro percorso-film.
// I testi stanno nei file di dati di ogni pagina (automazioni.ts, siti-web.ts, ...), mai nel codice dei componenti: cambiare un
// testo non tocca il codice. Modulo puro: lo importano anche i test di Node (solo TypeScript «cancellabile»).
import type { Mascotte } from '../coreografia.ts'
import type { Battuta, Blocco, GestoPagina, Materia, Percorso } from '../tipi.ts'

/** una frase: [testo, parola d'accento?] */
export type Frase = [string, string?]
export type IdPagina = 'automazioni' | 'siti-web' | 'contenuti' | 'campagne' | 'chi-siamo'

export type Scheda = { id: string; nome: string; testo: string; link?: { testo: string; href: string } }
export type Passo = { tappa: 0 | 1 | 2; titolo: string; testo: string }

export type DatiPagina = {
  id: Exclude<IdPagina, 'chi-siamo'>
  mascotte: Mascotte
  materia: Materia
  seo: { titolo: string; descrizione: string }
  /** il film: apertura, problema, capacità (u 0 → 6) */
  percorso: Percorso
  h1: string
  poster: { src720: string; src1080: string; alt: string }
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
  problema: { h2: string; righe: [Frase, Frase, Frase] }
  capacita: { h2: string; blocchi: { titolo: Frase; riga: string; gesto: GestoPagina }[]; beneficio: Frase[]; gestoBeneficio?: GestoPagina }
}

const f = (ruolo: string, tipo: Battuta['tipo'], testo: string, da: number, a: number, extra: Partial<Battuta> = {}): Battuta => ({ tipo, testo, ruolo, da: r(da), a: r(a), ...extra })

/** apertura, problema, capacità del film di una pagina servizio: stessa struttura, stessi tempi (cambiano i testi, la materia, i gesti) */
export function percorsoServizio(d: DefFilm): Percorso {
  const A = PAGINA_A, P = PAGINA_P, L = PAGINA_L
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
  const [r1, r2, r3] = d.problema.righe
  const riga = (n: number, fr: Frase, da: number, a: number) => f(`r${n}`, 'riga', fr[0], da, a, fr[1] ? { accento: fr[1] } : {})
  const problema: Blocco = {
    id: `${d.id}-p`, tipo: 'pagina', da: A, a: P, etichetta: d.indice, materia: d.materia,
    battute: [f('h2', 'titolo', d.problema.h2, A, A + 0.5), riga(1, r1, A + 0.5, A + 0.88), riga(2, r2, A + 0.88, A + 1.2), riga(3, r3, A + 1.2, P)],
  }
  // capacità: titolo di sezione 0,45, sei blocchi da 0,42, il beneficio (1 o 2 frasi) fino alla fine
  const c0 = P + 0.45
  const blocchi = d.capacita.blocchi.map((b, i) =>
    f(`b${i + 1}`, 'blocco', b.titolo[0], c0 + 0.42 * i, c0 + 0.42 * (i + 1), { nota: b.riga, gesto: b.gesto, ...(b.titolo[1] ? { accento: b.titolo[1] } : {}) }))
  const cB = c0 + 0.42 * d.capacita.blocchi.length
  const ben = d.capacita.beneficio.map((fr, i) => f(`ben${i + 1}`, 'frase', fr[0], cB + 0.1 * i + (i ? 0.12 : 0), L, {
    ...(fr[1] ? { accento: fr[1] } : {}), ...(i === 0 && d.capacita.gestoBeneficio ? { gesto: d.capacita.gestoBeneficio } : {}),
  }))
  const capacita: Blocco = {
    id: `${d.id}-f`, tipo: 'pagina', da: P, a: L, etichetta: d.indice, materia: d.materia,
    battute: [f('h2', 'titolo', d.capacita.h2, P, P + 0.45), ...blocchi, ...ben],
  }
  return { lunghezza: L, blocchi: [apertura, problema, capacita] }
}
