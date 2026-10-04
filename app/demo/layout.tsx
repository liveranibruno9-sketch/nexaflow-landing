import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Demo · Agenti Studio',
  description: 'Area demo riservata di Agenti Studio.',
  robots: { index: false, follow: false, nocache: true },
}

export default function LayoutDemo({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="vetro vetro-barra non-stampare sticky top-0 z-30 rounded-none border-x-0 border-t-0">
        <div className="wrap flex h-[64px] items-center justify-between gap-4">
          <Link href="/demo" className="flex items-center gap-3">
            <img src="/marchio/a.png" width={47} height={34} alt="" aria-hidden="true" className="h-[30px] w-auto" />
            <span className="text-s0 font-medium text-[var(--bianco)]">Agenti Studio</span>
          </Link>
          <span className="chip text-[var(--bianco)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--verde)]" aria-hidden="true" />
            Demo · dati inventati
          </span>
        </div>
      </header>
      <main id="contenuto" className="wrap pb-24 pt-8 sm:pt-12">
        {children}
      </main>
    </div>
  )
}
