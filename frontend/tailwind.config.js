/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        hindi: ["'Tiro Devanagari Hindi'", "serif"],
        body: ["Hind", "sans-serif"]
      }
    }
  },
  plugins: []
};
