/**
 * Contenuti del sito, separati dai componenti.
 * Modificare qui i testi: nessun componente contiene copy.
 *
 * REGOLA DI ONESTA: nessun numero presentato come risultato ottenuto.
 * Le cifre sono aritmetica con assunzioni dichiarate, oppure dati
 * misurabili sul singolo studio. Non esistono clienti da citare: il
 * primo pilota non e ancora partito.
 */

export const CONTATTO = {
  email: 'bruno@agentistudio.it',
  telefono: '',
  zona: 'Romagna',
  formspree: 'https://formspree.io/f/mrednjvj',
}

export type Post = { titolo: string; testo: string }

export type Modulo = {
  sigla: string
  slug: string
  nome: string
  promessa: string
  stato: 'pronto' | 'verifica'
  statoNota: string
  metrica: string
  ore: string
  oreNota: string
  euro: string
  euroNota: string
  posts: Post[]
}

export const MODULI: Modulo[] = [
  {
    sigla: 'M1',
    slug: 'preventivi',
    nome: 'Recupero Preventivi',
    promessa: 'I preventivi fermi tornano a muoversi, senza che nessuno debba richiamare.',
    stato: 'pronto',
    statoNota: 'Nessun collegamento al gestionale',
    metrica: 'Piani accettati fra i preventivi fermi',
    ore: '3–5 ore',
    oreNota: 'al mese di richiami che la segreteria non fa più a mano',
    euro: '1 impianto',
    euroNota: 'recuperato ripaga il servizio per più di un anno',
    posts: [
      {
        titolo: 'Il problema',
        testo:
          'Un preventivo da 2.400 euro consegnato e mai richiamato non è un no. È un forse che nessuno ha più toccato. In uno studio medio ce ne sono decine, fermi da mesi.',
      },
      {
        titolo: 'Cosa fa',
        testo:
          'Parla con quel paziente tre volte in ventun giorni. Gli ricorda che il preventivo c’è, gli dice che esiste il pagamento dilazionato, e alla fine gli chiede se vuole ancora sentirne parlare.',
      },
      {
        titolo: 'Come funziona',
        testo:
          'La segreteria scrive il preventivo su un foglio condiviso quando lo consegna. Dieci secondi. Da lì in poi il sistema si muove da solo e avvisa quando qualcuno risponde.',
      },
      {
        titolo: 'Cosa ci guadagna',
        testo:
          'Tre-cinque ore al mese di telefonate che nessuno faceva comunque. E un numero che prima non esisteva: quanti preventivi fermi tornano, ogni mese.',
      },
    ],
  },
  {
    sigla: 'M2',
    slug: 'segreteria',
    nome: 'Segreteria AI',
    promessa: 'Risponde alle chiamate che oggi si perdono, anche alle otto di sera.',
    stato: 'pronto',
    statoNota: 'Versione che risponde e qualifica, senza toccare l’agenda',
    metrica: 'Percentuale di chiamate con risposta',
    ore: '6–10 ore',
    oreNota: 'al mese di telefono tolte alla poltrona',
    euro: 'Migliaia',
    euroNota: 'di euro: è il valore nel tempo di un solo paziente implantologico',
    posts: [
      {
        titolo: 'Il problema',
        testo:
          'La segretaria è al telefono, o è in pausa, o lo studio è chiuso. Il paziente non lascia un messaggio: chiama il dentista dopo. Quella chiamata non compare in nessun report.',
      },
      {
        titolo: 'Cosa fa',
        testo:
          'Risponde alle chiamate perse e fuori orario. Dice gli orari, spiega dove parcheggiare, raccoglie nome, numero e motivo. Riconosce le urgenze e i casi importanti, e avvisa subito.',
      },
      {
        titolo: 'Come funziona',
        testo:
          'Il numero dello studio resta quello di sempre. Quando è occupato o fuori orario, la chiamata viene girata all’assistente. Il paziente non deve imparare niente di nuovo.',
      },
      {
        titolo: 'Cosa ci guadagna',
        testo:
          'Nessuna chiamata persa senza traccia. Ogni mattina la segreteria trova l’elenco di chi ha chiamato la sera prima, con il motivo già scritto.',
      },
    ],
  },
  {
    sigla: 'M3',
    slug: 'richiami',
    nome: 'Richiami e Riattivazione',
    promessa: 'I pazienti che non vede da un anno si ricordano che esistete.',
    stato: 'verifica',
    statoNota: 'Serve poter esportare lo storico visite',
    metrica: 'Pazienti riattivati e sedute prenotate',
    ore: '4–6 ore',
    oreNota: 'al mese di lavoro di lista che nessuno ha tempo di fare',
    euro: 'Archivio',
    euroNota: 'già pagato: sono pazienti che si sono già fidati una volta',
    posts: [
      {
        titolo: 'Il problema',
        testo:
          'Ogni studio ha centinaia di pazienti che dovevano tornare a sei mesi e non sono più tornati. Nessuno li richiama, perché richiamarli a mano è un lavoro che non finisce mai.',
      },
      {
        titolo: 'Cosa fa',
        testo:
          'Divide i pazienti in due gruppi e parla a ognuno in modo diverso. A chi è in scadenza di controllo scrive breve. A chi manca da oltre un anno e mezzo scrive con più cautela, lasciando facile dire di no.',
      },
      {
        titolo: 'Come funziona',
        testo:
          'Una volta a settimana legge l’elenco dei pazienti con la data dell’ultima visita. Chi è stato contattato negli ultimi tre mesi viene saltato: è la regola che impedisce di diventare fastidiosi.',
      },
      {
        titolo: 'Cosa ci guadagna',
        testo:
          'Fatturato che esiste già nell’archivio. E un elenco, ogni settimana, di chi non è stato contattato e perché.',
      },
    ],
  },
  {
    sigla: 'M4',
    slug: 'no-show',
    nome: 'Anti-No-Show',
    promessa: 'Quando qualcuno disdice alle otto di sera, il posto si riempie da solo.',
    stato: 'verifica',
    statoNota: 'Serve accesso in lettura all’agenda',
    metrica: 'Tasso di assenze e slot riempiti dalla lista d’attesa',
    ore: '2–4 ore',
    oreNota: 'al mese di telefonate per riempire i buchi',
    euro: '80–200 €',
    euroNota: 'per ogni ora di poltrona che torna a produrre',
    posts: [
      {
        titolo: 'Il problema',
        testo:
          'Il promemoria glielo manda già il gestionale. Il problema non è avvisare: è che quando uno disdice la sera prima, quel posto resta vuoto e nessuno lo riempie.',
      },
      {
        titolo: 'Cosa fa',
        testo:
          'Manda il promemoria a due giorni e a un giorno, con due pulsanti: confermo, oppure non posso venire. Chi ha già confermato non viene disturbato una seconda volta.',
      },
      {
        titolo: 'Come funziona',
        testo:
          'Se il paziente disdice, il sistema cerca subito nella lista d’attesa chi ha bisogno di una seduta della stessa durata, e gli propone quel posto. Anche di notte.',
      },
      {
        titolo: 'Cosa ci guadagna',
        testo:
          'Un’ora di poltrona vale fra ottanta e duecento euro. Riempirne due al mese che prima restavano vuote copre il servizio e avanza.',
      },
    ],
  },
  {
    sigla: 'M5',
    slug: 'recensioni',
    nome: 'Recensioni Google',
    promessa: 'Le recensioni arrivano da sole, e lei approva le risposte in dieci secondi.',
    stato: 'pronto',
    statoNota: 'Serve l’accesso al profilo Google dello studio',
    metrica: 'Recensioni al mese e data dell’ultima',
    ore: '2–3 ore',
    oreNota: 'al mese: scrivere risposte è il lavoro che nessuno vuole fare',
    euro: 'Canale #1',
    euroNota: 'di acquisizione nel dentale locale: chi cerca un dentista legge le recensioni',
    posts: [
      {
        titolo: 'Il problema',
        testo:
          'Il profilo ha trentaquattro recensioni e l’ultima è di maggio. Non è un problema di qualità dello studio: è che nessuno le chiede, e le risposte restano da scrivere.',
      },
      {
        titolo: 'Cosa fa',
        testo:
          'Dopo la visita chiede la recensione a tutti i pazienti, sempre allo stesso modo. E prepara la bozza di risposta a ogni recensione che arriva, pronta da approvare.',
      },
      {
        titolo: 'Come funziona',
        testo:
          'A tutti significa a tutti: nessun filtro su chi è soddisfatto. Filtrare è vietato dalla policy Google e mette a rischio il profilo dello studio. Il canale di feedback diretto viene offerto a tutti, nello stesso messaggio.',
      },
      {
        titolo: 'Cosa ci guadagna',
        testo:
          'Un profilo che si muove ogni settimana invece che ogni sei mesi. E nessuna recensione critica che resta senza risposta per un mese.',
      },
    ],
  },
  {
    sigla: 'M6',
    slug: 'fondi',
    nome: 'Assistente Fondi Sanitari',
    promessa: 'Le pratiche dei fondi arrivano alla segreteria già pronte.',
    stato: 'pronto',
    statoNota: 'Per studi convenzionati in forma diretta',
    metrica: 'Ore di segreteria sulle pratiche',
    ore: '4–8 ore',
    oreNota: 'al mese, negli studi con molti pazienti in convenzione diretta',
    euro: '8,6 milioni',
    euroNota: 'di assicurati dichiarati dal solo UniSalute: il bacino è enorme',
    posts: [
      {
        titolo: 'Il problema',
        testo:
          'Ogni paziente in convenzione diretta significa verificare la copertura, far autorizzare il piano, caricare i documenti di fine cura. È lavoro ripetitivo che nessun software toglie alla segreteria.',
      },
      {
        titolo: 'Cosa fa',
        testo:
          'Quando un paziente dice “ho UniSalute”, il sistema registra il fondo e la forma, e prepara per la segreteria la lista esatta dei documenti che servono per quella pratica.',
      },
      {
        titolo: 'Come funziona',
        testo:
          'La lista dei documenti non la inventa un’intelligenza artificiale: viene da una tabella per ogni fondo. Su una pratica amministrativa un elenco inventato fa saltare l’autorizzazione.',
      },
      {
        titolo: 'Cosa ci guadagna',
        testo:
          'La segretaria non cerca più cosa serve. E nessuno dice mai al paziente che una prestazione è coperta: il sistema blocca il messaggio se lo afferma.',
      },
    ],
  },
]

export const PERDITE = [
  {
    n: '01',
    titolo: 'Le chiamate perse diventano pazienti di un altro dentista',
    testo:
      'Quando la segreteria è occupata, in pausa o lo studio è chiuso, chi cerca un dentista non lascia un messaggio: chiama il numero successivo. Una chiamata persa non compare in nessun report dello studio, ma è un nuovo paziente che si è seduto su un’altra poltrona.',
    valore: 1500,
    prefisso: 'da ',
    suffisso: ' €',
    datoNota: 'il preventivo minimo di un impianto singolo: basta una chiamata senza risposta per perderlo',
  },
  {
    n: '02',
    titolo: 'I preventivi che si sono spenti da soli',
    testo:
      '“Ci penso.” Poi nessuno richiama. Un impianto vale fra 1.500 e 3.000 euro, un piano di ortodonzia fra 3.000 e 6.000. Restano aperti per mesi.',
    valore: 90,
    prefisso: '',
    suffisso: ' giorni',
    datoNota: 'il tempo oltre il quale un preventivo non richiamato non torna quasi mai',
  },
  {
    n: '03',
    titolo: 'I pazienti che dovevano tornare',
    testo:
      'Chi fa igiene ogni sei mesi e sparisce. Chi manca da due anni. Sono già nel gestionale, si sono già fidati una volta, e nessuno li richiama.',
    valore: 120,
    prefisso: 'fino a ',
    suffisso: ' €',
    datoNota: 'una seduta di igiene, più le cure che spesso ne nascono',
  },
  {
    n: '04',
    titolo: 'La poltrona ferma',
    testo:
      'In sanità il no-show europeo si aggira intorno al 19%. Il promemoria lo manda già il gestionale: quello che manca è riempire il posto che si è liberato.',
    valore: 200,
    prefisso: 'fino a ',
    suffisso: ' €',
    datoNota: 'per ogni ora di poltrona ferma, ripetuto ogni settimana',
  },
]

export const PASSI = [
  {
    n: '01',
    titolo: 'Verifica gratuita',
    durata: '30 minuti, zero impegno',
    testo:
      'Chiamo il suo studio tre volte in tre fasce orarie, mando un messaggio su WhatsApp, compilo il form del sito e guardo il profilo Google. Poi le mando una pagina con cosa è successo, con l’ora esatta di ogni prova.',
    dettaglio:
      'Nel report i dati misurati e le stime stanno in due sezioni separate. Se il suo studio ha risposto a tutte e tre le chiamate, c’è scritto quello.',
  },
  {
    n: '02',
    titolo: 'Un modulo solo',
    durata: 'pilota di 3 mesi',
    testo:
      'Il modulo lo decidono i dati della verifica, non le mie preferenze. Tante chiamate perse, si parte dalla segreteria. Molti preventivi fermi, si parte da quelli. Mai più di un modulo al primo giro.',
    dettaglio:
      'Prezzo ridotto per i primi due studi, in cambio del permesso di usare i risultati come caso studio. Disdetta mensile dopo il pilota.',
  },
  {
    n: '03',
    titolo: 'Si misura',
    durata: 'ogni mese, per iscritto',
    testo:
      'Prima e dopo. Quante chiamate hanno ricevuto risposta, quanti preventivi fermi si sono mossi, quanti posti liberati sono stati riempiti. Se il numero non si muove, lo vede anche lei.',
    dettaglio:
      'Il report mensile arriva anche quando i numeri sono brutti. È l’unico modo per capire se il servizio serve davvero.',
  },
]

export const CONFORMITA = [
  {
    titolo: 'AI Act, articolo 50',
    testo:
      'Dal 2 agosto 2026 il paziente deve sapere dal primo istante che sta parlando con un assistente virtuale. Non è un avviso aggiunto dopo: è la prima frase che l’assistente pronuncia.',
  },
  {
    titolo: 'Pubblicità sanitaria, L. 145/2018',
    testo:
      'Le comunicazioni di uno studio possono essere solo informative. Ogni messaggio passa da un controllo automatico che blocca sconti, offerte, urgenze artificiali e promesse di risultato. I testi li approva il direttore sanitario.',
  },
  {
    titolo: 'GDPR e dati sanitari',
    testo:
      'Nomina a responsabile del trattamento con lo studio, elenco dei fornitori con il paese in cui trattano i dati, nessun dato clinico dentro i messaggi, tempi di conservazione concordati per iscritto.',
  },
  {
    titolo: 'Policy Google sulle recensioni',
    testo:
      'La richiesta di recensione va a tutti i pazienti, senza filtri sulla soddisfazione. Filtrare è vietato e dal 2026 viene sanzionato: il rischio ricadrebbe sul profilo dello studio, non sul nostro.',
  },
]

export const FAQ = [
  {
    d: 'Funziona con il mio gestionale?',
    r: 'Dipende, e glielo dico prima di venderle qualcosa. Due dei moduli non hanno bisogno di toccare il gestionale e partono su qualsiasi studio. Gli altri due hanno bisogno di leggere l’agenda o lo storico visite: se il suo gestionale non lo permette, si usa un export settimanale, oppure non glieli propongo.',
  },
  {
    d: 'I dati dei miei pazienti dove finiscono?',
    r: 'Il sistema gira su un server in Europa. Nei messaggi non transita nessun dato clinico. Per il modulo vocale la filiera tecnica comprende fornitori statunitensi: glielo scrivo nel contratto invece di dirle che è tutto europeo, perché non sarebbe vero.',
  },
  {
    d: 'Quanto costa?',
    r: 'Setup una tantum più un canone mensile per sede, che parte da poche centinaia di euro e dipende dal modulo. Il prezzo esatto glielo dico dopo la verifica gratuita, perché prima non so quale modulo le serve.',
  },
  {
    d: 'Quanto ci vuole a partire?',
    r: 'I moduli che non toccano il gestionale vanno in funzione in una o due settimane. Quelli che leggono l’agenda dipendono da quanto è aperto il suo gestionale, e si scopre durante la verifica.',
  },
  {
    d: 'Chi risponde se qualcosa si rompe?',
    r: 'Io. Ogni automazione ha un controllo automatico che mi avvisa quando un passaggio fallisce, prima che se ne accorga lei. I tempi di intervento sono scritti nel contratto, non lasciati al buon senso.',
  },
  {
    d: 'Avete altri studi come referenza?',
    r: 'No, non ancora. Sto cercando i primi due studi pilota, ed è per questo che il prezzo è ridotto e che le mostro i sistemi che funzionano dal vivo invece di raccontarle risultati altrui.',
  },
]
