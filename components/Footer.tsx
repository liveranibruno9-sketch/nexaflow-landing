import { CONTATTO, MODULI } from './dati'

export default function Footer() {
  const anno = new Date().getFullYear()
  return (
    <footer className="border-t border-[var(--bordo)] bg-[var(--paper-3)]">
      <div className="wrap py-14 sm:py-20">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr] md:gap-8">
          <div>
            <div className="flex items-center gap-2.5">
              <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <rect width="28" height="28" rx="8" fill="var(--ink)" />
                <path
                  d="M8 19.5 L14 8 L20 19.5"
                  stroke="var(--jade-2)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M10.6 15 H17.4" stroke="var(--brass)" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <span className="text-s0 font-medium tracking-[-0.02em]">Agenti Studio</span>
            </div>
            <p className="misura mt-5 text-s-1 leading-relaxed text-[var(--slate)]">
              Automazioni e agenti AI per studi dentistici privati. Recuperiamo fatturato che lo studio sta già
              perdendo, misurato prima e dopo.
            </p>
            <p className="mt-5 text-s-1 text-[var(--slate)]">
              <a href={`mailto:${CONTATTO.email}`} className="transition-colors hover:text-[var(--ink)]">
                {CONTATTO.email}
              </a>
              <br />
              {CONTATTO.zona}, Italia
            </p>
          </div>

          <nav aria-label="Servizi">
            <span className="occhiello">Servizi</span>
            <ul className="mt-5 grid gap-2.5">
              {MODULI.map((m) => (
                <li key={m.slug}>
                  <a
                    href={`#${m.slug}`}
                    className="text-s-1 text-[var(--slate)] transition-colors hover:text-[var(--ink)]"
                  >
                    {m.nome}
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
                  <a href={href} className="text-s-1 text-[var(--slate)] transition-colors hover:text-[var(--ink)]">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-[var(--bordo)] pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-s-2 text-[var(--slate)]">© {anno} Agenti Studio · Bruno Liverani</p>
          <p className="text-s-2 text-[var(--slate)]">
            Gli assistenti virtuali si dichiarano come tali al primo contatto, come richiede l’AI Act.
          </p>
        </div>
      </div>
    </footer>
  )
}
