/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#120B48",
        primary400: "#413c6d",
        primary300: "#605c84",
        primary50: "#e7e7ed",
        secondary: "#13009f",
      },
    },
  },
  plugins: [],
};
