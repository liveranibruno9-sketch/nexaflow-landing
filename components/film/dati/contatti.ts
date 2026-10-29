// Contatti di Agenti Studio (vincoli globali). Modulo puro: lo importano anche i test di Node.

export type Servizio = 'automazioni' | 'siti-web' | 'contenuti' | 'campagne'

export const CONTATTI = {
  telefono: '+393500164456',
  telefonoLeggibile: '+39 350 016 4456',
  whatsapp: 'https://wa.me/393500164456?text=' + encodeURIComponent('Ciao Bruno, ho visto il sito di Agenti Studio e vorrei informazioni su…'),
  email: 'bruno.liverani@agentistudio.it',
  piva: '',
  fotoBruno: '' as string,
}
