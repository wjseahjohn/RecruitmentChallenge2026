import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#14141F",
        cream: "#F5F1E8",
        gold: "#C9A227",
        goldlight: "#E4C868",
        slate: "#5B5B6B",
        stagegrey: "#D8D3C4",
        good: "#3F6B4A",
        warn: "#B4772A",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
        serif: ["Cormorant Garamond", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
