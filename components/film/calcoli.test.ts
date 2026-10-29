// npm test  (node --test "components/film/*.test.ts")
import { test } from 'node:test'
import assert from 'node:assert/strict'
import * as C from './calcoli.ts'

test('frameIndex', () => {
  assert.equal(C.frameIndex(0, 48), 0)
  assert.equal(C.frameIndex(1, 48), 47)
  assert.equal(C.frameIndex(-1, 48), 0)
  assert.equal(C.frameIndex(NaN, 48), 0)
  assert.equal(C.frameIndex(0.5, 1), 0)
})

test('tratto', () => {
  assert.deepEqual(C.tratto(0, 6), { i: 0, locale: 0 })
  assert.deepEqual(C.tratto(1, 6), { i: 5, locale: 1 })
  const m = C.tratto(0.5, 4)
  assert.equal(m.i, 2)
  assert.equal(m.locale, 0)
  const q = C.tratto(0.3, 2)
  assert.equal(q.i, 0)
  assert.ok(Math.abs(q.locale - 0.6) < 1e-9)
  assert.deepEqual(C.tratto(NaN, 3), { i: 0, locale: 0 })
  assert.deepEqual(C.tratto(0.5, 0), { i: 0, locale: 0 })
})

test('dissolvenza', () => {
  assert.deepEqual(C.dissolvenza(0, 0.8), { clip: 0, verso: 0 })
  assert.deepEqual(C.dissolvenza(0.4, 0.8), { clip: 0.5, verso: 0 })
  assert.deepEqual(C.dissolvenza(1, 0.8), { clip: 1, verso: 1 })
  assert.equal(C.dissolvenza(0.9, 0.8).clip, 1)
  assert.ok(Math.abs(C.dissolvenza(0.9, 0.8).verso - 0.5) < 1e-9)
  assert.deepEqual(C.dissolvenza(0.7, 0), { clip: 0.7, verso: 0 })
})

test('nearestReady', () => {
  assert.equal(C.nearestReady([true, false, false, true], 2), 3)
  assert.equal(C.nearestReady([true, false, true], 1), 0)
  assert.equal(C.nearestReady([false, false], 0), -1)
  assert.equal(C.nearestReady([], 0), -1)
})

test('coverRect', () => {
  assert.deepEqual(C.coverRect(1000, 500, 500, 500), { sx: 250, sy: 0, sw: 500, sh: 500 })
  assert.deepEqual(C.coverRect(540, 960, 270, 480), { sx: 0, sy: 0, sw: 540, sh: 960 })
})

test('approach', () => {
  assert.deepEqual(C.approach(0, 1, 0.2, 0.001), { value: 0.2, done: false })
  assert.deepEqual(C.approach(0.9995, 1, 0.2, 0.001), { value: 1, done: true })
})

test('daTenere', () => {
  assert.deepEqual(C.daTenere(0, 4), [true, true, false, false])
  assert.deepEqual(C.daTenere(2, 5), [false, true, true, true, false])
})

test('interpola', () => {
  const t: [number, number][] = [[0, 0], [2, 10], [3, 10], [5, 20]]
  assert.equal(C.interpola(t, -1), 0)
  assert.equal(C.interpola(t, 1), 5)
  assert.equal(C.interpola(t, 2.5), 10)
  assert.equal(C.interpola(t, 4), 15)
  assert.equal(C.interpola(t, 9), 20)
  assert.equal(C.interpola(t, NaN), 0)
  assert.equal(C.interpola([], 1), 0)
})

test('liscio', () => {
  assert.equal(C.liscio(1, 3, 0), 0)
  assert.equal(C.liscio(1, 3, 2), 0.5)
  assert.equal(C.liscio(1, 3, 9), 1)
  assert.equal(C.liscio(2, 2, 1), 0)
  assert.equal(C.liscio(2, 2, 2), 1)
  assert.equal(C.liscio(0, Infinity, 5), 0)
})

test('finestra', () => {
  const w: [number, number, number, number] = [1, 2, 4, 5]
  assert.equal(C.finestra(0, w), 0)
  assert.equal(C.finestra(3, w), 1)
  assert.equal(C.finestra(6, w), 0)
  assert.ok(Math.abs(C.finestra(1.5, w) - 0.5) < 1e-9)
  assert.ok(Math.abs(C.finestra(4.5, w) - 0.5) < 1e-9)
  assert.equal(C.finestra(0, [-1, 0, 2, 3]), 1)
  assert.equal(C.finestra(100, [1, 2, Infinity, Infinity]), 1)
})

test('respiro', () => {
  assert.equal(C.respiro(2, 4, 1), 0)
  assert.equal(C.respiro(2, 4, 5), 0)
  assert.ok(Math.abs(C.respiro(2, 4, 3) - 1) < 1e-9)
  assert.ok(Math.abs(C.respiro(2, 4, 2)) < 1e-9)
})

test('coppia', () => {
  assert.deepEqual(C.coppia(0, 10), { a: 0, b: 1, t: 0 })
  assert.deepEqual(C.coppia(9, 10), { a: 9, b: 9, t: 0 })
  assert.deepEqual(C.coppia(99, 10), { a: 9, b: 9, t: 0 })
  assert.deepEqual(C.coppia(-3, 10), { a: 0, b: 1, t: 0 })
  const c = C.coppia(2.25, 10)
  assert.equal(c.a, 2); assert.equal(c.b, 3); assert.ok(Math.abs(c.t - 0.25) < 1e-9)
  assert.deepEqual(C.coppia(NaN, 10), { a: 0, b: 1, t: 0 })
})

test('fuoriFinestra', () => {
  assert.equal(C.fuoriFinestra(10, 10, 5), false)
  assert.equal(C.fuoriFinestra(15, 10, 5), false)
  assert.equal(C.fuoriFinestra(16, 10, 5), true)
  assert.equal(C.fuoriFinestra(4, 10, 5), true)
})

test('prossimoDaCaricare', () => {
  const nessuno = [false, false, false, false, false, false, false, false, false, false]
  assert.equal(C.prossimoDaCaricare(0, nessuno, 3), 0)
  const r = nessuno.slice(); r[0] = true
  assert.equal(C.prossimoDaCaricare(0, r, 3), 1)
  // davanti prima di dietro: a pari distanza vince il successivo
  const r2 = nessuno.slice(); r2[5] = true
  assert.equal(C.prossimoDaCaricare(5, r2, 3), 6)
  // tutto il raggio già richiesto
  const r3 = nessuno.map((_, i) => i >= 2 && i <= 8)
  assert.equal(C.prossimoDaCaricare(5, r3, 3), -1)
  // il raggio non esce dai limiti
  assert.equal(C.prossimoDaCaricare(9, nessuno.map((_, i) => i >= 9), 3), 8)
  assert.equal(C.prossimoDaCaricare(NaN, nessuno, 3), 0)
})

test('finestra asimmetrica', () => {
  assert.equal(C.fuoriFinestra(14, 10, 5, 2), false)
  assert.equal(C.fuoriFinestra(9, 10, 5, 2), false)
  assert.equal(C.fuoriFinestra(7, 10, 5, 2), true)
  assert.equal(C.fuoriFinestra(16, 10, 5, 2), true)
  const nessuno = new Array(20).fill(false)
  // dietro solo 1: un fotogramma 2 posti indietro non si carica
  const r = nessuno.map((_, i) => i >= 10 && i <= 12)
  assert.equal(C.prossimoDaCaricare(10, r, 2, 1), 9)
  const r2 = r.slice(); r2[9] = true
  assert.equal(C.prossimoDaCaricare(10, r2, 2, 1), -1)
})

test('containRect', () => {
  assert.deepEqual(C.containRect(720, 1280, 1440, 900), { dx: 466.875, dy: 0, dw: 506.25, dh: 900 })
  assert.deepEqual(C.containRect(720, 1280, 390, 844), { dx: 0, dy: 75.33333333333331, dw: 390, dh: 693.3333333333334 })
})

test('sfuma', () => {
  assert.equal(C.sfuma(2.5, 2.5, 3.0), 0)
  assert.equal(C.sfuma(2.75, 2.5, 3.0), 1)
  assert.equal(C.sfuma(3.0, 2.5, 3.0), 0)
  assert.ok(Math.abs(C.sfuma(2.59, 2.5, 3.0) - 0.5) < 1e-9)
  assert.equal(C.sfuma(2.6, 2.5, 2.7, 0.18), 1)   // finestra corta: le rampe si incontrano a metà
})
