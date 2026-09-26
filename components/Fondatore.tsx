export default function Fondatore() {
  return (
    <section id="chi" className="sezione">
      <div className="wrap">
        <div className="card overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-[0.85fr_1.15fr]">
            {/* colonna identità */}
            <div className="relative overflow-hidden bg-[var(--ink)] p-8 sm:p-12">
              <div className="grana absolute inset-0" aria-hidden="true" />
              <div className="relative">
                <span className="occhiello !text-[var(--blu-2)]">Chi c’è dietro</span>
                <h2 className="serif mt-5 text-s3 text-[var(--paper)]">Bruno Liverani</h2>
                <p className="mt-4 !text-s-1 !text-[color-mix(in_srgb,#FAF6EF_65%,transparent)]">
                  Faenza. Costruisco e gestisco personalmente i sistemi: non c’è un reparto assistenza da
                  chiamare, c’è il mio numero.
                </p>

                <dl className="mt-10 grid gap-5">
                  {[
                    ['Dove', 'Romagna. Vengo in studio.'],
                    ['Quanti clienti', 'Sto cercando i primi due pilota.'],
                    ['Chi risponde', 'Io. Tempi di intervento scritti nel contratto.'],
                  ].map(([k, v]) => (
                    <div key={k} className="border-t border-[var(--bordo-scuro)] pt-4">
                      <dt className="occhiello !text-[color-mix(in_srgb,#FAF6EF_40%,transparent)]">{k}</dt>
                      <dd className="mt-1.5 text-s-1 text-[var(--paper)]">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* colonna posizione */}
            <div className="p-8 sm:p-12">
              <h3 className="serif text-s2">Perché le dico che non ho ancora clienti</h3>

              <div className="misura mt-6 space-y-5 text-s0 text-[var(--slate)]">
                <p>
                  Potrei mostrarle loghi e percentuali come fanno tutti. Non ce li ho: sto partendo, e i primi
                  due studi avranno un prezzo ridotto proprio per questo.
                </p>
                <p>
                  Quello che ho è diverso, e per il suo studio vale di più: i sistemi esistono già e funzionano.
                  Glieli faccio girare davanti mentre siamo seduti, invece di raccontarle i risultati di qualcun
                  altro che lei non può verificare.
                </p>
                <p>
                  E le porto un dato sul{' '}
                  <strong className="font-medium text-[var(--ink)]">suo</strong> studio, misurato prima di
                  incontrarla: quante volte ha risposto il telefono, in che orari, e cosa succede quando un
                  paziente scrive su WhatsApp.
                </p>
              </div>

              <div className="mt-9 rounded-2xl border border-[var(--bordo)] bg-[var(--paper)] p-6">
                <p className="text-s-1 leading-relaxed text-[var(--slate)]">
                  Se dopo la verifica risulta che il suo studio risponde a tutte le chiamate e ha il profilo
                  Google in ordine, glielo dico e non le vendo niente. Mi interessa un cliente che resta tre
                  anni, non una firma.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
