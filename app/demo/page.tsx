import Link from 'next/link'
import { SERVIZI_DEMO } from '@/lib/demo/servizi'
import RipristinaTutto from '@/components/demo/RipristinaTutto'

export default function IndiceDemo() {
  return (
    <div>
      <span className="occhiello">Studio Dentistico Demo · Faenza</span>
      <h1 className="display mt-3 max-w-[18ch] text-s5 leading-[0.98]">
        Il piano di recupero, <span className="testo-sfumato">provato dal vivo.</span>
      </h1>
      <p className="mt-5 max-w-[60ch] text-s0 text-[var(--neutro)]">
        Ogni servizio mostra due cose: lo strumento che usa la segreteria e quello che riceve il paziente sul telefono. I testi li scrive
        l’AI in quel momento. Pazienti e numeri sono inventati: nessun messaggio parte davvero.
      </p>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SERVIZI_DEMO.map((s) => (
          <li key={s.modulo}>
            <Link
              href={s.percorso}
              data-prova="servizio"
              className="card group flex h-full flex-col p-6 transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="mono text-s-2 text-[var(--celeste)]">{s.sigla}</span>
              <span className="display mt-3 text-s2 leading-tight text-[var(--bianco)]">{s.nome}</span>
              <span className="mt-3 flex-1 text-s-1 leading-relaxed text-[var(--neutro)]">{s.promessa}</span>
              <span className="mt-6 flex items-center justify-between border-t border-[var(--bordo)] pt-4 text-s-2">
                <span className="text-[var(--neutro)]">{s.strumento}</span>
                <span aria-hidden="true" className="text-[var(--celeste)] transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <RipristinaTutto />
    </div>
  )
}
