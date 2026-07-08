/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          light: '#F7F8F7',
          dark: '#101314',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#181C1E',
        },
        border: {
          light: '#E4E7E9',
          dark: '#262B2D',
        },
        ink: {
          light: '#14181B',
          dark: '#EAEDEE',
        },
        muted: {
          light: '#6B7280',
          dark: '#8B9296',
        },
        accent: {
          DEFAULT: '#2F6FED',
          soft: '#EAF1FE',
          softDark: '#182742',
        },
        tally: {
          critical: '#E5484D',
          warning: '#F5A524',
          ok: '#2FB344',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
      },
    },
  },
  plugins: [],
}
