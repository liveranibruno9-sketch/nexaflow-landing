// /contenuti · Prometheus. v2 (31/10, scelte di Bruno: titolo B, elenco di cosa creiamo senza «immagini e video creati al computer», mestieri allineati
// a quelli di Siti web). Il film è l'elenco, una voce per schermata (titolo + «Come funziona» + «Chiedi un preventivo»), con una scena in codice per voce.
// Testi in vault: pagine/contenuti-v2.md. Mai «intelligenza artificiale». Nessun prezzo (R4), nessun «Lavori» (R7). Modulo puro.
import { percorsoServizio } from './pagine.ts'
import type { DatiPagina, Frase } from './pagine.ts'
import type { GestoPagina } from '../tipi.ts'

const F = (nome: string) => `/film/pagine/contenuti/${nome}.webp`

/** cosa creiamo, dal più leggero al più completo: slug della pagina dedicata (provvisoria, da compilare), titolo, gesto di Prometheus, scena disegnata */
export type TipoContenuto = { slug: string; titolo: Frase; gesto: GestoPagina; vignetta: string; riga: string }
export const TIPI_CONTENUTO: TipoContenuto[] = [
  { slug: 'post-e-grafiche', titolo: ['Post e grafiche', 'grafiche'], gesto: { nome: 'lancia', lato: 'destro' }, vignetta: 'post',
    riga: 'Singoli post e grafiche per i tuoi social, quando ti servono: una novità, un evento, una promozione.' },
  { slug: 'caroselli', titolo: ['Caroselli', 'Caroselli'], gesto: { nome: 'lancia', lato: 'sinistro' }, vignetta: 'carosello',
    riga: 'Più pagine da scorrere per raccontare una storia: un lavoro, un prodotto, una stagione.' },
  { slug: 'video-brevi', titolo: ['Video brevi', 'brevi'], gesto: { nome: 'presenta', lato: 'destro' }, vignetta: 'video',
    riga: 'Quindici secondi dal tuo materiale: il passaggio al banco, il piatto, il dietro le quinte.' },
  { slug: 'piano-editoriale', titolo: ['Piano editoriale', 'editoriale'], gesto: { nome: 'lancia', lato: 'destro' }, vignetta: 'piano',
    riga: 'Cosa pubblicare, quando e dove, con i contenuti pronti ogni settimana da approvare col telefono.' },
  { slug: 'gestione-social', titolo: ['Gestione completa dei social', 'completa'], gesto: { nome: 'presenta', lato: 'sinistro' }, vignetta: 'gestione',
    riga: 'Piano, contenuti, pubblicazione e un resoconto ogni mese: tu approvi, al resto pensiamo noi.' },
]
const SU_MISURA = { titolo: ['Su misura', 'misura'] as Frase, gesto: { nome: 'modella' } as GestoPagina, vignetta: 'su-misura',
  riga: 'Raccontaci di cosa hai bisogno: lo prepariamo per la tua attività.' }
export const TIPI_CONTENUTO_TUTTI: TipoContenuto[] = [...TIPI_CONTENUTO, { slug: 'su-misura', ...SU_MISURA }]
const preventivo = (richiesta: string) => ({ testo: 'Chiedi un preventivo', href: '#preventivo', richiesta })
const ELENCO = [
  ...TIPI_CONTENUTO.map((t) => ({ titolo: t.titolo, gesto: t.gesto, vignetta: t.vignetta, azioni: [{ testo: 'Come funziona', href: `/contenuti/${t.slug}` }, preventivo(`Mi interessa: ${t.titolo[0]}.`)] })),
  { titolo: SU_MISURA.titolo, gesto: SU_MISURA.gesto, vignetta: SU_MISURA.vignetta, riga: SU_MISURA.riga, azioni: [{ testo: 'Raccontaci cosa ti serve', href: '#preventivo', richiesta: 'Vorrei dei contenuti su misura per: ' }] },
]

const H1 = 'Il tuo mestiere, raccontato come lo racconterebbe un grande marchio.'

export const CONTENUTI: DatiPagina = {
  id: 'contenuti',
  mascotte: 'prometheus',
  materia: 'saette',
  seo: {
    titolo: 'Creazione contenuti social a Faenza e Romagna | Agenti Studio',
    descrizione: 'Post, caroselli, video brevi e piano editoriale con la cura dei grandi marchi, per le attività di Faenza e della Romagna. Contenuti veri, pronti ogni settimana.',
  },
  h1: H1,
  poster: { src720: '/film/scene/prometheus-2-720.webp', src1080: '/film/scene/prometheus-2-1080.webp', alt: 'Prometheus, la mascotte di saette dei contenuti, con la fiammella' },
  percorso: percorsoServizio({
    id: 'contenuti',
    indice: '03 · Contenuti',
    materia: 'saette',
    servizio: 'Creazione contenuti',
    h1: H1,
    sotto: "Post, caroselli e video con la cura dei grandi marchi, per le attività di Faenza e della Romagna. Un piano chiaro, testi con la tua voce, materiale vero: ogni settimana i contenuti sono pronti e li approvi con un tocco. Chi ti segue ti riconosce; chi non ti conosce si ferma.",
    nota: 'Senza impegno. Ti risponde Bruno entro un giorno lavorativo.',
    cartoline: [
      { nome: 'contenuti-1', alt: 'Un video di cucina girato col telefono sul treppiede' },
      { nome: 'contenuti-2', alt: 'Il telefono che riprende un prodotto in studio' },
    ],
    capacita: {
      h2: 'Cosa creiamo per te.',
      passo: 0.6,
      blocchi: ELENCO,
      beneficio: [['Chi ti segue ti riconosce.', 'riconosce'], ['Chi non ti conosce si ferma.', 'si ferma']],
      gestoBeneficio: { nome: 'lancia', lato: 'destro' },
    },
  }),
  gioco: {
    h2: 'Cosa raccontare, per mestiere.',
    scelte: [
      { id: 'bnb', scena: 'c-bnb', nome: 'B&B e agriturismo', foto: F('cont-bnb'), testo: "Le stagioni della tenuta, la colazione, i dintorni da visitare: chi sceglie dove dormire guarda il profilo prima di scrivere. Un carosello curato porta la richiesta di disponibilità." },
      { id: 'ristorante', scena: 'c-ristorante', nome: 'Ristorante e bar', foto: F('cont-ristorante'), testo: "Chi impasta, il piatto del giorno, la cucina dietro le quinte: un video breve racconta più di una foto del menu. Chi lo guarda ha già deciso dove prenotare." },
      { id: 'negozio', scena: 'c-negozio', nome: 'Negozio', foto: F('cont-negozio'), testo: "Le novità in arrivo, il prodotto raccontato da chi lo vende, i consigli d'uso. Un post fatto bene porta le persone in negozio a ritirare." },
      { id: 'artigiano', scena: 'c-artigiano', nome: 'Artigiano e impresa', foto: F('cont-artigiano'), testo: "Il prima e dopo di un lavoro, un passaggio al banco, la faccia di chi lo fa. La fiducia nasce vedendo come lavori, e chi si fida chiede un sopralluogo." },
      { id: 'studio', scena: 'c-studio', nome: 'Studi e professionisti', foto: F('cont-studio'), testo: "Pillole utili per i clienti: scadenze, documenti da preparare, domande frequenti. Contenuti informativi e sobri, senza promesse di risultato né testimonianze." },
      { id: 'eventi', scena: 'c-eventi', nome: 'Associazioni ed eventi', foto: F('cont-eventi'), testo: "La data, il luogo, le storie che raccontano l'evento e le condivisioni che lo fanno girare. Chi lo vede sa cosa fare: iscriversi." },
    ],
  },
  tappe: {
    h2: 'Come si arriva ai primi contenuti.',
    nomi: ['Chiamata', 'Proposta', 'Primi contenuti'],
    passi: [
      { tappa: 0, titolo: 'Ci racconti la tua attività', testo: 'Una chiamata gratuita e senza impegno: cosa fai, a chi parli, cosa vuoi ottenere dai social, cosa non vuoi mostrare.' },
      { tappa: 0, titolo: 'Raccogliamo il materiale', testo: 'Ci mandi le foto e i video che hai già. Ti diciamo cosa riprendere col telefono, in modo semplice.' },
      { tappa: 1, titolo: 'Ricevi il piano e la proposta', testo: 'Temi, formati e frequenza, per iscritto, con i costi. Cosa pubblichiamo e cosa no lo decidiamo insieme.' },
      { tappa: 2, titolo: 'Ricevi i primi contenuti', testo: 'Arrivano sul telefono e li approvi uno per uno. Se qualcosa non ti convince, lo cambiamo.' },
      { tappa: 2, titolo: 'Ogni settimana, nuovi contenuti', testo: 'Pronti da approvare e, dopo il tuo sì, pubblicati. Ogni mese guardiamo insieme cosa ha funzionato e aggiustiamo il piano.' },
    ],
    riga: 'Tu ci metti poco: una chiamata, qualche foto, un sì alla settimana.',
  },
  domande: {
    h2: 'Le domande che ci fanno prima di iniziare.',
    voci: [
      { d: 'Devo comparire io nei video?', r: 'No, se non vuoi. Si possono raccontare le mani, il prodotto, il locale, il lavoro. Se un giorno vorrai mostrarti, ti aiutiamo a farlo con naturalezza.' },
      { d: 'Su quali social lavorate?', r: 'Partiamo da quelli dove ci sono i tuoi clienti: Instagram e Facebook per la maggior parte delle attività, LinkedIn per studi e imprese, TikTok se il tuo pubblico c\'è. Lo decidiamo nella prima chiamata.' },
      { d: 'Usate immagini finte?', r: "No. Usiamo il materiale vero della tua attività. Se un'immagine è creata al computer, lo diciamo." },
      { d: 'Chi pubblica?', r: 'Dopo il tuo sì, pubblichiamo noi, nei giorni e agli orari concordati. Ogni contenuto lo vedi prima di andare online.' },
      { d: 'Servono anche le pubblicità?', r: 'Non per forza. I contenuti ti fanno riconoscere da chi già ti segue. Se vuoi arrivare anche a chi non ti conosce, ci sono le campagne pubblicitarie, ma sono un passo a parte.' },
      { d: 'Quanto costa?', r: 'Dipende da quanti contenuti servono ogni settimana e su quali social. Dopo la chiamata ricevi una proposta scritta, con i costi chiari.' },
    ],
  },
  invito: { frasi: [["Quando è stato l'ultimo post?"], ['Da oggi, si cambia.', 'cambia']] },
  coda: { riga: 'Raccontaci cosa fai. Ti diciamo che contenuti servono e come li prepariamo. Seguiamo poche attività alla volta: la prossima può essere la tua.' },
}
