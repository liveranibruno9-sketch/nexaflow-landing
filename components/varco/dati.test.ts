// npm test  ·  dati della home del varco (piano-costruzione-v2, compito 3): struttura, ruoli, testi di testi.md §3, guardie R4 e R7
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { HOME } from './dati/home.ts'
import { posizioneAccento } from './testo.ts'
import type { Blocco, Percorso } from './tipi.ts'

const ruoliDi = (b: Blocco) => b.battute.map((x) => x.ruolo)
const battuta = (b: Blocco, ruolo: string) => b.battute.find((x) => x.ruolo === ruolo)!
const tratti = HOME.blocchi.filter((b) => b.tipo === 'tratto')

test('home: sette blocchi contigui, dall\'inizio alla lunghezza (31,6)', () => {
  assert.equal(HOME.lunghezza, 31.6)
  assert.deepEqual(HOME.blocchi.map((b) => b.id), ['apertura', 'soglia', 'atlas', 'janus', 'prometheus', 'hermes', 'finale'])
  assert.deepEqual(HOME.blocchi.map((b) => b.tipo), ['apertura', 'soglia', 'tratto', 'tratto', 'tratto', 'tratto', 'finale'])
  assert.equal(HOME.blocchi[0].da, 0); assert.equal(HOME.blocchi[6].a, HOME.lunghezza)
  HOME.blocchi.forEach((b, i) => { if (i > 0) assert.equal(b.da, HOME.blocchi[i - 1].a, `${b.id} non comincia dove finisce ${HOME.blocchi[i - 1].id}`) })
})

test('home: ogni battuta sta dentro [0; lunghezza] e ha a > da', () => {
  for (const b of HOME.blocchi) for (const x of b.battute) {
    assert.ok(x.da >= 0 && x.a <= HOME.lunghezza, `${b.id}/${x.ruolo}: fuori dal percorso`)
    assert.ok(x.a > x.da, `${b.id}/${x.ruolo}: a non è dopo da`)
  }
})

test('home: ruoli unici nel blocco e conformi alla regola', () => {
  const uno = (n: number) => Array.from({ length: n }, (_, i) => String(i + 1))
  const attesi: Record<string, string[]> = {
    apertura: ['nome', 'luogo', 'servizi', 'scorri'],
    soglia: uno(11),
    finale: [...uno(6), 'pulsante'],
  }
  for (const t of tratti) attesi[t.id] = ['problema', 'nome', 'motto', 'beneficio-1', 'beneficio-2', 'beneficio-3', 'beneficio-4', 'link']
  for (const b of HOME.blocchi) {
    assert.equal(new Set(ruoliDi(b)).size, b.battute.length, `${b.id}: ruoli doppi`)
    assert.deepEqual([...ruoliDi(b)].sort(), [...attesi[b.id]].sort(), `${b.id}: ruoli diversi dalla regola`)
  }
})

test('tratti: il problema viene prima del nome, il nome prima del motto, il motto prima dei benefici (D41)', () => {
  assert.equal(tratti.length, 4)
  for (const t of tratti) {
    const da = (r: string) => battuta(t, r).da
    assert.ok(da('problema') < da('nome') && da('nome') < da('motto') && da('motto') < da('beneficio-1'), t.id)
    assert.ok(da('beneficio-1') < da('beneficio-2') && da('beneficio-2') < da('beneficio-3') && da('beneficio-3') < da('beneficio-4'), t.id)
  }
})

test('tratti: finestre di tempo come nella tabella del piano (b = inizio del tratto)', () => {
  for (const t of tratti) {
    const b = t.da
    const finestra = (r: string) => [battuta(t, r).da, battuta(t, r).a].map((x) => Math.round((x - b) * 100) / 100)
    assert.deepEqual(finestra('problema'), [0.4, 1.0]); assert.deepEqual(finestra('nome'), [1.2, 2.5]); assert.deepEqual(finestra('motto'), [1.6, 2.5])
    assert.deepEqual(finestra('beneficio-1'), [2.8, 3.3]); assert.deepEqual(finestra('beneficio-4'), [4.3, 4.8]); assert.deepEqual(finestra('link'), [3.8, 5.0])
    assert.equal(Math.round((t.a - t.da) * 1000) / 1000, 5.5)
  }
})

test('tratti: materia, immagini, uscita e zone da sfumare (storyboard 5.4)', () => {
  assert.deepEqual(tratti.map((t) => [t.materia, t.uscita]), [['polvere', 'entra'], ['vetro', 'entra'], ['saette', 'accanto'], ['cromo', 'accanto']])
  for (const t of tratti) assert.deepEqual(t.immagini, [`${t.id}-1`, `${t.id}-2`, `${t.id}-3`])
  assert.deepEqual(tratti[0].sfuma, { 'atlas-1': { basso: 0.25 } }); assert.deepEqual(tratti[1].sfuma, { 'janus-3': { alto: 0.35 } })
  assert.deepEqual(tratti[2].sfuma, { 'prometheus-1': { basso: 0.25 } })
})

test('home: etichette della testata e collegamenti ai servizi', () => {
  assert.deepEqual(HOME.blocchi.map((b) => b.etichetta), ['00 · Apertura', 'Lo studio', '01 · Automazioni', '02 · Siti web', '03 · Contenuti', '04 · Campagne', 'Il finale'])
  assert.deepEqual(tratti.map((t) => [battuta(t, 'link').testo, battuta(t, 'link').href]), [
    ['Le automazioni →', '/automazioni'], ['I siti web →', '/siti-web'], ['I contenuti →', '/contenuti'], ['Le campagne →', '/campagne']])
  assert.deepEqual(tratti.map((t) => battuta(t, 'nome').testo), ['Atlas', 'Janus', 'Prometheus', 'Hermes'])
})

test('home: soglia e finale, finestre del piano; il pulsante resta acceso fino alla fine', () => {
  const soglia = HOME.blocchi[1], finale = HOME.blocchi[6]
  assert.deepEqual([battuta(soglia, '1').da, battuta(soglia, '1').a], [0.7, 1.15]); assert.deepEqual([battuta(soglia, '11').da, battuta(soglia, '11').a], [5.1, 5.6])
  assert.deepEqual([battuta(finale, '1').da, battuta(finale, '1').a], [27.8, 28.3]); assert.deepEqual([battuta(finale, '6').da, battuta(finale, '6').a], [30.35, 30.8])
  const p = battuta(finale, 'pulsante')
  assert.equal(p.tipo, 'pulsante'); assert.equal(p.testo, 'Richiedi un preventivo'); assert.equal(p.href, '#preventivo')
  assert.equal(p.nota, 'Senza impegno. Ti risponde Bruno entro un giorno lavorativo.'); assert.equal(p.da, 30.8); assert.equal(p.a, HOME.lunghezza)
})

test('home: apertura, le battute con da = 0 sono visibili subito', () => {
  const ap = HOME.blocchi[0]
  assert.deepEqual(['nome', 'luogo', 'servizi', 'scorri'].map((r) => [battuta(ap, r).da, battuta(ap, r).a]), [[0, 0.6], [0, 0.6], [0, 0.6], [0, 0.5]])
  assert.equal(battuta(ap, 'nome').testo, 'Agenti Studio'); assert.equal(battuta(ap, 'luogo').testo, 'Agenzia AI · Faenza, Romagna')
  assert.equal(battuta(ap, 'servizi').testo, 'Automazioni · Siti web · Contenuti · Campagne'); assert.equal(battuta(ap, 'scorri').testo, 'Scorri')
})

test('home: ogni accento sta dentro il suo testo, come parola intera', () => {
  for (const b of HOME.blocchi) for (const x of b.battute) if (x.accento) assert.ok(posizioneAccento(x.testo, x.accento) >= 0, `${b.id}/${x.ruolo}: «${x.accento}» non è in «${x.testo}»`)
})

test('home: nessun prezzo (R4)', () => {
  assert.ok(!JSON.stringify(HOME).includes('€'))
})

// R7: nessun blocco o battuta "Lavori" finché la bacheca è vuota. "Come lavoriamo" è ammesso: si cerca la parola intera.
function trovaLavori(p: Percorso): string[] {
  const trovati: string[] = []
  const lavori = (testo: string) => posizioneAccento(testo.toLowerCase(), 'lavori') >= 0
  for (const b of p.blocchi) {
    for (const [campo, valore] of [['id', b.id], ['etichetta', b.etichetta]] as const) if (lavori(valore)) trovati.push(`blocco ${b.id}: ${campo} «${valore}»`)
    for (const x of b.battute) {
      if (lavori(x.testo)) trovati.push(`blocco ${b.id}: battuta «${x.testo}»`)
      if (x.href !== undefined && x.href.includes('/lavori')) trovati.push(`blocco ${b.id}: href «${x.href}»`)
    }
  }
  return trovati
}

test('la guardia R7 scatta davvero: coglie un blocco Lavori e non "Come lavoriamo"', () => {
  const blocco = (etichetta: string, testo = 'Ciao.', id = 'x'): Blocco => ({ id, tipo: 'soglia', da: 0, a: 1, etichetta, battute: [{ tipo: 'frase', testo, ruolo: '1', da: 0, a: 1 }] })
  const p = (b: Blocco): Percorso => ({ lunghezza: 1, blocchi: [b] })
  assert.deepEqual(trovaLavori(p(blocco('02 · Come lavoriamo'))), [])
  assert.equal(trovaLavori(p(blocco('03 · Lavori'))).length, 1)
  assert.equal(trovaLavori(p(blocco('03 · altro', 'Guarda i nostri lavori'))).length, 1)
  assert.equal(trovaLavori(p(blocco('03 · altro', 'Ciao.', 'lavori'))).length, 1)           // anche un blocco con id «lavori» è un blocco Lavori
  assert.equal(trovaLavori(p({ ...blocco('03 · altro'), battute: [{ tipo: 'link', testo: 'Vai', ruolo: '1', da: 0, a: 1, href: '/lavori/x' }] })).length, 1)
})

test('home: nessun blocco o battuta "Lavori" (R7)', () => {
  assert.deepEqual(trovaLavori(HOME), [])
})

test('home: le frasi chiave di testi.md §3 ci sono', () => {
  const tutto = JSON.stringify(HOME)
  for (const f of ['Tu fai il tuo mestiere.', 'Il peso lo porto io.', 'Chi ti cerca, trova me.', "Il bello c'è già. Io lo accendo.", 'Porto da te chi ancora non ti conosce.', 'La prossima può essere la tua.']) assert.ok(tutto.includes(f), f)
})

// Tutte le frasi (e le parole in grassetto) contro il file vero di testi.md, se c'è (nel repo pubblico non c'è: si salta).
// Per farlo girare si indica il percorso del file nella variabile TESTI_MD, ad esempio:
//   TESTI_MD=<percorso>/agenzia-360/testi.md npm test
const TESTI_MD = process.env.TESTI_MD ?? ''
test("home: tutte le frasi uguali a testi.md §3 (se il file c'è)", { skip: !TESTI_MD || !existsSync(TESTI_MD) }, () => {
  const md = readFileSync(TESTI_MD, 'utf8')
  const sezione = md.slice(md.indexOf('## 3. La home'), md.indexOf('## 4. Le pagine dei servizi'))
  const righe = Array.from(sezione.matchAll(/^(?:- )?([123])\.(\d+) (.+)$/gm), (m) => ({ tempo: m[1], n: Number(m[2]), grezza: m[3] }))
  const tutte = HOME.blocchi.flatMap((b) => b.battute.map((x) => ({ b, x })))
  const attese = righe.filter((r) => r.tempo !== '4')                         // il tempo 4 (Bruno) sta nella coda, non nel film
  assert.equal(attese.filter((r) => r.tempo === '1').length, 11); assert.equal(attese.filter((r) => r.tempo === '2').length, 20); assert.equal(attese.filter((r) => r.tempo === '3').length, 6)
  for (const r of attese) {
    const testo = r.grezza.replace(/\*\*/g, '')
    const grassetto = Array.from(r.grezza.matchAll(/\*\*(.+?)\*\*/g), (m) => m[1])
    const trovata = tutte.find(({ x }) => x.testo === testo)
    assert.ok(trovata, `manca «${testo}»`)
    assert.deepEqual(grassetto, trovata.x.accento ? [trovata.x.accento] : [], testo)
  }
  const nomi = Array.from(sezione.matchAll(/^- \*\*([A-Z][a-zà-ù]+)\*\*$/gm), (m) => m[1])
  const motti = Array.from(sezione.matchAll(/^- \*"(.+)"\*$/gm), (m) => m[1])
  assert.deepEqual(nomi, tratti.map((t) => battuta(t, 'nome').testo)); assert.deepEqual(motti, tratti.map((t) => battuta(t, 'motto').testo))
})
