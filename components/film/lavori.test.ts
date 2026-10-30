// npm test  (node --test "components/film/*.test.ts")  ·  bacheca dei lavori (Compito 10, spec §10, D3, D8, R7)
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { LAVORI, lavoriDi, pubblicabile } from './dati/lavori.ts'
import type { Lavoro } from './dati/lavori.ts'
import type { Regia } from './regia.ts'
import { HOME } from './dati/home.ts'
import { AUTOMAZIONI } from './dati/automazioni.ts'
import { SITI_WEB } from './dati/siti-web.ts'
import { CONTENUTI } from './dati/contenuti.ts'
import { CAMPAGNE } from './dati/campagne.ts'

const base: Lavoro = {
  slug: 'prova',
  nome: 'Lavoro di prova',
  servizi: ['siti-web'],
  tipo: 'cliente',
  problema: 'Un problema.',
  fatto: ['Uno', 'Due', 'Tre'],
  prodotto: {},
}

test('pubblicabile: un lavoro cliente senza permesso non va online (D3)', () => {
  assert.equal(pubblicabile({ ...base, tipo: 'cliente' }), false)
  assert.equal(pubblicabile({ ...base, tipo: 'cliente', permesso: { di: 'Mario Rossi', data: '2026-11-02' } }), true)
})

test('pubblicabile: dimostrativo e interno non hanno bisogno di permesso', () => {
  assert.equal(pubblicabile({ ...base, tipo: 'dimostrativo' }), true)
  assert.equal(pubblicabile({ ...base, tipo: 'interno' }), true)
})

test('bacheca vuota al lancio (R7): LAVORI è vuoto e nessun servizio ha lavori', () => {
  assert.equal(LAVORI.length, 0)
  for (const s of ['automazioni', 'siti-web', 'contenuti', 'campagne'] as const) assert.deepEqual(lavoriDi(s), [])
})

test('lavoriDi: solo i lavori pubblicabili di quel servizio', () => {
  // LAVORI è un array mutabile solo qui, nel test: lo si riempie e lo si svuota di nuovo
  const ok: Lavoro = { ...base, slug: 'a', tipo: 'dimostrativo', servizi: ['siti-web', 'contenuti'] }
  const senzaPermesso: Lavoro = { ...base, slug: 'b', tipo: 'cliente', servizi: ['siti-web'] }
  const altro: Lavoro = { ...base, slug: 'c', tipo: 'interno', servizi: ['campagne'] }
  LAVORI.push(ok, senzaPermesso, altro)
  try {
    assert.deepEqual(lavoriDi('siti-web').map((l) => l.slug), ['a'])
    assert.deepEqual(lavoriDi('contenuti').map((l) => l.slug), ['a'])
    assert.deepEqual(lavoriDi('campagne').map((l) => l.slug), ['c'])
    assert.deepEqual(lavoriDi('automazioni'), [])
  } finally {
    LAVORI.length = 0
  }
  assert.equal(LAVORI.length, 0)
})

// parola intera: "Come lavoriamo" (atto 02) contiene la stringa "lavori" ma non è l'atto Lavori.
// Costruita con String.fromCharCode: nessun escape nel sorgente, così nessun editor o strumento lo altera (un "backspace" al posto di b-anchor la rendeva vacua).
const BARRA = String.fromCharCode(92)   // il carattere backslash, senza scriverlo nel sorgente
const PAROLA_LAVORI = new RegExp(BARRA + 'blavori' + BARRA + 'b', 'i')

/** i punti della regia dove compare la parola "lavori": id, nome ed etichetta di ogni atto, testo di ogni battuta, ogni href */
function trovaLavori(r: Regia): string[] {
  const trovati: string[] = []
  for (const a of r.atti) {
    for (const [campo, valore] of [['id', a.id], ['nome', a.nome], ['etichetta', a.etichetta]] as const) {
      if (PAROLA_LAVORI.test(valore)) trovati.push(`atto ${a.id}: ${campo} "${valore}"`)
    }
    for (const b of a.battute) {
      if (PAROLA_LAVORI.test(b.testo)) trovati.push(`atto ${a.id}: battuta "${b.testo}"`)
      if (b.href !== undefined && /lavori/i.test(b.href)) trovati.push(`atto ${a.id}: href "${b.href}"`)
    }
  }
  if (r.pulsante && /lavori/i.test(r.pulsante.href)) trovati.push(`pulsante: href "${r.pulsante.href}"`)
  if (JSON.stringify(r).includes('/lavori')) trovati.push('collegamento a /lavori')
  return trovati
}

test('la guardia R7 scatta davvero: coglie un atto Lavori e non "Come lavoriamo"', () => {
  const atto = (etichetta: string, testo = 'Ciao.'): Regia['atti'][number] =>
    ({ id: 'x', nome: 'X', etichetta, da: 0, a: 1, battute: [{ tipo: 'frase', testo, da: 0, a: 1 }] })
  const regia = (atti: Regia['atti']): Regia => ({ T: 1, scene: [], atti })
  assert.deepEqual(trovaLavori(regia([atto('02 · Come lavoriamo')])), [])
  assert.equal(trovaLavori(regia([atto('03 · Lavori')])).length, 1)
  assert.equal(trovaLavori(regia([atto('03 · altro', 'Guarda i nostri lavori')])).length, 1)
  assert.equal(trovaLavori(regia([{ ...atto('03 · altro'), id: 'lavori' }])).length, 1)
})

test('nessuna regia ha un atto Lavori finché la bacheca è vuota (R7)', () => {
  assert.equal(LAVORI.length, 0)
  const regie = { HOME, AUTOMAZIONI, SITI_WEB, CONTENUTI, CAMPAGNE }
  for (const [nome, r] of Object.entries(regie)) assert.deepEqual(trovaLavori(r), [], `${nome}: compare "lavori"`)
})
