// L'anello delle quattro materie: il cerchio dell'apertura fatto di particelle (stessa posizione e stessi colori del poster),
// il nome «Agenti Studio» che si compone dentro il foro (D38), poi le quattro porte della soglia (storyboard A1-A3, S1-S3).
// Piano-costruzione-v2, compito 6. Il nome HTML vero compare sotto, esattamente nello stesso punto, quando le lettere sono complete.
import { AdditiveBlending, BufferAttribute, BufferGeometry, Group, Mesh, PlaneGeometry, Points, ShaderMaterial, Vector3 } from 'three'
import { campiona, materiaDaColore, mulberry32 } from '../campiona.ts'
import type { Kit } from '../kit.ts'
import { CONTEGGI } from '../livello.ts'
import type { Livello, Materia } from '../tipi.ts'
import { ALONE_FRAG, ALONE_VERT } from './shader.ts'
import { ANELLO_PUNTI_FRAG, ANELLO_PUNTI_VERT } from './shader-anello.ts'

export type Anello = {
  gruppo: Group
  /** parte l'apertura a tempo (una volta, al caricamento): ora in secondi */
  avvia(ora: number): void
  /** camZ = z della camera; px = pixel per unità a distanza 1 */
  aggiorna(tempo: number, dt: number, camZ: number, px: number, camX: number, camY: number): void
  /** centro in frazioni dello schermo (cx da sinistra, cy dall'alto) e lato del quadrato del poster in px CSS */
  posa(o: { cx: number; cy: number; lato: number; larghezza: number; altezza: number; fov: number; aspetto: number }): void
  /** i comandi del Kit: gli stessi di `Kit.anello`, più `inizia` (azzera i flag) e `usato` */
  comandi: Kit['anello']
  inizia(): void
  usato(): boolean
  porte(z: [number, number, number, number]): void
  arcoInAlto(): Materia | null
  /** 0..1 il nome è formato (lettere complete) */
  nomeFormato(): boolean
  dispose(): void
}

const MATERIE: Materia[] = ['polvere', 'vetro', 'saette', 'cromo']
const DIST = 10
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x))
const liscia = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}

/** i rettangoli (px CSS) delle parole del nome nell'elemento HTML */
function paroleDelNome(nome: HTMLElement): { testo: string; r: DOMRect }[] {
  const nodo = nome.querySelector('span') ?? nome
  const testo = nodo.firstChild
  const out: { testo: string; r: DOMRect }[] = []
  if (!testo || testo.nodeType !== Node.TEXT_NODE) return out
  const s = testo.textContent ?? ''
  let da = 0
  for (const parola of s.split(' ')) {
    if (parola) {
      const range = document.createRange()
      range.setStart(testo, da)
      range.setEnd(testo, da + parola.length)
      const r = range.getBoundingClientRect()
      if (r.width > 0) out.push({ testo: parola, r })
    }
    da += parola.length + 1
  }
  return out
}

export async function creaAnello(o: {
  livello: Livello
  poster: HTMLImageElement
  nome: HTMLElement
  quadrato: HTMLElement
  colori: Record<Materia, number[]> & { luce: number[] }
}): Promise<Anello> {
  const n = Math.min(CONTEGGI[o.livello].punti, 9000)
  // il poster è un quadrato ritagliato al centro dell'immagine (object-fit: cover)
  const img = o.poster
  if (!img.complete || !img.naturalWidth) await img.decode().catch(() => undefined)
  const C = 256
  const cv = document.createElement('canvas')
  cv.width = C
  cv.height = C
  const cx2 = cv.getContext('2d', { willReadFrequently: true })
  if (!cx2) throw new Error('canvas 2d non disponibile')
  const lato = Math.min(img.naturalWidth, img.naturalHeight)
  cx2.drawImage(img, (img.naturalWidth - lato) / 2, (img.naturalHeight - lato) / 2, lato, lato, 0, 0, C, C)
  const campione = campiona({ dati: cx2.getImageData(0, 0, C, C).data, w: C, h: C }, null, n, 20261030)

  // la materia di ogni particella dal suo colore; l'angolo medio di ogni materia dice quale arco passa in alto
  const materie = new Float32Array(n)
  const somma = MATERIE.map(() => [0, 0])
  for (let i = 0; i < n; i++) {
    const m = MATERIE.indexOf(materiaDaColore(campione.col[i * 3] * 255, campione.col[i * 3 + 1] * 255, campione.col[i * 3 + 2] * 255))
    materie[i] = m
    const x = campione.pos[i * 3] - 0.5
    const y = 0.5 - campione.pos[i * 3 + 1]
    if (Math.hypot(x, y) > 0.2) { somma[m][0] += x; somma[m][1] += y }
  }
  const angoloMateria = somma.map(([x, y]) => Math.atan2(y, x))

  // i bersagli del nome: ogni parola disegnata sullo stesso rettangolo del testo HTML; polvere e vetro → «Agenti», saette e cromo → «Studio»
  await document.fonts.ready
  const parole = paroleDelNome(o.nome)
  const quad = o.quadrato.getBoundingClientRect()
  const cs = getComputedStyle(o.nome)
  const S = 512
  const caso = mulberry32(555)
  const aAnello = new Float32Array(n * 2)
  const aCaso = new Float32Array(n * 4)
  for (let i = 0; i < n; i++) {
    aAnello[i * 2] = campione.pos[i * 3] - 0.5
    aAnello[i * 2 + 1] = 0.5 - campione.pos[i * 3 + 1]
  }
  for (let i = 0; i < aCaso.length; i++) aCaso[i] = caso()
  // l'anello continua a girare: solo una parte delle particelle (circa il 45%) vola a comporre le lettere, le altre restano nel cerchio
  const nelNome = (i: number) => aCaso[i * 4 + 3] < 0.45
  const aNome = Float32Array.from(aAnello)
  const gruppi = [0, 1].map((g) => Array.from({ length: n }, (_, i) => i).filter((i) => nelNome(i) && (materie[i] < 2 ? 0 : 1) === g))
  gruppi.forEach((indici, g) => {
    const parola = parole[Math.min(g, parole.length - 1)]
    const c = document.createElement('canvas')
    c.width = S
    c.height = S
    const k = c.getContext('2d', { willReadFrequently: true })
    if (!k || !parola || !quad.width || !indici.length) return
    const px = S / quad.width
    const r = parola.r
    const alt = parseFloat(cs.fontSize) * px
    k.fillStyle = '#000'
    k.fillRect(0, 0, S, S)
    k.fillStyle = '#fff'
    k.font = `${cs.fontWeight} ${alt}px ${cs.fontFamily}`
    k.textBaseline = 'alphabetic'
    const larghezza = k.measureText(parola.testo).width || 1
    k.save()
    // il carattere è condensato (font-stretch): si scala in orizzontale fino alla larghezza vera della parola
    const cxp = (r.left - quad.left) * px
    const base = (r.top - quad.top) * px + r.height * px * 0.8
    k.translate(cxp, base)
    k.scale((r.width * px) / larghezza, 1)
    k.fillText(parola.testo, 0, 0)
    k.restore()
    const t = campiona({ dati: k.getImageData(0, 0, S, S).data, w: S, h: S }, null, indici.length, 99 + g)
    indici.forEach((i, j) => {
      aNome[i * 2] = t.pos[j * 3] - 0.5
      aNome[i * 2 + 1] = 0.5 - t.pos[j * 3 + 1]
    })
  })

  const g = new BufferGeometry()
  g.setAttribute('position', new BufferAttribute(new Float32Array(n * 3), 3))
  g.setAttribute('aAnello', new BufferAttribute(aAnello, 2))
  g.setAttribute('aNome', new BufferAttribute(aNome, 2))
  g.setAttribute('aCol', new BufferAttribute(campione.col, 3))
  g.setAttribute('aMat', new BufferAttribute(materie, 1))
  g.setAttribute('aCaso', new BufferAttribute(aCaso, 4))
  const v3 = (c: number[]) => new Vector3(c[0], c[1], c[2])
  const u = {
    uAng: { value: 0 }, uNome: { value: 0 }, uApri: { value: 0 }, uCaldo: { value: 0 }, uTempo: { value: 0 }, uPx: { value: 1 },
    uLato: { value: 4 }, uCentro: { value: new Vector3() }, uCam: { value: new Vector3() }, uCamZ: { value: 0 }, uDist: { value: DIST }, uPunto: { value: 0.03 },
    uAccese: { value: [0.35, 0.35, 0.35, 0.35] }, uPorta: { value: [-100, -200, -300, -400] }, uAlfa: { value: 1 }, uAlfaNome: { value: 1 },
    uLuce: { value: v3(o.colori.luce) },
  }
  const materiale = new ShaderMaterial({ vertexShader: ANELLO_PUNTI_VERT, fragmentShader: ANELLO_PUNTI_FRAG, uniforms: u, transparent: true, depthWrite: false, blending: AdditiveBlending })
  const punti = new Points(g, materiale)
  punti.frustumCulled = false
  const gruppo = new Group()
  gruppo.add(punti)
  // il punto di luce calda al centro del foro: la persona (1.8)
  const geomAlone = new PlaneGeometry(1, 1)
  const matAlone = new ShaderMaterial({ vertexShader: ALONE_VERT, fragmentShader: ALONE_FRAG, uniforms: { uColore: { value: v3(o.colori.luce) }, uAlfa: { value: 0 } }, transparent: true, depthWrite: false, blending: AdditiveBlending })
  const alone = new Mesh(geomAlone, matAlone)
  alone.frustumCulled = false
  gruppo.add(alone)

  /* ----- stato: a tempo (l'apertura, una volta) e a comandi (regia, ogni fotogramma) ----- */
  let t0 = -1
  let intro = 0
  let formato = false
  let ang = 0
  let usatoOra = false
  let cmd = { ritorno: 0, caldo: 0, giro: 0.35, apri: 0, punto: 0, accese: [0.35, 0.35, 0.35, 0.35], nome: 1 }
  let lato2 = 4
  let cxw = 0
  let cyw = 0
  const comandi: Kit['anello'] = {
    nome: (t) => { usatoOra = true; cmd.nome = t },
    ritorno: (t) => { usatoOra = true; cmd.ritorno = clamp(t, 0, 1) },
    arco: (m, a) => { usatoOra = true; cmd.accese[MATERIE.indexOf(m)] = clamp(a, 0, 1) },
    giro: (v) => { usatoOra = true; cmd.giro = v },
    caldo: (t) => { usatoOra = true; cmd.caldo = clamp(t, 0, 1) },
    punto: (t) => { usatoOra = true; cmd.punto = clamp(t, 0, 1) },
    apri: (t) => { usatoOra = true; cmd.apri = clamp(t, 0, 1) },
  }
  let arcoAlto: Materia | null = null

  return {
    gruppo,
    comandi,
    avvia(ora) {
      t0 = ora
    },
    inizia() {
      usatoOra = false
      cmd = { ritorno: 0, caldo: 0, giro: 0.35, apri: 0, punto: 0, accese: [0.35, 0.35, 0.35, 0.35], nome: 1 }
    },
    usato: () => usatoOra,
    porte(z) {
      u.uPorta.value = z
    },
    posa(p) {
      const meta = DIST * Math.tan((p.fov * Math.PI) / 360)
      lato2 = (p.lato / p.altezza) * 2 * meta
      cxw = (p.cx * 2 - 1) * meta * p.aspetto
      cyw = (1 - p.cy * 2) * meta
    },
    aggiorna(tempo, dt, camZ, px, camX, camY) {
      if (t0 < 0) t0 = tempo
      // 0-1,2 s le particelle salgono; 1,2-2,6 s (curva espressiva) compongono il nome; poi fermo
      const s = clamp((tempo - t0 - 1.2) / 1.4, 0, 1)
      intro = s * s * (3 - 2 * s)
      if (!formato && s >= 1) formato = true
      ang -= dt * 0.15 * cmd.giro
      const nomeEff = intro * (1 - cmd.ritorno)
      u.uAng.value = ang
      u.uNome.value = nomeEff
      u.uApri.value = cmd.apri
      u.uCaldo.value = cmd.caldo
      u.uTempo.value = tempo
      u.uPx.value = px
      u.uLato.value = lato2
      u.uCentro.value.set(cxw, cyw, 0)
      u.uCamZ.value = camZ
      u.uCam.value.set(camX, camY, 0)
      u.uAccese.value = cmd.accese
      u.uAlfa.value = clamp((tempo - t0) / 0.6, 0, 1)
      // sul nome formato le particelle restano un brillio sottile sul contorno e si spengono
      u.uAlfaNome.value = formato ? 0.3 : 1
      u.uPunto.value = (1.5 * lato2) / Math.sqrt(n)
      matAlone.uniforms.uAlfa.value = 0.55 * cmd.punto * (1 - cmd.apri)
      alone.position.set(cxw, cyw, -DIST)
      alone.scale.set(lato2 * 0.18, lato2 * 0.18, 1)
      // l'arco che passa in alto: quello il cui angolo medio, ruotato, è più vicino a 90°
      let migliore: Materia | null = null
      let scarto = Infinity
      for (let m = 0; m < 4; m++) {
        const d = Math.abs(((angoloMateria[m] + ang - Math.PI / 2 + Math.PI * 3) % (Math.PI * 2)) - Math.PI)
        if (d < scarto) { scarto = d; migliore = MATERIE[m] }
      }
      arcoAlto = scarto < 0.9 ? migliore : null
      gruppo.visible = usatoOra || tempo - t0 < 3
    },
    arcoInAlto: () => arcoAlto,
    nomeFormato: () => formato,
    dispose() {
      gruppo.removeFromParent()
      g.dispose()
      materiale.dispose()
      geomAlone.dispose()
      matAlone.dispose()
    },
  }
}
