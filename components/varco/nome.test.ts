// npm test  ·  il nome dell'apertura una lettera alla volta, il ritorno nel vortice, la consegna in quattro correnti
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { APERTURA, consegna, lucelettera, voloLettere } from './nome.ts'

const N = 12 // «AgentiStudio»

test('prima di scorrere nessuna lettera è partita; a fine tratto sono arrivate tutte', () => {
  assert.ok(voloLettere(0, N).every((p) => p === 0))
  assert.ok(voloLettere(APERTURA.nome[1], N).every((p) => p === 1))
})

test('una lettera alla volta: la prima parte per prima, in ordine, e a metà strada le ultime non sono ancora partite', () => {
  const meta = voloLettere((APERTURA.nome[0] + APERTURA.nome[1]) / 2, N)
  for (let i = 1; i < N; i++) assert.ok(meta[i] <= meta[i - 1], `ordine a ${i}`)
  assert.ok(meta[0] === 1 && meta[N - 1] === 0)
  // mai più di tre lettere in volo insieme
  for (let u = 0; u <= 1; u += 0.01) assert.ok(voloLettere(u, N).filter((p) => p > 0 && p < 1).length <= 3, `u = ${u}`)
})

test('la lettera HTML compare solo quando le scaglie sono quasi arrivate', () => {
  assert.equal(lucelettera(0.5), 0)
  assert.equal(lucelettera(1), 1)
})

test('il nome torna nel vortice, poi il vortice si apre: nell\'ordine', () => {
  assert.ok(voloLettere(1.2, N).every((p) => p === 1), 'pieno prima di sciogliersi')
  assert.ok(voloLettere(APERTURA.scioglie[1], N).every((p) => p === 0), 'tornato nel vortice')
  assert.equal(consegna(1.4), 0)
  assert.ok(consegna(1.85) > 0 && consegna(1.85) < 1)
  assert.equal(consegna(APERTURA.consegna[1]), 1)
})
