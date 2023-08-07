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
        xs: "425px",
      },
      colors: {
        bg: {
          dark: "hsl(240, 8%, 3%)",
          light: "hsl(220, 29%, 93.9%)",
          grey: "hsl(0, 0%, 96.1%)",
          darkShaded: "hsl(220, 19%, 8%)",
          lightBluePrimary: "hsl(220, 100%, 58.4%)",
          lightSecondary: "hsl(0, 0%, 100%)",
          lightGray: "hsl(215, 33.3%, 92.9%)",
          secondary: "hsla(220, 10%, 48%, 1)",
          darkPrimary: "hsl(0, 0%, 100%)",
          darkSubtext: "hsl(219, 8%, 65%)",
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
