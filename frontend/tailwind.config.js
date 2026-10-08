export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: { ink: "#14303A", fog: "#EFF4F3", sea: "#2B7A78", seadark: "#1F5E5C", haze: "#D5E3E1", rose: "#A4372F" },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["Manrope", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
