// Il tratto: un solo gruppo di particelle con tre forme (problema → creatura → beneficio) e le tre foto vive
// (piano con mappa di profondità). Le stesse particelle cambiano forma: non c'è mai un'immagine che sparisce e un'altra
// che compare, c'è materia che si riordina (storyboard, regola 3). Piano-costruzione-v2, compito 5.
import { AdditiveBlending, BufferAttribute, BufferGeometry, CanvasTexture, Group, LinearFilter, Mesh, NoColorSpace, PlaneGeometry, Points, ShaderMaterial, Texture, Vector2, Vector3 } from 'three'
import { campiona, mulberry32 } from '../campiona.ts'
import type { Pixel } from '../campiona.ts'
import { CONTEGGI } from '../livello.ts'
import type { Blocco, Fasi, Immagine, Livello, Materia } from '../tipi.ts'
import { FOTO_FRAG, FOTO_VERT, TRATTO_FRAG, TRATTO_VERT } from './shader-strati.ts'

export type Tratto = {
  quadro: Group
  /** esposizione: quanto è accesa ogni foto (Kit.foto), 1 se la regia non la tocca */
  aggiorna(f: Fasi, tempo: number, mano: Vector3 | null, manoOn: number, uscitaVerso: Materia | null, esposizione: [number, number, number]): void
  /** dimensioni del disegno in pixel (per la sfumatura in spazio schermo del telefono) e px per unità a distanza 1 */
  schermo(larghezza: number, altezza: number, telefono: boolean, px: number): void
  dispose(): void
}

const MATERIE: Materia[] = ['polvere', 'vetro', 'saette', 'cromo']
const LARGHEZZA = 2.25
const ALTEZZA = 4

type Colori = Record<Materia, number[]> & { luce: number[] }

const carica = (src: string) =>
  new Promise<HTMLImageElement>((ok, ko) => {
    const i = new Image()
    i.decoding = 'async'
    i.onload = () => ok(i)
    i.onerror = () => ko(new Error(src))
    i.src = src
  })

const idle = () =>
  new Promise<void>((ok) => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }
    if (w.requestIdleCallback) w.requestIdleCallback(() => ok(), { timeout: 400 })
    else window.setTimeout(ok, 30)
  })

/** i pixel di un'immagine ridisegnata a w x h (RGBA) */
function pixel(img: CanvasImageSource, w: number, h: number): Pixel & { canvas: HTMLCanvasElement } {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const c = canvas.getContext('2d', { willReadFrequently: true })
  if (!c) throw new Error('canvas 2d non disponibile')
  c.drawImage(img, 0, 0, w, h)
  return { dati: c.getImageData(0, 0, w, h).data, w, h, canvas }
}

export async function creaTratto(o: { blocco: Blocco; indice: number; livello: Livello; misura: 720 | 1080; colori: Colori }): Promise<Tratto> {
  const { blocco, livello } = o
  const immagini = (blocco.immagini ?? []) as Immagine[]
  if (immagini.length !== 3 || !blocco.materia) throw new Error(`tratto ${blocco.id}: servono tre immagini e una materia`)
  const conteggi = CONTEGGI[livello]
  const n = conteggi.punti

  // le tre immagini e le tre mappe di profondità (la mappa è facoltativa: senza, niente parallasse)
  const foto: HTMLImageElement[] = []
  const prof: (Pixel & { canvas: HTMLCanvasElement } | null)[] = []
  for (const nome of immagini) {
    foto.push(await carica(`/film/scene/${nome}-${o.misura}.webp`))
    try {
      prof.push(pixel(await carica(`/film/profondita/${nome}.png`), 144, 256))
    } catch {
      prof.push(null)
    }
  }
  const conParallasse = conteggi.parallasse && prof.every((p) => p !== null)

  // una immagine per volta, quando il browser è libero: tre campionamenti sono il lavoro più pesante del tratto
  const forme: { pos: Float32Array; col: Float32Array }[] = []
  for (let i = 0; i < 3; i++) {
    await idle()
    forme.push(campiona(pixel(foto[i], 360, 640), prof[i], n, o.indice * 3 + i + 1))
  }

  const caso = mulberry32(o.indice * 977 + 13)
  const aCaso = new Float32Array(n * 4)
  for (let i = 0; i < aCaso.length; i++) aCaso[i] = caso()
  const geometria = new BufferGeometry()
  geometria.setAttribute('position', new BufferAttribute(new Float32Array(n * 3), 3))
  geometria.setAttribute('aPosA', new BufferAttribute(forme[0].pos, 3))
  geometria.setAttribute('aPosB', new BufferAttribute(forme[1].pos, 3))
  geometria.setAttribute('aPosC', new BufferAttribute(forme[2].pos, 3))
  geometria.setAttribute('aColA', new BufferAttribute(forme[0].col, 3))
  geometria.setAttribute('aColB', new BufferAttribute(forme[1].col, 3))
  geometria.setAttribute('aColC', new BufferAttribute(forme[2].col, 3))
  geometria.setAttribute('aCaso', new BufferAttribute(aCaso, 4))

  const v3 = (c: number[]) => new Vector3(c[0], c[1], c[2])
  const materia = MATERIE.indexOf(blocco.materia)
  const uniformi = {
    uForma: { value: 0 },
    uComposto: { value: 0 },
    uFoto: { value: 0 },
    uTempo: { value: 0 },
    uPx: { value: 1 },
    uPar: { value: conParallasse ? 1 : 0 },
    uPunto: { value: 1.5 * Math.sqrt((LARGHEZZA * ALTEZZA) / n) },
    uMat: { value: materia },
    uVerso: { value: materia },
    uUscita: { value: 0 },
    uMano: { value: new Vector3(99, 99, 0) },
    uManoOn: { value: 0 },
    uColMat: { value: MATERIE.map((m) => v3(o.colori[m])) },
    uLuce: { value: v3(o.colori.luce) },
  }
  const materialeParticelle = new ShaderMaterial({ vertexShader: TRATTO_VERT, fragmentShader: TRATTO_FRAG, uniforms: uniformi, transparent: true, depthWrite: false, blending: AdditiveBlending })
  const particelle = new Points(geometria, materialeParticelle)
  particelle.frustumCulled = false

  // le tre foto: un piano ciascuna (48 x 86 segmenti con la parallasse, 1 x 1 senza), sfumate nel nero ai bordi
  const quadro = new Group()
  const geometriaFoto = new PlaneGeometry(LARGHEZZA, ALTEZZA, conParallasse ? 48 : 1, conParallasse ? 86 : 1)
  const grigio = new Texture() // mappa neutra se manca: con uPar = 0 non serve a nulla, ma la texture ci vuole
  const texture: Texture[] = []
  const piani: { mesh: Mesh; materiale: ShaderMaterial }[] = immagini.map((nome, i) => {
    const mappa = new Texture(foto[i])
    mappa.colorSpace = NoColorSpace // il colore esatto dell'immagine: il suo nero è il nero del mondo (stessa regola dei dentisti)
    mappa.minFilter = LinearFilter
    mappa.generateMipmaps = false
    mappa.needsUpdate = true
    texture.push(mappa)
    const p = prof[i]
    let mappaProf: Texture = grigio
    if (p) {
      mappaProf = new CanvasTexture(p.canvas)
      mappaProf.colorSpace = NoColorSpace
      texture.push(mappaProf)
    }
    const zona = blocco.sfuma?.[nome] ?? {}
    const materiale = new ShaderMaterial({
      vertexShader: FOTO_VERT,
      fragmentShader: FOTO_FRAG,
      uniforms: {
        uMap: { value: mappa },
        uProf: { value: mappaProf },
        uPar: uniformi.uPar,
        uOp: { value: 0 },
        uAlto: { value: zona.alto ?? 0 },
        uBasso: { value: zona.basso ?? 0 },
        uTel: { value: 0 },
        uRes: { value: new Vector2(1, 1) },
      },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    })
    const mesh = new Mesh(geometriaFoto, materiale)
    mesh.frustumCulled = false
    mesh.visible = false
    quadro.add(mesh)
    return { mesh, materiale }
  })
  quadro.add(particelle)
  quadro.visible = false

  return {
    quadro,
    aggiorna(f, tempo, mano, manoOn, uscitaVerso, esposizione) {
      uniformi.uForma.value = f.forma
      uniformi.uComposto.value = f.composto
      uniformi.uTempo.value = tempo
      uniformi.uUscita.value = uscitaVerso ? f.uscita : 0
      uniformi.uVerso.value = uscitaVerso ? MATERIE.indexOf(uscitaVerso) : materia
      if (mano) uniformi.uMano.value.copy(mano)
      uniformi.uManoOn.value = mano ? manoOn : 0
      let piena = 0
      piani.forEach((p, i) => {
        const op = f.foto[i] * esposizione[i]
        p.materiale.uniforms.uOp.value = op
        p.mesh.visible = op > 0.002
        piena = Math.max(piena, op)
      })
      uniformi.uFoto.value = piena
    },
    schermo(larghezza, altezza, telefono, px) {
      uniformi.uPx.value = px
      for (const p of piani) {
        p.materiale.uniforms.uTel.value = telefono ? 1 : 0
        p.materiale.uniforms.uRes.value.set(larghezza, altezza)
      }
    },
    dispose() {
      quadro.removeFromParent()
      geometria.dispose()
      materialeParticelle.dispose()
      geometriaFoto.dispose()
      for (const p of piani) p.materiale.dispose()
      for (const t of texture) t.dispose()
      grigio.dispose()
    },
  }
}
