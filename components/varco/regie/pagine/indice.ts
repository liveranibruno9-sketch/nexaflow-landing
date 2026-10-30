// Il registro delle regie delle pagine dei servizi, per id di pagina. Modulo puro: lo provano anche i test di Node.
import { REGIE_AUTOMAZIONI } from './atlas.ts'
import type { RegiePagina } from './comune.ts'

export const REGIE_PAGINE: Record<string, RegiePagina> = {
  automazioni: REGIE_AUTOMAZIONI,
}
