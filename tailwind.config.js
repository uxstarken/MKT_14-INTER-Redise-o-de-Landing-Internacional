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
          DEFAULT: 'var(--primary-color, #029E47)',
          hover: 'var(--primary-hover, #02853c)',
          light: 'var(--primary-light, #e6f7ed)',
        },
        starken: {
          green: {
            primary: '#1A5C35',
            medium: '#2E7D52',
            light: '#E8F5EE',
          },
          partner: {
            purple: '#411C72',
            hover: '#2d1350',
            light: '#f5f2fa',
          },
          empresas: {
            cyan: '#33798C',
            hover: '#255d6c',
            light: '#ecf5f7',
          }
        }
      },
      fontFamily: {
        sans: ['DIN', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
        din: ['DIN', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
