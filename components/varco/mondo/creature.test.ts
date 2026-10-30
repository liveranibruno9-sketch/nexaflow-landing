// npm test  ·  le quattro mascotte in codice (home v2.1): si costruiscono, fluttuano, salutano, si abbracciano
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Vector3 } from 'three'
import { creaCreature } from './creature.ts'
import { ORDINE } from '../coreografia.ts'
import type { PosaCorpo } from './creature.ts'

const posa = (p: Partial<PosaCorpo> = {}): PosaCorpo => ({
  presenza: 1, saluto: 0, lato: 'destro', abbraccio: 0, abbraccioSx: false, abbraccioDx: false, ...p,
})

test('si costruiscono tutte e quattro, ognuna col suo corpo, la testa, gli occhi e due braccia', () => {
  const c = creaCreature()
  for (const id of ORDINE) {
    const x = c[id]
    assert.ok(x.radice.children.length > 0, id)
    assert.equal(x.braccia.length, 2, `${id}: due braccia`)
    assert.ok(x.altezza > 1.4 && x.altezza < 2.1, `${id}: altezza ${x.altezza}`)
  }
  c.dispose()
})

test('presenza 0: invisibile; presenza 1: a grandezza piena', () => {
  const c = creaCreature()
  c.atlas.aggiorna(1, posa({ presenza: 0 }))
  assert.equal(c.atlas.corpo.visible, false)
  c.atlas.aggiorna(1, posa({ presenza: 1 }))
  assert.equal(c.atlas.corpo.visible, true)
  assert.ok(Math.abs(c.atlas.corpo.scale.x - 1) < 1e-9)
  c.dispose()
})

test('il saluto alza il braccio dal lato chiesto sopra la spalla, l\'altro resta giù', () => {
  const c = creaCreature()
  const [sx, dx] = c.janus.braccia
  c.janus.aggiorna(2, posa({ saluto: 1, lato: 'destro' }))
  assert.ok(dx.rotation.z > 2.0, `destro alzato: ${dx.rotation.z}`)
  assert.ok(Math.abs(sx.rotation.z) < 0.5, `sinistro giù: ${sx.rotation.z}`)
  c.janus.aggiorna(2, posa({ saluto: 1, lato: 'sinistro' }))
  assert.ok(sx.rotation.z < -2.0, `sinistro alzato: ${sx.rotation.z}`)
  c.dispose()
})

test('abbraccio: ogni mano spunta davanti alla spalla lontana del vicino (a 0,7 + 0,3), le braccia orizzontali', () => {
  const c = creaCreature()
  const [sx, dx] = c.hermes.braccia
  c.hermes.aggiorna(3, posa({ abbraccio: 1, abbraccioSx: true, abbraccioDx: true }))
  for (const [b, lato] of [[sx, -1], [dx, 1]] as const) assert.ok(Math.abs(b.rotation.z - (lato * Math.PI) / 2) < 0.3, `orizzontale: ${b.rotation.z}`)
  c.hermes.radice.updateMatrixWorld(true)
  const [ms, md] = c.hermes.mani.map((m) => m.getWorldPosition(new Vector3()))
  assert.ok(Math.abs(md.x - 1) < 0.1 && Math.abs(ms.x + 1) < 0.1, `x delle mani: ${ms.x.toFixed(2)} ${md.x.toFixed(2)}`)
  assert.ok(md.z > 0.1 && ms.z > 0.1, `davanti alla spalla del vicino, quindi si vedono: ${ms.z.toFixed(2)} ${md.z.toFixed(2)}`)
  assert.ok(Math.abs(md.y - ms.y) < 0.12)
  // il braccio libero dell'ultimo della fila saluta anche durante l'abbraccio
  c.hermes.aggiorna(3, posa({ abbraccio: 1, abbraccioSx: true, abbraccioDx: false, saluto: 1, lato: 'destro' }))
  assert.ok(dx.rotation.z > 2.0)
  c.dispose()
})

test('fluttua: nel tempo il corpo sale e scende anche da fermo', () => {
  const c = creaCreature()
  const y = [0, 0.6, 1.2, 1.8].map((t) => {
    c.prometheus.aggiorna(t, posa())
    return c.prometheus.corpo.position.y
  })
  assert.ok(Math.max(...y) - Math.min(...y) > 0.02)
  c.dispose()
})
