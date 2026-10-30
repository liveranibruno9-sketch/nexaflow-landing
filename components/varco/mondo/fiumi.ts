// I fiumi di particelle del varco: un solo Points, la materia viene dai pesi di pesiMateria (uniforme vec4).
import { AdditiveBlending, BufferAttribute, BufferGeometry, Points, ShaderMaterial, Vector3 } from 'three'
import { mulberry32 } from '../campiona.ts'
import { FIUMI_FRAG, FIUMI_VERT } from './shader.ts'

export type Colori = { polvere: number[]; vetro: number[]; saette: number[]; saetteViola: number[]; cromo: number[] }

export type Fiumi = {
  oggetto: Points
  /** camZ = z della camera; pesi = polvere, vetro, saette, cromo (somma 1); densita 0..1 */
  aggiorna(camZ: number, tempo: number, pesi: [number, number, number, number], densita: number): void
  /** i pixel per unità di mondo a distanza 1: altezza dello schermo in pixel / (2 · tan(fov / 2)) */
  imposta(px: number): void
  dispose(): void
}

const v3 = (c: number[]) => new Vector3(c[0], c[1], c[2])

export function creaFiumi(n: number, colori: Colori): Fiumi {
  const caso = mulberry32(20261030)
  const aCaso = new Float32Array(n * 4)
  const aSoglia = new Float32Array(n)
  const aR = new Float32Array(n)
  const pos = new Float32Array(n * 3) // la posizione vera la calcola lo shader; serve solo per il numero di vertici
  for (let i = 0; i < n; i++) {
    aCaso[i * 4] = caso()
    aCaso[i * 4 + 1] = caso()
    aCaso[i * 4 + 2] = caso()
    aCaso[i * 4 + 3] = caso()
    aSoglia[i] = caso()
    aR[i] = 0.05 + Math.pow(caso(), 3) * 0.2
  }
  const g = new BufferGeometry()
  g.setAttribute('position', new BufferAttribute(pos, 3))
  g.setAttribute('aCaso', new BufferAttribute(aCaso, 4))
  g.setAttribute('aSoglia', new BufferAttribute(aSoglia, 1))
  g.setAttribute('aR', new BufferAttribute(aR, 1))
  const m = new ShaderMaterial({
    vertexShader: FIUMI_VERT,
    fragmentShader: FIUMI_FRAG,
    uniforms: {
      uCamZ: { value: 0 },
      uPx: { value: 1 },
      uTempo: { value: 0 },
      uDensita: { value: 0 },
      uPesi: { value: [0.25, 0.25, 0.25, 0.25] },
      uCol0: { value: v3(colori.polvere) },
      uCol1: { value: v3(colori.vetro) },
      uCol2: { value: v3(colori.saette) },
      uViola: { value: v3(colori.saetteViola) },
      uCol3: { value: v3(colori.cromo) },
    },
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  })
  const oggetto = new Points(g, m)
  oggetto.frustumCulled = false
  return {
    oggetto,
    aggiorna(camZ, tempo, pesi, densita) {
      m.uniforms.uCamZ.value = camZ
      m.uniforms.uTempo.value = tempo
      m.uniforms.uDensita.value = densita
      m.uniforms.uPesi.value = pesi
      oggetto.visible = densita > 0
    },
    imposta(px) {
      m.uniforms.uPx.value = px
    },
    dispose() {
      g.dispose()
      m.dispose()
    },
  }
}
