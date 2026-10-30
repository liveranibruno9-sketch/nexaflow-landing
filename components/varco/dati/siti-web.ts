// /siti-web · Janus. Testi da pagine/copy-siti-web.md, accorciati dove lo spazio non bastava (§16 della spec delle pagine); ogni cambio è
// in pagine/registro-costruzione.md. Mai «intelligenza artificiale». Nessun prezzo (R4), nessun «Lavori» (R7). Modulo puro.
import { percorsoServizio } from './pagine.ts'
import type { DatiPagina } from './pagine.ts'

const F = (nome: string) => `/film/pagine/siti-web/${nome}.webp`

export const SITI_WEB: DatiPagina = {
  id: 'siti-web',
  mascotte: 'janus',
  materia: 'vetro',
  seo: {
    titolo: 'Realizzazione siti web a Faenza e Romagna | Agenti Studio',
    descrizione: 'Siti web e app pensati prima per il telefono, fatti per farti trovare su Google, con richieste e prenotazioni in ordine. Per attività di Faenza e Romagna.',
  },
  h1: 'Un sito dove chi arriva capisce subito cosa fai, e ti scrive o prenota.',
  poster: { src720: '/film/scene/janus-2-720.webp', src1080: '/film/scene/janus-2-1080.webp', alt: 'Janus, la mascotte di vetro dei siti web' },
  percorso: percorsoServizio({
    id: 'siti-web',
    indice: '02 · Siti web',
    materia: 'vetro',
    servizio: 'Sviluppo siti web e app',
    h1: 'Un sito dove chi arriva capisce subito cosa fai, e ti scrive o prenota.',
    sotto: 'Siti web e app pensati prima per il telefono e per farti trovare su Google. Richieste e prenotazioni ti arrivano già in ordine. Il sito è tuo.',
    nota: 'Senza impegno. Ti risponde Bruno entro un giorno lavorativo.',
    cartoline: [
      { nome: 'siti-1', alt: 'Un sito aperto sul portatile' },
      { nome: 'siti-2', alt: "Un'app sul telefono, fra le mani" },
    ],
    problema: {
      h2: 'Chi arriva sul tuo sito decide in pochi secondi.',
      righe: [
        ['Una persona ti cerca su Google e apre il sito dal telefono. Se il testo è minuscolo o il menu non si apre, torna indietro.', 'torna indietro'],
        ["Se un sito non ce l'hai, ti trovano solo dove ha deciso qualcun altro: nei social, negli elenchi.", 'qualcun altro'],
        ['Un sito fatto bene lavora anche quando sei in laboratorio, in cucina, in cantiere.', 'lavora'],
      ],
    },
    capacita: {
      h2: 'Un sito che lavora per te.',
      blocchi: [
        { titolo: ['Pensato prima per il telefono', 'telefono'], riga: 'Chi ti cerca lo fa spesso di fretta, col telefono in mano. Il sito parte da lì e poi si allarga sul computer.', gesto: { nome: 'modella' } },
        { titolo: ['Si fa trovare su Google', 'Google'], riga: 'Titoli e testi con le parole che i clienti cercano davvero, con Faenza e la Romagna al posto giusto.', gesto: { nome: 'presenta', lato: 'destro' } },
        { titolo: ['Chi arriva capisce', 'capisce'], riga: 'In pochi secondi si capisce cosa fai, dove sei e come contattarti. Un tocco per chiamare, scrivere su WhatsApp o aprire la mappa.', gesto: { nome: 'modella' } },
        { titolo: ['Richieste in ordine', 'ordine'], riga: 'Chi compila il modulo o prenota ti arriva già riassunto, per email o sul telefono. Niente messaggi persi.', gesto: { nome: 'presenta', lato: 'sinistro' } },
        { titolo: ['In italiano e, se serve, in inglese', 'inglese'], riga: 'Per chi ha ospiti stranieri: agriturismi, B&B, ristoranti, aziende che vendono fuori.', gesto: { nome: 'modella' } },
        { titolo: ['È tuo', 'tuo'], riga: 'Sito, dominio e account intestati a te. Se un giorno vuoi cambiare chi lo cura, te lo porti via.', gesto: { nome: 'presenta', lato: 'destro' } },
      ],
      beneficio: [['Chi arriva capisce.', 'capisce'], ['Chi capisce prenota.', 'prenota']],
      gestoBeneficio: { nome: 'presenta', lato: 'destro' },
    },
  }),
  extra: {
    dopo: 'film',
    h2: "Dal sito all'app, solo se serve.",
    testo: "Alcune attività hanno bisogno di più di una vetrina: un'area per prenotare, un catalogo con gli ordini, un negozio online, un'app per i clienti. Ne parliamo nella prima chiamata e ti diciamo con sincerità se serve o se basta un sito fatto bene.",
  },
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
