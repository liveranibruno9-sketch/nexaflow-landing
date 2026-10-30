// npm test  ·  il saluto registrato allo specchio: su uno scheletro simmetrico il braccio gemello fa lo stesso gesto, riflesso
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { AnimationClip, Bone, Euler, Quaternion, QuaternionKeyframeTrack, Vector3 } from 'three'
import { specchia } from './mascotte-glb.ts'

/** uno scheletro: bacino girato a caso, due braccia con assi locali riflessi l'uno dell'altro (come nei rig veri) */
function scheletro() {
  const bacino = new Bone()
  bacino.name = 'Hips'
  bacino.quaternion.setFromEuler(new Euler(0.2, 0.3, 0.1))
  const lati = ['Left', 'Right'].map((l, i) => {
    const s = i === 0 ? 1 : -1
    const b = new Bone()
    b.name = `${l}Arm`
    b.position.set(0.3 * s, 0.5, 0)
    const q = new Quaternion().setFromEuler(new Euler(0.4, 0.7, -0.5))
    // il gemello ha la rotazione a riposo riflessa nello spazio del padre
    b.quaternion.copy(i === 0 ? q : new Quaternion(q.x, -q.y, -q.z, q.w))
    const punta = new Bone()
    punta.position.set(0, 1, 0)
    b.add(punta)
    bacino.add(b)
    return { b, punta }
  })
  bacino.updateMatrixWorld(true)
  const riposo = new Map<string, Quaternion>()
  const padre = new Map<string, Quaternion>()
  for (const { b } of lati) {
    riposo.set(b.name, b.quaternion.clone())
    // lo spazio del modello è quello del bacino: il padre di ogni braccio, nel modello, è l'identità
    padre.set(b.name, new Quaternion())
  }
  return { bacino, lati, riposo, padre }
}

test('specchia: la rotazione del braccio destro diventa quella riflessa del sinistro', () => {
  const { lati, riposo, padre } = scheletro()
  const [sx, dx] = lati
  // il gesto registrato: il braccio destro ruota di un po' rispetto alla posa a riposo
  const gesto = new Quaternion().setFromEuler(new Euler(0.9, -0.4, 1.1))
  const chiave = gesto.clone().multiply(riposo.get('RightArm')!)
  const clip = new AnimationClip('saluto', 1, [new QuaternionKeyframeTrack('RightArm.quaternion', [0], chiave.toArray())])
  const specchio = specchia(clip, padre, riposo)
  assert.equal(specchio.tracks.length, 1)
  assert.equal(specchio.tracks[0].name, 'LeftArm.quaternion')
  dx.b.quaternion.copy(chiave)
  sx.b.quaternion.fromArray(Array.from(specchio.tracks[0].values))
  dx.b.updateMatrixWorld(true)
  sx.b.updateMatrixWorld(true)
  const pd = new Vector3().setFromMatrixPosition(dx.punta.matrix).applyQuaternion(dx.b.quaternion).add(dx.b.position)
  const ps = new Vector3().setFromMatrixPosition(sx.punta.matrix).applyQuaternion(sx.b.quaternion).add(sx.b.position)
  assert.ok(Math.abs(ps.x + pd.x) < 1e-5 && Math.abs(ps.y - pd.y) < 1e-5 && Math.abs(ps.z - pd.z) < 1e-5, `riflessa: ${ps.toArray()} contro ${pd.toArray()}`)
})
