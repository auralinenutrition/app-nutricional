// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        fadeSlideUp: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
      animation: {
        fadeSlideUp: "fadeSlideUp 0.25s ease-out",
        fadeIn: "fadeIn 0.2s ease-out",
      },
    },
  },
};
