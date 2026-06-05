/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        brand: {
          50:  "#fff7ed",
          100: "#ffedd5",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
        },
        dark: {
          900: "#0a0a0f",
          800: "#111118",
          700: "#1a1a26",
          600: "#22223a",
          500: "#2e2e4a",
        },
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease forwards",
        "pop": "pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "streak-fire": "streakFire 1s ease infinite alternate",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(16px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        pop: {
          "0%": { transform: "scale(0.8)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        streakFire: {
          "0%": { textShadow: "0 0 8px #f97316" },
          "100%": { textShadow: "0 0 24px #f97316, 0 0 48px #ea580c" },
        },
      },
    },
  },
  plugins: [],
};
