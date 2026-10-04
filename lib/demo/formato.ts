// Formati italiani per le pagine demo. Niente Intl per le migliaia: 'it-IT' non separa sotto le 5 cifre.

const GIORNI = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab']
const MESI = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic']

export function dataBreve(iso: string | null | undefined): string {
  if (!iso) return '—'
  const [a, m, g] = iso.slice(0, 10).split('-').map(Number)
  const d = new Date(Date.UTC(a, m - 1, g))
  return `${GIORNI[d.getUTCDay()]} ${g} ${MESI[m - 1]}`
}

export function dataLunga(iso: string | null | undefined): string {
  if (!iso) return '—'
  const [a, m, g] = iso.slice(0, 10).split('-').map(Number)
  return `${g} ${MESI[m - 1]} ${a}`
}

export function ora(isoConOra: string): string {
  return isoConOra.slice(11, 16)
}

export function migliaia(n: number): string {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export function euro(n: number): string {
  return `€ ${migliaia(n)}`
}

export function iniziali(nome: string): string {
  return nome.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]!.toUpperCase()).join('')
}
