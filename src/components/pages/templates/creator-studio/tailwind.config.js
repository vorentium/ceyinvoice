/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Adjust if using only js/jsx
  ],
  theme: {
    extend: {
      colors: {
        'dark-transparent': 'rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
}