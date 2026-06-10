/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Driven by CSS variables (see styles/globals.css) so utilities
           re-resolve per [data-theme]. ink = canvas, paper = text,
           amber = accent; ink-2..4 = raised surfaces. */
        ink: {
          DEFAULT: "rgb(var(--ink) / <alpha-value>)",
          2: "rgb(var(--ink-2) / <alpha-value>)",
          3: "rgb(var(--ink-3) / <alpha-value>)",
          4: "rgb(var(--ink-4) / <alpha-value>)",
        },
        paper: "rgb(var(--paper) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        faint: "rgb(var(--faint) / <alpha-value>)",
        /* hairlines + glass surfaces — full rgba vars, no alpha modifier */
        line: "var(--line)",
        "line-strong": "var(--line-strong)",
        glass: "var(--glass)",
        "glass-strong": "var(--glass-strong)",
        amber: {
          DEFAULT: "rgb(var(--amber) / <alpha-value>)",
          hi: "rgb(var(--amber-hi) / <alpha-value>)",
          deep: "rgb(var(--amber-deep) / <alpha-value>)",
        },
        /* kept so any stale references degrade gracefully */
        brand: {
          primary: "rgb(var(--amber) / <alpha-value>)",
          secondary: "rgb(var(--amber-hi) / <alpha-value>)",
          accent: "rgb(var(--amber-deep) / <alpha-value>)",
          light: "rgb(var(--ink-3) / <alpha-value>)",
          dark: "rgb(var(--paper) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        kenburns: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.12)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "0.7" },
        },
      },
      animation: {
        marquee: "marquee 38s linear infinite",
        floaty: "floaty 7s ease-in-out infinite",
        kenburns: "kenburns 18s ease-out forwards",
        pulseGlow: "pulseGlow 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
