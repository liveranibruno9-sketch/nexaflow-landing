// Le vignette di /automazioni (v3, 31/10): una scena disegnata per ogni automazione, accanto ad Atlas, che racconta la cosa in tre mosse.
// Sono SVG in codice (0 crediti), grandi un terzo dello schermo; niente testo dentro: icone, forme e il colore della materia.
// Tutto dipende da `--p` (0..1), l'avanzamento della voce dentro il film: lo scrive Varco a ogni fotogramma, e tornando indietro si riavvolge.
// Fuori dal film (pagina normale, movimento ridotto) `--p` non c'è e vale 1: si vede lo stato finale, fermo.
import type { CSSProperties, ReactNode } from 'react'

const CREMA = '#f4f1ff'
const BLU = '#5b8cff'
const BLU_CHIARO = '#a9c2ff'
const CALDO = '#f2c27a'
const VELO = 'rgba(244, 241, 255, 0.1)'

/** k = quanto della finestra [a, b] dell'avanzamento è trascorso (0..1); e = lo stesso, addolcito agli estremi */
const T = (a: number, b: number): CSSProperties =>
  ({ '--k': `clamp(0, calc((var(--p, 1) - ${a}) / ${(b - a).toFixed(3)}), 1)`, '--e': 'calc(var(--k) * var(--k) * (3 - 2 * var(--k)))' }) as CSSProperties

/** compare in [a, b] arrivando da (dx, dy) e crescendo da `s` a 1 */
const Entra = (a: number, b: number, dx = 0, dy = 0, s = 1): CSSProperties => ({
  ...T(a, b), opacity: 'var(--e)', transformBox: 'fill-box', transformOrigin: 'center',
  transform: `translate(calc((1 - var(--e)) * ${dx}px), calc((1 - var(--e)) * ${dy}px)) scale(calc(${s} + ${1 - s} * var(--e)))`,
})
/** una linea che si disegna in [a, b] (len = lunghezza del tratto) */
const Disegna = (a: number, b: number, len: number): CSSProperties => ({ ...T(a, b), strokeDasharray: len, strokeDashoffset: `calc(${len}px * (1 - var(--e)))` })
/** sparisce in [a, b] */
const Esce = (a: number, b: number): CSSProperties => ({ ...T(a, b), opacity: 'calc(1 - var(--e))' })

const tratto = { fill: 'none', stroke: CREMA, strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

function Riga({ x, y, w, o = 0.75 }: { x: number; y: number; w: number; o?: number }) {
  return <rect x={x} y={y} width={w} height={4} rx={2} fill={CREMA} opacity={o} />
}
function Spunta({ d = 'M0 0l5 5 9-10', stile, colore = '#fff' }: { d?: string; stile?: CSSProperties; colore?: string }) {
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

const SCENE: Record<string, () => ReactNode> = { messaggi: Messaggi, segreteria: Segreteria, preventivi: Preventivi, onboarding: Onboarding, fatture: Fatture, collegati: Collegati, 'su-misura': SuMisura }

export default function Vignetta({ id }: { id: string }) {
  const Scena = SCENE[id]
  if (!Scena) return null
  return (
    <svg className="vignetta" viewBox="0 0 360 150" preserveAspectRatio="xMidYMid meet" role="presentation" aria-hidden="true" focusable="false">
      <Scena />
    </svg>
  )
}
