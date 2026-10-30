// GLSL delle mascotte in codice (home v2.1). Colori in sRGB diretto come il resto del mondo (shader.ts).
// Una sola pelle per le quattro materie, scelta da uTipo: 0 polvere di stelle, 1 vetro, 2 saette, 3 cromo.

export const PELLE_VERT = /* glsl */ `
  varying vec3 vN;
  varying vec3 vV;
  varying vec3 vL;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    vL = position;
    gl_Position = projectionMatrix * mv;
  }
`

export const PELLE_FRAG = /* glsl */ `
  uniform vec3 uBase;
  uniform vec3 uChiaro;
  uniform vec3 uBordo;
  uniform vec3 uScintille;
  uniform float uTipo;
  uniform float uTempo;
  varying vec3 vN;
  varying vec3 vV;
  varying vec3 vL;
  float caso(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  void main() {
    vec3 n = normalize(vN);
    vec3 v = normalize(vV);
    float nv = clamp(dot(n, v), 0.0, 1.0);
    float bordo = pow(1.0 - nv, 2.4);
    vec3 L = normalize(vec3(-0.45, 0.75, 0.55));
    float luce = 0.42 + 0.58 * max(dot(n, L), 0.0);
    float lucido = pow(max(dot(n, normalize(L + v)), 0.0), 48.0);
    float sotto = max(-n.y, 0.0);
    vec3 c;
    if (uTipo < 0.5) {
      // polvere di stelle: velluto blu, granelli che si accendono e si spengono
      c = mix(uBase, uChiaro, luce * luce);
      float h = caso(floor(vL * 30.0));
      float brilla = step(0.9, h) * pow(0.5 + 0.5 * sin(uTempo * (1.5 + 4.0 * h) + h * 40.0), 4.0);
      c += uScintille * brilla * 1.1 + uBordo * bordo * 1.2 + uChiaro * sotto * 0.12;
    } else if (uTipo < 1.5) {
      // vetro: dentro scuro e limpido, bordi accesi, riflessi che scorrono
      vec3 dentro = mix(uBase * 0.5, uChiaro * 0.75, pow(nv, 1.6) * luce);
      float banda = smoothstep(0.82, 1.0, sin(vL.y * 7.0 + vL.x * 3.0 + uTempo * 0.7));
      c = dentro + uChiaro * banda * 0.22 + uBordo * bordo * 1.7 + vec3(1.0) * lucido * 1.3;
    } else if (uTipo < 2.5) {
      // saette: viola che diventa bianco, vene di luce che corrono e tremano
      c = mix(uBase, uChiaro, luce * 0.85);
      float vena = abs(sin(vL.x * 9.0 + sin(vL.y * 8.0 + uTempo * 2.6) * 1.8 + sin(vL.z * 11.0 - uTempo * 1.9)));
      float lampo = smoothstep(0.09, 0.0, vena) * (0.55 + 0.45 * sin(uTempo * 21.0 + vL.y * 6.0));
      c += uScintille * lampo + uBordo * bordo * 1.4 + vec3(1.0) * lucido * 0.5;
    } else {
      // cromo: il riflesso di un cielo chiaro e di un pavimento caldo, con la riga dell'orizzonte
      vec3 r = reflect(-v, n);
      vec3 cielo = mix(vec3(0.62, 0.68, 0.8), vec3(1.0), smoothstep(0.0, 0.7, r.y));
      vec3 terra = mix(vec3(0.72, 0.6, 0.46), vec3(0.3, 0.25, 0.2), smoothstep(0.0, -0.8, r.y));
      vec3 amb = r.y > 0.0 ? cielo : terra;
      amb += vec3(1.0) * smoothstep(0.05, 0.0, abs(r.y - 0.02)) * 0.5;
      amb += vec3(1.0) * smoothstep(0.9, 0.99, r.x) * 0.7;
      c = amb * uBase + uBordo * bordo * 0.5 + vec3(1.0) * lucido;
    }
    gl_FragColor = vec4(c, 1.0);
  }
`

/** gli accenti che fanno luce (la luna, la porta, la fiamma, le ali): colore pieno con il bordo più chiaro, appena pulsante */
export const LUCE_FRAG = /* glsl */ `
  uniform vec3 uColore;
  uniform vec3 uCuore;
  uniform float uTempo;
  uniform float uTrema;
  varying vec3 vN;
  varying vec3 vV;
  varying vec3 vL;
  void main() {
    float nv = clamp(dot(normalize(vN), normalize(vV)), 0.0, 1.0);
    float trema = 1.0 + uTrema * (0.18 * sin(uTempo * 17.0 + vL.y * 9.0) + 0.1 * sin(uTempo * 29.0));
    vec3 c = mix(uColore, uCuore, pow(nv, 2.0)) * trema;
    gl_FragColor = vec4(c, 1.0);
  }
`

/** la polvere attorno a ogni mascotte: punti che le girano intorno e brillano (additivi) */
export const AURA_VERT = /* glsl */ `
  attribute vec4 aCaso;
  uniform float uTempo;
  uniform float uPx;
  uniform float uVel;
  varying float vLuce;
  void main() {
    float a = aCaso.x * 6.2832 + uTempo * uVel * (0.35 + 0.65 * aCaso.w);
    float r = 0.5 + 0.45 * aCaso.y;
    vec3 p = vec3(cos(a) * r, 0.05 + 1.5 * aCaso.z + 0.06 * sin(uTempo * 1.3 + aCaso.w * 20.0), sin(a) * r * 0.7);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float d = max(-mv.z, 0.1);
    vLuce = 0.25 + 0.75 * pow(0.5 + 0.5 * sin(uTempo * (1.2 + 3.0 * aCaso.w) + aCaso.w * 31.0), 3.0);
    gl_PointSize = clamp(uPx * (0.005 + 0.011 * aCaso.y) / d, 1.0, 9.0);
    gl_Position = projectionMatrix * mv;
  }
`
export const AURA_FRAG = /* glsl */ `
  uniform vec3 uColore;
  uniform float uAlfa;
  varying float vLuce;
  void main() {
    float a = smoothstep(0.5, 0.0, length(gl_PointCoord - 0.5));
    gl_FragColor = vec4(uColore, a * vLuce * uAlfa);
  }
`
