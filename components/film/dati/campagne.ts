// Campagne · Hermes · cromo. Testi copiati lettera per lettera da testi.md §4.4; `accento` = il grassetto.
// Stessa struttura e stesso tono delle altre tre pagine (R8): nessuna etichetta di prova o di attesa.
import type { Regia } from '../regia.ts'
import { paginaServizio } from './servizio.ts'

export const CAMPAGNE: Regia = paginaServizio({
  etichetta: 'Campagne',
  nome: 'Hermes',
  motto: 'Porto da te chi ancora non ti conosce.',
  file: 'hermes',
  materia: 'cromo',
  frasi: [
    ['Pubblicità su Instagram, Facebook e Google.'],
    ['Per le persone giuste, vicine o lontane.'],
    ['Prima un obiettivo chiaro: tavoli pieni, camere occupate, nuove richieste.', 'chiaro'],
    ['Testi e immagini fatti per te.'],
    ['Ogni settimana guardiamo cosa funziona e spostiamo lì il budget.'],
    ['Alla fine sai quanto ti è costato ogni nuovo contatto.', 'contatto'],
    ['Il budget lo paghi a Meta e a Google, sul tuo account.'],
    ['Sempre sotto i tuoi occhi.'],
  ],
  passo3: { etichetta: '03 · Partenza', testo: 'La campagna parte e ricevi il resoconto, con i numeri veri.' },
})
