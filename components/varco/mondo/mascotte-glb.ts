// Le quattro mascotte 3D tali e quali alle foto (home v2.2, D45): modelli GLB con scheletro, fatti con Higgsfield (Meshy) dalle foto
// X-2 rimesse in posa (public/film/mascotte). Le ossa le muove ossa.ts (saluto rapido, abbraccio, sguardo); la luce le illumina come
// nelle foto; attorno a ognuna la sua materia (polvere, vetro, saette, cromo). Stessa interfaccia delle creature in codice (creature.ts),
// che restano come riserva se i modelli non arrivano.
import {
  AdditiveBlending, BufferAttribute, BufferGeometry, CylinderGeometry, DirectionalLight, Euler, Group, HemisphereLight, Mesh, MeshStandardMaterial,
  Object3D, PlaneGeometry, PMREMGenerator, Points, Quaternion, ShaderMaterial, SkinnedMesh, SphereGeometry, Texture, Vector3,
} from 'three'
import type { Bone, Material, WebGLRenderer } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { mulberry32 } from '../campiona.ts'
import { ALTEZZA_CREATURA, ORDINE } from '../coreografia.ts'
import type { Mascotte } from '../coreografia.ts'
import { mire } from '../ossa.ts'
import type { V3 } from '../ossa.ts'
import { falce } from './creature.ts'
import type { Creatura, Creature } from './creature.ts'
import { ALONE_FRAG, ALONE_VERT } from './shader.ts'
import { AURA_FRAG, AURA_VERT, LUCE_FRAG, PELLE_VERT } from './shader-creature.ts'

/** altezza del modello (orecchie comprese) nelle unità delle creature: un po' più del corpo, come le orecchie in codice */
const ALTEZZA_MODELLO = 1.7

/** come prende la luce ogni materia: quanto brilla da sé la texture, quanto è metallo, quanto è liscia, quanto riflette */
const TONO: Record<Mascotte, { brilla: number; metallo: number; ruvido: number; riflesso: number; aura: number; alone: number; punti: number; vel: number }> = {
  atlas: { brilla: 0.55, metallo: 0, ruvido: 0.85, riflesso: 0.35, aura: 0xa8c4ff, alone: 0x5b8cff, punti: 170, vel: 0.35 },
  janus: { brilla: 0.16, metallo: 0.05, ruvido: 0.08, riflesso: 0.75, aura: 0x8ff3ff, alone: 0x35e0f0, punti: 80, vel: 0.25 },
  prometheus: { brilla: 0.95, metallo: 0, ruvido: 0.6, riflesso: 0.3, aura: 0xd8c4ff, alone: 0xb48cff, punti: 140, vel: 0.9 },
  hermes: { brilla: 0.45, metallo: 0.55, ruvido: 0.2, riflesso: 1.8, aura: 0xfff0d0, alone: 0xd9d4c7, punti: 110, vel: 0.5 },
}

const v3 = (hex: number) => new Vector3(((hex >> 16) & 255) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255)
const vettore = (v: V3) => new Vector3(v[0], v[1], v[2])

/** un osso che punta: la posa a riposo (locale e del padre, nello spazio del modello) e la direzione verso il figlio */
type Perno = { osso: Bone; locale: Quaternion; padre: Quaternion; padreInv: Quaternion; mondo: Quaternion; mondoInv: Quaternion; dir: Vector3 }

function perno(osso: Bone, figlio: Object3D): Perno {
  const padre = osso.parent ? osso.parent.getWorldQuaternion(new Quaternion()) : new Quaternion()
  const mondo = osso.getWorldQuaternion(new Quaternion())
  const dir = figlio.getWorldPosition(new Vector3()).sub(osso.getWorldPosition(new Vector3())).normalize()
  return { osso, locale: osso.quaternion.clone(), padre, padreInv: padre.clone().invert(), mondo, mondoInv: mondo.clone().invert(), dir }
}

const qA = new Quaternion()
const qB = new Quaternion()
const vA = new Vector3()
/** braccio e avambraccio verso due direzioni (spazio del modello): la rotazione minima dalla posa a riposo, prima il braccio poi il gomito */
function punta(b: Perno, a: Perno, db: Vector3, da: Vector3) {
  qA.setFromUnitVectors(b.dir, db)
  b.osso.quaternion.copy(b.padreInv).multiply(qA).multiply(b.padre).multiply(b.locale)
  vA.copy(a.dir).applyQuaternion(qA)
  qB.setFromUnitVectors(vA, da)
  // locale nuovo = (qA · M)⁻¹ · qB · qA · M · L, con M = il braccio a riposo nel modello
  a.osso.quaternion.copy(b.mondoInv).multiply(qA.clone().invert()).multiply(qB).multiply(qA).multiply(b.mondo).multiply(a.locale)
}

export async function caricaMascotte(renderer: WebGLRenderer, base = '/film/mascotte'): Promise<Creature> {
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder)
  const gltf = await Promise.all(ORDINE.map((id) => loader.loadAsync(`${base}/${id}.glb`)))
  const geometrie: BufferGeometry[] = []
  const materiali: Material[] = []
  const texture: Texture[] = []
  const uTempo = { value: 0 }
  const uPx = { value: 1 }

  // il riflesso di una stanza chiara: dà al vetro e al cromo qualcosa da specchiare
  const pmrem = new PMREMGenerator(renderer)
  const stanza = new RoomEnvironment()
  const ambiente = pmrem.fromScene(stanza, 0.04).texture
  pmrem.dispose()
  texture.push(ambiente)

  const sfera = new SphereGeometry(1, 16, 12)
  const piano = new PlaneGeometry(1, 1)
  const luna = falce()
  const stipite = new CylinderGeometry(0.022, 0.022, 1, 8)
  geometrie.push(sfera, piano, luna, stipite)
  const luce = (colore: number, cuore: number, trema = 0) => {
    const m = new ShaderMaterial({ vertexShader: PELLE_VERT, fragmentShader: LUCE_FRAG, uniforms: { uColore: { value: v3(colore) }, uCuore: { value: v3(cuore) }, uTempo, uTrema: { value: trema } } })
    materiali.push(m)
    return m
  }

  const costruisci = (id: Mascotte, indice: number, scena: Group): Creatura => {
    const T = TONO[id]
    const fase = indice * 1.9 + 0.4
    const radice = new Group()
    const corpo = new Group()
    const modello = new Group()
    radice.add(corpo)
    corpo.add(modello)
    modello.add(scena)

    // i materiali: la texture della foto brilla un po' da sé (il mondo è buio), il vetro e il cromo riflettono la stanza
    let pelle: SkinnedMesh | null = null
    scena.traverse((o) => {
      const m = o as SkinnedMesh
      if (!m.isMesh) return
      m.frustumCulled = false
      if (m.isSkinnedMesh) pelle = m
      const mats = (Array.isArray(m.material) ? m.material : [m.material]) as MeshStandardMaterial[]
      for (const mat of mats) {
        if (!mat.isMeshStandardMaterial) continue
        mat.emissive.set(0xffffff)
        mat.emissiveMap = mat.map
        mat.emissiveIntensity = T.brilla
        mat.metalness = T.metallo
        mat.roughness = T.ruvido
        mat.envMap = ambiente
        mat.envMapIntensity = T.riflesso
        mat.needsUpdate = true
        materiali.push(mat)
        if (mat.map) texture.push(mat.map)
      }
      geometrie.push(m.geometry)
    })
    const ossa = new Map<string, Bone>()
    scena.traverse((o) => { if ((o as Bone).isBone) ossa.set(o.name, o as Bone) })
    const osso = (nome: string) => {
      const b = ossa.get(nome)
      if (!b) throw new Error(`mascotte ${id}: manca l'osso ${nome}`)
      return b
    }

    // misure a riposo: altezza, centro, verso del muso (headfront davanti a Head)
    scena.updateMatrixWorld(true)
    const muso = osso('headfront').getWorldPosition(new Vector3()).sub(osso('Head').getWorldPosition(new Vector3()))
    if (muso.z < 0) scena.rotation.y = Math.PI
    scena.updateMatrixWorld(true)
    const box = { min: new Vector3(Infinity, Infinity, Infinity), max: new Vector3(-Infinity, -Infinity, -Infinity) }
    if (pelle) {
      const p = pelle as SkinnedMesh
      p.computeBoundingBox()
      const bb = p.boundingBox!.clone().applyMatrix4(p.matrixWorld)
      box.min.copy(bb.min)
      box.max.copy(bb.max)
    }
    const alto = Math.max(0.01, box.max.y - box.min.y)
    const k = ALTEZZA_MODELLO / alto
    scena.scale.multiplyScalar(k)
    scena.position.set(-((box.min.x + box.max.x) / 2) * k, -box.min.y * k, -((box.min.z + box.max.z) / 2) * k)
    modello.position.y = -ALTEZZA_CREATURA / 2
    scena.updateMatrixWorld(true)

    // le braccia: quella a sinistra dello schermo è quella con la spalla a x negativa (il modello guarda verso di noi)
    const lati = (['Left', 'Right'] as const).map((l) => ({ braccio: osso(`${l}Arm`), gomito: osso(`${l}ForeArm`), mano: osso(`${l}Hand`) }))
    lati.sort((a, b) => a.braccio.getWorldPosition(new Vector3()).x - b.braccio.getWorldPosition(new Vector3()).x)
    // i perni si misurano con la scena a riposo e senza la radice: lo spazio del modello è quello della scena
    const inversa = new Quaternion()
    modello.getWorldQuaternion(inversa).invert()
    const nelModello = (p: Perno): Perno => {
      p.padre.premultiply(inversa); p.mondo.premultiply(inversa)
      p.padreInv.copy(p.padre).invert(); p.mondoInv.copy(p.mondo).invert()
      p.dir.applyQuaternion(inversa).normalize()
      return p
    }
    const arti = lati.map((l) => ({ b: nelModello(perno(l.braccio, l.gomito)), a: nelModello(perno(l.gomito, l.mano)) }))
    const testa = osso('Head')
    const testaRiposo = testa.quaternion.clone()
    const testaPadre = testa.parent ? testa.parent.getWorldQuaternion(new Quaternion()).premultiply(inversa) : new Quaternion()
    const testaPadreInv = testaPadre.clone().invert()
    const qTesta = new Quaternion()
    const eTesta = new Euler()

    // la materia attorno: alone dietro, polvere che gira; e l'oggetto di ognuno (luna, porta, fiamma)
    const alone = new Mesh(piano, new ShaderMaterial({ vertexShader: ALONE_VERT, fragmentShader: ALONE_FRAG, uniforms: { uColore: { value: v3(T.alone) }, uAlfa: { value: 0.26 } }, transparent: true, depthWrite: false, blending: AdditiveBlending }))
    materiali.push(alone.material as Material)
    alone.position.set(0, 0.85, -0.8)
    alone.scale.set(2.8, 3.0, 1)
    modello.add(alone)
    const caso = mulberry32(11 + indice * 97)
    const geoAura = new BufferGeometry()
    geoAura.setAttribute('position', new BufferAttribute(new Float32Array(T.punti * 3), 3))
    geoAura.setAttribute('aCaso', new BufferAttribute(new Float32Array(T.punti * 4).map(() => caso()), 4))
    geometrie.push(geoAura)
    const matAura = new ShaderMaterial({ vertexShader: AURA_VERT, fragmentShader: AURA_FRAG, uniforms: { uTempo, uPx, uVel: { value: T.vel }, uColore: { value: v3(T.aura) }, uAlfa: { value: 0.9 } }, transparent: true, depthWrite: false, blending: AdditiveBlending })
    materiali.push(matAura)
    const aura = new Points(geoAura, matAura)
    aura.frustumCulled = false
    modello.add(aura)
    // ogni oggetto vivo riceve il tempo e quanto il braccio destro dello schermo sta abbracciando
    const vivi: ((t: number, abbraccioDx: number) => void)[] = []
    if (id === 'atlas') {
      const oro = luce(0xffc56b, 0xfff4d6)
      const l = new Mesh(luna, oro)
      l.position.set(0.32, 1.32, -0.4)
      l.scale.setScalar(1.35)
      modello.add(l)
      vivi.push((t) => { l.rotation.z = -0.35 + 0.06 * Math.sin(t * 0.8) })
    } else if (id === 'janus') {
      // la porta della foto: un telaio caldo con la luce dentro, accanto a lui
      const telaio = luce(0xffc98a, 0xfff1d8)
      const porta = new Group()
      porta.position.set(0.62, 0, -0.35)
      porta.rotation.y = -0.35
      modello.add(porta)
      for (const [x, y, sx, sy] of [[-0.3, 0.75, 1, 1.5], [0.3, 0.75, 1, 1.5]] as const) {
        const s = new Mesh(stipite, telaio); s.position.set(x, y, 0); s.scale.set(sx, sy, sx); porta.add(s)
      }
      const architrave = new Mesh(stipite, telaio); architrave.position.set(0, 1.5, 0); architrave.rotation.z = Math.PI / 2; architrave.scale.set(1, 0.62, 1); porta.add(architrave)
      const dentro = new Mesh(piano, new ShaderMaterial({ vertexShader: ALONE_VERT, fragmentShader: ALONE_FRAG, uniforms: { uColore: { value: v3(0xffb766) }, uAlfa: { value: 0.5 } }, transparent: true, depthWrite: false, blending: AdditiveBlending }))
      materiali.push(dentro.material as Material)
      dentro.position.set(0, 0.75, -0.02); dentro.scale.set(0.9, 1.9, 1); porta.add(dentro)
    } else if (id === 'prometheus') {
      // la fiamma nella mano destra dello schermo, sempre dritta
      const fiamma = new Group()
      const fuoco = new Mesh(sfera, luce(0xff8a3d, 0xfff2c4, 1))
      const cuore = new Mesh(sfera, luce(0xfff6e0, 0xffffff, 1))
      fuoco.scale.set(0.07, 0.13, 0.07); fuoco.position.y = 0.09
      cuore.scale.set(0.035, 0.07, 0.035); cuore.position.set(0, 0.07, 0.02)
      fiamma.add(fuoco, cuore)
      modello.add(fiamma)
      const dove = new Vector3()
      vivi.push((t, h) => {
        // nell'abbraccio la mano va sulla spalla del vicino: la fiamma si spegne, se no gli finisce in faccia
        fiamma.visible = h < 0.3
        modello.updateMatrixWorld(true)
        lati[1].mano.getWorldPosition(dove)
        modello.worldToLocal(dove)
        fiamma.position.copy(dove).add(vA.set(0, 0.02, 0.06))
        fuoco.scale.set(0.07 * (1 + 0.08 * Math.sin(t * 13)), 0.13 * (1 + 0.15 * Math.sin(t * 9 + 1)), 0.07)
      })
    }

    // la luce che le illumina come nelle foto: dall'alto a sinistra, calda, con un controluce della sua materia
    return {
      id, radice, corpo, altezza: ALTEZZA_MODELLO,
      braccia: [arti[0].b.osso, arti[1].b.osso],
      mani: [lati[0].mano, lati[1].mano],
      aggiorna(tempo, posa) {
        const pres = posa.presenza
        corpo.visible = pres > 0.001
        corpo.scale.setScalar(Math.max(pres, 1e-4))
        if (!corpo.visible) return
        uTempo.value = tempo
        const m = mire(posa, tempo, fase)
        corpo.position.y = 0.05 * Math.sin(tempo * 1.7 + fase) + 0.02 * Math.sin(tempo * 0.9 + fase * 2) + m.salto * ALTEZZA_MODELLO
        corpo.rotation.z = 0.03 * Math.sin(tempo * 1.1 + fase)
        corpo.rotation.x = 0.02 * Math.sin(tempo * 1.3 + fase)
        arti.forEach((a, i) => punta(a.b, a.a, vettore(m.braccio[i]), vettore(m.avambraccio[i])))
        qTesta.setFromEuler(eTesta.set(m.testa.su, m.testa.giro, m.testa.inclina))
        testa.quaternion.copy(testaPadreInv).multiply(qTesta).multiply(testaPadre).multiply(testaRiposo)
        for (const v of vivi) v(tempo, posa.abbraccioDx ? posa.abbraccio : 0)
      },
    }
  }

  const tutte = Object.fromEntries(ORDINE.map((id, i) => [id, costruisci(id, i, gltf[i].scene)])) as Record<Mascotte, Creatura>
  // le luci: figlie della prima creatura non vanno bene (si spengono con lei); le aggiunge il mondo con `luci`
  const luci = new Group()
  luci.add(new HemisphereLight(0xdfe8ff, 0x1a1420, 1.3))
  const chiave = new DirectionalLight(0xfff1dc, 2.4)
  chiave.position.set(-2, 3, 4)
  const contro = new DirectionalLight(0x9fb8ff, 1.6)
  contro.position.set(1.5, 2, -3)
  for (const l of [chiave, contro]) {
    l.target.position.set(0, 0, 0)
    luci.add(l, l.target)
  }
  return {
    ...tutte,
    luci,
    imposta(px) {
      uPx.value = px
    },
    dispose() {
      for (const id of ORDINE) tutte[id].radice.removeFromParent()
      luci.removeFromParent()
      for (const g of geometrie) g.dispose()
      for (const m of materiali) m.dispose()
      for (const t of texture) t.dispose()
    },
  }
}
