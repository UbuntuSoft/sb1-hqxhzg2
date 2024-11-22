/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0E0F12',
        surface: '#1A1A1E',
        card: '#1E1E22',
        'chart-bg': '#121212',
        primary: '#1A73E8',
        'text-secondary': '#B3B3B3',
        success: '#34C759',
        error: '#FF3B30',
      },
    },
  },
  plugins: [],
};