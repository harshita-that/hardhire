import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        hardhire: {
          bg: '#F2F0EB',
          surface: '#FFFFFF',
          text: '#1C1C1A',
          'text-secondary': '#5C5C58',
          accent: '#2D5A27',
          'accent-light': '#4A7C43',
          danger: '#B91C1C',
          warning: '#D97706',
          'neutral-mid': '#8A8A85',
          border: '#D4D0C8',
          'code-bg': '#1C1C1A',
          grade: {
            a: '#2D5A27',
            b: '#4A7C43',
            c: '#D97706',
            d: '#C2410C',
            f: '#B91C1C',
          },
        },
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        mono: ['IBM Plex Mono', 'monospace'],
        inter: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        hardhire: '4px',
      },
      boxShadow: {
        hardhire: '0 1px 3px rgba(0,0,0,0.08)',
      },
      maxWidth: {
        '8xl': '88rem',
      },
    },
  },
  plugins: [],
};
export default config;
