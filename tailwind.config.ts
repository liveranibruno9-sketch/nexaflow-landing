import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Palette astrale con significato: blu = quello che recuperi,
        // arancio = quello che perdi, giallo = la prova, celeste = il cielo.
        // Vedi app/globals.css.
        spazio: '#05070F',
        notte: { DEFAULT: '#0C1330', 2: '#121B42' },
        blu: { DEFAULT: '#2B63F5', luce: '#6E9BFF', scuro: '#1E4FD6' },
        arancio: '#FF6B2C',
        giallo: '#FFE24A',
        celeste: '#9ED8FF',
        bianco: '#F2F5FF',
        neutro: { DEFAULT: '#8C96BC', 2: '#3A4470' },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        's-2': 'var(--step--2)',
        's-1': 'var(--step--1)',
        s0: 'var(--step-0)',
        s1: 'var(--step-1)',
        s2: 'var(--step-2)',
        s3: 'var(--step-3)',
        s4: 'var(--step-4)',
        s5: 'var(--step-5)',
        s6: 'var(--step-6)',
      },
      borderRadius: { xl2: '22px', xl3: '30px' },
      transitionTimingFunction: { soft: 'cubic-bezier(0.16, 1, 0.3, 1)' },
    },
  },
  plugins: [],
}
export default config
