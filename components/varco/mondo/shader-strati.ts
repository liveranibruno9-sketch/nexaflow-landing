// GLSL del tratto (particelle a tre forme, foto vive) e degli strati vivi del Kit. Stessa regola di shader.ts:
// i colori arrivano come sRGB diretto, senza la gestione del colore di three.js.

/* ---------------------------------------------------------------------------
   Il tratto: un solo gruppo di particelle con tre forme (problema → creatura → beneficio) e le foto vive.
   Le posizioni sono nelle coordinate del QUADRO (0..1 dall'alto a sinistra, z = profondità 0..1) e lo shader le porta sul
   piano del quadro (2,25 x 4 unità). uForma 0..2 sceglie la forma; uComposto 0 sparse → 1 raccolte.
   --------------------------------------------------------------------------- */
export const TRATTO_VERT = /* glsl */ `
  attribute vec3 aPosA;
  attribute vec3 aPosB;
  attribute vec3 aPosC;
  attribute vec3 aColA;
  attribute vec3 aColB;
  attribute vec3 aColC;
  attribute vec4 aCaso;
  uniform float uForma;
  uniform float uComposto;
  uniform float uFoto;
  uniform float uTempo;
  uniform float uPx;
  uniform float uPar;
  uniform float uPunto;
  uniform float uMat;
  uniform float uVerso;
  uniform float uUscita;
  uniform vec3 uMano;
  uniform float uManoOn;
  uniform vec3 uColMat[4];
  uniform vec3 uLuce;
  varying vec3 vCol;
  varying float vAlfa;
  vec3 sulPiano(vec3 p) {
    return vec3((p.x - 0.5) * 2.25, (0.5 - p.y) * 4.0, (p.z - 0.5) * 1.4 * uPar);
  }
  void main() {
    float rit = aCaso.x * 0.35;
    float f = clamp(uForma, 0.0, 2.0);
    float tAB = smoothstep(0.0, 1.0, clamp(clamp(f, 0.0, 1.0) * 1.35 - rit, 0.0, 1.0));
    float tBC = smoothstep(0.0, 1.0, clamp(clamp(f - 1.0, 0.0, 1.0) * 1.35 - rit, 0.0, 1.0));
    vec3 pos = mix(mix(sulPiano(aPosA), sulPiano(aPosB), tAB), sulPiano(aPosC), tBC);
    vec3 col = mix(mix(aColA, aColB, tAB), aColC, tBC);

    // sparse: spirale attorno al centro del quadro, col moto della materia (in uscita, quello della materia dopo)
    float mat = uUscita > 0.5 ? uVerso : uMat;
    float ang = aCaso.y * 6.2831853 + uTempo * (0.12 + 0.3 * aCaso.z) * (mat < 0.5 ? 1.0 : 0.7);
    float r = 0.7 + 3.0 * aCaso.z;
    vec3 sp = vec3(cos(ang) * r * 0.85, sin(ang) * r * 1.35, (aCaso.w - 0.5) * 3.0);
    if (mat > 2.5) {
      sp.y -= mod(uTempo * (0.5 + aCaso.z) + aCaso.w * 6.0, 6.0) - 3.0;            // cromo: gocce che cadono
    } else if (mat > 1.5) {
      sp.xy += 0.14 * vec2(sin(uTempo * 23.0 + aCaso.x * 40.0), cos(uTempo * 19.0 + aCaso.y * 40.0));   // saette: scatti
    } else if (mat > 0.5) {
      sp.x += 0.45 * sin(uTempo * 0.7 + aCaso.y * 20.0);                           // vetro: schegge che scivolano
    }
    float rc = smoothstep(0.0, 1.0, clamp(uComposto * 1.5 - aCaso.w * 0.5, 0.0, 1.0));
    pos = mix(sp, pos, rc);
    vec3 colSparso = uColMat[int(mat + 0.5)] * (0.6 + 0.4 * aCaso.x);
    col = mix(colSparso, col, rc);
    col = mix(col, uColMat[int(uVerso + 0.5)], uUscita);

    // la mano: le particelle vicine si scansano e tornano
    vec2 d = pos.xy - uMano.xy;
    pos.xy += normalize(d + vec2(0.0001)) * smoothstep(0.9, 0.0, length(d)) * 0.55 * uManoOn;

    // velo caldo vicino alla lampada, al massimo l'8%
    float vicino = smoothstep(3.2, 0.0, distance(pos.xy, vec2(-1.06, 1.76))) * 0.08;
    vCol = mix(col, uLuce, vicino);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    float dist = max(-mv.z, 0.001);
    gl_PointSize = clamp(uPx * uPunto * (0.7 + 0.6 * aCaso.x) / dist, 1.0, 14.0);
    gl_Position = projectionMatrix * mv;
    // sopra la foto resta un brillio: alfa x (1 - 0,85 x fotoPiena)
    vAlfa = (0.3 + 0.7 * rc) * (1.0 - 0.85 * uFoto) * smoothstep(0.3, 1.2, dist);
  }
`
export const TRATTO_FRAG = /* glsl */ `
  varying vec3 vCol;
  varying float vAlfa;
  void main() {
    float r = length(gl_PointCoord - 0.5) * 2.0;
    if (r > 1.0) discard;
    float a = smoothstep(1.0, 0.0, r);
    gl_FragColor = vec4(vCol, a * a * vAlfa);
  }
`

/** la foto viva: un piano con la mappa di profondità che sposta i vertici in z; il nero della foto è il nero del mondo */
export const FOTO_VERT = /* glsl */ `
  uniform sampler2D uProf;
  uniform float uPar;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    p.z += (texture2D(uProf, uv).r - 0.5) * 1.4 * uPar;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`
export const FOTO_FRAG = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uOp;
  uniform float uAlto;
  uniform float uBasso;
  uniform float uTel;
  uniform vec2 uRes;
  varying vec2 vUv;
  void main() {
    // il fondo delle foto non è nero puro: si schiaccia il nero (sotto ~4%) perché ai bordi non resti una colonna più chiara
    vec3 c = max(texture2D(uMap, vUv).rgb - 0.04, 0.0) / 0.96;
    float bordo = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
    float m = smoothstep(0.0, 0.2, bordo);
    if (uAlto > 0.0) m *= smoothstep(0.0, uAlto, 1.0 - vUv.y);
    if (uBasso > 0.0) m *= smoothstep(0.0, uBasso, vUv.y);
    if (uTel > 0.5) {
      float dall = 1.0 - gl_FragCoord.y / uRes.y;
      m *= 1.0 - smoothstep(0.56, 0.64, dall);      // sul telefono la frase sta sempre sul nero (dal 56 al 64% dell'altezza)
    }
    gl_FragColor = vec4(c * m * uOp, 1.0);
  }
`

/* ---------------------------------------------------------------------------
   Gli strati vivi del Kit (modo immediato): anelli, getti, orbite, galassia, linee.
   --------------------------------------------------------------------------- */
export const ANELLO_FRAG = /* glsl */ `
  uniform vec3 uColore;
  uniform float uAlfa;
  uniform float uR;
  uniform float uSp;
  varying vec2 vUv;
  void main() {
    float r = length(vUv - 0.5) * 2.0;
    float a = smoothstep(uSp, 0.0, abs(r - uR));
    gl_FragColor = vec4(uColore, a * uAlfa);
  }
`

export const GETTO_VERT = /* glsl */ `
  attribute vec4 aCaso;
  uniform vec3 uDa;
  uniform vec3 uVerso;
  uniform float uCamera;
  uniform float uT;
  uniform float uN;
  uniform float uGrav;
  uniform float uAmp;
  uniform float uPx;
  varying float vAlfa;
  void main() {
    float p = clamp(uT * 1.5 - aCaso.x * 0.5, 0.0, 1.0);
    vec3 dir = uCamera > 0.5 ? vec3(0.0, 0.0, 3.6) : (uVerso - uDa);
    vec3 sp = vec3(aCaso.y - 0.5, aCaso.z - 0.5, 0.0) * (0.25 + 1.6 * uAmp) * (0.3 + p * 2.0);
    vec3 pos = uDa + dir * pow(p, 1.4) + sp * p;
    pos.y -= uGrav * 1.5 * p * p;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    float d = max(-mv.z, 0.001);
    float presente = step(aCaso.w, uN) * step(0.001, p) * step(p, 0.999);
    gl_PointSize = presente * clamp(uPx * (0.03 + 0.05 * aCaso.y) / d, 1.2, 10.0);
    gl_Position = projectionMatrix * mv;
    vAlfa = presente * sin(p * 3.14159265) * smoothstep(0.3, 1.2, d);
  }
`
export const PUNTI_FRAG = /* glsl */ `
  uniform vec3 uColore;
  varying float vAlfa;
  void main() {
    float r = length(gl_PointCoord - 0.5) * 2.0;
    if (r > 1.0) discard;
    float a = smoothstep(1.0, 0.0, r);
    gl_FragColor = vec4(uColore, a * a * vAlfa);
  }
`

export const ORBITA_VERT = /* glsl */ `
  attribute float aK;
  attribute vec3 aCaso;
  uniform vec3 uCentro;
  uniform vec2 uRaggio;
  uniform float uN;
  uniform float uAccese;
  uniform float uOrdine;
  uniform float uVel;
  uniform float uAlfa;
  uniform float uTempo;
  uniform float uPx;
  varying float vAlfa;
  varying float vLit;
  void main() {
    float k = floor(aK * 64.0 + 0.5);
    float ang = (k / max(uN, 1.0)) * 6.2831853 + uTempo * uVel * 0.35 + (1.0 - uOrdine) * (aCaso.x - 0.5) * 3.1415927;
    float rr = 1.0 + (1.0 - uOrdine) * (aCaso.y - 0.5) * 0.9;
    vec3 pos = uCentro + vec3(cos(ang) * uRaggio.x * rr, sin(ang) * uRaggio.y * rr, (1.0 - uOrdine) * (aCaso.z - 0.5) * 0.8);
    float lit = clamp(uAccese - k, 0.0, 1.0);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    float d = max(-mv.z, 0.001);
    float presente = step(k + 0.5, uN);
    gl_PointSize = presente * clamp(uPx * mix(0.05, 0.11, lit) / d, 1.6, 16.0);
    gl_Position = projectionMatrix * mv;
    vLit = lit;
    vAlfa = presente * uAlfa * mix(0.3, 1.0, lit) * smoothstep(0.3, 1.2, d);
  }
`
export const ORBITA_FRAG = /* glsl */ `
  uniform vec3 uColore;
  uniform vec3 uSpento;
  varying float vAlfa;
  varying float vLit;
  void main() {
    float r = length(gl_PointCoord - 0.5) * 2.0;
    if (r > 1.0) discard;
    float a = smoothstep(1.0, 0.0, r);
    float nucleo = smoothstep(0.35, 0.0, r);
    vec3 c = mix(mix(uSpento, uColore, vLit), vec3(1.0), nucleo * vLit * 0.6);
    gl_FragColor = vec4(c, (a * a * 0.8 + nucleo * 0.4) * vAlfa);
  }
`

export const GALASSIA_VERT = /* glsl */ `
  attribute vec4 aCaso;
  uniform vec3 uCentro;
  uniform float uRaggio;
  uniform float uBracci;
  uniform float uGiro;
  uniform float uAlfa;
  uniform float uTempo;
  uniform float uPx;
  varying float vAlfa;
  varying float vNucleo;
  void main() {
    float r = pow(aCaso.x, 0.8);
    float braccio = floor(aCaso.w * uBracci);
    float ang = braccio / uBracci * 6.2831853 + r * 9.5 + (aCaso.z - 0.5) * 0.6 * (1.1 - r * 0.6);
    ang += (uGiro + uTempo * 0.05) * (1.0 / (0.3 + r));
    vec3 pos = uCentro + vec3(cos(ang) * r * uRaggio, sin(ang) * r * uRaggio * 0.95, (aCaso.y - 0.5) * 0.18);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    float d = max(-mv.z, 0.001);
    vNucleo = smoothstep(0.35, 0.0, r);
    gl_PointSize = clamp(uPx * (0.02 + 0.04 * aCaso.y + 0.05 * vNucleo) / d, 1.2, 9.0);
    gl_Position = projectionMatrix * mv;
    vAlfa = uAlfa * smoothstep(0.3, 1.2, d) * (0.45 + 0.55 * (1.0 - r));
  }
`
export const GALASSIA_FRAG = /* glsl */ `
  uniform vec3 uColore;
  varying float vAlfa;
  varying float vNucleo;
  void main() {
    float r = length(gl_PointCoord - 0.5) * 2.0;
    if (r > 1.0) discard;
    float a = smoothstep(1.0, 0.0, r);
    vec3 c = mix(uColore, vec3(0.9, 0.95, 1.0), vNucleo);
    gl_FragColor = vec4(c, a * a * vAlfa);
  }
`

export const LINEA_VERT = /* glsl */ `
  attribute float aS;
  attribute float aTipo;
  attribute vec2 aCaso;
  uniform vec2 uP[16];
  uniform float uCum[16];
  uniform int uNP;
  uniform float uT;
  uniform float uTempo;
  uniform float uPx;
  uniform float uGocce;
  uniform float uSegni;
  uniform float uSp;
  varying float vAlfa;
  vec2 sul(float s) {
    for (int i = 0; i < 15; i++) {
      if (i + 1 >= uNP) break;
      float s1 = uCum[i + 1];
      if (s <= s1 || i + 2 >= uNP) {
        float k = clamp((s - uCum[i]) / max(s1 - uCum[i], 0.00001), 0.0, 1.0);
        return mix(uP[i], uP[i + 1], k);
      }
    }
    return uP[uNP - 1];
  }
  void main() {
    vec2 p2;
    float vis;
    float dim;
    if (aTipo < 0.5) {
      p2 = sul(aS) + (aCaso - 0.5) * 0.012 * uSp;
      vis = step(aS, uT);
      dim = 2.0 + aCaso.x * 1.5;
    } else if (aTipo < 1.5) {
      float s = fract(aS + uTempo * 0.25) * uT;
      p2 = sul(s);
      vis = step(0.5 + aCaso.x * 0.5, uGocce) * step(0.001, uT);
      dim = 4.5;
    } else {
      int k = int(aS * 15.0 + 0.5);
      p2 = uP[k];
      vis = uSegni * step(float(k + 1), float(uNP)) * step(uCum[k], uT + 0.0001);
      dim = 6.5;
    }
    vec4 mv = modelViewMatrix * vec4(p2, 0.04, 1.0);
    float d = max(-mv.z, 0.001);
    gl_PointSize = vis * clamp(uPx * 0.012 * dim / d, 1.2, 12.0);
    gl_Position = projectionMatrix * mv;
    vAlfa = vis * smoothstep(0.3, 1.2, d) * (aTipo > 0.5 ? 1.0 : 0.75);
  }
`
