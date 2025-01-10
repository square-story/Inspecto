/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // Enable dark mode using 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "sans-serif"], // Set as default sans-serif font
      },
      colors: {
        primary: "#0d1b2a",
        secondary: "#e0e1dd",
      },
    },
  },
  plugins: [],
}

