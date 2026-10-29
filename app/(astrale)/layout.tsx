import type { Viewport } from 'next'
import SmoothScroll from '@/components/SmoothScroll'
import Cielo from '@/components/cielo/Cielo'

/**
 * Decide PRIMA del primo disegno se questo dispositivo fa il volo 3D.
 * Se si, aggiunge la classe `volo` a <html>; se no, resta la pagina normale.
 * Deciderlo dopo, in React, farebbe saltare tutta la pagina da una
 * disposizione all'altra.
 *
 * Niente volo con: movimento ridotto, risparmio dati, meno di 4 core o di
 * 3 GB di memoria, niente WebGL2, grafica solo software (per esempio i
 * browser senza scheda grafica usati dai test automatici).
 * `?volo=forza` salta i controlli, per provarlo su qualsiasi macchina.
 * `?palette=ciano` o `?palette=bianco` mostra le palette alternative (la base e l aurora).
 */
const SCELTA_VOLO = `(function(){try{
var d=document.documentElement,f=location.search.indexOf('volo=forza')>-1,n=navigator,c=n.connection;
var p=/[?&]palette=(ciano|bianco)/.exec(location.search);if(p)d.setAttribute('data-palette',p[1]);
if(!f){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
if((n.deviceMemory&&n.deviceMemory<3)||(n.hardwareConcurrency&&n.hardwareConcurrency<4)||(c&&c.saveData))return;}
var cv=document.createElement('canvas'),gl=cv.getContext('webgl2');if(!gl)return;
if(!f){var e=gl.getExtension('WEBGL_debug_renderer_info'),r=e?String(gl.getParameter(e.UNMASKED_RENDERER_WEBGL)):'';
if(/swiftshader|llvmpipe|software|basic render/i.test(r))return;}
var l=gl.getExtension('WEBGL_lose_context');if(l)l.loseContext();
d.classList.add('volo');}catch(x){}})();`

export const viewport: Viewport = { themeColor: '#05070F' }

export default function AstraleLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Primo figlio del body: gira prima del disegno del resto, cosi la classe
          `volo` e gia su <html> quando il cielo viene disegnato. */}
      <script dangerouslySetInnerHTML={{ __html: SCELTA_VOLO }} />
      <Cielo />
      <div className="pagina">
        <SmoothScroll>{children}</SmoothScroll>
      </div>
    </>
  )
}
