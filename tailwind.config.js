/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'var-primary': '#f0520e',
        'var-primary-dark': '#e34c0c',
        'var-secondary': '#4B5563',
        'var-accent': '#F3F4F6',
      },
    },
  },
  plugins: [],
} 