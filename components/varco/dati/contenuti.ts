// /contenuti · Prometheus. Testi da pagine/copy-contenuti.md, accorciati dove lo spazio non bastava (§16); ogni cambio è in
// pagine/registro-costruzione.md. Mai «intelligenza artificiale». Nessun prezzo (R4), nessun «Lavori» (R7). Modulo puro.
import { percorsoServizio } from './pagine.ts'
import type { DatiPagina } from './pagine.ts'

const F = (nome: string) => `/film/pagine/contenuti/${nome}.webp`

export const CONTENUTI: DatiPagina = {
  id: 'contenuti',
  mascotte: 'prometheus',
  materia: 'saette',
  seo: {
    titolo: 'Gestione social e contenuti a Faenza | Agenti Studio',
    descrizione: 'Post, caroselli e video brevi che raccontano la tua attività com\'è davvero. Un piano chiaro, pronti ogni settimana sul telefono. Agenti Studio, Faenza.',
  },
  h1: 'I tuoi social pieni di contenuti veri, senza che tu debba inventarli.',
  poster: { src720: '/film/scene/prometheus-2-720.webp', src1080: '/film/scene/prometheus-2-1080.webp', alt: 'Prometheus, la mascotte di saette dei contenuti, con la fiammella' },
  percorso: percorsoServizio({
    id: 'contenuti',
    indice: '03 · Contenuti',
    materia: 'saette',
    servizio: 'Creazione contenuti',
    h1: 'I tuoi social pieni di contenuti veri, senza che tu debba inventarli.',
    sotto: 'Post, caroselli e video brevi sulla tua attività, con un piano chiaro. Ogni settimana li ricevi sul telefono e li approvi con un tocco.',
    nota: 'Senza impegno. Ti risponde Bruno entro un giorno lavorativo.',
    cartoline: [
      { nome: 'contenuti-1', alt: 'Un video di cucina girato col telefono sul treppiede' },
      { nome: 'contenuti-2', alt: 'Il telefono che riprende un prodotto in studio' },
    ],
    problema: {
      h2: "Il profilo c'è. L'ultimo post, qualche mese fa.",
      righe: [
        ["Lavori tutto il giorno. La sera non hai voglia di pensare cosa scrivere, che foto usare, a che ora pubblicare.", 'cosa scrivere'],
        ['Un profilo fermo dice a chi ti cerca che forse non sei più aperto. Molti guardano i social prima di chiamare.', 'fermo'],
        ["Il bello del tuo lavoro c'è già. Va solo mostrato, con regolarità.", 'mostrato'],
      ],
    },
    capacita: {
      h2: 'Cosa trovi sul telefono ogni settimana.',
      blocchi: [
        { titolo: ['Un piano chiaro', 'piano'], riga: 'Cosa pubblicare, quando e dove. Non ti chiedi più «cosa posto oggi?».', gesto: { nome: 'lancia', lato: 'destro' } },
        { titolo: ['La tua attività, com\'è davvero', 'davvero'], riga: 'Usiamo i tuoi prodotti, il tuo locale, le persone che lavorano con te. Niente immagini finte spacciate per vere.', gesto: { nome: 'lancia', lato: 'destro' } },
        { titolo: ['Parole tue', 'tue'], riga: 'Scriviamo come parli tu, con il tuo tono e i tuoi modi di dire. Il profilo suona come te.', gesto: { nome: 'lancia', lato: 'destro' } },
        { titolo: ['Pronti sul telefono', 'telefono'], riga: 'Ogni settimana ricevi i contenuti già pronti, li guardi quando hai un minuto.', gesto: { nome: 'lancia', lato: 'destro' } },
        { titolo: ['Li approvi con un tocco', 'tocco'], riga: 'Ti va bene, dici sì. Qualcosa da cambiare, ce lo dici e lo sistemiamo.', gesto: { nome: 'lancia', lato: 'destro' } },
        { titolo: ['Formati diversi', 'diversi'], riga: 'Post, caroselli, video brevi. La foto del piatto, il «come si fa», i quindici secondi dietro le quinte.', gesto: { nome: 'lancia', lato: 'destro' } },
      ],
      beneficio: [['Chi ti segue ti riconosce.', 'riconosce'], ['Chi non ti conosce si ferma.', 'si ferma']],
      gestoBeneficio: { nome: 'lancia', lato: 'destro' },
      foto: { blocco: 2, src: F('cont-firma'), alt: 'Mani che dipingono una ceramica' },
    },
  }),
  gioco: {
    h2: 'Cosa si racconta, per mestiere.',
    scelte: [
      { id: 'ristorante', nome: 'Ristorante e bar', foto: F('cont-ristorante'), testo: "Il piatto del giorno, la cucina dietro le quinte, l'evento del sabato. Un video breve di chi impasta racconta più di una foto del menu." },
      { id: 'bnb', nome: 'B&B e agriturismo', foto: F('cont-bnb'), testo: 'Le stagioni della tenuta, la colazione, gli eventi, i dintorni da visitare. Gli ospiti scelgono leggendo il profilo.' },
      { id: 'negozio', nome: 'Negozio', foto: F('cont-negozio'), testo: 'Le novità in arrivo, il prodotto raccontato da chi lo vende, i consigli d\'uso.' },
      { id: 'artigiano', nome: 'Artigiano e impresa', foto: F('cont-artigiano'), testo: 'Il prima e dopo di un lavoro, un passaggio al banco, la faccia di chi lo fa. La fiducia nasce vedendo come lavori.' },
      { id: 'dentista', nome: 'Studio dentistico', foto: F('cont-dentisti'), testo: 'Contenuti informativi chiari su cosa si fa e come funziona una visita. Niente promesse di risultato né testimonianze di pazienti: nel settore sanitario non si usano.' },
      { id: 'studio', nome: 'Studio professionale', foto: F('cont-studio'), testo: 'Pillole utili per i clienti: scadenze, documenti da preparare, domande frequenti.' },
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
      { d: 'Rispondete anche ai messaggi dei clienti?', r: 'Ai messaggi può pensarci l\'assistente virtuale (lo trovi nella pagina Automazioni). Per i commenti ne parliamo nella prima chiamata.' },
      { d: 'Servono anche le pubblicità?', r: 'Non per forza. I contenuti ti fanno riconoscere da chi già ti segue. Se vuoi arrivare anche a chi non ti conosce, ci sono le campagne pubblicitarie, ma sono un passo a parte.' },
      { d: 'Quanto costa?', r: 'Dipende da quanti contenuti servono ogni settimana e su quali social. Dopo la chiamata ricevi una proposta scritta, con i costi chiari.' },
    ],
  },
  invito: { frasi: [["Quando è stato l'ultimo post?"], ['Da oggi, si cambia.', 'cambia']] },
  coda: { riga: 'Raccontaci cosa fai. Ti diciamo che contenuti servono e come li prepariamo. Seguiamo poche attività alla volta: la prossima può essere la tua.' },
}
