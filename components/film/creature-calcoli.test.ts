// npm test  (node --test "components/film/*.test.ts")
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { HOME } from './dati/home.ts'
import { SCENE_NOTE } from './regia.ts'
import { bagliore, faseCreatura, piedeMassimo, postoCreatura, ritmoCreatura } from './creature-calcoli.ts'

const vicino = (a: number, b: number, e = 1e-9) => Math.abs(a - b) < e
const C = { da: 11, a: 13 }
// la colonna 9:16 di un telefono 390x844 a dpr 1: più larga dello schermo, tagliata sui lati
const FOT = { dx: -42.25, dy: 0, dw: 474.75, dh: 844 }

test('faseCreatura: fuori dalla finestra non c\'è', () => {
  assert.equal(faseCreatura(C, 10.9).visibile, false)
  assert.equal(faseCreatura(C, 13.01).visibile, false)
  assert.equal(faseCreatura(C, 11).visibile, true)
  assert.equal(faseCreatura(C, 13).visibile, true)
})

test('faseCreatura: l\'ingresso dura 0,4 u e poi resta a 1', () => {
  assert.equal(faseCreatura(C, 11).ingresso, 0)
  assert.ok(vicino(faseCreatura(C, 11.2).ingresso, 0.5))
  assert.equal(faseCreatura(C, 11.4).ingresso, 1)
  assert.equal(faseCreatura(C, 12.5).ingresso, 1)
})

test('faseCreatura: l\'uscita sfuma negli ultimi 0,3 u', () => {
  assert.equal(faseCreatura(C, 11).uscita, 1)
  assert.equal(faseCreatura(C, 12.7).uscita, 1)
  assert.ok(vicino(faseCreatura(C, 12.85).uscita, 0.5))
  assert.equal(faseCreatura(C, 13).uscita, 0)
})

test('faseCreatura: una finestra più corta dell\'ingresso non va oltre 1', () => {
  const f = faseCreatura({ da: 5, a: 5.2 }, 5.2)
  assert.equal(f.ingresso, 1)
  assert.ok(f.uscita >= 0 && f.uscita <= 1)
})

test('faseCreatura: valori strani non rompono', () => {
  const f = faseCreatura(C, NaN)
  assert.equal(f.visibile, false)
  assert.equal(f.ingresso, 0)
})

test('postoCreatura: larghezza 0,38 della colonna, piede a 0,96 dell\'altezza', () => {
  const p = postoCreatura(FOT, 0.6, 1)
  assert.ok(vicino(p.w, 0.38 * FOT.dw))
  assert.ok(vicino(p.h, p.w / 0.6))
  assert.ok(vicino(p.y + p.h, 0.96 * FOT.dh))
})

test('postoCreatura: entra da sinistra, da -0,4 a 0,04 della colonna, e arriva liscia', () => {
  const sulComputer = { dx: 460, dy: 0, dw: 506.25, dh: 900 }
  const a = postoCreatura(sulComputer, 0.6, 0)
  const b = postoCreatura(sulComputer, 0.6, 1)
  assert.ok(vicino(a.x, 460 - 0.4 * 506.25))
  assert.ok(vicino(b.x, 460 + 0.04 * 506.25))
  // a metà il passo liscio è esattamente a metà strada, ed è monotono
  const m = postoCreatura(sulComputer, 0.6, 0.5)
  assert.ok(vicino(m.x, (a.x + b.x) / 2))
  let prima = -Infinity
  for (let i = 0; i <= 20; i++) {
    const x = postoCreatura(sulComputer, 0.6, i / 20).x
    assert.ok(x >= prima, `monotona a ${i / 20}`)
    prima = x
  }
})

test('postoCreatura: sul telefono (colonna tagliata) non esce dallo schermo', () => {
  // xMin = 3% della larghezza dello schermo (390)
  const p = postoCreatura(FOT, 0.6, 1, { xMin: 11.7 })
  assert.ok(p.x >= 11.7 - 1e-9)
  // senza il limite la creatura finirebbe con 23 px fuori
  assert.ok(postoCreatura(FOT, 0.6, 1).x < 0)
})

test('postoCreatura: il piede si alza se c\'è un testo sotto', () => {
  const p = postoCreatura(FOT, 0.6, 1, { piedeMax: 600 })
  assert.ok(vicino(p.y + p.h, 600))
  // un limite più basso del solito piede non lo abbassa
  const q = postoCreatura(FOT, 0.6, 1, { piedeMax: 5000 })
  assert.ok(vicino(q.y + q.h, 0.96 * FOT.dh))
})

test('postoCreatura: ingresso fuori da [0,1] resta nei limiti', () => {
  assert.ok(vicino(postoCreatura(FOT, 0.6, -3).x, postoCreatura(FOT, 0.6, 0).x))
  assert.ok(vicino(postoCreatura(FOT, 0.6, 7).x, postoCreatura(FOT, 0.6, 1).x))
})

test('ritmoCreatura: sale e scende di 4 px a 500 px di colonna, ruota al massimo di 1,5 gradi', () => {
  let maxDy = 0, maxRot = 0
  for (let i = 0; i < 2000; i++) {
    const r = ritmoCreatura(i * 0.01, 500)
    maxDy = Math.max(maxDy, Math.abs(r.dy))
    maxRot = Math.max(maxRot, Math.abs(r.rot))
  }
  assert.ok(maxDy <= 4 + 1e-9 && maxDy > 3.9, `dy max ${maxDy}`)
  assert.ok(maxRot <= (1.5 * Math.PI) / 180 + 1e-9 && maxRot > 0.9 * (1.5 * Math.PI) / 180, `rot max ${maxRot}`)
  // a tempo 0 la posa è quella finale (nessuno scarto)
  assert.equal(ritmoCreatura(0, 500).dy, 0)
})

test('ritmoCreatura: la misura segue la colonna', () => {
  const grande = ritmoCreatura(0.5, 1000).dy
  const piccola = ritmoCreatura(0.5, 500).dy
  assert.ok(vicino(grande, 2 * piccola))
})

test('bagliore: alfa 0,3 + 0,2·sin(6t), sempre fra 0,1 e 0,5', () => {
  assert.ok(vicino(bagliore(0), 0.3))
  assert.ok(vicino(bagliore(Math.PI / 12), 0.5))
  for (let i = 0; i < 500; i++) {
    const a = bagliore(i * 0.05)
    assert.ok(a >= 0.1 - 1e-9 && a <= 0.5 + 1e-9)
  }
})

test('piedeMassimo: solo se il testo sta sopra la creatura in orizzontale', () => {
  const creatura = { x0: 12, x1: 192 }
  // testo che parte da y 640, largo come lo schermo: la creatura deve stare sopra, con un margine
  assert.ok(vicino(piedeMassimo(creatura, { x0: 20, x1: 370, y0: 640 }, 12) as number, 628))
  // testo tutto a destra della creatura (computer): nessun limite
  assert.equal(piedeMassimo(creatura, { x0: 700, x1: 900, y0: 400 }, 12), undefined)
  // nessun testo: nessun limite
  assert.equal(piedeMassimo(creatura, null, 12), undefined)
})

test('HOME: una creatura per agente, nella scena X-2, da b+3,0 a b+5,0', () => {
  const agenti = HOME.atti.filter((a) => a.materia)
  assert.deepEqual(agenti.map((a) => a.id), ['atlas', 'janus', 'prometheus', 'hermes'])
  for (const a of agenti) {
    const c = a.creatura
    assert.ok(c, `${a.id} ha la creatura`)
    if (!c) continue
    assert.equal(c.nome, `${a.id}-2`)
    assert.ok(SCENE_NOTE.includes(c.nome))
    assert.ok(vicino(c.da, a.da + 3.0) && vicino(c.a, a.da + 5.0), `${a.id}: finestra`)
    const [x, y, w, h] = c.ritaglio
    assert.ok(x >= 0 && y >= 0 && w > 0.3 && h > 0.3 && x + w <= 1 + 1e-9 && y + h <= 1 + 1e-9, `${a.id}: ritaglio dentro il fotogramma`)
    // la fiammella c'è solo su Prometheus, ed è dentro il ritaglio
    assert.equal(!!c.fiamma, a.id === 'prometheus')
    if (c.fiamma) assert.ok(c.fiamma[0] > 0 && c.fiamma[0] < 1 && c.fiamma[1] > 0 && c.fiamma[1] < 1)
  }
  // gli altri atti (apertura, studio, finale) non hanno creature
  assert.equal(HOME.atti.filter((a) => a.creatura).length, 4)
})
