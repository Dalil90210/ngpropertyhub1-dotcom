/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy': '#0B2545',
        'gold': '#C9922A',
        'navy-dark': '#081a2f',
      }
    },
  },
  plugins: [],
}
