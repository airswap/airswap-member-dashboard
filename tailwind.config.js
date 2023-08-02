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
        xs: "425px",
      },
      colors: {
        font: {
          secondary: "hsla(220, 10%, 48%, 1)",
        },
        bg: {
          dark: "hsl(240, 8%, 3%)",
          light: "hsl(220, 29%, 93.9%)",
          grey: "hsl(0, 0%, 96.1%)",
          darkShaded: "hsl(220, 48%, 39%)",
        },
        accent: {
          lightgreen: "hsla(158, 88%, 44%, 1)",
          lightred: "hsla(3, 88%, 68%, 1)",
          blue: "hsl(220, 100%, 58%)",
          orange: "hsl(42, 100%, 59%)",
          green: "hsl(122, 100%, 69%)",
          red: "hsl(0, 100%, 50%)",
        },
        border: {
          dark: "hsl(216, 18%, 18%)",
        },
      },
    },
  },
  plugins: [],
};
