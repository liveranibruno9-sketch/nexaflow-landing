import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#0A1628', 2: '#122239', 3: '#1B3050' },
        paper: { DEFAULT: '#F7F4EF', 2: '#FFFFFF', 3: '#EFEAE1' },
        slate2: { DEFAULT: '#5A6B84', light: '#8E9CB2' },
        jade: { DEFAULT: '#1F8A78', light: '#5FBFAE', dark: '#0E5F52' },
        brass: '#B8925A',
        ok: '#1FA971',
        ko: '#E0574B',
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
      borderRadius: { xl2: '20px', xl3: '28px' },
      transitionTimingFunction: { soft: 'cubic-bezier(0.16, 1, 0.3, 1)' },
    },
  },
  plugins: [],
}
export default config
