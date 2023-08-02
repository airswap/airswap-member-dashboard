/* eslint-env node */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Loos", "sans-serif"],
    },
    extend: {
      screens: {
        xs: '425px'
      },
      colors: {
        bg: {
          dark: "hsl(240, 8%, 3%)",
          darkShaded: "hsl(220, 48%, 39%)",
        },
        accent: {
          blue: "hsl(220, 100%, 58%)",
          orange: "hsl(42, 100%, 59%)",
          green: "hsl(122, 100%, 69%)",
          red: "hsl(0, 100%, 50%)",
        },
        border: {
          dark: "hsl(216, 18%, 12%)",
        },
      },
    },
  },
  plugins: [],
};
