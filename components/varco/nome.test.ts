// npm test  ·  il nome dell'apertura che si compone da solo (a tempo), il ritorno nel vortice con lo scroll, l'invito nel cerchio, la consegna in quattro correnti
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { APERTURA, ENTRATA_CSS, consegna, ingressoNome, lucelettera, portataVia, voloLettere } from './nome.ts'
import { HOME } from './dati/home.ts'

const N = 12 // «AgentiStudio»

test('ingresso a tempo: prima che cominci l’animazione nessuna lettera; a fine ingresso ci sono tutte, senza scorrere', () => {
  assert.equal(ingressoNome(-1), 0, 'l’animazione non è ancora cominciata')
  assert.equal(ingressoNome(APERTURA.ingresso[0]), 0)
  assert.equal(ingressoNome(APERTURA.ingresso[1]), 1)
  assert.ok(voloLettere(0, N, ingressoNome(0)).every((p) => p === 0))
  assert.ok(voloLettere(0, N, ingressoNome(APERTURA.ingresso[1])).every((p) => p === 1), 'a u = 0 il nome è intero')
  assert.ok(APERTURA.ingresso[1] <= 2.5, 'il nome è completo entro due secondi e mezzo dal primo disegno')
})

test('stesso orologio: le scaglie arrivano in ogni lettera quando comincia la sua entrata CSS (varco.css, ENTRATA_CSS)', () => {
  for (let i = 0; i < N; i++) {
    let t = 0
    while (t < 3 && lucelettera(voloLettere(0, N, ingressoNome(t))[i]) <= 0) t += 0.005
    const css = ENTRATA_CSS.inizio + i * ENTRATA_CSS.passo
    assert.ok(Math.abs(t - css) < 0.06, `lettera ${i}: scaglie a ${t.toFixed(2)} s, entrata CSS a ${css.toFixed(2)} s`)
  }
  const fine = ENTRATA_CSS.inizio + (N - 1) * ENTRATA_CSS.passo + ENTRATA_CSS.durata
  assert.ok(fine <= 2, `il nome è intero entro 2 s dal primo disegno (ora ${fine.toFixed(2)} s)`)
})

test('una lettera alla volta: la prima parte per prima, in ordine, e a metà ingresso le ultime non sono ancora partite', () => {
  const meta = voloLettere(0, N, 0.5)
  for (let i = 1; i < N; i++) assert.ok(meta[i] <= meta[i - 1], `ordine a ${i}`)
  assert.ok(meta[0] === 1 && meta[N - 1] === 0)
  // mai più di tre lettere in volo insieme
  for (let x = 0; x <= 1; x += 0.01) assert.ok(voloLettere(0, N, x).filter((p) => p > 0 && p < 1).length <= 3, `ingresso = ${x}`)
})

test('la lettera HTML compare solo quando le scaglie sono quasi arrivate', () => {
  assert.equal(lucelettera(0.5), 0)
  assert.equal(lucelettera(1), 1)
})

test('lo scroll non compone il nome: lo fa solo tornare nel vortice; poi il vortice si apre, nell\'ordine', () => {
  assert.ok(voloLettere(APERTURA.scioglie[1], N, 0).every((p) => p === 0), 'scorrere prima dell\'ingresso non fa comparire lettere')
  assert.ok(voloLettere(APERTURA.scioglie[0], N).every((p) => p === 1), 'pieno finché non si scorre oltre')
  assert.ok(voloLettere(APERTURA.scioglie[1], N).every((p) => p === 0), 'tornato nel vortice')
  assert.ok(APERTURA.scioglie[1] <= APERTURA.consegna[0])
  assert.equal(consegna(APERTURA.consegna[0]), 0)
  const meta = consegna((APERTURA.consegna[0] + APERTURA.consegna[1]) / 2)
  assert.ok(meta > 0 && meta < 1)
  assert.equal(consegna(APERTURA.consegna[1]), 1)
})

test('l\'invito sta nel cerchio: dopo che il nome è tornato nel vortice e prima che il vortice esca dallo schermo', () => {
  const invito = HOME.blocchi.find((b) => b.id === 'invito')!
  for (const x of invito.battute) {
    assert.ok(x.da >= APERTURA.scioglie[1], `${x.ruolo} arriva quando il nome non c'è più`)
    assert.ok(x.a <= (APERTURA.consegna[0] + APERTURA.consegna[1]) / 2, `${x.ruolo} se ne va prima che il vortice sia uscito`)
  }
  const chi = HOME.blocchi.find((b) => b.id === 'chi')!
  for (const x of chi.battute) assert.ok(x.da >= APERTURA.consegna[1] - 0.05, `chi/${x.ruolo} arriva quando le correnti sono uscite`)
})

test('D50 · con «Noi.» le correnti rientrano a metà e riescono, e si portano via le parole del resto una dopo l\'altra', () => {
  const noi = HOME.blocchi.find((b) => b.id === 'soglia')!.battute.find((b) => b.ruolo === '2')!
  assert.equal(APERTURA.spazzata[0], noi.da, 'la spazzata parte con «Noi.»')
  assert.equal(consegna(APERTURA.spazzata[0] - 0.05), 1)
  assert.ok(consegna(APERTURA.spazzata[0] + 0.2) < 0.7, 'le correnti rientrano')
  assert.equal(consegna(APERTURA.spazzata[1] + 0.05), 1, 'e riescono')
  const n = HOME.blocchi.find((b) => b.id === 'soglia')!.parole!.length
  assert.ok(n >= 8)
  assert.equal(portataVia(APERTURA.spazzata[0], 0, n), 0)
  assert.ok(portataVia(APERTURA.spazzata[0] + 0.3, 0, n) > portataVia(APERTURA.spazzata[0] + 0.3, n - 1, n), 'una dopo l\'altra')
  for (let i = 0; i < n; i++) assert.equal(portataVia(APERTURA.spazzata[1] + 0.1, i, n), 1)
})
