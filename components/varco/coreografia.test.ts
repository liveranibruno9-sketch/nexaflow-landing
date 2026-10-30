// npm test  ·  la coreografia delle mascotte in codice (home v2.1): giostra accanto al titolo, una per servizio, squadra abbracciata al centro
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ALTEZZA_CREATURA, LARGHEZZA_CREATURA, ORDINE, coreografia, ribalta } from './coreografia.ts'
import { HOME } from './dati/home.ts'
import type { Schermo } from './coreografia.ts'

const TELEFONO: Schermo = { ritratto: true, aspetto: 390 / 844, basso: false }
const COMPUTER: Schermo = { ritratto: false, aspetto: 1440 / 900, basso: false }
const blocco = (id: string) => HOME.blocchi.find((b) => b.id === id)!
const intro = blocco('servizi'), squadra = blocco('squadra')
const sotto = squadra.battute.find((b) => b.ruolo === 'sotto')!

test('prima di «I nostri servizi» nessuna mascotte in scena', () => {
  for (const u of [0, 0.5, 1.5, 2.5]) for (const s of [TELEFONO, COMPUTER]) {
    const c = coreografia(HOME, u, 3, s)
    for (const id of ORDINE) assert.equal(c[id].presenza, 0, `${id} a u = ${u}`)
  }
})

test('giostra: tutte e quattro in scena, in posti diversi; sul computer a destra del titolo, sul telefono sopra', () => {
  const u = (intro.da + intro.a) / 2
  for (const tempo of [0, 1.7, 4.2]) {
    const pc = coreografia(HOME, u, tempo, COMPUTER), tel = coreografia(HOME, u, tempo, TELEFONO)
    for (const id of ORDINE) {
      assert.ok(pc[id].presenza > 0.95 && tel[id].presenza > 0.95, id)
      assert.ok(pc[id].x - (pc[id].altezza * 0.62) / COMPUTER.aspetto / 2 > 0.42, `${id}: sul computer entra nella colonna del titolo`)
      assert.ok(tel[id].y + tel[id].altezza / 2 < 0.62, `${id}: sul telefono scende sul titolo`)
    }
    const xs = ORDINE.map((id) => pc[id].x + pc[id].z)
    assert.equal(new Set(xs.map((x) => x.toFixed(3))).size, 4, 'quattro posti diversi')
  }
  // girano anche senza scorrere
  const a = coreografia(HOME, u, 0, COMPUTER).atlas.x, b = coreografia(HOME, u, 1, COMPUTER).atlas.x
  assert.ok(Math.abs(a - b) > 0.01)
})

test('in ogni servizio c\'è solo la sua mascotte, nello stesso posto per tutte', () => {
  for (const id of ORDINE) {
    const b = blocco(id), u = b.da + 1.5
    for (const s of [TELEFONO, COMPUTER]) {
      const c = coreografia(HOME, u, 2, s), r = ribalta(s)
      assert.ok(c[id].presenza > 0.99, `${id} in scena`)
      assert.ok(Math.abs(c[id].x - r.x) < 1e-6 && Math.abs(c[id].y - r.y) < 1e-6, `${id} al suo posto`)
      for (const altro of ORDINE) if (altro !== id) assert.equal(c[altro].presenza, 0, `${altro} nel servizio di ${id}`)
    }
  }
})

test('mentre si scorre le mascotte in scena salutano', () => {
  const u = blocco('janus').da + 2
  assert.ok(coreografia(HOME, u, 2, TELEFONO, 0).janus.saluto < 0.05)
  assert.ok(coreografia(HOME, u, 2, TELEFONO, 1).janus.saluto > 0.85)
  assert.equal(coreografia(HOME, u, 2, TELEFONO, 1).atlas.saluto, 0, 'chi non è in scena non saluta')
})

test('squadra: scendono dall\'alto con la seconda riga, poi al centro abbracciate, le due esterne salutano', () => {
  const prima = coreografia(HOME, sotto.da - 0.05, 2, TELEFONO)
  for (const id of ORDINE) assert.ok(prima[id].presenza === 0 || prima[id].y + prima[id].altezza / 2 < 0.05, `${id}: arriva da sopra lo schermo`)
  for (const s of [TELEFONO, COMPUTER]) {
    const c = coreografia(HOME, sotto.da + 1.1, 2, s)
    const xs = ORDINE.map((id) => c[id].x)
    assert.ok(Math.abs(xs.reduce((a, x) => a + x, 0) / 4 - 0.5) < 1e-9, 'centrata')
    for (let i = 1; i < 4; i++) assert.ok(xs[i] > xs[i - 1], 'in fila da sinistra a destra')
    for (const id of ORDINE) {
      assert.ok(c[id].presenza > 0.99 && c[id].abbraccio > 0.99, id)
      assert.ok(Math.abs(c[id].y - c.atlas.y) < 1e-9, 'tutte alla stessa altezza')
    }
    // entra nello schermo, braccia comprese
    const meta = (LARGHEZZA_CREATURA / 2) * (c.atlas.altezza / ALTEZZA_CREATURA) / s.aspetto
    assert.ok(xs[0] - meta > 0.02 && xs[3] + meta < 0.98, 'entra nella larghezza')
    assert.deepEqual([c.atlas.abbraccioSx, c.atlas.abbraccioDx, c.hermes.abbraccioSx, c.hermes.abbraccioDx], [false, true, true, false])
    assert.ok(c.atlas.saluto > 0.5 && c.atlas.lato === 'sinistro' && c.hermes.saluto > 0.5 && c.hermes.lato === 'destro')
  }
})

test('nessuno scatto: una mascotte in scena non salta da un fotogramma all\'altro', () => {
  for (const s of [TELEFONO, COMPUTER]) {
    let prima = coreografia(HOME, 0, 2, s)
    for (let u = 0.01; u <= HOME.lunghezza; u += 0.01) {
      const ora = coreografia(HOME, u, 2, s)
      for (const id of ORDINE) {
        if (prima[id].presenza > 0.05 && ora[id].presenza > 0.05) {
          assert.ok(Math.abs(ora[id].x - prima[id].x) < 0.03 && Math.abs(ora[id].y - prima[id].y) < 0.06, `${id} salta a u = ${u.toFixed(2)}`)
        }
        assert.ok(Math.abs(ora[id].presenza - prima[id].presenza) < 0.35, `${id}: presenza a scatti a u = ${u.toFixed(2)}`)
      }
      prima = ora
    }
  }
})

test('le altre pagine (senza mascotte) non hanno creature', () => {
  const c = coreografia({ lunghezza: 2, blocchi: [{ id: 'x', tipo: 'soglia', da: 0, a: 2, etichetta: 'x', battute: [] }] }, 1, 1, TELEFONO)
  for (const id of ORDINE) assert.equal(c[id].presenza, 0)
})
