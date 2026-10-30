// Il percorso della home, versione 2 (brief di Bruno del 30/10 dopo il voto 5 all'anteprima A):
// apertura (il nome si forma allo scroll) → soglia a due frasi → «I nostri servizi» con le quattro mascotte in giostra → quattro
// servizi, ciascuno con la sua mascotte (le creature restano, i loro nomi no; dal 30/10 sera sono animaletti in codice, non foto),
// un titolo e un paragrafo → la squadra che si riunisce abbracciata → il finale verso il modulo.
// Unità `u` = schermate (1 = 100svh). I paragrafi dei servizi (D49) sono riscritti con le skill di copy: brevi, chiari, una parola
// chiave per servizio; la spiegazione lunga sta nelle pagine dedicate.
// Nessun prezzo (R4); nessun blocco «Lavori» finché la bacheca è vuota (R7). Modulo puro: lo importano anche i test di Node.
import type { Battuta, Blocco, Immagine, Materia, Percorso } from '../tipi.ts'

/** una frase: [testo, parola d'accento?] */
type Frase = [string, string?]
const r = (x: number) => Math.round(x * 1000) / 1000
const frase = (ruolo: string, [testo, accento]: Frase, da: number, a: number): Battuta =>
  accento ? { tipo: 'frase', testo, ruolo, accento, da, a } : { tipo: 'frase', testo, ruolo, da, a }

// ---------- apertura · 0 → 2,2 (D47): il vortice di scaglie nasce da un punto; scorrendo, «Agenti Studio» si compone una lettera
// alla volta dalle scaglie, sotto compaiono i servizi in breve; in un angolo il riquadro (chi siamo, dove siamo); poi la consegna:
// il nome torna nel vortice, il vortice si apre in quattro correnti, una per materia, che escono dallo schermo (nome.ts) ----------
const APERTURA: Blocco = {
  id: 'apertura', tipo: 'apertura', da: 0, a: 2.2, etichetta: '00 · Apertura',
  battute: [
    { tipo: 'nome', testo: 'Agenti Studio', ruolo: 'nome', da: 0, a: 2.2 },
    { tipo: 'etichetta', testo: 'Automazioni · Web · Social · Campagne', ruolo: 'servizi', da: 0.75, a: 1.5 },
    { tipo: 'etichetta', testo: 'Faenza, Romagna', ruolo: 'luogo', da: 0.1, a: 1.55 },
    { tipo: 'scorri', testo: 'Scorri', ruolo: 'scorri', da: 0, a: 0.4 },
  ],
}

// ---------- soglia · 2,2 → 3,8: due battute, riscritte con la skill del copy (D47): domanda e risposta in una parola ----------
const SOGLIA: Blocco = {
  id: 'soglia', tipo: 'soglia', da: 2.2, a: 3.8, etichetta: 'Lo studio',
  battute: [
    frase('1', ['Chi pensa al resto mentre lavori?', 'resto'], 2.3, 3.0),
    frase('2', ['Noi.', 'Noi'], 3.0, 3.8),
  ],
}

// ---------- i servizi · 3,8 → 5,4 il titolo di sezione con le quattro mascotte che girano, poi 3,2 schermate per servizio ----------
const INTRO: Blocco = {
  id: 'servizi', tipo: 'intro', da: 3.8, a: 5.4, etichetta: 'I servizi',
  battute: [{ tipo: 'titolo', testo: 'I nostri servizi', ruolo: 'titolo', da: 3.9, a: 5.4 }],
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
  servizio(5.4, {
    id: 'atlas', etichetta: '01 · Automazioni', materia: 'polvere', titolo: 'Automazioni aziendali',
    paragrafo: ['Un assistente virtuale risponde a messaggi e chiamate anche fuori orario, ricontatta chi ha chiesto un preventivo e chiede le recensioni. Nessun cliente resta senza risposta.', 'senza risposta'],
    link: ['Le automazioni →', '/automazioni'],
    foto: [
      { nome: 'automazioni-1', alt: 'Una conversazione con l\'assistente virtuale sul telefono' },
      { nome: 'automazioni-2', alt: 'Una mano robotica che tocca una rete di punti luminosi' },
    ],
  }),
  servizio(8.6, {
    id: 'janus', etichetta: '02 · Siti web', materia: 'vetro', titolo: 'Sviluppo siti web e app',
    paragrafo: ['Siti web e app pensati prima per il telefono e per farti trovare su Google. Chi arriva capisce subito cosa fai, e ti scrive o prenota.', 'prenota'],
    link: ['I siti web →', '/siti-web'],
    foto: [
      { nome: 'siti-1', alt: 'Un sito aperto sul portatile' },
      { nome: 'siti-2', alt: 'Un\'app sul telefono, fra le mani' },
    ],
  }),
  servizio(11.8, {
    id: 'prometheus', etichetta: '03 · Contenuti', materia: 'saette', titolo: 'Creazione contenuti',
    paragrafo: ['Post, caroselli e video brevi per i tuoi social, con un piano chiaro. Ogni settimana li ricevi pronti sul telefono: li approvi con un tocco.', 'un tocco'],
    link: ['I contenuti →', '/contenuti'],
    foto: [
      { nome: 'contenuti-1', alt: 'Un video di cucina girato col telefono sul treppiede' },
      { nome: 'contenuti-2', alt: 'Il telefono che riprende un prodotto in studio' },
    ],
  }),
  servizio(15.0, {
    id: 'hermes', etichetta: '04 · Campagne', materia: 'cromo', titolo: 'Campagne pubblicitarie',
    paragrafo: ['Pubblicità su Instagram, Facebook e Google rivolta alle persone giuste, con budget e risultati sotto controllo. Sai quanto ti costa ogni nuovo contatto.', 'contatto'],
    link: ['Le campagne →', '/campagne'],
    foto: [
      { nome: 'campagne-1', alt: 'Una pubblicità su Facebook vista dal telefono' },
      { nome: 'campagne-2', alt: 'I grafici dei risultati sul portatile' },
    ],
  }),
]

// ---------- la squadra · 18,2 → 21,0: mentre si compone la seconda riga le mascotte tornano dall'alto e si abbracciano ----------
const SQUADRA: Blocco = {
  id: 'squadra', tipo: 'squadra', da: 18.2, a: 21.0, etichetta: 'La squadra',
  immagini: ['atlas-2', 'janus-2', 'prometheus-2', 'hermes-2'],
  battute: [
    frase('sopra', ['Più tempo per il tuo mestiere,', 'tempo'], 18.6, 20.8),
    frase('sotto', ['più margine a fine mese.', 'margine'], 19.0, 20.8),
  ],
}

// ---------- finale · 21,0 → 23,0 (D48): l'invito al centro con il battito; la seconda frase resta con il pulsante fino in fondo ----------
const LUNGHEZZA = 23.0
const FINALE: Blocco = {
  id: 'finale', tipo: 'finale', da: 21.0, a: LUNGHEZZA, etichetta: 'Il finale',
  battute: [
    frase('1', ['Seguiamo poche attività alla volta.'], 21.1, 21.7),
    frase('2', ['La prossima può essere la tua.', 'la tua'], 21.7, LUNGHEZZA),
    { tipo: 'pulsante', testo: 'Richiedi un preventivo', ruolo: 'pulsante', href: '#preventivo', nota: 'Senza impegno. Ti risponde Bruno entro un giorno lavorativo.', da: 22.3, a: LUNGHEZZA },
  ],
}

// QUI andrebbe il blocco «Lavori», solo quando LAVORI (components/film/dati/lavori.ts) non è vuoto (D8, R7)
export const HOME: Percorso = { lunghezza: LUNGHEZZA, blocchi: [APERTURA, SOGLIA, INTRO, ...SERVIZI, SQUADRA, FINALE] }
