// Tipi condivisi del mondo "Il varco" (piano-costruzione-v2.md, «I tipi e il Kit»).
// Modulo puro: solo TypeScript "cancellabile" (Node toglie i tipi), niente enum, namespace o parametri-proprietà.
export type Materia = 'polvere' | 'vetro' | 'saette' | 'cromo'
export type Vec2 = [number, number] // coordinate del QUADRO: 0..1 da sinistra e dall'alto; fuori da 0..1 = prolungamento
export type Livello = 'alto' | 'medio' | 'minimo'
export type Immagine = `${'atlas' | 'janus' | 'prometheus' | 'hermes'}-${1 | 2 | 3}`
export type TipoBattuta = 'frase' | 'nome' | 'motto' | 'etichetta' | 'link' | 'passo' | 'cartolina' | 'scorri' | 'pulsante'
/** da, a in schermate dall'inizio del percorso; ruolo = chiave unica dentro il blocco, letta dalla regia */
export type Battuta = { tipo: TipoBattuta; testo: string; ruolo: string; da: number; a: number; accento?: string; href?: string; nota?: string }
export type TipoBlocco = 'apertura' | 'soglia' | 'tratto' | 'finale' | 'servizio' | 'passi'
export type Blocco = {
  id: string; tipo: TipoBlocco; da: number; a: number; etichetta: string
  materia?: Materia; immagini?: Immagine[]; uscita?: 'entra' | 'accanto'
  sfuma?: Partial<Record<Immagine, { alto?: number; basso?: number }>> // zone da sfumare oltre ai bordi (storyboard 5.4)
  battute: Battuta[]
}
export type Percorso = { lunghezza: number; blocchi: Blocco[] }
/** stato del soggetto del blocco: composto = particelle raccolte (0 sparse), forma 0..2 = problema→creatura→beneficio, foto = opacità delle tre foto, uscita = 0..1 dentro la finestra d'uscita */
export type Fasi = { locale: number; composto: number; forma: number; foto: [number, number, number]; uscita: number }
/** t di ogni battuta di un blocco, per ruolo, già limitati a 0..1 (0 prima della finestra, 1 dopo); lo riesporta kit.ts */
export type Tempi = Record<string, number>
