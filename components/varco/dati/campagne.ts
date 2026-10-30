// /campagne · Hermes. Testi da pagine/copy-campagne.md, accorciati dove lo spazio non bastava (§16); ogni cambio è in
// pagine/registro-costruzione.md. Mai «intelligenza artificiale». Nessun prezzo (R4), nessun risultato promesso, nessun «Lavori» (R7). Modulo puro.
import { percorsoServizio } from './pagine.ts'
import type { DatiPagina } from './pagine.ts'

export const CAMPAGNE: DatiPagina = {
  id: 'campagne',
  mascotte: 'hermes',
  materia: 'cromo',
  seo: {
    titolo: 'Campagne pubblicitarie a Faenza e Romagna | Agenti Studio',
    descrizione: 'Pubblicità su Instagram, Facebook e Google per portare clienti nuovi alla tua attività, con budget sotto controllo. Sai quanto costa ogni contatto. Faenza.',
  },
  h1: 'Pubblicità che porta clienti nuovi, e ti dice quanto costa ognuno.',
  poster: { src720: '/film/scene/hermes-2-720.webp', src1080: '/film/scene/hermes-2-1080.webp', alt: 'Hermes, la mascotte di cromo delle campagne pubblicitarie, con le ali ai piedi' },
  percorso: percorsoServizio({
    id: 'campagne',
    indice: '04 · Campagne',
    materia: 'cromo',
    servizio: 'Campagne pubblicitarie',
    h1: 'Pubblicità che porta clienti nuovi, e ti dice quanto costa ognuno.',
    sotto: 'Annunci su Instagram, Facebook e Google rivolti alle persone giuste, con budget e risultati sotto controllo. Sai dove vanno i tuoi soldi.',
    nota: 'Senza impegno. Ti risponde Bruno entro un giorno lavorativo.',
    cartoline: [
      { nome: 'campagne-1', alt: 'Una pubblicità su Facebook vista dal telefono' },
      { nome: 'campagne-2', alt: 'I grafici dei risultati sul portatile' },
    ],
    problema: {
      h2: 'Hai speso. Sono arrivati i like. I clienti, no.',
      righe: [
        ['Si preme «metti in evidenza», si spende qualcosa, qualcuno mette un cuore. Poi nessuno sa se è arrivato un cliente.', 'nessuno sa'],
        ['Senza un obiettivo e senza numeri, la pubblicità è una scommessa. E la scommessa la perde chi non guarda i conti.', 'scommessa'],
        ['La stessa cifra, con un obiettivo chiaro e un controllo ogni settimana, ha una direzione.', 'direzione'],
      ],
    },
    capacita: {
      h2: 'Pubblicità con il conto in chiaro.',
      blocchi: [
        { titolo: ['Un obiettivo prima di spendere', 'obiettivo'], riga: 'Tavoli pieni, camere occupate, nuove richieste di preventivo. Scegliamo quello e misuriamo quello.', gesto: { nome: 'salta' } },
        { titolo: ['Le persone giuste', 'giuste'], riga: 'Chi abita vicino a te o chi viene da lontano: zona, interessi, periodo. Non paghi per farti vedere da chi non comprerà mai.', gesto: { nome: 'salta' } },
        { titolo: ['Testi e immagini fatti per te', 'per te'], riga: 'Annunci con le tue foto e le tue parole. Li vedi e li approvi prima che partano.', gesto: { nome: 'presenta', lato: 'destro' } },
        { titolo: ['Il budget è tuo', 'tuo'], riga: 'Lo paghi direttamente a Meta e a Google, dal tuo account. Noi non ci mettiamo in mezzo.', gesto: { nome: 'presenta', lato: 'sinistro' } },
        { titolo: ['Ogni settimana, si corregge il tiro', 'corregge'], riga: 'Guardiamo cosa funziona e spostiamo lì il budget. Quello che non rende, lo spegniamo.', gesto: { nome: 'salta' } },
        { titolo: ['Sai quanto costa ogni contatto', 'contatto'], riga: 'Un resoconto semplice, con i numeri veri e senza parole difficili.', gesto: { nome: 'presenta', lato: 'destro' } },
      ],
      beneficio: [['Nessuno può garantirti quante richieste arriveranno.', 'garantirti'], ['Noi ti garantiamo di sapere cosa è successo, e perché.', 'perché']],
      gestoBeneficio: { nome: 'salta' },
    },
  }),
  gioco: {
    h2: 'Chi vuoi raggiungere, e dove.',
    scelte: [
      { id: 'ristorante', nome: 'Ristorante', testo: 'Serata a tema, menu di stagione, giorni da riempire: annunci a chi abita entro un certo raggio dalla tua porta, nei giorni in cui serve.' },
      { id: 'bnb', nome: 'B&B e agriturismo', testo: 'Camere ancora libere in bassa stagione: annunci a chi cerca un weekend in Romagna, anche da fuori regione e dall\'estero.' },
      { id: 'negozio', nome: 'Negozio', testo: 'Nuovi arrivi, apertura di una sezione, un evento: annunci a chi abita nei dintorni, con la mappa e un invito a passare.' },
      { id: 'artigiano', nome: 'Artigiano e impresa', testo: 'Chi cerca «elettricista a Faenza» deve trovare te. Su Google, nel momento in cui lo cerca; su Instagram, con il prima e dopo dei tuoi lavori.' },
      { id: 'studio', nome: 'Studio professionale', testo: 'Annunci a chi cerca il tuo servizio su Google proprio mentre lo cerca.' },
      { id: 'sanitario', nome: 'Studio sanitario', testo: 'Annunci solo informativi sul servizio (per esempio «ortodonzia con allineatori a Faenza»), senza domande sulla persona, senza promesse di risultato e senza sconti come leva.' },
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
