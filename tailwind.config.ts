import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mani: {
          red: "#F50B00",
          "red-light": "#FF2D20",
          "red-dark": "#C00800",
          black: "#0A0A0B",
          "black-2": "#101012",
          "black-3": "#161618",
          grey: "#1E1E22",
          "grey-2": "#28282E",
          "grey-3": "#3A3A42",
          white: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-orbitron)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "mani-gradient": "linear-gradient(135deg, #F50B00 0%, #FF2D20 100%)",
        "mani-radial": "radial-gradient(circle at 50% 0%, rgba(245,11,0,0.15) 0%, transparent 60%)",
        "glass": "rgba(255,255,255,0.03)",
      },
      boxShadow: {
        "glow-red": "0 0 20px rgba(245,11,0,0.5), 0 0 40px rgba(245,11,0,0.3)",
        "glow-red-lg": "0 0 30px rgba(245,11,0,0.6), 0 0 60px rgba(245,11,0,0.4)",
        "glass": "0 8px 32px rgba(0,0,0,0.37)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: { "0%": { opacity: "0", transform: "translateY(20px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        slideDown: { "0%": { opacity: "0", transform: "translateY(-20px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        scaleIn: { "0%": { opacity: "0", transform: "scale(0.95)" }, "100%": { opacity: "1", transform: "scale(1)" } },
        glowPulse: { "0%,100%": { boxShadow: "0 0 20px rgba(245,11,0,0.4)" }, "50%": { boxShadow: "0 0 40px rgba(245,11,0,0.7)" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-15px)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
      },
    },
  },
  plugins: [],
};

export default config;
