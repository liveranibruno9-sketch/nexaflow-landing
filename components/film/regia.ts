// Tipi e funzioni della regia del film (nessun accesso al DOM): si provano con `npm test`.
// Solo TypeScript "cancellabile" (Node toglie i tipi): niente enum, namespace o parametri-proprietà.
import { liscio, sfuma } from './calcoli.ts'

export type Materia = 'polvere' | 'vetro' | 'saette' | 'cromo'
/** nome = base del file in /film/scene, oppure 'studio' (nero + luce, disegnato in codice) */
export type Scena = { nome: string; da: number; a: number; zoom?: [number, number] }
/** fotogrammi 0..n-1 su [da, a], poi fermo sull'ultimo (home: { pieno: 96, leggero: 64, minimo: 32 }, da 0, a 2) */
export type Apertura = { conteggio: Record<'pieno' | 'leggero' | 'minimo', number>; da: number; a: number }
export type TipoBattuta = 'frase' | 'etichetta' | 'nome' | 'motto' | 'link' | 'passo' | 'cartolina' | 'scorri'
export type Battuta = { tipo: TipoBattuta; testo: string; accento?: string; da: number; a: number; href?: string; nota?: string; s?: number }
/** x, y, w, h in frazioni del fotogramma X-2 */
export type Creatura = { nome: string; da: number; a: number; ritaglio: [number, number, number, number] }
export type Atto = { id: string; nome: string; etichetta: string; materia?: Materia; da: number; a: number; battute: Battuta[]; creatura?: Creatura }
export type Regia = { T: number; apertura?: Apertura; scene: Scena[]; atti: Atto[]; convergenza?: [number, number]; pulsante?: { da: number; testo: string; href: string; sotto: string } }

const AGENTI = ['atlas', 'janus', 'prometheus', 'hermes']

/**
 * Nomi di scena ammessi. 'apertura' NON è un file immagine: si disegna dalla sequenza
 * di fotogrammi d'apertura (Apertura / fotogrammaApertura); sta qui perché la regia la nomina.
 */
export const SCENE_NOTE: readonly string[] = [
  'studio',
  'apertura',
  ...AGENTI.flatMap((x) => [`${x}-1`, `${x}-2`, `${x}-3`]),
]

/**
 * a = scena corrente, b = quella in arrivo, t = quota di b (0..1).
 * Le scene sono in ordine di `da`. Se la scena che ha appena cominciato si sovrappone alla precedente
 * (da < a della precedente) la sovrapposizione è la dissolvenza: t = liscio sull'intervallo comune.
 * Se i confini coincidono (da successiva == a precedente) è uno scatto netto: a passa alla successiva, t = 0.
 * Dopo l'ultima scena resta ferma sull'ultima; prima della prima non c'è nessuna scena.
 */
export function sceneAttive(scene: Scena[], u: number): { a?: Scena; b?: Scena; t: number } {
  let i = -1
  for (let k = 0; k < scene.length; k++) if (scene[k].da <= u) i = k
  if (i < 0) return { a: undefined, b: undefined, t: 0 }
  const corrente = scene[i]
  const prima = i > 0 ? scene[i - 1] : undefined
  if (prima && u < prima.a) return { a: prima, b: corrente, t: liscio(corrente.da, prima.a, u) }
  return { a: corrente, b: undefined, t: 0 }
}

/** l'ultimo atto con da <= u; -1 prima del primo */
export function indiceAtto(atti: Atto[], u: number): number {
  let i = -1
  for (let k = 0; k < atti.length; k++) if (atti[k].da <= u) i = k
  return i
}

/** opacità di una battuta: sfuma con s (di default 0,18) dentro la finestra [da, a] */
export function opacita(b: { da: number; a: number; s?: number }, u: number): number {
  return sfuma(u, b.da, b.a, b.s ?? 0.18)
}

/** 1 senza zoom; liscio fra zoom[0] e zoom[1] su [da, a], poi fermo su zoom[1] */
export function zoomScena(s: Scena, u: number): number {
  if (!s.zoom) return 1
  return s.zoom[0] + (s.zoom[1] - s.zoom[0]) * liscio(s.da, s.a, u)
}

/** posizione frazionaria 0..n-1 (lineare su [da, a]), ferma su n-1 dopo ap.a e su 0 prima di ap.da */
export function fotogrammaApertura(ap: Apertura, modo: 'pieno' | 'leggero' | 'minimo', u: number): number {
  const n = ap.conteggio[modo]
  if (!(n > 1)) return 0
  if (!(ap.a > ap.da)) return u >= ap.a ? n - 1 : 0
  const q = Math.min(1, Math.max(0, (u - ap.da) / (ap.a - ap.da)))
  return (n - 1) * q
}

/**
 * Controlla la regia; ritorna l'elenco degli errori (vuoto = a posto).
 * Ammessi: scene che arrivano fino a T esatto, sovrapposizioni fra scene, atti con lo stesso `da`.
 */
export function valida(r: Regia): string[] {
  const errori: string[] = []
  const ok = (da: number, a: number) => a > da // false anche con NaN
  r.scene.forEach((s, i) => {
    const e = `scena ${i} (${s.nome})`
    if (!ok(s.da, s.a)) errori.push(`${e}: a (${s.a}) non è dopo da (${s.da})`)
    if (!(s.da >= 0 && s.a <= r.T)) errori.push(`${e}: fuori da [0, ${r.T}]`)
    if (!SCENE_NOTE.includes(s.nome)) errori.push(`${e}: nome non in SCENE_NOTE`)
  })
  if (r.apertura && !ok(r.apertura.da, r.apertura.a)) errori.push('apertura: a non è dopo da')
  r.atti.forEach((at, i) => {
    if (i > 0 && !(at.da >= r.atti[i - 1].da)) errori.push(`atto ${at.id}: da (${at.da}) prima dell'atto precedente (${r.atti[i - 1].da})`)
    at.battute.forEach((b, j) => {
      if (!ok(b.da, b.a)) errori.push(`atto ${at.id}, battuta ${j}: a (${b.a}) non è dopo da (${b.da})`)
    })
  })
  return errori
}
