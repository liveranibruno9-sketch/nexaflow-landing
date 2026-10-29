// Il motore del film (porting di molino-nuovo/molino.js): scroll → u → disegno dei fotogrammi su un canvas,
// opacità delle battute (testo HTML vero, mai nel canvas), indice in alto, variabili CSS.
// La regia non è più scritta qui dentro: arriva da `regia` (dati/<pagina>.ts). I calcoli puri stanno in
// calcoli.ts e regia.ts (con i test). Il canvas della materia (`tela-materia`) resta vuoto fino al compito 7.
import { approach, containRect, coppia, coverRect, liscio, nearestReady } from './calcoli'
import { creaCaricatore } from './caricatore'
import type { Modo } from './modo'
import { fotogrammaApertura, indiceAtto, sceneAttive, zoomScena } from './regia'
import type { Regia, Scena } from './regia'

const LUCE = 'rgba(242, 194, 122, 0.16)'      // la luce calda dello studio (vincoli globali)
const LUCE_FINE = 'rgba(242, 194, 122, 0)'
const NOVE_SEDICESIMI = 9 / 16
const SPOSTA = 28                              // px: le battute salgono da +28 a −28 lungo la loro finestra
const ANTICIPO = 1.2                           // u: una scena si chiede al caricatore poco prima che serva

type StatoBattuta = { el: HTMLElement; da: number; a: number; s: number; o: number; y: number; vis: boolean | null }

export function avviaFilm(radice: HTMLElement, regia: Regia, opz: { modo: Modo; misura: 720 | 1080; particelle: boolean }): () => void {
  const palco = radice.querySelector<HTMLElement>('.palco')
  const tela = radice.querySelector<HTMLCanvasElement>('canvas.tela')
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
  let ultimaChiave = ''
  let versione = 0           // cresce a ogni immagine pronta: il disegno uguale va rifatto
  let atto = -2
  let vivo = true
  let luce: { W: number; H: number; g: CanvasGradient } | null = null

  const caricatore = creaCaricatore({
    modo: opz.modo, misura: opz.misura, conteggio,
    onPronto: () => { versione++; if (vivo && !inCorsa) ridisegna() },
  })
  caricatore.precarica(regia.scene.map((s) => s.nome))

  const battute: StatoBattuta[] = Array.from(radice.querySelectorAll<HTMLElement>('.battuta[data-da][data-a]')).map((el) => ({
    el, da: Number(el.dataset.da), a: Number(el.dataset.a), s: el.dataset.s ? Number(el.dataset.s) : 0.18, o: -1, y: NaN, vis: null,
  }))
  const numero = radice.querySelector<HTMLElement>('.indice-num')
  const nomeAtto = radice.querySelector<HTMLElement>('.indice-nome')
  const variabili: Record<string, string> = {}

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

  function ridisegna() {
    if (!ctx || !tela || !tela.width) return
    const u = corrente * T
    const chiave = u.toFixed(4) + '|' + versione + '|' + tela.width + 'x' + tela.height
    if (chiave === ultimaChiave) return
    const { a, b, t } = sceneAttive(regia.scene, u)
    ctx.globalAlpha = 1
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, tela.width, tela.height)
    let disegnata = a ? disegnaScena(a, 1, u) : false
    // la sovrapposizione delle finestre è la dissolvenza: b arriva sopra a con opacità t
    if (b && t > 0.001) disegnata = disegnaScena(b, t, u) || disegnata
    ctx.globalAlpha = 1
    if (disegnata && !radice.classList.contains('pronto')) radice.classList.add('pronto')
    ultimaChiave = chiave
  }

  function ridimensiona() {
    if (!tela || !palco) return
    const w = palco.clientWidth, h = palco.clientHeight
    if (!w || !h) return
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const W = Math.round(w * dpr), H = Math.round(h * dpr)
    if (tela.width === W && tela.height === H) return
    tela.width = W
    tela.height = H
    ultimaChiave = ''
    ridisegna()
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
      if (b.vis !== vis) { b.vis = vis; b.el.style.visibility = vis ? 'visible' : 'hidden' }
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
      if (numero) numero.textContent = /^\d+$/.test(num) ? num : String(Math.max(0, i)).padStart(2, '0')
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

  function passo() {
    raf = 0
    if (!vivo) return
    const r = approach(corrente, obiettivo, K, 0.0002)
    corrente = r.value
    carica()
    ridisegna()
    stato()
    if (r.done) inCorsa = false
    else raf = window.requestAnimationFrame(passo)
  }

  function alScroll() {
    mosso = true
    obiettivo = avanzamento()
    if (!inCorsa) { inCorsa = true; raf = window.requestAnimationFrame(passo) }
  }

  function alRidimensiona() {
    ridimensiona()
    alScroll()
  }

  function alRitorno(e: PageTransitionEvent) {
    if (e.persisted) { ultimaChiave = ''; ridisegna() }
  }

  corrente = obiettivo = avanzamento()
  mosso = corrente > 0
  carica()
  ridimensiona()
  ridisegna()
  stato()

  window.addEventListener('scroll', alScroll, { passive: true })
  window.addEventListener('resize', alRidimensiona)
  window.addEventListener('pageshow', alRitorno)

  return () => {
    vivo = false
    if (raf) window.cancelAnimationFrame(raf)
    window.removeEventListener('scroll', alScroll)
    window.removeEventListener('resize', alRidimensiona)
    window.removeEventListener('pageshow', alRitorno)
    caricatore.ferma()
    html.classList.remove('film-attivo')
    radice.classList.remove('pronto')
    for (const n of Object.keys(variabili)) radice.style.removeProperty(n)
    for (const b of battute) { b.el.style.removeProperty('opacity'); b.el.style.removeProperty('transform'); b.el.style.removeProperty('visibility') }
  }
}
