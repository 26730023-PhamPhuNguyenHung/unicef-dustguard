import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    path.join(__dirname, './index.html'),
    path.join(__dirname, './src/**/*.{js,ts,jsx,tsx}'),
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F7F6F3',
        page: '#F7F6F3',
        surface: {
          DEFAULT: '#FFFFFF',
          subtle: '#F2EFE9',
          muted: '#EBE7DF',
        },
        ink: {
          900: '#171313',
          800: '#231B14',
          700: '#3D352E',
          600: '#5C5550',
          500: '#7E7771',
          400: '#A89E93',
        },
        dustguard: {
          red: '#9F241F',
          redHover: '#7E1C18',
          redSoft: '#FDF2F1',
          redBorder: '#F8D3D1',
          teal: '#0D6F64',
          tealHover: '#0A564E',
          tealSoft: '#E6F4F2',
          tealBorder: '#A7F3D0',
          amber: '#B45309',
          amberSoft: '#FEF3C7',
          green: '#1B7A4B',
          greenSoft: '#EDF7F2',
        },
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '20px',
      },
      boxShadow: {
        xs: '0 1px 2px rgba(23, 19, 19, 0.04)',
        sm: '0 2px 6px rgba(23, 19, 19, 0.06)',
        md: '0 8px 24px -4px rgba(23, 19, 19, 0.08)',
        lg: '0 16px 36px -8px rgba(23, 19, 19, 0.12)',
      },
    },
  },
  plugins: [],
};
