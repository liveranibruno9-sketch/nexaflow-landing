// npm test  ·  pagine dei servizi e Chi siamo (DESIGN_SPEC-pagine §15): R18 sui blocchi del film, nessun «€» (R4), servizio già scelto (R5),
// «Lavori» assente (R7), niente «intelligenza artificiale» nei servizi, lunghezze degli slot di testo (§8.7), tempi del film.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { AUTOMAZIONI, VOCI_AUTOMAZIONI } from './dati/automazioni.ts'
import { SITI_WEB, TIPI_SITO_TUTTI } from './dati/siti-web.ts'
import { CONTENUTI, TIPI_CONTENUTO_TUTTI } from './dati/contenuti.ts'
import { CAMPAGNE, TIPI_CAMPAGNA_TUTTI } from './dati/campagne.ts'
import { NOMI_MESTIERE, PAGINE_DEDICATE } from './dati/dedicate.ts'
import { CHI_SIAMO } from './dati/chi-siamo.ts'
import { REGIE_PAGINE } from './regie/pagine/indice.ts'
import { controllaR18 } from './regie/indice.ts'
import { posizioneAccento } from './testo.ts'
import { posaChiSiamo, posaPagina } from './coreografia-pagina.ts'

const SERVIZI = [AUTOMAZIONI, SITI_WEB, CONTENUTI, CAMPAGNE]
const TUTTE = [...SERVIZI, CHI_SIAMO]

/** tutte le stringhe di un oggetto di dati, ricorsivamente */
function stringhe(x: unknown, out: string[] = []): string[] {
  if (typeof x === 'string') out.push(x)
  else if (Array.isArray(x)) x.forEach((v) => stringhe(v, out))
  else if (x && typeof x === 'object') Object.values(x).forEach((v) => stringhe(v, out))
  return out
}

test('R18: ogni frase del film di ogni pagina ha la sua àncora, ogni parola d\'accento ha il fuoco, le luci stanno sotto 0,85', () => {
  const errori: string[] = []
  for (const d of TUTTE) {
    const regie = REGIE_PAGINE[d.id].film
    assert.deepEqual(Object.keys(regie).sort(), d.percorso.blocchi.map((b) => b.id).sort(), `${d.id}: una regia per blocco`)
    errori.push(...controllaR18(d.percorso, regie).map((e) => `${d.id}: ${e}`))
  }
  assert.deepEqual(errori, [])
})

test('R4: nessun «€» e nessuna cifra di prezzo nei dati delle pagine', () => {
  for (const d of TUTTE) for (const s of stringhe(d)) assert.ok(!/€|\beuro\b|\beur\b/i.test(s), `${d.id}: «${s}»`)
})

test('le pagine dei servizi non nominano mai l\'intelligenza artificiale (né «AI»)', () => {
  for (const d of SERVIZI) for (const s of stringhe({ ...d, poster: undefined })) assert.ok(!/intelligenza artificiale|\bA\.?I\.?\b/.test(s), `${d.id}: «${s}»`)
})

test('R5: ogni pagina servizio apre il modulo con il suo servizio già scelto', () => {
  const sorgente = readFileSync(new URL('./sezioni/PaginaServizio.tsx', import.meta.url), 'utf8')
  assert.match(sorgente, /<ModuloPreventivo servizio=\{dati\.id as Servizio\}/)
  assert.match(sorgente, /<Coda servizio=\{dati\.id as Servizio\}/)
  assert.deepEqual(SERVIZI.map((d) => d.id), ['automazioni', 'siti-web', 'contenuti', 'campagne'])
})

test('R7: «Lavori» non compare da nessuna parte (bacheca vuota)', () => {
  // «Lavori» come sezione (atto, titolo, scheda): mai. Il verbo («Lavori tutto il giorno») è un'altra cosa
  for (const d of TUTTE) for (const s of stringhe(d)) assert.ok(!/^(i |gli )?lavori$|bacheca|portfolio/i.test(s.trim()), `${d.id}: «${s}»`)
  for (const f of ['PaginaServizio.tsx', 'PaginaChiSiamo.tsx', 'PaginaVarco.tsx']) {
    const sorgente = readFileSync(new URL(`./${f.startsWith('PaginaVarco') ? f : `sezioni/${f}`}`, import.meta.url), 'utf8')
    assert.ok(!/LAVORI|bacheca|<Lavori/.test(sorgente), f)
  }
})

test('il film: tre blocchi contigui da 0 a 6 (Automazioni v2: apertura + elenco; Chi siamo: due, 0 → 3,8); ogni battuta sta dentro il suo blocco', () => {
  for (const d of SERVIZI) {
    const elenco = d.id === 'automazioni' || d.id === 'siti-web' || d.id === 'contenuti' || d.id === 'campagne'
    if (!elenco) assert.equal(d.percorso.lunghezza, 6)
    assert.deepEqual(d.percorso.blocchi.map((b) => b.id.slice(b.id.lastIndexOf('-') + 1)), elenco ? ['a', 'f'] : ['a', 'p', 'f'])
    d.percorso.blocchi.forEach((b, i) => { if (i > 0) assert.equal(b.da, d.percorso.blocchi[i - 1].a); for (const x of b.battute) assert.ok(x.da >= b.da - 1e-9 && x.a <= b.a + 1e-9 && x.a > x.da, `${d.id}/${b.id}/${x.ruolo}`) })
    const ruoli = (i: number) => d.percorso.blocchi[i].battute.map((x) => x.ruolo)
    for (let i = 0; i < d.percorso.blocchi.length; i++) assert.equal(new Set(ruoli(i)).size, ruoli(i).length, `${d.id}: ruoli doppi`)
    const f = d.percorso.blocchi[d.percorso.blocchi.length - 1]
    assert.equal(f.battute.filter((x) => x.tipo === 'blocco').length, d.id === 'automazioni' ? VOCI_AUTOMAZIONI.length + 1 : d.id === 'siti-web' ? TIPI_SITO_TUTTI.length : d.id === 'contenuti' ? TIPI_CONTENUTO_TUTTI.length : d.id === 'campagne' ? TIPI_CAMPAGNA_TUTTI.length : 6)
  }
  assert.equal(CHI_SIAMO.percorso.lunghezza, 3.8)
})

test('le parole d\'accento stanno nella loro frase come parola intera', () => {
  for (const d of TUTTE) for (const bl of d.percorso.blocchi) for (const x of bl.battute) if (x.accento) assert.ok(posizioneAccento(x.testo, x.accento) >= 0, `${d.id}/${x.ruolo}: «${x.accento}» in «${x.testo}»`)
})

test('lunghezze degli slot (§8.7): H1 75, sottotitolo 160, H2 48, righe del problema 130, blocchi 36 + 150, beneficio 56, schede 230, passi 40 + 210, domande 70 + 280, invito 44, coda 210', () => {
  for (const d of SERVIZI) {
    const fase = (x: string) => d.percorso.blocchi.find((b) => b.id.endsWith(`-${x}`))
    const a = fase('a')!, p = fase('p'), f = fase('f')!
    const t = (b: typeof a, r: string) => b.battute.find((x) => x.ruolo === r)!
    assert.ok(d.h1.length <= 75, `${d.id} H1 ${d.h1.length}`)
    // senza problema (Automazioni v2) il sottotitolo è il paragrafo generale di 4-5 righe
    assert.ok(t(a, 'sotto').testo.length <= (p ? 160 : 320), `${d.id} sottotitolo`)
    assert.ok((!p || t(p, 'h2').testo.length <= 48) && t(f, 'h2').testo.length <= 48, `${d.id} H2`)
    if (p) for (const r of ['r1', 'r2', 'r3']) assert.ok(t(p, r).testo.length <= 130, `${d.id} ${r} ${t(p, r).testo.length}`)
    f.battute.filter((x) => x.tipo === 'blocco').forEach((x) => assert.ok(x.testo.length <= 36 && (x.nota ?? '').length <= 150, `${d.id} ${x.ruolo}`))
    f.battute.filter((x) => x.ruolo.startsWith('ben')).forEach((x) => assert.ok(x.testo.length <= 56, `${d.id} ${x.ruolo}`))
    assert.ok(d.gioco.h2.length <= 48 && d.tappe.h2.length <= 48 && d.domande.h2.length <= 48 && (d.extra?.h2.length ?? 0) <= 48, `${d.id} H2 sezioni`)
    assert.equal(d.gioco.scelte.length, 6)
    d.gioco.scelte.forEach((s) => assert.ok(s.nome.length <= 22 && s.testo.length <= 230, `${d.id} scheda ${s.id}: ${s.nome.length}/${s.testo.length}`))
    d.tappe.passi.forEach((x) => assert.ok(x.titolo.length <= 46 && x.testo.length <= 210, `${d.id} passo ${x.titolo}`))
    assert.ok(d.tappe.riga.length <= 120, `${d.id} riga tappe`)
    d.domande.voci.forEach((v) => assert.ok(v.d.length <= 70 && v.r.length <= 280, `${d.id} domanda ${v.d}`))
    assert.ok(d.invito.frasi.length <= 2 && d.invito.frasi.every((x) => x[0].length <= 44), `${d.id} invito`)
    assert.ok(d.coda.riga.length <= 210, `${d.id} coda ${d.coda.riga.length}`)
    assert.deepEqual(Array.from(new Set(d.tappe.passi.map((x) => x.tappa))), [0, 1, 2], `${d.id}: i passi stanno dentro tre tappe`)
    assert.ok(!/passi/i.test(d.tappe.h2), `${d.id}: nessun titolo dice «sei passi»`)
  }
})

test('Chi siamo: H1 ≤ 60, missione ≤ 190, visione ≤ 330, valori 5 (parola ≤ 14, riga ≤ 170), frasi di Bruno ≤ 70', () => {
  const d = CHI_SIAMO
  assert.ok(d.h1.length <= 60 && d.missione.testo.length <= 190 && d.visione.testo.length <= 330)
  assert.equal(d.valori.voci.length, 5)
  d.valori.voci.forEach((v) => assert.ok(v.parola.length <= 14 && v.riga.length <= 170, v.parola))
  d.percorso.blocchi[1].battute.filter((x) => /^f\d$/.test(x.ruolo)).forEach((x) => assert.ok(x.testo.length <= 70, x.testo))
  assert.equal(d.servizi.voci.length, 4)
})

test('la mascotte: protagonista nell\'apertura, arretrata nel problema, torna con la terza riga, esce dopo il film, si ospita sull\'àncora', () => {
  const base = { secondi: 5, lunghezza: 6, problema: 1, terzaRiga: 2.2, schermo: { ritratto: false, aspetto: 1.6, basso: false }, ancora: null, dopo: 0, pesoAncora: 0 }
  const a = posaPagina({ ...base, u: 0.5 })
  const p = posaPagina({ ...base, u: 1.8 })
  const f = posaPagina({ ...base, u: 4 })
  assert.ok(p.altezza < a.altezza * 0.8 && p.x > a.x, 'arretra')
  assert.ok(Math.abs(f.altezza - a.altezza) < 1e-6, 'torna protagonista')
  assert.equal(posaPagina({ ...base, u: 6, dopo: 1 }).presenza, 0)
  const ospite = posaPagina({ ...base, u: 6, dopo: 1, ancora: { x: 0.3, y: 0.4, altezza: 0.3 }, pesoAncora: 1 })
  assert.ok(Math.abs(ospite.x - 0.3) < 1e-9 && ospite.presenza === 1)
  assert.equal(posaPagina({ ...base, u: 0.5, secondi: 0 }).presenza, 0)
})

test('Chi siamo: le quattro entrano nella luce dopo «Con me lavorano»', () => {
  const c = { u: 1, secondi: 5, lunghezza: 3.8, ingresso: 2.4, schermo: { ritratto: true, aspetto: 0.46, basso: false }, ancora: null, dopo: 0, pesoAncora: 0 }
  for (let i = 0; i < 4; i++) {
    assert.equal(posaChiSiamo(i, c).presenza, 0)
    assert.ok(posaChiSiamo(i, { ...c, u: 3.5 }).presenza > 0.99)
  }
})

test('Automazioni v2: il film elenca almeno 5 automazioni più «Su misura»; ognuna ha «Come funziona» e il preventivo, il paragrafo non è centrato sull\'assistente', () => {
  const f = AUTOMAZIONI.percorso.blocchi.find((b) => b.id.endsWith('-f'))!
  const voci = f.battute.filter((x) => x.tipo === 'blocco')
  assert.ok(VOCI_AUTOMAZIONI.length >= 5)
  assert.equal(new Set(VOCI_AUTOMAZIONI.map((v) => v.slug)).size, VOCI_AUTOMAZIONI.length, 'slug unici')
  VOCI_AUTOMAZIONI.forEach((v, i) => {
    const b = voci[i]
    assert.equal(b.testo, v.titolo[0])
    assert.equal(b.nota, undefined, `${v.slug}: solo il titolo`)
    assert.deepEqual(b.azioni?.map((x) => x.href), [`/automazioni/${v.slug}`, '#preventivo'], v.slug)
    assert.ok(b.azioni?.[1].richiesta?.includes(v.titolo[0]), `${v.slug}: il modulo sa cosa interessa`)
  })
  const ultima = voci[voci.length - 1]
  assert.equal(ultima.testo, 'Su misura')
  assert.equal(ultima.azioni?.[0].href, '#preventivo')
  const sotto = AUTOMAZIONI.percorso.blocchi[0].battute.find((x) => x.ruolo === 'sotto')!.testo
  assert.ok(!/assistente/i.test(sotto) && !/assistente/i.test(AUTOMAZIONI.h1), 'il paragrafo generale non parla solo dell\'assistente')
  assert.ok(AUTOMAZIONI.percorso.blocchi[0].battute.some((x) => x.tipo === 'pulsante' && x.href === '#preventivo'), 'il paragrafo ha il suo link al preventivo')
})

test('Automazioni v3: ogni voce ha la sua vignetta disegnata (stessa finestra), nessuna è di quelle tolte', () => {
  const f = AUTOMAZIONI.percorso.blocchi.find((b) => b.id.endsWith('-f'))!
  const voci = f.battute.filter((x) => x.tipo === 'blocco')
  const vignette = f.battute.filter((x) => x.tipo === 'vignetta')
  assert.equal(vignette.length, voci.length)
  voci.forEach((b, i) => assert.ok(vignette[i].da === b.da && vignette[i].a === b.a && vignette[i].vignetta, `voce ${b.testo}`))
  assert.equal(new Set(vignette.map((x) => x.vignetta)).size, vignette.length, 'ognuna diversa')
  const titoli = voci.map((b) => b.testo.toLowerCase()).join('|')
  assert.ok(!/promemoria|recensioni|tornano/.test(titoli), 'tolte: conferme e promemoria, recensioni su Google, clienti che tornano')
  assert.ok(/onboarding/.test(titoli), 'c\'è l\'onboarding cliente')
})

test('Siti web «per mestiere»: sei schede, ognuna con scena e foto; ogni scena ha il suo disegno', () => {
  const ids = ['bnb', 'ristorante', 'negozio', 'artigiano', 'studio', 'eventi']
  assert.deepEqual(SITI_WEB.gioco.scelte.map((s) => s.id), ids)
  SITI_WEB.gioco.scelte.forEach((s) => assert.ok(s.scena === s.id && s.foto, s.id))
  const disegni = readFileSync(new URL('./sezioni/ScenaMestiere.tsx', import.meta.url), 'utf8')
  for (const id of ids) assert.ok(new RegExp(`\\b${id}: [A-Z]`).test(disegni), `scena ${id} registrata`)
})

test('Siti web v2: il film elenca i tipi di sito dal più leggero al più complesso, ognuno con vignetta, «Come funziona» e preventivo; il paragrafo dice premium e accessibile', () => {
  const f = SITI_WEB.percorso.blocchi.find((b) => b.id.endsWith('-f'))!
  const voci = f.battute.filter((x) => x.tipo === 'blocco')
  assert.equal(voci.length, TIPI_SITO_TUTTI.length)
  assert.ok(voci.length >= 6)
  assert.equal(new Set(TIPI_SITO_TUTTI.map((t) => t.slug)).size, TIPI_SITO_TUTTI.length, 'slug unici')
  TIPI_SITO_TUTTI.forEach((t, i) => {
    assert.equal(voci[i].testo, t.titolo[0])
    assert.deepEqual(voci[i].azioni?.map((x) => x.href), [`/siti-web/${t.slug}`, '#preventivo'], t.slug)
    assert.ok(voci[i].azioni?.[1].richiesta?.includes(t.titolo[0]), t.slug)
  })
  const vignette = f.battute.filter((x) => x.tipo === 'vignetta')
  assert.equal(vignette.length, voci.length)
  assert.equal(new Set(vignette.map((x) => x.vignetta)).size, vignette.length, 'ognuna diversa')
  assert.equal(TIPI_SITO_TUTTI[0].titolo[0], 'Landing page', 'si parte dal più leggero')
  assert.ok(/app/i.test(TIPI_SITO_TUTTI[TIPI_SITO_TUTTI.length - 1].titolo[0]), 'si finisce dal più complesso')
  const sotto = SITI_WEB.percorso.blocchi[0].battute.find((x) => x.ruolo === 'sotto')!.testo
  assert.ok(/grandi marchi/i.test(sotto) && /piccole e medie imprese/i.test(sotto) && !/econom|low cost|a basso costo/i.test(sotto + SITI_WEB.h1))
})

test('Contenuti v2: il film elenca cosa creiamo (senza immagini e video creati al computer), ogni voce con vignetta e i due link; mestieri allineati a Siti web, ognuno con la sua scena', () => {
  const f = CONTENUTI.percorso.blocchi.find((b) => b.id.endsWith('-f'))!
  const voci = f.battute.filter((x) => x.tipo === 'blocco')
  assert.equal(voci.length, TIPI_CONTENUTO_TUTTI.length)
  assert.ok(voci.length >= 6)
  TIPI_CONTENUTO_TUTTI.forEach((t, i) => {
    assert.equal(voci[i].testo, t.titolo[0])
    assert.ok(voci[i].azioni?.some((x) => x.href === '#preventivo'), t.slug)
  })
  assert.ok(!voci.some((x) => /computer|creati al/i.test(x.testo)), 'niente immagini e video creati al computer')
  const vignette = f.battute.filter((x) => x.tipo === 'vignetta')
  assert.equal(new Set(vignette.map((x) => x.vignetta)).size, voci.length - 0, 'ognuna diversa dalle altre dell\'elenco, salvo «su misura» condivisa')
  assert.deepEqual(CONTENUTI.gioco.scelte.map((s) => s.id), SITI_WEB.gioco.scelte.map((s) => s.id), 'stessi mestieri di Siti web')
  CONTENUTI.gioco.scelte.forEach((s) => assert.ok(s.scena === `c-${s.id}` && s.foto, s.id))
  const disegni = readFileSync(new URL('./sezioni/ScenaMestiere.tsx', import.meta.url), 'utf8')
  for (const s of CONTENUTI.gioco.scelte) assert.ok(disegni.includes(`'${s.scena}':`), `scena ${s.scena} registrata`)
  assert.ok(!/dentist/i.test(CONTENUTI.gioco.scelte.map((s) => s.id + s.nome).join()), 'i dentisti hanno la loro pagina')
  assert.ok(/grande marchio/i.test(CONTENUTI.h1))
})

test('Campagne v2: il film elenca cosa facciamo con i due link, mestieri allineati, nessuna promessa di risultato, nessun prezzo', () => {
  const f = CAMPAGNE.percorso.blocchi.find((b) => b.id.endsWith('-f'))!
  const voci = f.battute.filter((x) => x.tipo === 'blocco')
  assert.equal(voci.length, TIPI_CAMPAGNA_TUTTI.length)
  TIPI_CAMPAGNA_TUTTI.forEach((t, i) => {
    assert.equal(voci[i].testo, t.titolo[0])
    assert.ok(voci[i].azioni?.some((x) => x.href === '#preventivo'), t.slug)
  })
  assert.deepEqual(CAMPAGNE.gioco.scelte.map((s) => s.id), SITI_WEB.gioco.scelte.map((s) => s.id), 'stessi mestieri di Siti web')
  CAMPAGNE.gioco.scelte.forEach((s) => assert.ok(s.scena === `h-${s.id}` && s.foto, s.id))
  const disegni = readFileSync(new URL('./sezioni/ScenaMestiere.tsx', import.meta.url), 'utf8')
  for (const s of CAMPAGNE.gioco.scelte) assert.ok(disegni.includes(`'${s.scena}':`), `scena ${s.scena} registrata`)
  assert.ok(/grandi marchi/i.test(CAMPAGNE.h1))
  const tutto = stringhe(CAMPAGNE).join(' ')
  assert.ok(!/garantiamo (un|dei) \d|ti garantiamo (clienti|risultati)/i.test(tutto.replace('Noi ti garantiamo di sapere', '')), 'nessuna promessa di risultato')
  const studio = CAMPAGNE.gioco.scelte.find((s) => s.id === 'studio')!.testo
  assert.ok(/informativ/i.test(studio) && /promesse/i.test(studio), 'studi: solo informativo')
})

test('Automazioni: la sezione «per mestiere» ha gli stessi sei mestieri delle altre pagine, ognuno con la sua scena e la sua foto', () => {
  assert.deepEqual(AUTOMAZIONI.gioco.scelte.map((s) => s.id), SITI_WEB.gioco.scelte.map((s) => s.id))
  AUTOMAZIONI.gioco.scelte.forEach((s) => assert.ok(s.scena === `a-${s.id}` && s.foto, s.id))
  const disegni = readFileSync(new URL('./sezioni/ScenaMestiere.tsx', import.meta.url), 'utf8')
  for (const s of AUTOMAZIONI.gioco.scelte) assert.ok(disegni.includes(`'${s.scena}':`), `scena ${s.scena} registrata`)
  assert.ok(AUTOMAZIONI.gioco.scelte.some((s) => s.link?.href === '/studi-dentistici'), 'il percorso dedicato agli studi dentistici resta raggiungibile')
})

test('Pagine dedicate: ogni voce con «Come funziona» ha la sua pagina (le voci «Su misura» di Automazioni e Siti portano al modulo), con scena, tre passi, domande; solo esempi veri', () => {
  const attese = [
    ...VOCI_AUTOMAZIONI.map((v) => `automazioni/${v.slug}`),
    ...TIPI_SITO_TUTTI.map((v) => `siti-web/${v.slug}`),
    ...TIPI_CONTENUTO_TUTTI.map((v) => `contenuti/${v.slug}`),
    ...TIPI_CAMPAGNA_TUTTI.map((v) => `campagne/${v.slug}`),
  ]
  assert.deepEqual(PAGINE_DEDICATE.map((p) => `${p.servizio}/${p.slug}`).sort(), attese.sort())
  assert.ok(PAGINE_DEDICATE.length >= 26)
  const disegni = readFileSync(new URL('./sezioni/Vignetta.tsx', import.meta.url), 'utf8')
  for (const p of PAGINE_DEDICATE) {
    const dove = `${p.servizio}/${p.slug}`
    assert.ok(p.cosa.length >= 80 && p.cosa.length <= 330, `${dove}: cosa ${p.cosa.length}`)
    assert.equal(p.passi.length, 3)
    p.passi.forEach((x) => assert.ok(x.length >= 30 && x.length <= 150, `${dove}: passo «${x}»`))
    assert.ok(p.faq.length >= 2 && p.faq.every((f) => f.d.length <= 70 && f.r.length <= 280), `${dove}: domande`)
    assert.ok(p.perChi.length >= 2 && p.perChi.every((m) => m in NOMI_MESTIERE), `${dove}: per chi`)
    assert.ok(new RegExp(`['"]?${p.vignetta.replace('-', '[-]')}['"]?: [A-Z]`).test(disegni), `${dove}: scena ${p.vignetta} registrata`)
    const testo = [p.cosa, ...p.passi, ...p.faq.flatMap((f) => [f.d, f.r])].join(' ')
    assert.ok(!/€|\beuro\b|intelligenza artificiale/i.test(testo) && !/\bA\.?I\.?\b/.test(testo), `${dove}: niente prezzi né «intelligenza artificiale»`)
    assert.ok(!/bacheca|portfolio/i.test(testo), `${dove}: R7`)
    ;(p.esempi ?? []).forEach((e) => assert.ok(e.href.startsWith('https://') && e.immagine && e.alt && e.fantasia && (!e.video || e.video.mp4.endsWith('.mp4')), `${dove}: esempio ${e.nome} (demo con attività di fantasia)`))
  }
  assert.ok(PAGINE_DEDICATE.every((p) => !p.esempi?.length || p.esempi.every((e) => !/oltre frontiera/i.test(e.nome))), 'Lavoro Oltre Frontiera non è tra gli esempi (decisione di Bruno 31/10)')
})
