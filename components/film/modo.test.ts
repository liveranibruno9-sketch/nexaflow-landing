// npm test  (node --test "components/film/*.test.ts")
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { scegliModo } from './modo.ts'

test('scegliModo', () => {
  assert.deepEqual(scegliModo({ ridotto: true, risparmioDati: false, larghezza: 390, verticale: true }), { modo: 'minimo', misura: 720, particelle: false })
  assert.deepEqual(scegliModo({ ridotto: false, risparmioDati: false, memoriaGB: 2, larghezza: 1440, verticale: false }), { modo: 'minimo', misura: 720, particelle: false })
  assert.deepEqual(scegliModo({ ridotto: false, risparmioDati: false, larghezza: 390, verticale: true }), { modo: 'leggero', misura: 720, particelle: true })
  assert.deepEqual(scegliModo({ ridotto: false, risparmioDati: false, larghezza: 1440, verticale: false, rete: '3g' }), { modo: 'leggero', misura: 1080, particelle: true })
  assert.deepEqual(scegliModo({ ridotto: false, risparmioDati: false, larghezza: 1440, verticale: false }), { modo: 'pieno', misura: 1080, particelle: true })
})

test('scegliModo: casi limite', () => {
  const pc = { ridotto: false, risparmioDati: false, larghezza: 1440, verticale: false }
  assert.equal(scegliModo({ ...pc, risparmioDati: true }).modo, 'minimo')
  assert.equal(scegliModo({ ...pc, core: 2 }).modo, 'minimo')
  assert.equal(scegliModo({ ...pc, core: 4, memoriaGB: 3 }).modo, 'pieno')     // le soglie sono "meno di"
  assert.equal(scegliModo({ ...pc, rete: '4g' }).modo, 'pieno')
  assert.deepEqual(scegliModo({ ...pc, larghezza: 900 }), { modo: 'leggero', misura: 720, particelle: true })   // 900 è ancora telefono
  assert.deepEqual(scegliModo({ ...pc, larghezza: 1024, verticale: true }), { modo: 'leggero', misura: 720, particelle: true })
})
