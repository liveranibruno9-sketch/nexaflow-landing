// Le quattro mascotte 3D tali e quali alle foto (home v2.2-v2.3, D45-D46): modelli GLB con scheletro, fatti con Higgsfield (Meshy)
// dalle foto X-2 rimesse in posa (public/film/mascotte, texture 2048). Come personaggi di un videogioco:
// - ogni materia ha il suo materiale vero: pelo di velluto con le stelle che brillano (Atlas), vetro lucido con il bordo acceso
//   (Janus), vene di luce che tremano a scatti e piccole saette attorno (Prometheus), cromo che specchia la stanza (Hermes);
//   gli occhi ambra brillano come nelle foto;
// - il saluto è un movimento registrato (Big_Wave_Hello, già nel modello di Atlas), uguale per tutte perché hanno lo stesso
//   scheletro, e specchiato quando serve l'altro braccio;
// - da ferme respirano, spostano il peso, collo e testa seguono lo sguardo, le braccia arrivano alla posa con una molla.
// Le ossa a riposo e nell'abbraccio le calcola ossa.ts. Le creature in codice (creature.ts) restano come riserva.
import {
  AdditiveBlending, AnimationClip, AnimationMixer, BufferAttribute, BufferGeometry, Color, DirectionalLight, Euler, Group, HemisphereLight,
  LineBasicMaterial, LineSegments, LoopRepeat, Mesh, MeshPhysicalMaterial, PlaneGeometry, PMREMGenerator, Points, Quaternion,
  QuaternionKeyframeTrack, ShaderMaterial, SphereGeometry, Vector3, VectorKeyframeTrack,
} from 'three'
import type { AnimationAction, Bone, KeyframeTrack, Material, MeshStandardMaterial, Object3D, SkinnedMesh, Texture, WebGLRenderer } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { mulberry32 } from '../campiona.ts'
import { ALTEZZA_CREATURA, ORDINE } from '../coreografia.ts'
import type { Lato, Mascotte } from '../coreografia.ts'
import { mire } from '../ossa.ts'
import type { V3 } from '../ossa.ts'
import type { Creatura, Creature } from './creature.ts'
import { ALONE_FRAG, ALONE_VERT } from './shader.ts'
import { AURA_FRAG, AURA_VERT, LUCE_FRAG, PELLE_VERT } from './shader-creature.ts'

/** altezza del modello (orecchie comprese) nelle unità delle creature */
const ALTEZZA_MODELLO = 1.7
/** il saluto registrato va un po' più veloce dell'originale: più vivace */
const VELOCITA_SALUTO = 1.35

type Tono = {
  fisica: Partial<MeshPhysicalMaterial>
  /** quanto brillano gli occhi ambra, le stelle del pelo, le vene di luce; il bordo che prende luce e la sua forza */
  occhi: number; stelle: number; vene: number; bordo: number; bordoForza: number
  aura: number; alone: number; punti: number; vel: number
}
const TONO: Record<Mascotte, Tono> = {
  atlas: {
    fisica: { roughness: 0.78, metalness: 0, sheen: 1, sheenColor: new Color(0x7aa2ff), sheenRoughness: 0.45, emissiveIntensity: 0.3, envMapIntensity: 0.35 },
    occhi: 0.9, stelle: 1.1, vene: 0, bordo: 0x7aa2ff, bordoForza: 0.35, aura: 0xa8c4ff, alone: 0x5b8cff, punti: 190, vel: 0.35,
  },
  janus: {
    fisica: { roughness: 0.04, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.03, transparent: true, opacity: 0.9, emissiveIntensity: 0.16, envMapIntensity: 1.1, ior: 1.5, iridescence: 0.25, iridescenceIOR: 1.3 },
    occhi: 1.0, stelle: 0, vene: 0, bordo: 0x9ff6ff, bordoForza: 0.9, aura: 0x8ff3ff, alone: 0x35e0f0, punti: 90, vel: 0.25,
  },
  prometheus: {
    fisica: { roughness: 0.45, metalness: 0, emissiveIntensity: 0.5, envMapIntensity: 0.35 },
    occhi: 1.0, stelle: 0, vene: 1.1, bordo: 0xc8b0ff, bordoForza: 0.5, aura: 0xd8c4ff, alone: 0xb48cff, punti: 150, vel: 0.9,
  },
  hermes: {
    fisica: { roughness: 0.07, metalness: 1, clearcoat: 0.7, clearcoatRoughness: 0.05, emissiveIntensity: 0.12, envMapIntensity: 1.8 },
    occhi: 0, stelle: 0, vene: 0, bordo: 0xfff1d6, bordoForza: 0.35, aura: 0xfff0d0, alone: 0xd9d4c7, punti: 120, vel: 0.5,
  },
}

const v3 = (hex: number) => new Vector3(((hex >> 16) & 255) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255)
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x)

/** il materiale vero di ogni materia, sulla texture della foto; le luci in più (occhi, stelle, vene, bordo) nello shader */
function pelle(id: Mascotte, vecchio: MeshStandardMaterial, ambiente: Texture, uTempo: { value: number }): MeshPhysicalMaterial {
  const T = TONO[id]
  const m = new MeshPhysicalMaterial({ map: vecchio.map, emissiveMap: vecchio.map, emissive: 0xffffff, envMap: ambiente })
  Object.assign(m, T.fisica)
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uTempo = uTempo
    sh.uniforms.uOcchi = { value: T.occhi }
    sh.uniforms.uStelle = { value: T.stelle }
    sh.uniforms.uVene = { value: T.vene }
    sh.uniforms.uBordo = { value: v3(T.bordo) }
    sh.uniforms.uBordoForza = { value: T.bordoForza }
    sh.fragmentShader = 'uniform float uTempo;\nuniform float uOcchi;\nuniform float uStelle;\nuniform float uVene;\nuniform vec3 uBordo;\nuniform float uBordoForza;\n' +
      sh.fragmentShader.replace('#include <emissivemap_fragment>', /* glsl */ `#include <emissivemap_fragment>
      vec3 tx = texture2D( map, vMapUv ).rgb;
      float lum = dot( tx, vec3( 0.299, 0.587, 0.114 ) );
      float caso = fract( sin( dot( floor( vMapUv * 640.0 ), vec2( 12.9898, 78.233 ) ) ) * 43758.5453 );
      // gli occhi ambra brillano come nelle foto
      float ambra = smoothstep( 0.22, 0.45, tx.r - tx.b ) * smoothstep( 0.35, 0.6, tx.r );
      totalEmissiveRadiance += vec3( 1.0, 0.62, 0.25 ) * ambra * uOcchi;
      // le stelle del pelo: i punti chiari si accendono e si spengono, ognuno col suo ritmo
      float stella = smoothstep( 0.42, 0.75, lum );
      totalEmissiveRadiance += vec3( 1.0, 0.93, 0.8 ) * stella * uStelle * ( 0.25 + 1.6 * pow( 0.5 + 0.5 * sin( uTempo * ( 1.2 + 3.0 * caso ) + caso * 40.0 ), 4.0 ) );
      // le vene di luce tremano a scatti
      float scatto = step( 0.45, fract( sin( floor( uTempo * 12.0 ) * 7.13 + caso * 31.0 ) * 43758.5453 ) );
      totalEmissiveRadiance += vec3( 0.86, 0.78, 1.0 ) * smoothstep( 0.55, 0.85, lum ) * uVene * ( 0.35 + 0.9 * scatto );
      // il bordo che prende luce
      float bordo = pow( 1.0 - saturate( dot( normal, normalize( vViewPosition ) ) ), 3.0 );
      totalEmissiveRadiance += uBordo * bordo * uBordoForza;`)
  }
  return m
}

/** nome dell'osso gemello (Left ↔ Right), o lo stesso osso se sta al centro */
const gemello = (nome: string) => (nome.startsWith('Left') ? `Right${nome.slice(4)}` : nome.startsWith('Right') ? `Left${nome.slice(5)}` : nome)

/**
 * Il movimento registrato allo specchio, per il braccio dell'altro lato: ogni rotazione si porta nello spazio del modello rispetto
 * alla posa a riposo, si specchia sul piano x = 0 e si rimette nell'osso gemello. Vale per qualunque orientamento delle ossa.
 */
export function specchia(clip: AnimationClip, padre: Map<string, Quaternion>, riposo: Map<string, Quaternion>): AnimationClip {
  const tracce: KeyframeTrack[] = []
  const q = new Quaternion()
  const d = new Quaternion()
  const p = new Vector3()
  for (const t of clip.tracks) {
    const punto = t.name.lastIndexOf('.')
    const nodo = t.name.slice(0, punto)
    const prop = t.name.slice(punto + 1)
    const altro = gemello(nodo)
    const Pa = padre.get(nodo), La = riposo.get(nodo), Pb = padre.get(altro), Lb = riposo.get(altro)
    if (!Pa || !La || !Pb || !Lb) continue
    const v = new Float32Array(t.values.length)
    if (prop === 'quaternion') {
      const LaInv = La.clone().invert(), PaInv = Pa.clone().invert(), PbInv = Pb.clone().invert()
      for (let i = 0; i < v.length; i += 4) {
        q.fromArray(t.values, i)
        d.copy(Pa).multiply(q).multiply(LaInv).multiply(PaInv)
        d.set(d.x, -d.y, -d.z, d.w)
        q.copy(PbInv).multiply(d).multiply(Pb).multiply(Lb)
        q.toArray(v, i)
      }
      tracce.push(new QuaternionKeyframeTrack(`${altro}.quaternion`, Array.from(t.times), Array.from(v)))
    } else if (prop === 'position') {
      const PaInv = Pa.clone().invert()
      for (let i = 0; i < v.length; i += 3) {
        p.fromArray(t.values, i).applyQuaternion(Pa)
        p.x = -p.x
        p.applyQuaternion(PaInv).toArray(v, i)
      }
      tracce.push(new VectorKeyframeTrack(`${altro}.position`, Array.from(t.times), Array.from(v)))
    }
  }
  return new AnimationClip(`${clip.name}-specchio`, clip.duration, tracce)
}

/** un osso che punta: posa a riposo (locale, del padre e sua, nello spazio del modello) e direzione verso il figlio */
type Perno = { osso: Bone; locale: Quaternion; padre: Quaternion; padreInv: Quaternion; mondo: Quaternion; mondoInv: Quaternion; dir: Vector3 }
const qA = new Quaternion()
const qB = new Quaternion()
const qC = new Quaternion()
const vA = new Vector3()
/** braccio e avambraccio verso due direzioni (spazio del modello): la rotazione minima dalla posa a riposo, prima la spalla poi il gomito */
function punta(b: Perno, a: Perno, db: Vector3, da: Vector3) {
  qA.setFromUnitVectors(b.dir, db)
  b.osso.quaternion.copy(b.padreInv).multiply(qA).multiply(b.padre).multiply(b.locale)
  vA.copy(a.dir).applyQuaternion(qA)
  qB.setFromUnitVectors(vA, da)
  qC.copy(qA).invert()
  a.osso.quaternion.copy(b.mondoInv).multiply(qC).multiply(qB).multiply(qA).multiply(b.mondo).multiply(a.locale)
}
/** gira un osso di una rotazione espressa negli assi del modello, a partire dalla sua posa a riposo */
function giraNelModello(osso: Bone, padre: Quaternion, padreInv: Quaternion, locale: Quaternion, r: Quaternion) {
  osso.quaternion.copy(padreInv).multiply(r).multiply(padre).multiply(locale)
}

/** il saluto da `saluto.json` (estratto una volta da atlas.glb): le pagine dei servizi caricano solo la loro mascotte, senza il modello di Atlas */
async function caricaSaluto(base: string): Promise<AnimationClip | null> {
  try {
    const r = await fetch(`${base}/saluto.json`)
    if (!r.ok) return null
    const j = (await r.json()) as { nome: string; durata: number; tracce: { nome: string; tipo: 'q' | 'v'; tempi: number[]; valori: number[] }[] }
    return new AnimationClip(j.nome, j.durata, j.tracce.map((t) => (t.tipo === 'q' ? new QuaternionKeyframeTrack(t.nome, t.tempi, t.valori) : new VectorKeyframeTrack(t.nome, t.tempi, t.valori))))
  } catch {
    return null
  }
}

/**
 * Carica le mascotte. Senza `solo` le quattro, come in home (il saluto sta nel modello di Atlas). Con `solo` (le pagine dei servizi,
 * R12) soltanto quelle indicate: il saluto arriva dal piccolo `saluto.json`, il resto è identico.
 */
export async function caricaMascotte(renderer: WebGLRenderer, base = '/film/mascotte', solo?: readonly Mascotte[]): Promise<Creature> {
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder)
  const ids: readonly Mascotte[] = solo ?? ORDINE
  const [gltf, salutoJson] = await Promise.all([Promise.all(ids.map((id) => loader.loadAsync(`${base}/${id}.glb`))), solo ? caricaSaluto(base) : Promise.resolve(null)])
  const geometrie: BufferGeometry[] = []
  const materiali: Material[] = []
  const texture: Texture[] = []
  const uTempo = { value: 0 }
  const uPx = { value: 1 }

  // il riflesso di una stanza chiara: dà al vetro e al cromo qualcosa da specchiare
  const pmrem = new PMREMGenerator(renderer)
  const ambiente = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  pmrem.dispose()
  texture.push(ambiente)

  // il saluto registrato (nel modello di Atlas): solo rotazioni e la posizione del bacino
  const registrato = salutoJson ?? gltf[0].animations.find((a) => /wave/i.test(a.name)) ?? null
  const saluto = registrato
    ? new AnimationClip('saluto', registrato.duration, registrato.tracks.filter((t) => t.name.endsWith('.quaternion') || t.name === 'Hips.position'))
    : null

  const sfera = new SphereGeometry(1, 24, 16)
  const piano = new PlaneGeometry(1, 1)
  geometrie.push(sfera, piano)
  const luce = (colore: number, cuore: number, trema = 0) => {
    const m = new ShaderMaterial({ vertexShader: PELLE_VERT, fragmentShader: LUCE_FRAG, uniforms: { uColore: { value: v3(colore) }, uCuore: { value: v3(cuore) }, uTempo, uTrema: { value: trema } } })
    materiali.push(m)
    return m
  }
  const alone = (colore: number, alfa: number) => {
    const m = new ShaderMaterial({ vertexShader: ALONE_VERT, fragmentShader: ALONE_FRAG, uniforms: { uColore: { value: v3(colore) }, uAlfa: { value: alfa } }, transparent: true, depthWrite: false, blending: AdditiveBlending })
    materiali.push(m)
    return new Mesh(piano, m)
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

    let pelleMesh: SkinnedMesh | null = null
    scena.traverse((o) => {
      const m = o as SkinnedMesh
      if (!m.isMesh) return
      m.frustumCulled = false
      if (m.isSkinnedMesh) pelleMesh = m
      const vecchio = m.material as MeshStandardMaterial
      if (vecchio.isMeshStandardMaterial) {
        const nuovo = pelle(id, vecchio, ambiente, uTempo)
        m.material = nuovo
        materiali.push(nuovo, vecchio)
        if (vecchio.map) texture.push(vecchio.map)
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

    // misure a riposo: verso del muso (headfront davanti a Head), altezza, centro
    scena.updateMatrixWorld(true)
    const muso = osso('headfront').getWorldPosition(new Vector3()).sub(osso('Head').getWorldPosition(new Vector3()))
    if (muso.z < 0) scena.rotation.y = Math.PI
    scena.updateMatrixWorld(true)
    const min = new Vector3(), max = new Vector3(1, 1, 1)
    if (pelleMesh) {
      const p = pelleMesh as SkinnedMesh
      p.computeBoundingBox()
      const bb = p.boundingBox!.clone().applyMatrix4(p.matrixWorld)
      min.copy(bb.min)
      max.copy(bb.max)
    }
    const k = ALTEZZA_MODELLO / Math.max(0.01, max.y - min.y)
    scena.scale.multiplyScalar(k)
    scena.position.set(-((min.x + max.x) / 2) * k, -min.y * k, -((min.z + max.z) / 2) * k)
    modello.position.y = -ALTEZZA_CREATURA / 2
    scena.updateMatrixWorld(true)

    // la posa a riposo di ogni osso: locale e del padre nello spazio del modello (radice e modello sono ancora senza rotazioni)
    const riposo = new Map<string, Quaternion>()
    const padre = new Map<string, Quaternion>()
    const padreInv = new Map<string, Quaternion>()
    for (const [nome, b] of Array.from(ossa)) {
      riposo.set(nome, b.quaternion.clone())
      const pq = b.parent ? b.parent.getWorldQuaternion(new Quaternion()) : new Quaternion()
      padre.set(nome, pq)
      padreInv.set(nome, pq.clone().invert())
    }
    const bacino = osso('Hips')
    const bacinoRiposo = bacino.position.clone()

    // le braccia: [sinistra, destra] dello schermo (il modello guarda verso di noi)
    const lati = (['Left', 'Right'] as const).map((l) => ({ spalla: osso(`${l}Shoulder`), braccio: osso(`${l}Arm`), gomito: osso(`${l}ForeArm`), mano: osso(`${l}Hand`) }))
    lati.sort((a, b) => a.braccio.getWorldPosition(new Vector3()).x - b.braccio.getWorldPosition(new Vector3()).x)
    const perno = (o: Bone, figlio: Object3D): Perno => {
      const mondo = o.getWorldQuaternion(new Quaternion())
      const dir = figlio.getWorldPosition(new Vector3()).sub(o.getWorldPosition(new Vector3())).normalize()
      return { osso: o, locale: riposo.get(o.name)!, padre: padre.get(o.name)!, padreInv: padreInv.get(o.name)!, mondo, mondoInv: mondo.clone().invert(), dir }
    }
    const arti = lati.map((l) => ({ b: perno(l.braccio, l.gomito), a: perno(l.gomito, l.mano) }))
    // le direzioni delle braccia arrivano alla posa con una molla, non a scatti
    const molle = arti.map((a) => ({ b: a.b.dir.clone(), a: a.a.dir.clone() }))

    // il saluto registrato e il suo specchio: quale lato dello schermo saluta il registrato (il braccio destro del personaggio)
    const mixer = new AnimationMixer(scena)
    const azioni: Partial<Record<Lato, AnimationAction>> = {}
    if (saluto) {
      const latoRegistrato: Lato = osso('RightArm').getWorldPosition(new Vector3()).x < 0 ? 'sinistro' : 'destro'
      const altro: Lato = latoRegistrato === 'sinistro' ? 'destro' : 'sinistro'
      azioni[latoRegistrato] = mixer.clipAction(saluto)
      azioni[altro] = mixer.clipAction(specchia(saluto, padre, riposo))
      for (const a of Object.values(azioni)) {
        if (!a) continue
        a.setLoop(LoopRepeat, Infinity)
        a.timeScale = VELOCITA_SALUTO
      }
    }
    const catenaDi = (i: number) => {
      const l = lati[i]
      return [l.spalla, l.braccio, l.gomito, l.mano, ...Array.from(ossa.values()).filter((b) => b.parent === l.mano || b.parent?.parent === l.mano)]
    }
    const catene: Record<Lato, Bone[]> = { sinistro: catenaDi(0), destro: catenaDi(1) }
    const tutte = Array.from(ossa.values())
    const presa = new Map<Bone, Quaternion>(tutte.map((b) => [b, b.quaternion.clone()]))
    const presaBacino = new Vector3()
    let pesoSaluto = 0
    let inCorso: AnimationAction | null = null
    let ultimo = -1

    // testa, collo e busto: rotazioni negli assi del modello
    const testa = osso('Head'), collo = osso('neck'), busto1 = osso('Spine01'), busto2 = osso('Spine02')
    const rTesta = new Quaternion(), rCollo = new Quaternion(), rBusto = new Quaternion(), rBacino = new Quaternion()
    const e = new Euler()

    // la materia attorno: alone dietro, polvere che gira; e l'oggetto di ognuno (la luna di Atlas, la fiamma e le saette di Prometheus)
    const dietro = alone(T.alone, 0.26)
    dietro.position.set(0, 0.85, -0.8)
    dietro.scale.set(2.8, 3.0, 1)
    modello.add(dietro)
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
    const vivi: ((t: number, abbraccioDx: number) => void)[] = []
    if (id === 'atlas') {
      // la luna della foto: un disco caldo che brilla dietro la spalla, con il suo alone
      const luna = new Mesh(sfera, luce(0xff9c3c, 0xffe7b8))
      luna.position.set(-0.3, 1.02, -0.62)
      luna.scale.setScalar(0.2)
      const bagliore = alone(0xffa64d, 0.45)
      bagliore.position.set(-0.3, 1.02, -0.66)
      bagliore.scale.setScalar(1.05)
      modello.add(luna, bagliore)
      vivi.push((t) => { bagliore.scale.setScalar(1.05 * (1 + 0.05 * Math.sin(t * 1.3))) })
    } else if (id === 'prometheus') {
      // la fiamma tenuta in mano (sparisce nell'abbraccio) e le piccole saette che scoccano attorno al corpo
      const fiamma = new Group()
      const fuoco = new Mesh(sfera, luce(0xff8a3d, 0xfff2c4, 1))
      const cuore = new Mesh(sfera, luce(0xfff6e0, 0xffffff, 1))
      fuoco.scale.set(0.07, 0.13, 0.07)
      fuoco.position.y = 0.09
      cuore.scale.set(0.035, 0.07, 0.035)
      cuore.position.set(0, 0.07, 0.02)
      fiamma.add(fuoco, cuore)
      modello.add(fiamma)
      const N = 4, PEZZI = 7
      const geoSaette = new BufferGeometry()
      const pos = new Float32Array(N * PEZZI * 6)
      geoSaette.setAttribute('position', new BufferAttribute(pos, 3))
      geometrie.push(geoSaette)
      const matSaette = new LineBasicMaterial({ color: 0xece4ff, transparent: true, opacity: 0.9, blending: AdditiveBlending, depthWrite: false })
      materiali.push(matSaette)
      const saette = new LineSegments(geoSaette, matSaette)
      saette.frustumCulled = false
      modello.add(saette)
      const r = mulberry32(77)
      let prossima = 0
      const dove = new Vector3()
      vivi.push((t, h) => {
        fiamma.visible = h < 0.3
        modello.updateMatrixWorld(true)
        lati[1].mano.getWorldPosition(dove)
        modello.worldToLocal(dove)
        fiamma.position.copy(dove).add(vA.set(0, 0.02, 0.06))
        fuoco.scale.set(0.07 * (1 + 0.08 * Math.sin(t * 13)), 0.13 * (1 + 0.15 * Math.sin(t * 9 + 1)), 0.07)
        if (t < prossima) return
        prossima = t + 0.06 + r() * 0.1
        for (let s = 0; s < N; s++) {
          const accesa = r() < 0.55
          const a = r() * Math.PI * 2
          const rr = 0.42 + r() * 0.18
          let x = Math.cos(a) * rr, y = 0.3 + r() * 1.2, z = Math.sin(a) * rr * 0.7
          for (let i = 0; i < PEZZI; i++) {
            const o = (s * PEZZI + i) * 6
            const nx = x + (r() - 0.5) * 0.12, ny = y + 0.05 + (r() - 0.5) * 0.08, nz = z + (r() - 0.5) * 0.08
            pos.set(accesa ? [x, y, z, nx, ny, nz] : [0, 0, 0, 0, 0, 0], o)
            x = nx; y = ny; z = nz
          }
        }
        geoSaette.attributes.position.needsUpdate = true
      })
    }

    return {
      id, radice, corpo, altezza: ALTEZZA_MODELLO,
      braccia: [arti[0].b.osso, arti[1].b.osso],
      mani: [lati[0].mano, lati[1].mano],
      aggiorna(tempo, posa) {
        const pres = posa.presenza
        corpo.visible = pres > 0.001
        corpo.scale.setScalar(Math.max(pres, 1e-4))
        if (!corpo.visible) {
          ultimo = -1
          return
        }
        const dt = ultimo < 0 ? 0 : Math.min(0.1, Math.max(0, tempo - ultimo))
        ultimo = tempo
        uTempo.value = tempo
        const molla = dt ? 1 - Math.exp(-dt * 7) : 1

        // 1. il saluto registrato, se serve: si legge la sua posa prima di rimettere le ossa a riposo. Un braccio che abbraccia non saluta.
        const abbraccia = posa.abbraccio > 0.05 && (posa.lato === 'sinistro' ? posa.abbraccioSx : posa.abbraccioDx)
        const azione = abbraccia ? undefined : azioni[posa.lato]
        pesoSaluto += ((azione ? clamp01(posa.saluto) : 0) - pesoSaluto) * (dt ? 1 - Math.exp(-dt * 5) : 1)
        if (azione && pesoSaluto > 0.01) {
          if (azione !== inCorso) {
            inCorso?.stop()
            azione.reset().play()
            inCorso = azione
          }
          mixer.update(dt)
          for (const b of tutte) presa.get(b)!.copy(b.quaternion)
          presaBacino.copy(bacino.position)
        }

        // 2. tutto a riposo, poi il corpo vivo: respiro, peso che si sposta, collo e testa, braccia con la molla
        for (const b of tutte) b.quaternion.copy(riposo.get(b.name)!)
        bacino.position.copy(bacinoRiposo)
        const m = mire({ ...posa, saluto: azione ? 0 : posa.saluto }, tempo, fase)
        corpo.position.y = 0.04 * Math.sin(tempo * 1.7 + fase) + 0.015 * Math.sin(tempo * 0.9 + fase * 2) + m.salto * ALTEZZA_MODELLO + (m.corpo ? m.corpo.su * ALTEZZA_MODELLO : 0)
        corpo.rotation.z = 0.02 * Math.sin(tempo * 1.1 + fase)
        corpo.rotation.x = m.corpo ? m.corpo.avanti : 0
        rBacino.setFromEuler(e.set(0, 0.05 * Math.sin(tempo * 0.6 + fase), 0.025 * Math.sin(tempo * 0.9 + fase)))
        giraNelModello(bacino, padre.get('Hips')!, padreInv.get('Hips')!, riposo.get('Hips')!, rBacino)
        rBusto.setFromEuler(e.set(0.03 * Math.sin(tempo * 1.7 + fase), 0, -0.02 * Math.sin(tempo * 0.9 + fase)))
        giraNelModello(busto1, padre.get('Spine01')!, padreInv.get('Spine01')!, riposo.get('Spine01')!, rBusto)
        giraNelModello(busto2, padre.get('Spine02')!, padreInv.get('Spine02')!, riposo.get('Spine02')!, rBusto)
        // collo e testa si dividono lo sguardo (40 / 60): il movimento è morbido, non solo la testa che gira
        rCollo.setFromEuler(e.set(m.testa.su * 0.4, m.testa.giro * 0.4, m.testa.inclina * 0.4))
        giraNelModello(collo, padre.get('neck')!, padreInv.get('neck')!, riposo.get('neck')!, rCollo)
        rTesta.setFromEuler(e.set(m.testa.su * 0.6, m.testa.giro * 0.6, m.testa.inclina * 0.6))
        giraNelModello(testa, padre.get('Head')!, padreInv.get('Head')!, riposo.get('Head')!, rTesta)
        arti.forEach((a, i) => {
          molle[i].b.lerp(vA.fromArray(m.braccio[i] as V3), molla).normalize()
          molle[i].a.lerp(vA.fromArray(m.avambraccio[i] as V3), molla).normalize()
          punta(a.b, a.a, molle[i].b, molle[i].a)
        })

        // 3. il saluto registrato sopra, in proporzione: tutto il corpo se è libero, solo il braccio che saluta se l'altro abbraccia
        if (azione && pesoSaluto > 0.01) {
          const ossaSaluto = posa.abbraccio > 0.05 ? catene[posa.lato] : tutte
          for (const b of ossaSaluto) b.quaternion.slerp(presa.get(b)!, pesoSaluto)
          if (ossaSaluto === tutte) bacino.position.lerp(presaBacino, pesoSaluto)
        }
        for (const v of vivi) v(tempo, posa.abbraccioDx ? posa.abbraccio : 0)
      },
    }
  }

  const tutte = Object.fromEntries(ids.map((id, i) => [id, costruisci(id, ORDINE.indexOf(id), gltf[i].scene)])) as Record<Mascotte, Creatura>
  // le luci: dall'alto a sinistra, calde, come nelle foto; un controluce freddo per staccarle dal buio
  const luci = new Group()
  luci.add(new HemisphereLight(0xdfe8ff, 0x1a1420, 1.2))
  const chiave = new DirectionalLight(0xfff1dc, 2.6)
  chiave.position.set(-2, 3, 4)
  const contro = new DirectionalLight(0x9fb8ff, 1.8)
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
      for (const id of ids) tutte[id].radice.removeFromParent()
      luci.removeFromParent()
      for (const g of geometrie) g.dispose()
      for (const m of materiali) m.dispose()
      for (const t of texture) t.dispose()
    },
  }
}
