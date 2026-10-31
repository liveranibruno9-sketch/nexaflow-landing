// /siti-web · Janus. Testi da pagine/copy-siti-web.md, accorciati dove lo spazio non bastava (§16 della spec delle pagine); ogni cambio è
// in pagine/registro-costruzione.md. Mai «intelligenza artificiale». Nessun prezzo (R4), nessun «Lavori» (R7). Modulo puro.
import { percorsoServizio } from './pagine.ts'
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
    riga: 'Foto che fanno venire voglia, camere chiare, richiesta di disponibilità e ospiti stranieri in inglese.' },
  { slug: 'agenzie-e-studi', titolo: ['Sito per agenzie e studi', 'studi'], gesto: { nome: 'modella' }, vignetta: 'agenzie',
    riga: 'Servizi spiegati con chiarezza, moduli di richiesta e le richieste raccolte in ordine.' },
  { slug: 'e-commerce-store', titolo: ['E-commerce store', 'store'], gesto: { nome: 'lancia', lato: 'destro' }, vignetta: 'store',
    riga: 'Un catalogo curato, schede che fanno scegliere, carrello e pagamento sicuri.' },
  { slug: 'sito-3d-immersivo', titolo: ['Sito 3D immersivo', 'immersivo'], gesto: { nome: 'modella' }, vignetta: 'tre-d',
    riga: 'Scene in movimento e profondità: un sito che si ricorda, per chi vuole distinguersi.' },
]
const APP = { slug: 'app-e-portali', titolo: ['App e portali su misura', 'portali'] as Frase, gesto: { nome: 'presenta', lato: 'sinistro' } as GestoPagina, vignetta: 'app',
  riga: 'Aree riservate, gestionali leggeri e app per clienti e collaboratori, costruiti sul tuo modo di lavorare.' }
export const TIPI_SITO_TUTTI: TipoSito[] = [...TIPI_SITO, APP]
const preventivo = (richiesta: string) => ({ testo: 'Chiedi un preventivo', href: '#preventivo', richiesta })
const ELENCO = TIPI_SITO_TUTTI.map((t) => ({
  titolo: t.titolo, gesto: t.gesto, vignetta: t.vignetta,
  azioni: [{ testo: 'Come funziona', href: `/siti-web/${t.slug}` }, preventivo(`Mi interessa: ${t.titolo[0]}.`)],
}))

const H1 = 'Siti da grande marchio, alla portata della tua attività.'
const F = (nome: string) => `/film/pagine/siti-web/${nome}.webp`

export const SITI_WEB: DatiPagina = {
  id: 'siti-web',
  mascotte: 'janus',
  materia: 'vetro',
  seo: {
    titolo: 'Siti web per PMI a Faenza e Romagna | Agenti Studio',
    descrizione: 'Siti web di qualità premium per le PMI di Faenza e della Romagna, a costi accessibili: landing page, siti vetrina, e-commerce, siti 3D e app. Chiedi un preventivo.',
  },
  h1: H1,
  poster: { src720: '/film/scene/janus-2-720.webp', src1080: '/film/scene/janus-2-1080.webp', alt: 'Janus, la mascotte di vetro dei siti web' },
  percorso: percorsoServizio({
    id: 'siti-web',
    indice: '02 · Siti web',
    materia: 'vetro',
    servizio: 'Sviluppo siti web e app',
    h1: H1,
    sotto: 'Un sito curato come quelli dei grandi marchi, con costi pensati per le piccole e medie imprese. Veloce da telefono, facile da trovare su Google: chi arriva capisce subito cosa fai e ti scrive o prenota. Dalla pagina singola al negozio online, scegli il livello che ti serve.',
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
    h2: 'Cosa deve mostrare il sito, per mestiere.',
    scelte: [
      { id: 'bnb', nome: 'B&B e agriturismo', foto: F('siti-bnb'), testo: 'Foto che fanno venire voglia, camere e servizi chiari, richiesta di disponibilità dal telefono, ospiti stranieri in inglese.' },
      { id: 'ristorante', nome: 'Ristorante e bar', foto: F('siti-ristorante'), testo: 'Menu leggibile senza ingrandire, orari e mappa subito in vista, prenotazione con un tocco.' },
      { id: 'negozio', nome: 'Negozio', foto: F('siti-negozio'), testo: 'Cosa vendi, dove sei, quando sei aperto. Se vuoi, un negozio online con il catalogo curato.' },
      { id: 'artigiano', nome: 'Artigiano e impresa', foto: F('siti-artigiano'), testo: 'Cosa fai, dove lavori, come chiedere un sopralluogo o un preventivo. Le foto dei lavori fatti, dove chi ti cerca può vederle.' },
      { id: 'studio', nome: 'Studi e professionisti', foto: F('siti-studio'), testo: 'Servizi spiegati in modo chiaro, richiesta di appuntamento, informazioni di legge al loro posto. Niente promesse di risultato né testimonianze di pazienti: nel settore sanitario non si possono usare.' },
      { id: 'eventi', nome: 'Associazioni ed eventi', foto: F('siti-eventi'), testo: 'Date, luogo, come partecipare, iscrizione dal telefono.' },
    ],
  },
  tappe: {
    h2: 'Come nasce il tuo sito.',
    nomi: ['Chiamata', 'Proposta', 'Online'],
    passi: [
      { tappa: 0, titolo: 'Ci racconti la tua attività', testo: 'Una chiamata gratuita e senza impegno: cosa fai, a chi ti rivolgi, cosa vuoi che succeda quando qualcuno apre il sito.' },
      { tappa: 0, titolo: 'Raccogliamo il materiale', testo: 'Ci mandi le foto e i testi che hai. Ti diciamo cosa fotografare e cosa manca; i testi li scriviamo noi, con le tue parole.' },
      { tappa: 1, titolo: 'Ricevi la proposta scritta', testo: 'Pagine, tempi e costi per iscritto. Nessuna sorpresa dopo.' },
      { tappa: 2, titolo: "Vedi l'anteprima dal telefono", testo: 'Prima di pubblicare apri il sito su un link privato. Dici cosa cambiare, correggiamo.' },
      { tappa: 2, titolo: 'Si va online', testo: 'Colleghiamo il dominio, controlliamo telefono, Google e modulo, e ti spieghiamo come funziona tutto. Il sito è tuo.' },
      { tappa: 2, titolo: 'Dopo', testo: 'Se vuoi cambiare un testo, aggiungere una pagina o aggiornare le informazioni, ci scrivi e ne parliamo.' },
    ],
    riga: "Tu ci metti poco: una chiamata, le tue foto, un'occhiata all'anteprima.",
  },
  domande: {
    h2: 'Le domande che ci fanno prima di iniziare.',
    voci: [
      { d: 'Ho già la pagina Facebook o Instagram. Mi serve un sito?', r: 'Sui social sei in casa d\'altri: regole, orari e modi di vedere i contenuti li decidono le piattaforme. Il sito è tuo, lo trova chi ti cerca su Google e riunisce in un posto orari, mappa, servizi e contatti. I social restano utili per farti conoscere.' },
      { d: 'Il sito comparirà primo su Google?', r: 'Nessuno può garantirlo, e chi lo promette ti dice una bugia. Lo prepariamo bene (titoli, testi, velocità sul telefono) e lo segnaliamo a Google. Un sito nuovo ha bisogno di tempo per essere trovato.' },
      { d: 'Mi servono foto professionali?', r: 'Non per forza. Con foto fatte bene dal telefono si parte, e ti diciamo cosa fotografare. Dove mancano, ne parliamo prima della proposta.' },
      { d: 'Chi lo aggiorna dopo?', r: 'Ci scrivi cosa cambiare e ne parliamo. Come funzionano le modifiche successive lo trovi nella proposta, prima di iniziare.' },
      { d: 'Ho già un dominio e un\'email: li perdo?', r: 'No. Il dominio si collega al nuovo sito e le email continuano a funzionare. Prima di toccare qualcosa ti spieghiamo cosa succede.' },
      { d: 'Quanto costa e quanto ci vuole?', r: 'Dipende da quante pagine servono e da quanto materiale hai già. Costi e tempi li trovi nella proposta scritta, dopo la prima chiamata.' },
    ],
  },
  invito: { frasi: [['Il tuo sito comincia'], ['da una chiamata.', 'chiamata']] },
  coda: { riga: "Raccontaci cosa fai e chi vuoi far arrivare. Ti diciamo se ti serve un sito, un negozio online o un'app, e cosa fare per primo. Seguiamo poche attività alla volta: la prossima può essere la tua." },
}
