// /automazioni · Atlas. I testi vengono da pagine/copy-automazioni.md; dove lo spazio non bastava sono accorciati (§16 della spec
// delle pagine) e ogni cambio è registrato in pagine/registro-costruzione.md. Mai «intelligenza artificiale»: si dice «assistente virtuale».
// Nessun prezzo (R4), nessun «Lavori» (R7). Modulo puro.
import { percorsoServizio } from './pagine.ts'
import type { DatiPagina } from './pagine.ts'

export const AUTOMAZIONI: DatiPagina = {
  id: 'automazioni',
  mascotte: 'atlas',
  materia: 'polvere',
  seo: {
    titolo: 'Automazioni aziendali a Faenza e Romagna | Agenti Studio',
    descrizione: 'Un assistente virtuale risponde a messaggi e chiamate anche fuori orario, ricontatta i preventivi e chiede le recensioni. Per attività di Faenza e Romagna.',
  },
  h1: 'Un assistente virtuale risponde ai tuoi clienti, anche quando non ci sei.',
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
    h1: 'Un assistente virtuale risponde ai tuoi clienti, anche quando non ci sei.',
    sotto: 'Risponde a messaggi e chiamate, ricontatta chi ha chiesto un preventivo e chiede le recensioni. Tu ricevi le richieste in ordine e pensi al tuo mestiere.',
    nota: 'Senza impegno. Ti risponde Bruno entro un giorno lavorativo.',
    cartoline: [
      { nome: 'automazioni-1', alt: "Una conversazione con l'assistente virtuale sul telefono" },
      { nome: 'automazioni-2', alt: 'Una mano robotica che tocca una rete di punti luminosi' },
    ],
    problema: {
      h2: 'Chi non riceve risposta, scrive a un altro.',
      righe: [
        ['Un cliente ti scrive la sera. Un altro chiama mentre sei con qualcuno. Un terzo chiede un preventivo e nessuno lo richiama.', 'nessuno'],
        ['Rincorrere i messaggi ti toglie ore dal lavoro vero. E quelli che non rincorri, di solito, sono clienti in meno.', 'clienti in meno'],
        ["Per questo esiste l'assistente virtuale: risponde lui, subito, e ti lascia il lavoro già ordinato.", 'subito'],
      ],
    },
    capacita: {
      h2: 'Cosa fa il tuo assistente virtuale.',
      blocchi: [
        { titolo: ['Risponde subito', 'subito'], riga: 'Messaggi e chiamate perse ricevono risposta in pochi secondi, anche di notte e nei giorni di festa.', gesto: { nome: 'prendi', lato: 'sinistro' } },
        { titolo: ['Raccoglie la richiesta', 'richiesta'], riga: 'Chiede nome, cosa serve e quando, e te lo lascia in ordine, pronto da leggere.', gesto: { nome: 'prendi', lato: 'destro' } },
        { titolo: ['Riprende i preventivi', 'preventivi'], riga: 'Chi ha chiesto un prezzo e poi è sparito riceve un messaggio gentile, al momento giusto.', gesto: { nome: 'prendi', lato: 'sinistro' } },
        { titolo: ['Chiede le recensioni', 'recensioni'], riga: "Dopo la visita o l'acquisto invita a lasciare una recensione su Google. A tutti i clienti, non solo ai più contenti.", gesto: { nome: 'presenta', lato: 'destro' } },
        { titolo: ['Ti avvisa solo quando serve', 'quando serve'], riga: 'Le richieste semplici le gestisce da solo. Se serve una persona, ti arriva un avviso sul telefono.', gesto: { nome: 'prendi', lato: 'destro' } },
        { titolo: ['Dice sempre chi è', 'chi è'], riga: 'Si presenta come assistente virtuale. Nessun trucco, e chi vuole parlare con una persona la trova.', gesto: { nome: 'prendi', lato: 'sinistro' } },
      ],
      beneficio: [['Nessun cliente resta senza risposta.', 'senza risposta']],
      gestoBeneficio: { nome: 'solleva', tieni: true },
    },
  }),
  extra: {
    dopo: 'tappe',
    h2: 'Tu controlli cosa dice e a chi lo dice.',
    elenco: [
      'Si presenta sempre come assistente virtuale.',
      'Passa la mano a una persona quando serve.',
      'Sulle cose delicate (prezzi particolari, salute, allergie, reclami) non improvvisa: ti avvisa.',
      'Chi non vuole più messaggi non ne riceve più.',
      'Nessun cliente riceve messaggi in eccesso.',
    ],
  },
  gioco: {
    h2: 'Un assistente virtuale, sei mestieri diversi.',
    scelte: [
      {
        id: 'dentisti', nome: 'Studio dentistico',
        testo: 'Chi scrive alle 22 per un appuntamento trova risposta, e la richiesta arriva alla segreteria in ordine. I preventivi in sospeso vengono ripresi con un messaggio educato. Senza toccare il gestionale.',
        link: { testo: 'Per gli studi abbiamo un percorso dedicato', href: '/studi-dentistici' },
      },
      { id: 'bnb', nome: 'B&B e agriturismo', testo: "Gli ospiti chiedono date, come arrivare, se accettate animali. L'assistente risponde alle domande più comuni e ti lascia le richieste di prenotazione già riassunte." },
      { id: 'negozio', nome: 'Negozio', testo: 'Orari, disponibilità, ritiro degli ordini: le domande che si ripetono trovano risposta da sole. Chi chiede un prodotto e poi sparisce viene ricontattato.' },
      { id: 'ristorante', nome: 'Ristorante', testo: 'Orari, come arrivare, richieste per il weekend: risponde mentre sei in cucina. Per allergie e casi particolari non improvvisa: ti passa il messaggio.' },
      { id: 'artigiano', nome: 'Artigiano e impresa', testo: "Sei in cantiere e non puoi rispondere. L'assistente raccoglie indirizzo, tipo di lavoro e urgenza, e ti manda un riassunto." },
      { id: 'studio', nome: 'Studio professionale', testo: 'Raccoglie la richiesta di appuntamento con i dati utili e ricorda ai clienti i documenti da portare.' },
    ],
  },
  tappe: {
    h2: 'Come funziona, passo per passo.',
    nomi: ['Chiamata', 'Proposta', 'Avvio'],
    passi: [
      { tappa: 0, titolo: 'Ci racconti la tua attività', testo: 'Una chiamata gratuita, senza impegno: cosa fai, da dove arrivano i clienti, quali domande ti fanno più spesso, dove perdi tempo.' },
      { tappa: 0, titolo: "Scegliamo cosa far fare all'assistente", testo: 'Rispondere ai messaggi, riprendere i preventivi, chiedere le recensioni. Partiamo da ciò che ti serve di più, non da tutto insieme.' },
      { tappa: 1, titolo: 'Ricevi la proposta scritta', testo: 'Cosa facciamo, in quanto tempo e quanto costa, per iscritto. Nessuna sorpresa dopo.' },
      { tappa: 2, titolo: 'Scriviamo le risposte con te', testo: 'Con le tue parole, i tuoi orari, le tue regole. Le leggi e le approvi tu prima che parta qualsiasi cosa.' },
      { tappa: 2, titolo: 'Proviamo, poi si parte', testo: "Facciamo le prove con messaggi finti, mai con i tuoi clienti. Quando tutto torna, l'assistente comincia a lavorare." },
      { tappa: 2, titolo: 'Ti seguiamo da vicino', testo: 'Nelle prime settimane controlliamo le conversazioni e correggiamo ciò che non va. Poi basta un controllo veloce, ogni tanto.' },
    ],
    riga: 'Tu ci metti poco: una chiamata, qualche risposta da approvare, una prova. Il resto lo facciamo noi.',
  },
  domande: {
    h2: 'Le domande che ci fanno prima di iniziare.',
    voci: [
      { d: 'I miei clienti capiranno che non è una persona?', r: "Sì, perché glielo diciamo noi: l'assistente si presenta come assistente virtuale. Chi preferisce una persona può chiederla." },
      { d: 'Devo cambiare programmi o gestionale?', r: 'In genere no: partiamo da ciò che usi già. Se per un compito serve collegare qualcosa in più, te lo diciamo prima della proposta.' },
      { d: 'E se sbaglia una risposta?', r: "Per questo scriviamo le risposte con te e le proviamo prima. Sulle questioni delicate l'assistente non improvvisa e ti passa il messaggio." },
      { d: 'Risponde anche alle chiamate?', r: 'Sì, può rispondere alle chiamate che non riesci a prendere. Nella prima chiamata capiamo se per la tua attività serve.' },
      { d: 'Quanto mi costa?', r: 'Dipende da cosa serve alla tua attività. Dopo la chiamata ricevi un preventivo scritto, con i costi chiari.' },
    ],
  },
  invito: { frasi: [['Il prossimo messaggio'], ['può già avere risposta.', 'risposta']] },
  coda: { riga: "Raccontaci cosa fai. Ti diciamo cosa può fare l'assistente per te e cosa no. Seguiamo poche attività alla volta: la prossima può essere la tua." },
}
