/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'eb-blue': '#1F57EC',
        'eb-blue-dark': '#1544c7',
        'eb-blue-light': '#e8effd',
      },
      height: {
        screen: ['100vh', '100dvh'],
      },
    },
  },
  plugins: [],
};
