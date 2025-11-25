/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        background: 'hsl(222 47% 4%)',
        foreground: 'hsl(210 40% 98%)',
        primary: {
          DEFAULT: 'hsl(263 70% 65%)',
          foreground: 'hsl(210 40% 98%)',
          glow: 'hsla(263, 70%, 65%, 0.5)'
        },
        card: {
          DEFAULT: 'hsl(222 47% 6%)',
          foreground: 'hsl(210 40% 98%)',
        },
        muted: {
          DEFAULT: 'hsl(217 32% 17%)',
          foreground: 'hsl(215 20.2% 65.1%)',
        },
      },
      animation: {
        'blob': 'blob 10s infinite',
        'shine': 'shine 2s linear infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        shine: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        }
      },
      backgroundImage: {
        'glass': 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        'glass-hover': 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
      }
    }
  },
  plugins: [],
}