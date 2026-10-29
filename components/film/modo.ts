// Scelta del modo del film (nessun accesso al DOM): si prova con `npm test`.
// Solo TypeScript "cancellabile" (Node toglie i tipi): niente enum, namespace o parametri-proprietà.

/** pieno = 96 fotogrammi d'apertura, leggero = 64, minimo = 32 (movimento ridotto, poca memoria, risparmio dati) */
export type Modo = 'pieno' | 'leggero' | 'minimo'

export type Dispositivo = {
  ridotto: boolean        // prefers-reduced-motion: reduce
  risparmioDati: boolean  // navigator.connection.saveData
  memoriaGB?: number      // navigator.deviceMemory (non c'è su Safari e Firefox)
  core?: number           // navigator.hardwareConcurrency
  rete?: string           // navigator.connection.effectiveType ('4g', '3g', ...)
  larghezza: number
  verticale: boolean
}

export function scegliModo(i: Dispositivo): { modo: Modo; misura: 720 | 1080; particelle: boolean } {
  if (i.ridotto || i.risparmioDati || (i.memoriaGB ?? 4) < 3 || (i.core ?? 4) < 4) return { modo: 'minimo', misura: 720, particelle: false }
  if (i.verticale || i.larghezza <= 900) return { modo: 'leggero', misura: 720, particelle: true }
  if (!i.rete || i.rete === '4g') return { modo: 'pieno', misura: 1080, particelle: true }
  return { modo: 'leggero', misura: 1080, particelle: true }
}
