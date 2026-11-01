// Intestazioni di sicurezza (regole S3 di 10-frameworks/regole-pubblicazione-siti.md nel vault).
// HSTS lo imposta già Vercel (max-age 2 anni): qui non lo duplichiamo.
//
// 'wasm-unsafe-eval' serve al decodificatore Meshopt delle mascotte 3D (WebAssembly; non abilita eval di JavaScript) e `blob:` in
// connect-src al caricamento delle loro texture da parte di three.js: senza, le mascotte non compaiono (provato in locale 1/11/2026).
// La CSP ammette gli script in linea perché Next.js e la scelta del volo 3D (app/layout.tsx) ne usano.
// Blocca comunque ogni script, font, immagine o connessione verso altri domini, l'inserimento del sito in
// una cornice altrui e l'invio dei moduli altrove: se in futuro serve un servizio esterno, va aggiunto qui
// di proposito. Vercel Analytics passa da /_vercel/insights sul nostro dominio, quindi rientra in 'self'.
const dev = process.env.NODE_ENV !== 'production'

const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'${dev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "media-src 'self' blob:",
  "worker-src 'self' blob:",
  `connect-src 'self' blob: data:${dev ? ' ws: wss:' : ''}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ')

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: CSP },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
        ],
      },
    ]
  },
}
module.exports = nextConfig
