// La regia della home: scene, atti e battute in "schermi" di scroll (u, 1 = 100svh), T = 32.
// Tempi dalla tabella "La regia della home" (piano S5), provvisori: si tarano al telefono nella prima anteprima.
// Testi copiati lettera per lettera da testi.md §3; `accento` = la parola in grassetto.
// Modulo puro: lo importano anche i test di Node (solo `import type`).
import type { Atto, Battuta, Materia, Regia, Scena } from '../regia'

/** una frase: [testo, parola d'accento?] */
type Frase = [string, string?]

const frase = ([testo, accento]: Frase, da: number, a: number): Battuta =>
  accento ? { tipo: 'frase', testo, accento, da, a } : { tipo: 'frase', testo, da, a }

/**
 * Lo schema di un agente dalla base b (tabella "Schema di un agente").
 * Le battute sono in ordine di posizione sullo schermo (etichetta, nome, motto, frasi, collegamento),
 * non di tempo: le cinque frasi stanno nello stesso punto e si danno il cambio.
 */
function agente(
  b: number, nome: string, file: string, servizio: string, materia: Materia, href: string, battute: Frase[],
  testi: { num: string; motto: string; collegamento: string; fine?: number },
): { scene: Scena[]; atto: Atto } {
  const [f1, f2, f3, f4, f5] = battute
  const scene: Scena[] = [
    { nome: `${file}-1`, da: b, a: b + 1.6 },
    { nome: `${file}-2`, da: b + 1.4, a: b + 3.1, zoom: [1, 1.04] },
    { nome: `${file}-3`, da: b + 2.9, a: testi.fine ?? b + 5.4, zoom: [1, 1.05] },
  ]
  const atto: Atto = {
    id: file,
    nome: servizio,
    etichetta: `${testi.num} · ${servizio}`,
    materia,
    da: b,
    a: b + 5,
    battute: [
      { tipo: 'etichetta', testo: `${testi.num} · ${servizio}`, da: b + 1.6, a: b + 5 },
      { tipo: 'nome', testo: nome, da: b + 1.7, a: b + 2.9 },
      { tipo: 'motto', testo: testi.motto, da: b + 2.0, a: b + 2.9 },
      frase(f1, b + 0.5, b + 1.3),
      frase(f2, b + 3.1, b + 3.55),
      frase(f3, b + 3.55, b + 4.0),
      frase(f4, b + 4.0, b + 4.45),
      frase(f5, b + 4.45, b + 4.85),
      { tipo: 'link', testo: testi.collegamento, href, da: b + 4.0, a: b + 5 },
    ],
  }
  return { scene, atto }
}

const ATLAS = agente(8, 'Atlas', 'atlas', 'Automazioni', 'polvere', '/automazioni', [
  ['23:47. Un cliente scrive.'],
  ['Risposta in pochi secondi.', 'secondi'],
  ['Preventivo dimenticato? Ricontattato.', 'Ricontattato'],
  ['Recensione? Chiesta, a tutti.', 'Chiesta'],
  ['E tu stavi dormendo.'],
], { num: '01', motto: 'Il peso lo porto io.', collegamento: 'Le automazioni →' })

const JANUS = agente(13, 'Janus', 'janus', 'Siti web', 'vetro', '/siti-web', [
  ['Ti cercano.'],
  ['Ti trovano.', 'trovano'],
  ['Capiscono chi sei, subito.'],
  ['Un tocco: prenotato.', 'prenotato'],
  ['Da Google alla tua porta.'],
], { num: '02', motto: 'Chi ti cerca, trova me.', collegamento: 'I siti web →' })

const PROMETHEUS = agente(18, 'Prometheus', 'prometheus', 'Contenuti', 'saette', '/contenuti', [
  ['Social fermi da mesi?'],
  ['Lampo. Un post.', 'post'],
  ['Lampo. Un video.', 'video'],
  ['Ogni settimana, pronti sul tuo telefono.'],
  ['Tu dici sì. Pubblicato.', 'Pubblicato'],
], { num: '03', motto: "Il bello c'è già. Io lo accendo.", collegamento: 'I contenuti →' })

// Hermes: la scena del beneficio finisce a 28,5 (dissolvenza di 0,5 nello studio del finale)
const HERMES = agente(23, 'Hermes', 'hermes', 'Campagne', 'cromo', '/campagne', [
  ['Clienti nuovi?'],
  ['Trovati.', 'Trovati'],
  ['Solo quelli giusti.'],
  ['Ogni euro lascia una traccia.', 'traccia'],
  ['E il telefono squilla.'],
], { num: '04', motto: 'Porto da te chi ancora non ti conosce.', collegamento: 'Le campagne →', fine: 28.5 })

export const HOME: Regia = {
  T: 32,
  // clip d'apertura: fotogrammi 0 → n-1 su u 0 → 2, poi fermo sull'ultimo
  apertura: { conteggio: { pieno: 96, leggero: 64, minimo: 32 }, da: 0, a: 2 },
  // in ordine di `da` (sceneAttive lo richiede); la sovrapposizione fra due scene è la dissolvenza
  scene: [
    { nome: 'apertura', da: 0, a: 2.6 },
    { nome: 'studio', da: 2.0, a: 8.4 },
    ...ATLAS.scene,
    ...JANUS.scene,
    ...PROMETHEUS.scene,
    ...HERMES.scene,
    { nome: 'studio', da: 28.0, a: 32 },
  ],
  atti: [
    {
      id: 'apertura',
      nome: 'Agenti Studio',
      etichetta: '00 · Agenti Studio',
      da: 0,
      a: 2.4,
      battute: [
        { tipo: 'nome', testo: 'Agenti Studio', da: 0.5, a: 2.3 },
        { tipo: 'etichetta', testo: 'Agenzia AI · Faenza, Romagna', da: 0.9, a: 2.3 },
        { tipo: 'etichetta', testo: 'Automazioni · Siti web · Contenuti · Campagne', da: 1.2, a: 2.3 },
        { tipo: 'scorri', testo: 'Scorri', da: 0, a: 0.6 },
      ],
    },
    {
      id: 'studio',
      nome: 'Lo studio',
      etichetta: '00 · Lo studio',
      da: 2.4,
      a: 8.0,
      battute: [
        frase(['Tu fai il tuo mestiere.', 'mestiere'], 2.5, 3.0),
        frase(['Al resto pensiamo noi.', 'noi'], 3.0, 3.5),
        frase(['Ai messaggi a negozio chiuso.'], 3.55, 3.95),
        frase(['Al sito che nessuno trova.'], 3.95, 4.35),
        frase(['Ai post rimandati da mesi.'], 4.35, 4.75),
        frase(['Ai clienti che non sanno che esisti.'], 4.75, 5.2),
        frase(["Con l'intelligenza artificiale.", 'intelligenza artificiale'], 5.3, 5.85),
        frase(['E con una persona vera che risponde.', 'persona'], 5.85, 6.45),
        frase(['Quattro agenti. Uno studio.', 'agenti'], 6.6, 7.1),
        frase(['Nomi antichi, lavoro nuovo.'], 7.1, 7.55),
        frase(['Te li presentiamo.'], 7.55, 8.0),
      ],
    },
    ATLAS.atto,
    JANUS.atto,
    PROMETHEUS.atto,
    HERMES.atto,
    {
      id: 'finale',
      nome: 'Preventivo',
      etichetta: '05 · Preventivo',
      da: 28,
      a: 32,
      battute: [
        frase(["Stasera qualcuno cercherà un'attività come la tua."], 28.4, 28.9),
        frase(['Troverà te, o un altro.', 'un altro'], 28.9, 29.4),
        frase(['Più tempo per il tuo mestiere.', 'tempo'], 29.5, 29.95),
        frase(['Più margine a fine mese.', 'margine'], 29.95, 30.4),
        frase(['Seguiamo poche attività alla volta.'], 30.5, 30.95),
        frase(['La prossima può essere la tua.', 'la tua'], 30.95, 31.4),
      ],
    },
  ],
  convergenza: [31.2, 32.0],
  pulsante: { da: 31.7, testo: 'Richiedi un preventivo', href: '#preventivo', sotto: 'Senza impegno. Ti risponde Bruno entro un giorno lavorativo.' },
}
