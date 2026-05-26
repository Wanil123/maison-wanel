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
        primary: '#2D1B30',
        secondary: '#6B5B6E',
        accent: '#C9A96E',
        'accent-light': '#E8D5B0',
        'accent-dark': '#A68B5B',
        luxury: {
          gold: '#C9A96E',
          champagne: '#F5E6CC',
          cream: '#FBF8F2',
          noir: '#1E0F21',
          charcoal: '#2D1B30',
          wine: '#6B2D4A',
          plum: '#4A1E3A',
          rose: '#D4A0A0',
          ivory: '#FAF4EB',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      letterSpacing: {
        luxe: '0.2em',
        wide: '0.05em',
      },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.23, 1, 0.32, 1)',
        emphasis: 'cubic-bezier(0.77, 0, 0.175, 1)',
      },
      boxShadow: {
        luxe: '0 25px 50px -12px rgba(30, 15, 33, 0.18)',
        gold: '0 12px 30px -10px rgba(201, 169, 110, 0.35)',
        wine: '0 12px 30px -10px rgba(107, 45, 74, 0.35)',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'reveal': 'reveal 1s cubic-bezier(0.77, 0, 0.175, 1) forwards',
        'marquee': 'marquee 30s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'line-grow': 'lineGrow 0.8s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        reveal: {
          '0%': { clipPath: 'inset(0 100% 0 0)' },
          '100%': { clipPath: 'inset(0 0% 0 0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(201, 169, 110, 0.2)' },
          '100%': { boxShadow: '0 0 40px rgba(201, 169, 110, 0.4)' },
        },
        lineGrow: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C9A96E 0%, #E8D5B0 50%, #C9A96E 100%)',
        'dark-gradient': 'linear-gradient(135deg, #1E0F21 0%, #2D1B30 50%, #1E0F21 100%)',
        'wine-gradient': 'linear-gradient(135deg, #1E0F21 0%, #4A1E3A 50%, #6B2D4A 100%)',
      },
    },
  },
  plugins: [],
};
