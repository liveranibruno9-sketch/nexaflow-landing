// npm test  ·  spazi del varco: dove sta il quadro sullo schermo (piano-costruzione-v2, compito 1)
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { impagina, sosta } from './impagina.ts'

test('impagina', () => {
  const t = impagina(390 / 844, 844); assert.ok(t.ritratto); assert.ok(Math.abs(t.altezza - 0.8872) < 1e-3); assert.equal(t.cy, 0.37)
  assert.deepEqual(impagina(16 / 9, 900).fascia, { x0: 0.06, x1: 0.4, y0: 0.25, y1: 0.75 })
  assert.equal(impagina(844 / 390, 390).fascia.y1, 0.8)
  assert.ok(Math.abs(sosta(impagina(16 / 9, 900), 50) - 3.971) < 1e-3)
})

test('impagina: telefono dritto, computer, telefono in orizzontale', () => {
  const dritto = impagina(390 / 844, 844)
  assert.equal(dritto.cx, 0.5); assert.deepEqual(dritto.fascia, { x0: 0.06, x1: 0.94, y0: 0.64, y1: 0.84 })
  const pc = impagina(16 / 9, 900)
  assert.equal(pc.ritratto, false); assert.equal(pc.altezza, 1.08); assert.equal(pc.cx, 0.66); assert.equal(pc.cy, 0.5)
  const basso = impagina(844 / 390, 390)
  assert.equal(basso.altezza, 1.0); assert.equal(basso.fascia.y0, 0.14); assert.equal(basso.ritratto, false)
  const bassoPc = impagina(1280 / 600, 600)                      // 1280x600 non è "basso" (altezza >= 500): resta il computer
  assert.equal(bassoPc.altezza, 1.08)
})

test("sosta: la distanza a cui il quadro riempie l'altezza voluta; più alto il quadro, più lontano", () => {
  const imp = impagina(16 / 9, 900)
  assert.ok(sosta(imp, 50, 4) > sosta(imp, 50, 2))
  assert.ok(sosta(impagina(390 / 844, 844), 50) > 0)
  assert.ok(Math.abs(sosta(imp, 50, 8) - 2 * sosta(imp, 50, 4)) < 1e-9)
})
