// Il registro delle regie del varco e il controllo R18. Una regia per blocco, per id. Modulo puro: lo provano i test di Node.
import { kitFinto } from '../kit-finto.ts'
import { fasiBlocco } from '../percorso.ts'
import type { Regia, Tempi } from '../kit.ts'
import type { Battuta, Percorso } from '../tipi.ts'
import { apertura } from './apertura.ts'
import { CENTRI, finale, intro, mascotte, squadra } from './sezioni.ts'
import { soglia } from './soglia.ts'

export const REGIE: Partial<Record<string, Regia>> = {
  apertura,
  soglia,
  servizi: intro,
  atlas: mascotte('polvere', CENTRI.atlas),
  janus: mascotte('vetro', CENTRI.janus),
  prometheus: mascotte('saette', CENTRI.prometheus),
  hermes: mascotte('cromo', CENTRI.hermes),
  squadra,
  finale,
}

/** tempi di tutte le battute del blocco: quelle prima della i a 1, quelle dopo a 0, la i a `ti` */
function tempiCon(ordinate: Battuta[], i: number, ti: number): Tempi {
  const t: Tempi = {}
  ordinate.forEach((x, j) => { t[x.ruolo] = j < i ? 1 : j > i ? 0 : ti })
  return t
}

const TOLLERANZA = 1e-9

/**
 * R18, controllo automatico: per ogni blocco che ha una regia, l'elenco degli errori (vuoto = a posto).
 * (a) ogni battuta, con quelle prima a 1 e quelle dopo a 0, produce chiamate diverse a t = 0 e a t = 1, altrimenti «frase senza àncora»;
 * (b) ogni frase con accento, a t = 0,9, chiama `fuoco`; (c) nessuna `luce` sopra 0,85 per t da 0 a 1 a passi di 0,1;
 * (d) nessuna `saetta` con riquadro da-a oltre 0,5 × 0,5 del quadro.
 */
export function controllaR18(p: Percorso, regie: Partial<Record<string, Regia>>): string[] {
  const errori = new Set<string>()
  for (const bl of p.blocchi) {
    const regia = regie[bl.id]
    if (!regia) continue
    const fasi = fasiBlocco(bl, (bl.da + bl.a) / 2)
    const ordinate = [...bl.battute].sort((x, y) => x.da - y.da)
    const esegui = (t: Tempi) => {
      const { kit, chiamate } = kitFinto()
      regia(t, fasi, kit)
      return chiamate
    }
    ordinate.forEach((x, i) => {
      const dove = `${bl.id} · ${x.ruolo} «${x.testo}»`
      if (JSON.stringify(esegui(tempiCon(ordinate, i, 0))) === JSON.stringify(esegui(tempiCon(ordinate, i, 1)))) {
        errori.add(`${dove}: frase senza àncora (nulla cambia nella scena fra t = 0 e t = 1)`)
      }
      if (x.accento && !esegui(tempiCon(ordinate, i, 0.9)).some((c) => c.metodo === 'fuoco')) {
        errori.add(`${dove}: la parola d'accento «${x.accento}» non ha il fuoco (nessuna chiamata a fuoco a t = 0,9)`)
      }
      for (let k = 0; k <= 10; k++) {
        for (const c of esegui(tempiCon(ordinate, i, k / 10))) {
          if (c.metodo === 'luce' && c.valori[3] > 0.85 + TOLLERANZA) errori.add(`${dove}: luce «${c.id}» a ${c.valori[3]}, oltre 0,85`)
          if (c.metodo === 'saetta' && (Math.abs(c.valori[0] - c.valori[2]) > 0.5 + TOLLERANZA || Math.abs(c.valori[1] - c.valori[3]) > 0.5 + TOLLERANZA)) {
            errori.add(`${dove}: saetta «${c.id}» più grande di 0,5 x 0,5 del quadro`)
          }
        }
      }
    })
  }
  return Array.from(errori)
}
