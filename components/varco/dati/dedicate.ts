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
  cosa: "Se quello che ti serve non è nell'elenco, lo progettiamo insieme. Ti diciamo cosa si può fare, cosa no e da dove partire.",
  perChi: ['bnb', 'ristorante', 'negozio', 'artigiano', 'studio', 'eventi'],
  passi: ["Ci racconti la tua attività e cosa vorresti ottenere.", "Ricevi una proposta scritta: cosa facciamo, tempi e costi.", "Si parte dal primo pezzo utile, non da tutto insieme."],
  faq: [{ d: "E se non so cosa chiedere?", r: "Basta raccontarci cosa ti fa perdere tempo o clienti. La richiesta la formuliamo insieme, nella prima chiamata." }, { d: "Quanto costa?", r: "Dipende da cosa serve. Dopo la chiamata ricevi una proposta scritta, con i costi chiari." }],
}


/** il resto delle pagine, per «servizio/slug» */
const CONTENUTO: Record<string, ContenutoDedicato> = {
  /* ---------- Automazioni ---------- */
  'automazioni/assistente-messaggi': {
    cosa: "Un assistente virtuale risponde ai messaggi su WhatsApp, Instagram ed email, a ogni ora e con le tue parole. Tu rispondi solo dove serve una persona.",
    perChi: ['bnb', 'ristorante', 'negozio', 'artigiano'],
    passi: ["Ci racconti quali messaggi ricevi più spesso e dove.", "Scriviamo insieme le risposte e le regole: quando passa a te.", "Prove con messaggi finti, poi si parte."],
    faq: [{ d: "I clienti capiscono che non è una persona?", r: "Sì: si presenta sempre come assistente virtuale. Chi preferisce una persona può chiederla." }, { d: "E se sbaglia una risposta?", r: "Le risposte le scriviamo insieme e le proviamo prima. Sulle cose delicate ti avvisa." }],
  },
  'automazioni/segreteria-telefonica': {
    cosa: "Una segreteria virtuale risponde alle chiamate che non riesci a prendere e ti manda un riassunto di ognuna: chi ha chiamato, per cosa e con quale urgenza.",
    perChi: ['artigiano', 'studio', 'ristorante', 'bnb'],
    passi: ["Ci racconti quando non riesci a rispondere.", "Definiamo cosa chiede la segreteria e come ti arriva il riassunto.", "Prove con chiamate finte, poi si accende."],
    faq: [{ d: "Devo cambiare numero di telefono?", r: "Di norma no: le chiamate a cui non rispondi vengono inoltrate alla segreteria." }, { d: "Chi chiama sa che non è una persona?", r: "Sì, glielo dice la segreteria stessa. Chi vuole una persona può chiederla." }],
  },
  'automazioni/ricontatto-preventivi': {
    cosa: "Chi ha chiesto un prezzo e poi è sparito riceve un messaggio gentile, al momento giusto. Tu non devi ricordarti chi richiamare.",
    perChi: ['artigiano', 'studio', 'negozio', 'bnb'],
    passi: ["Ci racconti come arrivano oggi le richieste e dove si perdono.", "Scriviamo con te il messaggio e decidiamo quando parte.", "Prova con richieste finte, poi si parte."],
    faq: [{ d: "Rischio di sembrare insistente?", r: "No: i messaggi sono pochi e gentili. Quanti e quando lo decidi tu." }, { d: "Funziona con il mio gestionale?", r: "Partiamo da ciò che usi già. Se serve altro, te lo diciamo prima della proposta." }],
  },
  'automazioni/onboarding-cliente': {
    cosa: "Quando un cliente dice sì, contratto, moduli e messaggio di benvenuto partono da soli. Tu non rincorri documenti e sai sempre a che punto è.",
    perChi: ['studio', 'artigiano', 'eventi'],
    passi: ["Ci racconti cosa fai oggi per accogliere un nuovo cliente.", "Disegniamo il percorso per iscritto: cosa parte e quando.", "Prove con un cliente finto, poi si parte."],
    faq: [{ d: "Cambia il modo in cui ricevo i documenti?", r: "Cambia solo che non li rincorri: il cliente li invia e tu vedi cosa manca." }, { d: "Posso rivedere i testi?", r: "Sì: messaggi e moduli li scriviamo con te e li approvi prima." }],
  },
  'automazioni/fatture-solleciti': {
    cosa: "La fattura parte da sola quando il lavoro è chiuso. Chi tarda a pagare riceve un promemoria gentile, finché l'incasso non arriva.",
    perChi: ['studio', 'artigiano', 'eventi'],
    passi: ["Ci racconti come fatturi oggi e a chi ricordi i pagamenti.", "Per iscritto: quando parte la fattura e quando il promemoria.", "Prova con fatture finte, poi si parte."],
    faq: [{ d: "Sostituisce il mio commercialista?", r: "No: il sistema invia e ricorda. La parte fiscale resta com'è." }, { d: "Posso fermare un sollecito?", r: "Sì, in qualsiasi momento: per un cliente, per una fattura o per tutti." }],
  },
  'automazioni/programmi-collegati': {
    cosa: "Ordini, magazzino e gestionale si parlano tra loro: un dato inserito una volta compare dove serve, senza ricopiarlo a mano.",
    perChi: ['negozio', 'artigiano', 'studio'],
    passi: ["Ci racconti quali programmi usi e dove ricopi gli stessi dati.", "Per iscritto: cosa si collega a cosa e chi viene avvisato.", "Prove con dati finti, poi un collegamento alla volta."],
    faq: [{ d: "Devo cambiare programmi?", r: "In genere no. Se uno non si può collegare, te lo diciamo prima della proposta." }, { d: "Che succede se un collegamento si ferma?", r: "Ti arriva un avviso e si riprende da dove si era interrotto. Nessun dato si perde." }],
  },
  /* ---------- Siti web ---------- */
  'siti-web/landing-page': {
    cosa: "Una pagina sola, con un obiettivo solo: far chiamare, scrivere o prenotare. Veloce, pensata per il telefono, con un pulsante bene in vista.",
    perChi: ['eventi', 'ristorante', 'artigiano', 'studio'],
    passi: ["Ci racconti cosa deve succedere quando qualcuno apre la pagina.", "Ricevi la proposta scritta: struttura, testi e tempi.", "Vedi l'anteprima dal telefono, poi si va online."],
    faq: [{ d: "Una pagina sola basta?", r: "Per un obiettivo preciso sì: un evento, una promozione, un servizio. Se serve di più, cresce." }, { d: "È mia?", r: "Sì: sito, dominio e account sono intestati a te." }],
  },
  'siti-web/sito-vetrina': {
    cosa: "Poche pagine curate che dicono chi sei, cosa fai, dove sei e come contattarti. Veloce dal telefono e facile da trovare su Google.",
    perChi: ['negozio', 'artigiano', 'studio', 'ristorante'],
    passi: ["Ci racconti la tua attività e a chi ti rivolgi.", "Raccogliamo foto e testi e ricevi la proposta scritta.", "Anteprima dal telefono, correzioni, poi online."],
    faq: [{ d: "Mi servono foto professionali?", r: "Non per forza: con foto fatte bene dal telefono si parte. Ti diciamo cosa fotografare." }, { d: "Comparirò primo su Google?", r: "Nessuno può garantirlo. Lo prepariamo bene e lo segnaliamo a Google: serve tempo." }],
  },
  'siti-web/strutture-ricettive': {
    cosa: "Foto che fanno venire voglia di dormire da te, camere chiare, richiesta di disponibilità con un tocco. Gli ospiti stranieri trovano tutto in inglese.",
    perChi: ['bnb', 'eventi'],
    passi: ["Ci racconti la struttura e a quali ospiti vuoi arrivare.", "Ricevi la proposta con pagine, lingue e tempi.", "Anteprima dal telefono, correzioni, poi online."],
    faq: [{ d: "Si collega al mio sistema di prenotazioni?", r: "Dipende da quale usi. Te lo diciamo nella prima chiamata, prima della proposta." }, { d: "Il sito sarà anche in inglese?", r: "Sì, se hai ospiti stranieri. Le due lingue si aggiornano insieme." }],
  },
  'siti-web/agenzie-e-studi': {
    cosa: "Servizi spiegati con chiarezza e moduli di richiesta. Un sito sobrio, che fa capire subito cosa fai e ispira fiducia.",
    perChi: ['studio', 'artigiano', 'eventi'],
    passi: ["Ci racconti i servizi e come vuoi essere contattato.", "Ricevi la proposta con pagine, moduli e tempi.", "Anteprima dal telefono, correzioni, poi online."],
    faq: [{ d: "Posso avere un modulo per le richieste?", r: "Sì: ogni richiesta ti arriva già riassunta, per email o sul telefono." }, { d: "Per uno studio sanitario cambia qualcosa?", r: "Sì: solo informazioni, niente promesse di risultato né testimonianze. Le regole le seguiamo noi." }],
  },
  'siti-web/e-commerce-store': {
    cosa: "Un catalogo curato, schede che fanno scegliere, carrello e pagamento sicuri. Un negozio online pensato per il telefono e facile da aggiornare.",
    perChi: ['negozio', 'artigiano', 'eventi'],
    passi: ["Ci racconti cosa vendi, come spedisci e a chi.", "Ricevi la proposta con catalogo, pagamenti, spedizioni e tempi.", "Carichiamo i prodotti, proviamo con ordini finti, poi si apre."],
    faq: [{ d: "Chi carica i prodotti?", r: "I primi li carichiamo insieme. Poi continui da solo, o lo facciamo noi." }, { d: "Come ricevo i pagamenti?", r: "Sul tuo conto, con un servizio di pagamento sicuro. Quale, lo trovi nella proposta." }],
  },
  'siti-web/sito-3d-immersivo': {
    cosa: "Un sito con scene in movimento e profondità, che si ricorda. Per chi vuole distinguersi, e resta veloce e leggibile dal telefono.",
    perChi: ['bnb', 'ristorante', 'eventi', 'negozio'],
    passi: ["Ci racconti cosa vuoi far provare a chi arriva.", "Ricevi un concept scritto: idea, scene, tempi e costi.", "Provi la prima anteprima dal telefono, poi si va online."],
    faq: [{ d: "Pesa e rallenta il sito?", r: "No: le scene si caricano a poco a poco e sui telefoni meno potenti si semplificano." }, { d: "Serve per forza?", r: "No: per molte attività basta un sito vetrina curato. Te lo diciamo con sincerità." }],
  },
  'siti-web/app-e-portali': {
    cosa: "Aree riservate, gestionali leggeri e app per clienti e collaboratori, costruiti sul tuo modo di lavorare. Per quando il sito non basta.",
    perChi: ['studio', 'artigiano', 'eventi', 'negozio'],
    passi: ["Ci racconti il processo da portare online e chi lo usa.", "Ricevi una proposta scritta: cosa fa, per chi, tempi e costi.", "Si parte da una prima versione utile, poi si aggiunge il resto."],
    faq: [{ d: "Sarà mia?", r: "Sì: codice, dati e account sono intestati a te." }, { d: "E la sicurezza dei dati?", r: "Gli accessi sono protetti e i dati stanno in servizi affidabili. Ti spieghiamo cosa si conserva e dove." }],
  },
  /* ---------- Contenuti ---------- */
  'contenuti/post-e-grafiche': {
    cosa: "Post e grafiche per i tuoi social, quando ti servono: una novità, un evento, una promozione. Con i tuoi colori e il tuo modo di parlare.",
    perChi: ['ristorante', 'negozio', 'eventi', 'bnb'],
    passi: ["Ci racconti cosa devi comunicare e a chi.", "Ricevi la proposta scritta: quanti post e in che tempi.", "Ti arrivano sul telefono, li approvi, poi vanno online."],
    faq: [{ d: "Pubblicate voi?", r: "Sì, dopo il tuo ok, nei giorni concordati. Ogni contenuto lo vedi prima." }, { d: "Usate le mie foto?", r: "Sì: usiamo il materiale vero della tua attività. Se un'immagine è creata al computer, lo diciamo." }],
  },
  'contenuti/caroselli': {
    cosa: "Più pagine da scorrere per raccontare una storia: un lavoro, un prodotto, una stagione. Restano in mente più di un post singolo.",
    perChi: ['bnb', 'artigiano', 'negozio', 'studio'],
    passi: ["Ci racconti la storia e il materiale che hai.", "Ricevi la proposta scritta: quanti caroselli e in che tempi.", "Ti arrivano sul telefono, li approvi, poi vanno online."],
    faq: [{ d: "Quante pagine ha un carosello?", r: "Di solito da tre a otto: abbastanza per raccontare, senza stancare." }, { d: "Posso cambiare i testi?", r: "Sì: li scriviamo con la tua voce e li approvi prima." }],
  },
  'contenuti/video-brevi': {
    cosa: "Quindici secondi dal tuo materiale: il passaggio al banco, il piatto, il dietro le quinte. Montati con cura e con i sottotitoli.",
    perChi: ['ristorante', 'artigiano', 'eventi', 'negozio'],
    passi: ["Ci mandi video e foto: ti diciamo cosa riprendere col telefono.", "Ricevi la proposta scritta: quanti video e in che tempi.", "Ti arrivano sul telefono, li approvi, poi vanno online."],
    faq: [{ d: "Devo comparire io?", r: "No, se non vuoi: si raccontano le mani, il prodotto, il locale." }, { d: "Cosa serve per girarli?", r: "Basta il telefono. Ti diciamo come inquadrare e cosa riprendere." }],
  },
  'contenuti/piano-editoriale': {
    cosa: "Cosa pubblicare, quando e dove, con i contenuti pronti ogni settimana. Il piano c'è, e il profilo non resta fermo.",
    perChi: ['ristorante', 'bnb', 'negozio', 'studio'],
    passi: ["Ci racconti cosa fai, a chi parli e cosa non vuoi mostrare.", "Ricevi il piano scritto: temi, formati e frequenza.", "Ogni settimana approvi i contenuti dal telefono."],
    faq: [{ d: "Su quali social lavorate?", r: "Dove sono i tuoi clienti: di solito Instagram e Facebook, LinkedIn per studi e imprese." }, { d: "Posso fermare tutto?", r: "Sì, quando vuoi: non ci sono vincoli lunghi. È scritto nella proposta." }],
  },
  'contenuti/gestione-social': {
    cosa: "Piano, contenuti, pubblicazione e un resoconto ogni mese. Tu approvi, al resto pensiamo noi: i profili restano vivi senza prenderti tempo.",
    perChi: ['ristorante', 'bnb', 'negozio', 'eventi'],
    passi: ["Ci racconti la tua attività e i tuoi profili di oggi.", "Ricevi la proposta con piano, frequenza e resoconto.", "Contenuti ogni settimana, pubblicati dopo il tuo sì."],
    faq: [{ d: "Chi ha accesso ai miei profili?", r: "I profili restano tuoi: ci dai gli accessi per pubblicare e li revochi quando vuoi." }, { d: "Rispondete ai commenti e ai messaggi?", r: "Ai messaggi può pensare un assistente virtuale (pagina Automazioni). Dei commenti parliamo nella prima chiamata." }],
  },
  'contenuti/su-misura': { ...CHIAMATA_SU_MISURA, cosa: "Se i contenuti che ti servono non sono nell'elenco, li progettiamo insieme: una serie, un formato nuovo, un evento da raccontare. Ti diciamo cosa si può fare e da dove partire." },
  /* ---------- Campagne ---------- */
  'campagne/lancio-e-promozioni': {
    cosa: "Un evento, un'apertura, una promozione: un annuncio a tempo per le persone giuste attorno a te, con un budget deciso prima. Alla fine sai cosa è successo.",
    perChi: ['eventi', 'ristorante', 'negozio', 'bnb'],
    passi: ["Ci racconti cosa vuoi promuovere, dove e per quanto tempo.", "Ricevi il piano scritto: zona, durata, budget e nostro lavoro.", "Approvi testi e immagini, parte la campagna, ricevi il resoconto."],
    faq: [{ d: "Quanto devo spendere?", r: "Dipende dall'obiettivo e dalla zona. Lo decidi tu e lo paghi alla piattaforma, dal tuo account." }, { d: "Mi garantite un numero di clienti?", r: "No, e nessuno onesto può farlo. Ti garantiamo di misurare tutto." }],
  },
  'campagne/instagram-e-facebook': {
    cosa: "Annunci nel feed di chi abita in zona o ha gli interessi giusti, con le tue foto e le tue parole. Il budget lo decidi tu.",
    perChi: ['ristorante', 'negozio', 'bnb', 'eventi'],
    passi: ["Ci racconti chi vuoi raggiungere e cosa vuoi che faccia.", "Ricevi il piano scritto: zona, pubblico, formati e budget.", "Approvi gli annunci, parte la campagna, la controlliamo ogni settimana."],
    faq: [{ d: "Gli account chi li intesta?", r: "Tu. Se non li hai, li apriamo insieme." }, { d: "Quando vedo i primi dati?", r: "In pochi giorni. Per capire cosa funziona servono alcune settimane." }],
  },
  'campagne/google': {
    cosa: "Compari tra i primi risultati quando qualcuno cerca quello che fai: «elettricista a Faenza», «dove dormire in Romagna». Chi ti cerca è già interessato.",
    perChi: ['artigiano', 'studio', 'bnb', 'ristorante'],
    passi: ["Ci racconti cosa fai, dove lavori e quali ricerche ti interessano.", "Ricevi il piano scritto: parole cercate, zona e budget.", "Approvi gli annunci, parte la campagna, la controlliamo ogni settimana."],
    faq: [{ d: "Pago ogni volta che qualcuno vede l'annuncio?", r: "No: di norma si paga quando qualcuno clicca. Il costo massimo lo fissi tu." }, { d: "Per uno studio sanitario?", r: "Annunci solo informativi, senza promesse di risultato e senza sconti come leva." }],
  },
  'campagne/contatti': {
    cosa: "L'obiettivo sono le richieste: messaggi, telefonate e moduli, contati uno per uno. Sai quanto ti costa ogni contatto.",
    perChi: ['artigiano', 'studio', 'bnb', 'negozio'],
    passi: ["Ci dici cosa conta per te come contatto: telefonata, messaggio o modulo.", "Ricevi il piano scritto: dove porta la campagna e come contiamo i contatti.", "Parte la campagna: contatti contati, correzioni ogni settimana."],
    faq: [{ d: "Mi serve un sito?", r: "Aiuta molto: la pubblicità porta le persone dove possono agire. Se non ce l'hai, ne parliamo." }, { d: "Come si legge il resoconto?", r: "Senza parole difficili: quanti hanno visto l'annuncio, quanti hanno scritto, quanto ti è costato ognuno." }],
  },
  'campagne/chi-ti-ha-visitato': {
    cosa: "Chi ha guardato il tuo sito e non ha scritto vede un promemoria gentile, e torna. Raggiungi persone che ti conoscono già, con un budget piccolo.",
    perChi: ['bnb', 'negozio', 'eventi', 'ristorante'],
    passi: ["Ci racconti cosa succede oggi a chi visita il sito e non scrive.", "Ricevi il piano scritto: chi raggiungiamo, per quanto e con quale budget.", "Approvi l'annuncio e parte. Nel resoconto vedi quanti sono tornati."],
    faq: [{ d: "E la privacy di chi visita il sito?", r: "Si raggiunge solo chi ha accettato i cookie di marketing. Ti spieghiamo cosa serve sul sito." }, { d: "Serve molto traffico?", r: "Serve un minimo di visite. Se sono poche, te lo diciamo e proponiamo altro." }],
  },
  'campagne/gestione-e-resoconto': {
    cosa: "Ogni settimana si corregge il tiro: ciò che funziona resta, ciò che non rende si spegne. Ogni mese ricevi il costo di ogni contatto.",
    perChi: ['ristorante', 'bnb', 'negozio', 'artigiano'],
    passi: ["Ci racconti se fai già pubblicità e con quali risultati.", "Ricevi la proposta scritta: cosa controlliamo e ogni quanto.", "Ogni settimana spostiamo il budget dove funziona."],
    faq: [{ d: "Chi paga le piattaforme?", r: "Tu, dal tuo account. Il nostro lavoro e il budget sono due voci separate." }, { d: "Posso fermarmi quando voglio?", r: "Sì: l'account è tuo e il budget lo fermi tu." }],
  },
  'campagne/su-misura': { ...CHIAMATA_SU_MISURA, cosa: "Se la campagna che ti serve non è nell'elenco, la progettiamo insieme: un obiettivo, una zona, un periodo preciso. Ti diciamo cosa si può fare, con quale budget e da dove partire." },
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

/** la descrizione per Google (14/11/2026): le frasi intere di «cosa è» che stanno in 155 caratteri; se la prima non ci sta, la riga breve
 *  dell'elenco. Sotto i 70 caratteri si aggiunge chi siamo e dove, perché Google mostra fino a ~155 caratteri */
export function descrizioneDedicata(v: { cosa: string; riga: string }): string {
  const frasi = v.cosa.match(/[^.!?]+[.!?]+/g) ?? [v.cosa]
  let d = ''
  for (const f of frasi) {
    if ((d + f).trim().length > 155) break
    d += f
  }
  d = d.trim() || v.riga
  return d.length < 70 ? `${d} Agenti Studio, Faenza e Romagna.` : d
}
