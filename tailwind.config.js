/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}', // Adjust this path to match your project structure
  ],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        foreground: '#333333',
        accent: '#EE8220',
        hover: '#3366FF',
        heading: '#002147',
        muted: '#f9fafb',
      },
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
        heading: ['Open Sans', 'sans-serif'],
        body: ['Open Sans', 'sans-serif'],
      },
      spacing: {
        'section': '5rem',
        'container': '1.5rem',
      },
      borderRadius: {
        DEFAULT: '0.375rem',
        md: '0.5rem',
      },
    },
  },
  plugins: [],
}
