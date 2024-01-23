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
        primary: "#449DD1",
      },
      fontFamily: {
        serif: "Martel, serif",
        sans: '"Rubik Variable", sans-serif',
      },
    },
  },
  plugins: [],
} satisfies Config;
