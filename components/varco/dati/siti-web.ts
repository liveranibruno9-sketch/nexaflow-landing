// /siti-web · Janus. Testi da pagine/copy-siti-web.md, accorciati dove lo spazio non bastava (§16 della spec delle pagine); ogni cambio è
// in pagine/registro-costruzione.md. Mai «intelligenza artificiale». Nessun prezzo (R4), nessun «Lavori» (R7). Modulo puro.
import { percorsoServizio } from './pagine.ts'
import { INVITO } from '../../film/dati/contatti.ts'
import type { DatiPagina, Frase } from './pagine.ts'
import type { GestoPagina } from '../tipi.ts'

/** i tipi di sito che offriamo, dal più leggero al più complesso: slug della pagina dedicata (provvisoria, da compilare), titolo, gesto di Janus, scena disegnata */
export type TipoSito = { slug: string; titolo: Frase; gesto: GestoPagina; vignetta: string; riga: string }
export const TIPI_SITO: TipoSito[] = [
  { slug: 'landing-page', titolo: ['Landing page', 'Landing'], gesto: { nome: 'presenta', lato: 'destro' }, vignetta: 'landing',
    riga: 'Una pagina sola, un obiettivo solo: farti chiamare, scrivere o prenotare.' },
  { slug: 'sito-vetrina', titolo: ['Sito vetrina', 'vetrina'], gesto: { nome: 'modella' }, vignetta: 'vetrina',
    riga: 'Poche pagine curate: chi sei, cosa fai, dove sei e come contattarti.' },
  { slug: 'strutture-ricettive', titolo: ['Sito per strutture ricettive', 'ricettive'], gesto: { nome: 'presenta', lato: 'sinistro' }, vignetta: 'ricettive',
    riga: "Foto che fanno venire voglia, camere chiare e richiesta di disponibilità." },
  { slug: 'agenzie-e-studi', titolo: ['Sito per agenzie e studi', 'studi'], gesto: { nome: 'modella' }, vignetta: 'agenzie',
    riga: "Servizi spiegati con chiarezza e richieste raccolte in ordine." },
  { slug: 'e-commerce-store', titolo: ['E-commerce store', 'store'], gesto: { nome: 'lancia', lato: 'destro' }, vignetta: 'store',
    riga: 'Un catalogo curato, schede che fanno scegliere, carrello e pagamento sicuri.' },
  { slug: 'sito-3d-immersivo', titolo: ['Sito 3D immersivo', 'immersivo'], gesto: { nome: 'modella' }, vignetta: 'tre-d',
    riga: "Scene in movimento e profondità: un sito che si ricorda." },
]
const APP = { slug: 'app-e-portali', titolo: ['App e portali su misura', 'portali'] as Frase, gesto: { nome: 'presenta', lato: 'sinistro' } as GestoPagina, vignetta: 'app',
  riga: "Aree riservate, gestionali leggeri e app, costruiti sul tuo modo di lavorare." }
export const TIPI_SITO_TUTTI: TipoSito[] = [...TIPI_SITO, APP]
const preventivo = (richiesta: string) => ({ testo: INVITO, href: '#preventivo', richiesta })
const ELENCO = TIPI_SITO_TUTTI.map((t) => ({
  titolo: t.titolo, gesto: t.gesto, vignetta: t.vignetta,
  azioni: [{ testo: 'Come funziona', href: `/siti-web/${t.slug}` }, preventivo(`Mi interessa: ${t.titolo[0]}.`)],
}))

const H1 = 'Siti da grande marchio, alla tua portata.'
const F = (nome: string) => `/film/pagine/siti-web/${nome}.webp`

export const SITI_WEB: DatiPagina = {
  id: 'siti-web',
  mascotte: 'janus',
  materia: 'vetro',
  seo: {
    titolo: 'Siti web per PMI a Faenza e Romagna | Agenti Studio',
    descrizione: 'Siti web di qualità premium per le PMI di Faenza e della Romagna, a costi accessibili: landing page, siti vetrina, e-commerce, siti 3D e app. Richiedi informazioni.',
  },
  h1: H1,
  poster: { src720: '/film/scene/janus-2-720.webp', src1080: '/film/scene/janus-2-1080.webp', alt: 'Janus, la mascotte di vetro dei siti web' },
  percorso: percorsoServizio({
    id: 'siti-web',
    indice: '02 · Siti web',
    materia: 'vetro',
    servizio: "Siti web e app",
    h1: H1,
    sotto: "Un sito curato come quelli dei grandi marchi, a costi pensati per le piccole e medie imprese. Veloce dal telefono, facile da trovare su Google.",
    nota: 'Senza impegno. Ti risponde Bruno entro un giorno lavorativo.',
    cartoline: [
      { nome: 'siti-1', alt: 'Un sito aperto sul portatile' },
      { nome: 'siti-2', alt: "Un'app sul telefono, fra le mani" },
    ],
    capacita: {
      h2: 'Che sito fa per te.',
      passo: 0.6,
      blocchi: ELENCO,
      beneficio: [['Chi arriva capisce.', 'capisce'], ['Chi capisce prenota.', 'prenota']],
      gestoBeneficio: { nome: 'presenta', lato: 'destro' },
    },
  }),
  gioco: {
    h2: 'Il sito giusto, per mestiere.',
    scelte: [
      { id: 'bnb', scena: 'bnb', nome: 'B&B e agriturismo', foto: F('siti-bnb'), testo: "Foto che fanno venire voglia di dormire da te e richiesta di disponibilità con un tocco. Anche in inglese." },
      { id: 'ristorante', scena: 'ristorante', nome: 'Ristorante e bar', foto: F('siti-ristorante'), testo: "Menu leggibile, orari e mappa subito in vista, tavolo prenotato con un tocco." },
      { id: 'negozio', scena: 'negozio', nome: 'Negozio', foto: F('siti-negozio'), testo: "Cosa vendi, dove sei e quando sei aperto, anche a serranda abbassata. Se vuoi, il catalogo diventa un negozio online." },
      { id: 'artigiano', scena: 'artigiano', nome: 'Artigiano e impresa', foto: F('siti-artigiano'), testo: "Le foto dei lavori fatti parlano per te. Chi ti cerca chiede un sopralluogo senza girare il sito." },
      { id: 'studio', scena: 'studio', nome: 'Studi e professionisti', foto: F('siti-studio'), testo: "Servizi spiegati con chiarezza e richiesta di appuntamento semplice. Un sito sobrio, senza promesse di risultato né testimonianze." },
      { id: 'eventi', scena: 'eventi', nome: 'Associazioni ed eventi', foto: F('siti-eventi'), testo: "Date, luogo e come partecipare in cima alla pagina. Ci si iscrive dal telefono in pochi secondi." },
    ],
  },
  tappe: {
    h2: "Come nasce il tuo sito.",
    nomi: ["Chiamata", "Proposta", "Online"],
    passi: [
      { tappa: 0, titolo: "Ci racconti la tua attività", testo: "Una chiamata gratuita: cosa fai e a chi ti rivolgi." },
      { tappa: 0, titolo: "Raccogliamo il materiale", testo: "Ci mandi foto e testi che hai. I testi li scriviamo noi, con le tue parole." },
      { tappa: 1, titolo: "Ricevi la proposta scritta", testo: "Pagine, tempi e costi per iscritto. Nessuna sorpresa dopo." },
      { tappa: 2, titolo: "Vedi l'anteprima dal telefono", testo: "La apri su un link privato e ci dici cosa cambiare." },
      { tappa: 2, titolo: "Si va online", testo: "Colleghiamo il dominio e controlliamo telefono, Google e modulo. Il sito è tuo." },
      { tappa: 2, titolo: "Dopo", testo: "Per cambiare un testo o aggiungere una pagina, ci scrivi." },
    ],
    riga: "Tu ci metti una chiamata, le tue foto e un'occhiata all'anteprima.",
  },
  domande: {
    h2: "Le domande più frequenti.",
    voci: [
      { d: "Ho già la pagina Facebook o Instagram. Mi serve un sito?", r: "Sì. Sui social le regole le decidono le piattaforme; il sito è tuo e lo trova chi ti cerca su Google." },
      { d: "Il sito comparirà primo su Google?", r: "Nessuno può garantirlo. Lo prepariamo bene e lo segnaliamo a Google: un sito nuovo ha bisogno di tempo." },
      { d: "Mi servono foto professionali?", r: "Non per forza: con foto fatte bene dal telefono si parte. Ti diciamo cosa fotografare." },
      { d: "Chi lo aggiorna dopo?", r: "Ci scrivi cosa cambiare. Come funzionano le modifiche lo trovi nella proposta, prima di iniziare." },
      { d: "Ho già un dominio e un'email: li perdo?", r: "No. Il dominio si collega al nuovo sito e le email continuano a funzionare." },
      { d: "Quanto costa e quanto ci vuole?", r: "Dipende dalle pagine e dal materiale che hai. Costi e tempi sono nella proposta scritta, dopo la prima chiamata." },
    ],
  },
  invito: { frasi: [['Il tuo sito comincia'], ['da una chiamata.', 'chiamata']] },
  coda: { riga: "Raccontaci cosa fai. Ti diciamo se ti serve un sito, un negozio online o un'app." },
}
