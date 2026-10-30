// La squadra (home v2): le quattro mascotte arrivano dai quattro lati del buio e si riuniscono al centro, in un gruppo di 2 x 2;
// la frase sta sopra e sotto. Quattro piani con la foto X-2 (stessa maschera morbida delle foto vive, senza parallasse).
import { AdditiveBlending, Group, LinearFilter, Mesh, NoColorSpace, PlaneGeometry, ShaderMaterial, Texture, Vector2 } from 'three'
import type { Immagine } from '../tipi.ts'
import { FOTO_FRAG, FOTO_VERT } from './shader-strati.ts'

export type Squadra = {
  gruppo: Group
  /** locale = frazione del blocco 0..1: da sparse ai quattro angoli (0) a riunite al centro (0,45..0,85), poi sfumano */
  aggiorna(locale: number, tempo: number): void
  dispose(): void
}

const LARGHEZZA = 1.0
const ALTEZZA = LARGHEZZA * (16 / 9)
/** dove sta ogni mascotte nel gruppo riunito (x, y in unità del quadro) e da dove arriva (fuori dal quadro) */
const POSTI = [
  { a: [-0.55, 0.9], da: [-3.2, 3.4] },
  { a: [0.55, 0.9], da: [3.2, 3.4] },
  { a: [-0.55, -0.9], da: [-3.2, -3.4] },
  { a: [0.55, -0.9], da: [3.2, -3.4] },
]

const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x))
const liscia = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}

const carica = (src: string) =>
  new Promise<HTMLImageElement>((ok, ko) => {
    const i = new Image()
    i.decoding = 'async'
    i.onload = () => ok(i)
    i.onerror = () => ko(new Error(src))
    i.src = src
  })

export async function creaSquadra(immagini: Immagine[], misura: 720 | 1080): Promise<Squadra> {
  const foto = await Promise.all(immagini.slice(0, 4).map((nome) => carica(`/film/scene/${nome}-${misura}.webp`)))
  const gruppo = new Group()
  const geometria = new PlaneGeometry(LARGHEZZA, ALTEZZA, 1, 1)
  const grigio = new Texture()
  const pezzi = foto.map((img, i) => {
    const mappa = new Texture(img)
    mappa.colorSpace = NoColorSpace
    mappa.minFilter = LinearFilter
    mappa.generateMipmaps = false
    mappa.needsUpdate = true
    const materiale = new ShaderMaterial({
      vertexShader: FOTO_VERT,
      fragmentShader: FOTO_FRAG,
      uniforms: { uMap: { value: mappa }, uProf: { value: grigio }, uPar: { value: 0 }, uOp: { value: 0 }, uAlto: { value: 0 }, uBasso: { value: 0 }, uTel: { value: 0 }, uRes: { value: new Vector2(1, 1) } },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    })
    const mesh = new Mesh(geometria, materiale)
    mesh.frustumCulled = false
    mesh.position.set(POSTI[i].da[0], POSTI[i].da[1], 0.05 + i * 0.01)
    gruppo.add(mesh)
    return { mesh, materiale, mappa }
  })
  gruppo.visible = false
  return {
    gruppo,
    aggiorna(locale, tempo) {
      const dentro = liscia(0.05, 0.5, locale)
      const alfa = liscia(0.02, 0.3, locale) * (1 - liscia(0.86, 1, locale))
      gruppo.visible = alfa > 0.002
      pezzi.forEach((p, i) => {
        const { a, da } = POSTI[i]
        // un lieve respiro quando sono riunite, così nulla resta fermo (D39)
        const resp = 0.03 * dentro * Math.sin(tempo * 0.9 + i * 1.7)
        p.mesh.position.x = da[0] + (a[0] - da[0]) * dentro
        p.mesh.position.y = da[1] + (a[1] - da[1]) * dentro + resp
        p.materiale.uniforms.uOp.value = alfa
      })
    },
    dispose() {
      gruppo.removeFromParent()
      geometria.dispose()
      grigio.dispose()
      for (const p of pezzi) {
        p.materiale.dispose()
        p.mappa.dispose()
      }
    },
  }
}
