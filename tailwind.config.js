/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#FF3B30',
          'red-light': '#FF6B63',
          'red-deep': '#CC2936',
          green: '#30D158',
          orange: '#FF9F0A',
          blue: '#0A84FF',
          purple: '#BF5AF2',
          teal: '#5AC8FA',
          pink: '#FF375F',
        },
        surface: {
          DEFAULT: 'rgba(255,255,255,0.04)',
          hover: 'rgba(255,255,255,0.07)',
          active: 'rgba(255,255,255,0.10)',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      borderRadius: {
        sm: '10px',
        md: '16px',
        lg: '22px',
        xl: '30px',
      },
      animation: {
        'fade-up': 'fadeUp 0.45s cubic-bezier(0.4,0,0.2,1) both',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.4,0,0.2,1) both',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
        'ticker-scroll': 'tickerScroll 32s linear infinite',
        'wa-pulse': 'waPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(0.85)' },
        },
        tickerScroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        waPulse: {
          '0%, 100%': { boxShadow: '0 6px 24px rgba(37,211,102,0.45)' },
          '50%': { boxShadow: '0 6px 32px rgba(37,211,102,0.7), 0 0 0 8px rgba(37,211,102,0.08)' },
        },
      },
    },
  },
  plugins: [],
};
