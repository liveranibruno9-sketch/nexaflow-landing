// Il mondo del varco: renderer, camera, ciclo, quadro, tratti, regie (piano-costruzione-v2, compiti 4-6).
// Lo scheletro è quello del volo dei dentisti (components/volo/scena.ts, non si tocca): una posizione `u` in schermate
// letta da testo e scena, camera a velocità costante, le cose vengono incontro.
import { AdditiveBlending, Mesh, PerspectiveCamera, PlaneGeometry, Scene, ShaderMaterial, Vector3, WebGLRenderer } from 'three'
import { CONTEGGI } from '../livello.ts'
import { impagina } from '../impagina.ts'
import { pesiMateria, zCamera } from '../percorso.ts'
import type { Regia } from '../kit.ts'
import type { Livello, Materia, Percorso } from '../tipi.ts'
import { creaFiumi, type Colori, type Fiumi } from './fiumi.ts'
import { ALONE_FRAG, ALONE_VERT } from './shader.ts'

export type Mondo = {
  /** true finché la camera si muove (come scena.ts) */
  aggiorna(u: number, dt: number, tempo: number): boolean
  /** x, y in -1..1 */
  puntatore(x: number, y: number, tipo: 'mouse' | 'touch'): void
  ridimensiona(): void
  /** px CSS del punto `fuoco` della regia corrente */
  fuocoSchermo(): [number, number] | null
  /** apertura: la materia dell'arco che passa in alto */
  arcoInAlto(): Materia | null
  impostaLivello(l: Livello): void
  distruggi(): void
}

const FOV = 50
const TAN = Math.tan(((FOV / 2) * Math.PI) / 180)
/** la lampada: punto del quadro (da sinistra e dall'alto) e raggio in larghezze del quadro; alfa 0,16 (storyboard 5.2) */
const LAMPADA = { x: 0.03, y: 0.06, raggio: 0.9, alfa: 0.16 }

const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x))
const liscia = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}

const rgb = (hex: string, riserva: number[]): number[] => {
  const h = hex.trim().replace('#', '')
  return h.length === 6 ? [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) : riserva
}

/** la palette dalle variabili CSS (varco.css, film.css), come leggiPalette dei dentisti */
function leggiPalette(el: HTMLElement) {
  const cs = getComputedStyle(el)
  const v = (nome: string, riserva: string) => cs.getPropertyValue(nome).trim() || riserva
  const luce = v('--luce', '242, 194, 122').split(',').map((x) => Number(x) / 255)
  const colori: Colori = {
    polvere: rgb(v('--polvere', '#5b8cff'), [0.357, 0.549, 1]),
    vetro: rgb(v('--vetro', '#35e0f0'), [0.208, 0.878, 0.941]),
    saette: rgb(v('--saette', '#f4f1ff'), [0.957, 0.945, 1]),
    saetteViola: rgb(v('--saette-viola', '#b48cff'), [0.706, 0.549, 1]),
    cromo: rgb(v('--cromo', '#d9d4c7'), [0.851, 0.831, 0.78]),
  }
  return { notte: v('--notte', '#020403'), colori, luce: luce.length === 3 && luce.every(Number.isFinite) ? luce : [0.949, 0.761, 0.478] }
}

export function creaMondo(contenitore: HTMLElement, o: { percorso: Percorso; livello: Livello; regie: Partial<Record<string, Regia>>; onPerso: () => void }): Mondo {
  const { percorso } = o
  let livello = o.livello
  const P = leggiPalette(contenitore)

  const renderer = new WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'high-performance' })
  renderer.setClearColor(P.notte, 1)
  contenitore.appendChild(renderer.domElement)
  const alPerso = (e: Event) => {
    e.preventDefault()
    o.onPerso()
  }
  renderer.domElement.addEventListener('webglcontextlost', alPerso)

  const scena = new Scene()
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 420)
  scena.add(camera)

  /* ----- la lampada: un alone caldo fisso nel quadro, figlio della camera ----- */
  const geometriaAlone = new PlaneGeometry(1, 1)
  const materialeAlone = new ShaderMaterial({
    vertexShader: ALONE_VERT,
    fragmentShader: ALONE_FRAG,
    uniforms: { uColore: { value: new Vector3(P.luce[0], P.luce[1], P.luce[2]) }, uAlfa: { value: LAMPADA.alfa } },
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  })
  const lampada = new Mesh(geometriaAlone, materialeAlone)
  lampada.frustumCulled = false
  camera.add(lampada)

  /* ----- i fiumi ----- */
  let fiumi: Fiumi = creaFiumi(CONTEGGI[livello].fiumi, P.colori)
  scena.add(fiumi.oggetto)

  // la densità dei fiumi: 0 fino alla frase 1.10 della soglia, poi sale fino all'inizio del primo tratto
  const soglia = percorso.blocchi.find((b) => b.tipo === 'soglia')
  const primoTratto = percorso.blocchi.find((b) => b.tipo === 'tratto')
  const daDensita = soglia?.battute.find((b) => b.ruolo === '10')?.da ?? (primoTratto ? primoTratto.da - 1 : Infinity)
  const aDensita = primoTratto ? primoTratto.da : daDensita + 1
  const densita = (u: number) => liscia(daDensita, aDensita, u)

  /* ----- misure ----- */
  let larghezza = 1
  let altezza = 1
  let imp = impagina(1, 1)
  const ridimensiona = () => {
    larghezza = Math.max(1, contenitore.clientWidth || window.innerWidth)
    altezza = Math.max(1, contenitore.clientHeight || window.innerHeight)
    const dpr = Math.min(window.devicePixelRatio || 1, CONTEGGI[livello].dpr)
    renderer.setPixelRatio(dpr)
    renderer.setSize(larghezza, altezza, false)
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    camera.aspect = larghezza / altezza
    camera.updateProjectionMatrix()
    imp = impagina(larghezza / altezza, altezza)
    fiumi.imposta((altezza * dpr) / (2 * TAN))
  }
  ridimensiona()

  /* ----- il puntatore sposta appena l'inquadratura, con molta calma ----- */
  const mira = { x: 0, y: 0 }
  const scarto = { x: 0, y: 0 }
  let zPrima = zCamera(0)
  let velocita = 0

  const aggiorna = (u: number, dt: number, tempo: number): boolean => {
    const z = zCamera(u)
    const passo = Math.max(dt, 0.001)
    velocita += (Math.abs(z - zPrima) / passo - velocita) * (1 - Math.exp(-passo * 5))
    zPrima = z
    scarto.x += (mira.x - scarto.x) * (1 - Math.exp(-passo * 2.2))
    scarto.y += (mira.y - scarto.y) * (1 - Math.exp(-passo * 2.2))
    // respiro e rollio come scena.ts:1097-1121: anche da fermi la camera fluttua
    camera.position.set(
      0.24 * Math.sin(u * 0.95) + 0.07 * Math.sin(tempo * 0.23) + scarto.x * 0.35,
      0.17 * Math.sin(u * 0.71 + 1.2) + 0.05 * Math.sin(tempo * 0.19 + 1.3) + scarto.y * 0.25,
      z,
    )
    camera.rotation.z = 0.02 * Math.sin(u * 0.42 + 0.6) + 0.004 * Math.sin(tempo * 0.15) + scarto.x * -0.012
    // "effetto velocità": il campo visivo si allarga appena quando si scorre in fretta (velocita in unità del mondo al secondo, come nel volo)
    const fov = FOV + clamp(velocita * 0.03, 0, 7)
    if (Math.abs(camera.fov - fov) > 0.02) {
      camera.fov = fov
      camera.updateProjectionMatrix()
    }

    // la lampada sta al punto LAMPADA del quadro corrente, alla distanza 10 davanti alla camera
    const d = 10
    const meta = d * Math.tan((camera.fov * Math.PI) / 360)
    const larghezzaQuadro = imp.altezza * (9 / 16) * (2 * meta) // in unità del mondo, alla distanza d
    const sx = imp.cx + (LAMPADA.x - 0.5) * ((imp.altezza * 9) / 16 / camera.aspect)
    const sy = imp.cy + (LAMPADA.y - 0.5) * imp.altezza
    lampada.position.set((sx * 2 - 1) * meta * camera.aspect, (1 - sy * 2) * meta, -d)
    const diametro = 2 * LAMPADA.raggio * larghezzaQuadro
    lampada.scale.set(diametro, diametro, 1)

    fiumi.aggiorna(z, tempo, pesiMateria(percorso, u), densita(u))

    renderer.render(scena, camera)
    return velocita > 0.3
  }

  return {
    aggiorna,
    puntatore: (x, y) => {
      mira.x = x
      mira.y = y
    },
    ridimensiona,
    fuocoSchermo: () => null,
    arcoInAlto: () => null,
    impostaLivello: (l) => {
      if (l === livello) return
      livello = l
      scena.remove(fiumi.oggetto)
      fiumi.dispose()
      fiumi = creaFiumi(CONTEGGI[livello].fiumi, P.colori)
      scena.add(fiumi.oggetto)
      ridimensiona()
    },
    distruggi: () => {
      renderer.domElement.removeEventListener('webglcontextlost', alPerso)
      scena.remove(fiumi.oggetto)
      fiumi.dispose()
      geometriaAlone.dispose()
      materialeAlone.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    },
  }
}
