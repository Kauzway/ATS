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
          // TradingView-like dark theme colors
          'tv-bg-primary': '#131722',
          'tv-bg-secondary': '#1E222D',
          'tv-border': '#2A2E39',
          'tv-text-primary': '#D1D4DC',
          'tv-text-secondary': '#787B86',
          'tv-blue': '#2962FF',
          'tv-red': '#FF4A68',
          'tv-green': '#26A69A',
          // Custom application colors
          'ats-primary': '#3568D4',
          'ats-primary-dark': '#2C56B0',
          'ats-secondary': '#26A69A',
          'ats-secondary-dark': '#1E8177',
          'ats-danger': '#FF4A68',
          'ats-warning': '#FFAC33',
          'ats-success': '#26A69A',
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
          mono: ['JetBrains Mono', 'monospace'],
        },
        boxShadow: {
          card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
        backgroundImage: {
          'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        }
      },
    },
    plugins: [],
  }