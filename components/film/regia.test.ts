// npm test  (node --test "components/film/*.test.ts")
import { test } from 'node:test'
import assert from 'node:assert/strict'
import * as C from './regia.ts'
import { HOME } from './dati/home.ts'

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
