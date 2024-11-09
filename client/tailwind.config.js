/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      animation: {
        loading: 'loadingAnimation 1.5s infinite linear',
      },
      colors: {
        'grape': '#5E1AEB',
        'darkbtn': '#404040',
        'darkbg': '#2D2D2D',
        'darkbtnhov': '#525252',
        'darknav': '#202020',
        'darklabel': '#3F3F3F',
        'darklisthov': '#4d4d4d',
        'darknavhov': '#2b2b2b',
        'elixir': '#8C52FF',
        'forest': '#00A508',
        'gunmetal': '#687182',
        'lightbtn': '#d6d6d6',
        'lightbtnhov': '#c4c4c4',
        'lightnav': '#F5F5F5',
        'lightlisthov': '#e6e6e6',
        'lilac': '#9A98FF',
        'slate': '#F5F5F5',
        'stone': '#b5b5b5',
        'silver': '#eeeeee',
        'red': '#FF3C3C',
        'gradient-start': 'rgba(255, 255, 255, 0.2)',
        'gradient-middle': 'rgba(255, 255, 255, 0.6)',
        'gradient-end': 'rgba(255, 255, 255, 0.2)'
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
        'elixirmd': '0 7px 7px rgba(140, 82, 255, 0.35)',
      },
      fontFamily: {
        custom: ['San Francisco Pro', 'sans-serif'],
      },
      keyframes: {
        loadingAnimation: {
          '0%': {
            'background-position': '-400px 0',
          },
          '100%': {
            'background-position': '400px 0',
          },
        },
      },
    },
  },
  plugins: [],
}

