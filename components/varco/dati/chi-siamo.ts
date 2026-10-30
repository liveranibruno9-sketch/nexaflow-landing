// /chi-siamo. Testi da pagine/copy-chi-siamo.md; la persona sta al secondo posto (spec §13) e il paragrafo di Bruno è spezzato in frasi
// da dire una alla volta nel film; ogni cambio è in pagine/registro-costruzione.md. Mai «intelligenza artificiale». Nessun numero,
// cliente o riconoscimento inventato (D4). Modulo puro.
import type { DatiFilm, Frase } from './pagine.ts'
import type { Battuta, Blocco } from '../tipi.ts'

const L = 3.8
const b = (ruolo: string, tipo: Battuta['tipo'], testo: string, da: number, a: number, extra: Partial<Battuta> = {}): Battuta => ({ tipo, testo, ruolo, da, a, ...extra })
const f = (ruolo: string, fr: Frase, da: number, a: number) => b(ruolo, 'frase', fr[0], da, a, fr[1] ? { accento: fr[1] } : {})

const H1 = 'Facciamo arrivare le attività della Romagna più lontano.'
const NOME = 'Bruno Liverani · Faenza'

const apertura: Blocco = {
  id: 'chi-siamo-a', tipo: 'pagina', da: 0, a: 1.0, etichetta: '05 · Chi siamo', materia: 'polvere',
  battute: [
    b('indice', 'etichetta', 'Chi siamo', 0, 1.0),
    b('h1', 'h1', H1, 0, 1.0),
    b('sotto', 'paragrafo', "Agenti Studio è un'agenzia di Faenza. Aiutiamo le attività della Romagna a rispondere ai clienti, a farsi trovare e a farsi conoscere: automazioni, siti web, contenuti per i social e campagne pubblicitarie. Le piccole e medie imprese tengono in piedi l'economia italiana. Hanno il mestiere. A volte manca il tempo.", 0, 1.0),
    b('pulsante', 'pulsante', 'Richiedi un preventivo', 0, 1.0, { href: '#preventivo', nota: 'Senza impegno. Ti risponde Bruno entro un giorno lavorativo.' }),
  ],
}
const persona: Blocco = {
  id: 'chi-siamo-f', tipo: 'pagina', da: 1.0, a: L, etichetta: '05 · Chi siamo', materia: 'polvere',
  battute: [
    b('h2', 'titolo', "Dietro Agenti Studio c'è una persona.", 1.0, 1.5),
    f('f1', ['Mi chiamo Bruno Liverani, sono di Faenza.', 'Bruno Liverani'], 1.5, 1.95),
    f('f2', ['Ogni lavoro lo seguo io, dalla prima chiamata alla consegna.', 'io'], 1.95, 2.4),
    f('f3', ['Con me lavorano Atlas, Janus, Prometheus e Hermes:'], 2.4, 2.85),
    f('f4', ['le mascotte che trovi in ogni servizio, una per mestiere.'], 2.85, 3.3),
    f('f5', ['Quando scrivi, ti risponde una persona, entro un giorno lavorativo.', 'una persona'], 3.3, L),
    b('nome', 'nome', NOME, 1.55, L),
  ],
}

export type DatiChiSiamo = DatiFilm & {
  id: 'chi-siamo'
  mascotte: 'tutte'
  seo: { titolo: string; descrizione: string }
  missione: { h2: string; testo: string }
  visione: { h2: string; testo: string }
  valori: { h2: string; voci: { parola: string; riga: string; materia: 'polvere' | 'vetro' | 'saette' | 'cromo' | 'luce' }[] }
  servizi: { h2: string; voci: { id: 'atlas' | 'janus' | 'prometheus' | 'hermes'; nome: string; riga: string; href: string; materia: 'polvere' | 'vetro' | 'saette' | 'cromo' }[] }
  dove: { h2: string; luogo: string }
  invito: { frase: string }
  coda: { riga: string }
}

export const CHI_SIAMO: DatiChiSiamo = {
  id: 'chi-siamo',
  mascotte: 'tutte',
  materia: 'polvere',
  seo: {
    titolo: 'Chi siamo | Agenti Studio, agenzia a Faenza',
    descrizione: 'Agenti Studio è l\'agenzia di Faenza che aiuta le attività della Romagna a rispondere ai clienti, farsi trovare e farsi conoscere. Mission e valori.',
  },
  h1: H1,
  poster: { src720: '/film/scene/atlas-2-720.webp', src1080: '/film/scene/atlas-2-1080.webp', alt: 'Le quattro mascotte di Agenti Studio: Atlas, Janus, Prometheus e Hermes' },
  percorso: { lunghezza: L, blocchi: [apertura, persona] },
  missione: { h2: 'La nostra missione', testo: 'Mettere nelle mani delle piccole imprese gli strumenti digitali che finora avevano solo le grandi, spiegati in modo semplice e costruiti insieme a chi lavora.' },
  visione: {
    h2: 'Dove vogliamo arrivare',
    testo: "Piccole e medie imprese italiane che competono alla pari, a casa loro e nel mondo. Una bottega di Faenza che si fa scegliere anche a Milano. Un agriturismo della Romagna con ospiti da mezza Europa. Un'impresa artigiana che lavora oltre la provincia. Si parte dalla Romagna. Ci vuole costanza, e un'attività alla volta.",
  },
  valori: {
    h2: 'In cosa crediamo',
    voci: [
      { parola: 'Concretezza', materia: 'cromo', riga: 'Ogni cosa che facciamo deve portare una richiesta, un cliente o un\'ora in più. Se no, non la facciamo.' },
      { parola: 'Chiarezza', materia: 'vetro', riga: 'Parliamo come parlano le persone. Niente sigle. Costi e tempi li scriviamo prima di iniziare.' },
      { parola: 'Onestà', materia: 'luce', riga: "Niente numeri inventati, niente promesse che nessuno può mantenere. Un assistente virtuale dice di esserlo. Un'immagine creata al computer non si spaccia per foto." },
      { parola: 'Cura', materia: 'polvere', riga: 'Seguiamo poche attività alla volta, per seguirle bene.' },
      { parola: 'Ambizione', materia: 'saette', riga: 'Pensiamo in grande per attività piccole. Una bottega può farsi scegliere lontano da casa.' },
    ],
  },
  servizi: {
    h2: 'Quattro servizi, un unico studio.',
    voci: [
      { id: 'atlas', nome: 'Automazioni aziendali', riga: 'Un assistente virtuale risponde ai clienti.', href: '/automazioni', materia: 'polvere' },
      { id: 'janus', nome: 'Siti web e app', riga: 'Ti trovano, capiscono, ti scrivono.', href: '/siti-web', materia: 'vetro' },
      { id: 'prometheus', nome: 'Creazione contenuti', riga: 'Post e video pronti ogni settimana.', href: '/contenuti', materia: 'saette' },
      { id: 'hermes', nome: 'Campagne pubblicitarie', riga: 'Clienti nuovi, con il conto in chiaro.', href: '/campagne', materia: 'cromo' },
    ],
  },
  dove: { h2: 'Dove trovarci', luogo: 'Faenza (RA), Romagna' },
  invito: { frase: 'Parliamo della tua attività.' },
  coda: { riga: 'Seguiamo poche attività alla volta. Se vuoi essere la prossima, raccontaci cosa ti serve.' },
}
