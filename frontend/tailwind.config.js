import { colors } from "./src/styles/colors.js";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors,
      screens: {
        'xs': '375px',
      },
    },
  },
  plugins: [],
};
