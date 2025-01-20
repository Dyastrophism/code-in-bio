import type { Config } from "tailwindcss";

const config: Config ={
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "background-primary": "#050505",
        "background-secondary": "#0F0F10",
        "background-tertiary": "#19191A",
        "content-heading": "#FFFFFF",
        "content-body": "#CDCBCC",
        "content-headline": "#B2B2B2",
        "content-placeholder": "#827D7F",            
        "accent-purple": "#4B2DBB",
        "accent-blue": "#30B9E3",
        "accent-green": "#87BB2D",
        "accent-pink": "#B5446B",
        "accent-yellow": "#DCCB2E",
        "accent-purple-dark": "#171031",    
        "accent-blue-dark": "#102831",
        "accent-green-dark": "#222D26",
        "accent-pink-dark": "#2C1A22",
        "accent-yellow-dark": "#282A0F",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;