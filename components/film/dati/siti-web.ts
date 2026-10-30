// Siti web · Janus · vetro. Testi copiati lettera per lettera da testi.md §4.2; `accento` = il grassetto.
import type { Regia } from '../regia.ts'
import { paginaServizio } from './servizio.ts'

export const SITI_WEB: Regia = paginaServizio({
  etichetta: 'Siti web',
  nome: 'Janus',
  motto: 'Chi ti cerca, trova me.',
  file: 'janus',
  materia: 'vetro',
  frasi: [
    ["Un sito all'altezza di quello che fai.", 'fai'],
    ['Si apre come un film, dal primo scroll.'],
    ['Bello dal telefono, prima che dal computer.'],
    ['Fatto per farti trovare su Google.'],
    ['Un tocco per chiamarti, scriverti o arrivare da te.'],
    ['Richieste e prenotazioni arrivano da sole, in ordine.'],
    ['In italiano e, se serve, in inglese.'],
    ['Sito, dominio e account intestati a te.', 'te'],
    ['Chi arriva capisce. Chi capisce prenota.', 'prenota'],
  ],
  passo3: { etichetta: '03 · Online', testo: 'Il sito va online e ti spieghiamo tutto. È tuo.' },
})
