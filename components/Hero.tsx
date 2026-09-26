const PROVE = [
  { ora: '08:40', cosa: 'Chiamata', esito: 'nessuna risposta, 8 squilli', ko: true },
  { ora: '13:15', cosa: 'Chiamata', esito: 'segreteria telefonica', ko: true },
  { ora: '19:30', cosa: 'Chiamata', esito: 'nessuna risposta', ko: true },
  { ora: '09:12', cosa: 'WhatsApp', esito: 'nessuna risposta dopo 26 ore', ko: true },
  { ora: '—', cosa: 'Profilo Google', esito: '34 recensioni, ultima a maggio', ko: false },
]

/**
 * Hero su fondo chiaro.
 *
 * Il fondo scuro reggeva meglio l'effetto scenico, ma su un compratore
 * sanitario prudente la carta chiara comunica piu affidabilita. La profondita
 * qui la danno l'alone morbido e la trama di punti, non il contrasto del fondo.
 *
 * Titolo costruito sulla regola delle due frasi ricavata dai tre player
 * americani analizzati: due proposizioni brevi separate da un punto, sette
 * parole in tutto, nessuna subordinata. Ogni riga sale da dietro una maschera.
 */
const RIGHE = ['Perde fatturato', 'ogni settimana.']

export default function Hero() {
  return (
    <section id="top" className="grana alone relative overflow-hidden">
      <div className="wrap relative grid items-center gap-14 pb-[clamp(5rem,10vw,8rem)] pt-[clamp(8rem,16vw,12rem)] lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        <div>
          <span className="occhiello rivela">Studi dentistici privati · Romagna</span>
          <div className="filetto mt-5" />

          <h1 className="serif mt-7 text-s5">
            {RIGHE.map((r) => (
              <span className="riga" key={r}>
                <span>{r}</span>
              </span>
            ))}
            <span className="riga">
              <span className="text-[var(--blu)]">Le mostro quanto.</span>
            </span>
          </h1>

          <p className="rivela rit-1 misura mt-8 text-s1 leading-[1.5] text-[var(--slate)]">
            Chiamate senza risposta, preventivi fermi da mesi, poltrone vuote. Prima lo misuro sul suo
            studio. Poi lo recuperiamo, e lo contiamo insieme ogni mese.
          </p>

          <div className="rivela rit-2 mt-10 flex flex-col gap-3 sm:flex-row">
            <a href="#verifica" className="btn btn-primario">
              Richiedi la verifica gratuita
              <Freccia />
            </a>
            <a href="#servizi" className="btn btn-fantasma">
              Guarda cosa facciamo
            </a>
          </div>

          <p className="rivela rit-3 mt-7 text-s-1 text-[var(--slate)]">
            Trenta minuti di lavoro, nessun impegno, nessun accesso ai suoi dati.
          </p>
        </div>

        {/* Il pannello della verifica: mostra il prodotto d’ingresso reale,
            non un mockup generico di dashboard. */}
        <div className="rivela-scala rit-1">
          <div className="card p-6 shadow-[0_34px_80px_-46px_rgba(8,13,24,.45)] sm:p-8">
            <div className="flex items-baseline justify-between gap-4">
              <span className="occhiello !text-[var(--blu)]">Verifica gratuita</span>
              <span className="num text-s-2 text-[var(--slate)]">esempio reale</span>
            </div>

            <h2 className="serif mt-4 text-s2">Studio a due poltrone, provincia di Ravenna</h2>

            <ul className="mt-7">
              {PROVE.map((p, i) => (
                <li
                  key={i}
                  className="flex items-center gap-4 border-t border-[var(--bordo)] py-3.5 first:border-t-0 first:pt-0"
                >
                  <span className="num w-12 shrink-0 text-s-2 text-[var(--slate)]">{p.ora}</span>
                  <span className="w-[6.5rem] shrink-0 text-s-1 font-medium">{p.cosa}</span>
                  <span className="flex-1 text-s-1 text-[var(--slate)]">{p.esito}</span>
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: p.ko ? 'var(--arancio)' : 'var(--slate-2)' }}
                  />
                </li>
              ))}
            </ul>

            <div
              className="mt-7 flex items-start gap-3 rounded-2xl p-4"
              style={{ background: 'var(--blu-tenue)' }}
            >
              <span
                aria-hidden="true"
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                style={{ background: 'var(--blu)' }}
              />
              <p className="text-s-1 text-[var(--slate)]">
                Questi sono <strong className="font-medium text-[var(--blu-3)]">dati misurati</strong>, con
                l’ora dell’osservazione. Le stime stanno in una sezione separata del report, e portano scritto
                che sono stime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Freccia() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
