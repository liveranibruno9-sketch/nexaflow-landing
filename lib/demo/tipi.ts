// Forme dei dati che i workflow n8n "DEMO Studio - <modulo>" restituiscono alle pagine /demo.
// Sorgente di verità: vault 20-projects/agenzia-ai-dentale/demo/studio/js/<modulo>.js

export type ModuloDemo = 'm1' | 'm2' | 'm3' | 'm5' | 'm6'

export type Messaggio = {
  id: string
  nome: string
  verso: 'out' | 'in'
  testo: string
  giorno: string
  etichetta: string | null
  pazienteId?: string | null
  preventivoId?: string
  rigaId?: string
  visitaId?: string
}

export type StatoBase = {
  versione: 1
  giorno: string
  lavorazione: string | null
  lavorazioneDal: number | null
  errore: string | null
  messaggi: Messaggio[]
}

export type RispostaDemo<S> = {
  ok: boolean
  stato?: S
  errore?: string
  bloccato?: boolean
  serveMappatura?: { colonne: string[]; mancanti: string[] }
}

// ---------- 01 Preventivi ----------
export type Preventivo = {
  id: string
  pazienteId: string | null
  nome: string
  nomeBreve: string
  telefono: string
  piano: string
  importo: number
  consegna: string
  stato: 'aperto' | 'accettato' | 'rifiutato' | 'risposto'
  consenso: boolean
  passo: number
  testi: string[]
  confermatoIl: string
  pausa: boolean
  prossimoInvio: string | null
  prossimaEtichetta: string | null
}
export type Avviso = { id: string; tipo: 'richiamare' | 'confermare'; preventivoId: string; testo: string }
export type StatoM1 = StatoBase & {
  preventivi: Preventivo[]
  avvisi: Avviso[]
  riepilogo: { inviati: number; valoreInSequenza: number; silenzi: { id: string; nome: string; motivo: string }[] }
}

// ---------- 02 Chiamate ----------
export type Chiamata = {
  id: string
  ora: string
  nome: string
  numero: string
  motivo: string
  urgenza: 'alta' | 'normale'
  richiamato: boolean
  trascrizione: { chi: 'assistente' | 'paziente'; testo: string }[]
}
export type StatoM2 = StatoBase & { chiamate: Chiamata[]; daRichiamare: number; urgenti: number }

// ---------- 03 Riattivazione ----------
export type RigaExport = {
  id: string
  nome: string
  nomeCompleto: string
  telefono: string
  ultimaVisita: string | null
  prossimoAppuntamento: string | null
  consenso: boolean
  fascia: 'f12_18' | 'f18_36' | 'oltre36'
  mesiAssenza: number
}
export type StatoM3 = StatoBase & {
  export: { nome: string; righe: number; senzaConsenso: boolean } | null
  colonneFile: string[] | null
  mancanti: string[] | null
  pazienti: RigaExport[]
  daRiattivare: string[]
  esclusi: { id: string; nome: string; motivo: string }[]
  modelli: Record<string, string> | null
  risposte: { id: string; nome: string; telefono: string; risposta: 'fissare' | 'no' }[]
  conteggi: { totale: number; daRiattivare: number; esclusi: number; perMotivo: Record<string, number> }
  senzaColonnaConsenso: boolean
}

// ---------- 04 Recensioni ----------
export type Visita = { id: string; pazienteId: string; nome: string; ora: string; invitato: boolean }
export type Recensione = {
  id: string
  stelle: number
  autore: string
  giorno: string
  testo: string
  bozza: string
  approvata: boolean
  problemi: string[]
}
export type StatoM5 = StatoBase & {
  invito: string
  visite: Visita[]
  recensioni: Recensione[]
  daInvitare: number
  daApprovare: number
}

// ---------- 05 Fondi ----------
export type PazienteFondo = { id: string; nome: string; nomeBreve: string; fondo: string | null; forma: string | null; consenso: boolean }
export type Pratica = {
  id: string
  pazienteId: string
  nome: string
  fondo: string
  forma: 'diretta' | 'indiretta'
  giorno: string
  documenti: string[]
  esclusa: string | null
  note: string | null
  portale: string | null
  preautorizzazione: boolean
}
export type StatoM6 = StatoBase & {
  elencoPazienti: PazienteFondo[]
  fondi: string[]
  pratiche: Pratica[]
  campagna: { pazienteId: string; nome: string; fondo: string; testo: string; bloccato: string[] }[]
  destinatariCampagna: number
}
