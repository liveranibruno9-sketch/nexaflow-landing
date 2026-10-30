// Il motore del film (porting di molino-nuovo/molino.js): scroll → u → disegno dei fotogrammi su un canvas,
// opacità delle battute (testo HTML vero, mai nel canvas), indice in alto, variabili CSS.
// La regia non è più scritta qui dentro: arriva da `regia` (dati/<pagina>.ts). I calcoli puri stanno in
// calcoli.ts, regia.ts e materia-calcoli.ts (con i test). Sul canvas `tela-materia` le particelle (materia.ts):
// nome e motti scritti lettera per lettera, velo fra gli agenti, convergenza nel pulsante, scia, burst delle frasi.
import { approach, containRect, coppia, coverRect, liscio, nearestReady } from './calcoli'
import { creaCaricatore } from './caricatore'
import { disegnaCreatura } from './creature'
import { faseCreatura, piedeMassimo, postoCreatura } from './creature-calcoli'
import { creaMateria } from './materia'
import type { Materie } from './materia'
import { MATERIE, limiteParticelle, materiaScena, rettangoloFotogramma } from './materia-calcoli'
import type { Modo } from './modo'
import { fotogrammaApertura, indiceAtto, sceneAttive, zoomScena } from './regia'
import type { Atto, Creatura, Materia, Regia, Scena } from './regia'

/** la scia del cursore sul computer e l'anello al tocco sul telefono (D26): è la prima cosa da togliere se R12 non regge */
const SCIA = true

const LUCE = 'rgba(242, 194, 122, 0.16)'      // la luce calda dello studio (vincoli globali)
const LUCE_FINE = 'rgba(242, 194, 122, 0)'
const NOVE_SEDICESIMI = 9 / 16
const SPOSTA = 28                              // px: le battute salgono da +28 a −28 lungo la loro finestra
const ANTICIPO = 1.2                           // u: una scena si chiede al caricatore poco prima che serva
const SCRITTURA = 0.7                          // nome e motti si scrivono nel primo 70% della loro finestra
const VELOCE = 3                               // u al secondo: oltre (scroll di più di 3 schermi al secondo) niente particelle nuove

/** ePulsante: il pulsante del finale, che quando compare brilla (classe `brilla`) */
type StatoBattuta = { el: HTMLElement; da: number; a: number; s: number; o: number; y: number; vis: boolean | null; ePulsante: boolean }
type Scrittura = { el: HTMLElement; da: number; fine: number; m: Materia | 'ciclo' }

const eMateria = (m: string | undefined): m is Materia => !!m && (MATERIE as readonly string[]).includes(m)
/** la materia dell'atto che contiene l'elemento (data-materia), se c'è */
const materiaDi = (el: HTMLElement): Materia | undefined => {
  const m = el.closest<HTMLElement>('.atto')?.dataset.materia
  return eMateria(m) ? m : undefined
}
const agente = (nome: string) => nome.split('-')[0]
/** margine fra il piede della creatura e le frasi, in px CSS (sul telefono la creatura sta sopra le frasi) */
const MARGINE_TESTO = 12
const MARGINE_SCHERMO = 0.03     // la creatura non sta più vicina al bordo sinistro dello schermo (quota della larghezza)

export function avviaFilm(radice: HTMLElement, regia: Regia, opz: { modo: Modo; misura: 720 | 1080; particelle: boolean }): () => void {
  const palco = radice.querySelector<HTMLElement>('.palco')
  const tela = radice.querySelector<HTMLCanvasElement>('canvas.tela')
  const telaMateria = radice.querySelector<HTMLCanvasElement>('canvas.tela-materia')
  const interfaccia = radice.querySelector<HTMLElement>('.interfaccia')
  const ctx = tela && tela.getContext('2d')
  if (!palco || !tela || !ctx || !interfaccia) return () => {}

  const T = regia.T
  const K = opz.modo === 'minimo' ? 0.3 : 0.16
  const ap = regia.apertura
  const conteggio = ap ? ap.conteggio[opz.modo] : 0
  const html = document.documentElement

  let corrente = 0
  let obiettivo = 0
  let inCorsa = false
  let mosso = false          // diventa vero al primo scroll
  let raf = 0
  let ultimoTempo = 0        // timestamp del fotogramma precedente (per il dt delle particelle)
  let largPalco = 0          // misura del palco in px CSS (dall'ultimo ridimensiona)
  let altPalco = 0
  let ultimaChiave = ''
  let versione = 0           // cresce a ogni immagine pronta: il disegno uguale va rifatto
  let atto = -2
  let vivo = true
  let luce: { W: number; H: number; g: CanvasGradient } | null = null
  let tempoCreatura = 0      // secondi dal rAF: il moto a regime della creatura (0 = ferma)
  // le creature (D32): una per agente, nella scena del beneficio. Animate solo con particelle (non col movimento ridotto)
  const animata = opz.particelle
  const creature: { atto: Atto; c: Creatura }[] = regia.atti.flatMap((at) => (at.creatura ? [{ atto: at, c: at.creatura }] : []))
  type Ostacolo = { x0: number; x1: number; y0: number }
  const ostacoli = new Map<string, Ostacolo[]>()   // le frasi di ogni atto e i pulsanti di contatto, in px del canvas
  let ostacoliPer = ''
  // i caratteri si caricano dopo il primo disegno e spostano le frasi: la misura si rifà
  if (creature.length && document.fonts) document.fonts.ready.then(() => ostacoli.clear(), () => {})

  const caricatore = creaCaricatore({
    modo: opz.modo, misura: opz.misura, conteggio,
    onPronto: () => { versione++; if (vivo && !inCorsa) ridisegna() },
  })
  // le 12 scene si mettono in coda solo dopo il primo disegno vero (vedi ridisegna): fino ad allora la rete è del poster
  // e dei primi fotogrammi dell'apertura
  let scenePrecaricate = false

  const battute: StatoBattuta[] = Array.from(radice.querySelectorAll<HTMLElement>('.battuta[data-da][data-a]')).map((el) => ({
    el, da: Number(el.dataset.da), a: Number(el.dataset.a), s: el.dataset.s ? Number(el.dataset.s) : 0.18, o: -1, y: NaN, vis: null,
    ePulsante: el.classList.contains('pulsante'),
  }))
  const numero = radice.querySelector<HTMLElement>('.indice-num')
  const nomeAtto = radice.querySelector<HTMLElement>('.indice-nome')
  const variabili: Record<string, string> = {}

  // ---------- La materia (spenta con particelle: false, cioè col modo minimo e col movimento ridotto) ----------
  const limite = opz.particelle && telaMateria ? limiteParticelle(opz.modo, window.innerWidth) : 0
  const materia: Materie | null = limite > 0 && telaMateria ? creaMateria(telaMateria, limite) : null
  // nome e motti: le lettere (span.lettera) si scrivono nel primo 70% della finestra, con la materia dell'atto
  // (il nome dell'apertura, che non ha un agente, con le quattro a ciclo)
  const scritture: Scrittura[] = materia
    ? battute.filter((b) => b.el.querySelector('.lettera')).map((b) => ({
      el: b.el, da: b.da, fine: b.da + SCRITTURA * (b.a - b.da), m: materiaDi(b.el) ?? 'ciclo',
    }))
    : []
  // le frasi con data-burst (pagine servizio, D28): un burst della materia all'ingresso
  const scoppi = materia
    ? battute.filter((b) => b.el.dataset.burst === '1').map((b) => ({ da: b.da, m: materiaDi(b.el) ?? 'polvere' as Materia }))
    : []
  const pulsante = radice.querySelector<HTMLElement>('.pulsante')
  let uMateria = NaN
  let meta: [number, number] = [0, 0]
  if (materia) radice.classList.add('materia-accesa')

  html.classList.add('film-attivo')

  // ---------- Disegno ----------
  function disegnaImg(im: HTMLImageElement | null, alfa: number, z: number): boolean {
    if (!im || !im.naturalWidth || !ctx || !tela) return false
    if (alfa <= 0.001) return true
    const W = tela.width, H = tela.height
    ctx.save()
    ctx.globalAlpha = alfa
    if (W / H > NOVE_SEDICESIMI) {
      // computer (e schermi larghi): la scena 9:16 intera al centro, nero ai lati; lo zoom resta dentro la colonna
      const r = containRect(im.naturalWidth, im.naturalHeight, W, H)
      const dw = r.dw * z, dh = r.dh * z
      ctx.beginPath(); ctx.rect(r.dx, r.dy, r.dw, r.dh); ctx.clip()
      ctx.drawImage(im, r.dx - (dw - r.dw) / 2, r.dy - (dh - r.dh) / 2, dw, dh)
    } else {
      // telefono: la scena riempie lo schermo (si tagliano un po' i lati), zoom attorno al centro
      const c = coverRect(im.naturalWidth, im.naturalHeight, W, H)
      ctx.drawImage(im, c.sx, c.sy, c.sw, c.sh, (W * (1 - z)) / 2, (H * (1 - z)) / 2, W * z, H * z)
    }
    ctx.restore()
    return true
  }

  // lo studio vuoto: nero e una luce calda in alto a sinistra
  function disegnaStudio(alfa: number) {
    if (!ctx || !tela) return
    const W = tela.width, H = tela.height
    if (!luce || luce.W !== W || luce.H !== H) {
      const g = ctx.createRadialGradient(0.22 * W, 0.18 * H, 0, 0.22 * W, 0.18 * H, 0.9 * H)
      g.addColorStop(0, LUCE)
      g.addColorStop(1, LUCE_FINE)
      luce = { W, H, g }
    }
    ctx.globalAlpha = alfa
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, W, H)
    ctx.fillStyle = luce.g
    ctx.fillRect(0, 0, W, H)
    ctx.globalAlpha = 1
  }

  // la clip d'apertura: fra un fotogramma e il successivo si sfuma, il movimento resta morbido anche con pochi fotogrammi
  function disegnaApertura(alfa: number, u: number): boolean {
    if (!ap || !conteggio) return false
    const p = coppia(fotogrammaApertura(ap, opz.modo, u), conteggio)
    const pronti: boolean[] = []
    for (let i = 0; i < conteggio; i++) pronti.push(caricatore.pronto(i))
    const a = nearestReady(pronti, p.a)
    if (a < 0) return false
    disegnaImg(caricatore.fotogramma(a), alfa, 1)
    const b = nearestReady(pronti, p.b)
    if (b >= 0 && b !== a && p.t > 0.02) disegnaImg(caricatore.fotogramma(b), alfa * p.t, 1)
    return true
  }

  /** true se la scena è stata disegnata davvero (immagine pronta o studio) */
  function disegnaScena(s: Scena, alfa: number, u: number): boolean {
    if (s.nome === 'studio') { disegnaStudio(alfa); return true }
    if (s.nome === 'apertura') return disegnaApertura(alfa, u)   // non è un file: è la sequenza (Ruling 2)
    return disegnaImg(caricatore.scena(s.nome), alfa, zoomScena(s, u))
  }

  // ---------- Le creature (D32) ----------
  /** i rettangoli che la creatura non deve coprire (bordo alto e larghezza, px del canvas): le frasi dell'atto e la barra dei contatti */
  function ostacolo(id: string): Ostacolo[] {
    if (!tela) return []
    const per = tela.width + 'x' + tela.height
    if (per !== ostacoliPer) { ostacoli.clear(); ostacoliPer = per }
    const noti = ostacoli.get(id)
    if (noti) return noti
    const out: Ostacolo[] = []
    const c = tela.getBoundingClientRect()
    if (c.width) {
      const k = tela.width / c.width
      const aggiungi = (els: HTMLElement[]) => {
        let x0 = Infinity, x1 = -Infinity, y0 = Infinity
        for (const el of els) {
          const r = el.getBoundingClientRect()
          if (!r.width || !r.height) continue
          x0 = Math.min(x0, r.left); x1 = Math.max(x1, r.right); y0 = Math.min(y0, r.top)
        }
        if (x1 > x0) out.push({ x0: (x0 - c.left) * k, x1: (x1 - c.left) * k, y0: (y0 - c.top) * k })
      }
      aggiungi(Array.from(radice.querySelectorAll<HTMLElement>(`.atto[data-id="${id}"] .frasi`)))
      // la barra dei contatti sta fuori dalla scena (fratello del film): si cerca nella radice della pagina
      aggiungi(Array.from((radice.closest('.film-radice') ?? document).querySelectorAll<HTMLElement>('.barra-contatti a')))
    }
    ostacoli.set(id, out)
    return out
  }

  /** il fotogramma 9:16 sul canvas e i limiti della creatura (sinistra dello schermo, sopra le frasi) */
  function postoDi(cr: { atto: Atto; c: Creatura }, ingresso: number, aspetto: number) {
    const W = tela ? tela.width : 0, H = tela ? tela.height : 0
    const f = rettangoloFotogramma(W, H)
    const fot = { dx: f.x, dy: f.y, dw: f.w, dh: f.h }
    const xMin = MARGINE_SCHERMO * W
    // dove sta la creatura senza il limite del piede, per sapere se le frasi le stanno sotto
    const senza = postoCreatura(fot, aspetto, 1, { xMin })
    const k = tela && largPalco ? tela.width / largPalco : 1
    let piedeMax: number | undefined
    for (const o of ostacolo(cr.atto.id)) {
      const m = piedeMassimo({ x0: senza.x, x1: senza.x + senza.w }, o, MARGINE_TESTO * k)
      if (m !== undefined) piedeMax = piedeMax === undefined ? m : Math.min(piedeMax, m)
    }
    return { fot, limiti: { xMin, piedeMax, fermo: !animata }, posto: postoCreatura(fot, aspetto, ingresso, { xMin, piedeMax }) }
  }

  /** vera finché una creatura è nella sua finestra (e ha ancora un'opacità): il moto a regime chiede un fotogramma dopo l'altro */
  function creaturaViva(u: number): boolean {
    for (const cr of creature) {
      const f = faseCreatura(cr.c, u)
      if (f.visibile && f.uscita > 0.003) return true
    }
    return false
  }

  /** le creature nella loro finestra, sopra la scena del beneficio, dentro il fotogramma */
  function disegnaCreature(u: number) {
    if (!ctx || !tela || !creature.length) return
    for (const cr of creature) {
      const f = faseCreatura(cr.c, u)
      if (!f.visibile || f.uscita <= 0.003) continue
      const im = caricatore.scena(cr.c.nome)       // X-2: già nel film; se manca parte adesso e si ridisegna da onPronto
      if (!im || !im.naturalWidth) continue
      const { fot, limiti } = postoDi(cr, f.ingresso, (cr.c.ritaglio[2] * 9) / (cr.c.ritaglio[3] * 16))
      ctx.globalAlpha = f.uscita
      disegnaCreatura(ctx, im, cr.c, fot, f.ingresso, animata ? tempoCreatura : 0, limiti)
      ctx.globalAlpha = 1
    }
  }

  function ridisegna() {
    if (!ctx || !tela || !tela.width) return
    const u = corrente * T
    const muove = animata && creaturaViva(u)
    const chiave = u.toFixed(4) + '|' + versione + '|' + tela.width + 'x' + tela.height + (muove ? '|' + tempoCreatura : '')
    if (chiave === ultimaChiave) return
    const { a, b, t } = sceneAttive(regia.scene, u)
    ctx.globalAlpha = 1
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, tela.width, tela.height)
    let disegnata = a ? disegnaScena(a, 1, u) : false
    // la sovrapposizione delle finestre è la dissolvenza: b arriva sopra a con opacità t
    if (b && t > 0.001) disegnata = disegnaScena(b, t, u) || disegnata
    ctx.globalAlpha = 1
    if (disegnata) disegnaCreature(u)
    if (disegnata && !radice.classList.contains('pronto')) radice.classList.add('pronto')
    if (disegnata && !scenePrecaricate) { scenePrecaricate = true; caricatore.precarica(regia.scene.map((s) => s.nome)) }
    ultimaChiave = chiave
  }

  function ridimensiona() {
    if (!tela || !palco) return
    const w = palco.clientWidth, h = palco.clientHeight
    if (!w || !h) return
    largPalco = w; altPalco = h
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const W = Math.round(w * dpr), H = Math.round(h * dpr)
    if (tela.width === W && tela.height === H) return
    tela.width = W
    tela.height = H
    // il canvas della materia ha la stessa misura (cambiarla lo svuota: il prossimo passo lo ridisegna)
    if (materia && telaMateria) { telaMateria.width = W; telaMateria.height = H; sveglia() }
    ultimaChiave = ''
    ridisegna()
  }

  // ---------- Materia: cosa chiede la regia a ogni u ----------
  /** letture prima delle scritture: si chiama prima di stato(), che sposta le battute. dt = secondi dal fotogramma prima */
  function regiaMateria(dt: number) {
    if (!materia || !telaMateria) return
    const u = corrente * T
    if (u === uMateria) return
    const prima = uMateria
    uMateria = u
    // scroll veloce (o primo disegno): le lettere si scrivono e il velo segue, ma senza particelle; altrimenti
    // nascerebbero sopra battute già passate e resterebbero a galleggiare nelle scene dopo
    const calmo = !isNaN(prima) && dt > 0 && Math.abs(u - prima) / dt < VELOCE

    // nome e motti scritti con la materia (D26)
    for (const s of scritture) materia.scrivi(s.el, s.m, (u - s.da) / (s.fine - s.da), calmo)

    // il velo nei passaggi fra due agenti, o dallo studio al primo agente (D31); dentro un agente e verso lo studio no
    const { a, b, t } = sceneAttive(regia.scene, u)
    if (a && b && t > 0 && t < 1 && agente(a.nome) !== agente(b.nome)) {
      const mb = materiaScena(b.nome)
      if (mb) materia.velo(materiaScena(a.nome) ?? mb, mb, t, calmo)
    }

    // la convergenza delle quattro materie dove sta il pulsante (D22); il pulsante si misura solo dentro la finestra
    const cv = regia.convergenza
    if (cv) {
      const tc = (u - cv[0]) / (cv[1] - cv[0])
      if (tc > 0 && tc < 1 && pulsante) {
        const r = pulsante.getBoundingClientRect()
        const c = telaMateria.getBoundingClientRect()
        if (r.width) meta = [r.left - c.left + r.width / 2, r.top - c.top + r.height / 2]
      }
      materia.convergi(meta, tc, MATERIE as Materia[])
      // quando il pulsante nasce, un piccolo scoppio delle quattro materie al suo posto
      if (calmo && regia.pulsante && prima < regia.pulsante.da && u >= regia.pulsante.da && tc < 1) {
        for (const m of MATERIE) materia.burst(meta[0], meta[1], m, 6)
      }
    }

    // la creatura che entra nella scena del beneficio: un burst della materia dell'atto dove sta per arrivare (D32)
    if (calmo && largPalco) {
      for (const cr of creature) {
        if (!(prima < cr.c.da && u >= cr.c.da && u < cr.c.a)) continue
        const { posto } = postoDi(cr, 1, (cr.c.ritaglio[2] * 9) / (cr.c.ritaglio[3] * 16))
        const k = tela ? tela.width / largPalco : 1
        materia.burst((posto.x + posto.w / 2) / k, (posto.y + posto.h * 0.55) / k, cr.atto.materia ?? 'polvere', Math.round(limite * 0.07))
      }
    }

    // le frasi con data-burst: all'ingresso, vicino alla creatura (0,62 · 0,58 del fotogramma)
    if (scoppi.length && calmo) {
      let fr: { x: number; y: number; w: number; h: number } | null = null
      for (const s of scoppi) {
        if (prima < s.da && u >= s.da) {
          fr = fr || rettangoloFotogramma(largPalco, altPalco)
          materia.burst(fr.x + 0.62 * fr.w, fr.y + 0.58 * fr.h, s.m, Math.round(limite * 0.05))
        }
      }
    }
  }

  /** la materia dell'atto in scena (fuori dagli agenti la polvere: il blu, D23) */
  function materiaCorrente(): Materia {
    const at = regia.atti[Math.max(0, atto)]
    return (at && at.materia) || 'polvere'
  }

  // ---------- Battute, indice, variabili ----------
  function imposta(nome: string, valore: string) {
    if (variabili[nome] === valore) return
    variabili[nome] = valore
    radice.style.setProperty(nome, valore)
  }

  function stato() {
    const u = corrente * T
    for (const b of battute) {
      // come opacita() di regia.ts (sfuma, rampe di s); una battuta che parte da u = 0 è già accesa all'arrivo
      const r = Math.min(b.s, Math.max(0, (b.a - b.da) / 2))
      const sale = b.da <= 0 ? 1 : liscio(b.da, b.da + r, u)
      const scende = liscio(b.a - r, b.a, u)
      const o = Math.round(sale * (1 - scende) * 1000) / 1000
      const vis = o > 0.004
      if (b.vis !== vis) {
        b.vis = vis
        // spenta = visibility: hidden, quindi fuori anche dal giro del tasto Tab (link, cartolina e pulsante)
        b.el.style.visibility = vis ? 'visible' : 'hidden'
        if (b.ePulsante) {
          // il pulsante: quando compare brilla delle quattro materie e poi si ferma (D22, animazione CSS)
          b.el.style.pointerEvents = vis ? 'auto' : 'none'
          b.el.classList.toggle('brilla', vis)
        }
      }
      if (!vis) continue
      const y = Math.round(((1 - sale) * SPOSTA - scende * SPOSTA) * 10) / 10
      if (b.o !== o) { b.o = o; b.el.style.opacity = String(o) }
      if (b.y !== y) { b.y = y; b.el.style.transform = `translate3d(0, ${y}px, 0)` }
    }

    const i = indiceAtto(regia.atti, u)
    if (i !== atto) {
      atto = i
      const at = regia.atti[Math.max(0, i)]
      const num = at ? at.etichetta.split(' · ')[0] : ''
      if (numero) numero.textContent = /^\d+$/.test(num) ? num : ''   // lo studio e il finale non hanno un numero
      if (nomeAtto) nomeAtto.textContent = at ? at.nome : ''
    }

    imposta('--p', corrente.toFixed(4))
    imposta('--testa', liscio(0.5, 1.2, u).toFixed(2))
  }

  // ---------- Scroll ----------
  function avanzamento(): number {
    if (!palco) return 0
    const corsa = radice.offsetHeight - palco.offsetHeight
    if (corsa <= 0) return 0
    return Math.min(1, Math.max(0, -radice.getBoundingClientRect().top / corsa))
  }

  function carica() {
    const u = corrente * T
    if (ap && conteggio) caricatore.posiziona(fotogrammaApertura(ap, opz.modo, u), mosso)
    // le scene vicine si chiedono prima che servano (passano davanti alla coda di precaricamento)
    for (const s of regia.scene) if (s.da <= u + ANTICIPO && s.a >= u) caricatore.scena(s.nome)
  }

  /**
   * Un fotogramma. Gira finché lo scroll insegue l'obiettivo (inCorsa) o finché la materia ha particelle vive;
   * poi si ferma: senza particelle (particelle: false) il ciclo è quello di prima, nessun lavoro in più.
   */
  function passo(ora: number) {
    raf = 0
    if (!vivo) return
    const dt = ultimoTempo ? Math.min(0.05, Math.max(0, (ora - ultimoTempo) / 1000)) : 1 / 60
    ultimoTempo = ora
    tempoCreatura = ora / 1000
    if (inCorsa) {
      const r = approach(corrente, obiettivo, K, 0.0002)
      corrente = r.value
      carica()
      ridisegna()
      regiaMateria(dt)
      stato()
      if (r.done) inCorsa = false
    }
    let ancora = inCorsa
    // la creatura si muove da sola (balzo, rotazione, bagliore): finché è in scena un fotogramma dopo l'altro
    if (animata && creaturaViva(corrente * T)) {
      if (!inCorsa) ridisegna()
      ancora = true
    }
    // la misura del palco è quella dell'ultimo ridimensiona: leggerla qui, dopo le scritture di stato(), forzerebbe un layout
    if (materia) ancora = materia.passo(dt, largPalco, altPalco) || ancora
    if (ancora) raf = window.requestAnimationFrame(passo)
    else ultimoTempo = 0
  }

  /** chiede un fotogramma se il ciclo è fermo (un solo ciclo alla volta) */
  function sveglia() {
    if (vivo && !raf) raf = window.requestAnimationFrame(passo)
  }

  function alScroll() {
    mosso = true
    obiettivo = avanzamento()
    inCorsa = true
    sveglia()
  }

  function alRidimensiona() {
    ridimensiona()
    alScroll()
  }

  function alRitorno(e: PageTransitionEvent) {
    if (e.persisted) { ultimaChiave = ''; ridisegna() }
  }

  // ---------- Scia (D26): computer = scia del cursore, telefono = anello al tocco ----------
  /** il punto del puntatore nel palco, o null se è fuori (per esempio sopra la coda) */
  function nelPalco(e: PointerEvent): [number, number] | null {
    if (!telaMateria) return null
    const r = telaMateria.getBoundingClientRect()
    const x = e.clientX - r.left, y = e.clientY - r.top
    return x >= 0 && y >= 0 && x <= r.width && y <= r.height ? [x, y] : null
  }

  function alPuntatore(e: PointerEvent) {
    if (!materia || e.pointerType === 'touch') return
    const p = nelPalco(e)
    if (!p) return
    materia.scia(p[0], p[1], materiaCorrente())
    sveglia()
  }

  function alTocco(e: PointerEvent) {
    if (!materia || e.pointerType !== 'touch') return
    const p = nelPalco(e)
    if (!p) return
    materia.burst(p[0], p[1], materiaCorrente(), 14, true)
    sveglia()
  }

  corrente = obiettivo = avanzamento()
  mosso = corrente > 0
  carica()
  ridimensiona()
  ridisegna()
  regiaMateria(0)
  stato()

  window.addEventListener('scroll', alScroll, { passive: true })
  window.addEventListener('resize', alRidimensiona)
  window.addEventListener('pageshow', alRitorno)
  const conScia = !!materia && SCIA
  if (conScia) {
    window.addEventListener('pointermove', alPuntatore, { passive: true })
    window.addEventListener('pointerdown', alTocco, { passive: true })
  }

  return () => {
    vivo = false
    if (raf) window.cancelAnimationFrame(raf)
    raf = 0
    window.removeEventListener('scroll', alScroll)
    if (conScia) {
      window.removeEventListener('pointermove', alPuntatore)
      window.removeEventListener('pointerdown', alTocco)
    }
    if (materia) materia.svuota()
    radice.classList.remove('materia-accesa')
    window.removeEventListener('resize', alRidimensiona)
    window.removeEventListener('pageshow', alRitorno)
    caricatore.ferma()
    // via anche `film-js`: da sola terrebbe la pagina nello stato d'attesa (solo poster) senza motore
    html.classList.remove('film-attivo', 'film-js')
    radice.classList.remove('pronto')
    for (const n of Object.keys(variabili)) radice.style.removeProperty(n)
    for (const b of battute) {
      b.el.style.removeProperty('opacity'); b.el.style.removeProperty('transform'); b.el.style.removeProperty('visibility')
      if (b.ePulsante) { b.el.style.removeProperty('pointer-events'); b.el.classList.remove('brilla') }
    }
  }
}
