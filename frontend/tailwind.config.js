const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Paper and ink. Green, yellow and red are only ever skill marks: have, close and missing.
      colors: {
        paper: "#F5F5F2",
        sheet: "#FFFFFF",
        ink: { DEFAULT: "#1C1C1F", 2: "#45464D" },
        rule: { DEFAULT: "#DCDBD5", soft: "#E6E5E0" },
        have: "#C8EDB9",
        close: "#FBE38A",
        miss: { DEFAULT: "#C8412B", text: "#A8321F", soft: "#F6D3CB" },
      },
      fontFamily: {
        sans: ["Public Sans", ...defaultTheme.fontFamily.sans],
        serif: ["Newsreader", ...defaultTheme.fontFamily.serif],
      },
    },
  },
  plugins: [],
}
