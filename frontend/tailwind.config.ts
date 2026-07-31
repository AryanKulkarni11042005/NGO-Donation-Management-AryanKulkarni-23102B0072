import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        neutral: {
          950: "#0a0a0a",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
