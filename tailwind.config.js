/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: {
          DEFAULT: "#0f0f0f",
          light: "#1a1a1a",
          lighter: "#252525",
        },
        gold: {
          DEFAULT: "#c9a962",
          light: "#d4bc7e",
          dark: "#b8964a",
          muted: "#8b7a4a",
        },
        copper: {
          DEFAULT: "#b87333",
          light: "#c98b4a",
          dark: "#9a5f2a",
        },
        burgundy: {
          DEFAULT: "#8b2500",
          light: "#a03a1a",
        },
        navy: {
          DEFAULT: "#1e3a5f",
          light: "#2a4d7a",
        },
        parchment: {
          DEFAULT: "#f5f0e6",
          dark: "#e8e0d0",
        },
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        body: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "fade-in-up": "fadeInUp 0.8s ease-out forwards",
        "fade-in-down": "fadeInDown 0.8s ease-out forwards",
        "slide-in": "slideIn 0.6s ease-out forwards",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "count-up": "countUp 1.5s ease-out forwards",
        "shimmer": "shimmer 2s infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(201, 169, 98, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(201, 169, 98, 0.6)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      boxShadow: {
        "gold": "0 4px 20px rgba(201, 169, 98, 0.15)",
        "gold-lg": "0 8px 40px rgba(201, 169, 98, 0.25)",
        "gold-xl": "0 20px 60px rgba(201, 169, 98, 0.3)",
        "card": "0 2px 10px rgba(0, 0, 0, 0.3)",
        "card-hover": "0 10px 40px rgba(0, 0, 0, 0.5)",
      },
    },
  },
  plugins: [],
};
