// /automazioni · Atlas. v2 (31/10, voto 6,5 di Bruno): non più centrata sull'assistente virtuale. Un paragrafo generale su a cosa servono
// le automazioni, poi il film elenca le automazioni una per schermata (solo titolo + «Come funziona» + «Chiedi un preventivo»), più
// «Su misura». Testi in vault: pagine/automazioni-v2.md. Mai «intelligenza artificiale» (si dice «assistente virtuale»), nessun prezzo
// (R4), nessun «Lavori» (R7). Modulo puro.
import { percorsoServizio } from './pagine.ts'
import type { DatiPagina, Frase } from './pagine.ts'
import type { GestoPagina } from '../tipi.ts'

const F = (nome: string) => `/film/pagine/siti-web/${nome}.webp`

/** le automazioni dell'elenco: slug della pagina di approfondimento (provvisoria, da strutturare), titolo, parola d'accento, gesto di Atlas */
export type VoceAutomazione = { slug: string; titolo: Frase; gesto: GestoPagina; /** la scena disegnata (sezioni/Vignetta.tsx) */ vignetta: string; /** una riga per la pagina provvisoria di approfondimento */ riga: string }

export const VOCI_AUTOMAZIONI: VoceAutomazione[] = [
  { slug: 'assistente-messaggi', titolo: ['Assistente ai messaggi', 'messaggi'], gesto: { nome: 'prendi', lato: 'sinistro' }, vignetta: 'messaggi',
    riga: 'Risponde su WhatsApp, Instagram ed email, a ogni ora, e ti lascia le richieste in ordine.' },
  { slug: 'segreteria-telefonica', titolo: ['Segreteria telefonica virtuale', 'telefonica'], gesto: { nome: 'presenta', lato: 'destro' }, vignetta: 'segreteria',
    riga: 'Risponde alle chiamate che non riesci a prendere e ti manda un riassunto di ognuna.' },
  { slug: 'ricontatto-preventivi', titolo: ['Ricontatto dei preventivi', 'preventivi'], gesto: { nome: 'lancia', lato: 'destro' }, vignetta: 'preventivi',
    riga: 'Chi ha chiesto un prezzo e poi è sparito riceve un messaggio gentile, nel momento giusto.' },
  { slug: 'onboarding-cliente', titolo: ['Onboarding cliente', 'cliente'], gesto: { nome: 'presenta', lato: 'sinistro' }, vignetta: 'onboarding',
    riga: 'Contratto, moduli, accessi e benvenuto partono da soli appena un cliente dice sì.' },
  { slug: 'fatture-solleciti', titolo: ['Fatture e solleciti', 'solleciti'], gesto: { nome: 'prendi', lato: 'destro' }, vignetta: 'fatture',
    riga: 'La fattura parte da sola e chi tarda a pagare riceve un promemoria gentile, finché l\'incasso non arriva.' },
  { slug: 'programmi-collegati', titolo: ['Programmi collegati', 'collegati'], gesto: { nome: 'prendi', lato: 'sinistro' }, vignetta: 'collegati',
    riga: 'Ordini, magazzino e gestionale si parlano tra loro: un dato inserito una volta compare dove serve.' },
]

const preventivo = (richiesta: string) => ({ testo: 'Chiedi un preventivo', href: '#preventivo', richiesta })

const ELENCO = [
  ...VOCI_AUTOMAZIONI.map((v) => ({
    titolo: v.titolo, gesto: v.gesto, vignetta: v.vignetta,
    azioni: [{ testo: 'Come funziona', href: `/automazioni/${v.slug}` }, preventivo(`Mi interessa: ${v.titolo[0]}.`)],
  })),
  {
    titolo: ['Su misura', 'misura'] as Frase, vignetta: 'su-misura', riga: 'Raccontaci di cosa hai bisogno: la progettiamo per la tua attività.', gesto: { nome: 'modella' } as GestoPagina,
    azioni: [{ testo: 'Raccontaci cosa ti serve', href: '#preventivo', richiesta: "Vorrei un'automazione su misura per: " }],
  },
]

const H1 = 'Il lavoro che si ripete, ora va da solo.'

export const AUTOMAZIONI: DatiPagina = {
  id: 'automazioni',
  mascotte: 'atlas',
  materia: 'polvere',
  seo: {
    titolo: 'Automazioni aziendali a Faenza e Romagna | Agenti Studio',
    descrizione: 'Risposte a messaggi e chiamate, preventivi ricontattati, accoglienza dei nuovi clienti, fatture e solleciti: automazioni per attività e PMI di Faenza e della Romagna.',
  },
  h1: H1,
  poster: {
    src720: '/film/scene/atlas-2-720.webp',
    src1080: '/film/scene/atlas-2-1080.webp',
    alt: 'Atlas, la mascotte di polvere di stelle delle automazioni, con la luna sulla schiena',
  },
  percorso: percorsoServizio({
    id: 'automazioni',
    indice: '01 · Automazioni',
    materia: 'polvere',
    servizio: 'Automazioni aziendali',
    h1: H1,
    sotto: 'Ogni giorno la tua attività ripete gli stessi gesti: rispondere, ricontattare, accogliere, incassare. Le automazioni se ne occupano al posto tuo, a ogni ora e sempre con la stessa cura. Tu recuperi tempo per il tuo mestiere, i clienti ricevono sempre una risposta e nessuna occasione resta indietro.',
    nota: 'Senza impegno. Ti risponde Bruno entro un giorno lavorativo.',
    cartoline: [
      { nome: 'automazioni-1', alt: "Una conversazione con l'assistente virtuale sul telefono" },
      { nome: 'automazioni-2', alt: 'Una mano robotica che tocca una rete di punti luminosi' },
    ],
    capacita: {
      h2: 'Cosa possiamo automatizzare per te.',
      passo: 0.6,
      blocchi: ELENCO,
      beneficio: [['Il resto va da solo.', 'da solo']],
      gestoBeneficio: { nome: 'solleva', tieni: true },
    },
  }),
  extra: {
    dopo: 'tappe',
    h2: 'Resti tu a decidere.',
    elenco: [
      'Ogni automazione la approvi tu, prima che parta.',
      "L'assistente si presenta sempre come assistente virtuale.",
      'Quando serve una persona, ti arriva un avviso sul telefono.',
      'Sulle cose delicate (prezzi particolari, salute, reclami) non si improvvisa: decidi tu.',
      'Chi non vuole più messaggi non ne riceve più.',
    ],
  },
  gioco: {
    h2: 'Cosa automatizzare, per mestiere.',
    scelte: [
      { id: 'bnb', scena: 'a-bnb', nome: 'B&B e agriturismo', foto: F('siti-bnb'), testo: "Gli ospiti scrivono a ogni ora per date, arrivo, animali. L'assistente risponde subito e ti lascia le richieste di prenotazione già riassunte: tu confermi, e l'ospite non scrive a un altro." },
      { id: 'ristorante', scena: 'a-ristorante', nome: 'Ristorante e bar', foto: F('siti-ristorante'), testo: "Orari, weekend, prenotazioni: le domande che si ripetono trovano risposta mentre sei in cucina, e il tavolo prenotato riceve conferma. Per allergie e casi particolari il messaggio arriva a te." },
      { id: 'negozio', scena: 'a-negozio', nome: 'Negozio', foto: F('siti-negozio'), testo: "Disponibilità, orari, ritiro: le domande trovano risposta da sole. Chi chiede un prodotto e poi sparisce riceve un messaggio gentile, e torna a ritirare." },
      { id: 'artigiano', scena: 'a-artigiano', nome: 'Artigiano e impresa', foto: F('siti-artigiano'), testo: "Sei in cantiere e non puoi rispondere: la segreteria raccoglie indirizzo, tipo di lavoro e urgenza e ti manda un riassunto. I preventivi aperti vengono ripresi." },
      {
        id: 'studio', scena: 'a-studio', nome: 'Studi e professionisti', foto: F('siti-studio'),
        testo: 'Le richieste di appuntamento arrivano con i dati utili, i nuovi clienti ricevono subito moduli e documenti da portare e le fatture partono da sole. Senza toccare il gestionale.',
        link: { testo: 'Per gli studi dentistici abbiamo un percorso dedicato', href: '/studi-dentistici' },
      },
      { id: 'eventi', scena: 'a-eventi', nome: 'Associazioni ed eventi', foto: '/film/pagine/contenuti/cont-eventi.webp', testo: "Le iscrizioni arrivano in ordine, ogni iscritto riceve subito la conferma con le istruzioni, e tu vedi chi viene senza rincorrere nessuno." },
    ],
  },
  tappe: {
    h2: 'Come funziona, passo per passo.',
    nomi: ['Chiamata', 'Proposta', 'Avvio'],
    passi: [
      { tappa: 0, titolo: 'Ci racconti la tua attività', testo: 'Una chiamata gratuita, senza impegno: cosa fai, da dove arrivano i clienti, quali domande ti fanno più spesso, dove perdi tempo.' },
      { tappa: 0, titolo: 'Scegliamo da quali automazioni partire', testo: 'Messaggi, chiamate, preventivi, nuovi clienti, fatture: partiamo da ciò che ti fa perdere più tempo, non da tutto insieme.' },
      { tappa: 1, titolo: 'Ricevi la proposta scritta', testo: 'Cosa facciamo, in quanto tempo e quanto costa, per iscritto. Nessuna sorpresa dopo.' },
      { tappa: 2, titolo: 'Scriviamo i messaggi con te', testo: 'Con le tue parole, i tuoi orari, le tue regole. Li leggi e li approvi tu prima che parta qualsiasi cosa.' },
      { tappa: 2, titolo: 'Proviamo, poi si parte', testo: 'Facciamo le prove con messaggi finti, mai con i tuoi clienti. Quando tutto torna, le automazioni cominciano a lavorare.' },
      { tappa: 2, titolo: 'Ti seguiamo da vicino', testo: 'Nelle prime settimane controlliamo che tutto funzioni e correggiamo ciò che non va. Poi basta un controllo veloce, ogni tanto.' },
    ],
    riga: 'Tu ci metti poco: una chiamata, qualche messaggio da approvare, una prova. Il resto lo facciamo noi.',
  },
  domande: {
    h2: 'Le domande che ci fanno prima di iniziare.',
    voci: [
      { d: 'Posso partire da una sola automazione?', r: 'Sì, ed è quello che consigliamo: si parte da quella che ti fa perdere più tempo e si aggiunge il resto quando serve.' },
      { d: 'Devo cambiare programmi o gestionale?', r: 'In genere no: partiamo da ciò che usi già. Se per un compito serve collegare qualcosa in più, te lo diciamo prima della proposta.' },
      { d: 'I miei clienti capiranno che non è una persona?', r: "Sì, perché glielo diciamo noi: l'assistente si presenta come assistente virtuale. Chi preferisce una persona può chiederla." },
      { d: 'E se un messaggio è sbagliato?', r: 'Per questo scriviamo i messaggi con te e li proviamo prima. Sulle questioni delicate non si improvvisa: il messaggio passa a te.' },
      { d: 'Quanto mi costa?', r: 'Dipende da quali automazioni servono alla tua attività. Dopo la chiamata ricevi un preventivo scritto, con i costi chiari.' },
    ],
  },
  invito: { frasi: [['Da quale automazione'], ['vuoi partire?', 'partire']] },
  coda: { riga: 'Raccontaci cosa fai. Ti diciamo quali automazioni servono alla tua attività e quali no. Seguiamo poche attività alla volta: la prossima può essere la tua.' },
}
