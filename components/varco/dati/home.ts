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

// ---------- apertura · 0 → 1,0: il cerchio gira; scorrendo, le particelle compongono il nome ----------
const APERTURA: Blocco = {
  id: 'apertura', tipo: 'apertura', da: 0, a: 1.0, etichetta: '00 · Apertura',
  battute: [
    { tipo: 'nome', testo: 'Agenti Studio', ruolo: 'nome', da: 0, a: 1.0 },
    { tipo: 'etichetta', testo: 'Agenzia AI · Faenza, Romagna', ruolo: 'luogo', da: 0, a: 0.7 },
    { tipo: 'etichetta', testo: 'Automazioni · Siti web · Contenuti · Campagne', ruolo: 'servizi', da: 0, a: 0.7 },
    { tipo: 'scorri', testo: 'Scorri', ruolo: 'scorri', da: 0, a: 0.5 },
  ],
}

// ---------- soglia · 1,0 → 2,6: due frasi sole (le altre vanno nelle pagine dei servizi) ----------
const SOGLIA: Blocco = {
  id: 'soglia', tipo: 'soglia', da: 1.0, a: 2.6, etichetta: 'Lo studio',
  battute: [
    frase('1', ['Tu fai il tuo mestiere.', 'mestiere'], 1.1, 1.8),
    frase('2', ['Al resto pensiamo noi.', 'noi'], 1.8, 2.6),
  ],
}

// ---------- i servizi · 2,6 → 4,2 il titolo di sezione con le quattro mascotte che girano, poi 3,2 schermate per servizio ----------
const INTRO: Blocco = {
  id: 'servizi', tipo: 'intro', da: 2.6, a: 4.2, etichetta: 'I servizi',
  battute: [{ tipo: 'titolo', testo: 'I nostri servizi', ruolo: 'titolo', da: 2.7, a: 4.2 }],
}

type Mascotte = 'atlas' | 'janus' | 'prometheus' | 'hermes'
const LUNGHEZZA_SERVIZIO = 3.2

/** un servizio: la mascotte si compone dalle particelle, poi titolo, paragrafo e collegamento alla pagina */
function servizio(b: number, o: { id: Mascotte; etichetta: string; materia: Materia; titolo: string; paragrafo: Frase; link: [string, string] }): Blocco {
  const t = (x: number) => r(b + x)
  return {
    id: o.id, tipo: 'mascotte', da: b, a: t(LUNGHEZZA_SERVIZIO), etichetta: o.etichetta, materia: o.materia,
    immagini: [`${o.id}-2`] as Immagine[],
    battute: [
      { tipo: 'titolo', testo: o.titolo, ruolo: 'titolo', da: t(0.5), a: t(2.8) },
      { tipo: 'paragrafo', testo: o.paragrafo[0], ruolo: 'paragrafo', da: t(0.8), a: t(2.8), ...(o.paragrafo[1] ? { accento: o.paragrafo[1] } : {}) },
      { tipo: 'link', testo: o.link[0], ruolo: 'link', href: o.link[1], da: t(1.4), a: t(2.9) },
    ],
  }
}

const SERVIZI: Blocco[] = [
  servizio(4.2, {
    id: 'atlas', etichetta: '01 · Automazioni', materia: 'polvere', titolo: 'Automazioni aziendali',
    paragrafo: ['Rispondono ai messaggi e alle chiamate perse anche a negozio chiuso, ricontattano chi ha chiesto un preventivo ed è sparito, chiedono una recensione a ogni cliente. Tu smetti di rincorrere i messaggi: nessuno resta senza risposta.', 'senza risposta'],
    link: ['Le automazioni →', '/automazioni'],
  }),
  servizio(7.4, {
    id: 'janus', etichetta: '02 · Siti web', materia: 'vetro', titolo: 'Sviluppo siti web e app',
    paragrafo: ["Un sito all'altezza di quello che fai: si apre come un film dal primo scroll, è bello prima dal telefono, è fatto per farti trovare su Google. Richieste e prenotazioni arrivano da sole. Chi arriva capisce, chi capisce prenota.", 'prenota'],
    link: ['I siti web →', '/siti-web'],
  }),
  servizio(10.6, {
    id: 'prometheus', etichetta: '03 · Contenuti', materia: 'saette', titolo: 'Creazione contenuti',
    paragrafo: ["Post, caroselli e video brevi sulla tua attività, raccontata com'è davvero, con un piano chiaro su cosa pubblicare e quando. Ogni settimana i contenuti pronti arrivano sul tuo telefono: tu li approvi con un tocco.", 'un tocco'],
    link: ['I contenuti →', '/contenuti'],
  }),
  servizio(13.8, {
    id: 'hermes', etichetta: '04 · Campagne', materia: 'cromo', titolo: 'Campagne pubblicitarie',
    paragrafo: ['Pubblicità su Instagram, Facebook e Google per le persone giuste, vicine o lontane, con un obiettivo chiaro. Ogni settimana guardiamo cosa funziona e spostiamo lì il budget: alla fine sai quanto ti è costato ogni nuovo contatto.', 'contatto'],
    link: ['Le campagne →', '/campagne'],
  }),
]

// ---------- la squadra · 17,0 → 19,8: mentre si compone la seconda riga le mascotte tornano dall'alto e si abbracciano ----------
const SQUADRA: Blocco = {
  id: 'squadra', tipo: 'squadra', da: 17.0, a: 19.8, etichetta: 'La squadra',
  immagini: ['atlas-2', 'janus-2', 'prometheus-2', 'hermes-2'],
  battute: [
    frase('sopra', ['Più tempo per il tuo mestiere,', 'tempo'], 17.4, 19.6),
    frase('sotto', ['più margine a fine mese.', 'margine'], 17.8, 19.6),
  ],
}

// ---------- finale · 19,8 → 21,8: l'invito, poi il pulsante che resta acceso fino al modulo ----------
const LUNGHEZZA = 21.8
const FINALE: Blocco = {
  id: 'finale', tipo: 'finale', da: 19.8, a: LUNGHEZZA, etichetta: 'Il finale',
  battute: [
    frase('1', ['Seguiamo poche attività alla volta.'], 19.9, 20.5),
    frase('2', ['La prossima può essere la tua.', 'la tua'], 20.5, 21.1),
    { tipo: 'pulsante', testo: 'Richiedi un preventivo', ruolo: 'pulsante', href: '#preventivo', nota: 'Senza impegno. Ti risponde Bruno entro un giorno lavorativo.', da: 21.1, a: LUNGHEZZA },
  ],
}

// QUI andrebbe il blocco «Lavori», solo quando LAVORI (components/film/dati/lavori.ts) non è vuoto (D8, R7)
export const HOME: Percorso = { lunghezza: LUNGHEZZA, blocchi: [APERTURA, SOGLIA, INTRO, ...SERVIZI, SQUADRA, FINALE] }
