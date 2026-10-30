// Automazioni · Atlas · polvere di stelle. Testi copiati lettera per lettera da testi.md §4.1; `accento` = il grassetto.
import type { Regia } from '../regia.ts'
import { paginaServizio } from './servizio.ts'

export const AUTOMAZIONI: Regia = paginaServizio({
  etichetta: 'Automazioni',
  nome: 'Atlas',
  motto: 'Il peso lo porto io.',
  file: 'atlas',
  materia: 'polvere',
  frasi: [
    ['Risponde ai messaggi e alle chiamate perse, anche di notte.'],
    ['Raccoglie la richiesta e te la lascia in ordine.', 'in ordine'],
    ['Ricontatta chi ha chiesto un preventivo e poi è sparito.'],
    ['Chiede una recensione a ogni cliente, dopo la visita.'],
    ['Ti avvisa sul telefono solo quando serve una persona.'],
    ['Si presenta sempre come assistente virtuale. Niente trucchi.'],
    ['Tu smetti di rincorrere i messaggi.'],
    ['E nessun cliente resta senza risposta.', 'senza risposta'],
  ],
  passo3: { etichetta: '03 · Avvio', testo: "L'automazione parte e la seguiamo da vicino nelle prime settimane." },
  // la cartolina in più (spec §7): collegamento semplice a un'altra area del sito, mai next/link. Entra a 7,6 e resta
  // accesa fino in fondo come il pulsante (con a = 9 sfumerebbe proprio alla fine del film, quando va raggiunta)
  extra: [
    { tipo: 'cartolina', testo: 'Settore specializzato: studi dentistici', nota: 'Per gli studi dentistici abbiamo un percorso dedicato.', href: '/studi-dentistici', da: 7.6, a: Infinity },
  ],
})
