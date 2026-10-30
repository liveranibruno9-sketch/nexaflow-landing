// npm test  (node --test "components/film/*.test.ts")
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { PRESET, convergenza, letteraVisibile, limiteParticelle, materiaScena, rettangoloFotogramma } from './materia-calcoli.ts'

const vicino = (a: number, b: number) => Math.abs(a - b) < 1e-9

test('letteraVisibile', () => {
  assert.equal(letteraVisibile(13, 0), 0)
  assert.equal(letteraVisibile(13, 1), 13)
  // monotona su 50 passi, sempre un intero fra 0 e n
  let prima = 0
  for (let i = 0; i <= 50; i++) {
    const k = letteraVisibile(13, i / 50)
    assert.ok(Number.isInteger(k), `intero a t = ${i / 50}`)
    assert.ok(k >= prima, `monotona a t = ${i / 50}`)
    assert.ok(k >= 0 && k <= 13)
    prima = k
  }
  // fuori da [0, 1] e con valori strani resta nei limiti
  assert.equal(letteraVisibile(13, -2), 0)
  assert.equal(letteraVisibile(13, 5), 13)
  assert.equal(letteraVisibile(13, NaN), 0)
  assert.equal(letteraVisibile(0, 0.5), 0)
  // la prima lettera compare appena la scrittura comincia
  assert.equal(letteraVisibile(13, 0.01), 1)
})

test('limiteParticelle', () => {
  assert.equal(limiteParticelle('minimo', 390), 0)
  assert.equal(limiteParticelle('leggero', 390), 400)
  assert.equal(limiteParticelle('pieno', 1440), 900)
  assert.equal(limiteParticelle('minimo', 1440), 0)
  assert.equal(limiteParticelle('leggero', 1440), 900)   // computer con rete lenta: il tetto è quello del computer
  assert.equal(limiteParticelle('leggero', 900), 400)    // 900 è ancora telefono (come modo.ts)
})

test('convergenza', () => {
  const [x1, y1] = convergenza(1, [0, 0], [5, 5])
  assert.ok(vicino(x1, 5) && vicino(y1, 5))
  assert.deepEqual(convergenza(0, [0, 0], [5, 5]), [0, 0])
  // fuori da [0, 1] resta agli estremi; a metà è sulla curva, non sulla retta (gira attorno alla meta)
  assert.deepEqual(convergenza(-1, [2, 3], [8, 9]), [2, 3])
  const [x9, y9] = convergenza(9, [2, 3], [8, 9])
  assert.ok(vicino(x9, 8) && vicino(y9, 9))
  const [xm, ym] = convergenza(0.5, [0, 0], [10, 0])
  assert.ok(xm > 0 && xm < 10)
  assert.ok(Math.abs(ym) > 0.5)
  // t liscio: la distanza dalla meta cala sempre
  let d = Infinity
  for (let i = 0; i <= 40; i++) {
    const [x, y] = convergenza(i / 40, [0, 0], [10, 4])
    const di = Math.hypot(10 - x, 4 - y)
    assert.ok(di <= d + 1e-9, `si avvicina a t = ${i / 40}`)
    d = di
  }
})

test('PRESET', () => {
  assert.deepEqual(Object.keys(PRESET).sort(), ['cromo', 'polvere', 'saette', 'vetro'])
  assert.equal(PRESET.polvere.colore.toUpperCase(), '#5B8CFF')
  assert.equal(PRESET.vetro.colore.toUpperCase(), '#35E0F0')
  assert.equal(PRESET.saette.colore.toUpperCase(), '#F4F1FF')
  assert.equal(PRESET.saette.colore2?.toUpperCase(), '#B48CFF')
  assert.equal(PRESET.cromo.colore.toUpperCase(), '#D9D4C7')
  assert.equal(PRESET.polvere.gravita, 0)
  assert.ok(PRESET.cromo.gravita > 0)
  assert.ok(PRESET.saette.vita[1] < PRESET.polvere.vita[0])   // le saette vivono poco
  for (const p of Object.values(PRESET)) {
    assert.ok(p.raggio[0] > 0 && p.raggio[1] >= p.raggio[0])
    assert.ok(p.vita[0] > 0 && p.vita[1] >= p.vita[0])
  }
  assert.deepEqual(
    [PRESET.polvere.forma, PRESET.vetro.forma, PRESET.saette.forma, PRESET.cromo.forma],
    ['punto', 'scheggia', 'segmento', 'goccia'],
  )
})

test('materiaScena', () => {
  assert.equal(materiaScena('atlas-1'), 'polvere')
  assert.equal(materiaScena('janus-3'), 'vetro')
  assert.equal(materiaScena('prometheus-2'), 'saette')
  assert.equal(materiaScena('hermes-1'), 'cromo')
  assert.equal(materiaScena('studio'), undefined)
  assert.equal(materiaScena('apertura'), undefined)
})

test('rettangoloFotogramma', () => {
  // computer: la colonna 9:16 al centro (come containRect)
  assert.deepEqual(rettangoloFotogramma(1440, 900), { x: 466.875, y: 0, w: 506.25, h: 900 })
  // telefono: il fotogramma copre lo schermo (come coverRect), si tagliano i lati
  const r = rettangoloFotogramma(390, 844)
  assert.ok(vicino(r.h, 844) && vicino(r.w, 844 * 9 / 16))
  assert.ok(vicino(r.x, (390 - 844 * 9 / 16) / 2) && r.y === 0)
})
