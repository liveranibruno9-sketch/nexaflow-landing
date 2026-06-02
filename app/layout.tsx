import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Nexaflow — Automazione per studi professionali',
  description: 'Workflow automatici su misura per studi di commercialisti, avvocati e agenzie. Dalla raccolta documenti alla reportistica, il tuo studio lavora senza processi manuali.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
