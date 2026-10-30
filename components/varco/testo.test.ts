// npm test  ·  testo del varco: posizione della parola d'accento (spostata dal vecchio motore del film, corpo e test identici)
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { posizioneAccento } from './testo.ts'

test('posizioneAccento: parola intera, non un pezzo di un\'altra parola', () => {
  assert.equal(posizioneAccento('Sito, dominio e account intestati a te.', 'te'), 36)
  assert.equal(posizioneAccento('Un sito all\'altezza di quello che fai.', 'fai'), 34)
  assert.equal(posizioneAccento('Troverà te, o un altro.', 'un altro'), 14)
  assert.equal(posizioneAccento('Tu dici sì. Pubblicato.', 'Pubblicato'), 12)
  assert.equal(posizioneAccento('La prossima può essere la tua.', 'la tua'), 23)
  assert.equal(posizioneAccento('niente di tutto questo', 'te'), -1)
  assert.equal(posizioneAccento('qualcosa', undefined), -1)
})
