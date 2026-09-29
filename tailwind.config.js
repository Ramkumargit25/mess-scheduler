/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mess: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        breakfast: {
          light: '#fef3c7',
          border: '#f59e0b',
          text: '#b45309',
        },
        lunch: {
          light: '#ffedd5',
          border: '#f97316',
          text: '#c2410c',
        },
        dinner: {
          light: '#ede9fe',
          border: '#8b5cf6',
          text: '#6d28d9',
        }
      }
    },
  },
  plugins: [],
}
