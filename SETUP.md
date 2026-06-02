# Nexaflow Landing — Setup e Deploy

## 1. Installa le dipendenze

Apri il terminale nella cartella `nexaflow-landing` ed esegui:

```
npm install
```

## 2. Testa in locale

```
npm run dev
```

Apri il browser su `http://localhost:3000` — dovresti vedere la landing.

---

## 3. Configura il form contatti (Formspree)

1. Vai su https://formspree.io e crea un account gratuito
2. Clicca "New Form" → dai un nome (es. "Nexaflow contatti")
3. Copia l'**ID del form** (una stringa tipo `xpzvwkrd`)
4. Apri il file `components/Contact.tsx`
5. Trova la riga: `https://formspree.io/f/FORM_ID`
6. Sostituisci `FORM_ID` con il tuo ID reale

Le richieste arriveranno direttamente a liveranibruno9@gmail.com.

---

## 4. Deploy su Vercel

1. Vai su https://vercel.com e accedi con GitHub
2. Carica la cartella su un repository GitHub (nuovo repo privato va bene)
3. Su Vercel: "New Project" → importa il repository
4. Lascia tutte le impostazioni di default → clicca "Deploy"
5. Vercel ti dà un URL tipo `nexaflow-landing.vercel.app`

---

## 5. Dominio personalizzato (nexaflow.it)

1. Acquista il dominio su Aruba, Register.it o Namecheap
2. In Vercel: Settings → Domains → aggiungi `nexaflow.it`
3. Vercel ti mostra i DNS record da copiare nel pannello del registrar
4. Attesa propagazione DNS: 15 minuti – 24 ore

---

## Struttura componenti

| Sezione | File |
|---------|------|
| Navbar fissa | `components/Navbar.tsx` |
| Hero principale | `components/Hero.tsx` |
| I 3 problemi del target | `components/Problem.tsx` |
| Pacchetti e prezzi | `components/Services.tsx` |
| Come funziona (3 step) | `components/HowItWorks.tsx` |
| Esempi prima/dopo | `components/Automations.tsx` |
| FAQ accordion | `components/FAQ.tsx` |
| Form contatti | `components/Contact.tsx` |
| Footer | `components/Footer.tsx` |

Per modificare testi, prezzi o contenuti: apri il file corrispondente e modifica le costanti in cima al file.
