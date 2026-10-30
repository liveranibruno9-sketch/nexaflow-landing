// Il vortice dell'apertura (home v2.4, D47): un anello di scaglie di roccia stellare, tante e ben definite, tutte della stessa forma,
// ognuna della sua materia (polvere blu, vetro azzurro, saette viola e bianche, cromo). Nasce da un punto, gira come un vortice
// (più veloce verso il centro, ogni scaglia ruota su sé stessa); scorrendo, le scaglie volano a comporre «Agenti Studio» una lettera
// alla volta (nome.ts); poi tornano nel vortice, che si apre in quattro correnti, una per materia, e lascia lo schermo (la consegna).
// Scaglie = InstancedMesh, una per materia, posizioni calcolate a ogni fotogramma. Le sue luci si spengono quando il vortice è uscito.
import {
  Color, DirectionalLight, Group, HemisphereLight, IcosahedronGeometry, InstancedMesh, Matrix4, MeshPhysicalMaterial,
  MeshStandardMaterial, PMREMGenerator, Quaternion, Vector3,
} from 'three'
import type { Material, Texture, WebGLRenderer } from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { campiona, mulberry32 } from '../campiona.ts'
import { consegna, voloLettere } from '../nome.ts'

export type Scaglie = {
  gruppo: Group
  /** le lettere del nome nel DOM: da qui i punti dove volano le scaglie; da rifare se cambia la misura dello schermo */
  bersagli(lettere: HTMLElement[], larghezza: number, altezza: number): Promise<void>
  /** centro del vortice in frazioni dello schermo; raggio esterno in altezze di schermo; fov e aspetto della camera */
  posa(o: { cx: number; cy: number; raggio: number; aspetto: number; fov: number }): void
  /** giro: 1 = vortice pieno */
  aggiorna(u: number, tempo: number, dt: number, giro: number): void
  dispose(): void
}

/** distanza del vortice dalla camera, nelle unità del mondo (è figlio della camera: sta fermo nella vista) */
const DIST = 10
/** inclinazione del disco: si vede appena di sbieco, come un vortice vero */
const INCLINA = 0.38
/** quota di scaglie che vola a comporre il nome */
const NEL_NOME = 0.3
/** le quattro correnti della consegna: polvere in alto a sinistra, vetro in alto a destra, saette in basso a destra, cromo in basso a sinistra */
const VERSI = [[-0.75, 0.66], [0.75, 0.66], [0.75, -0.66], [-0.75, -0.66]]

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x)
const liscia = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}

/** la scaglia: un sasso a facce, schiacciato come una lamina; la stessa forma per tutte */
function scaglia() {
  const g = new IcosahedronGeometry(1, 1)
  const p = g.attributes.position
  const v = new Vector3()
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i)
    // lo stesso spostamento per i vertici condivisi: dipende solo dalla posizione
    const h = Math.sin(v.x * 12.9898 + v.y * 78.233 + v.z * 37.719) * 43758.5453
    const k = 0.72 + 0.5 * (h - Math.floor(h))
    p.setXYZ(i, v.x * k, v.y * k * 0.62, v.z * k * 0.42)
  }
  g.computeVertexNormals()
  return g
}

export function creaScaglie(renderer: WebGLRenderer, quante: number): Scaglie {
  const gruppo = new Group()
  gruppo.position.z = -DIST
  const disco = new Group()
  disco.rotation.x = INCLINA
  gruppo.add(disco)

  const pmrem = new PMREMGenerator(renderer)
  const ambiente: Texture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  pmrem.dispose()
  const geometria = scaglia()
  const materiali: Material[] = [
    // polvere: roccia blu con un po' di luce dentro
    new MeshStandardMaterial({ color: 0x3157d6, roughness: 0.5, metalness: 0.25, emissive: 0x1a3aa8, emissiveIntensity: 0.6, envMap: ambiente, envMapIntensity: 0.6, flatShading: true }),
    // vetro: azzurro lucido, appena trasparente
    new MeshPhysicalMaterial({ color: 0x7ff3ff, roughness: 0.05, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.05, emissive: 0x0c8fa0, emissiveIntensity: 0.45, envMap: ambiente, envMapIntensity: 1.3, transparent: true, opacity: 0.9, flatShading: true }),
    // saette: cristallo bianco-viola che fa luce da sé
    new MeshStandardMaterial({ color: 0xefe8ff, emissive: 0xa77dff, emissiveIntensity: 1.1, roughness: 0.35, flatShading: true }),
    // cromo: metallo chiaro che specchia la stanza
    new MeshStandardMaterial({ color: 0xe6e1d6, metalness: 1, roughness: 0.12, envMap: ambiente, envMapIntensity: 1.6, emissive: 0x2a2620, emissiveIntensity: 0.2, flatShading: true }),
  ]

  // le scaglie: ognuna con la sua materia, il suo angolo, la sua orbita, la sua rotazione
  const caso = mulberry32(2026)
  const N = quante
  const mat = new Uint8Array(N)
  const indice = new Uint16Array(N)
  const ang = new Float32Array(N)
  const rag = new Float32Array(N)
  const quota = new Float32Array(N)
  const misura = new Float32Array(N)
  const assi: Vector3[] = []
  const vel = new Float32Array(N)
  const fase = new Float32Array(N)
  const lettera = new Int16Array(N).fill(-1)
  const bersaglio = new Float32Array(N * 2)
  const perMateria = [0, 0, 0, 0]
  for (let i = 0; i < N; i++) {
    const m = i % 4
    mat[i] = m
    indice[i] = perMateria[m]++
    // ogni materia nasce nel suo quarto d'anello (come nel poster); il vortice poi le stira in spirali
    ang[i] = m * (Math.PI / 2) + Math.PI / 4 + (caso() - 0.5) * (Math.PI / 2 + 0.6)
    rag[i] = 0.58 + 0.42 * ((caso() + caso()) / 2) * 1.05
    quota[i] = (caso() - 0.5) * 0.12
    misura[i] = 0.034 + 0.024 * caso()
    assi.push(new Vector3(caso() - 0.5, caso() - 0.5, caso() - 0.5).normalize())
    vel[i] = (0.6 + 1.6 * caso()) * (caso() < 0.5 ? -1 : 1)
    fase[i] = caso() * Math.PI * 2
  }
  const mesh = materiali.map((m, k) => {
    const im = new InstancedMesh(geometria, m, perMateria[k])
    im.frustumCulled = false
    for (let j = 0; j < perMateria[k]; j++) {
      const b = 0.75 + 0.45 * caso()
      im.setColorAt(j, new Color(b, b, b))
    }
    disco.add(im)
    return im
  })

  // le luci delle scaglie: dall'alto a sinistra, calde, e un controluce freddo; si spengono quando il vortice è uscito
  const cielo = new HemisphereLight(0xdfe8ff, 0x10131c, 1.0)
  const chiave = new DirectionalLight(0xfff1dc, 2.4)
  chiave.position.set(-3, 4, 6)
  const contro = new DirectionalLight(0x9fb8ff, 1.5)
  contro.position.set(3, -2, -4)
  gruppo.add(cielo, chiave, chiave.target, contro, contro.target)
  const luci = [[cielo, 1.0], [chiave, 2.4], [contro, 1.5]] as const

  let cx = 0
  let cy = 0
  let R = 3
  let metaH = DIST * Math.tan((25 * Math.PI) / 180)
  let metaW = metaH
  let nascita = -1
  let nLettere = 12
  const m4 = new Matrix4()
  const q = new Quaternion()
  const pos = new Vector3()
  const sc = new Vector3()
  const t = new Vector3()

  return {
    gruppo,
    async bersagli(lettere, larghezza, altezza) {
      if (!lettere.length) return
      await document.fonts.ready
      const quanteN = Math.floor((N * NEL_NOME) / lettere.length)
      // le scaglie del nome: un po' di tutte le materie, prese a caso
      const ordine = Array.from({ length: N }, (_, i) => i)
      const c = mulberry32(99)
      for (let i = ordine.length - 1; i > 0; i--) {
        const j = Math.floor(c() * (i + 1))
        ;[ordine[i], ordine[j]] = [ordine[j], ordine[i]]
      }
      lettera.fill(-1)
      nLettere = lettere.length
      lettere.forEach((el, li) => {
        const r = el.getBoundingClientRect()
        if (!r.width || !r.height) return
        const S = 2
        const tela = document.createElement('canvas')
        tela.width = Math.ceil(r.width * S)
        tela.height = Math.ceil(r.height * S)
        const k = tela.getContext('2d', { willReadFrequently: true })
        if (!k) return
        const cs = getComputedStyle(el)
        k.fillStyle = '#000'
        k.fillRect(0, 0, tela.width, tela.height)
        k.fillStyle = '#fff'
        k.font = `${cs.fontWeight} ${parseFloat(cs.fontSize) * S}px ${cs.fontFamily}`
        k.textBaseline = 'alphabetic'
        const larga = k.measureText(el.textContent ?? '').width || 1
        k.save()
        k.translate(0, tela.height * 0.8)
        // il carattere è condensato (font-stretch): si stringe fino alla larghezza vera della lettera
        k.scale(tela.width / larga, 1)
        k.fillText(el.textContent ?? '', 0, 0)
        k.restore()
        const punti = campiona({ dati: k.getImageData(0, 0, tela.width, tela.height).data, w: tela.width, h: tela.height }, null, quanteN, 7 + li)
        for (let j = 0; j < quanteN; j++) {
          const i = ordine[li * quanteN + j]
          lettera[i] = li
          bersaglio[i * 2] = (r.left + punti.pos[j * 3] * r.width) / larghezza
          bersaglio[i * 2 + 1] = (r.top + punti.pos[j * 3 + 1] * r.height) / altezza
        }
      })
    },
    posa(o) {
      metaH = DIST * Math.tan((o.fov * Math.PI) / 360)
      metaW = metaH * o.aspetto
      cx = (o.cx * 2 - 1) * metaW
      cy = (1 - o.cy * 2) * metaH
      R = o.raggio * 2 * metaH
    },
    aggiorna(u, tempo, dt, giro) {
      if (nascita < 0) nascita = tempo
      // il big bang: dal punto al vortice in 1,8 s, con una spirale in più che si scioglie
      const b = clamp01((tempo - nascita) / 1.8)
      const esce = 1 - (1 - b) * (1 - b) * (1 - b)
      const c = consegna(u)
      gruppo.visible = c < 0.999
      for (const [l, forza] of luci) l.intensity = forza * (1 - c)
      if (!gruppo.visible) return
      const voli = voloLettere(u, nLettere)
      const ruota = Math.cos(INCLINA)
      const conto = [0, 0, 0, 0]
      for (let i = 0; i < N; i++) {
        // il vortice: più veloce verso il centro; nel big bang la spirale in più
        const w = giro * 0.85 * Math.pow(0.58 / rag[i], 1.5)
        ang[i] += w * dt
        const a = ang[i] + (1 - esce) * 3.2
        const r = rag[i] * R * esce
        let x = Math.cos(a) * r
        let y = Math.sin(a) * r
        let z = quota[i] * R * esce
        let s = misura[i] * R * (0.25 + 0.75 * esce)
        // le lettere: dal vortice al loro posto nel nome, con un arco verso la camera
        const li = lettera[i]
        if (li >= 0 && voli[li] > 0) {
          const p = voli[li]
          const e = p * p * (3 - 2 * p)
          // il bersaglio è nella vista: si riporta nello spazio del disco inclinato
          const tx = (bersaglio[i * 2] * 2 - 1) * metaW - cx
          const ty = (1 - bersaglio[i * 2 + 1] * 2) * metaH - cy
          const tz = 0.25 * R
          t.set(tx, ty * ruota + tz * Math.sin(INCLINA), -ty * Math.sin(INCLINA) + tz * ruota)
          x += (t.x - x) * e
          y += (t.y - y) * e
          z += (t.z - z) * e + Math.sin(Math.PI * p) * 0.3 * R
          s *= 1 - 0.55 * e
        }
        // la consegna: ogni materia esce dalla sua parte dello schermo, accelerando e venendo verso di noi
        if (c > 0) {
          const v = VERSI[mat[i]]
          const k = c * c
          x += v[0] * k * 2.6 * R
          y += v[1] * k * 2.6 * R
          z += k * 6
          s *= 1 + 1.2 * c
        }
        pos.set(x + cx, y + cy * ruota, z - cy * Math.sin(INCLINA))
        q.setFromAxisAngle(assi[i], fase[i] + tempo * vel[i])
        sc.setScalar(s)
        m4.compose(pos, q, sc)
        mesh[mat[i]].setMatrixAt(conto[mat[i]]++, m4)
      }
      for (const im of mesh) im.instanceMatrix.needsUpdate = true
    },
    dispose() {
      gruppo.removeFromParent()
      geometria.dispose()
      for (const m of materiali) m.dispose()
      for (const im of mesh) im.dispose()
      ambiente.dispose()
    },
  }
}
