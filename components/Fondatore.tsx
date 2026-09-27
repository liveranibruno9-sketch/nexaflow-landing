/**
 * Chi guida. L'onesta sui clienti che non ci sono ancora resta identica al
 * sito precedente: in una nicchia dove tutti gonfiano i numeri, dirlo per
 * primo e un differenziatore, e regge al primo controllo.
 */
export default function Fondatore() {
  return (
    <section id="chi" className="livello-notte sezione scroll-mt-20">
      <div className="wrap">
        <div className="card overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-[0.85fr_1.15fr]">
            {/* colonna identita */}
            <div className="reticolo relative border-b border-[var(--bordo)] bg-[color-mix(in_srgb,var(--nebula-1)_9%,transparent)] p-8 sm:p-12 lg:border-b-0 lg:border-r">
              <span className="occhiello">Chi guida</span>
              <h2 className="serif mt-5 text-s3">Bruno Liverani</h2>
              <p className="mt-4 text-s-1 tenue">
                Faenza. Costruisco e gestisco personalmente i sistemi: non c’è un reparto assistenza da chiamare, c’è
                il mio numero.
              </p>

              <dl className="mt-10 grid gap-5">
                {[
                  ['Dove', 'Romagna. Vengo in studio.'],
                  ['Quanti clienti', 'Sto cercando i primi due pilota.'],
                  ['Chi risponde', 'Io. Tempi di intervento scritti nel contratto.'],
                ].map(([k, v]) => (
                  <div key={k} className="border-t border-[var(--bordo)] pt-4">
                    <dt className="occhiello !text-[var(--neutro)]">{k}</dt>
                    <dd className="mt-1.5 text-s-1">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* colonna posizione */}
            <div className="p-8 sm:p-12">
              <h3 className="serif text-s2">Perché le dico che non ho ancora clienti</h3>

              <div className="misura mt-6 space-y-5 text-s0 tenue">
                <p>
                  Potrei mostrarle loghi e percentuali come fanno tutti. Non ce li ho: sto partendo, e i primi due
                  studi avranno un prezzo ridotto proprio per questo.
                </p>
                <p>
                  Quello che ho è diverso, e per il suo studio vale di più: i sistemi esistono già e funzionano.
                  Glieli faccio girare davanti mentre siamo seduti, invece di raccontarle i risultati di qualcun altro
                  che lei non può verificare.
                </p>
                <p>
                  E le porto un dato sul <strong className="font-medium text-[var(--bianco)]">suo</strong> studio,
                  misurato prima di incontrarla: quante volte ha risposto il telefono, in che orari, e cosa succede
                  quando un paziente scrive su WhatsApp.
                </p>
              </div>

              <div className="mt-9 rounded-2xl border border-[color-mix(in_srgb,var(--verde)_28%,transparent)] bg-[color-mix(in_srgb,var(--verde)_6%,transparent)] p-6">
                <p className="text-s-1 leading-relaxed tenue">
                  Se dopo la verifica risulta che il suo studio risponde a tutte le chiamate e ha il profilo Google
                  in ordine, glielo dico e non le vendo niente. Mi interessa un cliente che resta tre anni, non una
                  firma.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
