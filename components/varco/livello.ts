// Livelli di peso del varco (nessun accesso al DOM): si provano con `npm test`.
// Solo TypeScript "cancellabile" (Node toglie i tipi): niente enum, namespace o parametri-proprietà.
import type { Livello } from './tipi.ts'

/** i vincoli globali del piano: quanti punti per tratto, fiumi, getti, e se ci sono parallasse e aloni; dpr = risoluzione massima */
export const CONTEGGI: Record<Livello, { punti: number; fiumi: number; getti: number; parallasse: boolean; aloni: boolean; dpr: number }> = {
  alto: { punti: 36000, fiumi: 12000, getti: 1200, parallasse: true, aloni: true, dpr: 2 },
  medio: { punti: 12000, fiumi: 4000, getti: 500, parallasse: true, aloni: false, dpr: 1.5 },
  minimo: { punti: 6000, fiumi: 1500, getti: 200, parallasse: false, aloni: false, dpr: 1 },
}

const GIU: Record<Livello, Livello> = { alto: 'medio', medio: 'minimo', minimo: 'minimo' }

/** il livello di partenza: telefono (o finestra stretta) → medio, computer → alto */
export function livelloIniziale(d: { ritratto: boolean; larghezza: number }): Livello {
  return d.ritratto || d.larghezza <= 900 ? 'medio' : 'alto'
}

/**
 * Dopo la misura dei tempi di fotogramma (ms): con almeno 120 valori e una mediana sopra i 28 ms scende di un gradino
 * (la mediana non si lascia ingannare da qualche scatto isolato); 'minimo' resta dov'è.
 */
export function livelloDopoMisura(l: Livello, msFotogrammi: number[]): Livello {
  if (msFotogrammi.length < 120) return l
  const ordinati = [...msFotogrammi].sort((a, b) => a - b)
  const mediana = ordinati[Math.floor(ordinati.length / 2)]
  return mediana > 28 ? GIU[l] : l
}

/**
 * Decide PRIMA del primo disegno se questo dispositivo fa il varco (stessa logica di SCELTA_VOLO dei dentisti).
 * Se sì aggiunge la classe `varco` a <html>; se no resta la pagina normale: deciderlo dopo, in React, farebbe
 * saltare tutta la pagina da una disposizione all'altra. Niente varco con: movimento ridotto, risparmio dati,
 * meno di 4 core o di 3 GB di memoria, niente WebGL2, grafica solo software (i browser senza scheda grafica
 * usati dai test automatici). `?varco=forza` salta i controlli, per provarlo su qualsiasi macchina.
 */
export const SCELTA_VARCO = `(function(){try{
var d=document.documentElement,f=location.search.indexOf('varco=forza')>-1,n=navigator,c=n.connection;
if(!f){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
if((n.deviceMemory&&n.deviceMemory<3)||(n.hardwareConcurrency&&n.hardwareConcurrency<4)||(c&&c.saveData))return;}
var cv=document.createElement('canvas'),gl=cv.getContext('webgl2');if(!gl)return;
if(!f){var e=gl.getExtension('WEBGL_debug_renderer_info'),r=e?String(gl.getParameter(e.UNMASKED_RENDERER_WEBGL)):'';
if(/swiftshader|llvmpipe|software|basic render/i.test(r))return;}
var l=gl.getExtension('WEBGL_lose_context');if(l)l.loseContext();
d.classList.add('varco');}catch(x){}})();`
