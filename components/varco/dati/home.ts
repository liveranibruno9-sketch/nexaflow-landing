// Il percorso della home, versione 2 (brief di Bruno del 30/10 dopo il voto 5 all'anteprima A):
// apertura (il nome si forma allo scroll) → soglia a due frasi → «I nostri servizi» con le quattro mascotte in giostra → quattro
// servizi, ciascuno con la sua mascotte (le creature restano, i loro nomi no; dal 30/10 sera sono animaletti in codice, non foto),
// un titolo e un paragrafo → la squadra che si riunisce abbracciata → il finale verso il modulo.
// Unità `u` = schermate (1 = 100svh). I paragrafi sono PROVVISORI (li riscriverà l'agente dei copy): condensano testi.md §4.
// Nessun prezzo (R4); nessun blocco «Lavori» finché la bacheca è vuota (R7). Modulo puro: lo importano anche i test di Node.
import type { Battuta, Blocco, Immagine, Materia, Percorso } from '../tipi.ts'

/** una frase: [testo, parola d'accento?] */
type Frase = [string, string?]
const r = (x: number) => Math.round(x * 1000) / 1000
const frase = (ruolo: string, [testo, accento]: Frase, da: number, a: number): Battuta =>
  accento ? { tipo: 'frase', testo, ruolo, accento, da, a } : { tipo: 'frase', testo, ruolo, da, a }

// ---------- apertura · 0 → 2,4: il big bang (da un punto nasce il cerchio che gira), scorrendo il nome si compone e resta,
// poi il banner (chi siamo, cosa facciamo, dove siamo) passa come una fascia di pagina e separa l'apertura dal viaggio (D45) ----------
export const BANNER = { da: 1.15, a: 2.35 }
const APERTURA: Blocco = {
  id: 'apertura', tipo: 'apertura', da: 0, a: 2.4, etichetta: '00 · Apertura',
  battute: [
    { tipo: 'nome', testo: 'Agenti Studio', ruolo: 'nome', da: 0, a: 2.4 },
    { tipo: 'etichetta', testo: 'Automazioni · Siti web · Contenuti · Campagne', ruolo: 'servizi', da: BANNER.da, a: BANNER.a },
    { tipo: 'etichetta', testo: 'Faenza, Romagna', ruolo: 'luogo', da: BANNER.da, a: BANNER.a },
    { tipo: 'scorri', testo: 'Scorri', ruolo: 'scorri', da: 0, a: 0.4 },
  ],
}

// ---------- soglia · 2,4 → 4,0: due frasi sole (le altre vanno nelle pagine dei servizi) ----------
const SOGLIA: Blocco = {
  id: 'soglia', tipo: 'soglia', da: 2.4, a: 4.0, etichetta: 'Lo studio',
  battute: [
    frase('1', ['Tu fai il tuo mestiere.', 'mestiere'], 2.5, 3.2),
    frase('2', ['Al resto pensiamo noi.', 'noi'], 3.2, 4.0),
  ],
}

// ---------- i servizi · 4,0 → 5,6 il titolo di sezione con le quattro mascotte che girano, poi 3,2 schermate per servizio ----------
const INTRO: Blocco = {
  id: 'servizi', tipo: 'intro', da: 4.0, a: 5.6, etichetta: 'I servizi',
  battute: [{ tipo: 'titolo', testo: 'I nostri servizi', ruolo: 'titolo', da: 4.1, a: 5.6 }],
}

type Mascotte = 'atlas' | 'janus' | 'prometheus' | 'hermes'
const LUNGHEZZA_SERVIZIO = 3.2

/** un servizio: la mascotte arriva, poi titolo, paragrafo, due foto che spiegano il servizio (Pexels, a destra della mascotte) e collegamento */
function servizio(b: number, o: { id: Mascotte; etichetta: string; materia: Materia; titolo: string; paragrafo: Frase; link: [string, string]; foto: { nome: string; alt: string }[] }): Blocco {
  const t = (x: number) => r(b + x)
  return {
    id: o.id, tipo: 'mascotte', da: b, a: t(LUNGHEZZA_SERVIZIO), etichetta: o.etichetta, materia: o.materia,
    immagini: [`${o.id}-2`] as Immagine[],
    battute: [
      { tipo: 'titolo', testo: o.titolo, ruolo: 'titolo', da: t(0.5), a: t(2.8) },
      { tipo: 'paragrafo', testo: o.paragrafo[0], ruolo: 'paragrafo', da: t(0.8), a: t(2.8), ...(o.paragrafo[1] ? { accento: o.paragrafo[1] } : {}) },
      ...o.foto.map((f, i): Battuta => ({ tipo: 'foto', testo: f.alt, ruolo: `foto-${i + 1}`, src: `/film/cartoline/${f.nome}.webp`, da: t(0.75 + 0.3 * i), a: t(2.85) })),
      { tipo: 'link', testo: o.link[0], ruolo: 'link', href: o.link[1], da: t(1.4), a: t(2.9) },
    ],
  }
}

const SERVIZI: Blocco[] = [
  servizio(5.6, {
    id: 'atlas', etichetta: '01 · Automazioni', materia: 'polvere', titolo: 'Automazioni aziendali',
    paragrafo: ['Rispondono ai messaggi e alle chiamate perse anche a negozio chiuso, ricontattano chi ha chiesto un preventivo ed è sparito, chiedono una recensione a ogni cliente. Tu smetti di rincorrere i messaggi: nessuno resta senza risposta.', 'senza risposta'],
    link: ['Le automazioni →', '/automazioni'],
    foto: [
      { nome: 'automazioni-1', alt: 'Una conversazione con l\'assistente virtuale sul telefono' },
      { nome: 'automazioni-2', alt: 'Una mano robotica che tocca una rete di punti luminosi' },
    ],
  }),
  servizio(8.8, {
    id: 'janus', etichetta: '02 · Siti web', materia: 'vetro', titolo: 'Sviluppo siti web e app',
    paragrafo: ["Un sito all'altezza di quello che fai: si apre come un film dal primo scroll, è bello prima dal telefono, è fatto per farti trovare su Google. Richieste e prenotazioni arrivano da sole. Chi arriva capisce, chi capisce prenota.", 'prenota'],
    link: ['I siti web →', '/siti-web'],
    foto: [
      { nome: 'siti-1', alt: 'Un sito aperto sul portatile' },
      { nome: 'siti-2', alt: 'Un\'app sul telefono, fra le mani' },
    ],
  }),
  servizio(12.0, {
    id: 'prometheus', etichetta: '03 · Contenuti', materia: 'saette', titolo: 'Creazione contenuti',
    paragrafo: ["Post, caroselli e video brevi sulla tua attività, raccontata com'è davvero, con un piano chiaro su cosa pubblicare e quando. Ogni settimana i contenuti pronti arrivano sul tuo telefono: tu li approvi con un tocco.", 'un tocco'],
    link: ['I contenuti →', '/contenuti'],
    foto: [
      { nome: 'contenuti-1', alt: 'Un video di cucina girato col telefono sul treppiede' },
      { nome: 'contenuti-2', alt: 'Il telefono che riprende un prodotto in studio' },
    ],
  }),
  servizio(15.2, {
    id: 'hermes', etichetta: '04 · Campagne', materia: 'cromo', titolo: 'Campagne pubblicitarie',
    paragrafo: ['Pubblicità su Instagram, Facebook e Google per le persone giuste, vicine o lontane, con un obiettivo chiaro. Ogni settimana guardiamo cosa funziona e spostiamo lì il budget: alla fine sai quanto ti è costato ogni nuovo contatto.', 'contatto'],
    link: ['Le campagne →', '/campagne'],
    foto: [
      { nome: 'campagne-1', alt: 'Una pubblicità su Facebook vista dal telefono' },
      { nome: 'campagne-2', alt: 'I grafici dei risultati sul portatile' },
    ],
  }),
]

// ---------- la squadra · 18,4 → 21,2: mentre si compone la seconda riga le mascotte tornano dall'alto e si abbracciano ----------
const SQUADRA: Blocco = {
  id: 'squadra', tipo: 'squadra', da: 18.4, a: 21.2, etichetta: 'La squadra',
  immagini: ['atlas-2', 'janus-2', 'prometheus-2', 'hermes-2'],
  battute: [
    frase('sopra', ['Più tempo per il tuo mestiere,', 'tempo'], 18.8, 21.0),
    frase('sotto', ['più margine a fine mese.', 'margine'], 19.2, 21.0),
  ],
}

// ---------- finale · 21,2 → 23,2: l'invito con la grafica dei posti (quattro occupati, il quinto libero), poi il pulsante ----------
const LUNGHEZZA = 23.2
const FINALE: Blocco = {
  id: 'finale', tipo: 'finale', da: 21.2, a: LUNGHEZZA, etichetta: 'Il finale',
  battute: [
    frase('1', ['Seguiamo poche attività alla volta.'], 21.3, 21.9),
    frase('2', ['La prossima può essere la tua.', 'la tua'], 21.9, 22.5),
    { tipo: 'pulsante', testo: 'Richiedi un preventivo', ruolo: 'pulsante', href: '#preventivo', nota: 'Senza impegno. Ti risponde Bruno entro un giorno lavorativo.', da: 22.5, a: LUNGHEZZA },
  ],
}

// QUI andrebbe il blocco «Lavori», solo quando LAVORI (components/film/dati/lavori.ts) non è vuoto (D8, R7)
export const HOME: Percorso = { lunghezza: LUNGHEZZA, blocchi: [APERTURA, SOGLIA, INTRO, ...SERVIZI, SQUADRA, FINALE] }
