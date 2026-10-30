// npm test  ·  le pose delle ossa delle mascotte 3D: riposo, saluto rapido col gomito, abbraccio, saltello
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mire } from './ossa.ts'
import type { PosaOssa, V3 } from './ossa.ts'

const posa = (p: Partial<PosaOssa> = {}): PosaOssa => ({ presenza: 1, saluto: 0, lato: 'destro', abbraccio: 0, abbraccioSx: false, abbraccioDx: false, ...p })
const lunga = (v: V3) => Math.hypot(...v)

test('a riposo le braccia e gli avambracci pendono verso il basso; ogni direzione è lunga 1', () => {
  const m = mire(posa(), 1, 0)
  for (const v of [...m.braccio, ...m.avambraccio]) {
    assert.ok(v[1] < -0.8, `in basso: ${v}`)
    assert.ok(Math.abs(lunga(v) - 1) < 1e-9)
  }
  assert.ok(m.braccio[0][0] < 0 && m.braccio[1][0] > 0, 'ognuno dal suo lato')
  assert.equal(m.salto, 0)
})

test('il saluto alza il braccio dal lato chiesto e la mano oscilla veloce dal gomito; l\'altro braccio resta giù', () => {
  const d = mire(posa({ saluto: 1, lato: 'destro' }), 2, 0)
  assert.ok(d.braccio[1][1] > 0.5 && d.braccio[1][0] > 0, `destro alzato: ${d.braccio[1]}`)
  assert.ok(d.braccio[0][1] < -0.8, 'sinistro giù')
  assert.ok(d.avambraccio[1][1] > 0.5, 'la mano sta in alto')
  // in un quarto di secondo la mano passa da un lato all'altro: è un saluto rapido
  const xs = [0, 0.06, 0.12, 0.18, 0.24].map((dt) => mire(posa({ saluto: 1 }), 2 + dt, 0).avambraccio[1][0])
  assert.ok(Math.max(...xs) - Math.min(...xs) > 0.6, `oscillazione: ${xs.map((x) => x.toFixed(2))}`)
  const s = mire(posa({ saluto: 1, lato: 'sinistro' }), 2, 0)
  assert.ok(s.braccio[0][1] > 0.5 && s.braccio[0][0] < 0, 'sinistro alzato')
})

test('salutando saltella e piega la testa verso la mano', () => {
  const salti = Array.from({ length: 20 }, (_, i) => mire(posa({ saluto: 1 }), i * 0.05, 0).salto)
  assert.ok(Math.max(...salti) > 0.03)
  assert.ok(mire(posa({ saluto: 1, lato: 'destro' }), 0, 0).testa.inclina < mire(posa({ saluto: 1, lato: 'sinistro' }), 0, 0).testa.inclina)
})

test('abbraccio: il braccio va verso il vicino dietro la sua schiena, l\'avambraccio gira in avanti sulla sua spalla', () => {
  const m = mire(posa({ abbraccio: 1, abbraccioSx: true, abbraccioDx: true }), 3, 1)
  for (const [k, L] of [[0, -1], [1, 1]] as const) {
    assert.ok(m.braccio[k][0] * L > 0.8, `verso il vicino: ${m.braccio[k]}`)
    assert.ok(m.braccio[k][2] < 0, 'dietro')
    assert.ok(m.avambraccio[k][2] > 0.5 && m.avambraccio[k][0] * L > 0.4, 'gira in avanti')
  }
  // l'ultimo della fila: un braccio abbraccia, l'altro saluta
  const u = mire(posa({ abbraccio: 1, abbraccioSx: true, abbraccioDx: false, saluto: 1, lato: 'destro' }), 3, 1)
  assert.ok(u.braccio[1][1] > 0.5 && u.braccio[0][0] < -0.8)
})

test('lo sguardo gira la testa verso il puntatore', () => {
  assert.ok(mire(posa({ sguardo: [1, 0] }), 0, 0).testa.giro > mire(posa({ sguardo: [-1, 0] }), 0, 0).testa.giro + 0.8)
})
