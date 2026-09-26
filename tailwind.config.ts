import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Palette semantica: blu = quello che recuperi, arancio = quello che perdi,
        // lime = il dato misurato. Vedi app/globals.css.
        ink: { DEFAULT: '#080D18', 2: '#111A2E', 3: '#1B2740' },
        paper: { DEFAULT: '#FAF6EF', 2: '#FFFFFF', 3: '#F1EBE0' },
        slate2: { DEFAULT: '#5A6478', light: '#98A2B8', soft: '#C8CEDB' },
        blu: { DEFAULT: '#2563FF', light: '#7DA2FF', dark: '#1441B8', tenue: '#E8EEFF' },
        arancio: { DEFAULT: '#FF5A1F', ink: '#C63A0C', tenue: '#FFE9DF' },
        lime: '#C9F24D',
        ok: '#1FA971',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
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
