// /campagne · Hermes. v2 (31/10, scelte di Bruno: titolo A, elenco di cosa facciamo, mestieri allineati a Siti web e Contenuti). Il film è l'elenco, una voce
// per schermata (titolo + «Come funziona» + «Chiedi un preventivo»), con una scena in codice per voce (la goccia che sceglie la persona giusta; niente mappa a punti).
// Testi in vault: pagine/campagne-proposta.md. Mai «intelligenza artificiale». Nessun prezzo (R4), nessun risultato promesso, nessun «Lavori» (R7). Modulo puro.
import { percorsoServizio } from './pagine.ts'
import type { DatiPagina, Frase } from './pagine.ts'
import type { GestoPagina } from '../tipi.ts'

const F = (nome: string) => `/film/pagine/siti-web/${nome}.webp`

/** cosa facciamo, dal più leggero al più completo: slug della pagina dedicata (provvisoria, da compilare), titolo, gesto di Hermes, scena disegnata */
export type TipoCampagna = { slug: string; titolo: Frase; gesto: GestoPagina; vignetta: string; riga: string }
export const TIPI_CAMPAGNA: TipoCampagna[] = [
  { slug: 'lancio-e-promozioni', titolo: ['Campagna di lancio o promozione', 'promozione'], gesto: { nome: 'salta' }, vignetta: 'lancio',
    riga: 'Un evento, un\'apertura, una promozione: un annuncio a tempo che raggiunge le persone giuste attorno a te.' },
  { slug: 'instagram-e-facebook', titolo: ['Pubblicità su Instagram e Facebook', 'Facebook'], gesto: { nome: 'lancia', lato: 'destro' }, vignetta: 'feed',
    riga: 'Annunci nel feed di chi abita in zona o ha gli interessi giusti, con le tue foto e le tue parole.' },
  { slug: 'google', titolo: ['Pubblicità su Google', 'Google'], gesto: { nome: 'presenta', lato: 'sinistro' }, vignetta: 'google',
    riga: 'Compari tra i primi risultati nel momento in cui qualcuno cerca quello che fai.' },
  { slug: 'contatti', titolo: ['Campagne per ricevere contatti', 'contatti'], gesto: { nome: 'lancia', lato: 'sinistro' }, vignetta: 'contatti',
    riga: 'L\'obiettivo sono le richieste: messaggi, telefonate e moduli, contati uno per uno.' },
  { slug: 'chi-ti-ha-visitato', titolo: ['Raggiungere chi ti ha già visitato', 'visitato'], gesto: { nome: 'salta' }, vignetta: 'visitato',
    riga: 'Chi ha guardato il tuo sito e non ha scritto vede un promemoria gentile, e torna.' },
  { slug: 'gestione-e-resoconto', titolo: ['Gestione continua e resoconto', 'resoconto'], gesto: { nome: 'presenta', lato: 'destro' }, vignetta: 'costo',
    riga: 'Ogni settimana si corregge il tiro, ogni mese ricevi un resoconto semplice con il costo di ogni contatto.' },
]
const SU_MISURA = { titolo: ['Su misura', 'misura'] as Frase, gesto: { nome: 'modella' } as GestoPagina, vignetta: 'su-misura',
  riga: 'Raccontaci la tua attività e l\'obiettivo: costruiamo la campagna per te.' }
export const TIPI_CAMPAGNA_TUTTI: TipoCampagna[] = [...TIPI_CAMPAGNA, { slug: 'su-misura', ...SU_MISURA }]
const preventivo = (richiesta: string) => ({ testo: 'Chiedi un preventivo', href: '#preventivo', richiesta })
const ELENCO = [
  ...TIPI_CAMPAGNA.map((t) => ({ titolo: t.titolo, gesto: t.gesto, vignetta: t.vignetta, azioni: [{ testo: 'Come funziona', href: `/campagne/${t.slug}` }, preventivo(`Mi interessa: ${t.titolo[0]}.`)] })),
  { titolo: SU_MISURA.titolo, gesto: SU_MISURA.gesto, vignetta: SU_MISURA.vignetta, riga: SU_MISURA.riga, azioni: [{ testo: 'Raccontaci cosa ti serve', href: '#preventivo', richiesta: 'Vorrei una campagna su misura per: ' }] },
]

const H1 = 'La pubblicità dei grandi marchi, con un budget a misura di piccola impresa.'

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
    sotto: 'Annunci su Instagram, Facebook e Google rivolti alle persone giuste, con la cura dei grandi marchi. Il budget lo scegli e lo paghi tu, dal tuo account. Ogni settimana si corregge il tiro e ogni mese ricevi un resoconto semplice: sai quanto costa ogni contatto.',
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
      { id: 'bnb', scena: 'h-bnb', nome: 'B&B e agriturismo', foto: F('siti-bnb'), testo: "Camere libere in bassa stagione: annunci a chi cerca un weekend in Romagna, anche da fuori regione e dall'estero. Chi li vede apre il sito e scrive per le date." },
      { id: 'ristorante', scena: 'h-ristorante', nome: 'Ristorante e bar', foto: F('siti-ristorante'), testo: "Serata a tema, menu di stagione, giorni da riempire: annunci a chi abita entro un certo raggio dalla tua porta, proprio nei giorni in cui serve. Il tavolo si prenota." },
      { id: 'negozio', scena: 'h-negozio', nome: 'Negozio', foto: F('siti-negozio'), testo: "Nuovi arrivi, una sezione nuova, un evento: annunci a chi abita nei dintorni, con la mappa e un invito a passare. Chi lo vede viene a ritirare." },
      { id: 'artigiano', scena: 'h-artigiano', nome: 'Artigiano e impresa', foto: F('siti-artigiano'), testo: "Chi cerca «elettricista a Faenza» deve trovare te: su Google, nel momento in cui lo cerca. Il telefono squilla e chi chiama chiede un sopralluogo." },
      { id: 'studio', scena: 'h-studio', nome: 'Studi e professionisti', foto: F('siti-studio'), testo: "Annunci solo informativi sul servizio, a chi lo cerca su Google proprio mentre lo cerca. Senza domande sulla persona, senza promesse di risultato, senza sconti come leva." },
      { id: 'eventi', scena: 'h-eventi', nome: 'Associazioni ed eventi', foto: '/film/pagine/contenuti/cont-eventi.webp', testo: "Data, luogo e come partecipare in un annuncio per chi abita in zona o segue temi simili. Si arriva alla pagina e ci si iscrive entro la data." },
    ],
  },
  tappe: {
    h2: 'Come nasce la tua campagna.',
    nomi: ['Chiamata', 'Proposta', 'Partenza'],
    passi: [
      { tappa: 0, titolo: 'Ci racconti cosa vuoi ottenere', testo: 'Una chiamata gratuita e senza impegno: cosa vendi, a chi, in che zona, cosa vorresti vedere succedere nei prossimi mesi.' },
      { tappa: 1, titolo: 'Ricevi il piano scritto', testo: 'Dove compare la pubblicità, a chi, per quanto tempo. Due voci distinte: il nostro lavoro e il budget per gli annunci, che paghi tu alle piattaforme.' },
      { tappa: 2, titolo: 'Prepariamo testi e immagini', testo: 'Annunci con le tue foto e le tue parole. Li vedi e li approvi prima di accendere qualsiasi cosa.' },
      { tappa: 2, titolo: 'Prepariamo gli account', testo: 'Gli account pubblicitari sono intestati a te. Se non li hai, li apriamo insieme.' },
      { tappa: 2, titolo: 'Parte la campagna', testo: 'Nei primi giorni controlliamo da vicino che arrivi alle persone giuste.' },
      { tappa: 2, titolo: 'Ogni settimana si corregge, poi il resoconto', testo: 'Spostiamo il budget dove funziona. Alla fine ricevi un resoconto con quanto è costato ogni nuovo contatto.' },
    ],
    riga: 'Tu ci metti poco: una chiamata, qualche foto, un sì agli annunci.',
  },
  domande: {
    h2: 'Le domande che ci fanno prima di iniziare.',
    voci: [
      { d: 'Mi garantite un numero di clienti?', r: 'No, e nessuno onesto può farlo: dipende dal tuo mestiere, dalla zona, dal periodo. Ti garantiamo di misurare tutto e di dirti cosa è successo.' },
      { d: 'Quanto devo spendere di pubblicità?', r: 'Dipende dall\'obiettivo e dalla zona. Te lo diciamo nella proposta e lo decidi tu. Si può partire con poco e crescere solo se funziona.' },
      { d: 'Chi paga Meta e Google?', r: 'Tu, direttamente, dal tuo account. Il nostro lavoro e il budget pubblicitario sono due voci separate, scritte nella proposta.' },
      { d: 'Dopo quanto vedo i primi risultati?', r: 'I primi dati arrivano in pochi giorni. Per capire cosa funziona servono alcune settimane, e te lo spieghiamo con le tue cifre.' },
      { d: 'Mi serve anche un sito?', r: 'Aiuta molto: la pubblicità porta le persone in un posto dove possono agire, come un sito, WhatsApp o un modulo. Se non ce l\'hai, ne parliamo.' },
      { d: 'Come si legge il resoconto?', r: 'Senza parole difficili: quanta gente ha visto l\'annuncio, quanti hanno scritto o chiamato, quanto ti è costato ognuno.' },
    ],
  },
  invito: { frasi: [['Vuoi sapere quanto ti costa'], ['un cliente nuovo?', 'cliente']] },
  coda: { riga: "Raccontaci la tua attività e l'obiettivo. Ti diciamo come la raggiungeresti, con quale budget e come lo misureremo. Seguiamo poche attività alla volta: la prossima può essere la tua." },
}
