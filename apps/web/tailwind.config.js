/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#D92D20',
          dark: '#B42318',
          light: '#FEF3F2',
          border: '#FECDCA'
        },
        surface: {
          bg: '#F8FAFC',
          card: '#FFFFFF',
          secondary: '#F2F4F7'
        },
        content: {
          main: '#101828',
          sub: '#667085',
          muted: '#98A2B3'
        },
        border: {
          subtle: '#EAECF0',
          focus: '#D0D5DD'
        },
        state: {
          success: '#12B76A',
          warning: '#F79009',
          info: '#2E90FA'
        }
      },
      borderRadius: {
        'civic': '14px',
        'civic-lg': '18px'
      }
    },
  },
  plugins: [],
}
