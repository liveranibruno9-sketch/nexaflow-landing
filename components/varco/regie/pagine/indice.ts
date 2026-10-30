// Il registro delle regie delle pagine dei servizi, per id di pagina. Modulo puro: lo provano anche i test di Node.
import { REGIE_AUTOMAZIONI } from './atlas.ts'
import { REGIE_CHI_SIAMO } from './chi-siamo.ts'
import { REGIE_CAMPAGNE } from './hermes.ts'
import { REGIE_SITI } from './janus.ts'
import { REGIE_CONTENUTI } from './prometheus.ts'
import type { RegiePagina } from './comune.ts'

export const REGIE_PAGINE: Record<string, RegiePagina> = {
  automazioni: REGIE_AUTOMAZIONI,
  'chi-siamo': REGIE_CHI_SIAMO,
  'siti-web': REGIE_SITI,
  contenuti: REGIE_CONTENUTI,
  campagne: REGIE_CAMPAGNE,
}
