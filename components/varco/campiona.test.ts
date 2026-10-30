// npm test  ·  campionamento delle immagini del varco (piano-costruzione-v2, compito 2)
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mulberry32, campiona, materiaDaColore } from './campiona.ts'

test('mulberry32: deterministico, in [0, 1), semi diversi danno sequenze diverse', () => {
  const a = mulberry32(7), b = mulberry32(7), c = mulberry32(8)
  const sa = Array.from({ length: 50 }, () => a()), sb = Array.from({ length: 50 }, () => b()), sc = Array.from({ length: 50 }, () => c())
  assert.deepEqual(sa, sb); assert.notDeepEqual(sa, sc)
  for (const x of sa) assert.ok(x >= 0 && x < 1)
})

test('campiona: tutto nel pixel acceso', () => {
  const d = new Uint8ClampedArray(4 * 4 * 4); d.set([255, 255, 255, 255], (2 * 4 + 1) * 4)          // pixel (1, 2) bianco
  const { pos } = campiona({ dati: d, w: 4, h: 4 }, null, 50, 7)
  for (let i = 0; i < 50; i++) { assert.ok(pos[i * 3] >= 0.25 && pos[i * 3] <= 0.5); assert.ok(pos[i * 3 + 1] >= 0.5 && pos[i * 3 + 1] <= 0.75); assert.equal(pos[i * 3 + 2], 0.5) }
})

test('campiona: nero, deterministico', () => {
  const nero = { dati: new Uint8ClampedArray(64).fill(0), w: 4, h: 4 }
  const a = campiona(nero, null, 20, 3); assert.ok(a.pos.every(Number.isFinite)); assert.ok(a.col.every((c) => c === 0))
  assert.deepEqual(campiona(nero, null, 20, 3).pos, a.pos)
})

test('campiona: nero = punti uniformi su tutto il quadro, non ammucchiati in un angolo', () => {
  const nero = { dati: new Uint8ClampedArray(8 * 8 * 4).fill(0), w: 8, h: 8 }
  const { pos } = campiona(nero, null, 400, 1)
  const quadranti = [0, 0, 0, 0]
  for (let i = 0; i < 400; i++) quadranti[(pos[i * 3] < 0.5 ? 0 : 1) + (pos[i * 3 + 1] < 0.5 ? 0 : 2)]++
  for (const q of quadranti) assert.ok(q > 60, `quadrante quasi vuoto: ${quadranti}`)
})

test('campiona: il colore è quello del pixel (0..1) e la profondità viene dalla mappa', () => {
  const d = new Uint8ClampedArray(4 * 4 * 4); d.set([255, 0, 0, 255], (3 * 4 + 3) * 4)              // pixel (3, 3) rosso, in basso a destra
  const mappa = new Uint8ClampedArray(2 * 2 * 4).fill(0); mappa.set([204, 204, 204, 255], (1 * 2 + 1) * 4)    // mappa 2x2: solo il pixel in basso a destra è vicino
  const { pos, col } = campiona({ dati: d, w: 4, h: 4 }, { dati: mappa, w: 2, h: 2 }, 30, 5)
  for (let i = 0; i < 30; i++) {
    assert.deepEqual([col[i * 3], col[i * 3 + 1], col[i * 3 + 2]], [1, 0, 0])
    assert.ok(Math.abs(pos[i * 3 + 2] - 0.8) < 1e-6, `z = ${pos[i * 3 + 2]}`)       // 204 / 255
    assert.ok(pos[i * 3] >= 0.75 && pos[i * 3] <= 1 && pos[i * 3 + 1] >= 0.75 && pos[i * 3 + 1] <= 1)
  }
})

test('campiona: più punti dove l\'immagine è più luminosa (passo variabile)', () => {
  const d = new Uint8ClampedArray(2 * 1 * 4); d.set([255, 255, 255, 255], 0); d.set([60, 60, 60, 255], 4)   // a sinistra pieno, a destra fioco
  const { pos } = campiona({ dati: d, w: 2, h: 1 }, null, 2000, 11)
  let sinistra = 0
  for (let i = 0; i < 2000; i++) if (pos[i * 3] < 0.5) sinistra++
  assert.ok(sinistra > 1300 && sinistra < 1900, `a sinistra ${sinistra} su 2000`)
})

test('campiona: n = 0 non rompe', () => {
  const r = campiona({ dati: new Uint8ClampedArray(16).fill(255), w: 2, h: 2 }, null, 0, 1)
  assert.equal(r.pos.length, 0); assert.equal(r.col.length, 0)
})

test('materiaDaColore: la palette', () => {
  assert.equal(materiaDaColore(0x5b, 0x8c, 0xff), 'polvere'); assert.equal(materiaDaColore(0x35, 0xe0, 0xf0), 'vetro')
  assert.equal(materiaDaColore(0xf4, 0xf1, 0xff), 'saette'); assert.equal(materiaDaColore(0xb4, 0x8c, 0xff), 'saette')
  assert.equal(materiaDaColore(0xd9, 0xd4, 0xc7), 'cromo')
  assert.equal(materiaDaColore(242, 194, 122), 'cromo')                      // la luce calda non è di nessuna delle tre materie fredde
  assert.equal(materiaDaColore(128, 128, 128), 'cromo')                      // grigio: poco saturo
})
