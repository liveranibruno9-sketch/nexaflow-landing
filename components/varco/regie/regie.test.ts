// npm test  ·  le regie del varco: Kit finto e controllo R18 (piano-costruzione-v2, compito 3; home v2 dal 30/10)
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { controllaR18, REGIE } from './indice.ts'
import { kitFinto } from '../kit-finto.ts'
import { HOME } from '../dati/home.ts'
import type { Regia } from '../kit.ts'
import type { Percorso } from '../tipi.ts'

const percorso = (...ruoli: [string, number, number, string?][]): Percorso => ({
  lunghezza: 2,
  blocchi: [{ id: 'x', tipo: 'soglia', da: 0, a: 2, etichetta: 'x', battute: ruoli.map(([ruolo, da, a, accento]) => ({ tipo: 'frase', testo: `Frase ${ruolo} noi.`, ruolo, da, a, ...(accento ? { accento } : {}) })) }],
})

test('controllaR18 coglie una frase senza àncora', () => {
  const p: Percorso = { lunghezza: 2, blocchi: [{ id: 'x', tipo: 'soglia', da: 0, a: 2, etichetta: 'x', battute: [
    { tipo: 'frase', testo: 'Uno.', ruolo: '1', da: 0.2, a: 0.8 }, { tipo: 'frase', testo: 'Due noi.', ruolo: '2', accento: 'noi', da: 0.8, a: 1.4 } ] }] }
  const ferma: Regia = (t, f, k) => { k.luce('l', { a: [0.5, 0.5], raggio: 0.3, colore: 'luce' }, 0.5 * t['1']) }
  const errori = controllaR18(p, { x: ferma })
  assert.ok(errori.some((e) => e.includes('2') && e.includes('àncora'))); assert.ok(errori.some((e) => e.includes('fuoco')))
})

test('controllaR18: una regia che dà un evento a ogni frase e il fuoco alle parole d\'accento passa', () => {
  const p = percorso(['1', 0.2, 0.8], ['2', 0.8, 1.4, 'noi'])
  const buona: Regia = (t, f, k) => {
    k.luce('a', { a: [0.5, 0.5], raggio: 0.3, colore: 'luce' }, 0.5 * t['1'])
    k.onda('b', { a: [0.4, 0.4], raggio: 0.2, colore: 'polvere' }, t['2'])
    if (t['2'] > 0.5) k.fuoco([0.4, 0.4])
  }
  assert.deepEqual(controllaR18(p, { x: buona }), [])
})

test('controllaR18: un blocco senza regia non si controlla', () => {
  assert.deepEqual(controllaR18(percorso(['1', 0.2, 0.8]), {}), [])
})

test('controllaR18 coglie una luce sopra 0,85 e una saetta più grande di mezzo quadro', () => {
  const p = percorso(['1', 0.2, 0.8])
  const troppa: Regia = (t, f, k) => { k.luce('a', { a: [0.5, 0.5], raggio: 0.3, colore: 'luce' }, 0.95 * t['1']) }
  assert.ok(controllaR18(p, { x: troppa }).some((e) => e.includes('luce') && e.includes('0,85')))
  const grande: Regia = (t, f, k) => { k.saetta('s', { da: [0.1, 0.1], a: [0.8, 0.3] }, t['1']) }
  assert.ok(controllaR18(p, { x: grande }).some((e) => e.includes('saetta')))
  const piccola: Regia = (t, f, k) => { k.saetta('s', { da: [0.1, 0.1], a: [0.5, 0.4] }, t['1']) }
  assert.deepEqual(controllaR18(p, { x: piccola }), [])
})

test('controllaR18: una frase che fa muovere solo l\'evento della frase prima non ha un\'àncora sua', () => {
  const p = percorso(['1', 0.2, 0.8], ['2', 0.8, 1.4])
  const solo1: Regia = (t, f, k) => { k.onda('b', { a: [0.4, 0.4], raggio: 0.2, colore: 'polvere' }, t['1']) }
  const errori = controllaR18(p, { x: solo1 })
  assert.equal(errori.length, 1); assert.ok(errori[0].includes('2'))
})

test('R18: ogni blocco della home ha la sua regia e passa il controllo', () => {
  for (const b of HOME.blocchi) assert.ok(REGIE[b.id], `la regia di ${b.id} non è registrata`)
  assert.deepEqual(controllaR18(HOME, REGIE), [])
})

test('apertura: da fermo l\'anello gira con più forza di quando si è scorso; il nome si compone fra il 10 e il 50% e torna alla fine', () => {
  const chiama = (nome: number) => {
    const { kit, chiamate } = kitFinto()
    REGIE.apertura!({ nome, luogo: 0, servizi: 0, scorri: 0 }, { locale: nome, composto: 1, forma: 0, foto: [0, 0, 0], uscita: 0 }, kit)
    const giro = chiamate.find((c) => c.metodo === 'anello.giro')!.valori[0]
    const lettere = chiamate.find((c) => c.metodo === 'anello.nome')!.valori[0]
    return { giro, lettere }
  }
  assert.ok(chiama(0).giro > chiama(1).giro)
  assert.equal(chiama(0).lettere, 0); assert.equal(chiama(0.6).lettere, 1); assert.equal(chiama(1).lettere, 0)
  assert.ok(chiama(0.3).lettere > 0 && chiama(0.3).lettere < 1)
})

test('soglia: le porte si aprono con la seconda frase, non con la prima', () => {
  const chiama = (t1: number, t2: number) => {
    const { kit, chiamate } = kitFinto()
    REGIE.soglia!({ '1': t1, '2': t2 }, { locale: 0.5, composto: 1, forma: 0, foto: [0, 0, 0], uscita: 0 }, kit)
    return Math.max(0, ...chiamate.filter((c) => c.metodo === 'anello.apri').map((c) => c.valori[0]))
  }
  assert.equal(chiama(1, 0), 0); assert.equal(chiama(1, 1), 1)
})

test('tutte le regie restano nei limiti del Kit (orbite ≤ 2, galassie ≤ 1, getti ≤ 6, n dei getti in 0-100)', () => {
  for (const b of HOME.blocchi) {
    const { kit, chiamate } = kitFinto()
    for (let k = 0; k <= 20; k++) {
      const t = Object.fromEntries(b.battute.map((x) => [x.ruolo, k / 20]))
      REGIE[b.id]!(t, { locale: k / 20, composto: 1, forma: 1, foto: [0, 1, 0], uscita: 0 }, kit)
    }
    for (const c of chiamate) {
      assert.ok(c.valori.every(Number.isFinite), `${b.id}: ${c.metodo} ${c.id}: valore non finito`)
      if (c.metodo === 'getto') assert.ok(c.valori[4] >= 0 && c.valori[4] <= 100, `${b.id}: getto ${c.id}: n fuori da 0-100`)
    }
    const id = (m: string) => new Set(chiamate.filter((c) => c.metodo === m).map((c) => c.id)).size
    assert.ok(id('orbita') <= 2, `${b.id}: più di 2 orbite`); assert.ok(id('galassia') <= 1, `${b.id}: più di una galassia`); assert.ok(id('getto') <= 6, `${b.id}: più di 6 getti`)
    assert.ok(id('luce') <= 8, `${b.id}: più di 8 luci`)
  }
})

test('kitFinto: registra ogni chiamata con i valori a 3 decimali; azzera svuota', () => {
  const { kit, chiamate, azzera } = kitFinto()
  kit.luce('l', { a: [0.123456, 0.5], raggio: 0.3, colore: 'luce' }, 0.66666)
  kit.fuoco([0.1, 0.2])
  kit.anello.nome(0.5); kit.campo.accese(0.25)
  assert.deepEqual(chiamate.map((c) => c.metodo), ['luce', 'fuoco', 'anello.nome', 'campo.accese'])
  assert.equal(chiamate[0].id, 'l'); assert.deepEqual(chiamate[0].valori, [0.123, 0.5, 0.3, 0.667])
  assert.deepEqual(chiamate[1].valori, [0.1, 0.2]); assert.deepEqual(chiamate[2].valori, [0.5])
  azzera(); assert.equal(chiamate.length, 0)
  kit.fuoco([0, 0]); assert.equal(chiamate.length, 1)
})

test('kitFinto: ogni metodo del Kit si può chiamare', () => {
  const { kit, chiamate } = kitFinto()
  kit.getto('g', { da: [0.5, 0.5], verso: 'camera', colore: 'polvere', n: 10 }, 0.5)
  kit.getto('g2', { da: [0.5, 0.5], verso: [0.9, 0.1], colore: 'vetro', n: 10, gravita: 1, ampiezza: 2 }, 0.5)
  kit.orbita('o', { centro: [0.5, 0.5], raggio: [0.3, 0.2], n: 8, colore: 'polvere' }, { accese: 3.5, ordine: 0.5, velocita: 1, alfa: 1 })
  kit.galassia('ga', { centro: [0.5, 0.5], raggio: 0.9, bracci: 3 }, { alfa: 1, giro: 0.2 })
  kit.linea('li', { punti: [[0, 0], [1, 1]], colore: 'cromo', spessore: 2, gocce: 4, segni: true }, 0.5)
  kit.saetta('sa', { da: [0.2, 0.2], a: [0.4, 0.4], rami: 3 }, 0.5)
  kit.onda('on', { a: [0.5, 0.5], raggio: 0.2, colore: 'vetro' }, 0.5)
  kit.raggi('ra', { da: [0.5, 0.5], verso: [0.9, 0.9], apertura: 0.4, n: 12, colore: 'luce' }, 0.5)
  kit.pulsa('pu', { a: [0.5, 0.5], raggio: 0.1, colore: 'saette' }, 0.7)
  kit.foto(1, { esposizione: 0.4 })
  kit.anello.nome(0.5); kit.anello.ritorno(0.1); kit.anello.arco('vetro', 0.5); kit.anello.giro(2); kit.anello.caldo(0.3); kit.anello.punto(1); kit.anello.apri(0.2)
  kit.campo.accese(0.5); kit.campo.cercatore(0.5); kit.campo.fiumi(['polvere', 'cromo'], 0.5); kit.campo.vuoto(1)
  assert.equal(chiamate.length, 21)
  assert.ok(chiamate.every((c) => c.valori.every(Number.isFinite)))
})
