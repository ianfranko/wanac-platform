/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/app/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          brand: {
            white: '#ffffff',
            gray: '#dad9d9',
            orange: '#ff5e1a',
            navy: '#002147',
          },
        },
      },
    },
    plugins: [],
  }
  