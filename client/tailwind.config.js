/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'elixir': '#8C52FF',
        'grape': '#5E1AEB',
        'darkbtn': '#404040',
        'darkbtnhov': '#525252',
        'gunmetal': '#687182',
        'lightbtn': '#d6d6d6',
        'lightbtnhov': '#c4c4c4',
        'lightnav': '#F5F5F5',
        'lilac': '#9A98FF',
        'slate': '#F5F5F5',
        'stone': '#b5b5b5',
        'darkbg': '#2D2D2D',
        'darknav': '#202020',
        'darklabel': '#3F3F3F'
      },
      dropShadow: {
        'med': '0 7px 7px rgba(0, 0, 0, 0.10)',
        'lge': '0 20px 20px rgba(0, 0, 0, 0.10)',
        'xl': '0 25px 25px rgba(0, 0, 0, 0.10)',
        'xxl': '0 30px 30px rgba(0, 0, 0, 0.10)',
        'xxxl': '0 35px 35px rgba(0, 0, 0, 0.10)',
        'darkmed': '0 7px 7px rgba(255, 255, 255, 0.10)',
        'darklge': '0 20px 20px rgba(255, 255, 255, 0.10)',
        'darkxl': '0 25px 25px rgba(255, 255, 255, 0.10)',
        'darkxxl': '0 30px 30px rgba(255, 255, 255, 0.10)',
        'darkxxxl': '0 35px 35px rgba(255, 255, 255, 0.10)',
      },
      fontFamily: {
        custom: ['San Francisco Pro', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

