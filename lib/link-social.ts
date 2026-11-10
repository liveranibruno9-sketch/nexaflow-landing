// Link WhatsApp nelle bio dei social (giro della settimana, 10/11/2026).
//
// Perché esistono: Instagram e Facebook ricodificano i link wa.me col messaggio già scritto e il testo
// arriva pieno di «%20» (provato da Bruno: lo stesso link aperto da Telegram esce pulito). Nelle bio va
// quindi l'indirizzo pulito (www.agentistudio.it/ig, /fb, /yt, /tt) e il server lo porta a WhatsApp.
//
// Perché non i redirects di next.config.js: Next 14 decodifica il testo della destinazione e scrive spazi
// veri nell'intestazione Location (provato in locale), cioè un indirizzo non valido.
// Perché non URLSearchParams: codifica gli spazi come «+», che WhatsApp può mostrare tali e quali.
//
// Il messaggio dice da quale piattaforma arriva la richiesta: serve a contarle per canale (fase F3).

const NUMERO_WHATSAPP = '393500164456'

export const PIATTAFORME_SOCIAL = {
  ig: 'Instagram',
  fb: 'Facebook',
  yt: 'YouTube',
  tt: 'TikTok',
} as const

export type SiglaSocial = keyof typeof PIATTAFORME_SOCIAL

export function linkWhatsAppSocial(sigla: SiglaSocial): string {
  const testo = `Ciao Bruno, ti scrivo da ${PIATTAFORME_SOCIAL[sigla]}: vorrei il controllo gratuito del mio sito.`
  return `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(testo)}`
}

export function reindirizzaAWhatsApp(sigla: SiglaSocial): Response {
  return new Response(null, {
    status: 307,
    headers: {
      Location: linkWhatsAppSocial(sigla),
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex',
    },
  })
}
