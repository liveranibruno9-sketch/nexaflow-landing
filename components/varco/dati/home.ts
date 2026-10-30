// Il percorso della home: sette blocchi, le battute di ogni blocco con il loro `ruolo` (piano-costruzione-v2, «Il percorso della home»).
// Unità `u` = schermate (1 = 100svh). lunghezza = 31,6: lo storyboard ne stimava 37 contando l'orbita; si tara al telefono nella prima anteprima.
// Testi copiati lettera per lettera da testi.md §3 (ordine approvato il 30/10: il problema prima del nome); `accento` = la parola in grassetto.
// Indice in testata = `etichetta` del blocco. Nessun prezzo (R4); nessun blocco «Lavori» finché la bacheca è vuota (R7).
// Modulo puro: lo importano anche i test di Node (solo `import type`, estensione .ts fra moduli puri).
import type { Battuta, Blocco, Immagine, Materia, Percorso, TipoBattuta } from '../tipi.ts'

/** una frase: [testo, parola d'accento?] */
type Frase = [string, string?]

/** arrotonda a 3 decimali: le somme b + 0,4 non devono lasciare 6.000000000000001 nei dati */
const r = (x: number) => Math.round(x * 1000) / 1000

const frase = (ruolo: string, [testo, accento]: Frase, da: number, a: number): Battuta =>
  accento ? { tipo: 'frase', testo, ruolo, accento, da, a } : { tipo: 'frase', testo, ruolo, da, a }

// ---------- apertura · 0 → 0,6 ----------
// Le battute con da = 0 sono visibili subito (nessuna entrata). Il nome vive fino a 0,9: il suo `ritorno` (le lettere che
// tornano nell'anello) accompagna le prime righe della soglia.
const APERTURA: Blocco = {
  id: 'apertura', tipo: 'apertura', da: 0, a: 0.6, etichetta: '00 · Apertura',
  battute: [
    { tipo: 'nome', testo: 'Agenti Studio', ruolo: 'nome', da: 0, a: 0.9 },
    { tipo: 'etichetta', testo: 'Agenzia AI · Faenza, Romagna', ruolo: 'luogo', da: 0, a: 0.6 },
    { tipo: 'etichetta', testo: 'Automazioni · Siti web · Contenuti · Campagne', ruolo: 'servizi', da: 0, a: 0.6 },
    { tipo: 'scorri', testo: 'Scorri', ruolo: 'scorri', da: 0, a: 0.5 },
  ],
}

// ---------- soglia (tempo 1, «Lo studio») · 0,6 → 5,6 ----------
const SOGLIA_FRASI: [Frase, number, number][] = [
  [['Tu fai il tuo mestiere.', 'mestiere'], 0.7, 1.15],
  [['Al resto pensiamo noi.', 'noi'], 1.15, 1.6],
  [['Ai messaggi a negozio chiuso.'], 1.6, 2.0],
  [['Al sito che nessuno trova.'], 2.0, 2.4],
  [['Ai post rimandati da mesi.'], 2.4, 2.8],
  [['Ai clienti che non sanno che esisti.'], 2.8, 3.2],
  [["Con l'intelligenza artificiale.", 'intelligenza artificiale'], 3.25, 3.7],
  [['E con una persona vera che risponde.', 'persona'], 3.7, 4.15],
  [['Quattro agenti. Uno studio.', 'agenti'], 4.2, 4.65],
  [['Nomi antichi, lavoro nuovo.'], 4.65, 5.1],
  [['Te li presentiamo.'], 5.1, 5.6],
]
const SOGLIA: Blocco = {
  id: 'soglia', tipo: 'soglia', da: 0.6, a: 5.6, etichetta: 'Lo studio',
  battute: SOGLIA_FRASI.map(([f, da, a], i) => frase(String(i + 1), f, da, a)),
}

// ---------- i quattro tratti · 5,5 schermate ciascuno ----------
type Agente = 'atlas' | 'janus' | 'prometheus' | 'hermes'

/**
 * Un tratto che comincia in b: composizione del problema [b; b+0,4] · `problema` [b+0,4; b+1,0] · creatura che si compone
 * [b+1,0; b+2,1] · `nome` [b+1,2; b+2,5] · `motto` [b+1,6; b+2,5] · beneficio che si compone [b+2,4; b+2,8] ·
 * `beneficio-1…4` a quattro finestre da 0,5 da b+2,8 · `link` [b+3,8; b+5,0] · uscita [b+4,4; b+5,0] · passaggio [b+5,0; b+5,5].
 */
function tratto(b: number, o: {
  id: Agente; etichetta: string; materia: Materia; uscita: 'entra' | 'accanto'; sfuma?: Blocco['sfuma']
  nome: string; motto: string; problema: Frase; benefici: [Frase, Frase, Frase, Frase]; link: [string, string]
}): Blocco {
  const t = (x: number) => r(b + x)
  const tipo = (tipo: TipoBattuta, ruolo: string, testo: string, da: number, a: number): Battuta => ({ tipo, testo, ruolo, da, a })
  return {
    id: o.id, tipo: 'tratto', da: b, a: t(5.5), etichetta: o.etichetta, materia: o.materia,
    immagini: [`${o.id}-1`, `${o.id}-2`, `${o.id}-3`] as Immagine[], uscita: o.uscita,
    ...(o.sfuma ? { sfuma: o.sfuma } : {}),
    battute: [
      frase('problema', o.problema, t(0.4), t(1.0)),
      tipo('nome', 'nome', o.nome, t(1.2), t(2.5)),
      tipo('motto', 'motto', o.motto, t(1.6), t(2.5)),
      frase('beneficio-1', o.benefici[0], t(2.8), t(3.3)),
      frase('beneficio-2', o.benefici[1], t(3.3), t(3.8)),
      frase('beneficio-3', o.benefici[2], t(3.8), t(4.3)),
      frase('beneficio-4', o.benefici[3], t(4.3), t(4.8)),
      { tipo: 'link', testo: o.link[0], ruolo: 'link', href: o.link[1], da: t(3.8), a: t(5.0) },
    ],
  }
}

const ATLAS = tratto(5.6, {
  id: 'atlas', etichetta: '01 · Automazioni', materia: 'polvere', uscita: 'entra', sfuma: { 'atlas-1': { basso: 0.25 } },
  nome: 'Atlas', motto: 'Il peso lo porto io.', problema: ['23:47. Un cliente scrive.'],
  benefici: [['Risposta in pochi secondi.', 'secondi'], ['Preventivo dimenticato? Ricontattato.', 'Ricontattato'], ['Recensione? Chiesta, a tutti.', 'Chiesta'], ['E tu stavi dormendo.']],
  link: ['Le automazioni →', '/automazioni'],
})

const JANUS = tratto(11.1, {
  id: 'janus', etichetta: '02 · Siti web', materia: 'vetro', uscita: 'entra', sfuma: { 'janus-3': { alto: 0.35 } },
  nome: 'Janus', motto: 'Chi ti cerca, trova me.', problema: ['Ti cercano.'],
  benefici: [['Ti trovano.', 'trovano'], ['Capiscono chi sei, subito.'], ['Un tocco: prenotato.', 'prenotato'], ['Da Google alla tua porta.']],
  link: ['I siti web →', '/siti-web'],
})

const PROMETHEUS = tratto(16.6, {
  id: 'prometheus', etichetta: '03 · Contenuti', materia: 'saette', uscita: 'accanto', sfuma: { 'prometheus-1': { basso: 0.25 } },
  nome: 'Prometheus', motto: "Il bello c'è già. Io lo accendo.", problema: ['Social fermi da mesi?'],
  benefici: [['Lampo. Un post.', 'post'], ['Lampo. Un video.', 'video'], ['Ogni settimana, pronti sul tuo telefono.'], ['Tu dici sì. Pubblicato.', 'Pubblicato']],
  link: ['I contenuti →', '/contenuti'],
})

const HERMES = tratto(22.1, {
  id: 'hermes', etichetta: '04 · Campagne', materia: 'cromo', uscita: 'accanto',
  nome: 'Hermes', motto: 'Porto da te chi ancora non ti conosce.', problema: ['Clienti nuovi?'],
  benefici: [['Trovati.', 'Trovati'], ['Solo quelli giusti.'], ['Ogni euro lascia una traccia.', 'traccia'], ['E il telefono squilla.']],
  link: ['Le campagne →', '/campagne'],
})

// ---------- finale · 27,6 → 31,6 ----------
const FINALE_FRASI: [Frase, number, number][] = [
  [["Stasera qualcuno cercherà un'attività come la tua."], 27.8, 28.3],
  [['Troverà te, o un altro.', 'un altro'], 28.3, 28.8],
  [['Più tempo per il tuo mestiere.', 'tempo'], 28.9, 29.35],
  [['Più margine a fine mese.', 'margine'], 29.35, 29.8],
  [['Seguiamo poche attività alla volta.'], 29.9, 30.35],
  [['La prossima può essere la tua.', 'la tua'], 30.35, 30.8],
]
const LUNGHEZZA = 31.6
const FINALE: Blocco = {
  id: 'finale', tipo: 'finale', da: 27.6, a: LUNGHEZZA, etichetta: 'Il finale',
  battute: [
    ...FINALE_FRASI.map(([f, da, a], i) => frase(String(i + 1), f, da, a)),
    // resta acceso fino alla fine del percorso; sotto, piccolo, la nota
    { tipo: 'pulsante', testo: 'Richiedi un preventivo', ruolo: 'pulsante', href: '#preventivo', nota: 'Senza impegno. Ti risponde Bruno entro un giorno lavorativo.', da: 30.8, a: LUNGHEZZA },
  ],
}

// QUI andrebbe il blocco «Lavori», solo quando LAVORI (components/film/dati/lavori.ts) non è vuoto (D8, R7)
export const HOME: Percorso = { lunghezza: LUNGHEZZA, blocchi: [APERTURA, SOGLIA, ATLAS, JANUS, PROMETHEUS, HERMES, FINALE] }
