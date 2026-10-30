// npm test  (node --test "components/film/*.test.ts")
import { test } from 'node:test'
import assert from 'node:assert/strict'
import * as C from './regia.ts'
import { HOME } from './dati/home.ts'
import { AUTOMAZIONI } from './dati/automazioni.ts'
import { SITI_WEB } from './dati/siti-web.ts'
import { CONTENUTI } from './dati/contenuti.ts'
import { CAMPAGNE } from './dati/campagne.ts'
import { existsSync, readFileSync } from 'node:fs'

const scene = [{ nome: 'studio', da: 2, a: 8.4 }, { nome: 'atlas-1', da: 8, a: 9.4 }, { nome: 'atlas-2', da: 9.4, a: 10.9 }]

test('sceneAttive', () => {
  assert.deepEqual(C.sceneAttive(scene, 5), { a: scene[0], b: undefined, t: 0 })
  assert.equal(C.sceneAttive(scene, 8.2).b?.nome, 'atlas-1'); assert.ok(Math.abs(C.sceneAttive(scene, 8.2).t - 0.5) < 1e-9)
  assert.deepEqual(C.sceneAttive(scene, 9.4), { a: scene[2], b: undefined, t: 0 })   // confini uguali: scatto netto, nessuna sovrapposizione
  assert.deepEqual(C.sceneAttive(scene, 40), { a: scene[2], b: undefined, t: 0 })
})

test('sceneAttive: bordi e sovrapposizioni', () => {
  assert.deepEqual(C.sceneAttive(scene, 0), { a: undefined, b: undefined, t: 0 })            // prima della prima scena
  assert.deepEqual(C.sceneAttive([], 3), { a: undefined, b: undefined, t: 0 })
  assert.deepEqual(C.sceneAttive(scene, 8.4), { a: scene[1], b: undefined, t: 0 })          // fine della sovrapposizione
  const x = C.sceneAttive(scene, 8)                                                          // inizio: a ancora la vecchia, t = 0
  assert.equal(x.a?.nome, 'studio'); assert.equal(x.b?.nome, 'atlas-1'); assert.equal(x.t, 0)
  // tre scene in fila come in un agente: X-1 [0;1,6], X-2 [1,4;3,1], X-3 [2,9;5,4]
  const ag = [{ nome: 'atlas-1', da: 0, a: 1.6 }, { nome: 'atlas-2', da: 1.4, a: 3.1 }, { nome: 'atlas-3', da: 2.9, a: 5.4 }]
  assert.equal(C.sceneAttive(ag, 1.5).a?.nome, 'atlas-1'); assert.equal(C.sceneAttive(ag, 1.5).b?.nome, 'atlas-2')
  assert.deepEqual(C.sceneAttive(ag, 2), { a: ag[1], b: undefined, t: 0 })
  assert.equal(C.sceneAttive(ag, 3).a?.nome, 'atlas-2'); assert.equal(C.sceneAttive(ag, 3).b?.nome, 'atlas-3')
  // scatto netto fra scene che si toccano
  assert.deepEqual(C.sceneAttive([{ nome: 'studio', da: 0, a: 1 }, { nome: 'atlas-1', da: 1, a: 2 }], 1), { a: { nome: 'atlas-1', da: 1, a: 2 }, b: undefined, t: 0 })
})

test('fotogrammaApertura', () => {
  const ap = { conteggio: { pieno: 96, leggero: 64, minimo: 32 }, da: 0, a: 2 }
  assert.equal(C.fotogrammaApertura(ap, 'leggero', 0), 0); assert.equal(C.fotogrammaApertura(ap, 'leggero', 1), 31.5); assert.equal(C.fotogrammaApertura(ap, 'leggero', 2.4), 63); assert.equal(C.fotogrammaApertura(ap, 'minimo', 2), 31)
})

test('fotogrammaApertura: pieno e fuori finestra', () => {
  const ap = { conteggio: { pieno: 96, leggero: 64, minimo: 32 }, da: 0, a: 2 }
  assert.equal(C.fotogrammaApertura(ap, 'pieno', 0), 0)
  assert.equal(C.fotogrammaApertura(ap, 'pieno', 1), 47.5)
  assert.equal(C.fotogrammaApertura(ap, 'pieno', 2), 95)
  assert.equal(C.fotogrammaApertura(ap, 'pieno', 30), 95)
  assert.equal(C.fotogrammaApertura(ap, 'pieno', -1), 0)
})

test('indiceAtto e opacita', () => {
  const atti = [{ id: 'a0', da: 0, a: 2.4 }, { id: 'a1', da: 2.4, a: 8 }] as any
  assert.equal(C.indiceAtto(atti, -1), -1); assert.equal(C.indiceAtto(atti, 2.4), 1)
  assert.equal(C.opacita({ da: 2.5, a: 3 }, 2.75), 1)
})

test('indiceAtto e opacita: casi limite', () => {
  const atti = [{ id: 'a0', da: 0, a: 2.4 }, { id: 'a1', da: 2.4, a: 8 }] as any
  assert.equal(C.indiceAtto(atti, 0), 0); assert.equal(C.indiceAtto(atti, 2.39), 0); assert.equal(C.indiceAtto(atti, 99), 1)
  assert.equal(C.indiceAtto([], 3), -1)
  assert.equal(C.opacita({ da: 2.5, a: 3 }, 2.5), 0); assert.equal(C.opacita({ da: 2.5, a: 3 }, 3), 0)
  assert.equal(C.opacita({ da: 2.5, a: 3 }, 2), 0)
  const mezza = C.opacita({ da: 0, a: 1, s: 0.5 }, 0.25)       // s esplicito: metà della rampa → 0,5
  assert.ok(Math.abs(mezza - 0.5) < 1e-9)
  const predef = C.opacita({ da: 0, a: 1 }, 0.09)               // s di default 0,18: metà rampa → 0,5
  assert.ok(Math.abs(predef - 0.5) < 1e-9)
})

test('zoomScena', () => {
  assert.equal(C.zoomScena({ nome: 'studio', da: 0, a: 4 }, 2), 1)
  const s = { nome: 'atlas-2', da: 10, a: 12, zoom: [1, 1.04] as [number, number] }
  assert.equal(C.zoomScena(s, 9), 1); assert.equal(C.zoomScena(s, 12), 1.04); assert.equal(C.zoomScena(s, 40), 1.04)
  assert.ok(Math.abs(C.zoomScena(s, 11) - 1.02) < 1e-9)
})

test('valida', () => {
  assert.deepEqual(C.valida({ T: 32, scene, atti: [] }), [])
  assert.ok(C.valida({ T: 32, scene: [{ nome: 'x', da: 1, a: 0 }], atti: [] }).length >= 2)
})

test('SCENE_NOTE', () => {
  assert.equal(C.SCENE_NOTE.length, 14)
  for (const n of ['studio', 'apertura', 'atlas-1', 'janus-2', 'prometheus-3', 'hermes-3']) assert.ok(C.SCENE_NOTE.includes(n), n)
})

test('valida: errori singoli', () => {
  const ok = { T: 32, scene, atti: [] as any[] }
  assert.ok(C.valida({ ...ok, scene: [{ nome: 'studio', da: 0, a: 33 }] }).length === 1)          // oltre T
  assert.ok(C.valida({ ...ok, scene: [{ nome: 'studio', da: -1, a: 3 }] }).length === 1)          // prima di 0
  assert.ok(C.valida({ ...ok, scene: [{ nome: 'studio', da: 0, a: 32 }] }).length === 0)          // fino a T esatto
  assert.ok(C.valida({ ...ok, scene: [{ nome: 'sconosciuta', da: 0, a: 3 }] }).length === 1)      // nome non in SCENE_NOTE
  const atto = (id: string, da: number, battute: any[] = []) => ({ id, nome: id, etichetta: id, da, a: da + 1, battute })
  assert.deepEqual(C.valida({ ...ok, atti: [atto('a', 0), atto('b', 0), atto('c', 2)] }), [])     // da uguali: ammessi
  assert.ok(C.valida({ ...ok, atti: [atto('a', 3), atto('b', 1)] }).length === 1)                 // fuori ordine
  const bt = { tipo: 'frase', testo: 'x', da: 2, a: 2 }
  assert.ok(C.valida({ ...ok, atti: [atto('a', 0, [bt])] }).length === 1)                         // battuta a <= da
  assert.ok(C.valida({ ...ok, atti: [atto('a', 0, [{ ...bt, a: 3 }])] }).length === 0)
  assert.ok(C.valida({ ...ok, scene: [{ nome: 'studio', da: 0, a: NaN }] }).length >= 1)          // NaN non passa in silenzio
})

test('valida: regia della home (tempi reali)', () => {
  const agente = (X: string, base: number, fine = base + 5.4) => [
    { nome: `${X}-1`, da: base, a: base + 1.6 },
    { nome: `${X}-2`, da: base + 1.4, a: base + 3.1, zoom: [1, 1.04] as [number, number] },
    { nome: `${X}-3`, da: base + 2.9, a: fine, zoom: [1, 1.05] as [number, number] },
  ]
  const home = {
    T: 32,
    apertura: { conteggio: { pieno: 96, leggero: 64, minimo: 32 }, da: 0, a: 2 },
    scene: [
      { nome: 'apertura', da: 0, a: 2.6 }, { nome: 'studio', da: 2, a: 8.4 },
      ...agente('atlas', 8), ...agente('janus', 13), ...agente('prometheus', 18), ...agente('hermes', 23, 28.5),
      { nome: 'studio', da: 28, a: 32 },
    ],
    atti: [] as any[],
    convergenza: [31.2, 32] as [number, number],
    pulsante: { da: 31.7, testo: 'Richiedi un preventivo', href: '#preventivo', sotto: 'x' },
  }
  assert.deepEqual(C.valida(home), [])
})

test('HOME valida', () => assert.deepEqual(C.valida(HOME), []))

test('HOME: battute di testi.md', () => {
  const testi = JSON.stringify(HOME)
  for (const f of ['Tu fai il tuo mestiere.', 'Il peso lo porto io.', 'Chi ti cerca, trova me.', 'Il bello c\'è già. Io lo accendo.', 'Porto da te chi ancora non ti conosce.', 'La prossima può essere la tua.']) assert.ok(testi.includes(f), f)
})

test('HOME: scene in ordine di da, apertura e studio dove dice la regia', () => {
  HOME.scene.forEach((s, i) => { if (i > 0) assert.ok(s.da >= HOME.scene[i - 1].da, `${s.nome} prima di ${HOME.scene[i - 1].nome}`) })
  const x = C.sceneAttive(HOME.scene, 2.3)                       // l'ultimo fotogramma del cerchio sfuma nello studio
  assert.equal(x.a?.nome, 'apertura'); assert.equal(x.b?.nome, 'studio'); assert.ok(x.t > 0 && x.t < 1)
  assert.equal(C.sceneAttive(HOME.scene, 5).a?.nome, 'studio')
  const h = C.sceneAttive(HOME.scene, 28.2)                      // Hermes (fine 28,5) sfuma nello studio del finale
  assert.equal(h.a?.nome, 'hermes-3'); assert.equal(h.b?.nome, 'studio')
  assert.equal(C.sceneAttive(HOME.scene, 32).a?.nome, 'studio')
})

test('HOME: accenti dentro la frase', () => {
  for (const at of HOME.atti) for (const b of at.battute) if (b.accento) assert.ok(b.testo.includes(b.accento), `${at.id}: ${b.testo}`)
})

// ---------- Le quattro pagine servizio (Compito 9) ----------
const SERVIZI_REGIA = { AUTOMAZIONI, SITI_WEB, CONTENUTI, CAMPAGNE }

test('pagine servizio: valida() senza errori', () => {
  for (const [nome, r] of Object.entries(SERVIZI_REGIA)) assert.deepEqual(C.valida(r), [], nome)
})

test('pagine servizio: stessa struttura per tutte (R8) e nessun atto Lavori (R7)', () => {
  const id = (r: C.Regia) => r.atti.map((a) => a.id)
  assert.equal(CAMPAGNE.atti.length, SITI_WEB.atti.length)
  assert.deepEqual(id(CAMPAGNE), id(SITI_WEB))
  assert.deepEqual(id(CONTENUTI), id(SITI_WEB))
  assert.deepEqual(id(AUTOMAZIONI), id(SITI_WEB))
  assert.deepEqual(SITI_WEB.atti.map((a) => a.etichetta), ['00 · Apertura', '01 · Cosa facciamo', '02 · Come lavoriamo', '04 · Richiedi un preventivo'])
  for (const r of Object.values(SERVIZI_REGIA)) { assert.ok(!r.atti.some((a) => a.etichetta.startsWith('03') || a.nome === "Lavori"), 'atto Lavori assente'); assert.ok(!JSON.stringify(r).includes('/lavori'), 'nessun collegamento a /lavori') }
})

test('pagine servizio: niente pilota, in arrivo, beta, prezzi', () => {
  for (const [nome, r] of Object.entries(SERVIZI_REGIA)) {
    const t = JSON.stringify(r).toLowerCase()
    for (const vietata of ['pilota', 'in arrivo', 'beta', '€']) assert.ok(!t.includes(vietata), `${nome}: ${vietata}`)
  }
})

test('pagine servizio: solo AUTOMAZIONI porta a /studi-dentistici, come collegamento semplice', () => {
  assert.ok(JSON.stringify(AUTOMAZIONI).includes('/studi-dentistici'))
  for (const r of [SITI_WEB, CONTENUTI, CAMPAGNE]) assert.ok(!JSON.stringify(r).includes('/studi-dentistici'))
  const cartoline = AUTOMAZIONI.atti.flatMap((a) => a.battute).filter((b) => b.tipo === 'cartolina')
  assert.equal(cartoline.length, 1)
  assert.deepEqual(cartoline[0], { tipo: 'cartolina', testo: 'Settore specializzato: studi dentistici', nota: 'Per gli studi dentistici abbiamo un percorso dedicato.', href: '/studi-dentistici', da: 7.6, a: Infinity })
})

test('pagine servizio: tempi della tabella (T 9, scene X-2 e X-3, convergenza, pulsante)', () => {
  const att = { AUTOMAZIONI: 'atlas', SITI_WEB: 'janus', CONTENUTI: 'prometheus', CAMPAGNE: 'hermes' } as const
  for (const [nome, r] of Object.entries(SERVIZI_REGIA)) {
    const x = att[nome as keyof typeof att]
    assert.equal(r.T, 9, nome)
    assert.deepEqual(r.scene, [{ nome: `${x}-2`, da: 0, a: 6.6, zoom: [1, 1.06] }, { nome: `${x}-3`, da: 6.2, a: 9 }], nome)
    assert.deepEqual(r.atti.map((a) => [a.da, a.a]), [[0, 1.4], [1.4, 6.2], [6.2, 8], [8, 9]], nome)
    assert.deepEqual(r.convergenza, [8.2, 9], nome)
    assert.deepEqual(r.pulsante, { da: 8.7, testo: 'Richiedi un preventivo', href: '#preventivo', sotto: 'Raccontaci cosa ti serve. Senza impegno, ti risponde Bruno entro un giorno lavorativo.' }, nome)
    assert.equal(r.apertura, undefined, nome)
    for (const a of r.atti) { assert.ok(a.materia, `${nome}/${a.id}: materia`); assert.equal(a.creatura, undefined, `${nome}/${a.id}: nessuna creatura ritagliata`) }
    assert.equal(C.sceneAttive(r.scene, 6.4).b?.nome, `${x}-3`)
  }
  assert.deepEqual([AUTOMAZIONI, SITI_WEB, CONTENUTI, CAMPAGNE].map((r) => r.atti[0].materia), ['polvere', 'vetro', 'saette', 'cromo'])
})

test('pagine servizio: ogni frase di "Cosa facciamo" ha burst, finestre uguali, accento dentro la frase', () => {
  for (const [nome, r] of Object.entries(SERVIZI_REGIA)) {
    const frasi = r.atti[1].battute.filter((b) => b.tipo === 'frase')
    assert.ok(frasi.length === 8 || frasi.length === 9, `${nome}: ${frasi.length} frasi`)
    const w = 4.8 / frasi.length
    frasi.forEach((f, i) => {
      assert.equal(f.burst, true, `${nome} frase ${i}: burst`)
      assert.equal(f.s, 0.15)
      assert.ok(Math.abs(f.da - (1.4 + i * w)) < 1e-9 && Math.abs(f.a - (1.4 + (i + 1) * w)) < 1e-9, `${nome} frase ${i}: finestra`)
      if (f.accento) assert.ok(f.testo.includes(f.accento), `${nome}: ${f.testo}`)
    })
    for (const a of r.atti) for (const b of a.battute) assert.ok(b.da >= 0 && (b.a <= r.T || b.a === Infinity), `${nome}: ${b.testo}`)
  }
})

// Testi di testi.md §4 copiati a mano qui: prima e ultima frase, motto, passo 3 di ogni servizio.
test('pagine servizio: testi di testi.md §4 (prima e ultima frase, motto, passo 3)', () => {
  const attesi: [C.Regia, string, string, string, string, string, number][] = [
    [AUTOMAZIONI, 'Risponde ai messaggi e alle chiamate perse, anche di notte.', 'E nessun cliente resta senza risposta.', 'Il peso lo porto io.', '03 · Avvio', "L'automazione parte e la seguiamo da vicino nelle prime settimane.", 8],
    [SITI_WEB, "Un sito all'altezza di quello che fai.", 'Chi arriva capisce. Chi capisce prenota.', 'Chi ti cerca, trova me.', '03 · Online', 'Il sito va online e ti spieghiamo tutto. È tuo.', 9],
    [CONTENUTI, 'Post, caroselli e video brevi sulla tua attività.', 'Chi ti segue ti riconosce. Chi non ti conosce si ferma.', "Il bello c'è già. Io lo accendo.", '03 · Primi contenuti', 'Ricevi i primi contenuti e li approvi tu, uno per uno.', 8],
    [CAMPAGNE, 'Pubblicità su Instagram, Facebook e Google.', 'Sempre sotto i tuoi occhi.', 'Porto da te chi ancora non ti conosce.', '03 · Partenza', 'La campagna parte e ricevi il resoconto, con i numeri veri.', 8],
  ]
  for (const [r, prima, ultima, motto, passo3, riga3, n] of attesi) {
    const f = r.atti[1].battute.map((b) => b.testo)
    assert.equal(f.length, n); assert.equal(f[0], prima); assert.equal(f[n - 1], ultima)
    assert.equal(r.atti[0].battute.find((b) => b.tipo === 'motto')?.testo, motto)
    const passi = r.atti[2].battute.filter((b) => b.tipo === 'passo')
    assert.deepEqual(passi.map((p) => p.testo), ['01 · Chiamata', '02 · Proposta', passo3])
    assert.deepEqual(passi.map((p) => p.nota), ['Una chiamata gratuita, senza impegno. Ci racconti la tua attività e capiamo cosa ti serve.', 'Ti scriviamo cosa facciamo, i tempi e un prezzo chiaro. Nessuna sorpresa dopo.', riga3])
    assert.deepEqual(passi.map((p) => [p.da, p.a]), [[6.5, 7], [7, 7.5], [7.5, 8]])
  }
})

// Tutte le frasi (e le parole in grassetto) contro il file vero di testi.md, se c'è (nel repo pubblico non c'è: si salta).
// Per farlo girare si indica il percorso del file nella variabile TESTI_MD, ad esempio:
//   TESTI_MD=<percorso>/agenzia-360/testi.md npm test
const TESTI_MD = process.env.TESTI_MD ?? ''
test('pagine servizio: tutte le frasi uguali a testi.md §4 (se il file c\'è)', { skip: !TESTI_MD || !existsSync(TESTI_MD) }, () => {
  const md = readFileSync(TESTI_MD, 'utf8')
  const sezione = md.slice(md.indexOf('## 4. Le pagine dei servizi'), md.indexOf('## 5. Il modulo'))
  const per: [string, C.Regia][] = [['### 4.1', AUTOMAZIONI], ['### 4.2', SITI_WEB], ['### 4.3', CONTENUTI], ['### 4.4', CAMPAGNE]]
  per.forEach(([titolo, r], i) => {
    const da = sezione.indexOf(titolo), a = i < 3 ? sezione.indexOf(per[i + 1][0]) : sezione.indexOf('**`04 · Richiedi')
    const blocco = sezione.slice(da, a)
    const cosa = blocco.slice(blocco.indexOf('**`01 · Cosa facciamo`**'), blocco.indexOf('**`02 · Come lavoriamo`**'))
    const righe = Array.from(cosa.matchAll(/^\d+\. (.+)$/gm), (m) => m[1])
    const dati = r.atti[1].battute
    assert.equal(righe.length, dati.length)
    righe.forEach((riga, k) => {
      const grassetto = Array.from(riga.matchAll(/\*\*(.+?)\*\*/g), (m) => m[1])
      assert.equal(riga.replace(/\*\*/g, ''), dati[k].testo)
      assert.deepEqual(grassetto, dati[k].accento ? [dati[k].accento] : [], dati[k].testo)
    })
  })
})

test('posizioneAccento: parola intera, non un pezzo di un\'altra parola', () => {
  assert.equal(C.posizioneAccento('Sito, dominio e account intestati a te.', 'te'), 36)
  assert.equal(C.posizioneAccento('Un sito all\'altezza di quello che fai.', 'fai'), 34)
  assert.equal(C.posizioneAccento('Troverà te, o un altro.', 'un altro'), 14)
  assert.equal(C.posizioneAccento('Tu dici sì. Pubblicato.', 'Pubblicato'), 12)
  assert.equal(C.posizioneAccento('La prossima può essere la tua.', 'la tua'), 23)
  assert.equal(C.posizioneAccento('niente di tutto questo', 'te'), -1)
  assert.equal(C.posizioneAccento('qualcosa', undefined), -1)
})

test('pagine servizio: ogni accento è una parola intera dentro la frase', () => {
  for (const r of [AUTOMAZIONI, SITI_WEB, CONTENUTI, CAMPAGNE]) for (const a of r.atti) for (const b of a.battute) if (b.accento) assert.ok(C.posizioneAccento(b.testo, b.accento) >= 0, b.testo)
  for (const b of HOME.atti.flatMap((a) => a.battute)) if (b.accento) assert.ok(C.posizioneAccento(b.testo, b.accento) >= 0, b.testo)
})
