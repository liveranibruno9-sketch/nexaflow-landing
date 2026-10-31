// Le pagine dedicate alle voci dei quattro servizi («Come funziona» di ogni elenco). Modello unico (v1, 31/10): cosa è, per chi è, come funziona in
// tre passi, esempi veri (solo se ce n'è almeno uno, R7), domande, modulo con la voce già scritta. Titoli, scene e righe vengono dagli elenchi delle
// pagine (siti-web.ts, contenuti.ts, ...): qui solo il resto. Nessun prezzo (R4), nessun risultato promesso, mai «intelligenza artificiale»
// (si dice «assistente virtuale»), settore sanitario solo informativo. Modulo puro.
import { VOCI_AUTOMAZIONI } from './automazioni.ts'
import { TIPI_SITO_TUTTI } from './siti-web.ts'
import { TIPI_CONTENUTO_TUTTI } from './contenuti.ts'
import { TIPI_CAMPAGNA_TUTTI } from './campagne.ts'

export type ServizioDedicato = 'automazioni' | 'siti-web' | 'contenuti' | 'campagne'
export type Mestiere = 'bnb' | 'ristorante' | 'negozio' | 'artigiano' | 'studio' | 'eventi'
export const NOMI_MESTIERE: Record<Mestiere, string> = {
  bnb: 'B&B e agriturismo', ristorante: 'Ristorante e bar', negozio: 'Negozio', artigiano: 'Artigiano e impresa', studio: 'Studi e professionisti', eventi: 'Associazioni ed eventi',
}
/** un esempio nella bacheca di una pagina dedicata: un modello dimostrativo con un'attività di fantasia (mai il lavoro di un cliente vero).
 *  href = la demo online; immagine = lo screenshot; video = lo schermo registrato (30-45 s, verticale e/o orizzontale), facoltativo; `fantasia` = il nome dell'attività inventata */
export type Esempio = { nome: string; fantasia: string; testo: string; href: string; immagine: string; alt: string; video?: { mp4: string; mp4Orizzontale?: string } }
export type ContenutoDedicato = { cosa: string; perChi: Mestiere[]; passi: [string, string, string]; faq: { d: string; r: string }[]; esempi?: Esempio[] }
export type VoceDedicata = ContenutoDedicato & { servizio: ServizioDedicato; slug: string; titolo: string; riga: string; vignetta: string }

export const SERVIZI_DEDICATI: Record<ServizioDedicato, { nome: string; indice: [string, string]; indietro: { testo: string; href: string }; tappe: [string, string, string]; richiesta: string }> = {
  automazioni: { nome: 'Automazioni', indice: ['01', 'Automazioni'], indietro: { testo: 'Tutte le automazioni', href: '/automazioni' }, tappe: ['Chiamata', 'Proposta', 'Avvio'], richiesta: 'automazione' },
  'siti-web': { nome: 'Siti web', indice: ['02', 'Siti web'], indietro: { testo: 'Tutti i tipi di sito', href: '/siti-web' }, tappe: ['Chiamata', 'Proposta', 'Online'], richiesta: 'sito' },
  contenuti: { nome: 'Contenuti', indice: ['03', 'Contenuti'], indietro: { testo: 'Tutto quello che creiamo', href: '/contenuti' }, tappe: ['Chiamata', 'Proposta', 'Primi contenuti'], richiesta: 'contenuto' },
  campagne: { nome: 'Campagne', indice: ['04', 'Campagne'], indietro: { testo: 'Tutte le campagne', href: '/campagne' }, tappe: ['Chiamata', 'Proposta', 'Partenza'], richiesta: 'campagna' },
}

const CHIAMATA_SU_MISURA: ContenutoDedicato = {
  cosa: "Se quello che ti serve non è nell'elenco, lo progettiamo insieme: ci racconti la tua attività e cosa vorresti che succedesse, e ti diciamo con sincerità cosa si può fare, cosa no e da dove partire.",
  perChi: ['bnb', 'ristorante', 'negozio', 'artigiano', 'studio', 'eventi'],
  passi: ['Ci racconti la tua attività e cosa vorresti ottenere, senza giri di parole.', 'Ricevi una proposta scritta con cosa facciamo, in quanto tempo e quanto costa.', 'Si parte dal primo pezzo utile, non da tutto insieme, e si aggiunge il resto quando serve.'],
  faq: [{ d: 'E se non so cosa chiedere?', r: 'Nessun problema: basta raccontarci cosa ti fa perdere tempo o clienti. La richiesta la formuliamo noi, insieme a te, nella prima chiamata.' }, { d: 'Quanto costa?', r: 'Dipende da cosa serve. Dopo la chiamata ricevi un preventivo scritto, con i costi chiari e senza sorprese.' }],
}


/** il resto delle pagine, per «servizio/slug» */
const CONTENUTO: Record<string, ContenutoDedicato> = {
  /* ---------- Automazioni ---------- */
  'automazioni/assistente-messaggi': {
    cosa: 'Un assistente virtuale risponde ai messaggi che ricevi su WhatsApp, Instagram ed email, a qualsiasi ora e con le tue parole. Raccoglie nome, richiesta e date, e ti lascia tutto in ordine: tu rispondi solo dove serve una persona.',
    perChi: ['bnb', 'ristorante', 'negozio', 'artigiano'],
    passi: ['Ci racconti quali messaggi ricevi più spesso e su quali canali.', 'Scriviamo insieme le risposte e le regole: cosa dice, cosa non dice, quando passa a te.', 'Prove con messaggi finti, poi si parte. Nei primi giorni controlliamo le conversazioni.'],
    faq: [{ d: 'I clienti capiscono che non è una persona?', r: "Sì: l'assistente si presenta sempre come assistente virtuale. Chi preferisce una persona può chiederla, e il messaggio passa a te." }, { d: 'E se sbaglia una risposta?', r: 'Le risposte le scriviamo insieme e le proviamo prima. Sulle cose delicate non improvvisa: ti avvisa.' }],
  },
  'automazioni/segreteria-telefonica': {
    cosa: 'Una segreteria virtuale risponde alle chiamate che non riesci a prendere, chiede cosa serve e ti manda subito un riassunto di ognuna: chi ha chiamato, per cosa e quanto è urgente.',
    perChi: ['artigiano', 'studio', 'ristorante', 'bnb'],
    passi: ['Ci racconti quando non riesci a rispondere e cosa vorresti sapere di ogni chiamata.', 'Definiamo cosa chiede la segreteria e come ti arriva il riassunto, per iscritto.', 'Prove con chiamate finte, poi si accende. Nelle prime settimane ascoltiamo insieme le chiamate.'],
    faq: [{ d: 'Devo cambiare numero di telefono?', r: 'Di norma no: le chiamate a cui non rispondi vengono inoltrate alla segreteria. Come si imposta lo vediamo nella prima chiamata.' }, { d: 'Chi chiama sa che non è una persona?', r: 'Sì, glielo dice la segreteria stessa. Se vuole parlare con una persona, lo può chiedere.' }],
  },
  'automazioni/ricontatto-preventivi': {
    cosa: 'Chi ha chiesto un prezzo e poi è sparito riceve un messaggio gentile, nel momento giusto. Tu non devi ricordarti chi richiamare: lo fa il sistema, e ti avvisa quando qualcuno risponde.',
    perChi: ['artigiano', 'studio', 'negozio', 'bnb'],
    passi: ['Ci racconti come arrivano oggi le richieste di preventivo e dove si perdono.', 'Scriviamo con te il messaggio, il momento in cui parte e quante volte, senza insistere.', 'Prova con richieste finte, poi si parte. Chi non vuole altri messaggi non ne riceve più.'],
    faq: [{ d: 'Rischio di sembrare insistente?', r: 'No: i messaggi sono pochi, gentili e con le tue parole. Quando e quanti lo decidi tu, e chi dice di no non ne riceve più.' }, { d: 'Funziona con il mio gestionale?', r: 'Partiamo da ciò che usi già. Se serve collegare qualcosa in più, te lo diciamo prima della proposta.' }],
  },
  'automazioni/onboarding-cliente': {
    cosa: 'Quando un cliente dice sì, partono da soli contratto, moduli, richiesta di accessi e messaggio di benvenuto. Il cliente si sente accolto, tu non rincorri documenti e sai sempre a che punto è.',
    perChi: ['studio', 'artigiano', 'eventi'],
    passi: ['Ci racconti cosa fai oggi per accogliere un nuovo cliente, passo per passo.', 'Disegniamo il percorso per iscritto: cosa parte, quando e chi lo controlla.', 'Prove con un cliente finto, poi si parte. Vedi a colpo d\'occhio chi ha finito e chi no.'],
    faq: [{ d: 'Cambia il modo in cui ricevo i documenti?', r: 'Cambia solo che non li rincorri: il cliente li carica o li invia, e tu vedi cosa manca. Dove tieni i documenti oggi lo decidiamo insieme.' }, { d: 'Posso rivedere i testi?', r: 'Sì: i messaggi e i moduli li scriviamo con te e li approvi prima che parta qualsiasi cosa.' }],
  },
  'automazioni/fatture-solleciti': {
    cosa: 'La fattura parte da sola quando il lavoro è chiuso, e chi tarda a pagare riceve un promemoria gentile, finché l\'incasso non arriva. Tu non devi più ricordarti chi sollecitare.',
    perChi: ['studio', 'artigiano', 'eventi'],
    passi: ['Ci racconti come fatturi oggi e a chi ricordi i pagamenti.', 'Per iscritto: quando parte la fattura, quando e come parte il promemoria, quando ti avvisa.', 'Prova con fatture finte, poi si parte. I solleciti restano gentili e fermabili da te.'],
    faq: [{ d: 'Sostituisce il mio commercialista?', r: 'No: usa gli strumenti che hai già. Il sistema invia e ricorda, la parte fiscale resta com\'è.' }, { d: 'Posso fermare un sollecito?', r: 'Sì, in qualsiasi momento: per un cliente, per una fattura o per tutti.' }],
  },
  'automazioni/programmi-collegati': {
    cosa: 'Ordini, magazzino e gestionale si parlano tra loro: un dato inserito una volta compare dove serve, senza ricopiarlo a mano e senza errori di trascrizione. Meno tempo perso, meno cose da controllare.',
    perChi: ['negozio', 'artigiano', 'studio'],
    passi: ['Ci racconti quali programmi usi e dove ricopi gli stessi dati più volte.', 'Per iscritto: cosa si collega a cosa, cosa succede se un dato manca e chi viene avvisato.', 'Prove con dati finti, poi si accende un collegamento alla volta.'],
    faq: [{ d: 'Devo cambiare programmi?', r: "In genere no: i programmi che usi restano quelli. Se uno non si può collegare, te lo diciamo prima della proposta e proponiamo un'alternativa." }, { d: 'Che succede se un collegamento si ferma?', r: 'Ti arriva un avviso e si riprende da dove si era interrotto. Nessun dato si perde.' }],
  },
  /* ---------- Siti web ---------- */
  'siti-web/landing-page': {
    cosa: 'Una pagina sola, con un obiettivo solo: far chiamare, scrivere o prenotare. Pensata prima per il telefono, veloce, con un pulsante bene in vista e niente che distragga. È il modo più leggero per avere un sito di qualità.',
    perChi: ['eventi', 'ristorante', 'artigiano', 'studio'],
    passi: ['Ci racconti cosa vuoi che succeda quando qualcuno apre la pagina.', 'Ricevi la proposta scritta: la struttura, i testi e i tempi.', 'Vedi l\'anteprima dal telefono, correggiamo, poi si va online sul tuo dominio.'],
    faq: [{ d: 'Una pagina sola basta?', r: "Per un obiettivo preciso sì: un evento, una promozione, un servizio. Se serve di più, la pagina cresce e diventa un sito vetrina." }, { d: 'È mia?', r: 'Sì: sito, dominio e account intestati a te. Se un giorno vuoi cambiare chi lo cura, te lo porti via.' }],
  },
  'siti-web/sito-vetrina': {
    cosa: 'Poche pagine curate che dicono chi sei, cosa fai, dove sei e come contattarti. Veloce da telefono, facile da trovare su Google, con i tuoi testi e le tue foto: la tua attività, presentata come merita.',
    perChi: ['negozio', 'artigiano', 'studio', 'ristorante'],
    passi: ['Ci racconti la tua attività e a chi ti rivolgi.', 'Raccogliamo foto e testi, ricevi la proposta scritta con pagine, tempi e costi.', 'Anteprima dal telefono, correzioni, poi online. Ti spieghiamo come funziona tutto.'],
    faq: [{ d: 'Mi servono foto professionali?', r: 'Non per forza: con foto fatte bene dal telefono si parte. Ti diciamo cosa fotografare, e dove mancano ne parliamo prima della proposta.' }, { d: 'Comparirò primo su Google?', r: "Nessuno può garantirlo. Lo prepariamo bene (titoli, testi, velocità sul telefono) e lo segnaliamo a Google: un sito nuovo ha bisogno di tempo." }],
  },
  'siti-web/strutture-ricettive': {
    cosa: 'Foto che fanno venire voglia di dormire da te, camere e servizi chiari, richiesta di disponibilità con un tocco. Gli ospiti stranieri trovano tutto in inglese e ti scrivono già con le date.',
    perChi: ['bnb', 'eventi'],
    passi: ['Ci racconti la struttura, le camere e a quali ospiti vuoi arrivare.', 'Ricevi la proposta con pagine, lingue, richiesta di disponibilità e tempi.', 'Anteprima dal telefono, correzioni, poi online. Le richieste ti arrivano già in ordine.'],
    faq: [{ d: 'Si collega al mio sistema di prenotazioni?', r: 'Dipende da quale usi. Nella prima chiamata ti diciamo cosa si può collegare e cosa no, prima della proposta.' }, { d: 'Il sito sarà anche in inglese?', r: "Sì, se hai ospiti stranieri: le due lingue si scrivono insieme e si tengono aggiornate insieme." }],
  },
  'siti-web/agenzie-e-studi': {
    cosa: 'Servizi spiegati con chiarezza, moduli di richiesta e le richieste raccolte in ordine. Un sito sobrio e ben strutturato che fa capire subito cosa fai e a chi ti rivolgi, e che ispira fiducia.',
    perChi: ['studio', 'artigiano', 'eventi'],
    passi: ['Ci racconti i servizi, a chi sono rivolti e come vuoi essere contattato.', 'Ricevi la proposta con la struttura delle pagine, i moduli e i tempi.', 'Anteprima dal telefono, correzioni, poi online. Le richieste arrivano per email o sul telefono.'],
    faq: [{ d: 'Posso avere un modulo per le richieste?', r: "Sì: chi compila il modulo ti arriva già riassunto, per email o sul telefono. Niente messaggi persi." }, { d: 'Per uno studio sanitario cambia qualcosa?', r: 'Sì, ci sono regole sui contenuti: solo informazioni, niente promesse di risultato né testimonianze. Le seguiamo noi.' }],
  },
  'siti-web/e-commerce-store': {
    cosa: 'Un catalogo curato, schede che fanno scegliere, carrello e pagamento sicuri. Un negozio online costruito attorno ai tuoi prodotti, pensato per il telefono e facile da aggiornare.',
    perChi: ['negozio', 'artigiano', 'eventi'],
    passi: ['Ci racconti cosa vendi, come spedisci e a chi.', 'Ricevi la proposta con catalogo, pagamenti, spedizioni e tempi, per iscritto.', 'Caricamento dei prodotti, prove di acquisto con ordini finti, poi si apre.'],
    faq: [{ d: 'Chi carica i prodotti?', r: 'Partiamo insieme dai primi: poi ti spieghiamo come aggiungerne altri da solo, o li carichiamo noi se preferisci.' }, { d: 'Come ricevo i pagamenti?', r: 'Direttamente sul tuo conto, attraverso un servizio di pagamento sicuro. Nella proposta ti diciamo quale e con quali condizioni.' }],
  },
  'siti-web/sito-3d-immersivo': {
    cosa: 'Un sito con scene in movimento e profondità, che si ricorda: per chi vuole distinguersi dai concorrenti e raccontare la propria attività con un impatto diverso. Resta veloce, leggibile e pensato per il telefono.',
    perChi: ['bnb', 'ristorante', 'eventi', 'negozio'],
    passi: ['Ci racconti cosa vuoi far provare a chi arriva e cosa lo deve spingere ad agire.', 'Ricevi un concept con l\'idea, le scene principali, i tempi e i costi, per iscritto.', 'Prima anteprima da provare dal telefono, correzioni, poi online. Resta sempre una versione semplice per chi preferisce.'],
    faq: [{ d: 'Pesa e rallenta il sito?', r: "Lo costruiamo perché sia veloce: le scene si caricano a poco a poco e su un telefono meno potente si semplificano. Chi preferisce la versione semplice la trova." }, { d: 'Serve per forza?', r: 'No: per molte attività un sito vetrina curato basta. Il sito 3D ha senso quando vuoi distinguerti davvero, e te lo diciamo con sincerità.' }],
  },
  'siti-web/app-e-portali': {
    cosa: 'Aree riservate, gestionali leggeri e app per clienti e collaboratori, costruiti sul tuo modo di lavorare: dati in un posto solo, accessi con password, aggiornamenti sul telefono. Per quando il sito non basta.',
    perChi: ['studio', 'artigiano', 'eventi', 'negozio'],
    passi: ['Ci racconti il processo che vorresti portare online e chi lo usa.', 'Ricevi una proposta scritta: cosa fa, per chi, in quali tempi e a che costo.', 'Si parte da una prima versione utile, la provi con persone vere, poi si aggiunge il resto.'],
    faq: [{ d: 'Sarà mia?', r: 'Sì: codice, dati e account intestati a te. Se un giorno vuoi cambiare chi lo cura, te lo porti via.' }, { d: 'E la sicurezza dei dati?', r: 'Gli accessi sono protetti e i dati stanno in servizi affidabili, con le chiavi gestite a parte. Ti spieghiamo cosa conserva e dove.' }],
  },
  /* ---------- Contenuti ---------- */
  'contenuti/post-e-grafiche': {
    cosa: 'Singoli post e grafiche per i tuoi social, quando ti servono: una novità, un evento, una promozione. Con la tua immagine, i tuoi colori e il tuo modo di parlare, pronti da approvare con un tocco.',
    perChi: ['ristorante', 'negozio', 'eventi', 'bnb'],
    passi: ['Ci racconti cosa devi comunicare e a chi.', 'Ricevi la proposta scritta: quanti post, in che tempi, a quali condizioni.', 'Ti arrivano sul telefono, li approvi o chiedi modifiche, poi vanno online.'],
    faq: [{ d: 'Pubblicate voi?', r: 'Sì, dopo il tuo ok: nei giorni e agli orari concordati. Ogni contenuto lo vedi prima di andare online.' }, { d: 'Usate le mie foto?', r: 'Sì: usiamo il materiale vero della tua attività, e lo diciamo se un\'immagine è creata al computer.' }],
  },
  'contenuti/caroselli': {
    cosa: 'Più pagine da scorrere per raccontare una storia: un lavoro, un prodotto, una stagione. Si leggono bene dal telefono e restano in mente più di un post singolo.',
    perChi: ['bnb', 'artigiano', 'negozio', 'studio'],
    passi: ['Ci racconti la storia da raccontare e il materiale che hai.', 'Ricevi la proposta scritta: numero di caroselli, tempi e condizioni.', 'Ti arrivano sul telefono, li approvi pagina per pagina, poi vanno online.'],
    faq: [{ d: 'Quante pagine ha un carosello?', r: 'Di solito da tre a otto: abbastanza per raccontare, senza stancare. Lo decidiamo secondo la storia.' }, { d: 'Posso cambiare i testi?', r: 'Sì: i testi li scriviamo con la tua voce e li approvi prima della pubblicazione.' }],
  },
  'contenuti/video-brevi': {
    cosa: 'Quindici secondi dal tuo materiale: il passaggio al banco, il piatto, il dietro le quinte. Montati con cura e con i sottotitoli, pronti per i social senza che tu debba apparire se non vuoi.',
    perChi: ['ristorante', 'artigiano', 'eventi', 'negozio'],
    passi: ['Ci mandi i video e le foto che hai: ti diciamo cosa riprendere col telefono, in modo semplice.', 'Ricevi la proposta scritta: quanti video, tempi e condizioni.', 'Ti arrivano sul telefono, li approvi, poi vanno online.'],
    faq: [{ d: 'Devo comparire io?', r: 'No, se non vuoi: si possono raccontare le mani, il prodotto, il locale, il lavoro.' }, { d: 'Cosa serve per girarli?', r: 'Basta il telefono. Ti diciamo come inquadrare e cosa riprendere, e al resto pensiamo noi.' }],
  },
  'contenuti/piano-editoriale': {
    cosa: 'Cosa pubblicare, quando e dove, con i contenuti pronti ogni settimana da approvare col telefono. Non ti chiedi più «cosa posto oggi?»: il piano c\'è, e il profilo non resta fermo.',
    perChi: ['ristorante', 'bnb', 'negozio', 'studio'],
    passi: ['Ci racconti cosa fai, a chi parli e cosa non vuoi mostrare.', 'Ricevi il piano e la proposta, per iscritto: temi, formati, frequenza e condizioni.', 'Ogni settimana ricevi i contenuti sul telefono e li approvi. Ogni mese guardiamo cosa ha funzionato.'],
    faq: [{ d: 'Su quali social lavorate?', r: 'Partiamo da quelli dove ci sono i tuoi clienti: Instagram e Facebook per la maggior parte delle attività, LinkedIn per studi e imprese. Lo decidiamo nella prima chiamata.' }, { d: 'Posso fermare tutto?', r: 'Sì, quando vuoi: non ci sono vincoli lunghi. Te lo scriviamo nella proposta.' }],
  },
  'contenuti/gestione-social': {
    cosa: 'Piano, contenuti, pubblicazione e un resoconto ogni mese: tu approvi, al resto pensiamo noi. È il modo più completo per avere profili sempre vivi senza dedicarci il tuo tempo.',
    perChi: ['ristorante', 'bnb', 'negozio', 'eventi'],
    passi: ['Ci racconti la tua attività, i tuoi profili di oggi e cosa vorresti ottenere.', 'Ricevi la proposta con piano, frequenza, resoconto e condizioni, per iscritto.', 'Partiamo: contenuti ogni settimana, pubblicazione dopo il tuo sì, resoconto ogni mese.'],
    faq: [{ d: 'Chi ha accesso ai miei profili?', r: 'I profili restano tuoi: ti chiediamo gli accessi necessari per pubblicare, e li revochi quando vuoi.' }, { d: 'Rispondete ai commenti e ai messaggi?', r: 'Ai messaggi può pensarci un assistente virtuale (lo trovi nella pagina Automazioni). Per i commenti ne parliamo nella prima chiamata.' }],
  },
  'contenuti/su-misura': { ...CHIAMATA_SU_MISURA },
  /* ---------- Campagne ---------- */
  'campagne/lancio-e-promozioni': {
    cosa: "Un evento, un'apertura, una promozione: un annuncio a tempo che raggiunge le persone giuste attorno a te, con un obiettivo chiaro e un budget deciso prima. Alla fine sai cosa è successo.",
    perChi: ['eventi', 'ristorante', 'negozio', 'bnb'],
    passi: ['Ci racconti cosa vuoi promuovere, dove e per quanto tempo.', 'Ricevi il piano scritto: zona, durata, budget degli annunci e il nostro lavoro, in due voci distinte.', 'Prepariamo testi e immagini, li approvi, parte la campagna. Alla fine ricevi il resoconto.'],
    faq: [{ d: 'Quanto devo spendere?', r: 'Dipende dall\'obiettivo e dalla zona. Lo decidi tu nella proposta, e lo paghi direttamente alla piattaforma, dal tuo account.' }, { d: 'Mi garantite un numero di clienti?', r: 'No, e nessuno onesto può farlo. Ti garantiamo di misurare tutto e di dirti cosa è successo.' }],
  },
  'campagne/instagram-e-facebook': {
    cosa: 'Annunci nel feed di chi abita in zona o ha gli interessi giusti, con le tue foto e le tue parole. Anche con un budget piccolo puoi farti vedere: quanto, lo decidi tu.',
    perChi: ['ristorante', 'negozio', 'bnb', 'eventi'],
    passi: ['Ci racconti chi vuoi raggiungere e cosa vuoi che facciano: scriverti, chiamarti, passare.', 'Ricevi il piano scritto: zona, pubblico, formati, budget degli annunci e nostro lavoro in due voci.', 'Annunci approvati da te, campagna accesa, controllo ogni settimana e resoconto.'],
    faq: [{ d: 'Gli account chi li intesta?', r: 'Tu: gli account pubblicitari sono intestati a te. Se non li hai, li apriamo insieme.' }, { d: 'Quando vedo i primi dati?', r: 'In pochi giorni. Per capire cosa funziona servono alcune settimane: te lo spieghiamo con le tue cifre.' }],
  },
  'campagne/google': {
    cosa: 'Compari tra i primi risultati nel momento in cui qualcuno cerca quello che fai: «elettricista a Faenza», «dove dormire in Romagna». Chi ti cerca è già interessato, e paghi solo quando clicca.',
    perChi: ['artigiano', 'studio', 'bnb', 'ristorante'],
    passi: ['Ci racconti cosa fai, dove lavori e quali ricerche vorresti intercettare.', 'Ricevi il piano scritto: parole cercate, zona, budget e nostro lavoro, in due voci.', 'Annunci approvati da te, campagna accesa, controllo ogni settimana e resoconto.'],
    faq: [{ d: 'Pago ogni volta che qualcuno vede l\'annuncio?', r: 'No: di norma si paga quando qualcuno clicca. Il costo massimo lo fissi tu, e ti spieghiamo come funziona prima di iniziare.' }, { d: 'Per uno studio sanitario?', r: 'Annunci solo informativi sul servizio, senza domande sulla persona, senza promesse di risultato e senza sconti come leva.' }],
  },
  'campagne/contatti': {
    cosa: 'L\'obiettivo sono le richieste: messaggi, telefonate e moduli, contati uno per uno. Ogni campagna porta chi la vede in un posto dove può agire, e tu sai quanto ti costa ogni contatto.',
    perChi: ['artigiano', 'studio', 'bnb', 'negozio'],
    passi: ['Ci racconti cosa consideri un contatto buono: una telefonata, un messaggio, un modulo.', 'Ricevi il piano scritto: dove porta la campagna, come contiamo i contatti, budget e nostro lavoro.', 'Campagna accesa, contatti contati uno per uno, correzioni ogni settimana, resoconto.'],
    faq: [{ d: 'Mi serve un sito?', r: 'Aiuta molto: la pubblicità porta le persone in un posto dove possono agire, come un sito, WhatsApp o un modulo. Se non ce l\'hai, ne parliamo.' }, { d: 'Come si legge il resoconto?', r: 'Senza parole difficili: quanta gente ha visto l\'annuncio, quanti hanno scritto o chiamato, quanto ti è costato ognuno.' }],
  },
  'campagne/chi-ti-ha-visitato': {
    cosa: 'Chi ha guardato il tuo sito e non ha scritto vede un promemoria gentile, e torna. Si raggiungono persone che ti conoscono già, con un budget piccolo.',
    perChi: ['bnb', 'negozio', 'eventi', 'ristorante'],
    passi: ['Ci racconti cosa succede oggi a chi visita il sito e non scrive.', 'Ricevi il piano scritto: chi raggiungiamo, per quanto tempo, budget e nostro lavoro.', 'Prepariamo l\'annuncio, lo approvi, parte. Nel resoconto vedi quanti sono tornati.'],
    faq: [{ d: 'E la privacy di chi visita il sito?', r: 'Si usa solo chi ha accettato i cookie di marketing, con l\'informativa a posto. Ti spieghiamo cosa serve sul sito prima di iniziare.' }, { d: 'Serve molto traffico?', r: 'Serve un minimo di visite al sito: se sono poche, te lo diciamo e proponiamo prima altro.' }],
  },
  'campagne/gestione-e-resoconto': {
    cosa: 'Ogni settimana si corregge il tiro: cosa funziona resta, cosa non rende si spegne. Ogni mese ricevi un resoconto semplice con il costo di ogni contatto, senza parole difficili.',
    perChi: ['ristorante', 'bnb', 'negozio', 'artigiano'],
    passi: ['Ci racconti cosa stai facendo oggi, se già fai pubblicità, e con quali risultati.', 'Ricevi la proposta scritta: cosa controlliamo, quanto spesso e come ti arriva il resoconto.', 'Ogni settimana controlliamo, spostiamo il budget dove funziona, e ogni mese ti scriviamo il resoconto.'],
    faq: [{ d: 'Chi paga le piattaforme?', r: 'Tu, direttamente, dal tuo account. Il nostro lavoro e il budget pubblicitario sono due voci separate, scritte nella proposta.' }, { d: 'Posso fermarmi quando voglio?', r: 'Sì: il budget lo ferma chi ha il controllo dell\'account, cioè tu. Te lo scriviamo nella proposta.' }],
  },
  'campagne/su-misura': { ...CHIAMATA_SU_MISURA },
}

const liste: [ServizioDedicato, { slug: string; titolo: [string, string?]; vignetta: string; riga: string }[]][] = [
  ['automazioni', VOCI_AUTOMAZIONI], ['siti-web', TIPI_SITO_TUTTI], ['contenuti', TIPI_CONTENUTO_TUTTI], ['campagne', TIPI_CAMPAGNA_TUTTI],
]

/** tutte le pagine dedicate, nell'ordine degli elenchi; la voce «Su misura» di Automazioni e Siti non ha pagina (il suo link porta al modulo) */
export const PAGINE_DEDICATE: VoceDedicata[] = liste.flatMap(([servizio, voci]) =>
  voci.flatMap((v) => {
    const c = CONTENUTO[`${servizio}/${v.slug}`]
    return c ? [{ ...c, servizio, slug: v.slug, titolo: v.titolo[0], riga: v.riga, vignetta: v.vignetta }] : []
  }))

export const trovaDedicata = (servizio: string, slug: string) => PAGINE_DEDICATE.find((p) => p.servizio === servizio && p.slug === slug)
