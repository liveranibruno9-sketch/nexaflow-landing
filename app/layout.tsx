import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Nexaflow — Agenti AI e automazione per studi professionali',
  description:
    'Agenti AI e workflow su misura per commercialisti, avvocati, notai, studi medici e agenzie. Dalla casella email alla raccolta documenti: tu supervisioni, il sistema esegue.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
