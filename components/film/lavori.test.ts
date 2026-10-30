// npm test  (node --test "components/film/*.test.ts")  ·  bacheca dei lavori (Compito 10, spec §10, D3, D8, R7)
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { LAVORI, lavoriDi, pubblicabile } from './dati/lavori.ts'
import type { Lavoro } from './dati/lavori.ts'

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
