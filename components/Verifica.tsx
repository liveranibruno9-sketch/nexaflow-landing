import Image from 'next/image'
import { CONTATTO } from './dati'

const CAMPI = [
  { id: 'studio', label: 'Nome dello studio', type: 'text', required: true, auto: 'organization' },
  { id: 'titolare', label: 'Il suo nome', type: 'text', required: true, auto: 'name' },
  { id: 'citta', label: 'Città', type: 'text', required: true, auto: 'address-level2' },
  { id: 'telefono', label: 'Telefono dello studio', type: 'tel', required: true, auto: 'tel' },
  { id: 'email', label: 'Email', type: 'email', required: true, auto: 'email' },
  { id: 'gestionale', label: 'Gestionale in uso (se lo sa)', type: 'text', required: false, auto: 'off' },
]

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

            <p className="rivela rit-1 misura mt-6 text-s0 text-[color-mix(in_srgb,#F2F5FF_80%,transparent)]">
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
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[color-mix(in_srgb,#2F6BFF_24%,transparent)]">
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
                  <span className="text-s-1 text-[color-mix(in_srgb,#F2F5FF_78%,transparent)]">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rivela-scala">
            <form action={CONTATTO.formspree} method="POST" className="vetro rounded-xl3 p-6 sm:p-8">
              <div className="grid gap-5 sm:grid-cols-2">
                {CAMPI.map((c) => (
                  <div key={c.id} className={c.id === 'studio' || c.id === 'gestionale' ? 'sm:col-span-2' : ''}>
                    <label htmlFor={c.id} className="occhiello !text-[var(--neutro)]">
                      {c.label}
                      {c.required ? <span className="text-[var(--blu-luce)]"> *</span> : null}
                    </label>
                    <input
                      id={c.id}
                      name={c.id}
                      type={c.type}
                      required={c.required}
                      autoComplete={c.auto}
                      className="mt-2 w-full rounded-xl border border-[var(--bordo-forte)] bg-[color-mix(in_srgb,#05070F_55%,transparent)] px-4 py-3 text-s0 text-[var(--bianco)] outline-none transition-colors focus:border-[var(--celeste)]"
                    />
                  </div>
                ))}
              </div>

              {/* campo trappola anti-spam, invisibile agli umani */}
              <input type="text" name="_gotcha" tabIndex={-1} aria-hidden="true" className="hidden" />
              <input type="hidden" name="_subject" value="Richiesta verifica gratuita — agentistudio.it" />

              <label className="mt-7 flex cursor-pointer items-start gap-3">
                <input type="checkbox" name="consenso" required className="mt-1 h-4 w-4 shrink-0 accent-[var(--blu)]" />
                <span className="text-s-2 leading-relaxed tenue">
                  Acconsento al trattamento dei dati per essere ricontattato su questa richiesta, come descritto nella{' '}
                  <a href="/privacy" className="underline underline-offset-2 hover:text-[var(--blu-luce)]">
                    privacy policy
                  </a>
                  .
                </span>
              </label>

              <button type="submit" className="btn btn-primario mt-7 w-full">
                Richiedi la verifica gratuita
              </button>

              <p className="mt-5 text-s-2 tenue">
                Oppure scriva direttamente a{' '}
                <a href={`mailto:${CONTATTO.email}`} className="underline underline-offset-2 hover:text-[var(--blu-luce)]">
                  {CONTATTO.email}
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
