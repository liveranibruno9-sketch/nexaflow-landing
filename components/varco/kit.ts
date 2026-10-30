// Il Kit: il vocabolario degli strati vivi che una regia può chiamare (piano-costruzione-v2, «I tipi e il Kit»). Solo tipi.
// Lo implementano mondo/strati.ts (Three.js) e kit-finto.ts (per i test).
// Modo immediato: a ogni fotogramma la regia chiama gli strati che vuole vedere; uno strato non chiamato si spegne.
// Così tutto dipende solo da `t` e tornando indietro si riavvolge. Unica eccezione: `pulsa` (a tempo, una volta per passaggio).
import type { Fasi, Materia, Tempi, Vec2 } from './tipi.ts'

export type { Tempi }
export type Colore = Materia | 'luce' | 'blu' | 'perla'

export type Kit = {
  /** particelle da `da` verso `verso` ('camera' = verso chi guarda); n = % del budget getti del livello; t 0..1 = avanzamento */
  getto(id: string, o: { da: Vec2; verso: Vec2 | 'camera'; colore: Colore; n: number; gravita?: number; ampiezza?: number }, t: number): void
  /** alone in un punto; raggio in larghezze del quadro; intensità 0..1, mai sopra 0,85 */
  luce(id: string, o: { a: Vec2; raggio: number; colore: Colore }, intensita: number): void
  /** n punti in orbita; accese = quante hanno preso il colore (frazionario); ordine 0 sparsi → 1 anello regolare */
  orbita(id: string, o: { centro: Vec2; raggio: Vec2; n: number; colore: Colore }, s: { accese: number; ordine: number; velocita: number; alfa: number }): void
  /** galassia a spirale in codice (ricetta GALASSIA_VERT dei dentisti) */
  galassia(id: string, o: { centro: Vec2; raggio: number; bracci: number }, s: { alfa: number; giro: number }): void
  /** spezzata che si disegna fino a t; gocce = particelle che la percorrono; segni = punti accesi ai vertici */
  linea(id: string, o: { punti: Vec2[]; colore: Colore; spessore: number; gocce?: number; segni?: boolean }, t: number): void
  /** fulmine ramificato fra due punti; t 0 spento → 1 pieno. Il riquadro da-a non supera 0,5 x 0,5 del quadro */
  saetta(id: string, o: { da: Vec2; a: Vec2; rami?: number }, t: number): void
  /** anello che si propaga (tocco sul vetro, onda sul pavimento) */
  onda(id: string, o: { a: Vec2; raggio: number; colore: Colore }, t: number): void
  /** raggi di luce a ventaglio (pavimento di Janus) */
  raggi(id: string, o: { da: Vec2; verso: Vec2; apertura: number; n: number; colore: Colore }, t: number): void
  /** due battiti, a tempo: partono quando t supera 0,5 andando avanti; si riarmano quando t torna a 0 */
  pulsa(id: string, o: { a: Vec2; raggio: number; colore: Colore }, t: number): void
  /** esposizione della foto i (0 buia → 1 piena); se non chiamata vale 1 */
  foto(i: 0 | 1 | 2, s: { esposizione: number }): void
  /** il punto della scena da cui partono le particelle verso la parola d'accento */
  fuoco(a: Vec2): void
  anello: { nome(t: number): void; ritorno(t: number): void; arco(m: Materia, accensione: number): void; giro(velocita: number): void; caldo(t: number): void; punto(t: number): void; apri(t: number): void }
  campo: { accese(quota: number): void; cercatore(t: number): void; fiumi(m: Materia[], t: number): void; vuoto(t: number): void }
}

/** una regia = funzione pura di un blocco: dati i tempi di ogni battuta e le fasi del soggetto, comanda il Kit */
export type Regia = (tempi: Tempi, fasi: Fasi, k: Kit) => void
