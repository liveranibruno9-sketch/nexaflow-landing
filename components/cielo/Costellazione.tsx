import type { CostellazioneDisegnata, Lato } from './stelle'

/** posizione del numero rispetto alla stella, in unita del viewBox */
function posizioneNumero(lato: Lato, r: number) {
  const d = r + 2.2
  const tabella: Record<Lato, { x: number; y: number; textAnchor: 'start' | 'middle' | 'end' }> = {
    n: { x: 0, y: -d - 0.6, textAnchor: 'middle' },
    ne: { x: d, y: -d + 0.6, textAnchor: 'start' },
    e: { x: d + 0.4, y: 1.3, textAnchor: 'start' },
    se: { x: d, y: d + 2.4, textAnchor: 'start' },
    s: { x: 0, y: d + 3.2, textAnchor: 'middle' },
    so: { x: -d, y: d + 2.4, textAnchor: 'end' },
    o: { x: -d - 0.4, y: 1.3, textAnchor: 'end' },
    no: { x: -d, y: -d + 0.6, textAnchor: 'end' },
  }
  return tabella[lato]
}

export type Fase = 'buio' | 'collegamento' | 'luce'

/**
 * Disegno SVG di una costellazione. Nessuno stato interno: riceve la fase e
 * quanti passi sono accesi, e il resto lo fanno le transizioni CSS
 * (classi .cost in globals.css).
 *
 * - buio: le stelle ci sono ma sono spente e arancioni. I punti esistono,
 *   nessuno li collega.
 * - collegamento: si accendono nell'ordine del flusso; una linea compare
 *   quando entrambe le sue stelle sono accese.
 * - luce: figura completa, l'ultima stella diventa gialla.
 *
 * Le stelle sono gruppi SVG, non elementi interattivi: l'informazione vive
 * nell'elenco dei passi in HTML accanto al disegno.
 */
export default function Costellazione({
  cost,
  fase,
  accese,
  idBase,
  compatta = false,
  scelto = null,
  onScegli,
  etichetta,
}: {
  cost: CostellazioneDisegnata
  fase: Fase
  accese: number
  /** prefisso univoco per gli id dei gradienti: due istanze non devono collidere */
  idBase: string
  compatta?: boolean
  scelto?: number | null
  onScegli?: (passo: number) => void
  etichetta: string
}) {
  const aloneBianco = `${idBase}-alone`
  const aloneGiallo = `${idBase}-alone-g`
  const tutto = fase === 'luce'

  const statoStella = (passo: number | null) => {
    if (tutto) return passo === cost.totale ? 'finale' : 'accesa'
    if (passo !== null && passo <= accese) return 'accesa'
    return 'spenta'
  }

  return (
    <svg
      viewBox={`0 0 ${cost.larghezza} ${cost.altezza}`}
      className={`cost ${compatta ? 'cost--compatta' : ''}`}
      data-fase={fase}
      role="img"
      aria-label={etichetta}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <radialGradient id={aloneBianco}>
          <stop offset="0%" style={{ stopColor: 'var(--accento)' }} stopOpacity="0.55" />
          <stop offset="100%" style={{ stopColor: 'var(--accento)' }} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={aloneGiallo}>
          <stop offset="0%" style={{ stopColor: 'var(--verde)' }} stopOpacity="0.7" />
          <stop offset="100%" style={{ stopColor: 'var(--verde)' }} stopOpacity="0" />
        </radialGradient>
      </defs>

      <g className="cost-linee">
        {cost.linee.map((l) => {
          const accesa = tutto || l.passo <= accese
          return (
            <line
              key={`${l.da.id}-${l.a.id}`}
              x1={l.da.x}
              y1={l.da.y}
              x2={l.a.x}
              y2={l.a.y}
              pathLength={1}
              className={l.tratteggiata ? 'linea linea--tratteggiata' : 'linea'}
              data-accesa={accesa}
            />
          )
        })}
      </g>

      <g className="cost-stelle">
        {cost.stelle.map((s) => {
          const stato = statoStella(s.passo)
          const corrente = fase === 'collegamento' && s.passo === accese
          const evidenziata = scelto !== null && s.passo === scelto
          const cliccabile = !compatta && s.passo !== null && onScegli
          return (
            <g
              key={s.id}
              className="stella"
              data-stato={stato}
              data-corrente={corrente || evidenziata}
              transform={`translate(${s.x} ${s.y})`}
              onClick={cliccabile ? () => onScegli!(s.passo!) : undefined}
              style={cliccabile ? { cursor: 'pointer' } : undefined}
            >
              <title>{s.passo ? `${s.passo}. ${s.nome}` : s.nome}</title>
              {/* area di tocco piu grande del disegno, per le dita */}
              {cliccabile ? <circle r={7} fill="transparent" /> : null}
              <circle
                className="stella-alone"
                r={s.r * 4.2}
                fill={`url(#${stato === 'finale' ? aloneGiallo : aloneBianco})`}
              />
              <circle className="stella-anello" r={s.r + 2.4} />
              <circle className="stella-nucleo" r={s.r} />
              {!compatta && s.passo !== null ? (
                <text className="stella-numero" {...posizioneNumero(s.lato, s.r)}>
                  {s.passo}
                </text>
              ) : null}
            </g>
          )
        })}
      </g>
    </svg>
  )
}
