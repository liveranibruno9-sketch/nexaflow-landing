// npm test  ·  livelli di peso del varco (piano-costruzione-v2, compito 2)
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { CONTEGGI, livelloIniziale, livelloDopoMisura, SCELTA_VARCO } from './livello.ts'

test('livelli', () => {
  assert.equal(livelloIniziale({ ritratto: true, larghezza: 390 }), 'medio'); assert.equal(livelloIniziale({ ritratto: false, larghezza: 1440 }), 'alto')
  assert.equal(livelloDopoMisura('medio', Array(120).fill(30)), 'minimo'); assert.equal(livelloDopoMisura('medio', Array(119).fill(30)), 'medio')
  assert.equal(livelloDopoMisura('alto', Array(120).fill(16)), 'alto'); assert.equal(livelloDopoMisura('minimo', Array(120).fill(60)), 'minimo')
})

test('livelloIniziale: un computer con la finestra stretta è già "medio"; il confine è 900', () => {
  assert.equal(livelloIniziale({ ritratto: false, larghezza: 900 }), 'medio'); assert.equal(livelloIniziale({ ritratto: false, larghezza: 901 }), 'alto')
})

test('livelloDopoMisura: usa la mediana, non la media; scende un gradino alla volta', () => {
  const quasiTutti = [...Array(100).fill(16), ...Array(30).fill(200)]        // 130 fotogrammi, mediana 16: qualche scatto isolato non declassa
  assert.equal(livelloDopoMisura('alto', quasiTutti), 'alto')
  assert.equal(livelloDopoMisura('alto', Array(200).fill(40)), 'medio')       // un solo gradino anche con un computer lentissimo
  assert.equal(livelloDopoMisura('alto', Array(120).fill(28)), 'alto')        // 28 ms esatti non basta: serve più di 28
})

test('CONTEGGI: la tabella dei vincoli globali', () => {
  assert.deepEqual(CONTEGGI.alto, { punti: 36000, fiumi: 12000, getti: 1200, parallasse: true, aloni: true, dpr: 2 })
  assert.deepEqual(CONTEGGI.medio, { punti: 12000, fiumi: 4000, getti: 500, parallasse: true, aloni: false, dpr: 1.5 })
  assert.deepEqual(CONTEGGI.minimo, { punti: 6000, fiumi: 1500, getti: 200, parallasse: false, aloni: false, dpr: 1 })
})

test('SCELTA_VARCO', () => {
  assert.doesNotThrow(() => new Function(SCELTA_VARCO))
  for (const s of ['prefers-reduced-motion', 'webgl2', 'swiftshader', "classList.add('varco')", 'varco=forza']) assert.ok(SCELTA_VARCO.includes(s), s)
  assert.ok(!SCELTA_VARCO.includes('palette'))
})

test('SCELTA_VARCO: gira davvero — senza WebGL2 non mette la classe, con ?varco=forza sì', () => {
  const prova = (search: string, gl: boolean, ridotto = false) => {
    const classi = new Set<string>()
    const doc = { documentElement: { classList: { add: (c: string) => classi.add(c) }, setAttribute: () => {} }, createElement: () => ({ getContext: () => (gl ? { getExtension: () => null, getParameter: () => '' } : null) }) }
    const nav = { deviceMemory: 8, hardwareConcurrency: 8, connection: undefined }
    new Function('document', 'location', 'navigator', 'matchMedia', SCELTA_VARCO)(doc, { search }, nav, () => ({ matches: ridotto }))
    return classi.has('varco')
  }
  assert.equal(prova('', true), true)
  assert.equal(prova('', false), false)                                      // niente WebGL2: pagina normale
  assert.equal(prova('', true, true), false)                                 // movimento ridotto: pagina normale
  assert.equal(prova('?varco=forza', true, true), true)                      // la forzatura salta i controlli del movimento ridotto
})
