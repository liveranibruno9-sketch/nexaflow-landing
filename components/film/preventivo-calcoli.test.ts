// npm test  (node --test "components/film/*.test.ts")
import { test } from 'node:test'
import assert from 'node:assert/strict'
import * as P from './preventivo-calcoli.ts'

const BUONA = { nome: 'A', attivita: 'B', contatto: '3500164456', servizio: 'siti-web', budget: 'non-so', consenso: true }

test('tipoContatto: email, telefono o nessuno dei due', () => {
  assert.equal(P.tipoContatto('bruno@x.it'), 'email')
  assert.equal(P.tipoContatto('+39 350 016 4456'), 'telefono')
  assert.equal(P.tipoContatto('ciao'), null)
  assert.equal(P.tipoContatto(''), null)
  assert.equal(P.tipoContatto('  bruno.liverani@agentistudio.it  '), 'email')
  assert.equal(P.tipoContatto('bruno@x'), null)          // manca il punto dopo la chiocciola
  assert.equal(P.tipoContatto('0546.123-456'), 'telefono') // punti e trattini si tolgono
  assert.equal(P.tipoContatto('1234567'), null)          // 7 cifre: troppo poche
  assert.equal(P.tipoContatto('1234567890123456'), null) // 16 cifre: troppe
  assert.equal(P.tipoContatto('350 abc 4456'), null)
})

test('le scelte del modulo', () => {
  assert.deepEqual([...P.SERVIZI], ['automazioni', 'siti-web', 'contenuti', 'campagne', 'non-so'])
  assert.deepEqual([...P.BUDGET], ['fino-1000', '1000-3000', 'oltre-3000', 'non-so'])
  for (const s of P.SERVIZI) assert.ok(P.ETICHETTE_SERVIZIO[s], s)
  for (const b of P.BUDGET) assert.ok(P.ETICHETTE_BUDGET[b], b)
  assert.equal(P.ETICHETTE_SERVIZIO['non-so'], 'Non lo so ancora')
  assert.equal(P.ETICHETTE_BUDGET['1000-3000'], '1.000-3.000 €')
})

test('validaPreventivo: un corpo vuoto o non oggetto viene respinto', () => {
  assert.equal(P.validaPreventivo({}).ok, false)
  assert.equal(P.validaPreventivo(null).ok, false)
  assert.equal(P.validaPreventivo('ciao').ok, false)
  assert.equal(P.validaPreventivo([BUONA]).ok, false)
})

test('validaPreventivo: una richiesta completa passa, ripulita, con prova falsa', () => {
  const r = P.validaPreventivo({ ...BUONA, nome: '  A  ' })
  assert.equal(r.ok, true)
  if (!r.ok) return
  assert.equal(r.dati.prova, false)
  assert.deepEqual(r.dati, {
    nome: 'A', attivita: 'B', contatto: '3500164456', servizio: 'siti-web', budget: 'non-so', messaggio: '', consenso: true, prova: false,
  })
})

test('validaPreventivo: prova vera solo con il booleano true', () => {
  const r = P.validaPreventivo({ ...BUONA, prova: true })
  assert.equal(r.ok && r.dati.prova, true)
  const s = P.validaPreventivo({ ...BUONA, prova: 'true' })
  assert.equal(s.ok && s.dati.prova, false)
})

test('validaPreventivo: il campo trappola compilato respinge la richiesta', () => {
  assert.deepEqual(P.validaPreventivo({ ...BUONA, _gotcha: 'x' }), { ok: false, errore: 'Richiesta non valida' })
  assert.equal(P.validaPreventivo({ ...BUONA, _gotcha: '' }).ok, true)
})

test('validaPreventivo: servizio e budget solo fra le scelte del modulo', () => {
  assert.equal(P.validaPreventivo({ ...BUONA, servizio: 'altro' }).ok, false)
  assert.equal(P.validaPreventivo({ ...BUONA, servizio: undefined }).ok, false)
  assert.equal(P.validaPreventivo({ ...BUONA, budget: '5000' }).ok, false)
  for (const s of P.SERVIZI) assert.equal(P.validaPreventivo({ ...BUONA, servizio: s }).ok, true, s)
  for (const b of P.BUDGET) assert.equal(P.validaPreventivo({ ...BUONA, budget: b }).ok, true, b)
})

test('validaPreventivo: campi obbligatori, contatto riconoscibile, consenso', () => {
  assert.equal(P.validaPreventivo({ ...BUONA, nome: ' ' }).ok, false)
  assert.equal(P.validaPreventivo({ ...BUONA, attivita: '' }).ok, false)
  assert.equal(P.validaPreventivo({ ...BUONA, contatto: '' }).ok, false)
  assert.equal(P.validaPreventivo({ ...BUONA, contatto: 'ciao' }).ok, false)
  assert.equal(P.validaPreventivo({ ...BUONA, contatto: 'bruno@x.it' }).ok, true)
  assert.equal(P.validaPreventivo({ ...BUONA, consenso: false }).ok, false)
  assert.equal(P.validaPreventivo({ ...BUONA, consenso: 'on' }).ok, false)
  const { consenso: _, ...senza } = BUONA
  assert.equal(P.validaPreventivo(senza).ok, false)
})

test('validaPreventivo: lunghezze massime (200, messaggio 1000)', () => {
  assert.equal(P.validaPreventivo({ ...BUONA, nome: 'x'.repeat(200) }).ok, true)
  assert.equal(P.validaPreventivo({ ...BUONA, nome: 'x'.repeat(201) }).ok, false)
  assert.equal(P.validaPreventivo({ ...BUONA, attivita: 'x'.repeat(201) }).ok, false)
  assert.equal(P.validaPreventivo({ ...BUONA, messaggio: 'x'.repeat(1000) }).ok, true)
  assert.equal(P.validaPreventivo({ ...BUONA, messaggio: 'x'.repeat(1001) }).ok, false)
})

test('validaPreventivo: ogni errore ha un messaggio', () => {
  for (const corpo of [{}, { ...BUONA, contatto: 'ciao' }, { ...BUONA, servizio: 'altro' }, { ...BUONA, consenso: false }]) {
    const r = P.validaPreventivo(corpo)
    assert.equal(r.ok, false)
    if (!r.ok) assert.ok(r.errore.length > 0)
  }
})
