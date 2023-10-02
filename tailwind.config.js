/* eslint-env node */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    fontFamily: {
      sans: ["Loos", "sans-serif"],
    },
    extend: {
      screens: {
        xs: "425px",
      },
      colors: {
        airswap: {
          blue: "#2B71FF",
        },
      },
      fontFamily: {
        mono: ["DM Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
