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
          DEFAULT: '#9F241F',
          dark: '#7E1C18',
          light: '#FDF2F1',
          border: '#F8D3D1',
          hover: '#7E1C18'
        },
        surface: {
          bg: '#F7F6F3',
          card: '#FFFFFF',
          secondary: '#F2EFE9',
          muted: '#EBE7DF',
          subtle: '#FAF8F5'
        },
        content: {
          main: '#171313',
          sub: '#5C5550',
          muted: '#7E7771',
          inverse: '#FAF8F5'
        },
        border: {
          subtle: 'rgba(23, 19, 19, 0.08)',
          DEFAULT: 'rgba(23, 19, 19, 0.12)',
          strong: 'rgba(23, 19, 19, 0.20)',
          focus: '#9F241F'
        },
        state: {
          success: '#1B7A4B',
          'success-soft': '#EDF7F2',
          warning: '#B45309',
          'warning-soft': '#FEF3C7',
          danger: '#9F241F',
          'danger-soft': '#FDF2F1',
          info: '#1E3A5F',
          'info-soft': '#F0F4F8',
          teal: '#0D6F64',
          'teal-soft': '#E6F4F2'
        }
      },
      borderRadius: {
        'civic-sm': '6px',
        'civic': '10px',
        'civic-lg': '14px',
        'civic-xl': '20px'
      },
      boxShadow: {
        'xs': '0 1px 2px rgba(23, 19, 19, 0.04)',
        'sm': '0 2px 6px rgba(23, 19, 19, 0.06)',
        'md': '0 8px 24px -4px rgba(23, 19, 19, 0.08)',
        'lg': '0 16px 36px -8px rgba(23, 19, 19, 0.12)'
      }
    },
  },
  plugins: [],
}
