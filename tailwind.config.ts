import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        audio: {
          dark: "#0f172a",
          panel: "#1e293b",
          border: "#334155",
          accent: "#06b6d4",
          neon: "#10b981",
          warning: "#f59e0b",
          danger: "#ef4444",
        }
      },
    },
  },
  plugins: [],
} satisfies Config;
