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

const CONTROLLI = /[\u0000-\u001f\u007f]/

test('validaPreventivo: a capo e controlli nei campi a riga singola diventano uno spazio (niente intestazioni email)', () => {
  const r = P.validaPreventivo({ ...BUONA, attivita: 'x\r\nBcc: v@e.it' })
  assert.equal(r.ok, true)
  if (r.ok) assert.equal(r.dati.attivita, 'x Bcc: v@e.it')
  const s = P.validaPreventivo({ ...BUONA, nome: 'Ma\tria\u0000 Rossi\n', contatto: '350\t016\u00004456' })
  assert.equal(s.ok, true)
  if (s.ok) {
    assert.equal(s.dati.nome, 'Ma ria Rossi')
    assert.equal(s.dati.contatto, '350 016 4456')
    for (const c of [s.dati.nome, s.dati.attivita, s.dati.contatto]) assert.ok(!CONTROLLI.test(c), c)
  }
  const t = P.validaPreventivo({ ...BUONA, nome: 'A\u007fB   C' })
  assert.equal(t.ok && t.dati.nome, 'A B C')
})

test('validaPreventivo: nel messaggio restano gli a capo, spariscono gli altri controlli', () => {
  const r = P.validaPreventivo({ ...BUONA, messaggio: '  riga uno\r\nriga\tdue\u0000\nriga tre  ' })
  assert.equal(r.ok, true)
  if (r.ok) assert.equal(r.dati.messaggio, 'riga uno\nrigadue\nriga tre')
})

test('validaPreventivo: i limiti di lunghezza valgono dopo la pulizia', () => {
  // 203 caratteri grezzi, 200 dopo la pulizia: passa. Un controllo in mezzo diventa uno spazio (conta 1): 201, no
  assert.equal(P.validaPreventivo({ ...BUONA, nome: '\u0001\u0002' + 'x'.repeat(200) + '\u0003' }).ok, true)
  assert.equal(P.validaPreventivo({ ...BUONA, nome: 'x'.repeat(100) + '\u0001' + 'x'.repeat(100) }).ok, false)
  assert.equal(P.validaPreventivo({ ...BUONA, messaggio: 'x'.repeat(500) + '\u0000\u0001\u0008' + 'x'.repeat(500) }).ok, true)
  assert.equal(P.validaPreventivo({ ...BUONA, messaggio: 'x'.repeat(500) + '\n' + 'x'.repeat(500) }).ok, false)
  // solo controlli = campo vuoto
  assert.equal(P.validaPreventivo({ ...BUONA, nome: '\r\n\t\u0000' }).ok, false)
})

test('provaAmmessa: prova:true vale solo fuori dal dominio vero', () => {
  for (const h of ['agentistudio.it', 'www.agentistudio.it', 'WWW.AGENTISTUDIO.IT:443', 'agentistudio.it.', 'www.agentistudio.it:8080']) {
    assert.equal(P.provaAmmessa(h), false, h)
  }
  for (const h of ['localhost:3000', 'nexaflow-landing-git-agenzia-360-liveranibruno9-6207s-projects.vercel.app', 'evil-agentistudio.it', 'agentistudio.it.evil.com', 'sub.agentistudio.it', '']) {
    assert.equal(P.provaAmmessa(h), true, h)
  }
})
