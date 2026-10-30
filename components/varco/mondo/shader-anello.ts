// GLSL dell'anello (compito 6): le particelle del cerchio, il nome che si compone, le quattro porte.
// Coordinate: aAnello e aNome stanno nel quadrato del poster, da -0,5 a 0,5, y verso l'alto.
export const ANELLO_PUNTI_VERT = /* glsl */ `
  attribute vec2 aAnello;
  attribute vec2 aNome;
  attribute vec3 aCol;
  attribute float aMat;
  attribute vec4 aCaso;
  uniform float uAng;
  uniform float uNascita;
  uniform float uNome;
  uniform float uApri;
  uniform float uCaldo;
  uniform float uTempo;
  uniform float uPx;
  uniform float uLato;
  uniform vec3 uCentro;
  uniform vec3 uCam;
  uniform float uCamZ;
  uniform float uDist;
  uniform float uPunto;
  uniform float uAlfa;
  uniform float uAlfaNome;
  uniform float uAccese[4];
  uniform float uPorta[4];
  uniform vec3 uLuce;
  varying vec3 vCol;
  varying float vAlfa;
  void main() {
    int m = int(aMat + 0.5);
    float c = cos(uAng);
    float s = sin(uAng);
    vec2 anello = vec2(aAnello.x * c - aAnello.y * s, aAnello.x * s + aAnello.y * c);
    // il big bang (D45): all'inizio tutte le particelle stanno in un punto; il punto esplode in una nube che vortica,
    // poi ogni particella trova il suo posto nell'anello (dal caos all'ordine), ognuna col suo ritardo
    float th = aCaso.z * 6.2832 + aCaso.y * 2.0;
    float esplode = smoothstep(0.05, 0.3, uNascita);
    float vortice = (1.0 - smoothstep(0.25, 1.0, uNascita)) * (3.0 + 2.5 * aCaso.w);
    float r0 = (0.06 + 0.9 * aCaso.y) * 0.62 * esplode * (1.0 + 0.3 * sin(aCaso.x * 40.0));
    vec2 caos = r0 * vec2(cos(th + vortice), sin(th + vortice));
    anello = mix(caos, anello, smoothstep(0.28 + 0.34 * aCaso.x, 0.9 + 0.1 * aCaso.x, uNascita));
    // il nome: ogni particella parte con un ritardo suo, così le lettere si compongono come uno sciame
    float tn = smoothstep(0.0, 1.0, clamp(uNome * 1.45 - aCaso.x * 0.45, 0.0, 1.0));
    tn *= step(aCaso.w, 0.45);        // solo una parte delle particelle compone le lettere, le altre restano nell'anello (come in anello.ts)
    vec2 p2 = mix(anello, aNome, tn);
    vec3 vista = vec3(p2 * uLato + uCentro.xy + uCam.xy, uCamZ - uDist);   // fisso nella vista: segue il respiro della camera
    // le quattro porte: ogni arco va alla sua porta, nel mondo, davanti all'inizio del suo tratto
    vec3 porta = vec3(anello * uLato * 4.0, uPorta[m]);
    float to = smoothstep(0.0, 1.0, clamp(uApri * 1.3 - aCaso.y * 0.3, 0.0, 1.0));
    vec3 pos = mix(vista, porta, to);
    pos.xy += 0.014 * uLato * vec2(sin(uTempo * 1.1 + aCaso.z * 20.0), cos(uTempo * 0.9 + aCaso.w * 20.0)) * (1.0 - tn);

    float acc = uAccese[m];
    vec3 col = aCol * (0.6 + 0.6 * acc);
    float latoCaldo = smoothstep(0.35, -0.45, anello.x) * uCaldo * (1.0 - tn);
    vCol = mix(col, uLuce, 0.5 * latoCaldo);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    float d = max(-mv.z, 0.001);
    gl_PointSize = clamp(uPx * uPunto * (0.8 + 0.6 * aCaso.x) * mix(1.0, 1.5, tn) / d, 1.0, 12.0);
    gl_Position = projectionMatrix * mv;
    float bordo = 1.0 - smoothstep(0.82, 1.0, length(aAnello) * 2.0);     // come la maschera del poster: nessun bordo
    vAlfa = uAlfa * mix(bordo, 1.0, tn) * mix(1.0, uAlfaNome, tn) * smoothstep(0.3, 1.2, d) * (0.75 + 0.5 * acc);
  }
`
export const ANELLO_PUNTI_FRAG = /* glsl */ `
  varying vec3 vCol;
  varying float vAlfa;
  void main() {
    float r = length(gl_PointCoord - 0.5) * 2.0;
    if (r > 1.0) discard;
    float a = smoothstep(1.0, 0.0, r);
    gl_FragColor = vec4(vCol, a * a * vAlfa);
  }
`
