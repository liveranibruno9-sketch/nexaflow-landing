import type { Metadata } from 'next'
import { CONTATTO } from '@/components/dati'

export const metadata: Metadata = {
  title: 'Privacy policy',
  description: 'Informativa sul trattamento dei dati personali del sito di Agenti Studio.',
  robots: { index: false, follow: true },
}

const SEZIONI: { titolo: string; corpo: React.ReactNode }[] = [
  {
    titolo: 'Titolare del trattamento',
    corpo: (
      <p>
        Bruno Liverani, Faenza (RA). Contatto:{' '}
        <a href={`mailto:${CONTATTO.email}`} className="underline underline-offset-2 hover:text-[var(--blu)]">
          {CONTATTO.email}
        </a>
      </p>
    ),
  },
  {
    titolo: 'Quali dati raccogliamo',
    corpo: (
      <p>
        Solo i dati che inserisce volontariamente nel modulo di richiesta: nome dello studio, suo nome, città,
        telefono, indirizzo email e, se lo indica, il gestionale in uso. Il sito non usa cookie di profilazione
        e non raccoglie dati di navigazione riconducibili alla persona.
      </p>
    ),
  },
  {
    titolo: 'Perché li usiamo',
    corpo: (
      <p>
        Esclusivamente per svolgere la verifica gratuita richiesta e per ricontattarla in merito. Base
        giuridica: misure precontrattuali adottate su richiesta dell’interessato, art. 6.1.b GDPR. Nessuna
        newsletter, nessuna cessione a terzi per finalità di marketing.
      </p>
    ),
  },
  {
    titolo: 'La verifica gratuita',
    corpo: (
      <p>
        La verifica consiste in osservazioni su canali pubblici dello studio: chiamate al numero pubblicato,
        un messaggio al numero WhatsApp pubblicato, l’invio del modulo presente sul sito dello studio e la
        consultazione del profilo Google pubblico. Non accediamo a nessun sistema dello studio e non trattiamo
        dati di pazienti. Il report viene inviato solo al richiedente.
      </p>
    ),
  },
  {
    titolo: 'Strumenti di terze parti',
    corpo: (
      <p>
        Il modulo è gestito da Formspree Inc. (Stati Uniti), che inoltra il messaggio alla nostra casella e
        agisce come responsabile del trattamento secondo i propri{' '}
        <a
          href="https://formspree.io/legal/privacy-policy/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-[var(--blu)]"
        >
          termini privacy
        </a>
        . Il sito è ospitato su Vercel Inc. e usa Vercel Analytics, che raccoglie statistiche di traffico
        aggregate senza cookie e senza identificare i singoli visitatori. I caratteri tipografici sono serviti
        dal nostro dominio: nessuna richiesta viene inviata a Google al caricamento della pagina.
      </p>
    ),
  },
  {
    titolo: 'Per quanto tempo',
    corpo: (
      <p>
        I messaggi ricevuti tramite il modulo vengono conservati per il tempo necessario a gestire la richiesta
        e le eventuali comunicazioni successive, e comunque non oltre 24 mesi dall’ultimo contatto.
      </p>
    ),
  },
  {
    titolo: 'I suoi diritti',
    corpo: (
      <p>
        Può chiedere in qualsiasi momento accesso, rettifica o cancellazione dei suoi dati, oppure opporsi al
        trattamento, scrivendo a{' '}
        <a href={`mailto:${CONTATTO.email}`} className="underline underline-offset-2 hover:text-[var(--blu)]">
          {CONTATTO.email}
        </a>
        . Ha inoltre diritto di proporre reclamo al Garante per la protezione dei dati personali.
      </p>
    ),
  },
  {
    titolo: 'Rapporti con gli studi clienti',
    corpo: (
      <p>
        Nei rapporti di fornitura con gli studi, lo studio è titolare del trattamento dei dati dei propri
        pazienti e Agenti Studio agisce come responsabile del trattamento ai sensi dell’art. 28 GDPR, sulla
        base di un atto di nomina scritto che elenca i sub-responsabili coinvolti e il paese in cui trattano i
        dati. Questa informativa riguarda il solo sito web.
      </p>
    ),
  },
]

export default function Privacy() {
  return (
    <main className="min-h-screen bg-[var(--paper)]">
      <div className="wrap max-w-3xl py-20 sm:py-28">
        <a href="/" className="text-s-1 text-[var(--blu)] transition-colors hover:text-[var(--blu-3)]">
          ← Torna al sito
        </a>

        <h1 className="serif mt-8 text-s4">Privacy policy</h1>
        <p className="mt-3 text-s-1 text-[var(--slate)]">Ultimo aggiornamento: settembre 2026</p>
        <div className="filetto mt-8" />

        <div className="mt-12 space-y-10">
          {SEZIONI.map((s) => (
            <section key={s.titolo}>
              <h2 className="text-s1 font-medium tracking-[-0.02em]">{s.titolo}</h2>
              <div className="mt-3 text-s0 leading-relaxed text-[var(--slate)]">{s.corpo}</div>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
