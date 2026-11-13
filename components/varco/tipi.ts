// Tipi condivisi del mondo "Il varco" (piano-costruzione-v2.md, «I tipi e il Kit»).
// Modulo puro: solo TypeScript "cancellabile" (Node toglie i tipi), niente enum, namespace o parametri-proprietà.
export type Materia = 'polvere' | 'vetro' | 'saette' | 'cromo'
export type Vec2 = [number, number] // coordinate del QUADRO: 0..1 da sinistra e dall'alto; fuori da 0..1 = prolungamento
export type Livello = 'alto' | 'medio' | 'minimo'
export type Immagine = `${'atlas' | 'janus' | 'prometheus' | 'hermes'}-${1 | 2 | 3}`
export type TipoBattuta = 'frase' | 'nome' | 'motto' | 'etichetta' | 'link' | 'passo' | 'cartolina' | 'scorri' | 'pulsante' | 'titolo' | 'paragrafo' | 'foto' | 'h1' | 'blocco' | 'riga' | 'vignetta' | 'scorciatoie'
/** Pagine dei servizi (spec pagine §8.6): il gesto che la mascotte fa quando la battuta compare; `lato` = il braccio che agisce */
export type GestoPagina = { nome: 'prendi' | 'solleva' | 'modella' | 'presenta' | 'lancia' | 'salta'; lato?: 'destro' | 'sinistro'; tieni?: boolean }
/** da, a in schermate dall'inizio del percorso; ruolo = chiave unica dentro il blocco, letta dalla regia */
/** un link sotto una voce del film (Automazioni: «Come funziona», «Chiedi un preventivo»); richiesta = testo già scritto nel modulo */
/** home (13/11): nelle scorciatoie dei servizi ogni azione ha anche il numero, la materia e una riga che dice cosa si ottiene */
export type Azione = { testo: string; href: string; richiesta?: string; num?: string; materia?: Materia; nota?: string }
export type Battuta = { tipo: TipoBattuta; testo: string; ruolo: string; da: number; a: number; accento?: string; href?: string; nota?: string; src?: string; gesto?: GestoPagina; azioni?: Azione[]; /** la vignetta disegnata (Automazioni v3): quale */ vignetta?: string; /** apertura a tempo (13/11): la battuta compare da sola, questi secondi dopo la nascita del vortice */ dopo?: number }
/** invito = l'invito all'azione dentro il cerchio, subito dopo il nome; chi = a chi ci rivolgiamo, con le scorciatoie ai servizi (13/11) */
/** mascotte = un servizio della home (titolo, mascotte, paragrafo); squadra = le quattro mascotte che si riuniscono; intro = un titolo di sezione */
export type TipoBlocco = 'apertura' | 'soglia' | 'tratto' | 'finale' | 'servizio' | 'passi' | 'mascotte' | 'squadra' | 'intro' | 'pagina' | 'invito' | 'chi'
export type Blocco = {
  id: string; tipo: TipoBlocco; da: number; a: number; etichetta: string
  materia?: Materia; immagini?: Immagine[]; uscita?: 'entra' | 'accanto'
  sfuma?: Partial<Record<Immagine, { alto?: number; basso?: number }>> // zone da sfumare oltre ai bordi (storyboard 5.4)
  battute: Battuta[]
  /** D50: parole che galleggiano nella scena (la soglia: le cose del «resto», ognuna della sua materia) */
  parole?: { testo: string; materia: Materia }[]
}
export type Percorso = { lunghezza: number; blocchi: Blocco[] }
/** stato del soggetto del blocco: composto = particelle raccolte (0 sparse), forma 0..2 = problema→creatura→beneficio, foto = opacità delle tre foto, uscita = 0..1 dentro la finestra d'uscita */
export type Fasi = { locale: number; composto: number; forma: number; foto: [number, number, number]; uscita: number }
/** t di ogni battuta di un blocco, per ruolo, già limitati a 0..1 (0 prima della finestra, 1 dopo); lo riesporta kit.ts */
export type Tempi = Record<string, number>
