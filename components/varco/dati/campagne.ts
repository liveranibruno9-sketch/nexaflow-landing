// /campagne · Hermes. v2 (31/10, scelte di Bruno: titolo A, elenco di cosa facciamo, mestieri allineati a Siti web e Contenuti). Il film è l'elenco, una voce
// per schermata (titolo + «Come funziona» + «Chiedi un preventivo»), con una scena in codice per voce (la goccia che sceglie la persona giusta; niente mappa a punti).
// Testi in vault: pagine/campagne-proposta.md. Mai «intelligenza artificiale». Nessun prezzo (R4), nessun risultato promesso, nessun «Lavori» (R7). Modulo puro.
import { percorsoServizio } from './pagine.ts'
import { INVITO } from '../../film/dati/contatti.ts'
import type { DatiPagina, Frase } from './pagine.ts'
import type { GestoPagina } from '../tipi.ts'

const F = (nome: string) => `/film/pagine/siti-web/${nome}.webp`

/** cosa facciamo, dal più leggero al più completo: slug della pagina dedicata (provvisoria, da compilare), titolo, gesto di Hermes, scena disegnata */
export type TipoCampagna = { slug: string; titolo: Frase; gesto: GestoPagina; vignetta: string; riga: string }
export const TIPI_CAMPAGNA: TipoCampagna[] = [
  { slug: 'lancio-e-promozioni', titolo: ['Campagna di lancio o promozione', 'promozione'], gesto: { nome: 'salta' }, vignetta: 'lancio',
    riga: "Un evento, un'apertura, una promozione: un annuncio a tempo per chi sta attorno a te." },
  { slug: 'instagram-e-facebook', titolo: ['Pubblicità su Instagram e Facebook', 'Facebook'], gesto: { nome: 'lancia', lato: 'destro' }, vignetta: 'feed',
    riga: "Annunci nel feed di chi abita in zona, con le tue foto e le tue parole." },
  { slug: 'google', titolo: ['Pubblicità su Google', 'Google'], gesto: { nome: 'presenta', lato: 'sinistro' }, vignetta: 'google',
    riga: "Compari tra i primi risultati quando qualcuno cerca quello che fai." },
  { slug: 'contatti', titolo: ['Campagne per ricevere contatti', 'contatti'], gesto: { nome: 'lancia', lato: 'sinistro' }, vignetta: 'contatti',
    riga: 'L\'obiettivo sono le richieste: messaggi, telefonate e moduli, contati uno per uno.' },
  { slug: 'chi-ti-ha-visitato', titolo: ['Richiamare chi ti ha visitato', 'visitato'], gesto: { nome: 'salta' }, vignetta: 'visitato',
    riga: "Chi ha visto il tuo sito senza scrivere riceve un promemoria gentile." },
  { slug: 'gestione-e-resoconto', titolo: ['Gestione continua e resoconto', 'resoconto'], gesto: { nome: 'presenta', lato: 'destro' }, vignetta: 'costo',
    riga: "Ogni settimana si corregge il tiro, ogni mese ricevi il costo di ogni contatto." },
]
const SU_MISURA = { titolo: ['Su misura', 'misura'] as Frase, gesto: { nome: 'modella' } as GestoPagina, vignetta: 'su-misura',
  riga: 'Raccontaci la tua attività e l\'obiettivo: costruiamo la campagna per te.' }
export const TIPI_CAMPAGNA_TUTTI: TipoCampagna[] = [...TIPI_CAMPAGNA, { slug: 'su-misura', ...SU_MISURA }]
const preventivo = (richiesta: string) => ({ testo: INVITO, href: '#preventivo', richiesta })
const ELENCO = [
  ...TIPI_CAMPAGNA.map((t) => ({ titolo: t.titolo, gesto: t.gesto, vignetta: t.vignetta, azioni: [{ testo: 'Come funziona', href: `/campagne/${t.slug}` }, preventivo(`Mi interessa: ${t.titolo[0]}.`)] })),
  { titolo: SU_MISURA.titolo, gesto: SU_MISURA.gesto, vignetta: SU_MISURA.vignetta, riga: SU_MISURA.riga, azioni: [{ testo: 'Raccontaci cosa ti serve', href: '#preventivo', richiesta: 'Vorrei una campagna su misura per: ' }] },
]

const H1 = 'Pubblicità da grandi marchi, budget da piccola impresa.'

export const CAMPAGNE: DatiPagina = {
  id: 'campagne',
  mascotte: 'hermes',
  materia: 'cromo',
  seo: {
    titolo: 'Campagne pubblicitarie a Faenza e Romagna | Agenti Studio',
    descrizione: 'Pubblicità su Instagram, Facebook e Google per le PMI di Faenza e della Romagna, con budget a tua misura. Sai quanto costa ogni contatto.',
  },
  h1: H1,
  poster: { src720: '/film/scene/hermes-2-720.webp', src1080: '/film/scene/hermes-2-1080.webp', alt: 'Hermes, la mascotte di cromo delle campagne, con le ali' },
  percorso: percorsoServizio({
    id: 'campagne',
    indice: '04 · Campagne',
    materia: 'cromo',
    servizio: 'Campagne pubblicitarie',
    h1: H1,
    sotto: "Annunci su Instagram, Facebook e Google, alle persone giuste. Il budget lo scegli tu, e ogni mese sai quanto costa ogni contatto.",
    nota: 'Senza impegno. Ti risponde Bruno entro un giorno lavorativo.',
    cartoline: [
      { nome: 'campagne-1', alt: 'Una pubblicità su Facebook vista dal telefono' },
      { nome: 'campagne-2', alt: 'I grafici dei risultati sul portatile' },
    ],
    capacita: {
      h2: 'Cosa facciamo per te.',
      passo: 0.6,
      blocchi: ELENCO,
      beneficio: [['Nessuno può garantirti quante richieste arriveranno.', 'garantirti'], ['Noi ti garantiamo di sapere cosa è successo, e perché.', 'perché']],
      gestoBeneficio: { nome: 'salta' },
    },
  }),
  gioco: {
    h2: 'Chi raggiungere, per mestiere.',
    scelte: [
      { id: 'bnb', scena: 'h-bnb', nome: 'B&B e agriturismo', foto: F('siti-bnb'), testo: "Camere libere in bassa stagione: annunci a chi cerca un weekend in Romagna, anche dall'estero." },
      { id: 'ristorante', scena: 'h-ristorante', nome: 'Ristorante e bar', foto: F('siti-ristorante'), testo: "Serata a tema o giorni da riempire: annunci a chi abita vicino, proprio nei giorni in cui serve." },
      { id: 'negozio', scena: 'h-negozio', nome: 'Negozio', foto: F('siti-negozio'), testo: "Nuovi arrivi o un evento: annunci a chi abita nei dintorni, con la mappa e un invito a passare." },
      { id: 'artigiano', scena: 'h-artigiano', nome: 'Artigiano e impresa', foto: F('siti-artigiano'), testo: "Chi cerca «elettricista a Faenza» trova te, su Google, nel momento in cui lo cerca." },
      { id: 'studio', scena: 'h-studio', nome: 'Studi e professionisti', foto: F('siti-studio'), testo: "Annunci solo informativi, a chi cerca il servizio su Google. Senza promesse di risultato e senza sconti come leva." },
      { id: 'eventi', scena: 'h-eventi', nome: 'Associazioni ed eventi', foto: '/film/pagine/contenuti/cont-eventi.webp', testo: "Data, luogo e come partecipare, per chi abita in zona o segue temi simili." },
    ],
  },
  tappe: {
    h2: "Come nasce la tua campagna.",
    nomi: ["Chiamata", "Proposta", "Partenza"],
    passi: [
      { tappa: 0, titolo: "Ci racconti cosa vuoi ottenere", testo: "Una chiamata gratuita: cosa vendi, a chi e in che zona." },
      { tappa: 1, titolo: "Ricevi il piano scritto", testo: "Due voci distinte: il nostro lavoro e il budget degli annunci, che paghi tu alle piattaforme." },
      { tappa: 2, titolo: "Prepariamo testi e immagini", testo: "Con le tue foto e le tue parole. Li approvi prima di accendere." },
      { tappa: 2, titolo: "Gli account sono tuoi", testo: "Sono intestati a te. Se non li hai, li apriamo insieme." },
      { tappa: 2, titolo: "Parte la campagna", testo: "Nei primi giorni controlliamo che arrivi alle persone giuste." },
      { tappa: 2, titolo: "Si corregge ogni settimana", testo: "Spostiamo il budget dove funziona. Nel resoconto vedi quanto è costato ogni contatto." },
    ],
    riga: "Tu ci metti una chiamata, qualche foto e un sì agli annunci.",
  },
  domande: {
    h2: "Le domande più frequenti.",
    voci: [
      { d: "Mi garantite un numero di clienti?", r: "No, e nessuno onesto può farlo. Ti garantiamo di misurare tutto e di dirti cosa è successo." },
      { d: "Quanto devo spendere di pubblicità?", r: "Dipende dall'obiettivo e dalla zona. Lo decidi tu: si può partire con poco e crescere se funziona." },
      { d: "Chi paga Meta e Google?", r: "Tu, dal tuo account. Il nostro lavoro e il budget pubblicitario sono due voci separate." },
      { d: "Dopo quanto vedo i primi risultati?", r: "I primi dati arrivano in pochi giorni. Per capire cosa funziona servono alcune settimane." },
      { d: "Mi serve anche un sito?", r: "Aiuta molto: la pubblicità porta le persone dove possono agire. Se non ce l'hai, ne parliamo." },
      { d: "Come si legge il resoconto?", r: "Senza parole difficili: quanti hanno visto l'annuncio, quanti hanno scritto, quanto ti è costato ognuno." },
    ],
  },
  invito: { frasi: [['Vuoi sapere quanto ti costa'], ['un cliente nuovo?', 'cliente']] },
  coda: { riga: "Raccontaci l'attività e l'obiettivo. Ti diciamo come raggiungerlo, con quale budget e come lo misuriamo." },
}
