/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#0A0A0A',
          base: '#0A0A0A',
          card: '#121212',
          surface: '#171717',
          elevated: '#1F1F1F',
          border: '#262626',
        },
        gold: {
          light: '#F5D77A',
          DEFAULT: '#D4AF37',
          dark: '#B8860B',
          glow: 'rgba(212, 175, 55, 0.25)',
          muted: '#8F7523'
        },
        warmWhite: '#F5F1E8',
        mutedGrey: '#8A8A8A',
        charcoal: '#1A1A1A'
      },
      fontFamily: {
        display: ['Syne', 'Playfair Display', 'serif'],
        heading: ['Playfair Display', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #F5D77A 50%, #B8860B 100%)',
        'gold-gradient-hover': 'linear-gradient(135deg, #F5D77A 0%, #E5C158 50%, #D4AF37 100%)',
        'gold-shimmer': 'linear-gradient(90deg, rgba(212,175,55,0) 0%, rgba(245,215,122,0.3) 50%, rgba(212,175,55,0) 100%)',
        'dark-radial': 'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.12) 0%, rgba(10, 10, 10, 0.95) 70%, #0A0A0A 100%)',
        'card-glow': 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(212, 175, 55, 0.15) 0%, transparent 60%)',
      },
      boxShadow: {
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.25)',
        'gold-glow-lg': '0 0 45px rgba(212, 175, 55, 0.35)',
        'gold-inner': 'inset 0 0 20px rgba(212, 175, 55, 0.15)',
        'premium': '0 20px 40px -15px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(212, 175, 55, 0.2)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
