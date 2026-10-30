// npm test  ·  dati della home v2 del varco: struttura, ruoli, accenti, guardie R4 e R7
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { HOME } from './dati/home.ts'
import { posizioneAccento } from './testo.ts'
import type { Blocco, Percorso } from './tipi.ts'

const ruoliDi = (b: Blocco) => b.battute.map((x) => x.ruolo)
const battuta = (b: Blocco, ruolo: string) => b.battute.find((x) => x.ruolo === ruolo)!
const servizi = HOME.blocchi.filter((b) => b.tipo === 'mascotte')

test('home v2: nove blocchi contigui, dall\'inizio alla lunghezza (23)', () => {
  assert.equal(HOME.lunghezza, 23)
  assert.deepEqual(HOME.blocchi.map((b) => b.id), ['apertura', 'soglia', 'servizi', 'atlas', 'janus', 'prometheus', 'hermes', 'squadra', 'finale'])
  assert.deepEqual(HOME.blocchi.map((b) => b.tipo), ['apertura', 'soglia', 'intro', 'mascotte', 'mascotte', 'mascotte', 'mascotte', 'squadra', 'finale'])
  assert.equal(HOME.blocchi[0].da, 0); assert.equal(HOME.blocchi[HOME.blocchi.length - 1].a, HOME.lunghezza)
  HOME.blocchi.forEach((b, i) => { if (i > 0) assert.equal(b.da, HOME.blocchi[i - 1].a, `${b.id} non comincia dove finisce ${HOME.blocchi[i - 1].id}`) })
})

test('home v2: ogni battuta sta dentro [0; lunghezza] e ha a > da', () => {
  for (const b of HOME.blocchi) for (const x of b.battute) {
    assert.ok(x.da >= 0 && x.a <= HOME.lunghezza, `${b.id}/${x.ruolo}: fuori dal percorso`)
    assert.ok(x.a > x.da, `${b.id}/${x.ruolo}: a non è dopo da`)
  }
})

test('home v2: ruoli unici nel blocco e conformi alla regola', () => {
  const attesi: Record<string, string[]> = {
    apertura: ['nome', 'luogo', 'servizi', 'scorri'],
    soglia: ['1', '2'],
    servizi: ['titolo'],
    squadra: ['sopra', 'sotto'],
    finale: ['1', '2', 'pulsante'],
  }
  for (const s of servizi) attesi[s.id] = ['titolo', 'paragrafo', 'link', 'foto-1', 'foto-2']
  for (const b of HOME.blocchi) {
    assert.equal(new Set(ruoliDi(b)).size, b.battute.length, `${b.id}: ruoli doppi`)
    assert.deepEqual([...ruoliDi(b)].sort(), [...attesi[b.id]].sort(), `${b.id}: ruoli diversi dalla regola`)
  }
})

test('soglia (D47): due battute, la domanda e la risposta in una parola', () => {
  const soglia = HOME.blocchi[1]
  assert.deepEqual(soglia.battute.map((b) => b.testo), ['Chi pensa al resto mentre lavori?', 'Noi.'])
  assert.deepEqual(soglia.battute.map((b) => b.accento), ['resto', 'Noi'])
})

test('servizi: titolo, mascotte, paragrafo e collegamento; niente nomi delle creature come titoli', () => {
  assert.equal(servizi.length, 4)
  assert.deepEqual(servizi.map((s) => battuta(s, 'titolo').testo), ['Automazioni aziendali', 'Sviluppo siti web e app', 'Creazione contenuti', 'Campagne pubblicitarie'])
  assert.deepEqual(servizi.map((s) => [s.materia, s.immagini?.[0]]), [['polvere', 'atlas-2'], ['vetro', 'janus-2'], ['saette', 'prometheus-2'], ['cromo', 'hermes-2']])
  assert.deepEqual(servizi.map((s) => [battuta(s, 'link').testo, battuta(s, 'link').href]), [
    ['Le automazioni →', '/automazioni'], ['I siti web →', '/siti-web'], ['I contenuti →', '/contenuti'], ['Le campagne →', '/campagne']])
  for (const s of servizi) {
    for (const nome of ['Atlas', 'Janus', 'Prometheus', 'Hermes']) for (const x of s.battute) assert.ok(!x.testo.includes(nome), `${s.id}: il nome ${nome} compare in «${x.testo}»`)
    const p = battuta(s, 'paragrafo')
    assert.ok(p.testo.length >= 120 && p.testo.length <= 320, `${s.id}: paragrafo di ${p.testo.length} caratteri`)
    const da = (r: string) => battuta(s, r).da
    assert.ok(da('titolo') < da('paragrafo') && da('paragrafo') < da('link'), s.id)
    assert.ok(Math.abs(s.a - s.da - 3.2) < 1e-6)
  }
  assert.equal(HOME.blocchi[2].battute[0].testo, 'I nostri servizi')
  assert.ok(Math.abs(HOME.blocchi[2].a - HOME.blocchi[2].da - 1.6) < 1e-6, 'la schermata dei servizi dura 1,6: le quattro mascotte girano accanto al titolo')
})

test('squadra e finale: le frasi che restano della home (brief 30/10)', () => {
  const squadra = HOME.blocchi.find((b) => b.id === 'squadra')!, finale = HOME.blocchi.find((b) => b.id === 'finale')!
  assert.deepEqual(squadra.immagini, ['atlas-2', 'janus-2', 'prometheus-2', 'hermes-2'])
  assert.deepEqual(squadra.battute.map((b) => b.testo), ['Più tempo per il tuo mestiere,', 'più margine a fine mese.'])
  assert.deepEqual(finale.battute.map((b) => b.testo), ['Seguiamo poche attività alla volta.', 'La prossima può essere la tua.', 'Richiedi un preventivo'])
  const p = battuta(finale, 'pulsante')
  assert.equal(p.href, '#preventivo'); assert.equal(p.a, HOME.lunghezza); assert.equal(p.nota, 'Senza impegno. Ti risponde Bruno entro un giorno lavorativo.')
})

test('apertura (D47): il nome dura tutto il blocco; i servizi brevi arrivano con le ultime lettere; il riquadro c\'è quasi subito', () => {
  const ap = HOME.blocchi[0]
  assert.deepEqual([battuta(ap, 'nome').da, battuta(ap, 'nome').a], [0, ap.a])
  assert.equal(ap.a, 2.2)
  assert.ok(battuta(ap, 'servizi').da >= 0.7 && battuta(ap, 'servizi').a < ap.a)
  assert.ok(battuta(ap, 'luogo').da < 0.3 && battuta(ap, 'luogo').a < ap.a)
  assert.ok(battuta(ap, 'scorri').a < battuta(ap, 'servizi').da)
  assert.equal(battuta(ap, 'servizi').testo, 'Automazioni · Web · Social · Campagne')
})

test('cartoline (D46): due foto per servizio, una dopo l\'altra, con il file in public/film/cartoline e un testo alternativo', () => {
  for (const s of servizi) {
    const foto = s.battute.filter((x) => x.tipo === 'foto')
    assert.equal(foto.length, 2, s.id)
    foto.forEach((f, i) => {
      assert.ok(f.src?.startsWith('/film/cartoline/') && f.src.endsWith('.webp'), f.src)
      assert.ok(f.testo.length > 10, 'alt')
      if (i) assert.ok(f.da > foto[i - 1].da, 'una alla volta')
    })
  }
})

test('home v2: ogni accento sta dentro il suo testo, come parola intera', () => {
  for (const b of HOME.blocchi) for (const x of b.battute) if (x.accento) assert.ok(posizioneAccento(x.testo, x.accento) >= 0, `${b.id}/${x.ruolo}: «${x.accento}» non è in «${x.testo}»`)
})

test('home v2: nessun prezzo (R4)', () => {
  assert.ok(!JSON.stringify(HOME).includes('€'))
})

// R7: nessun blocco o battuta "Lavori" finché la bacheca è vuota. "Come lavoriamo" è ammesso: si cerca la parola intera.
function trovaLavori(p: Percorso): string[] {
  const trovati: string[] = []
  const lavori = (testo: string) => posizioneAccento(testo.toLowerCase(), 'lavori') >= 0
  for (const b of p.blocchi) {
    for (const [campo, valore] of [['id', b.id], ['etichetta', b.etichetta]] as const) if (lavori(valore)) trovati.push(`blocco ${b.id}: ${campo} «${valore}»`)
    for (const x of b.battute) {
      // nelle frasi "lavori" può essere il verbo («mentre lavori?»): conta solo il nome della sezione («i nostri lavori»)
      if (x.tipo === 'frase' ? /\b(i|nostri|dei|ai|tuoi|vostri|miei)\s+lavori\b/i.test(x.testo) : lavori(x.testo)) trovati.push(`blocco ${b.id}: battuta «${x.testo}»`)
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
  assert.equal(trovaLavori(p(blocco('03 · altro', 'Ciao.', 'lavori'))).length, 1)
  assert.equal(trovaLavori(p({ ...blocco('03 · altro'), battute: [{ tipo: 'link', testo: 'Vai', ruolo: '1', da: 0, a: 1, href: '/lavori/x' }] })).length, 1)
})

test('home v2: nessun blocco o battuta "Lavori" (R7)', () => {
  assert.deepEqual(trovaLavori(HOME), [])
})
