import type { Metadata } from 'next'
import { CONTATTO } from '@/components/dati'

export const metadata: Metadata = {
  title: { absolute: 'Privacy e cookie | Agenti Studio' },
  description: 'Informativa sul trattamento dei dati personali del sito di Agenti Studio.',
  robots: { index: false, follow: true },
}

const SEZIONI: { id?: string; titolo: string; corpo: React.ReactNode }[] = [
  {
    titolo: 'Titolare del trattamento',
    corpo: (
      <p>
        Bruno Liverani, Faenza (RA). Contatto:{' '}
        <a href={`mailto:${CONTATTO.email}`} className="underline underline-offset-2 hover:text-[var(--blu-luce)]">
          {CONTATTO.email}
        </a>
      </p>
    ),
  },
  {
    titolo: 'Quali dati raccogliamo',
    corpo: (
      <>
        <p>
          Solo i dati che inserisce volontariamente nei moduli del sito e, nell&apos;area demo, l&apos;impronta
          dell&apos;indirizzo IP descritta nella sezione Cookie. Nel modulo di verifica gratuita per gli
          studi dentistici: nome dello studio, suo nome, città, telefono, indirizzo email e, se lo indica, il
          gestionale in uso. Nel modulo di richiesta di preventivo: nome, attività, telefono o email, servizio
          di interesse, fascia di budget e, se vuole, un messaggio.
        </p>
        <p className="mt-3">
          Il sito non usa cookie di profilazione e, fuori dall&apos;area demo, non raccoglie dati di navigazione riconducibili alla persona.
        </p>
      </>
    ),
  },
  {
    titolo: 'Perché li usiamo',
    corpo: (
      <p>
        Esclusivamente per svolgere la verifica gratuita richiesta, per rispondere alla richiesta di preventivo e per ricontattarla in merito. Base
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
        I moduli inviano i dati al server di automazione di Agenti Studio (software n8n), ospitato da Hetzner
        Online GmbH in Germania, che li registra e li inoltra alla nostra casella email, gestita da Aruba S.p.A.
        in Italia. Entrambi agiscono come responsabili del trattamento. Il sito è ospitato su Vercel Inc. e usa Vercel Analytics, che raccoglie statistiche di traffico
        aggregate senza cookie e senza identificare i singoli visitatori. I caratteri tipografici sono serviti
        dal nostro dominio: nessuna richiesta viene inviata a Google al caricamento della pagina.
      </p>
    ),
  },
  {
    id: 'cookie',
    titolo: 'Cookie',
    corpo: (
      <>
        <p>
          Il sito non usa cookie di profilazione né cookie pubblicitari. L’unico cookie è un cookie tecnico, che
          serve solo a chi entra nell’area riservata delle demo con il codice ricevuto da noi: si chiama{' '}
          <code>demo_accesso</code>, contiene una firma che attesta l’inserimento del codice corretto, non
          contiene dati personali e dura 30 giorni. Chi non entra nell’area demo non riceve alcun cookie dal sito.
          Trattandosi di un cookie tecnico non è richiesto il consenso.
        </p>
        <p className="mt-3">
          Nell’area demo, a ogni inserimento del codice il server invia al nostro sistema n8n (Hetzner)
          un’impronta non reversibile dell’indirizzo IP, usata solo per bloccare l’accesso dopo dieci tentativi
          sbagliati in un’ora e non associata ad altri dati.
        </p>
      </>
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
        <a href={`mailto:${CONTATTO.email}`} className="underline underline-offset-2 hover:text-[var(--blu-luce)]">
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
    <main className="min-h-screen bg-transparent">
      <div className="wrap max-w-3xl py-20 sm:py-28">
        <a href="/" className="text-s-1 text-[var(--blu-luce)] transition-colors hover:text-[var(--celeste)]">
          ← Torna al sito
        </a>

        <h1 className="serif mt-8 text-s4">Privacy e cookie</h1>
        <p className="mt-3 text-s-1 text-[var(--neutro)]">Ultimo aggiornamento: ottobre 2026</p>
        <div className="filetto mt-8" />

        <div className="mt-12 space-y-10">
          {SEZIONI.map((s) => (
            <section key={s.titolo} id={s.id} className={s.id ? 'scroll-mt-8' : undefined}>
              <h2 className="text-s1 font-medium tracking-[-0.02em]">{s.titolo}</h2>
              <div className="mt-3 text-s0 leading-relaxed text-[var(--neutro)]">{s.corpo}</div>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
