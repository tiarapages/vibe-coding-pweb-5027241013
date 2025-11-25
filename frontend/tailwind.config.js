/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        "neon-purple": "#a855f7",
        "neon-pink": "#ec4899",
        "neon-violet": "#8b5cf6",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
          "33%": { transform: "translate(30px, -30px) rotate(5deg)" },
          "66%": { transform: "translate(-20px, 20px) rotate(-5deg)" },
        },
        "float-slower": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(-40px, 40px) scale(1.1)" },
        },
        "float-reverse": {
          "0%, 100%": { transform: "translate(0, 0) rotate(45deg)" },
          "33%": { transform: "translate(-25px, 25px) rotate(50deg)" },
          "66%": { transform: "translate(25px, -15px) rotate(40deg)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "float-slow": "float-slow 6s ease-in-out infinite",
        "float-slower": "float-slower 8s ease-in-out infinite",
        "float-reverse": "float-reverse 5s ease-in-out infinite",
        "slide-up": "slide-up 0.5s ease-out",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
}
