/* eslint-env node */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
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
          darkShaded: "hsl(220, 19%, 8%)",
          lightBluePrimary: "hsl(220, 100%, 58.4%)",
          lightSecondary: "hsl(0, 0%, 100%)",
          lightGray: "hsl(215, 33.3%, 92.9%)"
        },
        font: {
          darkPrimary: "hsl(0, 0%, 100%)",
          darkSubtext: "hsl(219, 8%, 65%)",
          lightBluePrimary: "hsl(220, 100%, 58.4%)",
        },
        accent: {
          blue: "hsl(220, 100%, 58%)",
          orange: "hsl(42, 100%, 59%)",
          green: "hsl(122, 100%, 69%)",
          red: "hsl(0, 100%, 50%)",
        },
        border: {
          dark: "hsl(216, 18%, 12%)",
          darkShaded: "hsl(220, 19%, 8%)",
          darkGray: "hsl(216, 18%, 20%)",
          darkLight: "hsl(219, 8%, 65%)",
          lightGray: "hsl(215, 33.3%, 92.9%)",
          lightLightGray: "hsl(213, 39%, 93%, 0.2)"
        },
      },
    },
  },
  plugins: [],
};
