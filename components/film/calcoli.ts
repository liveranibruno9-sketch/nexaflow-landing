// Calcoli puri del film (nessun accesso al DOM): si provano con `npm test` (node --test).
// Portato da molino-nuovo/film-calcoli.js. Solo TypeScript "cancellabile" (niente enum,
// niente namespace, niente proprietà nei parametri del costruttore): Node toglie solo i tipi.

const finito = (n: unknown): n is number => typeof n === 'number' && isFinite(n)

export function tra01(n: number): number {
  return finito(n) ? Math.min(1, Math.max(0, n)) : 0
}

/** indice del fotogramma (0..count-1) per un avanzamento da 0 a 1 */
export function frameIndex(progress: number, count: number): number {
  if (!(count > 1)) return 0
  return Math.round(tra01(progress) * (count - 1))
}

/** in quale tratto del film siamo: i (0..n-1) e avanzamento locale (0..1) dentro il tratto */
export function tratto(progress: number, n: number): { i: number; locale: number } {
  if (!(n > 0)) return { i: 0, locale: 0 }
  const p = tra01(progress) * n
  const i = Math.min(n - 1, Math.floor(p))
  return { i, locale: Math.min(1, p - i) }
}

/**
 * con la dissolvenza, il clip occupa la prima parte del tratto e l'ultima parte sfuma nel capitolo dopo;
 * ritorna { clip: avanzamento nel clip 0..1, verso: opacità del capitolo successivo 0..1 }
 */
export function dissolvenza(locale: number, inizio: number): { clip: number; verso: number } {
  const l = tra01(locale)
  if (!(inizio > 0 && inizio < 1)) return { clip: l, verso: 0 }
  if (l <= inizio) return { clip: l / inizio, verso: 0 }
  const t = (l - inizio) / (1 - inizio)
  return { clip: 1, verso: t * t * (3 - 2 * t) }
}

/** il fotogramma pronto più vicino a quello voluto; a pari distanza il precedente; -1 se nessuno */
export function nearestReady(ready: boolean[], wanted: number): number {
  const n = ready.length
  if (!n) return -1
  const w = Math.min(n - 1, Math.max(0, wanted | 0))
  if (ready[w]) return w
  for (let d = 1; d < n; d++) {
    if (w - d >= 0 && ready[w - d]) return w - d
    if (w + d < n && ready[w + d]) return w + d
  }
  return -1
}

/** porzione centrale della sorgente che riempie il riquadro senza deformare (come object-fit: cover) */
export function coverRect(
  srcW: number, srcH: number, boxW: number, boxH: number,
): { sx: number; sy: number; sw: number; sh: number } {
  let sw: number
  let sh: number
  if (srcW / srcH > boxW / boxH) { sh = srcH; sw = srcH * boxW / boxH }
  else { sw = srcW; sh = srcW * boxH / boxW }
  return { sx: (srcW - sw) / 2, sy: (srcH - sh) / 2, sw, sh }
}

/** la sorgente intera, centrata, senza deformare (come object-fit: contain): sul computer il nero si allarga */
export function containRect(
  srcW: number, srcH: number, boxW: number, boxH: number,
): { dx: number; dy: number; dw: number; dh: number } {
  // scala = min(boxW/srcW, boxH/srcH): si calcola per ramo (prima il prodotto, poi la divisione) per non perdere precisione
  let dw: number
  let dh: number
  if (boxW / srcW < boxH / srcH) { dw = boxW; dh = srcH * boxW / srcW }
  else { dh = boxH; dw = srcW * boxH / srcH }
  return { dx: (boxW - dw) / 2, dy: (boxH - dh) / 2, dw, dh }
}

/** un passo di avvicinamento morbido; done quando si è dentro la soglia */
export function approach(
  current: number, target: number, k: number, eps: number,
): { value: number; done: boolean } {
  const v = current + (target - current) * k
  if (Math.abs(target - v) < eps) return { value: target, done: true }
  return { value: v, done: false }
}

/** quali capitoli tenere in memoria: quello attuale, il successivo e il precedente */
export function daTenere(attuale: number, n: number): boolean[] {
  const tieni: boolean[] = []
  for (let k = 0; k < n; k++) tieni.push(Math.abs(k - attuale) <= 1)
  return tieni
}

// --- regia del film unico ---

/** valore lungo una spezzata [[u, v], ...] (u crescente), fuori dagli estremi resta fermo */
export function interpola(tappe: [number, number][], u: number): number {
  if (!tappe || !tappe.length) return 0
  if (!finito(u) || u <= tappe[0][0]) return tappe[0][1]
  for (let i = 1; i < tappe.length; i++) {
    if (u <= tappe[i][0]) {
      const a = tappe[i - 1]
      const b = tappe[i]
      return a[1] + (b[1] - a[1]) * (u - a[0]) / (b[0] - a[0])
    }
  }
  return tappe[tappe.length - 1][1]
}

/** 0 prima di a, 1 dopo b, curva dolce in mezzo; se b non è dopo a è uno scatto */
export function liscio(a: number, b: number, u: number): number {
  if (!(b > a)) return u >= b ? 1 : 0
  const t = tra01((u - a) / (b - a))
  return t * t * (3 - 2 * t)
}

/** opacità di un atto: sale tra w[0] e w[1], scende tra w[2] e w[3] */
export function finestra(u: number, w: [number, number, number, number]): number {
  return liscio(w[0], w[1], u) * (1 - liscio(w[2], w[3], u))
}

/**
 * finestra con rampe di larghezza s: sale tra da e da+s, scende tra a-s e a.
 * Se a - da < 2s le due rampe si incontrano a metà (s si riduce a metà della finestra).
 */
export function sfuma(u: number, da: number, a: number, s = 0.18): number {
  const r = Math.min(s, Math.max(0, (a - da) / 2))
  return finestra(u, [da, da + r, a - r, a])
}

/** 0 fuori da [a, b], dentro sale a 1 a metà e torna a 0: serve a un movimento che finisce dov'è cominciato */
export function respiro(a: number, b: number, u: number): number {
  if (!finito(u) || u <= a || u >= b) return 0
  return Math.sin(Math.PI * (u - a) / (b - a))
}

/** i due fotogrammi tra cui si trova una posizione frazionaria, e quanto pesa il secondo (0..1) */
export function coppia(pos: number, count: number): { a: number; b: number; t: number } {
  if (!(count > 0)) return { a: 0, b: 0, t: 0 }
  const p = finito(pos) ? Math.min(count - 1, Math.max(0, pos)) : 0
  const a = Math.floor(p)
  const b = Math.min(count - 1, a + 1)
  return { a, b, t: b === a ? 0 : p - a }
}

/** davanti e dietro valgono per chi scorre in avanti; senza il secondo numero la finestra è simmetrica */
export function fuoriFinestra(i: number, pos: number, davanti: number, dietro?: number): boolean {
  const d = i - (finito(pos) ? pos : 0)
  return d > davanti || -d > (dietro === undefined ? davanti : dietro)
}

/**
 * il prossimo fotogramma da caricare: il più vicino alla posizione, non ancora richiesto, dentro il raggio.
 * Quelli davanti costano meno di quelli dietro (chi scorre va avanti); -1 se la finestra è già piena
 */
export function prossimoDaCaricare(
  pos: number, richiesto: boolean[], davanti: number, dietro?: number,
): number {
  const n = richiesto.length
  const p = finito(pos) ? pos : 0
  const indietro = dietro === undefined ? davanti : dietro
  const da = Math.max(0, Math.floor(p - indietro))
  const a = Math.min(n - 1, Math.ceil(p + davanti))
  let meglio = -1
  let costoMeglio = Infinity
  for (let i = da; i <= a; i++) {
    if (richiesto[i]) continue
    const costo = i >= p ? i - p : (p - i) * 1.6
    if (costo < costoMeglio) { costoMeglio = costo; meglio = i }
  }
  return meglio
}
