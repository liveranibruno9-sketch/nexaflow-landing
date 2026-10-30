// Contenuti · Prometheus · saette. Testi copiati lettera per lettera da testi.md §4.3; `accento` = il grassetto.
import type { Regia } from '../regia.ts'
import { paginaServizio } from './servizio.ts'

export const CONTENUTI: Regia = paginaServizio({
  etichetta: 'Contenuti',
  nome: 'Prometheus',
  motto: "Il bello c'è già. Io lo accendo.",
  file: 'prometheus',
  materia: 'saette',
  frasi: [
    ['Post, caroselli e video brevi sulla tua attività.'],
    ["Raccontata com'è davvero.", 'davvero'],
    ['Un piano chiaro: cosa pubblicare, quando e dove.'],
    ['Ogni settimana i post pronti arrivano sul tuo telefono.'],
    ['Tu li approvi con un tocco.'],
    ['Scriviamo come parli tu.'],
    ['Niente immagini finte spacciate per vere.'],
    ['Chi ti segue ti riconosce. Chi non ti conosce si ferma.', 'ferma'],
  ],
  passo3: { etichetta: '03 · Primi contenuti', testo: 'Ricevi i primi contenuti e li approvi tu, uno per uno.' },
})
