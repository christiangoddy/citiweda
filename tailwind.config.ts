import { type Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/components/**/*.{ts,tsx}', './src/app/**/*.{ts,tsx}'],
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('tailwindcss-animate')
  ],
  theme: {
    screens: {
      '2xl': '1920px',
      xl: '1440px',
      lg: '1024px',
      md: '768px',
      sm: '640px',
      xs: '375px'
    },
    extend: {
      fontFamily: {
        'tactic-sans-ext': ['var(--font-tactic-sans-ext)'],
        'tactic-sans-reg': ['var(--font-tactic-sans-reg)'],
        trap: ['var(--font-trap)']
      },
      animation: {
        pulsate: 'pulsate 2s ease-in-out infinite'
      },
      keyframes: {
        pulsate: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.04)' }
        }
      },
      maxWidth: {
        best: 'calc(100vw - var(--max-width-p))'
      },
      colors: {
        'rich-lavender': '#A177C5',
        'vampire-black': '#06040D',
        'chinese-black': '#121212',
        'dark-purple': '#261C30',
        'ocean-blue': '#5535AA'
      }
    }
  }
};

export default config;
