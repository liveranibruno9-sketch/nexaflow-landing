// GLSL del mondo del varco. I colori arrivano agli shader come sRGB diretto, senza la gestione del colore di three.js
// (stessa regola del volo dei dentisti): in pagina si vede esattamente la palette di varco.css / film.css.

/** la lampada: un alone caldo, additivo, fisso nel quadro */
export const ALONE_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
export const ALONE_FRAG = /* glsl */ `
  uniform vec3 uColore;
  uniform float uAlfa;
  varying vec2 vUv;
  void main() {
    float r = length(vUv - 0.5) * 2.0;
    float a = smoothstep(1.0, 0.0, r);
    gl_FragColor = vec4(uColore, a * a * uAlfa);
  }
`

/**
 * I fiumi: un solo Points. Ogni particella sta ferma nel mondo in un cilindro attorno alla rotta; la sua z si ripete ogni
 * 160 unità davanti alla camera (così in ogni momento ce ne sono davanti, e la camera le supera una a una).
 * aCaso = (angolo, raggio, posizione lungo la rotta, materia) tutti 0..1; aSoglia = quando compare (densità).
 */
export const FIUMI_VERT = /* glsl */ `
  attribute vec4 aCaso;
  attribute float aSoglia;
  attribute float aR;
  uniform float uCamZ;
  uniform float uPx;
  uniform float uTempo;
  uniform float uDensita;
  uniform vec4 uPesi;
  varying float vMat;
  varying float vAlfa;
  varying float vSeme;
  void main() {
    float dz = mod(uCamZ - aCaso.z * 160.0, 160.0);
    float ang = aCaso.x * 6.2831853 + uTempo * 0.012 * (aSoglia - 0.5);
    float r = 2.5 + 11.5 * sqrt(aCaso.y);
    vec3 p = vec3(cos(ang) * r, sin(ang) * r, uCamZ - dz);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float d = max(-mv.z, 0.001);
    float presente = step(aSoglia, uDensita);
    gl_PointSize = presente * clamp(aR * uPx / d, 1.2, 14.0);
    gl_Position = projectionMatrix * mv;
    float c0 = uPesi.x;
    float c1 = c0 + uPesi.y;
    float c2 = c1 + uPesi.z;
    vMat = aCaso.w < c0 ? 0.0 : (aCaso.w < c1 ? 1.0 : (aCaso.w < c2 ? 2.0 : 3.0));
    vSeme = aSoglia;
    float battito = 0.72 + 0.28 * sin(uTempo * (0.6 + fract(aSoglia * 7.3) * 1.6) + aSoglia * 6.2831853);
    vAlfa = presente * battito * smoothstep(0.0, 1.5, dz) * (1.0 - smoothstep(120.0, 160.0, dz));
  }
`
export const FIUMI_FRAG = /* glsl */ `
  uniform vec3 uCol0;
  uniform vec3 uCol1;
  uniform vec3 uCol2;
  uniform vec3 uViola;
  uniform vec3 uCol3;
  varying float vMat;
  varying float vAlfa;
  varying float vSeme;
  void main() {
    vec2 q = gl_PointCoord - 0.5;
    float r = length(q) * 2.0;
    float forma;
    vec3 col;
    if (vMat < 0.5) {
      forma = smoothstep(1.0, 0.0, r);                                 // polvere: punto morbido
      col = uCol0;
    } else if (vMat < 1.5) {
      forma = smoothstep(1.0, 0.15, (abs(q.x) + abs(q.y)) * 2.0);      // vetro: scheggia a rombo
      col = uCol1;
    } else if (vMat < 2.5) {
      forma = smoothstep(1.0, 0.0, r) * (0.55 + 0.45 * smoothstep(0.5, 0.0, r));   // saette: punto vivo
      col = mix(uCol2, uViola, step(0.72, fract(vSeme * 13.0)));
    } else {
      forma = smoothstep(1.0, 0.4, r);                                 // cromo: goccia piena
      col = uCol3;
    }
    if (forma <= 0.0) discard;
    gl_FragColor = vec4(col, forma * forma * vAlfa * 0.9);
  }
`
