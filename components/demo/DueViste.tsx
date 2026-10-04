'use client'

import { useState, type ReactNode } from 'react'

// Le due viste della demo: lo strumento della segreteria e il telefono del paziente.
// Sul telefono sono due schede; dal computer stanno affiancate e il telefono resta in vista.
export default function DueViste({
  segreteria,
  telefono,
  nuoviMessaggi = 0,
}: {
  segreteria: ReactNode
  telefono: ReactNode
  nuoviMessaggi?: number
}) {
  const [scheda, setScheda] = useState<'segreteria' | 'telefono'>('segreteria')
  const voce = (id: 'segreteria' | 'telefono', etichetta: string, extra?: ReactNode) => (
    <button
      type="button"
      role="tab"
      aria-selected={scheda === id}
      data-prova={`scheda-${id}`}
      onClick={() => setScheda(id)}
      className={`flex-1 rounded-full px-4 py-2.5 text-s-1 font-medium transition-colors ${
        scheda === id ? 'bg-[var(--blu)] text-white' : 'text-[var(--neutro)] hover:text-[var(--bianco)]'
      }`}
    >
      {etichetta}
      {extra}
    </button>
  )

  return (
    <div>
      <div role="tablist" className="vetro non-stampare sticky top-[76px] z-20 mb-5 flex gap-1 rounded-full p-1 lg:hidden">
        {voce('segreteria', 'Segreteria')}
        {voce(
          'telefono',
          'Telefono del paziente',
          nuoviMessaggi > 0 ? (
            <span className="num ml-2 rounded-full bg-[var(--verde)] px-2 py-0.5 text-s-2 font-semibold text-[var(--spazio)]">{nuoviMessaggi}</span>
          ) : null,
        )}
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-start lg:gap-8">
        <section aria-label="Strumento della segreteria" className={scheda === 'segreteria' ? 'block' : 'hidden lg:block'}>
          {segreteria}
        </section>
        <section
          aria-label="Telefono del paziente"
          className={`${scheda === 'telefono' ? 'block' : 'hidden lg:block'} lg:sticky lg:top-24`}
        >
          {telefono}
        </section>
      </div>
    </div>
  )
}
