// npm test  ·  testo del varco: posizione della parola d'accento (spostata dal vecchio motore del film, corpo e test identici)
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { curvaTocco, posizioneAccento } from './testo.ts'

test('posizioneAccento: parola intera, non un pezzo di un\'altra parola', () => {
  assert.equal(posizioneAccento('Sito, dominio e account intestati a te.', 'te'), 36)
  assert.equal(posizioneAccento('Un sito all\'altezza di quello che fai.', 'fai'), 34)
  assert.equal(posizioneAccento('Troverà te, o un altro.', 'un altro'), 14)
  assert.equal(posizioneAccento('Tu dici sì. Pubblicato.', 'Pubblicato'), 12)
  assert.equal(posizioneAccento('La prossima può essere la tua.', 'la tua'), 23)
  assert.equal(posizioneAccento('niente di tutto questo', 'te'), -1)
  assert.equal(posizioneAccento('qualcosa', undefined), -1)
})

test('curvaTocco: parte da `da`, arriva ad `a`, nel mezzo sale sopra la retta', () => {
  assert.deepEqual(curvaTocco(0, [0, 0], [100, 0]), [0, 0])
  assert.deepEqual(curvaTocco(1, [0, 0], [100, 0]), [100, 0])
  const m = curvaTocco(0.5, [0, 0], [100, 0])
  assert.ok(m[0] > 0 && m[0] < 100); assert.ok(m[1] < 0, 'la y sta sopra la retta (negativa: sullo schermo si sale)')
  // fuori da 0..1 resta agli estremi; la distanza dalla meta cala sempre
  assert.deepEqual(curvaTocco(-3, [5, 5], [50, 80]), [5, 5]); assert.deepEqual(curvaTocco(4, [5, 5], [50, 80]), [50, 80])
  let prima = Infinity
  for (let i = 0; i <= 20; i++) { const [x, y] = curvaTocco(i / 20, [10, 200], [300, 40]); const d = Math.hypot(300 - x, 40 - y); assert.ok(d <= prima + 1e-9, `t = ${i / 20}`); prima = d }
})
