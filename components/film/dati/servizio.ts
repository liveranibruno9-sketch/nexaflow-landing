// La regia di una pagina servizio (tabella "La regia delle pagine servizio", piano S5), T = 9.
// Le quattro pagine hanno la stessa struttura (R8): cambiano solo i testi di testi.md §4, la scena (X-2, X-3) e la materia.
// Atti: 00 Apertura · 01 Cosa facciamo · 02 Come lavoriamo · 04 Richiedi un preventivo. L'atto 03 Lavori non c'è
// finché la bacheca è vuota (R7): niente segnaposto. Nessun prezzo (R4), nessun pacchetto (D19).
// Modulo puro: lo importano anche i test di Node (solo `import type`, estensione .ts fra moduli puri).
import type { Atto, Battuta, Materia, Regia } from '../regia.ts'

/** una frase: [testo, parola d'accento?] (l'accento è la parola in grassetto di testi.md §4) */
type Frase = [string, string?]

type Pagina = {
  etichetta: string
  nome: string
  motto: string
  /** base del file in /film/scene: atlas, janus, prometheus, hermes */
  file: string
  materia: Materia
  /** le 8 o 9 frasi di "Cosa facciamo" */
  frasi: Frase[]
  /** il terzo passo di "Come lavoriamo" (diverso per ogni servizio) */
  passo3: { etichetta: string; testo: string }
  /** battute in più nell'ultimo atto (Automazioni: la cartolina degli studi dentistici) */
  extra?: Battuta[]
}

/** inizio e fine dell'atto 01: le frasi si dividono questo intervallo in finestre uguali */
const COSA_DA = 1.4
const COSA_A = 6.2

const PASSI_COMUNI = [
  { etichetta: '01 · Chiamata', testo: 'Una chiamata gratuita, senza impegno. Ci racconti la tua attività e capiamo cosa ti serve.' },
  { etichetta: '02 · Proposta', testo: 'Ti scriviamo cosa facciamo, i tempi e un prezzo chiaro. Nessuna sorpresa dopo.' },
]

export function paginaServizio(p: Pagina): Regia {
  const n = p.frasi.length
  const w = (COSA_A - COSA_DA) / n
  // a finestre uguali, con un burst della materia all'ingresso di ogni frase (il micro-gesto, D28)
  const frasi: Battuta[] = p.frasi.map(([testo, accento], i) => ({
    tipo: 'frase',
    testo,
    ...(accento ? { accento } : {}),
    da: COSA_DA + i * w,
    a: COSA_DA + (i + 1) * w,
    s: 0.15,
    burst: true,
  }))
  const passi: Battuta[] = [...PASSI_COMUNI, p.passo3].map((x, i) => ({
    tipo: 'passo',
    testo: x.etichetta,
    nota: x.testo,
    da: 6.5 + i * 0.5,
    a: 7 + i * 0.5,
    s: 0.12,
  }))
  const atti: Atto[] = [
    {
      id: 'apertura',
      nome: 'Apertura',
      etichetta: '00 · Apertura',
      materia: p.materia,
      da: 0,
      a: COSA_DA,
      battute: [
        { tipo: 'etichetta', testo: p.etichetta, da: 0.1, a: 9 },
        { tipo: 'nome', testo: p.nome, da: 0.15, a: 1.6 },
        { tipo: 'motto', testo: p.motto, da: 0.4, a: 1.6 },
        { tipo: 'scorri', testo: 'Scorri', da: 0, a: 0.5 },
      ],
    },
    { id: 'cosa-facciamo', nome: 'Cosa facciamo', etichetta: '01 · Cosa facciamo', materia: p.materia, da: COSA_DA, a: COSA_A, battute: frasi },
    { id: 'come-lavoriamo', nome: 'Come lavoriamo', etichetta: '02 · Come lavoriamo', materia: p.materia, da: COSA_A, a: 8, battute: passi },
    // id diverso da 'preventivo': quell'id è già della sezione col modulo, in fondo alla pagina
    { id: 'richiesta', nome: 'Richiedi un preventivo', etichetta: '04 · Richiedi un preventivo', materia: p.materia, da: 8, a: 9, battute: p.extra ?? [] },
  ]
  return {
    T: 9,
    scene: [
      { nome: `${p.file}-2`, da: 0, a: 6.6, zoom: [1, 1.06] },
      { nome: `${p.file}-3`, da: COSA_A, a: 9 },
    ],
    atti,
    convergenza: [8.2, 9.0],
    pulsante: { da: 8.7, testo: 'Richiedi un preventivo', href: '#preventivo', sotto: 'Raccontaci cosa ti serve. Senza impegno, ti risponde Bruno entro un giorno lavorativo.' },
  }
}
