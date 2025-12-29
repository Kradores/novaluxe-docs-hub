import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", "string"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    extend: {
      boxShadow: {
        "glow-gold":
          "0 0 20px hsl(from var(--gold) h s l / 0.3), 0 0 40px hsl(from var(--gold) h s l / 0.1)",
        "xs-glow-gold":
          "0 0 20px hsl(from var(--gold) h s l / 0.3), 0 0 40px hsl(from var(--gold) h s l / 0.1)",
        "sm-navy-gold":
          "0 20px 40px hsl(from var(--navy) h s l / 0.5), 0 0 40px hsl(from var(--gold) h s l / 0.1)",
      },
      keyframes: {
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: {
            opacity: 0,
          },
          to: {
            opacity: 1,
          },
        },
        scaleIn: {
          from: {
            opacity: 0,
            transform: "scale(0.95)",
          },
          to: {
            opacity: 1,
            transform: "scale(1)",
          },
        },
      },
      animation: {
        "slide-up": "slideUp 0.5s ease-out forwards",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "scale-in": "scaleIn 0.3s ease-out forwards",
      },
      backgroundImage: {
        gradient: {
          gold: "linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)",
          navy: "linear-gradient(180deg, var(--navy) 0%, var(--navy-light) 100%)",
        },
      },
    },
  },
  plugins: [],
};

export default config;
