/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0b',
        surface: '#111214',
        panel: '#17181c',
        accent: {
          DEFAULT: '#d4af37',
          muted: '#8a6b1f',
          soft: '#f3ddb1',
        },
        success: '#3fb950',
        danger: '#ff5d5d',
        warning: '#f5c451',
        text: '#f8f6f1',
        muted: '#a6a09a',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Manrope', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 12px 40px rgba(0,0,0,0.35)',
        glow: '0 0 0 1px rgba(212,175,55,0.18), 0 10px 30px rgba(212,175,55,0.08)',
      },
      backgroundImage: {
        luxury: 'radial-gradient(circle at top, rgba(212,175,55,0.12), transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0))',
      },
    },
  },
  plugins: [],
}