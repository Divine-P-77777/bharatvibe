import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        header: ['Noto Sans Devanagari', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwind-scrollbar')]
  ,
};

export default config;
