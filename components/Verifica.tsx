import Image from 'next/image'
import ModuloVerifica from './ModuloVerifica'


/**
 * Arrivo: il modulo della verifica gratuita, l'unica azione della pagina.
 * Sullo sfondo i Pilastri della Creazione (Webb), attenuati e spostati a
 * destra perche non disturbino la lettura del modulo.
 */
export default function Verifica() {
  return (
    <section id="verifica" className="relative isolate overflow-hidden scroll-mt-20">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <Image
          src="/cielo/pilastri.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[70%_40%] opacity-80"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#05070F_0%,rgba(5,7,15,0.3)_22%,rgba(5,7,15,0.4)_78%,#05070F_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_20%_50%,rgba(5,7,15,0.85),transparent_75%)]" />
      </div>

      <div className="wrap sezione">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <span className="occhiello rivela">Arrivo · verifica gratuita</span>
            <div className="filetto mt-5" />
            <h2 className="serif rivela mt-7 text-s4">Mi lasci il numero dello studio. Al resto penso io.</h2>

            <p className="rivela rit-1 misura mt-6 text-s0 text-[color-mix(in_srgb,var(--bianco)_82%,transparent)]">
              Chiamo tre volte in tre fasce orarie, scrivo su WhatsApp, compilo il form del sito e guardo il profilo
              Google. Poi le mando una pagina con cosa è successo, con l’ora esatta di ogni prova.
            </p>

            <ul className="mt-10 grid gap-4">
              {[
                'Trenta minuti di lavoro mio, zero suo',
                'Nessun accesso ai suoi dati, nessun software da installare',
                'Nessun impegno: se va tutto bene glielo dico e finisce lì',
                'Risposta entro due giorni lavorativi',
              ].map((t) => (
                <li key={t} className="flex items-start gap-3.5">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[color-mix(in_srgb,var(--azione)_24%,transparent)]">
                    <svg width="11" height="9" viewBox="0 0 11 9" fill="none" aria-hidden="true">
                      <path
                        d="M1 4.6 L4 7.5 L10 1.2"
                        stroke="var(--blu-luce)"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="text-s-1 text-[color-mix(in_srgb,var(--bianco)_80%,transparent)]">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rivela-scala">
            <ModuloVerifica />
          </div>
        </div>
      </div>
    </section>
  )
}
