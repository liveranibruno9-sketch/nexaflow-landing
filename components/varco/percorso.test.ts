// npm test  ·  tempi del percorso del varco (piano-costruzione-v2, compito 1)
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { VELOCITA, zCamera, bloccoAl, tempi, fasiTratto, fasiBlocco, statoFrase, profiloDistanza, zAl, trattiDaTenere, pesiMateria } from './percorso.ts'
import type { Blocco, Percorso } from './tipi.ts'

const blocco = (id: string, tipo: Blocco['tipo'], da: number, a: number, extra: Partial<Blocco> = {}): Blocco => ({ id, tipo, da, a, etichetta: id, battute: [], ...extra })
// i sette blocchi della home, senza battute (la home vera arriva nel compito 3)
const HOME_FINTA: Percorso = {
  lunghezza: 31.6,
  blocchi: [
    blocco('apertura', 'apertura', 0, 0.6),
    blocco('soglia', 'soglia', 0.6, 5.6),
    blocco('atlas', 'tratto', 5.6, 11.1, { materia: 'polvere' }),
    blocco('janus', 'tratto', 11.1, 16.6, { materia: 'vetro' }),
    blocco('prometheus', 'tratto', 16.6, 22.1, { materia: 'saette' }),
    blocco('hermes', 'tratto', 22.1, 27.6, { materia: 'cromo' }),
    blocco('finale', 'finale', 27.6, 31.6),
  ],
}
const vicino = (x: number, y: number, e = 1e-9) => Math.abs(x - y) < e

test('la camera va a velocità costante', () => {
  assert.equal(VELOCITA, 50)
  assert.equal(zCamera(0), 10)
  assert.equal(zCamera(2), -90)
})

test("bloccoAl: l'ultimo blocco con da <= u, 0 prima del primo", () => {
  assert.equal(bloccoAl(HOME_FINTA, -1), 0)
  assert.equal(bloccoAl(HOME_FINTA, 0), 0)
  assert.equal(bloccoAl(HOME_FINTA, 0.6), 1)
  assert.equal(bloccoAl(HOME_FINTA, 5.59), 1)
  assert.equal(bloccoAl(HOME_FINTA, 5.6), 2)
  assert.equal(bloccoAl(HOME_FINTA, 99), 6)
})

test('tempi: t di ogni battuta per ruolo, limitato a 0..1', () => {
  const b = blocco('x', 'soglia', 0, 5, { battute: [
    { tipo: 'frase', testo: 'Uno.', ruolo: '1', da: 1, a: 3 },
    { tipo: 'frase', testo: 'Due.', ruolo: '2', da: 3, a: 5 },
  ] })
  assert.deepEqual(tempi(b, 0), { '1': 0, '2': 0 })
  assert.deepEqual(tempi(b, 2), { '1': 0.5, '2': 0 })
  assert.deepEqual(tempi(b, 4), { '1': 1, '2': 0.5 })
  assert.deepEqual(tempi(b, 9), { '1': 1, '2': 1 })
})

test('fasiTratto: problema, creatura, beneficio', () => {
  const b = 5.6
  assert.equal(fasiTratto(b, b + 0.7).foto[0], 1); assert.equal(fasiTratto(b, b + 0.7).forma, 0)
  const m = fasiTratto(b, b + 1.5); assert.ok(m.forma > 0 && m.forma < 1)
  assert.equal(fasiTratto(b, b + 2.2).forma, 1); assert.equal(fasiTratto(b, b + 2.2).foto[1], 1)
  assert.equal(fasiTratto(b, b + 3.0).forma, 2); assert.equal(fasiTratto(b, b + 3.0).foto[2], 1)
  assert.ok(fasiTratto(b, b + 5.4).composto < 0.5); assert.equal(fasiTratto(b, b - 1).composto, 0)
  for (let u = b; u < b + 5.5; u += 0.05) assert.ok(fasiTratto(b, u).foto.filter((x) => x > 0.5).length <= 1) // mai due foto piene insieme
})

test('fasiTratto: composto sale in 0,4 e scende fra b+5 e b+5,5; uscita fra b+4,4 e b+5', () => {
  const b = 11.1
  assert.equal(fasiTratto(b, b).composto, 0); assert.equal(fasiTratto(b, b + 0.4).composto, 1)
  assert.equal(fasiTratto(b, b + 5.5).composto, 0)
  assert.equal(fasiTratto(b, b + 4.4).uscita, 0); assert.equal(fasiTratto(b, b + 5.0).uscita, 1)
  assert.ok(vicino(fasiTratto(b, b + 2.75).locale, 0.5)); assert.equal(fasiTratto(b, b - 3).locale, 0); assert.equal(fasiTratto(b, b + 9).locale, 1)
})

test('fasiBlocco: servizio, soglia, passi e tratto', () => {
  const servizio = blocco('s', 'servizio', 0, 4)
  assert.equal(fasiBlocco(servizio, 2).forma, 1); assert.deepEqual(fasiBlocco(servizio, 2).foto, [0, 1, 0]); assert.equal(fasiBlocco(servizio, 2).uscita, 0)
  assert.equal(fasiBlocco(servizio, 2).locale, 0.5)
  const soglia = HOME_FINTA.blocchi[1]
  assert.deepEqual(fasiBlocco(soglia, 3).foto, [0, 0, 0]); assert.equal(fasiBlocco(soglia, 3).forma, 0); assert.equal(fasiBlocco(soglia, 3).composto, 1)
  const passi = blocco('p', 'passi', 4, 5.5)
  assert.equal(fasiBlocco(passi, 4).uscita, 0); assert.equal(fasiBlocco(passi, 5.5).uscita, 1); assert.deepEqual(fasiBlocco(passi, 5).foto, [0, 1, 0])
  const atlas = HOME_FINTA.blocchi[2]
  assert.deepEqual(fasiBlocco(atlas, 7.7), fasiTratto(atlas.da, 7.7))
})

test('statoFrase', () => {
  assert.deepEqual(statoFrase({ da: 2, a: 3 }, 2), { o: 0, y: 12, sfoca: 6 })
  assert.deepEqual(statoFrase({ da: 2, a: 3 }, 2.12), { o: 1, y: 0, sfoca: 0 })
  assert.equal(statoFrase({ da: 2, a: 3 }, 2.92).o, 1); assert.equal(statoFrase({ da: 2, a: 3 }, 3).o, 0)
  assert.equal(statoFrase({ da: 0, a: 0.6 }, 0).o, 1)                      // visibile subito
  const dentro = statoFrase({ da: 2, a: 3 }, 2.06); assert.ok(dentro.o > 0 && dentro.o < 1 && dentro.y > 0 && dentro.y < 12 && dentro.sfoca > 0 && dentro.sfoca < 6)
  const fuori = statoFrase({ da: 2, a: 3 }, 2.96); assert.ok(fuori.o > 0 && fuori.o < 1 && fuori.y < 0 && fuori.y > -8)   // esce salendo di 8 px al massimo
  assert.equal(statoFrase({ da: 2, a: 3 }, 1).o, 0)
})

test('profiloDistanza: monotono, arriva alla velocità della camera', () => {
  const c = profiloDistanza(4)
  assert.equal(zAl(c, 0.4), 7); assert.equal(zAl(c, 4.4), 4)
  for (let u = -0.5; u < 5.5; u += 0.01) assert.ok(zAl(c, u + 0.01) <= zAl(c, u))
  assert.equal(zAl(c, -9), 32); assert.equal(zAl(c, 99), -27)             // fuori dai punti resta sugli estremi
})

test('trattiDaTenere', () => {
  assert.deepEqual(trattiDaTenere(HOME_FINTA, 3), ['atlas'])
  assert.deepEqual(trattiDaTenere(HOME_FINTA, 8), ['atlas', 'janus'])
  assert.deepEqual(trattiDaTenere(HOME_FINTA, 12), ['janus', 'prometheus'])
  assert.deepEqual(trattiDaTenere(HOME_FINTA, 29), [])
  assert.deepEqual(trattiDaTenere(HOME_FINTA, 10.8), ['atlas', 'janus'])      // il successivo è già fra quelli in scena: nessun doppione
  assert.ok(trattiDaTenere(HOME_FINTA, 11.2).length <= 2)                     // due in scena e un terzo in arrivo: ne restano due
})

test('pesiMateria', () => {
  assert.deepEqual(pesiMateria(HOME_FINTA, 8), [1, 0, 0, 0])
  const passaggio = pesiMateria(HOME_FINTA, 11.1 - 0.25)
  assert.ok(vicino(passaggio[0], 0.5, 1e-6) && vicino(passaggio[1], 0.5, 1e-6) && passaggio[2] === 0 && passaggio[3] === 0)
  assert.deepEqual(pesiMateria(HOME_FINTA, 29), [0.25, 0.25, 0.25, 0.25])
  assert.deepEqual(pesiMateria(HOME_FINTA, 0), [0.25, 0.25, 0.25, 0.25])
  assert.deepEqual(pesiMateria(HOME_FINTA, 3), [0.25, 0.25, 0.25, 0.25])
  // niente scatto di colore dei fiumi al confine soglia → Atlas, né da Hermes al finale: i pesi sono continui
  for (const [prima, dopo] of [[5.6 - 1e-6, 5.6], [27.6 - 1e-6, 27.6], [11.1 - 1e-6, 11.1]]) {
    const a = pesiMateria(HOME_FINTA, prima), b = pesiMateria(HOME_FINTA, dopo)
    for (let i = 0; i < 4; i++) assert.ok(vicino(a[i], b[i], 1e-4), `scatto a u = ${dopo}, materia ${i}`)
  }
  for (let u = 0; u < 31.6; u += 0.1) assert.ok(vicino(pesiMateria(HOME_FINTA, u).reduce((s, x) => s + x, 0), 1, 1e-9), `somma a u = ${u}`)
})

test('mascotte (home v2): si compone in mezza schermata, la foto affiora dopo, alla fine si disfa; nessuna uscita', () => {
  const m = blocco('atlas', 'mascotte', 3.4, 6.6, { materia: 'polvere' })
  assert.equal(fasiBlocco(m, 3.4).composto, 0); assert.equal(fasiBlocco(m, 3.9).composto, 1); assert.equal(fasiBlocco(m, 6.6).composto, 0)
  assert.equal(fasiBlocco(m, 3.4).foto[1], 0); assert.equal(fasiBlocco(m, 4.1).foto[1], 1); assert.ok(fasiBlocco(m, 6.4).foto[1] < 0.5)
  assert.equal(fasiBlocco(m, 5).forma, 1); assert.equal(fasiBlocco(m, 5).uscita, 0); assert.deepEqual([fasiBlocco(m, 5).foto[0], fasiBlocco(m, 5).foto[2]], [0, 0])
})

test('le mascotte contano come soggetti: trattiDaTenere e pesiMateria le vedono', () => {
  const p: Percorso = { lunghezza: 10, blocchi: [blocco('soglia', 'soglia', 0, 2), blocco('a', 'mascotte', 2, 5, { materia: 'vetro' }), blocco('b', 'mascotte', 5, 8, { materia: 'cromo' }), blocco('fine', 'finale', 8, 10)] }
  assert.deepEqual(trattiDaTenere(p, 1), ['a']); assert.deepEqual(trattiDaTenere(p, 3), ['a', 'b']); assert.deepEqual(trattiDaTenere(p, 9), [])
  assert.deepEqual(pesiMateria(p, 3), [0, 1, 0, 0]); assert.deepEqual(pesiMateria(p, 6), [0, 0, 0, 1])
})

test('profiloDistanza con una lunghezza diversa: la sosta e l\'uscita si spostano con il blocco', () => {
  const c = profiloDistanza(4, 3.2)
  assert.equal(zAl(c, 0.4), 7); assert.equal(zAl(c, 2.1), 4); assert.equal(zAl(c, 3.2), -27)
  for (let u = -0.5; u < 3.2; u += 0.01) assert.ok(zAl(c, u + 0.01) <= zAl(c, u))
})
