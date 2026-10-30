// npm test  (node --test "components/film/*.test.ts")
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { letteraVisibile, limiteParticelle } from './materia-calcoli.ts'

test('letteraVisibile', () => {
  assert.equal(letteraVisibile(13, 0), 0)
  assert.equal(letteraVisibile(13, 1), 13)
  // monotona su 50 passi, sempre un intero fra 0 e n
  let prima = 0
  for (let i = 0; i <= 50; i++) {
    const k = letteraVisibile(13, i / 50)
    assert.ok(Number.isInteger(k), `intero a t = ${i / 50}`)
    assert.ok(k >= prima, `monotona a t = ${i / 50}`)
    assert.ok(k >= 0 && k <= 13)
    prima = k
  }
  // fuori da [0, 1] e con valori strani resta nei limiti
  assert.equal(letteraVisibile(13, -2), 0)
  assert.equal(letteraVisibile(13, 5), 13)
  assert.equal(letteraVisibile(13, NaN), 0)
  assert.equal(letteraVisibile(0, 0.5), 0)
  // la prima lettera compare appena la scrittura comincia
  assert.equal(letteraVisibile(13, 0.01), 1)
})

test('limiteParticelle: un tetto per livello', () => {
  assert.equal(limiteParticelle('alto'), 900)
  assert.equal(limiteParticelle('medio'), 400)
  assert.equal(limiteParticelle('minimo'), 150)
})
