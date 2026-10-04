import { euro } from '@/lib/demo/formato'
import type { StatoM1 } from '@/lib/demo/tipi'

// Il riepilogo che fa vedere al titolare anche chi NON riceve messaggi, e perché.
export default function RiepilogoPreventivi({ riepilogo }: { riepilogo: StatoM1['riepilogo'] }) {
  return (
    <div className="card p-5 sm:p-6">
      <h2 className="display text-s1">Riepilogo</h2>
      <dl className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <dt className="mono text-s-2 uppercase tracking-[0.12em] text-[var(--neutro)]">In sequenza</dt>
          <dd className="num display mt-1 text-s3 text-[var(--verde)]">{euro(riepilogo.valoreInSequenza)}</dd>
        </div>
        <div>
          <dt className="mono text-s-2 uppercase tracking-[0.12em] text-[var(--neutro)]">Messaggi inviati</dt>
          <dd className="num display mt-1 text-s3 text-[var(--bianco)]">{riepilogo.inviati}</dd>
        </div>
      </dl>
      {riepilogo.silenzi.length > 0 && (
        <div className="mt-5 border-t border-[var(--bordo)] pt-4">
          <p className="text-s-1 font-medium text-[var(--bianco)]">Chi non riceve messaggi, e perché</p>
          <ul className="mt-2 space-y-1.5">
            {riepilogo.silenzi.map((s) => (
              <li key={s.id} data-prova="silenzio" className="flex flex-wrap justify-between gap-x-3 text-s-1">
                <span className="text-[var(--bianco)]">{s.nome}</span>
                <span className="text-[var(--neutro)]">{s.motivo}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
