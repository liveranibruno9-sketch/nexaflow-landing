// Il percorso della home, versione 3 «home chiara» (brief di Bruno del 13/11/2026: chi apre deve capire subito cosa facciamo ed essere
// accompagnato fino a chiedere informazioni; l'estetica non cambia):
// apertura (vortice, nome e servizi compaiono DA SOLI, a tempo) → invito nel cerchio («Richiedi informazioni») → per chi lavoriamo, con
// le scorciatoie ai quattro servizi → soglia a due frasi → «I nostri servizi» con le quattro mascotte in giostra (sotto ogni nome, il
// servizio) → quattro servizi, ciascuno con la sua mascotte, un titolo e un paragrafo corto → la squadra abbracciata → il finale.
// In ogni sezione c'è il modo di chiedere informazioni (pulsante o collegamento `info`, sempre verso il modulo).
// Unità `u` = schermate (1 = 100svh). Testi scritti con la skill copy-sito (bozze e versioni in home-chiara-copy.md, nel vault).
// Nessun prezzo (R4); nessun blocco «Lavori» finché la bacheca è vuota (R7). Modulo puro: lo importano anche i test di Node.
import type { Azione, Battuta, Blocco, Immagine, Materia, Percorso } from '../tipi.ts'
import { INVITO as INVITO_DEL_SITO } from '../../film/dati/contatti.ts'

/** una frase: [testo, parola d'accento?] */
type Frase = [string, string?]
const r = (x: number) => Math.round(x * 1000) / 1000
const frase = (ruolo: string, [testo, accento]: Frase, da: number, a: number): Battuta =>
  accento ? { tipo: 'frase', testo, ruolo, accento, da, a } : { tipo: 'frase', testo, ruolo, da, a }

/** l'invito di ogni sezione: stesso testo e stessa destinazione ovunque (nei moduli e nei pulsanti la variazione confonde) */
export const INFO = INVITO_DEL_SITO
const info = (da: number, a: number): Battuta => ({ tipo: 'link', testo: INFO, ruolo: 'info', href: '#preventivo', da, a })

// ---------- apertura · 0 → 0,6: il vortice nasce da un punto; «Agenti Studio» si compone da solo, una lettera alla volta, dalle scaglie
// (nome.ts, APERTURA.ingresso: secondi, non scroll); poi, sempre a tempo (`dopo`), i servizi in breve, il riquadro (chi siamo, dove
// siamo) e «Scorri». Scorrendo il nome torna nel vortice ----------
const APERTURA: Blocco = {
  id: 'apertura', tipo: 'apertura', da: 0, a: 0.6, etichetta: '00 · Apertura',
  battute: [
    { tipo: 'nome', testo: 'Agenti Studio', ruolo: 'nome', da: 0, a: 0.6 },
    { tipo: 'etichetta', testo: 'Automazioni · Siti web · Social · Pubblicità', ruolo: 'servizi', da: 0, a: 0.4, dopo: 1.7 },
    { tipo: 'etichetta', testo: 'Faenza, Romagna', ruolo: 'luogo', da: 0, a: 0.45, dopo: 2.0 },
    { tipo: 'scorri', testo: 'Scorri', ruolo: 'scorri', da: 0, a: 0.25, dopo: 2.6 },
  ],
}

// ---------- invito · 0,6 → 1,9: il nome è tornato nel vortice; nel cerchio, al suo posto, l'invito e il pulsante. Poi il vortice si
// apre in quattro correnti (la consegna, nome.ts) ----------
const INVITO: Blocco = {
  id: 'invito', tipo: 'invito', da: 0.6, a: 1.9, etichetta: 'Parliamone',
  battute: [
    frase('1', ['Raccontaci la tua attività.', 'attività'], 0.62, 1.4),
    { tipo: 'pulsante', testo: INFO, ruolo: 'pulsante', href: '#preventivo', nota: 'Senza impegno. Risposta entro un giorno.', da: 0.72, a: 1.4 },
  ],
}

// ---------- per chi lavoriamo · 1,9 → 3,5: le quattro correnti sono uscite; a chi ci rivolgiamo, cosa portiamo, e una scorciatoia per
// ogni servizio (numero e colore sono quelli del menu) ----------
const SCORCIATOIE: Azione[] = [
  { num: '01', testo: 'Automazioni', href: '/automazioni', materia: 'polvere', nota: 'Risposte anche fuori orario' },
  { num: '02', testo: 'Siti web', href: '/siti-web', materia: 'vetro', nota: 'Per farti trovare' },
  { num: '03', testo: 'Contenuti', href: '/contenuti', materia: 'saette', nota: 'Post e video ogni settimana' },
  { num: '04', testo: 'Campagne', href: '/campagne', materia: 'cromo', nota: 'Pubblicità che porta contatti' },
]
const CHI: Blocco = {
  id: 'chi', tipo: 'chi', da: 1.9, a: 3.5, etichetta: 'Per chi lavoriamo',
  battute: [
    { tipo: 'etichetta', testo: 'Per chi lavoriamo', ruolo: 'etichetta', da: 1.98, a: 3.4 },
    { tipo: 'titolo', testo: 'Per le attività della Romagna', ruolo: 'titolo', da: 2.0, a: 3.4 },
    { tipo: 'paragrafo', testo: 'Ristoranti, negozi, artigiani, studi e strutture ricettive. Ti portiamo clienti nuovi e seguiamo noi messaggi, sito, social e pubblicità.', ruolo: 'paragrafo', accento: 'clienti nuovi', da: 2.08, a: 3.4 },
    { tipo: 'scorciatoie', testo: 'I servizi', ruolo: 'scorciatoie', azioni: SCORCIATOIE, da: 2.18, a: 3.4 },
    info(2.3, 3.4),
  ],
}

// ---------- soglia · 3,5 → 5,1: due battute (D47): domanda e risposta in una parola ----------
const SOGLIA: Blocco = {
  id: 'soglia', tipo: 'soglia', da: 3.5, a: 5.1, etichetta: 'Lo studio',
  // D50 · scena «il resto che vola via»: le cose del resto galleggiano attorno alla domanda; con «Noi.» le quattro correnti
  // rientrano dagli angoli e ognuna si porta via le sue (stessa materia)
  parole: [
    { testo: 'messaggi', materia: 'polvere' }, { testo: 'chiamate perse', materia: 'polvere' }, { testo: 'preventivi', materia: 'polvere' },
    { testo: 'recensioni', materia: 'polvere' }, { testo: 'sito', materia: 'vetro' }, { testo: 'prenotazioni', materia: 'vetro' },
    { testo: 'post', materia: 'saette' }, { testo: 'video', materia: 'saette' }, { testo: 'pubblicità', materia: 'cromo' },
    { testo: 'clienti nuovi', materia: 'cromo' },
  ],
  battute: [
    frase('1', ['Chi pensa al resto mentre lavori?', 'resto'], 3.6, 4.3),
    frase('2', ['Noi.', 'Noi'], 4.3, 5.1),
    info(4.6, 5.05),
  ],
}

// ---------- i servizi · 5,1 → 6,7 il titolo di sezione con le quattro mascotte che girano, poi 3,2 schermate per servizio ----------
const INTRO: Blocco = {
  id: 'servizi', tipo: 'intro', da: 5.1, a: 6.7, etichetta: 'I servizi',
  battute: [
    { tipo: 'titolo', testo: 'I nostri servizi', ruolo: 'titolo', da: 5.2, a: 6.7 },
    info(5.5, 6.6),
  ],
}

type Mascotte = 'atlas' | 'janus' | 'prometheus' | 'hermes'
const LUNGHEZZA_SERVIZIO = 3.2

/** un servizio: la mascotte arriva, poi titolo, paragrafo corto, due foto che spiegano il servizio (Pexels, a destra della mascotte), il collegamento alla pagina e l'invito */
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
      info(t(1.5), t(2.9)),
    ],
  }
}

const SERVIZI: Blocco[] = [
  servizio(6.7, {
    id: 'atlas', etichetta: '01 · Automazioni', materia: 'polvere', titolo: 'Automazioni aziendali',
    paragrafo: ['Un assistente virtuale risponde a messaggi e chiamate, anche fuori orario. Nessun cliente resta senza risposta.', 'senza risposta'],
    link: ['Le automazioni →', '/automazioni'],
    foto: [
      { nome: 'automazioni-1', alt: 'Una conversazione con l\'assistente virtuale sul telefono' },
      { nome: 'automazioni-2', alt: 'Una mano robotica che tocca una rete di punti luminosi' },
    ],
  }),
  servizio(9.9, {
    id: 'janus', etichetta: '02 · Siti web', materia: 'vetro', titolo: 'Siti web e app',
    paragrafo: ['Siti pensati per il telefono e per Google. Chi arriva capisce cosa fai e ti scrive o prenota.', 'prenota'],
    link: ['I siti web →', '/siti-web'],
    foto: [
      { nome: 'siti-1', alt: 'Un sito aperto sul portatile' },
      { nome: 'siti-2', alt: 'Un\'app sul telefono, fra le mani' },
    ],
  }),
  servizio(13.1, {
    id: 'prometheus', etichetta: '03 · Contenuti', materia: 'saette', titolo: 'Contenuti per i social',
    paragrafo: ['Post e video brevi per i tuoi social, pronti ogni settimana. Li approvi con un tocco.', 'un tocco'],
    link: ['I contenuti →', '/contenuti'],
    foto: [
      { nome: 'contenuti-1', alt: 'Un video di cucina girato col telefono sul treppiede' },
      { nome: 'contenuti-2', alt: 'Il telefono che riprende un prodotto in studio' },
    ],
  }),
  servizio(16.3, {
    id: 'hermes', etichetta: '04 · Campagne', materia: 'cromo', titolo: 'Campagne pubblicitarie',
    paragrafo: ['Pubblicità su Instagram, Facebook e Google, alle persone giuste. Sai quanto ti costa ogni nuovo contatto.', 'contatto'],
    link: ['Le campagne →', '/campagne'],
    foto: [
      { nome: 'campagne-1', alt: 'Una pubblicità su Facebook vista dal telefono' },
      { nome: 'campagne-2', alt: 'I grafici dei risultati sul portatile' },
    ],
  }),
]

// ---------- la squadra · 19,5 → 22,3: mentre si compone la seconda riga le mascotte tornano dall'alto e si abbracciano ----------
const SQUADRA: Blocco = {
  id: 'squadra', tipo: 'squadra', da: 19.5, a: 22.3, etichetta: 'La squadra',
  immagini: ['atlas-2', 'janus-2', 'prometheus-2', 'hermes-2'],
  battute: [
    frase('sopra', ['Più tempo per il tuo mestiere,', 'tempo'], 19.9, 22.1),
    frase('sotto', ['più margine a fine mese.', 'margine'], 20.3, 22.1),
    info(20.9, 22.1),
  ],
}

// ---------- finale · 22,3 → 24,3 (D48): l'invito al centro con il battito; la seconda frase resta con il pulsante fino in fondo ----------
const LUNGHEZZA = 24.3
const FINALE: Blocco = {
  id: 'finale', tipo: 'finale', da: 22.3, a: LUNGHEZZA, etichetta: 'Il finale',
  battute: [
    frase('1', ['Seguiamo poche attività alla volta.'], 22.4, 23.0),
    frase('2', ['La prossima può essere la tua.', 'la tua'], 23.0, LUNGHEZZA),
    { tipo: 'pulsante', testo: INFO, ruolo: 'pulsante', href: '#preventivo', nota: 'Senza impegno. Ti risponde Bruno entro un giorno lavorativo.', da: 23.6, a: LUNGHEZZA },
  ],
}

// QUI andrebbe il blocco «Lavori», solo quando LAVORI (components/film/dati/lavori.ts) non è vuoto (D8, R7)
export const HOME: Percorso = { lunghezza: LUNGHEZZA, blocchi: [APERTURA, INVITO, CHI, SOGLIA, INTRO, ...SERVIZI, SQUADRA, FINALE] }
