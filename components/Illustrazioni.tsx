/**
 * Illustrazioni SVG disegnate su misura, inline.
 *
 * Perche inline e non immagini: zero richieste di rete, nitidezza perfetta a
 * ogni densita di schermo, e il colore segue il tema perche usa le variabili
 * CSS del sistema di design. Le librerie di illustrazioni gratuite sono il
 * segnale piu immediato di un sito fatto in fretta: si riconoscono a colpo
 * d'occhio perche le ha gia usate mezzo mondo.
 *
 * Linguaggio visivo comune: tratto 1.5, estremi arrotondati, struttura in
 * slate, percorso automatizzato in blu, tempo che passa in tratteggio.
 */

type Props = { className?: string }

const INK = 'var(--ink)'
const SLATE = 'var(--slate-2)'
const BLU = 'var(--blu)'
const ARANCIO = 'var(--arancio)'
const KO = 'var(--arancio)'

/** `id` deve essere unico: sei SVG nella stessa pagina con lo stesso id di
 *  pattern sono HTML non valido e tutti finirebbero per riferirsi al primo. */
function Base({ id, children, className }: { id: string; children: React.ReactNode; className?: string }) {
  const grid = `griglia-${id}`
  return (
    <svg
      viewBox="0 0 480 300"
      fill="none"
      role="img"
      className={className}
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      <defs>
        <pattern id={grid} width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill={SLATE} opacity="0.28" />
        </pattern>
      </defs>
      <rect width="480" height="300" rx="18" fill={`url(#${grid})`} opacity="0.5" />
      {children}
    </svg>
  )
}

/* ---------- M1 · Recupero Preventivi ------------------------------------ */
export function IllPreventivi({ className }: Props) {
  return (
    <Base id="preventivi" className={className}>
      <title>Un preventivo fermo riceve tre messaggi in ventun giorni e il paziente risponde</title>

      {/* il preventivo fermo */}
      <rect x="24" y="86" width="112" height="128" rx="12" fill="var(--paper-2)" stroke={SLATE} strokeWidth="1.5" />
      <rect x="40" y="106" width="64" height="7" rx="3.5" fill={INK} opacity="0.75" />
      <rect x="40" y="123" width="80" height="5" rx="2.5" fill={SLATE} opacity="0.7" />
      <rect x="40" y="136" width="56" height="5" rx="2.5" fill={SLATE} opacity="0.7" />
      <rect x="40" y="163" width="52" height="24" rx="6" fill={ARANCIO} opacity="0.16" />
      <text x="50" y="179" fontSize="13" fontWeight="600" fill={ARANCIO} fontFamily="ui-sans-serif, system-ui">2.400</text>

      {/* le tre onde nel tempo */}
      {[
        { y: 76, label: '+2', d: 'M148 150 C 186 150, 196 84, 236 84' },
        { y: 142, label: '+7', d: 'M148 150 C 190 150, 196 150, 236 150' },
        { y: 208, label: '+21', d: 'M148 150 C 186 150, 196 216, 236 216' },
      ].map((s, i) => (
        <g key={s.label}>
          <path d={s.d} stroke={BLU} strokeWidth="1.5" strokeDasharray="4 5" opacity={0.85 - i * 0.15} />
          <rect x="236" y={s.y} width="104" height="34" rx="9" fill="var(--paper-2)" stroke={BLU} strokeWidth="1.5" opacity={1 - i * 0.12} />
          <rect x="250" y={s.y + 11} width="52" height="5" rx="2.5" fill={SLATE} opacity="0.8" />
          <rect x="250" y={s.y + 21} width="34" height="4" rx="2" fill={SLATE} opacity="0.5" />
          <text x="200" y={s.y + 28} fontSize="11" fontWeight="600" fill={BLU} fontFamily="ui-sans-serif, system-ui" textAnchor="middle">
            {s.label}
          </text>
        </g>
      ))}

      {/* la risposta che torna */}
      <path d="M348 216 C 392 216, 398 152, 432 152" stroke={BLU} strokeWidth="2" />
      <circle cx="436" cy="150" r="20" fill={BLU} />
      <path d="M428 150 l6 6 l12 -13" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </Base>
  )
}

/* ---------- M2 · Segreteria AI ------------------------------------------ */
export function IllSegreteria({ className }: Props) {
  return (
    <Base id="segreteria" className={className}>
      <title>Una chiamata fuori orario viene raccolta e trasformata in una scheda per la segreteria</title>

      {/* chiamata in arrivo, con le onde che arrivano da sinistra */}
      {[
        { d: 'M40 132 A 22 22 0 0 0 40 168', o: 0.5 },
        { d: 'M32 122 A 34 34 0 0 0 32 178', o: 0.34 },
        { d: 'M24 112 A 46 46 0 0 0 24 188', o: 0.2 },
      ].map((w) => (
        <path key={w.d} d={w.d} stroke={BLU} strokeWidth="1.6" strokeLinecap="round" opacity={w.o} />
      ))}

      <rect x="48" y="106" width="84" height="88" rx="14" fill="var(--paper-2)" stroke={SLATE} strokeWidth="1.5" />
      <path
        d="M76 134 c0 18 13 31 31 31 v-12 l-13 -5 -7 7 c-5 -4 -10 -8 -13 -13 l7 -7 -5 -13 h-12 z"
        fill={INK}
        opacity="0.78"
      />
      <text x="90" y="92" fontSize="11" fill={SLATE} fontFamily="ui-sans-serif, system-ui" textAnchor="middle">
        19:42
      </text>

      {/* l'assistente */}
      <path d="M132 150 H 168" stroke={BLU} strokeWidth="1.5" strokeDasharray="4 5" />
      <circle cx="210" cy="150" r="42" fill="var(--paper-2)" stroke={BLU} strokeWidth="1.5" />
      <circle cx="210" cy="150" r="30" fill={BLU} opacity="0.1" />
      {[-14, -5, 4, 13].map((dx, i) => (
        <rect
          key={dx}
          x={210 + dx - 2}
          y={150 - [10, 17, 13, 7][i]}
          width="4"
          height={[20, 34, 26, 14][i]}
          rx="2"
          fill={BLU}
        />
      ))}

      {/* uscite: scheda alla segreteria + urgenza */}
      <path d="M252 138 C 282 138, 286 96, 318 96" stroke={BLU} strokeWidth="1.5" strokeDasharray="4 5" />
      <path d="M252 162 C 282 162, 286 210, 318 210" stroke={BLU} strokeWidth="1.5" strokeDasharray="4 5" />

      <rect x="318" y="66" width="136" height="72" rx="12" fill="var(--paper-2)" stroke={SLATE} strokeWidth="1.5" />
      <rect x="334" y="84" width="46" height="6" rx="3" fill={INK} opacity="0.75" />
      <rect x="334" y="99" width="88" height="5" rx="2.5" fill={SLATE} opacity="0.65" />
      <rect x="334" y="112" width="66" height="5" rx="2.5" fill={SLATE} opacity="0.65" />

      <rect x="318" y="180" width="136" height="60" rx="12" fill="var(--paper-2)" stroke={ARANCIO} strokeWidth="1.5" />
      <circle cx="340" cy="210" r="9" fill={ARANCIO} opacity="0.2" />
      <path d="M340 205 v6 M340 215 v1" stroke={ARANCIO} strokeWidth="2.2" strokeLinecap="round" />
      <rect x="358" y="200" width="72" height="6" rx="3" fill={INK} opacity="0.7" />
      <rect x="358" y="214" width="50" height="5" rx="2.5" fill={SLATE} opacity="0.6" />
    </Base>
  )
}

/* ---------- M3 · Richiami e Riattivazione -------------------------------- */
export function IllRichiami({ className }: Props) {
  return (
    <Base id="richiami" className={className}>
      <title>I pazienti vengono divisi per data dell ultima visita e ricevono messaggi diversi</title>

      <path d="M40 190 H 440" stroke={SLATE} strokeWidth="1.5" />
      {[
        { x: 96, l: '6 mesi' },
        { x: 208, l: '12 mesi' },
        { x: 320, l: '18 mesi' },
        { x: 418, l: '24+' },
      ].map((t) => (
        <g key={t.l}>
          <path d={`M${t.x} 184 v12`} stroke={SLATE} strokeWidth="1.5" />
          <text x={t.x} y="216" fontSize="11" fill={SLATE} textAnchor="middle" fontFamily="ui-sans-serif, system-ui">
            {t.l}
          </text>
        </g>
      ))}

      {/* gruppo richiamo */}
      <rect x="56" y="70" width="176" height="94" rx="14" fill={BLU} opacity="0.08" />
      <text x="72" y="94" fontSize="11" fontWeight="600" fill={BLU} fontFamily="ui-sans-serif, system-ui" letterSpacing="1.4">
        RICHIAMO
      </text>
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={82 + i * 32} cy={130} r="11" fill="var(--paper-2)" stroke={BLU} strokeWidth="1.5" />
      ))}

      {/* gruppo dormiente */}
      <rect x="252" y="70" width="176" height="94" rx="14" fill={SLATE} opacity="0.1" />
      <text x="268" y="94" fontSize="11" fontWeight="600" fill={SLATE} fontFamily="ui-sans-serif, system-ui" letterSpacing="1.4">
        DORMIENTE
      </text>
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={278 + i * 32} cy={130} r="11" fill="var(--paper-2)" stroke={SLATE} strokeWidth="1.5" strokeDasharray="3 3" />
      ))}

      {/* due messaggi diversi */}
      <path d="M144 164 V 186" stroke={BLU} strokeWidth="1.5" strokeDasharray="4 4" />
      <path d="M340 164 V 186" stroke={SLATE} strokeWidth="1.5" strokeDasharray="4 4" />
      <rect x="96" y="238" width="96" height="30" rx="8" fill="var(--paper-2)" stroke={BLU} strokeWidth="1.5" />
      <rect x="110" y="250" width="50" height="5" rx="2.5" fill={BLU} opacity="0.7" />
      <rect x="292" y="238" width="96" height="30" rx="8" fill="var(--paper-2)" stroke={SLATE} strokeWidth="1.5" />
      <rect x="306" y="250" width="50" height="5" rx="2.5" fill={SLATE} opacity="0.7" />
    </Base>
  )
}

/* ---------- M4 · Anti-No-Show -------------------------------------------- */
export function IllNoShow({ className }: Props) {
  return (
    <Base id="noshow" className={className}>
      <title>Uno slot disdetto viene proposto al primo paziente compatibile in lista d attesa</title>

      {/* agenda */}
      <rect x="28" y="44" width="180" height="216" rx="14" fill="var(--paper-2)" stroke={SLATE} strokeWidth="1.5" />
      <text x="48" y="72" fontSize="11" fill={SLATE} letterSpacing="1.4" fontFamily="ui-sans-serif, system-ui">
        AGENDA
      </text>
      {[0, 1, 2, 3].map((i) => {
        const y = 92 + i * 42
        const vuoto = i === 2
        return (
          <g key={i}>
            <rect
              x="48"
              y={y}
              width="140"
              height="32"
              rx="8"
              fill={vuoto ? 'transparent' : BLU}
              fillOpacity={vuoto ? 0 : 0.1}
              stroke={vuoto ? KO : BLU}
              strokeWidth="1.5"
              strokeDasharray={vuoto ? '5 4' : undefined}
            />
            {!vuoto && <rect x="62" y={y + 13} width="62" height="5" rx="2.5" fill={BLU} opacity="0.75" />}
            {vuoto && (
              <text x="118" y={y + 21} fontSize="11" fill={KO} textAnchor="middle" fontFamily="ui-sans-serif, system-ui">
                disdetto
              </text>
            )}
          </g>
        )
      })}

      {/* percorso di riempimento */}
      <path d="M208 176 C 252 176, 250 236, 292 236" stroke={BLU} strokeWidth="2" />
      <path d="M292 236 l-9 -5 v10 z" fill={BLU} transform="rotate(180 292 236)" />

      {/* lista d'attesa */}
      <text x="300" y="72" fontSize="11" fill={SLATE} letterSpacing="1.4" fontFamily="ui-sans-serif, system-ui">
        LISTA D’ATTESA
      </text>
      {[0, 1, 2].map((i) => {
        const y = 92 + i * 52
        const scelto = i === 2
        return (
          <g key={i}>
            <rect
              x="300"
              y={y}
              width="152"
              height="40"
              rx="10"
              fill="var(--paper-2)"
              stroke={scelto ? BLU : SLATE}
              strokeWidth="1.5"
            />
            <circle cx="322" cy={y + 20} r="10" fill={scelto ? BLU : SLATE} opacity={scelto ? 0.18 : 0.12} />
            <rect x="342" y={y + 12} width="60" height="5" rx="2.5" fill={INK} opacity="0.7" />
            <rect x="342" y={y + 24} width="42" height="4" rx="2" fill={SLATE} opacity="0.6" />
            {scelto && (
              <>
                <circle cx="438" cy={y + 20} r="11" fill={BLU} />
                <path d={`M432 ${y + 20} l4.5 4.5 l9 -10`} stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </>
            )}
          </g>
        )
      })}
    </Base>
  )
}

/* ---------- M5 · Recensioni Google --------------------------------------- */
export function IllRecensioni({ className }: Props) {
  const stella = (cx: number, cy: number, r: number, pieno: boolean) => {
    const pts = Array.from({ length: 10 }, (_, i) => {
      const ang = (Math.PI / 5) * i - Math.PI / 2
      const rad = i % 2 === 0 ? r : r * 0.44
      return `${(cx + rad * Math.cos(ang)).toFixed(1)},${(cy + rad * Math.sin(ang)).toFixed(1)}`
    }).join(' ')
    return <polygon points={pts} fill={pieno ? ARANCIO : 'none'} stroke={ARANCIO} strokeWidth="1.2" opacity={pieno ? 1 : 0.4} />
  }

  return (
    <Base id="recensioni" className={className}>
      <title>La richiesta va a tutti i pazienti e il titolare approva le bozze di risposta</title>

      {/* invio a tutti, stesso messaggio */}
      <circle cx="58" cy="150" r="24" fill={BLU} opacity="0.12" />
      <circle cx="58" cy="150" r="24" stroke={BLU} strokeWidth="1.5" />
      <path d="M48 150 h20 M60 142 l8 8 l-8 8" stroke={BLU} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {[78, 150, 222].map((y, i) => (
        <g key={y}>
          <path d={`M84 150 C 116 150, 116 ${y}, 148 ${y}`} stroke={BLU} strokeWidth="1.5" strokeDasharray="4 5" opacity="0.9" />
          <circle cx="160" cy={y} r="11" fill="var(--paper-2)" stroke={BLU} strokeWidth="1.5" />
          <circle cx="160" cy={y - 3} r="3.4" fill={BLU} opacity="0.75" />
          <path d={`M154.5 ${y + 6} a 6 6 0 0 1 11 0`} fill={BLU} opacity="0.75" />
        </g>
      ))}
      <text x="128" y="278" fontSize="11" fill={SLATE} textAnchor="middle" fontFamily="ui-sans-serif, system-ui">
        stesso messaggio a tutti
      </text>

      {/* recensione positiva */}
      <rect x="208" y="52" width="244" height="72" rx="12" fill="var(--paper-2)" stroke={SLATE} strokeWidth="1.5" />
      {[0, 1, 2, 3, 4].map((i) => stella(230 + i * 20, 78, 8, true))}
      <rect x="228" y="96" width="180" height="5" rx="2.5" fill={SLATE} opacity="0.6" />
      <rect x="228" y="107" width="120" height="5" rx="2.5" fill={SLATE} opacity="0.45" />

      {/* recensione critica + bozza */}
      <rect x="208" y="146" width="244" height="112" rx="12" fill="var(--paper-2)" stroke={ARANCIO} strokeWidth="1.5" />
      {[0, 1, 2, 3, 4].map((i) => stella(230 + i * 20, 172, 8, i < 2))}
      <rect x="228" y="190" width="164" height="5" rx="2.5" fill={SLATE} opacity="0.6" />
      <rect x="228" y="201" width="96" height="5" rx="2.5" fill={SLATE} opacity="0.45" />
      <rect x="228" y="218" width="204" height="30" rx="8" fill={BLU} opacity="0.1" />
      <text x="240" y="238" fontSize="11" fontWeight="600" fill={BLU} fontFamily="ui-sans-serif, system-ui">
        bozza di risposta pronta
      </text>
    </Base>
  )
}

/* ---------- M6 · Assistente Fondi Sanitari ------------------------------- */
export function IllFondi({ className }: Props) {
  return (
    <Base id="fondi" className={className}>
      <title>Il fondo del paziente viene registrato e la pratica arriva pronta alla segreteria</title>

      {/* tessera del fondo */}
      <rect x="28" y="92" width="150" height="96" rx="12" fill={INK} />
      <rect x="46" y="112" width="58" height="6" rx="3" fill="#fff" opacity="0.85" />
      <rect x="46" y="128" width="96" height="4" rx="2" fill="#fff" opacity="0.4" />
      <rect x="46" y="156" width="40" height="16" rx="4" fill={BLU} />
      <text x="52" y="168" fontSize="9" fontWeight="600" fill="#fff" fontFamily="ui-sans-serif, system-ui">
        DIRETTA
      </text>

      <path d="M178 140 H 226" stroke={BLU} strokeWidth="1.5" strokeDasharray="4 5" />
      <path d="M226 140 l-9 -5 v10 z" fill={BLU} transform="rotate(180 226 140)" />

      {/* checklist della pratica */}
      <rect x="236" y="44" width="216" height="180" rx="14" fill="var(--paper-2)" stroke={SLATE} strokeWidth="1.5" />
      <text x="256" y="72" fontSize="11" fill={SLATE} letterSpacing="1.4" fontFamily="ui-sans-serif, system-ui">
        DOCUMENTI PRATICA
      </text>
      {[0, 1, 2, 3].map((i) => {
        const y = 94 + i * 32
        return (
          <g key={i}>
            <rect x="256" y={y} width="17" height="17" rx="5" fill={BLU} opacity="0.14" />
            <path d={`M260 ${y + 8.5} l4 4 l8 -8.5`} stroke={BLU} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="285" y={y + 5} width={[128, 104, 140, 92][i]} height="6" rx="3" fill={SLATE} opacity="0.62" />
          </g>
        )
      })}

      {/* limite di scopo dichiarato */}
      <rect x="236" y="240" width="216" height="36" rx="10" fill={ARANCIO} opacity="0.12" />
      <path d="M258 252 v6 M258 262 v1" stroke={ARANCIO} strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="258" cy="258" r="11" stroke={ARANCIO} strokeWidth="1.4" />
      <text x="278" y="262" fontSize="11" fill={ARANCIO} fontWeight="600" fontFamily="ui-sans-serif, system-ui">
        prepara, non invia al portale
      </text>
    </Base>
  )
}

export const ILLUSTRAZIONI: Record<string, (p: Props) => JSX.Element> = {
  preventivi: IllPreventivi,
  segreteria: IllSegreteria,
  richiami: IllRichiami,
  'no-show': IllNoShow,
  recensioni: IllRecensioni,
  fondi: IllFondi,
}
