/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F4F2F3',
        text: '#1A1A1A',  // off-black
        primary: '#9EBC9F',
        secondary: '#D3B88C',
        logout: '#656256',
      }
    },
  },
  plugins: [],
}