// Le sei scene «per mestiere» di /siti-web (31/10, scelte di Bruno: A, A, B, A, B, A). Janus veste il sito del mestiere: sulla foto del
// mestiere, dentro il telefono di vetro, un disegno di icone e forme (mai testo, regola D17) compie l'azione che il sito deve far compiere.
// Tutto dipende da `--p` (0..1), animato da CSS dalla scelta (vedi `gioca` in pagine.css); senza animazione vale 1 = stato finale fermo.
// In SVG la proprietà CSS `transform` annulla l'attributo `transform` dello stesso elemento: posizione e animazione stanno su due livelli.
import type { ReactNode } from 'react'
import { BLU, BLU_CHIARO, CALDO, CREMA, Disegna, Entra, Esce, Riga, Spunta, T, VELO, tratto } from './Vignetta'

const SCURO = '#0b1030'

/* ---------- B&B e agriturismo · A · la camera si apre: le notti si accendono sul calendario, parte la richiesta ---------- */
function Camera() {
  return (
    <>
      <g transform="translate(62 42)">
        <circle r={30} fill={CALDO} style={{ ...T(0, 0.35), opacity: 'calc(0.38 * var(--e))', transformBox: 'fill-box', transformOrigin: 'center', transform: 'scale(calc(0.6 + 0.4 * var(--e)))' }} />
      </g>
      <g style={Entra(0.05, 0.25, 30)}>
        <rect x={206} y={14} width={140} height={82} rx={11} fill={SCURO} fillOpacity={0.78} stroke={CREMA} strokeOpacity={0.85} strokeWidth={1.3} />
        <rect x={216} y={22} width={44} height={6} rx={3} fill={CALDO} />
        {Array.from({ length: 14 }, (_, i) => <rect key={i} x={216 + (i % 7) * 18} y={38 + Math.floor(i / 7) * 24} width={14} height={18} rx={4} fill={CREMA} opacity={0.22} />)}
      </g>
      {[9, 10, 11].map((c, i) => (
        <rect key={c} x={216 + (c % 7) * 18} y={38 + (c > 6 ? 24 : 0)} width={14} height={18} rx={4} fill={BLU} style={{ ...T(0.3 + 0.1 * i, 0.4 + 0.1 * i), opacity: 'var(--e)' }} />
      ))}
      <g style={Entra(0.62, 0.8, 0, 20)}>
        <rect x={206} y={106} width={140} height={32} rx={16} fill={BLU} />
        <Riga x={222} y={118} w={64} o={0.95} /><Riga x={222} y={126} w={40} o={0.6} />
        <g transform="translate(318 117)"><Spunta d="M0 0l3.5 3.5 8-9" stile={Disegna(0.74, 0.88, 22)} /></g>
      </g>
    </>
  )
}

/* ---------- Ristorante e bar · A · il tavolo si apparecchia: piatto, posate, bicchiere, sedie, il segnaposto si accende ---------- */
function Tavolo() {
  return (
    <>
      <g transform="translate(180 76) scale(1.22)">
        <g style={Entra(0.0, 0.2, 0, 0, 0.5)}>
          <circle r={50} fill={SCURO} fillOpacity={0.55} stroke={CREMA} strokeOpacity={0.85} strokeWidth={1.4} />
        </g>
        <g transform="translate(-72 -8)"><g style={Entra(0.4, 0.6, -26)}><rect width={16} height={24} rx={7} fill={VELO} stroke={CREMA} strokeOpacity={0.8} strokeWidth={1.2} /></g></g>
        <g transform="translate(56 -8)"><g style={Entra(0.45, 0.65, 26)}><rect width={16} height={24} rx={7} fill={VELO} stroke={CREMA} strokeOpacity={0.8} strokeWidth={1.2} /></g></g>
        <g style={Entra(0.15, 0.4, 0, -60)}><circle r={17} fill={CREMA} fillOpacity={0.9} /><circle r={10} fill="none" stroke={SCURO} strokeOpacity={0.35} strokeWidth={1.4} /></g>
        <g transform="translate(-28 0)"><g style={Entra(0.25, 0.45, -34)}><path d="M0-14v28M-3.5-14v8M3.5-14v8" {...tratto} stroke={CREMA} /></g></g>
        <g transform="translate(28 0)"><g style={Entra(0.3, 0.5, 34)}><path d="M0-14v28" {...tratto} stroke={CREMA} /><path d="M0-14c5 3 5 11 0 14" {...tratto} stroke={CREMA} /></g></g>
        <g transform="translate(24 -30)"><g style={Entra(0.35, 0.55, 0, -40)}><circle r={7} fill={VELO} stroke={CREMA} strokeOpacity={0.9} strokeWidth={1.3} /></g></g>
        <g transform="translate(0 -33)"><g style={Entra(0.6, 0.74, 0, 8)}><rect x={-13} y={-7} width={26} height={14} rx={3} fill={CALDO} /></g></g>
        <circle r={24} fill="none" stroke={CALDO} strokeWidth={2.4} style={{ ...T(0.62, 0.9), opacity: 'calc(0.9 * (1 - var(--e)))', transformBox: 'fill-box', transformOrigin: 'center', transform: 'scale(calc(0.7 + 0.8 * var(--e)))' }} />
      </g>
      <g transform="translate(250 30)">
        <g style={Entra(0.8, 0.95, 0, 0, 0.2)}><circle r={12} fill={BLU} /><g transform="translate(-6 1)"><Spunta d="M0 0l3.5 3.5 8-9" /></g></g>
      </g>
    </>
  )
}

/* ---------- Negozio · B · dal catalogo al ritiro: un prodotto nel carrello, il carrello sul pin del negozio ---------- */
function Ritiro() {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(16 ${12 + 44 * i})`}>
          <g style={Entra(0.0 + 0.06 * i, 0.14 + 0.06 * i, -24)}>
            <rect width={70} height={38} rx={9} fill={SCURO} fillOpacity={0.72} stroke={i === 1 ? BLU_CHIARO : CREMA} strokeOpacity={i === 1 ? 1 : 0.7} strokeWidth={i === 1 ? 2 : 1.2} />
            <rect x={6} y={6} width={26} height={26} rx={5} fill={i % 2 ? BLU : BLU_CHIARO} opacity={0.6} />
            <Riga x={38} y={11} w={26} /><rect x={38} y={21} width={20} height={6} rx={3} fill={CALDO} />
          </g>
        </g>
      ))}
      <path d="M92 75C108 75 118 78 134 80" fill="none" stroke={BLU_CHIARO} strokeWidth={1.4} strokeDasharray="3 5" strokeLinecap="round" style={Disegna(0.24, 0.4, 50)} />
      <g transform="translate(60 75)">
        <g style={{ ...T(0.26, 0.5), transform: 'translate(calc(var(--e) * 86px), calc(var(--e) * 6px)) scale(calc(1 - 0.45 * var(--e)))', opacity: 'calc(min(1, var(--e) * 8, (1 - var(--e)) * 6))', transformBox: 'fill-box', transformOrigin: 'center' }}>
          <rect x={-14} y={-12} width={28} height={24} rx={5} fill={BLU} />
        </g>
      </g>
      <g transform="translate(160 82)">
        <g style={Entra(0.18, 0.34, 0, 0, 0.6)}>
          <path {...tratto} strokeWidth={2.4} d="M-26-26h8l8 34h34l6-24H-16" />
          <circle cx={-6} cy={22} r={4} fill={CREMA} /><circle cx={24} cy={22} r={4} fill={CREMA} />
        </g>
      </g>
      <path d="M212 78C240 78 258 78 278 78" fill="none" stroke={BLU_CHIARO} strokeWidth={1.4} strokeDasharray="3 5" strokeLinecap="round" style={Disegna(0.5, 0.68, 70)} />
      <g transform="translate(180 82)">
        <g style={{ ...T(0.5, 0.74), transform: 'translate(calc(var(--e) * 110px), 0)', opacity: 'calc(min(1, var(--e) * 8, (1 - var(--e)) * 6))' }}>
          <rect x={-12} y={-8} width={24} height={22} rx={4} fill={CALDO} /><path d="M-6-8v-4a6 6 0 0112 0v4" fill="none" stroke={CALDO} strokeWidth={2.2} />
        </g>
      </g>
      <g transform="translate(300 84)">
        <g style={Entra(0.56, 0.74, 0, 0, 0.7)}>
          <rect x={-32} y={-16} width={64} height={46} rx={7} fill={SCURO} fillOpacity={0.75} stroke={CREMA} strokeOpacity={0.85} strokeWidth={1.3} />
          <path d="M-36-16h72l-6-14h-60z" fill={BLU} opacity={0.85} />
          <rect x={-8} y={-2} width={16} height={32} rx={3} fill={CREMA} opacity={0.35} />
        </g>
        <g transform="translate(0 -52)"><g style={Entra(0.72, 0.86, 0, -14)}><path d="M0 12C-9 0-12-4-12-11a12 12 0 0124 0c0 7-3 11-12 23z" fill={CALDO} /><circle cy={-11} r={4.4} fill={SCURO} /></g></g>
        <g transform="translate(30 -16)"><g style={Entra(0.84, 0.96, 0, 0, 0.2)}><circle r={10} fill={BLU} /><g transform="translate(-5 1)"><Spunta d="M0 0l3 3 7-8" /></g></g></g>
      </g>
    </>
  )
}

/* ---------- Artigiano e impresa · A · prima e dopo: il cursore scorre, il lavoro grezzo diventa finito ---------- */
function PrimaDopo() {
  return (
    <>
      {/* la zona ancora «grezza» è scura e sta a destra del cursore: si restringe man mano che il cursore passa, e dietro resta il lavoro finito */}
      <rect x={4} y={4} width={352} height={142} rx={16} fill={SCURO} fillOpacity={0.7} style={{ ...T(0.1, 0.72), transformBox: 'fill-box', transformOrigin: 'right', transform: 'scaleX(calc((320 - 270 * var(--e)) / 352))' }} />
      <g transform="translate(300 18)"><g style={{ ...T(0.45, 0.75), opacity: 'calc(1 - var(--e))' }}>
        <rect width={34} height={14} rx={3} fill={VELO} stroke={CREMA} strokeOpacity={0.7} /><path d="M4 5h26M4 9h20" stroke={CREMA} strokeOpacity={0.5} />
      </g></g>
      <g transform="translate(24 16)"><g style={{ ...T(0.15, 0.45), opacity: 'var(--e)' }}>
        <rect x={0} y={0} width={26} height={8} rx={3} fill={CALDO} /><path d="M3 8v12M23 8v12" stroke={CALDO} strokeWidth={2.4} strokeLinecap="round" />
      </g></g>
      <g style={{ ...T(0.1, 0.72), transform: 'translate(calc(36px + 270px * var(--e)), 0)' }}>
        <path d="M0 6V144" stroke={CREMA} strokeWidth={2.2} strokeLinecap="round" />
        <circle cy={75} r={14} fill={BLU} stroke={CREMA} strokeWidth={1.6} />
        <path d="M-6 71l-4 4 4 4M6 71l4 4-4 4" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g style={Entra(0.74, 0.9, 0, 18)}>
        <rect x={104} y={108} width={152} height={30} rx={15} fill={BLU} />
        <path d="M120 126h24M124 122v8M132 124v4M140 122v8" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" />
        <Riga x={152} y={118} w={60} o={0.95} /><Riga x={152} y={126} w={38} o={0.6} />
        <g transform="translate(232 117)"><Spunta d="M0 0l3.5 3.5 7-8" stile={Disegna(0.84, 0.96, 20)} /></g>
      </g>
    </>
  )
}

/* ---------- Studi e professionisti · B · l'agenda: gli slot si riempiono uno alla volta, uno si prenota ---------- */
const OCCUPATI = [[0, 0], [1, 1], [2, 0], [3, 2], [4, 1], [0, 2], [3, 0]]
function Agenda() {
  return (
    <>
      <g style={Entra(0.0, 0.18, 0, 14)}>
        <rect x={36} y={10} width={288} height={130} rx={13} fill={SCURO} fillOpacity={0.8} stroke={CREMA} strokeOpacity={0.8} strokeWidth={1.3} />
        {[0, 1, 2, 3, 4].map((c) => <circle key={c} cx={80 + c * 52} cy={28} r={3} fill={CREMA} opacity={c === 2 ? 0.95 : 0.45} />)}
      </g>
      {[0, 1, 2, 3, 4].flatMap((c) => [0, 1, 2].map((r) => (
        <rect key={`${c}${r}`} x={58 + c * 52} y={42 + r * 30} width={44} height={22} rx={6} fill="none" stroke={CREMA} strokeOpacity={0.35} strokeWidth={1.1} />
      )))}
      {OCCUPATI.map(([c, r], i) => (
        <rect key={i} x={58 + c * 52} y={42 + r * 30} width={44} height={22} rx={6} fill={CREMA} style={{ ...T(0.1 + 0.07 * i, 0.2 + 0.07 * i), opacity: 'calc(0.28 * var(--e))' }} />
      ))}
      <g transform="translate(184 83)">
        <g style={{ ...T(0.6, 0.78), transformBox: 'fill-box', transformOrigin: 'center', transform: 'scale(calc(0.4 + 0.6 * var(--e)))', opacity: 'var(--e)' }}>
          <rect x={-22} y={-11} width={44} height={22} rx={6} fill={CALDO} />
        </g>
        <g transform="translate(14 8)"><g style={Entra(0.5, 0.62, 30, 18)}><path d="M0 0l2 18 6-6 5 11 4-2-5-11 8-1z" fill={CREMA} stroke={SCURO} strokeWidth={1} /></g></g>
        <g transform="translate(22 -14)"><g style={Entra(0.76, 0.9, 0, 0, 0.2)}><circle r={10} fill={BLU} /><g transform="translate(-5 1)"><Spunta d="M0 0l3 3 7-8" /></g></g></g>
      </g>
    </>
  )
}

/* ---------- Associazioni ed eventi · A · le luci della festa: le lucine si accendono, gli iscritti riempiono l'anello ---------- */
function Festa() {
  const punto = (t: number): [number, number] => [(1 - t) * (1 - t) * 12 + 2 * (1 - t) * t * 180 + t * t * 348, (1 - t) * (1 - t) * 18 + 2 * (1 - t) * t * 66 + t * t * 18]
  return (
    <>
      <path d="M12 18Q180 66 348 18" fill="none" stroke={CREMA} strokeOpacity={0.7} strokeWidth={1.4} strokeLinecap="round" style={Disegna(0.0, 0.2, 380)} />
      {Array.from({ length: 9 }, (_, i) => {
        const [x, y] = punto((i + 0.5) / 9)
        return (
          <g key={i} transform={`translate(${x.toFixed(1)} ${(y + 7).toFixed(1)})`}>
            <circle r={13} fill={CALDO} style={{ ...T(0.1 + 0.07 * i, 0.22 + 0.07 * i), opacity: 'calc(0.3 * var(--e))' }} />
            <circle r={5} fill={CALDO} style={{ ...T(0.1 + 0.07 * i, 0.22 + 0.07 * i), opacity: 'var(--e)' }} />
          </g>
        )
      })}
      <g transform="translate(290 98)">
        <g style={Entra(0.3, 0.46, 0, 0, 0.5)}>
          <circle r={32} fill={SCURO} fillOpacity={0.62} stroke={CREMA} strokeOpacity={0.3} strokeWidth={5} />
          <rect x={-14} y={-9} width={28} height={18} rx={3} fill={VELO} stroke={CREMA} strokeOpacity={0.9} strokeWidth={1.3} />
          <path d="M-3-9v18" stroke={CREMA} strokeOpacity={0.6} strokeDasharray="2 2" />
        </g>
        {Array.from({ length: 16 }, (_, i) => {
          const a = -Math.PI / 2 + (2 * Math.PI * i) / 16
          return <circle key={i} cx={Math.cos(a) * 32} cy={Math.sin(a) * 32} r={3.4} fill={i % 5 === 0 ? CALDO : BLU_CHIARO} style={{ ...T(0.42 + 0.025 * i, 0.5 + 0.025 * i), opacity: 'var(--e)' }} />
        })}
        <g transform="translate(30 -30)"><g style={Entra(0.86, 0.98, 0, 0, 0.2)}><circle r={10} fill={BLU} /><g transform="translate(-5 1)"><Spunta d="M0 0l3 3 7-8" /></g></g></g>
      </g>
    </>
  )
}


/* ===================== Contenuti · «per mestiere»: Prometheus accende il profilo (il lampo sviluppa i post, l'azione arriva) ===================== */
const VIOLA = '#c9b0ff'
const cuore = 'M0 6C-9-2-7-10 0-5 7-10 9-2 0 6z'
const Cuore = ({ x, y, a, b, s = 1 }: { x: number; y: number; a: number; b: number; s?: number }) => (
  <g transform={`translate(${x} ${y})`}><g style={{ ...T(a, b), transform: 'translate(0, calc(var(--e) * -46px))', opacity: 'calc(min(1, var(--e) * 5, (1 - var(--e)) * 3))' }}><path d={cuore} fill={CALDO} transform={`scale(${s})`} /></g></g>
)
const Pillola = ({ x, y, a, b }: { x: number; y: number; a: number; b: number }) => (
  <g transform={`translate(${x} ${y})`}>
    <g style={Entra(a, b, 0, 16)}>
      <rect width={150} height={30} rx={15} fill={BLU} />
      <Riga x={16} y={11} w={64} o={0.95} /><Riga x={16} y={19} w={40} o={0.6} />
      <g transform="translate(120 10)"><Spunta d="M0 0l3.5 3.5 8-9" stile={Disegna(a + 0.06, b + 0.1, 22)} /></g>
    </g>
  </g>
)
const Lampetto = ({ d, a, b }: { d: string; a: number; b: number }) => (
  <path d={d} fill="none" stroke={VIOLA} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" style={{ ...T(a, b), strokeDasharray: 300, strokeDashoffset: 'calc(300px * (1 - var(--e)))', opacity: 'calc(min(1, (1 - var(--e)) * 4 + 0.3 * var(--e)))' }} />
)

/* B&B · il carosello: camera, colazione, dintorni scorrono; poi la richiesta di disponibilità */
function CBnb() {
  return (
    <>
      <Lampetto d="M14 10L44 34 34 40 70 62" a={0.0} b={0.16} />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${28 + i * 84} 18)`}>
          <g style={{ ...T(0.1 + 0.12 * i, 0.26 + 0.12 * i), opacity: 'var(--e)', transform: `translate(calc((1 - var(--e)) * 50px), 0)` }}>
            <rect width={76} height={66} rx={9} fill="#0b1030" fillOpacity={0.8} stroke={CREMA} strokeOpacity={0.85} strokeWidth={1.2} />
            <rect x={6} y={6} width={64} height={38} rx={5} fill={[BLU, CALDO, BLU_CHIARO][i]} opacity={0.55} />
            <Riga x={6} y={50} w={44} />
          </g>
        </g>
      ))}
      {[0, 1, 2].map((i) => <circle key={i} cx={152 + i * 18} cy={100} r={3.2} fill={CREMA} opacity={0.3} />)}
      {[0, 1, 2].map((i) => <circle key={i} cx={152 + i * 18} cy={100} r={3.2} fill={BLU_CHIARO} style={{ ...T(0.3 + 0.14 * i, 0.4 + 0.14 * i), opacity: i === 2 ? 'var(--e)' : 'calc(var(--e) * (1 - var(--e)) * 4)' }} />)}
      <Pillola x={105} y={110} a={0.66} b={0.84} />
    </>
  )
}

/* Ristorante · il video dell'impasto: play, la barra del tempo, i cuori che salgono, il tavolo prenotato */
function CRistorante() {
  return (
    <>
      <Lampetto d="M20 12L52 38 42 44 78 66" a={0.0} b={0.16} />
      <g style={Entra(0.1, 0.3, 0, 18)}>
        <rect x={128} y={8} width={104} height={92} rx={13} fill="#0b1030" fillOpacity={0.78} stroke={CREMA} strokeOpacity={0.9} strokeWidth={1.4} />
        <path d="M168 34l26 15-26 15z" fill={CREMA} />
        <rect x={142} y={82} width={76} height={5} rx={2.5} fill={CREMA} opacity={0.25} />
        <rect x={142} y={82} width={76} height={5} rx={2.5} fill={CALDO} style={{ ...T(0.3, 0.8), transformBox: 'fill-box', transformOrigin: 'left', transform: 'scaleX(var(--e))' }} />
      </g>
      <Cuore x={252} y={86} a={0.34} b={0.7} s={1.3} /><Cuore x={272} y={92} a={0.42} b={0.8} /><Cuore x={236} y={92} a={0.5} b={0.88} s={0.9} />
      <Pillola x={105} y={108} a={0.66} b={0.84} />
    </>
  )
}

/* Negozio · il post «novità»: il prodotto, il cartellino, il tocco, il ritiro */
function CNegozio() {
  return (
    <>
      <Lampetto d="M16 10L48 36 38 42 76 64" a={0.0} b={0.16} />
      <g style={Entra(0.1, 0.3, 0, 18)}>
        <rect x={120} y={8} width={120} height={96} rx={12} fill="#0b1030" fillOpacity={0.8} stroke={CREMA} strokeOpacity={0.9} strokeWidth={1.3} />
        <rect x={130} y={18} width={100} height={52} rx={7} fill={BLU} opacity={0.45} />
        <circle cx={172} cy={44} r={14} fill={CALDO} opacity={0.9} /><circle cx={200} cy={52} r={9} fill={BLU_CHIARO} opacity={0.9} />
        <Riga x={130} y={80} w={58} /><Riga x={130} y={90} w={36} o={0.45} />
      </g>
      <g transform="translate(218 22)"><g style={Entra(0.34, 0.5, 0, 0, 0.3)}><path d="M0 0h22l8 9-8 9H0z" fill={CALDO} /><circle cx={6} cy={9} r={2.4} fill="#0b1030" /></g></g>
      <g transform="translate(184 62)"><g style={Entra(0.5, 0.62, 20, 22)}><path d="M0 0l2 18 6-6 5 11 4-2-5-11 8-1z" fill={CREMA} stroke="#0b1030" strokeWidth={1} /></g></g>
      <g transform="translate(268 60)"><g style={Entra(0.62, 0.76, -16)}><rect x={-14} y={-6} width={28} height={24} rx={4} fill={BLU} /><path d="M-6-6v-4a6 6 0 0112 0v4" fill="none" stroke={BLU} strokeWidth={2.4} /></g></g>
      <Pillola x={105} y={110} a={0.72} b={0.88} />
    </>
  )
}

/* Artigiano · il time-lapse: la tavola prende forma mentre la barra del tempo avanza, poi il sopralluogo */
function CArtigiano() {
  return (
    <>
      <Lampetto d="M18 10L50 36 40 42 78 64" a={0.0} b={0.16} />
      <g style={Entra(0.08, 0.26, 0, 14)}>
        <rect x={96} y={10} width={168} height={84} rx={12} fill="#0b1030" fillOpacity={0.78} stroke={CREMA} strokeOpacity={0.9} strokeWidth={1.3} />
      </g>
      <g style={{ ...T(0.15, 0.7), opacity: 'calc(1 - var(--e))' }}>
        <rect x={116} y={34} width={128} height={34} rx={4} fill={CREMA} opacity={0.28} /><path d="M122 44h112M122 52h96M122 60h104" stroke={CREMA} strokeOpacity={0.3} />
      </g>
      <g style={{ ...T(0.3, 0.8), opacity: 'var(--e)', transformBox: 'fill-box', transformOrigin: 'center', transform: 'scale(calc(0.85 + 0.15 * var(--e)))' }}>
        <rect x={130} y={26} width={100} height={42} rx={9} fill={CALDO} opacity={0.9} /><rect x={140} y={34} width={80} height={10} rx={5} fill="#fff" opacity={0.35} />
        <path d="M146 68v10M214 68v10" stroke={CALDO} strokeWidth={4} strokeLinecap="round" />
      </g>
      <rect x={110} y={82} width={140} height={5} rx={2.5} fill={CREMA} opacity={0.25} />
      <rect x={110} y={82} width={140} height={5} rx={2.5} fill={BLU_CHIARO} style={{ ...T(0.15, 0.8), transformBox: 'fill-box', transformOrigin: 'left', transform: 'scaleX(var(--e))' }} />
      <g transform="translate(284 26)"><g style={Entra(0.1, 0.24, 0, 0, 0.4)}><circle r={13} fill="none" stroke={CREMA} strokeWidth={1.6} /><path d="M0-7V0l5 3" {...tratto} /></g></g>
      <Pillola x={105} y={110} a={0.74} b={0.9} />
    </>
  )
}

/* Studi e professionisti · le pillole utili: scadenza, documenti, domanda frequente; sobrie, nessun effetto */
function CStudio() {
  const carte: [number, ReactNode][] = [
    [30, <g key="a"><rect x={-9} y={-9} width={18} height={18} rx={3} {...tratto} /><path {...tratto} d="M-9-3H9M-4-9v-3M4-9v-3" /></g>],
    [130, <g key="b"><path {...tratto} d="M-6-9h9l5 5v13H-6z" /><path {...tratto} d="M-3 0h8M-3 4h6" /></g>],
    [230, <g key="c"><circle {...tratto} r={9} /><path {...tratto} d="M-3-3a3 3 0 115 2c-1 1-2 2-2 4M0 6v1" /></g>],
  ]
  return (
    <>
      {carte.map(([x, icona], i) => (
        <g key={i} transform={`translate(${x} 18)`}>
          <g style={Entra(0.06 + 0.18 * i, 0.22 + 0.18 * i, 0, 18)}>
            <rect width={100} height={64} rx={10} fill="#0b1030" fillOpacity={0.82} stroke={CREMA} strokeOpacity={0.85} strokeWidth={1.2} />
            <circle cx={22} cy={22} r={13} fill={BLU} opacity={0.4} /><g transform="translate(22 22)">{icona}</g>
            <Riga x={44} y={17} w={46} /><Riga x={44} y={26} w={30} o={0.45} /><Riga x={12} y={46} w={70} o={0.55} />
          </g>
        </g>
      ))}
      <g transform="translate(330 22)"><g style={Entra(0.64, 0.78, 0, 0, 0.2)}><circle r={10} fill={BLU} /><g transform="translate(-5 1)"><Spunta d="M0 0l3 3 7-8" /></g></g></g>
      <Pillola x={105} y={108} a={0.7} b={0.86} />
    </>
  )
}

/* Eventi · la storia con la data, le condivisioni che partono, gli iscritti che arrivano */
function CEventi() {
  return (
    <>
      <Lampetto d="M16 10L48 36 38 42 76 64" a={0.0} b={0.16} />
      <g style={Entra(0.08, 0.28, 0, 18)}>
        <rect x={140} y={6} width={80} height={96} rx={13} fill="#0b1030" fillOpacity={0.78} stroke={CREMA} strokeOpacity={0.9} strokeWidth={1.4} />
        <rect x={152} y={20} width={56} height={34} rx={5} fill={CALDO} opacity={0.85} /><rect x={152} y={20} width={56} height={9} rx={4} fill="#c0482a" opacity={0.9} />
        <Riga x={152} y={64} w={46} /><Riga x={152} y={74} w={30} o={0.45} />
      </g>
      {[0, 1, 2].map((i) => (
        <g key={i} transform="translate(224 40)">
          <g style={{ ...T(0.34 + 0.1 * i, 0.58 + 0.1 * i), transform: `translate(calc(var(--e) * ${34 + i * 6}px), calc(var(--e) * ${(i - 1) * 26}px))`, opacity: 'calc(min(1, var(--e) * 6))' }}>
            <path d="M0 0l12 5-12 5 3-5z" fill={BLU_CHIARO} />
          </g>
        </g>
      ))}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${284 + i * 4} ${18 + i * 26})`}>
          <g style={Entra(0.5 + 0.1 * i, 0.64 + 0.1 * i, 0, 0, 0.3)}><circle r={10} fill={i === 1 ? CALDO : BLU} opacity={0.9} /><circle cy={-2} r={3.4} fill="#fff" opacity={0.8} /><path d="M-5 6a5 4 0 0110 0" fill="#fff" opacity={0.8} /></g>
        </g>
      ))}
      <Pillola x={105} y={110} a={0.74} b={0.9} />
    </>
  )
}

const SCENE: Record<string, () => ReactNode> = { bnb: Camera, ristorante: Tavolo, negozio: Ritiro, artigiano: PrimaDopo, studio: Agenda, eventi: Festa, 'c-bnb': CBnb, 'c-ristorante': CRistorante, 'c-negozio': CNegozio, 'c-artigiano': CArtigiano, 'c-studio': CStudio, 'c-eventi': CEventi }

/** foto del mestiere nel vetro, sotto la scena; `foto` può mancare (la scena regge anche senza) */
export default function ScenaMestiere({ id, foto }: { id: string; foto?: string }) {
  const Scena = SCENE[id]
  if (!Scena) return null
  return (
    <svg className="vignetta scena-mestiere" viewBox="0 0 360 150" preserveAspectRatio="xMidYMid meet" role="presentation" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="sm-clip"><rect x={4} y={4} width={352} height={142} rx={16} /></clipPath>
        <linearGradient id="sm-velo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#060a28" stopOpacity={0.3} /><stop offset="1" stopColor="#060a28" stopOpacity={0.62} /></linearGradient>
      </defs>
      <g clipPath="url(#sm-clip)">
        {foto ? <image href={foto} x={4} y={-40} width={352} height={230} preserveAspectRatio="xMidYMid slice" /> : <rect x={4} y={4} width={352} height={142} fill="#0b1030" />}
        <rect x={4} y={4} width={352} height={142} fill="url(#sm-velo)" />
        <g clipPath="url(#sm-clip)"><Scena /></g>
      </g>
      <rect x={4} y={4} width={352} height={142} rx={16} fill="none" strokeOpacity={0.75} strokeWidth={1.5} style={{ stroke: 'var(--accento-blocco, #35e0f0)' }} />
    </svg>
  )
}
