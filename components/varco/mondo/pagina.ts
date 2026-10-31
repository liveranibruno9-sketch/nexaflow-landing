// Il mondo di una pagina servizio (DESIGN_SPEC-pagine §8, §9-12): lo stesso studio nero con la lampada calda e i fiumi della materia
// della home, ma con UNA sola mascotte caricata (R12), un film breve (apertura, problema, capacità) e poi lo scroll normale: il
// mondo resta acceso in quiete e la mascotte torna solo dove una sezione le tiene un'àncora (gioco, tappe, invito).
// Non tocca il mondo della home (mondo.ts): riusa i suoi pezzi (fiumi, strati del Kit, mascotte, lampada).
import { AdditiveBlending, Group, Mesh, PerspectiveCamera, PlaneGeometry, Scene, ShaderMaterial, Vector3, WebGLRenderer } from 'three'
import { CONTEGGI } from '../livello.ts'
import { impagina, sosta } from '../impagina.ts'
import { bloccoAl, tempi, zCamera } from '../percorso.ts'
import type { Kit, Regia } from '../kit.ts'
import type { GestoPagina, Livello, Materia, Percorso } from '../tipi.ts'
import { ALTEZZA_CREATURA, ORDINE } from '../coreografia.ts'
import type { Mascotte } from '../coreografia.ts'
import { posaChiSiamo, posaPagina } from '../coreografia-pagina.ts'
import type { Ancora } from '../coreografia-pagina.ts'
import type { Gesto } from '../ossa.ts'
import type { RegiePagina } from '../regie/pagine/comune.ts'
import { creaFiumi, type Colori } from './fiumi.ts'
import { ALONE_FRAG, ALONE_VERT } from './shader.ts'
import { creaStrati } from './strati.ts'
import { caricaMascotte } from './mascotte-glb.ts'
import type { Creatura, Creature } from './creature.ts'

export type ModoPagina = 'quiete' | 'gioco' | 'tappe' | 'invito' | 'servizi'
/** quello che la pagina (il DOM) comunica al mondo a ogni fotogramma */
export type StatoPagina = {
  modo: ModoPagina
  /** il posto della mascotte e (se diverso) quello della scena, dalle sezioni normali */
  ancora: Ancora | null
  ancoraScena: Ancora | null
  /** Chi siamo: il posto di ogni mascotte nella sezione dei servizi */
  ancoreMascotte?: Partial<Record<Mascotte, Ancora | null>>
  /** gioco: indice della scheda scelta e secondi dalla scelta; invito: secondi dall'ingresso della sezione */
  scelta: number
  dallaScelta: number
  dallInvito: number
  /** «Ferma il movimento»: il tempo del mondo non avanza più */
  fermo: boolean
  /** schermate scorse oltre la fine del film */
  dopo: number
}
export type MondoPagina = {
  aggiorna(u: number, dt: number, tempo: number, s: StatoPagina): boolean
  puntatore(x: number, y: number, tipo: 'mouse' | 'touch'): void
  ridimensiona(): void
  fuocoSchermo(): [number, number] | null
  /** il nome sotto i piedi di ogni mascotte: px CSS, quanto si vede */
  piedi(): { id: Mascotte; x: number; y: number; luce: number }[]
  /** un gesto subito (il gioco, l'invito, i servizi di Chi siamo); senza `id` lo fa la mascotte della pagina */
  gesto(g: GestoPagina, id?: Mascotte): void
  impostaLivello(l: Livello): void
  distruggi(): void
}

const FOV = 50
const TAN = Math.tan(((FOV / 2) * Math.PI) / 180)
const LAMPADA = { x: 0.03, y: 0.06, raggio: 0.9, alfa: 0.16 }
/** quanto dura ogni gesto, in secondi */
const DURATA: Record<GestoPagina['nome'], number> = { prendi: 1.0, presenta: 1.25, modella: 1.5, lancia: 1.15, salta: 1.7, solleva: 1.4 }
const QUIETE = 0.35 // la luminosità della scena dopo il film (spec §2)

const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x))
const liscia = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}
const rgb = (hex: string, riserva: number[]): number[] => {
  const h = hex.trim().replace('#', '')
  return h.length === 6 ? [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) : riserva
}
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
const PESI: Record<Materia, [number, number, number, number]> = { polvere: [1, 0, 0, 0], vetro: [0, 1, 0, 0], saette: [0, 0, 1, 0], cromo: [0, 0, 0, 1] }

/** il Kit con i valori smorzati: dopo il film la scena resta accesa al 35% */
function smorzato(k: Kit, g: number): Kit {
  return {
    ...k,
    luce: (id, o, i) => k.luce(id, o, i * g),
    orbita: (id, o, s) => k.orbita(id, o, { ...s, alfa: s.alfa * g }),
    galassia: (id, o, s) => k.galassia(id, o, { ...s, alfa: s.alfa * g }),
    getto: (id, o, t) => k.getto(id, { ...o, n: o.n * g }, t),
  }
}

export function creaMondoPagina(contenitore: HTMLElement, o: { percorso: Percorso; mascotte: Mascotte | 'tutte'; materia: Materia; regie: RegiePagina; livello: Livello; onPerso: () => void }): MondoPagina {
  const { percorso, regie } = o
  const tutte = o.mascotte === 'tutte'
  const ids: Mascotte[] = tutte ? [...ORDINE] : [o.mascotte as Mascotte]
  let livello = o.livello
  const L = percorso.lunghezza
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

  /* la lampada calda in alto a sinistra: identica a quella della home (D21) */
  const geometriaAlone = new PlaneGeometry(1, 1)
  const materialeAlone = new ShaderMaterial({
    vertexShader: ALONE_VERT, fragmentShader: ALONE_FRAG,
    uniforms: { uColore: { value: new Vector3(P.luce[0], P.luce[1], P.luce[2]) }, uAlfa: { value: LAMPADA.alfa } },
    transparent: true, depthWrite: false, blending: AdditiveBlending,
  })
  const lampada = new Mesh(geometriaAlone, materialeAlone)
  lampada.frustumCulled = false
  camera.add(lampada)

  let fiumi = creaFiumi(CONTEGGI[livello].fiumi, P.colori)
  scena.add(fiumi.oggetto)
  let strati = creaStrati(livello, coloriStrati)
  let kit = strati.kit
  let chiuso = false

  const quadro = new Group()
  camera.add(quadro)
  const palco = new Group()
  camera.add(palco)

  /* la mascotte: soltanto la sua, scaricata a pagina ferma */
  const creatureIn: Partial<Record<Mascotte, Creatura>> = {}
  let creature: Creature | null = null
  let richiesta = false
  let compilata = false

  /* misure */
  let larghezza = 1, altezza = 1, dprCorrente = 1, pxUnita = 1
  let imp = impagina(1, 1)
  let dRiposo = 4
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
    dRiposo = sosta(imp, FOV)
    palco.position.set(0, 0, -dRiposo)
    pxUnita = (altezza * dprCorrente) / (2 * TAN)
    creature?.imposta(pxUnita)
    fiumi.imposta(pxUnita)
    strati.imposta(pxUnita)
  }
  ridimensiona()

  /* il posto della scena: segue il film, poi l'àncora della sezione (con la molla) */
  const posto = { cx: imp.cx, cy: imp.cy, h: imp.altezza }
  let postoIniziato = false
  let gain = 1
  const mettiQuadro = () => {
    const mezza = dRiposo * TAN
    quadro.position.set((posto.cx * 2 - 1) * mezza * camera.aspect, (1 - posto.cy * 2) * mezza, -dRiposo)
    quadro.scale.setScalar(posto.h / imp.altezza)
  }

  const mira = { x: 0, y: 0 }, dito = { x: 0, y: 0 }, scarto = { x: 0, y: 0 }
  let ultimoPuntatore = -1e9, manoOn = 0
  let zPrima = zCamera(0), velocita = 0
  const sguardi: Record<string, { x: number; y: number }> = {}
  let t0: number | null = null
  let tMondo = 0
  let pesoAncora = 0
  let pesoMode = 0
  // i gesti: uno solo alla volta; il nuovo riprende dalla posa in corso (la molla delle braccia) e non si accoda
  const gestiIn: Partial<Record<Mascotte, { g: GestoPagina; inizio: number }>> = {}
  const tPrima = new Map<string, number>()
  const vPiede = new Vector3()
  const piedi = ids.map((id) => ({ id, x: 0, y: 0, luce: 0 }))
  // Chi siamo: la lampada cresce fino a diventare il cono di luce sopra Bruno (spec §13)
  const lamp = { ...LAMPADA }
  let fuocoPunto: [number, number] | null = null
  const centroFuoco = new Vector3()

  const avviaGesto = (g: GestoPagina, tempo: number, id: Mascotte = ids[0]) => {
    gestiIn[id] = { g, inizio: tempo }
  }

  const aggiorna = (u: number, dt: number, tempo: number, s: StatoPagina): boolean => {
    const passo = Math.max(dt, 0.001)
    // «Ferma il movimento»: il tempo del mondo non avanza; resta solo ciò che muove lo scroll
    if (!s.fermo) tMondo += dt
    const tm = tMondo
    if (t0 === null) t0 = tm
    const secondi = tm - t0
    const uf = Math.min(u, L)
    const z = zCamera(uf)
    velocita += (Math.abs(z - zPrima) / passo - velocita) * (1 - Math.exp(-passo * 5))
    zPrima = z
    scarto.x += (mira.x - scarto.x) * (1 - Math.exp(-passo * 2.2))
    scarto.y += (mira.y - scarto.y) * (1 - Math.exp(-passo * 2.2))
    camera.position.set(
      0.24 * Math.sin(uf * 0.95) + 0.07 * Math.sin(tm * 0.23) + scarto.x * 0.35,
      0.17 * Math.sin(uf * 0.71 + 1.2) + 0.05 * Math.sin(tm * 0.19 + 1.3) + scarto.y * 0.25,
      z,
    )
    camera.rotation.z = 0.02 * Math.sin(uf * 0.42 + 0.6) + 0.004 * Math.sin(tm * 0.15) + scarto.x * -0.012
    const fov = FOV + clamp(velocita * 0.03, 0, 7)
    if (Math.abs(camera.fov - fov) > 0.02) {
      camera.fov = fov
      camera.updateProjectionMatrix()
    }

    // la lampada
    const d = 10
    const meta = d * Math.tan((camera.fov * Math.PI) / 360)
    const larghezzaQuadro = imp.altezza * (9 / 16) * (2 * meta)
    if (tutte) {
      // la luce calda si rivela una persona: scorrendo cresce, va sopra Bruno (centro-destra sul computer, centro sul telefono) e torna a riposo dopo
      const cresce = liscia(0.9, 2.4, uf) * (1 - liscia(0.1, 0.9, s.dopo))
      lamp.x = LAMPADA.x + ((imp.ritratto ? 0.5 : 0.62) - LAMPADA.x) * cresce
      lamp.y = LAMPADA.y + (-0.02 - LAMPADA.y) * cresce
      lamp.raggio = LAMPADA.raggio + 0.6 * cresce
      materialeAlone.uniforms.uAlfa.value = LAMPADA.alfa + 0.34 * cresce
    }
    const sx = imp.cx + (lamp.x - 0.5) * ((imp.altezza * 9) / 16 / camera.aspect)
    const sy = imp.cy + (lamp.y - 0.5) * imp.altezza
    lampada.position.set((sx * 2 - 1) * meta * camera.aspect, (1 - sy * 2) * meta, -d)
    lampada.scale.set(2 * lamp.raggio * larghezzaQuadro, 2 * lamp.raggio * larghezzaQuadro, 1)

    const dopo = liscia(L - 0.6, L, u)
    fiumi.aggiorna(z, tm, PESI[o.materia], (0.18 + 0.5 * liscia(0.15, 1.6, uf)) * (1 - 0.55 * dopo))
    manoOn += ((tm - ultimoPuntatore < 0.8 ? 1 : 0) - manoOn) * (1 - Math.exp(-passo * 5))

    // le mascotte si scaricano durante l'apertura, a pagina ferma
    if (!richiesta && (secondi > 0.6 || u > 0.3)) {
      richiesta = true
      // Chi siamo le carica tutte e quattro (dopo il primo disegno); le pagine dei servizi soltanto la propria (R12)
      caricaMascotte(renderer, '/film/mascotte', tutte ? undefined : ids)
        .then((c) => {
          if (chiuso) {
            c.dispose()
            return
          }
          creature = c
          for (const id of ids) {
            creatureIn[id] = c[id]
            c[id].radice.visible = false
            palco.add(c[id].radice)
          }
          if (c.luci) palco.add(c.luci)
          c.imposta(pxUnita)
          compilata = false
        })
        .catch((e) => console.error('varco: mascotte 3D non caricata:', e))
    }

    /* ---- chi comanda la scena ---- */
    // il film dura finché il palco è fermo: con `dopo` > 0 le sezioni normali hanno preso il posto (e il mondo resta acceso in quiete)
    const film = s.dopo < 0.02
    const anc = tutte ? (s.ancoreMascotte?.atlas ?? null) : s.ancora
    pesoAncora += ((!film && (anc || (tutte && s.modo === 'servizi')) ? 1 : 0) - pesoAncora) * (1 - Math.exp(-passo * 6))
    const bl = percorso.blocchi[bloccoAl(percorso, uf)]
    const tt = tempi(bl, uf)
    // senza problema (Automazioni v2: apertura + elenco) la mascotte non arretra: si porta al centro dopo l'apertura e resta protagonista
    const problema = percorso.blocchi.find((b) => b.id.endsWith('-p'))
    const r3 = problema?.battute.find((b) => b.ruolo === 'r3')
    const dopoApertura = percorso.blocchi[1]?.da ?? 1
    const schermo = { ritratto: imp.ritratto, aspetto: camera.aspect, basso: !imp.ritratto && altezza < 500 }
    const ingresso = percorso.blocchi.find((b) => b.id.endsWith('-f'))?.battute.find((b) => b.ruolo === 'f3')?.da ?? 2
    const pose = tutte
      ? posaChiSiamo(0, { u, secondi, lunghezza: L, ingresso, schermo, ancora: null, dopo: s.dopo, pesoAncora: 0 })
      : posaPagina({ u, secondi, lunghezza: L, problema: problema?.da ?? dopoApertura, terzaRiga: r3?.da ?? (problema ? 2 : -1), elenco: problema ? undefined : dopoApertura, schermo, ancora: anc, dopo: s.dopo, pesoAncora })

    // dove va la scena: nel film al suo posto; poi, nel gioco e nell'invito, sull'àncora della sezione; altrimenti dietro, in quiete
    const conScena = !film && (s.modo === 'gioco' || s.modo === 'invito') && s.ancoraScena !== null
    const bersaglio = conScena && s.ancoraScena
      ? { cx: s.ancoraScena.x, cy: s.ancoraScena.y, h: s.ancoraScena.altezza }
      : { cx: imp.cx, cy: imp.cy, h: imp.altezza }
    if (!postoIniziato) {
      Object.assign(posto, bersaglio)
      postoIniziato = true
    }
    const k = 1 - Math.exp(-passo * 7)
    posto.cx += (bersaglio.cx - posto.cx) * k
    posto.cy += (bersaglio.cy - posto.cy) * k
    posto.h += (bersaglio.h - posto.h) * k
    mettiQuadro()
    pesoMode += ((film ? 1 : conScena ? 1 : QUIETE) - pesoMode) * (1 - Math.exp(-passo * 5))
    gain = pesoMode

    // il soggetto nel quadro (la mascotte vista dalla scena)
    const wq = (posto.h * 9) / 16 / camera.aspect
    const sogg = tutte ? { x: imp.ritratto ? 0.5 : 0.62, y: imp.ritratto ? 0.34 : 0.4, altezza: 0.3 } : pose
    kit.soggetto.centro = [0.5 + (sogg.x - posto.cx) / wq, 0.5 + (sogg.y - posto.cy) / posto.h]
    kit.soggetto.altezza = sogg.altezza / posto.h

    strati.inizia()
    const ks = film || conScena ? kit : smorzato(kit, QUIETE)
    if (film) {
      const regia: Regia | undefined = regie.film[bl.id]
      regia?.(tt, { locale: 0, composto: 1, forma: 1, foto: [0, 0, 0], uscita: 0 }, ks)
      // all'arrivo la mascotte si compone: un anello di polvere si raccoglie ai suoi piedi
      if (!tutte && u < 0.5 && secondi < 2.2) {
        const e = clamp(secondi / 1.8, 0, 1)
        const c = kit.soggetto.centro
        kit.orbita('nascita', { centro: [c[0], c[1] + 0.1 * kit.soggetto.altezza], raggio: [(0.8 * kit.soggetto.altezza * 4) / 2.25, 0.5 * kit.soggetto.altezza], n: 48, colore: o.materia }, { accese: 48 * e, ordine: e * e, velocita: 1.2, alfa: 0.9 * (1 - liscia(1.6, 2.2, secondi)) })
      }
    } else if (s.modo === 'gioco' && conScena) {
      regie.gioco({ scelta: s.scelta, t: clamp(s.dallaScelta / 1.0, 0, 1) }, kit)
    } else if (s.modo === 'invito' && conScena) {
      regie.invito(clamp(s.dallInvito / 1.4, 0, 1), kit)
    } else if (!tutte) {
      const fine = percorso.blocchi[percorso.blocchi.length - 1]
      regie.film[fine.id]?.(tempi(fine, L + 1), { locale: 1, composto: 1, forma: 1, foto: [0, 0, 0], uscita: 0 }, ks)
    }
    strati.fine(quadro, tm)
    void gain

    /* ---- i gesti: una battuta del film che comincia ne fa partire uno, una sola volta per passaggio ---- */
    const prima0 = ids[0]
    if (film) {
      for (const b of bl.battute) {
        if (!b.gesto) continue
        const tv = tt[b.ruolo] ?? 0
        const prima = tPrima.get(b.ruolo) ?? 0
        if (prima < 0.12 && tv >= 0.12 && (tv < 0.95 || b.gesto.tieni)) avviaGesto(b.gesto, tm, prima0)
        // tornando indietro un gesto «tenuto» (le braccia su) si rilascia
        if (b.gesto.tieni && tv < 0.03 && gestiIn[prima0]?.g === b.gesto) delete gestiIn[prima0]
        tPrima.set(b.ruolo, tv)
      }
    } else if (gestiIn[prima0]?.g.tieni) {
      delete gestiIn[prima0]
    }

    /* ---- le mascotte ---- */
    let inMoto = false
    ids.forEach((id, i) => {
      const c = creatureIn[id]
      if (!c) return
      const p = tutte
        ? posaChiSiamo(i, { u, secondi, lunghezza: L, ingresso, schermo, ancora: s.ancoreMascotte?.[id] ?? null, dopo: s.dopo, pesoAncora: s.modo === 'servizi' && s.ancoreMascotte?.[id] ? 1 : 0 })
        : pose
      const g = gestiIn[id]
      let gesto: Gesto | undefined
      if (g) {
        const tg = (tm - g.inizio) / DURATA[g.g.nome]
        if (tg >= 1 && !g.g.tieni) delete gestiIn[id]
        else gesto = { nome: g.g.nome, t: tg, lato: g.g.lato ?? (p.x > 0.5 ? 'sinistro' : 'destro'), tieni: g.g.tieni }
        inMoto = true
      }
      const metaH = dRiposo * Math.tan((camera.fov * Math.PI) / 360)
      c.radice.visible = p.presenza > 0.001
      if (c.radice.visible) {
        c.radice.position.set((p.x * 2 - 1) * metaH * camera.aspect, (1 - p.y * 2) * metaH, p.z)
        c.radice.scale.setScalar((p.altezza * 2 * metaH) / ALTEZZA_CREATURA)
        c.radice.rotation.set(0, p.giro, p.inclina)
      }
      const sg = (sguardi[id] ??= { x: 0, y: 0 })
      const gx = clamp(dito.x - (p.x * 2 - 1), -1, 1) * manoOn
      const gy = clamp(dito.y - (p.y * 2 - 1), -1, 1) * manoOn
      sg.x += (gx - sg.x) * (1 - Math.exp(-passo * 3))
      sg.y += (gy - sg.y) * (1 - Math.exp(-passo * 3))
      c.aggiorna(tm, { ...p, sguardo: [sg.x, sg.y], gesto })
      const pd = piedi[i]
      if (c.radice.visible) {
        c.radice.updateWorldMatrix(true, false)
        vPiede.set(0, -ALTEZZA_CREATURA / 2 - 0.05, 0)
        c.radice.localToWorld(vPiede)
        vPiede.project(camera)
        pd.x = ((vPiede.x + 1) / 2) * larghezza
        pd.y = ((1 - vPiede.y) / 2) * altezza
        pd.luce = p.presenza * p.presenza
      } else pd.luce = 0
    })
    if (!compilata && creature && velocita < 0.3) {
      compilata = true
      for (const id of ids) {
        const c = creatureIn[id]
        if (!c) continue
        c.radice.visible = true
        c.corpo.visible = true
      }
      renderer.compile(scena, camera)
    }
    fuocoPunto = strati.fuoco()
    renderer.render(scena, camera)
    return velocita > 0.3 || inMoto || (creature !== null && secondi < 3.5)
  }

  const fuocoSchermo = (): [number, number] | null => {
    if (!fuocoPunto) return null
    quadro.updateWorldMatrix(true, false)
    centroFuoco.set((fuocoPunto[0] - 0.5) * 2.25, (0.5 - fuocoPunto[1]) * 4, 0.05)
    quadro.localToWorld(centroFuoco)
    camera.updateMatrixWorld()
    centroFuoco.project(camera)
    return [((centroFuoco.x + 1) / 2) * larghezza, ((1 - centroFuoco.y) / 2) * altezza]
  }

  return {
    aggiorna,
    puntatore: (x, y, tipo) => {
      dito.x = x
      dito.y = y
      if (tipo === 'mouse') {
        mira.x = x
        mira.y = y
      }
      ultimoPuntatore = tMondo
    },
    ridimensiona,
    fuocoSchermo,
    piedi: () => piedi,
    gesto: (g, id) => avviaGesto(g, tMondo, id),
    impostaLivello: (l) => {
      if (l === livello) return
      livello = l
      scena.remove(fiumi.oggetto)
      fiumi.dispose()
      fiumi = creaFiumi(CONTEGGI[livello].fiumi, P.colori)
      scena.add(fiumi.oggetto)
      strati.dispose()
      strati = creaStrati(livello, coloriStrati)
      kit = strati.kit
      ridimensiona()
    },
    distruggi: () => {
      chiuso = true
      renderer.domElement.removeEventListener('webglcontextlost', alPerso)
      creature?.dispose()
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
