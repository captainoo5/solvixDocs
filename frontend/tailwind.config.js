/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: { DEFAULT: '#F47B00', light: '#FFF3E0', dark: '#D46A00' },
        navy:   { DEFAULT: '#0D1B4D', light: '#E8EBF5', dark: '#081030' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

