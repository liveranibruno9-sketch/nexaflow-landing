import { CONTATTO, MODULI } from './dati'

export default function Footer() {
  const anno = new Date().getFullYear()
  return (
    <footer className="piede relative z-[1]">
      <div className="wrap py-14 sm:py-20">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr] md:gap-8">
          <div>
            <div className="flex items-center gap-2.5">
              <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <rect width="28" height="28" rx="8" fill="var(--notte)" />
                <path d="M8 19.5 L14 8 L20 19.5" stroke="var(--blu-luce)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10.6 15 H17.4" stroke="var(--arancio)" strokeWidth="1.6" strokeLinecap="round" />
                <circle cx="14" cy="8" r="1.6" fill="var(--verde)" />
              </svg>
              <span className="text-s0 font-medium tracking-[-0.02em]">Agenti Studio</span>
            </div>
            <p className="misura mt-5 text-s-1 leading-relaxed tenue">
              Automazioni e agenti AI per studi dentistici privati. Recuperiamo fatturato che lo studio sta già
              perdendo, misurato prima e dopo.
            </p>
            <p className="mt-5 text-s-1 tenue">
              <a href={`mailto:${CONTATTO.email}`} className="transition-colors hover:text-[var(--bianco)]">
                {CONTATTO.email}
              </a>
              <br />
              {CONTATTO.zona}, Italia
            </p>
          </div>

          <nav aria-label="Servizi">
            <span className="occhiello">Costellazioni</span>
            <ul className="mt-5 grid gap-2.5">
              {MODULI.map((m) => (
                <li key={m.slug}>
                  <a href={`#${m.slug}`} className="text-s-1 tenue transition-colors hover:text-[var(--bianco)]">
                    {m.nome} <span className="mono text-s-2 text-[var(--neutro)]">· {m.cielo.nome}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Sito">
            <span className="occhiello">Sito</span>
            <ul className="mt-5 grid gap-2.5">
              {[
                ['#perdite', 'Il problema'],
                ['#processo', 'Come si parte'],
                ['#conformita', 'Regole e conformità'],
                ['#chi', 'Chi c’è dietro'],
                ['#domande', 'Domande'],
                ['/privacy', 'Privacy policy'],
              ].map(([href, label]) => (
                <li key={href}>
                  <a href={href} className="text-s-1 tenue transition-colors hover:text-[var(--bianco)]">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-14 grid gap-4 border-t border-[var(--bordo)] pt-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-s-2 tenue">© {anno} Agenti Studio · Bruno Liverani</p>
            <p className="text-s-2 tenue">
              Gli assistenti virtuali si dichiarano come tali al primo contatto, come richiede l’AI Act.
            </p>
          </div>
          {/* crediti obbligatori delle immagini (licenza CC BY 4.0) */}
          <p className="text-s-2 leading-relaxed text-[var(--neutro)]">
            Immagini del telescopio spaziale James Webb: “Cosmic Cliffs” nella Nebulosa della Carena, NASA, ESA,
            CSA, STScI; “Pilastri della Creazione”, NASA, ESA, CSA, STScI, J. DePasquale, A. Koekemoer, A. Pagan
            (STScI). Licenza CC BY 4.0. Le costellazioni usano le posizioni reali delle stelle, epoca J2000.
          </p>
        </div>
      </div>
    </footer>
  )
}
