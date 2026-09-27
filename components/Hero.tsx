import Image from 'next/image'

const PROVE = [
  { ora: '08:40', cosa: 'Chiamata', esito: 'nessuna risposta, 8 squilli', ko: true },
  { ora: '13:15', cosa: 'Chiamata', esito: 'segreteria telefonica', ko: true },
  { ora: '19:30', cosa: 'Chiamata', esito: 'nessuna risposta', ko: true },
  { ora: '09:12', cosa: 'WhatsApp', esito: 'nessuna risposta dopo 26 ore', ko: true },
  { ora: '—', cosa: 'Profilo Google', esito: '34 recensioni, ultima a maggio', ko: false },
]

/**
 * Partenza. La foto e la "Cosmic Cliffs" della Nebulosa della Carena (Webb):
 * blu sopra, arancio sotto, la palette del sito esiste gia in natura.
 * Le scogliere fanno da orizzonte, il titolo sta nel blu.
 *
 * Titolo con la regola delle due frasi: due proposizioni brevi separate da un
 * punto, sette parole, nessuna subordinata. La metafora e tutta qui: il resto
 * del testo resta sobrio.
 */
export default function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <Image
          src="/cielo/carena.jpg"
          alt=""
          fill
          priority
          quality={55}
          sizes="100vw"
          className="object-cover object-[50%_78%] opacity-60 lg:object-[50%_70%]"
        />
        {/* sfumature: il nav in alto, il testo a sinistra, e l'uscita nello spazio in basso */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#05070F_0%,rgba(5,7,15,0.55)_22%,rgba(5,7,15,0.35)_55%,#05070F_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_20%_40%,rgba(5,7,15,0.8),transparent_70%)]" />
      </div>

      <div className="wrap grid min-h-[100svh] items-center gap-14 pb-[clamp(5rem,10vw,8rem)] pt-[clamp(8rem,16vw,11rem)] lg:grid-cols-[1.08fr_0.92fr] lg:gap-20">
        <div>
          <span className="occhiello rivela">Studi dentistici privati · Romagna</span>
          <div className="filetto mt-5" />

          <h1 className="serif mt-7 text-s6 leading-[0.98] lg:text-s5">
            <span className="riga">
              <span>Colleghiamo i punti.</span>
            </span>
            <span className="riga">
              <span className="text-[var(--blu-luce)]">Lei ritrova i pazienti.</span>
            </span>
          </h1>

          <p className="rivela rit-1 misura mt-8 text-s1 leading-[1.5] text-[color-mix(in_srgb,#F2F5FF_80%,transparent)]">
            Chiamate senza risposta, preventivi fermi da mesi, poltrone vuote. Prima lo misuro sul suo studio.
            Poi lo recuperiamo, e lo contiamo insieme ogni mese.
          </p>

          <div className="rivela rit-2 mt-10 flex flex-col gap-3 sm:flex-row">
            <a href="#verifica" className="btn btn-primario">
              Richiedi la verifica gratuita
              <Freccia />
            </a>
            <a href="#cielo" className="btn btn-fantasma">
              Guarda cosa facciamo
            </a>
          </div>

          <p className="rivela rit-3 mt-7 text-s-1 tenue">
            Trenta minuti di lavoro, nessun impegno, nessun accesso ai suoi dati.
          </p>
        </div>

        {/* Lettura di bordo: il prodotto d'ingresso reale, la verifica gratuita */}
        <div className="rivela-scala rit-1">
          <div className="vetro rounded-xl3 p-6 shadow-[0_40px_90px_-40px_rgba(0,0,0,.9)] sm:p-8">
            <div className="flex items-baseline justify-between gap-4">
              <span className="occhiello">Verifica gratuita</span>
              <span className="mono text-s-2 tenue">esempio di report</span>
            </div>

            <h2 className="serif mt-4 text-s2">Studio a due poltrone, provincia di Ravenna</h2>

            <ul className="mt-7">
              {PROVE.map((p, i) => (
                <li
                  key={i}
                  className="flex items-center gap-4 border-t border-[var(--bordo)] py-3.5 first:border-t-0 first:pt-0"
                >
                  <span className="mono num w-12 shrink-0 text-s-2 text-[var(--celeste)]">{p.ora}</span>
                  <span className="w-[6.5rem] shrink-0 text-s-1 font-medium">{p.cosa}</span>
                  <span className="flex-1 text-s-1 tenue">{p.esito}</span>
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{
                      background: p.ko ? 'var(--arancio)' : 'var(--neutro)',
                      boxShadow: p.ko ? '0 0 10px var(--arancio)' : 'none',
                    }}
                  />
                </li>
              ))}
            </ul>

            <div className="mt-7 flex items-start gap-3 rounded-2xl border border-[var(--bordo)] bg-[color-mix(in_srgb,#FFE24A_6%,transparent)] p-4">
              <span
                aria-hidden="true"
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                style={{ background: 'var(--giallo)', boxShadow: '0 0 12px var(--giallo)' }}
              />
              <p className="text-s-1 tenue">
                Nel report i <strong className="font-medium text-[var(--giallo)]">dati misurati</strong> portano
                l’ora dell’osservazione. Le stime stanno in una sezione separata, e portano scritto che sono stime.
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
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
