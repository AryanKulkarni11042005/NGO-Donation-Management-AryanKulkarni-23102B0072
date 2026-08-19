import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2E7D32",
          dark: "#1B5E20",
          light: "#E8F5E9",
        },
        secondary: {
          DEFAULT: "#0288D1",
          light: "#E1F5FE",
        },
        accent: {
          DEFAULT: "#F9A825",
          light: "#FFF8E1",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
