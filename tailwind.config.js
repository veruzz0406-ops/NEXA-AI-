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
        nexa: {
          bg: '#070813',
          'bg-deep': '#05060b',
          surface: '#0f1026',
          'surface-light': '#181938',
          card: '#13142e',
          border: 'rgba(168, 85, 247, 0.15)',
          'border-hover': 'rgba(192, 132, 252, 0.4)',
          purple: {
            DEFAULT: '#9333ea',
            light: '#c084fc',
            dark: '#6b21a8',
            glow: '#a855f7',
          },
          violet: '#7c3aed',
          indigo: '#4f46e5',
          neon: '#d946ef',
          lavender: '#e9d5ff',
          muted: '#94a3b8',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(168, 85, 247, 0.2)',
        'glow': '0 0 25px rgba(168, 85, 247, 0.35)',
        'glow-lg': '0 0 50px rgba(168, 85, 247, 0.4)',
        'glow-purple': '0 0 30px rgba(147, 51, 234, 0.45)',
        'glow-card': '0 8px 32px 0 rgba(107, 33, 168, 0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'orb-float': 'orbFloat 6s ease-in-out infinite',
        'orb-glow': 'orbGlow 4s ease-in-out infinite alternate',
        'spin-slow': 'spin 18s linear infinite',
        'spin-reverse-slow': 'spinReverse 22s linear infinite',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.3s ease-out forwards',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        orbFloat: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-10px) scale(1.02)' },
        },
        orbGlow: {
          '0%': { filter: 'drop-shadow(0 0 25px rgba(168, 85, 247, 0.5))' },
          '100%': { filter: 'drop-shadow(0 0 55px rgba(217, 70, 239, 0.85))' },
        },
        spinReverse: {
          'from': { transform: 'rotate(360deg)' },
          'to': { transform: 'rotate(0deg)' },
        },
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(6px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          'from': { opacity: '0', transform: 'translateY(16px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
