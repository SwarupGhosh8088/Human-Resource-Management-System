/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1B2430",
        paper: "#F4F6F8",
        slate: {
          DEFAULT: "#5B6B7A",
          50: "#F1F3F5",
          100: "#E3E7EA",
          200: "#C7CFD6",
          400: "#8B98A3",
          600: "#5B6B7A",
          700: "#42505C",
        },
        gold: {
          DEFAULT: "#C8963E",
          50: "#FBF3E6",
          100: "#F3E1BE",
          400: "#D4A754",
          600: "#C8963E",
          700: "#A87A2E",
        },
        success: {
          DEFAULT: "#2F8F5B",
          50: "#E8F5EE",
          600: "#2F8F5B",
        },
        danger: {
          DEFAULT: "#C1443D",
          50: "#FBEAE9",
          600: "#C1443D",
        },
        surface: "#FFFFFF",
      },
      fontFamily: {
        display: ["Arial", "Helvetica", "sans-serif"],
        body: ["Arial", "Helvetica", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      borderRadius: {
        badge: "6px",
      },
    },
  },
  plugins: [],
};
