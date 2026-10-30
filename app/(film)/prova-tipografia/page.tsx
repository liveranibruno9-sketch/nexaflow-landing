// PAGINA TEMPORANEA (D26, scelta a schermo): Archivo al 75% contro Bricolage Grotesque, sul poster dell'apertura.
// Non è collegata da nessuna parte, non è nella sitemap (app/sitemap.ts elenca solo la home) e ha noindex.
// Si cancella (pagina e pacchetto @fontsource-variable/bricolage-grotesque) al compito 13, dopo la scelta di Bruno.
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import type { CSSProperties } from 'react'

export const metadata: Metadata = {
  title: 'Prova tipografia',
  robots: { index: false, follow: false },
}

// Bricolage con gli assi peso (200-800) e larghezza (75-100%): si sceglie la larghezza col CSS, come per Archivo
const bricolage = localFont({
  src: '../../../node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wdth-normal.woff2',
  weight: '200 800',
  display: 'swap',
  declarations: [{ prop: 'font-stretch', value: '75% 100%' }],
})

const colonna: CSSProperties = {
  position: 'relative',
  minHeight: '100svh',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  gap: 14,
  padding: '0 20px 96px',
}
const sfondo: CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }
const etichetta: CSSProperties = {
  position: 'absolute',
  top: 18,
  left: 20,
  font: '500 11px/1.3 var(--font-mono), ui-monospace, monospace',
  letterSpacing: '.22em',
  textTransform: 'uppercase',
  color: '#f4f1ff',
}
const nome: CSSProperties = { position: 'relative', margin: 0, fontWeight: 500, fontSize: 'min(26vw, 150px)', lineHeight: 0.92, letterSpacing: '-.01em', color: '#f4f1ff' }
const motto: CSSProperties = { position: 'relative', margin: 0, fontWeight: 500, fontSize: 'clamp(22px, 5.6vw, 34px)', lineHeight: 1.1, color: '#f4f1ff' }
const frase: CSSProperties = { position: 'relative', margin: 0, fontWeight: 500, fontSize: 'clamp(28px, 7.4vw, 48px)', lineHeight: 1.02, color: '#f4f1ff' }

function Colonna({ etichetta: nomeFont, stile }: { etichetta: string; stile: CSSProperties }) {
  return (
    <section style={{ ...colonna, ...stile }}>
      <img src="/film/apertura-poster-720.webp" alt="" style={sfondo} />
      <p style={etichetta}>{nomeFont}</p>
      <p style={nome}>Atlas</p>
      <p style={motto}>“Il peso lo porto io.”</p>
      <p style={frase}>
        Tu fai il tuo <span style={{ color: '#5b8cff' }}>mestiere</span>.
      </p>
    </section>
  )
}

export default function ProvaTipografia() {
  return (
    <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', background: '#000' }}>
      <Colonna etichetta="Archivo · larghezza 75%" stile={{ fontFamily: 'var(--font-titoli), Archivo, sans-serif', fontStretch: '75%' }} />
      <Colonna etichetta="Bricolage Grotesque · larghezza 75%" stile={{ fontFamily: bricolage.style.fontFamily, fontStretch: '75%' }} />
    </main>
  )
}
