// Il mondo del varco: renderer, camera, ciclo, quadro, tratti, regie (piano-costruzione-v2, compiti 4-6).
// Lo scheletro è quello del volo dei dentisti (components/volo/scena.ts, non si tocca): una posizione `u` in schermate
// letta da testo e scena, camera a velocità costante, le cose vengono incontro.
import { AdditiveBlending, Group, Mesh, PerspectiveCamera, PlaneGeometry, Scene, ShaderMaterial, Vector3, WebGLRenderer } from 'three'
import { CONTEGGI } from '../livello.ts'
import { impagina, sosta } from '../impagina.ts'
import { VELOCITA, bloccoAl, conSoggetto, fasiBlocco, pesiMateria, profiloDistanza, tempi, trattiDaTenere, zAl, zCamera } from '../percorso.ts'
import type { Curva } from '../percorso.ts'
import type { Kit, Regia } from '../kit.ts'
import type { Blocco, Livello, Materia, Percorso } from '../tipi.ts'
import { creaFiumi, type Colori, type Fiumi } from './fiumi.ts'
import { ALONE_FRAG, ALONE_VERT } from './shader.ts'
import { creaStrati, type Strati } from './strati.ts'
import { creaScaglie, type Scaglie } from './scaglie.ts'
import { creaCreature, type Creature } from './creature.ts'
import { caricaMascotte } from './mascotte-glb.ts'
import { ALTEZZA_CREATURA, ORDINE, coreografia, ribalta } from '../coreografia.ts'
import { creaTratto, type Tratto } from './tratto.ts'

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
  /** D49: i piedi di ogni mascotte sullo schermo (px CSS), quanto è grande rispetto alla sua posa nel servizio, quanto si vede */
  piediMascotte(): { id: string; x: number; y: number; scala: number; luce: number }[]
  /** il vortice di scaglie dell'apertura è in scena: il puntino e il poster possono sparire */
  anelloPronto(): boolean
  /** il vortice non si è potuto creare: torna il poster */
  anelloFallito(): boolean
  impostaLivello(l: Livello): void
  distruggi(): void
}

const FOV = 50
const TAN = Math.tan(((FOV / 2) * Math.PI) / 180)
/** la lampada: punto del quadro (da sinistra e dall'alto) e raggio in larghezze del quadro; alfa 0,16 (storyboard 5.2) */
const LAMPADA = { x: 0.03, y: 0.06, raggio: 0.9, alfa: 0.16 }
/** quanto il quadro scivola di lato in uscita 'accanto', in larghezze del quadro (2,25 unità) */
const SCIVOLA = 1.2 * 2.25

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

type Voce = { blocco: Blocco; indice: number; tratto: Tratto | null }

export function creaMondo(contenitore: HTMLElement, o: { percorso: Percorso; livello: Livello; regie: Partial<Record<string, Regia>>; onPerso: () => void }): Mondo {
  const { percorso, regie } = o
  let livello = o.livello
  const P = leggiPalette(contenitore)
  const coloriStrati = { polvere: P.colori.polvere, vetro: P.colori.vetro, saette: P.colori.saette, cromo: P.colori.cromo, luce: P.luce }

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

  // la densità dei fiumi: 0 fino all'ultima frase della soglia, poi sale fino all'inizio del primo soggetto
  const soglia = percorso.blocchi.find((b) => b.tipo === 'soglia')
  const soggetti = percorso.blocchi.filter(conSoggetto)
  const primoTratto = soggetti[0]
  const ultimaSoglia = soglia?.battute.length ? soglia.battute[soglia.battute.length - 1].da : undefined
  const daDensita = ultimaSoglia ?? (primoTratto ? primoTratto.da - 1 : Infinity)
  const aDensita = primoTratto ? primoTratto.da : daDensita + 1
  const densita = (u: number) => liscia(daDensita, aDensita, u)

  /* ----- gli strati vivi del Kit e i tratti (uno solo in memoria, più il successivo in preparazione) ----- */
  let strati: Strati = creaStrati(livello, coloriStrati)
  let kit: Kit = strati.kit
  let chiuso = false

  // il quadro virtuale: dove stanno gli strati dei blocchi senza tratto (apertura, soglia, finale), fisso nella vista come un quadro a riposo
  const quadroVirtuale = new Group()
  camera.add(quadroVirtuale)
  // lo stesso quadro ma al centro dello schermo: la squadra si riunisce lì, su ogni schermo (home v2.1)
  const quadroCentro = new Group()
  camera.add(quadroCentro)

  // D47: l'apertura è un vortice di scaglie di roccia stellare (scaglie.ts) che compone il nome e poi si apre in quattro correnti;
  // l'anello di particelle (anello.ts) non si usa più
  let scaglie: Scaglie | null = null
  let scaglieFallite = false
  if (percorso.blocchi[0]?.tipo === 'apertura') {
    try {
      const largo = contenitore.clientWidth || window.innerWidth
      scaglie = creaScaglie(renderer, livello === 'minimo' ? 700 : largo > 900 ? 1800 : 1100)
      camera.add(scaglie.gruppo)
    } catch (e) {
      scaglieFallite = true
      console.error('varco: vortice non creato:', e)
    }
  } else {
    scaglieFallite = true
  }
  // le lettere del nome nel DOM: le scaglie ci volano dentro (si rimisurano quando cambia lo schermo)
  const misuraLettere = () => {
    const lettere = Array.from(document.querySelectorAll<HTMLElement>('.nome-apertura .lettera-nome'))
    scaglie?.bersagli(lettere, contenitore.clientWidth || window.innerWidth, contenitore.clientHeight || window.innerHeight).catch((e) => console.error('varco: lettere del nome non misurate:', e))
  }
  misuraLettere()

  // le quattro mascotte (home v2.2: modelli 3D dalle foto; in codice se non arrivano): un palco figlio della camera, alla distanza
  // del quadro a riposo; la coreografia
  // dice dove sta ognuna. Solo se il percorso ha i blocchi delle mascotte con i loro nomi.
  const palco = new Group()
  camera.add(palco)
  const conMascotte = percorso.blocchi.some((b) => b.tipo === 'mascotte' && (ORDINE as readonly string[]).includes(b.id))
  let creature: Creature | null = null
  let creatureChieste = !conMascotte
  let creatureCompilate = true
  const mettiInScena = (c: Creature) => {
    if (chiuso) {
      c.dispose()
      return
    }
    creature = c
    for (const id of ORDINE) {
      palco.add(c[id].radice)
      c[id].radice.visible = false
    }
    if (c.luci) palco.add(c.luci)
    c.imposta(pxUnita)
    creatureCompilate = false
  }
  let scorre = 0
  const sguardi = ORDINE.map(() => ({ x: 0, y: 0 }))
  const piedi = ORDINE.map((id) => ({ id, x: 0, y: 0, scala: 1, luce: 0 }))
  const vPiede = new Vector3()
  const tratti = new Map<string, Voce>()

  const gestisciTratti = (u: number) => {
    // le mascotte non hanno più il tratto di particelle e foto: sono le creature in codice
    const ids = trattiDaTenere(percorso, u).filter((id) => percorso.blocchi.find((b) => b.id === id)?.tipo === 'tratto')
    for (const id of ids) {
      if (tratti.has(id)) continue
      const indice = percorso.blocchi.findIndex((b) => b.id === id)
      const voce: Voce = { blocco: percorso.blocchi[indice], indice, tratto: null }
      tratti.set(id, voce)
      creaTratto({ blocco: voce.blocco, indice, livello, misura: larghezza > 900 ? 1080 : 720, colori: { ...P.colori, luce: P.luce } })
        .then((t) => {
          if (tratti.get(id) !== voce) {
            t.dispose()
            return
          }
          voce.tratto = t
          t.schermo(larghezza * dprCorrente, altezza * dprCorrente, imp.ritratto, pxUnita)
          scena.add(t.quadro)
        })
        .catch((e) => {
          // un'immagine che non arriva: il tratto resta senza forme, ma fiumi e testi continuano (mai uno schermo nero)
          console.error('varco: tratto', id, 'non creato:', e)
        })
    }
    for (const [id, v] of Array.from(tratti)) {
      if (ids.includes(id)) continue
      v.tratto?.dispose()
      tratti.delete(id)
    }
  }

  /* ----- misure ----- */
  let larghezza = 1
  let altezza = 1
  let dprCorrente = 1
  let pxUnita = 1
  let imp = impagina(1, 1)
  // un profilo di distanza per ogni lunghezza di blocco (il tratto completo dura 5,5 schermate, una mascotte 3,2)
  let sostaCorrente = 4
  const profili = new Map<number, Curva>()
  const profiloPer = (L: number) => {
    let c = profili.get(L)
    if (!c) {
      c = profiloDistanza(sostaCorrente, L)
      profili.set(L, c)
    }
    return c
  }
  const ridimensiona = () => {
    larghezza = Math.max(1, contenitore.clientWidth || window.innerWidth)
    altezza = Math.max(1, contenitore.clientHeight || window.innerHeight)
    dprCorrente = Math.min(window.devicePixelRatio || 1, CONTEGGI[livello].dpr)
    renderer.setPixelRatio(dprCorrente)
    renderer.setSize(larghezza, altezza, false)
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    camera.aspect = larghezza / altezza
    camera.updateProjectionMatrix()
    imp = impagina(larghezza / altezza, altezza)
    sostaCorrente = sosta(imp, FOV)
    profili.clear()
    const dRiposo = sosta(imp, FOV)
    const mezza = dRiposo * TAN
    quadroVirtuale.position.set((imp.cx * 2 - 1) * mezza * camera.aspect, (1 - imp.cy * 2) * mezza, -dRiposo)
    quadroCentro.position.set(0, 0, -dRiposo)
    palco.position.set(0, 0, -dRiposo)
    pxUnita = (altezza * dprCorrente) / (2 * TAN)
    creature?.imposta(pxUnita)
    if (typeof misuraLettere === 'function') misuraLettere()
    fiumi.imposta(pxUnita)
    strati.imposta(pxUnita)
    for (const v of Array.from(tratti.values())) v.tratto?.schermo(larghezza * dprCorrente, altezza * dprCorrente, imp.ritratto, pxUnita)
  }
  ridimensiona()

  /* ----- il puntatore sposta appena l'inquadratura e, sul quadro, la mano scansa le particelle vicine ----- */
  const mira = { x: 0, y: 0 }
  const dito = { x: 0, y: 0 }
  const scarto = { x: 0, y: 0 }
  let ultimoPuntatore = -1e9
  let manoOn = 0
  const mano = new Vector3()
  let zPrima = zCamera(0)
  let velocita = 0
  const centroFuoco = new Vector3()
  let quadroDelBlocco: Tratto['quadro'] | null = null
  let quadroAttivo: Group | null = null

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

    /* ----- i tratti: creati quando il browser è libero, tenuti al massimo in due, il quadro viene incontro alla camera ----- */
    gestisciTratti(u)
    manoOn += ((tempo - ultimoPuntatore < 0.8 ? 1 : 0) - manoOn) * (1 - Math.exp(-passo * 5)) // ritorno in circa 600 ms
    const indiceBlocco = bloccoAl(percorso, u)
    const bloccoCorrente = percorso.blocchi[indiceBlocco]
    quadroDelBlocco = null
    for (const v of Array.from(tratti.values())) {
      const t = v.tratto
      if (!t) continue
      const bl = v.blocco
      const rel = u - bl.da
      const profilo = profiloPer(bl.a - bl.da)
      // prima del suo tratto il quadro aspetta fermo nel mondo (come le costellazioni del volo); poi segue il profilo
      const D = rel < -0.5 ? zAl(profilo, -0.5) + VELOCITA * (-0.5 - rel) : zAl(profilo, rel)
      const visibile = u > bl.da - 0.7 && u < bl.a + 0.2 && D > 0.1
      t.quadro.visible = visibile
      if (!visibile) continue
      const halfH = D * TAN
      const f = fasiBlocco(bl, u)
      const accanto = bl.uscita === 'accanto' ? SCIVOLA * liscia(0, 1, f.uscita) : 0
      t.quadro.position.set((imp.cx * 2 - 1) * halfH * camera.aspect + accanto, (1 - imp.cy * 2) * halfH, z - D)
      // il puntatore sul piano del quadro, per la mano
      mano.set(dito.x * halfH * camera.aspect - t.quadro.position.x, -dito.y * halfH - t.quadro.position.y, 0)
      const prossimo = percorso.blocchi[v.indice + 1]
      const verso = bl.tipo === 'tratto' && f.uscita > 0 && prossimo?.tipo === 'tratto' && prossimo.materia ? prossimo.materia : null
      const attuale = v.blocco.id === bloccoCorrente.id
      t.aggiorna(f, tempo, mano, manoOn, verso, attuale ? strati.esposizione() : [1, 1, 1])
      if (attuale) quadroDelBlocco = t.quadro
    }

    // la regia del blocco corrente comanda gli strati vivi; senza regia o senza quadro non si vede nulla
    strati.inizia()
    const regia = regie[bloccoCorrente.id]
    const senzaTratto = bloccoCorrente.tipo !== 'tratto'
    quadroAttivo = quadroDelBlocco ?? (regia && senzaTratto ? (bloccoCorrente.tipo === 'squadra' ? quadroCentro : quadroVirtuale) : null)
    if (regia && quadroAttivo) regia(tempi(bloccoCorrente, u), fasiBlocco(bloccoCorrente, u), kit)
    strati.fine(quadroAttivo, tempo)

    // il vortice: grande, al centro del cerchio dell'apertura; da fermo gira con forza, scorrendo appena meno
    if (scaglie) {
      scaglie.posa({ cx: 0.5, cy: imp.ritratto ? 0.4 : 0.5, raggio: imp.ritratto ? 0.47 * camera.aspect : 0.44, aspetto: camera.aspect, fov: camera.fov })
      scaglie.aggiorna(u, tempo, passo, 1 - 0.25 * liscia(0, 0.5, u))
    }

    // le mascotte: i modelli si scaricano durante l'apertura; la coreografia dice dove stanno; mentre si scorre salutano
    if (!creatureChieste && (tempo > 2.5 || u > 0.6)) {
      creatureChieste = true
      caricaMascotte(renderer)
        .then(mettiInScena)
        .catch((e) => {
          console.error('varco: mascotte 3D non caricate, restano quelle in codice:', e)
          mettiInScena(creaCreature())
        })
    }
    const cr: Creature | null = creature
    if (cr) {
      const bersaglio = clamp(velocita / 45, 0, 1)
      scorre += (bersaglio - scorre) * (1 - Math.exp(-passo * (bersaglio > scorre ? 5 : 1.2)))
      const pose = coreografia(percorso, u, tempo, { ritratto: imp.ritratto, aspetto: camera.aspect, basso: !imp.ritratto && altezza < 500 }, scorre)
      const metaH = sostaCorrente * Math.tan((camera.fov * Math.PI) / 360)
      ORDINE.forEach((id, i) => {
        const c = cr[id]
        const p = pose[id]
        const sguardo = sguardi[i]
        c.radice.visible = p.presenza > 0.001
        if (c.radice.visible) {
          c.radice.position.set((p.x * 2 - 1) * metaH * camera.aspect, (1 - p.y * 2) * metaH, p.z)
          c.radice.scale.setScalar((p.altezza * 2 * metaH) / ALTEZZA_CREATURA)
          c.radice.rotation.set(0, p.giro, p.inclina)
        }
        // lo sguardo: verso il puntatore quando si muove, altrimenti verso chi guarda
        const gx = clamp(dito.x - (p.x * 2 - 1), -1, 1) * manoOn
        const gy = clamp(dito.y - (p.y * 2 - 1), -1, 1) * manoOn
        sguardo.x += (gx - sguardo.x) * (1 - Math.exp(-passo * 3))
        sguardo.y += (gy - sguardo.y) * (1 - Math.exp(-passo * 3))
        c.aggiorna(tempo, { ...p, sguardo: [sguardo.x, sguardo.y] })
        // il nome sta sotto i piedi: si proietta il punto dei piedi (base del modello) sullo schermo
        const pd = piedi[i]
        if (c.radice.visible) {
          c.radice.updateWorldMatrix(true, false)
          vPiede.set(0, -ALTEZZA_CREATURA / 2 - 0.05, 0)
          c.radice.localToWorld(vPiede)
          vPiede.project(camera)
          pd.x = ((vPiede.x + 1) / 2) * larghezza
          pd.y = ((1 - vPiede.y) / 2) * altezza
          const r = ribalta({ ritratto: imp.ritratto, aspetto: camera.aspect, basso: !imp.ritratto && altezza < 500 })
          pd.scala = Math.min(1, Math.max(0.7, Math.sqrt(p.altezza / r.altezza)))
          // chi sta dietro nella giostra ha il nome più tenue
          pd.luce = p.presenza * (0.35 + 0.65 * Math.min(1, Math.max(0, (p.z + 0.6) / 1.2)))
        } else pd.luce = 0
      })
      // i programmi delle creature si preparano a pagina ferma, prima che servano (niente scatto quando compaiono)
      if (!creatureCompilate && velocita < 0.3) {
        creatureCompilate = true
        for (const id of ORDINE) {
          cr[id].radice.visible = true
          cr[id].corpo.visible = true
        }
        renderer.compile(scena, camera)
        for (const id of ORDINE) cr[id].radice.visible = pose[id].presenza > 0.001
      }
    }

    renderer.render(scena, camera)
    return velocita > 0.3
  }

  const fuocoSchermo = (): [number, number] | null => {
    const p = strati.fuoco()
    if (!p || !quadroAttivo) return null
    quadroAttivo.updateWorldMatrix(true, false)
    centroFuoco.set((p[0] - 0.5) * 2.25, (0.5 - p[1]) * 4, 0.05)
    quadroAttivo.localToWorld(centroFuoco)
    camera.updateMatrixWorld()
    centroFuoco.project(camera)
    return [((centroFuoco.x + 1) / 2) * larghezza, ((1 - centroFuoco.y) / 2) * altezza]
  }

  const liberaTratti = () => {
    for (const v of Array.from(tratti.values())) v.tratto?.dispose()
    tratti.clear()
  }

  return {
    aggiorna,
    puntatore: (x, y, tipo) => {
      // la mano segue mouse e dito; l'inquadratura della camera solo il mouse (un dito che si ferma non la sposta per sempre)
      dito.x = x
      dito.y = y
      if (tipo === 'mouse') {
        mira.x = x
        mira.y = y
      }
      ultimoPuntatore = performance.now() / 1000
    },
    ridimensiona,
    fuocoSchermo,
    arcoInAlto: () => null,
    anelloPronto: () => scaglie !== null,
    anelloFallito: () => scaglieFallite,
    piediMascotte: () => piedi,
    impostaLivello: (l) => {
      if (l === livello) return
      livello = l
      scena.remove(fiumi.oggetto)
      fiumi.dispose()
      fiumi = creaFiumi(CONTEGGI[livello].fiumi, P.colori)
      scena.add(fiumi.oggetto)
      // i tratti si ricreano da soli al prossimo fotogramma, con i conteggi del nuovo livello
      liberaTratti()
      strati.dispose()
      strati = creaStrati(livello, coloriStrati)
      kit = strati.kit
      ridimensiona()
    },
    distruggi: () => {
      chiuso = true
      renderer.domElement.removeEventListener('webglcontextlost', alPerso)
      scaglie?.dispose()
      creature?.dispose()
      liberaTratti()
      strati.dispose()
      scena.remove(fiumi.oggetto)
      fiumi.dispose()
      geometriaAlone.dispose()
      materialeAlone.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    },
  }
}
