// Le vignette di /automazioni (v3, 31/10): una scena disegnata per ogni automazione, accanto ad Atlas, che racconta la cosa in tre mosse.
// Sono SVG in codice (0 crediti), grandi un terzo dello schermo; niente testo dentro: icone, forme e il colore della materia.
// Tutto dipende da `--p` (0..1), l'avanzamento della voce dentro il film: lo scrive Varco a ogni fotogramma, e tornando indietro si riavvolge.
// Fuori dal film (pagina normale, movimento ridotto) `--p` non c'è e vale 1: si vede lo stato finale, fermo.
import type { CSSProperties, ReactNode } from 'react'

export const CREMA = '#f4f1ff'
export const BLU = '#5b8cff'
export const BLU_CHIARO = '#a9c2ff'
export const CALDO = '#f2c27a'
export const VELO = 'rgba(244, 241, 255, 0.1)'

/** k = quanto della finestra [a, b] dell'avanzamento è trascorso (0..1); e = lo stesso, addolcito agli estremi */
export const T = (a: number, b: number): CSSProperties =>
  ({ '--k': `clamp(0, calc((var(--p, 1) - ${a}) / ${(b - a).toFixed(3)}), 1)`, '--e': 'calc(var(--k) * var(--k) * (3 - 2 * var(--k)))' }) as CSSProperties

/** compare in [a, b] arrivando da (dx, dy) e crescendo da `s` a 1 */
export const Entra = (a: number, b: number, dx = 0, dy = 0, s = 1): CSSProperties => ({
  ...T(a, b), opacity: 'var(--e)', transformBox: 'fill-box', transformOrigin: 'center',
  transform: `translate(calc((1 - var(--e)) * ${dx}px), calc((1 - var(--e)) * ${dy}px)) scale(calc(${s} + ${1 - s} * var(--e)))`,
})
/** una linea che si disegna in [a, b] (len = lunghezza del tratto) */
export const Disegna = (a: number, b: number, len: number): CSSProperties => ({ ...T(a, b), strokeDasharray: len, strokeDashoffset: `calc(${len}px * (1 - var(--e)))` })
/** sparisce in [a, b] */
export const Esce = (a: number, b: number): CSSProperties => ({ ...T(a, b), opacity: 'calc(1 - var(--e))' })

export const tratto = { fill: 'none', stroke: CREMA, strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

export function Riga({ x, y, w, o = 0.75 }: { x: number; y: number; w: number; o?: number }) {
  return <rect x={x} y={y} width={w} height={4} rx={2} fill={CREMA} opacity={o} />
}
export function Spunta({ d = 'M0 0l5 5 9-10', stile, colore = '#fff' }: { d?: string; stile?: CSSProperties; colore?: string }) {
  return <path d={d} fill="none" stroke={colore} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" style={stile} />
}

/* ---------- 1 · Assistente ai messaggi: tre canali entrano, tre risposte escono con la spunta ---------- */
const ICONE_CANALE: ReactNode[] = [
  <path key="chat" {...tratto} d="M1 3a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H7l-4 4v-4a2 2 0 01-2-2z" />,
  <g key="foto"><rect {...tratto} x={1} y={1} width={16} height={16} rx={5} /><circle {...tratto} cx={9} cy={9} r={3.6} /></g>,
  <g key="mail"><rect {...tratto} x={1} y={3} width={16} height={12} rx={2} /><path {...tratto} d="M1.5 4.5l7.5 6 7.5-6" /></g>,
]
function Messaggi() {
  return (
    <>
      {[0, 1, 2].map((i) => {
        const y = 14 + 44 * i
        return (
          <g key={i} transform={`translate(0 ${y})`}>
            <g style={Entra(0.04 + 0.17 * i, 0.2 + 0.17 * i, -60)}>
              <rect x={14} width={118} height={34} rx={12} fill={VELO} stroke={CREMA} strokeOpacity={0.75} strokeWidth={1.3} />
              <g transform="translate(23 8)">{ICONE_CANALE[i]}</g>
              <Riga x={50} y={11} w={60} />
              <Riga x={50} y={19} w={38} o={0.45} />
            </g>
            <path d="M138 17H220" stroke={BLU_CHIARO} strokeWidth={1.4} strokeLinecap="round" strokeDasharray="3 5" style={Disegna(0.26 + 0.2 * i, 0.4 + 0.2 * i, 90)} />
            <g style={Entra(0.32 + 0.2 * i, 0.47 + 0.2 * i, -40)}>
              <rect x={226} width={118} height={34} rx={12} fill={BLU} />
              <Riga x={238} y={11} w={52} o={0.95} />
              <Riga x={238} y={19} w={34} o={0.6} />
              <g transform="translate(312 11)"><Spunta stile={Disegna(0.4 + 0.2 * i, 0.5 + 0.2 * i, 24)} /></g>
            </g>
          </g>
        )
      })}
    </>
  )
}

/* ---------- 2 · Segreteria telefonica: squilla, la voce diventa un riassunto sul foglio ---------- */
const ALTEZZE_BARRE = [16, 32, 50, 28, 62, 40, 68, 34, 54, 22, 14]
function Segreteria() {
  return (
    <>
      <g transform="translate(20 34)">
        <g style={Entra(0.0, 0.12, 0, 0, 0.8)}>
          <rect {...tratto} width={46} height={82} rx={10} fill={VELO} />
          <circle cx={23} cy={34} r={11} fill={BLU} />
          <path d="M18 36c3 4 7 4 10 0" {...tratto} stroke="#fff" />
          <rect x={14} y={58} width={18} height={4} rx={2} fill={CREMA} opacity={0.6} />
        </g>
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${54 + i * 9} ${20 - i * 4}q${10 + i * 5} ${21 + i * 4} 0 ${42 + i * 8}`} fill="none" stroke={BLU_CHIARO} strokeWidth={2} strokeLinecap="round" style={{ ...T(0.06 + 0.07 * i, 0.16 + 0.07 * i), opacity: 'var(--e)' }} />
        ))}
      </g>
      <g style={{ ...T(0.2, 0.38), opacity: 'var(--e)' }}>
        {ALTEZZE_BARRE.map((h, i) => (
          <rect key={i} className="barra" x={102 + i * 14} y={75 - h / 2} width={8} height={h} rx={4} fill={i % 3 === 1 ? BLU_CHIARO : BLU} style={{ animationDelay: `${-i * 0.11}s` }} />
        ))}
      </g>
      <g style={Entra(0.5, 0.64, 24)}>
        <rect x={272} y={22} width={74} height={106} rx={10} fill={VELO} stroke={CREMA} strokeOpacity={0.75} strokeWidth={1.3} />
        <rect x={282} y={32} width={30} height={5} rx={2.5} fill={CALDO} />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={282} y={48 + i * 16} width={i % 2 ? 40 : 54} height={4} rx={2} fill={CREMA} opacity={0.7} style={{ ...T(0.58 + 0.07 * i, 0.68 + 0.07 * i), transformBox: 'fill-box', transformOrigin: 'left', transform: 'scaleX(var(--e))' }} />
        ))}
      </g>
      <g transform="translate(340 28)">
        <g style={Entra(0.84, 0.97, 0, 0, 0.3)}>
          <circle r={13} fill={BLU} />
          <g transform="translate(-7 1)"><Spunta d="M0 0l4 4 9-9" /></g>
        </g>
      </g>
    </>
  )
}

/* ---------- 3 · Ricontatto dei preventivi: il preventivo tace, parte un messaggio, torna la risposta ---------- */
function Preventivi() {
  return (
    <>
      <g style={{ ...T(0.56, 0.78), opacity: 'calc(0.4 + 0.6 * var(--e))' }}>
        <rect x={26} y={14} width={86} height={120} rx={9} fill={VELO} stroke={CREMA} strokeOpacity={0.8} strokeWidth={1.3} />
        <rect x={38} y={28} width={36} height={6} rx={3} fill={CALDO} />
        {[0, 1, 2, 3].map((i) => <Riga key={i} x={38} y={46 + i * 14} w={i === 3 ? 30 : 60} />)}
        <rect x={38} y={108} width={62} height={10} rx={5} fill={BLU} opacity={0.85} />
      </g>
      <g transform="translate(96 22)" style={Esce(0.3, 0.42)}>
        <circle {...tratto} r={11} fill="#0b1030" />
        <path {...tratto} d="M0-6V0l4 3" />
      </g>
      <path d="M332 30Q240 30 124 68" fill="none" stroke={BLU_CHIARO} strokeWidth={1.4} strokeLinecap="round" strokeDasharray="3 6" style={{ ...Disegna(0.3, 0.6, 250), ...{} }} />
      <g transform="translate(120 68)" style={Esce(0.58, 0.68)}>
        <g style={{ ...T(0.3, 0.6), transform: 'translate(calc((1 - var(--e)) * 208px), calc((1 - var(--e)) * -38px))', opacity: 'calc(min(1, var(--e) * 6))' }}>
          <path d="M0 0l26 9-26 9 5-9z" fill={CREMA} />
        </g>
      </g>
      <g transform="translate(110 20)">
        <circle r={22} fill="none" stroke={BLU_CHIARO} strokeWidth={2} style={{ ...T(0.64, 0.92), opacity: 'calc(0.9 * (1 - var(--e)))', transformBox: 'fill-box', transformOrigin: 'center', transform: 'scale(calc(0.5 + 1.1 * var(--e)))' }} />
        <g style={Entra(0.64, 0.78, 0, 0, 0.3)}>
          <circle r={13} fill={BLU} />
          <g transform="translate(-7 1)"><Spunta d="M0 0l4 4 9-9" /></g>
        </g>
      </g>
      <g style={Entra(0.76, 0.92, 36)}>
        <rect x={238} y={62} width={104} height={46} rx={13} fill={BLU} />
        <Riga x={250} y={76} w={56} o={0.95} />
        <Riga x={250} y={86} w={38} o={0.6} />
        <g transform="translate(318 78)"><Spunta d="M0 0l4 4 9-9" /></g>
      </g>
    </>
  )
}

/* ---------- 4 · Onboarding cliente: quattro passi che si spuntano da soli, l'anello si riempie ---------- */
const ICONE_PASSO: ReactNode[] = [
  <g key="d"><path {...tratto} d="M-5-7h7l4 4v10h-11z" /><path {...tratto} d="M2-7v4h4" /></g>,
  <g key="m"><rect {...tratto} x={-6} y={-7} width={12} height={14} rx={2} /><path {...tratto} d="M-3-2h6M-3 2h4" /></g>,
  <g key="c"><circle {...tratto} cx={-3} cy={0} r={3.5} /><path {...tratto} d="M0.5 0H7M5 0v3" /></g>,
  <g key="b"><path {...tratto} d="M-7 4c0-6 4-10 7-10s7 4 7 10zM-7 4h14" /></g>,
]
function Onboarding() {
  return (
    <>
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(0 ${6 + 36 * i})`}>
          <g style={Entra(0.04 + 0.2 * i, 0.16 + 0.2 * i, -34)}>
            <rect x={14} width={266} height={30} rx={10} fill={VELO} stroke={CREMA} strokeOpacity={0.6} strokeWidth={1.2} />
            <rect x={14} width={266} height={30} rx={10} fill="none" stroke={BLU} strokeWidth={2} style={{ ...T(0.16 + 0.2 * i, 0.26 + 0.2 * i), opacity: 'var(--e)' }} />
            <circle cx={32} cy={15} r={11} fill={BLU} opacity={0.35} />
            <g transform="translate(32 15)">{ICONE_PASSO[i]}</g>
            <Riga x={54} y={9} w={110} />
            <Riga x={54} y={18} w={70} o={0.4} />
            <rect x={246} y={6} width={18} height={18} rx={5} fill="none" stroke={CREMA} strokeOpacity={0.7} strokeWidth={1.5} />
            <rect x={246} y={6} width={18} height={18} rx={5} fill={BLU} style={{ ...T(0.15 + 0.2 * i, 0.24 + 0.2 * i), opacity: 'var(--e)' }} />
            <g transform="translate(250 16)"><Spunta d="M0 0l3.5 3.5 7-8" stile={Disegna(0.16 + 0.2 * i, 0.27 + 0.2 * i, 18)} /></g>
          </g>
        </g>
      ))}
      <g style={Entra(0.0, 0.1, 0, 0, 0.7)}>
        <circle cx={322} cy={75} r={26} fill="none" stroke={CREMA} strokeOpacity={0.2} strokeWidth={7} />
        <circle cx={322} cy={75} r={26} fill="none" stroke={BLU} strokeWidth={7} strokeLinecap="round" strokeDasharray="163.4"
          style={{ ...T(0.1, 0.9), strokeDashoffset: 'calc(163.4px * (1 - var(--e)))', transformBox: 'view-box', transformOrigin: '322px 75px', transform: 'rotate(-90deg)' }} />
      </g>
      <g transform="translate(314 75)"><Spunta d="M0 0l5 5 11-12" colore={CALDO} stile={Disegna(0.88, 1, 30)} /></g>
    </>
  )
}

/* ---------- 5 · Fatture e solleciti: la fattura parte, il promemoria suona, l'incasso sale ---------- */
function Fatture() {
  return (
    <>
      <g>
        <rect x={20} y={14} width={88} height={120} rx={9} fill={VELO} stroke={CREMA} strokeOpacity={0.8} strokeWidth={1.3} />
        <rect x={32} y={26} width={34} height={7} rx={3.5} fill={BLU} />
        {[0, 1, 2].map((i) => <Riga key={i} x={32} y={46 + i * 13} w={i === 2 ? 36 : 62} />)}
        <rect x={32} y={96} width={64} height={12} rx={6} fill={CALDO} opacity={0.9} />
        <g transform="translate(96 122)">
          <g style={Entra(0.8, 0.92, 0, 0, 0.3)}>
            <circle r={12} fill={BLU} /><g transform="translate(-6 1)"><Spunta d="M0 0l3.5 3.5 9-9" /></g>
          </g>
        </g>
      </g>
      <path d="M112 54H188" fill="none" stroke={BLU_CHIARO} strokeWidth={1.4} strokeLinecap="round" strokeDasharray="3 5" style={Disegna(0.08, 0.3, 80)} />
      <g transform="translate(112 45)" style={Esce(0.3, 0.4)}>
        <g style={{ ...T(0.08, 0.3), transform: 'translate(calc(var(--e) * 62px), 0)', opacity: 'calc(min(1, var(--e) * 8))' }}>
          <path d="M0 0l22 9-22 9 4-9z" fill={CREMA} />
        </g>
      </g>
      <g transform="translate(202 28)">
        <g style={Entra(0.28, 0.4, 0, -14)}>
          <g className="scossa">
            <path {...tratto} fill={VELO} d="M0 34c0-14 6-26 12-26s12 12 12 26l4 6H-4z" />
            <circle {...tratto} cx={12} cy={46} r={3.2} />
          </g>
          <path {...tratto} stroke={BLU_CHIARO} d="M-10 22q-5 8 0 16M34 22q5 8 0 16" style={{ ...T(0.34, 0.44), opacity: 'var(--e)' }} />
        </g>
      </g>
      <path d="M236 84Q268 100 288 112" fill="none" stroke={BLU_CHIARO} strokeWidth={1.4} strokeLinecap="round" strokeDasharray="3 5" style={Disegna(0.46, 0.58, 70)} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(318 ${122 - 15 * i})`}>
          <g style={Entra(0.5 + 0.1 * i, 0.62 + 0.1 * i, 0, -26)}>
            <ellipse rx={27} ry={8} cy={5} fill="#9c7433" />
            <ellipse rx={27} ry={8} fill={CALDO} stroke="#fff3d6" strokeOpacity={0.7} strokeWidth={1} />
          </g>
        </g>
      ))}
    </>
  )
}

/* ---------- 6 · Programmi collegati: ordini, magazzino e gestionale si passano il dato ---------- */
const NODI = { a: [66, 40], b: [294, 40], c: [180, 116] } as const
function Collegati() {
  const nodo = (id: 'a' | 'b' | 'c', icona: ReactNode, da: number) => {
    const [x, y] = NODI[id]
    return (
      <g key={id} transform={`translate(${x} ${y})`}>
        <circle r={26} fill="none" stroke={CALDO} strokeWidth={2} style={{ ...T(da, da + 0.14), opacity: 'calc(0.9 * (1 - var(--e)))', transformBox: 'fill-box', transformOrigin: 'center', transform: 'scale(calc(1 + 0.9 * var(--e)))' }} />
        <g style={Entra(0.0, 0.1, 0, 0, 0.6)}>
          <circle r={26} fill="#0b1030" stroke={CREMA} strokeOpacity={0.85} strokeWidth={1.5} />
          {icona}
        </g>
        <g transform="translate(19 -19)">
          <g style={Entra(0.88, 0.98, 0, 0, 0.2)}>
            <circle r={8} fill={BLU} /><g transform="translate(-4 0.5)"><Spunta d="M0 0l2.5 2.5 5.5-6" /></g>
          </g>
        </g>
      </g>
    )
  }
  const pallino = (da: [number, number], dx: number, dy: number, a: number, b: number) => (
    <g transform={`translate(${da[0]} ${da[1]})`}>
      <circle r={6} fill={CALDO} style={{ ...T(a, b), transform: `translate(calc(var(--e) * ${dx}px), calc(var(--e) * ${dy}px))`, opacity: 'calc(min(1, var(--e) * 10, (1 - var(--e)) * 10))' }} />
    </g>
  )
  return (
    <>
      <path d="M92 40H268" stroke={BLU_CHIARO} strokeWidth={1.5} strokeLinecap="round" fill="none" style={Disegna(0.04, 0.3, 180)} />
      <path d="M278 58L196 100" stroke={BLU_CHIARO} strokeWidth={1.5} strokeLinecap="round" fill="none" style={Disegna(0.1, 0.34, 100)} />
      <path d="M164 100L82 58" stroke={BLU_CHIARO} strokeWidth={1.5} strokeLinecap="round" fill="none" style={Disegna(0.16, 0.4, 100)} />
      {nodo('a', <g><path {...tratto} d="M-12-9h4l4 13h13l3-9H-6" /><circle cx={-2} cy={9} r={1.8} fill={CREMA} /><circle cx={8} cy={9} r={1.8} fill={CREMA} /></g>, 0.82)}
      {nodo('b', <g><rect {...tratto} x={-12} y={-10} width={24} height={20} rx={3} /><path {...tratto} d="M-12-3h24M-12 4h24M-3-10v20" /></g>, 0.46)}
      {nodo('c', <g><path {...tratto} d="M-12-5L0-12l12 7v13L0 14-12 8z" /><path {...tratto} d="M-12-5L0 1l12-6M0 1v13" /></g>, 0.64)}
      {pallino([66, 40], 228, 0, 0.3, 0.5)}
      {pallino([294, 40], -114, 76, 0.48, 0.68)}
      {pallino([180, 116], -114, -76, 0.66, 0.86)}
    </>
  )
}

/* ---------- 7 · Su misura: un contorno tratteggiato, i pezzi arrivano e si incastrano ---------- */
function SuMisura() {
  return (
    <>
      <rect x={104} y={20} width={152} height={110} rx={18} fill="none" stroke={BLU_CHIARO} strokeWidth={2} strokeLinecap="round" strokeDasharray="520" style={{ ...T(0.04, 0.4), strokeDashoffset: 'calc(520px * (1 - var(--e)))' }} />
      <g style={Entra(0.34, 0.54, -150, -24)}><rect x={116} y={32} width={60} height={42} rx={9} fill={BLU} /></g>
      <g style={Entra(0.44, 0.64, 150, -34)}><rect x={184} y={32} width={60} height={42} rx={9} fill={BLU_CHIARO} /></g>
      <g style={Entra(0.54, 0.74, 0, 110)}><rect x={116} y={82} width={128} height={38} rx={9} fill="#d9e2ff" /></g>
      <g transform="translate(262 20)">
        <g style={Entra(0.78, 0.94, 0, 0, 0.2)}>
          <path d="M0-14L3.6-3.6 14 0 3.6 3.6 0 14-3.6 3.6-14 0-3.6-3.6z" fill={CALDO} />
        </g>
      </g>
    </>
  )
}


/* ===================================================== Siti web: i tipi di sito ===================================================== */
/** una finestra di browser (cornice + tre puntini); il contenuto lo mette chi la usa. Posizione e animazione su due livelli (vedi sopra) */
function Finestra({ x, y, w, h, children }: { x: number; y: number; w: number; h: number; children?: ReactNode }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={w} height={h} rx={9} fill="#0b1030" stroke={CREMA} strokeOpacity={0.8} strokeWidth={1.3} />
      <path d={`M0 14H${w}`} stroke={CREMA} strokeOpacity={0.35} strokeWidth={1} />
      {[0, 1, 2].map((i) => <circle key={i} cx={9 + i * 8} cy={7} r={2} fill={CREMA} opacity={0.6} />)}
      {children}
    </g>
  )
}

/* ---------- 8 · Landing page: una pagina sola, un pulsante, un tocco, la richiesta arriva ---------- */
function Landing() {
  return (
    <>
      <g style={Entra(0.02, 0.2, 0, 24)}>
        <Finestra x={120} y={8} w={120} h={134}>
          <rect x={10} y={24} width={100} height={42} rx={6} fill={BLU} opacity={0.35} />
          <Riga x={20} y={34} w={64} o={0.95} /><Riga x={20} y={44} w={44} o={0.6} />
          {[0, 1, 2].map((i) => <rect key={i} x={10 + i * 35} y={76} width={30} height={22} rx={5} fill={VELO} stroke={CREMA} strokeOpacity={0.5} />)}
          <rect x={30} y={108} width={60} height={18} rx={9} fill={BLU} style={{ ...T(0.5, 0.64), transformBox: 'fill-box', transformOrigin: 'center', transform: 'scale(calc(1 + 0.12 * var(--e)))' }} />
        </Finestra>
      </g>
      <g style={Entra(0.3, 0.5, 70, 40)}><path d="M0 0l2 22 6-6 5 11 4-2-5-11 8-1z" fill={CREMA} stroke="#0b1030" strokeWidth={1} transform="translate(166 122)" /></g>
      <g transform="translate(180 126)">
        <circle r={18} fill="none" stroke={BLU_CHIARO} strokeWidth={2} style={{ ...T(0.56, 0.8), opacity: 'calc(0.9 * (1 - var(--e)))', transformBox: 'fill-box', transformOrigin: 'center', transform: 'scale(calc(0.5 + 1.4 * var(--e)))' }} />
      </g>
      <path d="M244 126C270 126 280 100 296 80" fill="none" stroke={BLU_CHIARO} strokeWidth={1.4} strokeDasharray="3 5" strokeLinecap="round" style={Disegna(0.56, 0.74, 90)} />
      <g style={Entra(0.7, 0.88, 40)}>
        <rect x={262} y={36} width={84} height={40} rx={12} fill={BLU} />
        <Riga x={274} y={48} w={48} o={0.95} /><Riga x={274} y={57} w={32} o={0.6} />
        <g transform="translate(322 50)"><Spunta d="M0 0l3.5 3.5 7-8" stile={Disegna(0.78, 0.9, 20)} /></g>
      </g>
    </>
  )
}

/* ---------- 9 · Sito vetrina: tre pagine nate dal menu ---------- */
function Vetrina() {
  const pagine = [
    { x: 14, corpo: <><rect x={8} y={22} width={78} height={34} rx={5} fill={BLU} opacity={0.35} /><Riga x={14} y={64} w={58} /><Riga x={14} y={74} w={42} o={0.5} /></> },
    { x: 124, corpo: <>{[0, 1, 2].map((i) => <rect key={i} x={8 + i * 28} y={26} width={24} height={30} rx={4} fill={VELO} stroke={CREMA} strokeOpacity={0.5} />)}<Riga x={14} y={66} w={60} /><Riga x={14} y={76} w={40} o={0.5} /></> },
    { x: 234, corpo: <><rect x={8} y={22} width={78} height={40} rx={5} fill={VELO} stroke={CREMA} strokeOpacity={0.5} /><path d="M47 26a8 8 0 018 8c0 8-8 16-8 16s-8-8-8-16a8 8 0 018-8z" fill={CALDO} /><circle cx={47} cy={34} r={3} fill="#0b1030" /><Riga x={14} y={72} w={56} /></> },
  ]
  return (
    <>
      <path d="M26 12H336" stroke={BLU_CHIARO} strokeWidth={1.4} strokeLinecap="round" fill="none" style={Disegna(0.04, 0.3, 310)} />
      {pagine.map((pg, i) => (
        <g key={i} transform={`translate(${pg.x} 22)`}>
          <g style={Entra(0.12 + 0.2 * i, 0.3 + 0.2 * i, 0, 36)}>
            <Finestra x={0} y={0} w={94} h={104}>{pg.corpo}</Finestra>
          </g>
        </g>
      ))}
      {[0, 1, 2].map((i) => <circle key={i} cx={61 + i * 110} cy={12} r={4.5} fill={BLU} style={{ ...T(0.1 + 0.2 * i, 0.22 + 0.2 * i), opacity: 'var(--e)' }} />)}
      <g transform="translate(180 138)"><g style={Entra(0.8, 0.94, 0, 0, 0.3)}><rect x={-28} y={-6} width={56} height={12} rx={6} fill={BLU} /></g></g>
    </>
  )
}

/* ---------- 10 · Sito per strutture ricettive: la foto che fa venire voglia, le date, la richiesta ---------- */
function Ricettive() {
  return (
    <>
      <g style={Entra(0.02, 0.22, -30)}>
        <rect x={16} y={16} width={150} height={118} rx={12} fill={VELO} stroke={CREMA} strokeOpacity={0.8} strokeWidth={1.3} />
        <circle cx={128} cy={44} r={11} fill={CALDO} />
        <path d="M16 118l36-40 26 26 24-30 64 44z" fill={BLU} opacity={0.5} />
        <path d="M16 134H166V118L142 92 118 74 90 104 70 84z" fill={BLU} opacity={0.75} />
      </g>
      <g style={Entra(0.2, 0.36, 30)}>
        <rect x={186} y={16} width={158} height={86} rx={12} fill={VELO} stroke={CREMA} strokeOpacity={0.8} strokeWidth={1.3} />
        {Array.from({ length: 14 }, (_, i) => <rect key={i} x={198 + (i % 7) * 20} y={30 + Math.floor(i / 7) * 22 + 6} width={14} height={14} rx={4} fill={CREMA} opacity={0.25} />)}
      </g>
      {[9, 10, 11].map((c, i) => (
        <rect key={c} x={198 + (c % 7) * 20} y={30 + (c > 6 ? 22 : 0) + 6} width={14} height={14} rx={4} fill={BLU} style={{ ...T(0.38 + 0.08 * i, 0.46 + 0.08 * i), opacity: 'var(--e)' }} />
      ))}
      <g style={Entra(0.66, 0.84, 0, 22)}>
        <rect x={186} y={110} width={158} height={30} rx={15} fill={BLU} />
        <Riga x={202} y={122} w={64} o={0.95} />
        <g transform="translate(318 120)"><Spunta d="M0 0l3.5 3.5 7-8" stile={Disegna(0.72, 0.86, 20)} /></g>
      </g>
    </>
  )
}

/* ---------- 11 · Sito per agenzie e studi: servizi chiari, un modulo, le richieste in ordine ---------- */
function Agenzie() {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(0 ${16 + 44 * i})`}>
          <g style={Entra(0.02 + 0.12 * i, 0.16 + 0.12 * i, -30)}>
            <rect x={14} width={104} height={36} rx={10} fill={VELO} stroke={CREMA} strokeOpacity={0.7} strokeWidth={1.2} />
            <circle cx={32} cy={18} r={9} fill={BLU} opacity={0.5} /><Riga x={48} y={12} w={56} /><Riga x={48} y={21} w={36} o={0.45} />
          </g>
        </g>
      ))}
      <g style={Entra(0.34, 0.5, 0, 20)}>
        <rect x={138} y={16} width={104} height={118} rx={12} fill="#0b1030" stroke={CREMA} strokeOpacity={0.8} strokeWidth={1.3} />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={150} y={30 + i * 26} width={80} height={16} rx={5} fill="none" stroke={CREMA} strokeOpacity={0.5} />
            <rect x={154} y={35 + i * 26} width={64} height={6} rx={3} fill={BLU_CHIARO} style={{ ...T(0.46 + 0.1 * i, 0.58 + 0.1 * i), transformBox: 'fill-box', transformOrigin: 'left', transform: 'scaleX(var(--e))' }} />
          </g>
        ))}
        <rect x={156} y={110} width={68} height={16} rx={8} fill={BLU} />
      </g>
      <path d="M246 76H266" stroke={BLU_CHIARO} strokeWidth={1.4} strokeLinecap="round" fill="none" style={Disegna(0.7, 0.78, 24)} />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(0 ${22 + 38 * i})`}>
          <g style={Entra(0.74 + 0.07 * i, 0.86 + 0.07 * i, 30)}>
            <rect x={270} width={76} height={30} rx={9} fill={VELO} stroke={CREMA} strokeOpacity={0.7} strokeWidth={1.2} />
            <Riga x={280} y={9} w={44} /><Riga x={280} y={18} w={28} o={0.45} />
            <circle cx={334} cy={15} r={5} fill={i === 0 ? CALDO : BLU} />
          </g>
        </g>
      ))}
    </>
  )
}

/* ---------- 12 · E-commerce store: il catalogo, un prodotto nel carrello, il pagamento ---------- */
function Store() {
  return (
    <>
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${14 + (i % 2) * 74} ${14 + Math.floor(i / 2) * 64})`}>
          <g style={Entra(0.02 + 0.08 * i, 0.16 + 0.08 * i, 0, 22)}>
            <rect width={66} height={56} rx={9} fill={VELO} stroke={CREMA} strokeOpacity={0.7} strokeWidth={1.2} />
            <rect x={6} y={6} width={54} height={30} rx={5} fill={i % 2 ? BLU : BLU_CHIARO} opacity={0.5} />
            <Riga x={8} y={42} w={32} /><rect x={44} y={41} width={14} height={6} rx={3} fill={CALDO} />
          </g>
        </g>
      ))}
      <path d="M92 52C140 30 184 36 216 58" fill="none" stroke={BLU_CHIARO} strokeWidth={1.4} strokeDasharray="3 5" strokeLinecap="round" style={{ ...Disegna(0.34, 0.54, 160), opacity: 'calc(1 - 0.7 * var(--e))' }} />
      <g transform="translate(92 52)">
        <g style={{ ...T(0.34, 0.56), transform: 'translate(calc(var(--e) * 126px), calc(var(--e) * 8px)) scale(calc(1 - 0.5 * var(--e)))', opacity: 'calc(min(1, var(--e) * 8, (1 - var(--e)) * 5))', transformBox: 'fill-box', transformOrigin: 'center' }}>
          <rect x={-14} y={-12} width={28} height={24} rx={5} fill={BLU} />
        </g>
      </g>
      <g transform="translate(240 70)">
        <g style={Entra(0.22, 0.36, 0, 0, 0.6)}>
          <path {...tratto} strokeWidth={2.2} d="M-26-24h8l8 34h34l6-24H-16" />
          <circle cx={-6} cy={20} r={4} fill={CREMA} /><circle cx={24} cy={20} r={4} fill={CREMA} />
        </g>
        <g transform="translate(26 -26)"><g style={Entra(0.56, 0.68, 0, 0, 0.2)}><circle r={9} fill={BLU} /><g transform="translate(-4 0.5)"><Spunta d="M0 0l2.5 2.5 5.5-6" /></g></g></g>
      </g>
      <g transform="translate(316 70)">
        <g style={Entra(0.66, 0.82, 22)}>
          <rect x={-30} y={-20} width={60} height={40} rx={7} fill={VELO} stroke={CREMA} strokeOpacity={0.85} strokeWidth={1.3} />
          <rect x={-30} y={-9} width={60} height={9} fill={CREMA} opacity={0.35} />
          <rect x={-22} y={7} width={22} height={5} rx={2.5} fill={CALDO} />
        </g>
        <g transform="translate(26 22)"><g style={Entra(0.8, 0.94, 0, 0, 0.2)}><circle r={10} fill={BLU} /><g transform="translate(-5 1)"><Spunta d="M0 0l3 3 6.5-7" /></g></g></g>
      </g>
    </>
  )
}

/* ---------- 13 · Sito 3D immersivo: strati che si muovono in profondità e una scintilla ---------- */
function TreD() {
  const strato = (i: number, x: number, y: number, w: number, h: number, colore: string, op: number, dx: number) => (
    <g key={i} transform={`translate(${x} ${y})`}>
      <g style={{ ...T(0.02 + 0.1 * i, 0.2 + 0.1 * i), opacity: 'var(--e)', transform: `translate(calc((1 - var(--e)) * ${-dx}px + var(--p, 1) * ${dx * 0.8}px), 0)` }}>
        <rect width={w} height={h} rx={14} fill={colore} opacity={op} stroke={CREMA} strokeOpacity={0.5} strokeWidth={1.2} />
      </g>
    </g>
  )
  return (
    <>
      {strato(0, 70, 14, 220, 122, '#16206b', 0.9, 24)}
      {strato(1, 100, 30, 170, 92, BLU, 0.55, -10)}
      {strato(2, 134, 46, 112, 60, BLU_CHIARO, 0.85, -36)}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <circle key={i} cx={52 + i * 52} cy={i % 2 ? 128 : 22} r={2.6} fill={CREMA} style={{ ...T(0.2 + 0.08 * i, 0.4 + 0.08 * i), opacity: 'calc(0.9 * var(--e))', transform: `translate(calc(var(--p, 1) * ${i % 2 ? -26 : 30}px), 0)` }} />
      ))}
      <g transform="translate(180 76)"><g style={Entra(0.66, 0.86, 0, 0, 0.2)}><path d="M0-17L4.4-4.4 17 0 4.4 4.4 0 17-4.4 4.4-17 0-4.4-4.4z" fill={CALDO} /></g></g>
    </>
  )
}

/* ---------- 14 · App e portali: una schermata con i dati, il telefono che si aggiorna, l'area riservata ---------- */
function App() {
  const barre = [26, 44, 34, 58, 48, 70]
  return (
    <>
      <g style={Entra(0.02, 0.2, -20)}>
        <Finestra x={20} y={12} w={216} h={126}>
          <rect x={0} y={14} width={44} height={112} fill={CREMA} opacity={0.07} />
          {[0, 1, 2, 3].map((i) => <rect key={i} x={10} y={28 + i * 18} width={26} height={5} rx={2.5} fill={CREMA} opacity={i === 0 ? 0.9 : 0.4} />)}
          {barre.map((h, i) => <rect key={i} x={62 + i * 24} y={116 - h} width={16} height={h} rx={4} fill={i === 5 ? CALDO : BLU} style={{ ...T(0.18 + 0.07 * i, 0.34 + 0.07 * i), transformBox: 'fill-box', transformOrigin: 'bottom', transform: 'scaleY(var(--e))' }} />)}
          <path d="M62 80L86 70 110 74 134 54 158 58 182 36" fill="none" stroke={CREMA} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" style={Disegna(0.5, 0.74, 140)} />
        </Finestra>
      </g>
      <g transform="translate(128 12)"><g style={Entra(0.5, 0.64, 0, 0, 0.2)}>
        <circle cx={96} cy={0} r={0} /><circle cx={102} cy={4} r={11} fill={BLU} />
        <g transform="translate(97 4)"><rect x={0} y={1} width={10} height={8} rx={2} fill="#fff" /><path d="M2 1V-1a3 3 0 016 0V1" fill="none" stroke="#fff" strokeWidth={1.4} /></g>
      </g></g>
      <path d="M240 78H268" stroke={BLU_CHIARO} strokeWidth={1.4} strokeDasharray="3 5" strokeLinecap="round" fill="none" style={Disegna(0.62, 0.74, 30)} />
      <g style={Entra(0.66, 0.84, 30)}>
        <rect x={272} y={22} width={64} height={110} rx={12} fill="#0b1030" stroke={CREMA} strokeOpacity={0.85} strokeWidth={1.3} />
        {[0, 1, 2, 3].map((i) => <rect key={i} x={282 + i * 12} y={116 - [22, 38, 30, 52][i]} width={8} height={[22, 38, 30, 52][i]} rx={3} fill={i === 3 ? CALDO : BLU} />)}
        <rect x={282} y={34} width={44} height={5} rx={2.5} fill={CREMA} opacity={0.7} />
      </g>
    </>
  )
}

const SCENE: Record<string, () => ReactNode> = { messaggi: Messaggi, segreteria: Segreteria, preventivi: Preventivi, onboarding: Onboarding, fatture: Fatture, collegati: Collegati, 'su-misura': SuMisura, landing: Landing, vetrina: Vetrina, ricettive: Ricettive, agenzie: Agenzie, store: Store, 'tre-d': TreD, app: App }

export default function Vignetta({ id }: { id: string }) {
  const Scena = SCENE[id]
  if (!Scena) return null
  return (
    <svg className="vignetta" viewBox="0 0 360 150" preserveAspectRatio="xMidYMid meet" role="presentation" aria-hidden="true" focusable="false">
      <Scena />
    </svg>
  )
}
