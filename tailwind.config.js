/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1B2430",
        parchment: "#F7F3E8",
        spine: "#7A4B2E",
        accent: "#2F6F5E",
      },
    },
  },
  plugins: [],
};
