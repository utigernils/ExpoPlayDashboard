/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // SUVA Design System Colors
        suva: {
          // Primary Colors - Grey
          'grey-100': '#666666',    // Body text, low-hierarchy titles
          'grey-75': '#8C8C8C',
          'grey-50': '#B2B2B2',
          'grey-25': '#D9D9D9',
          'bg-grey': '#F2F2F2',     // Background of modules/sections
          
          // Primary Colors - Orange
          'orange-100': '#FF8200',  // H1-H3 headlines, illustrations, graphics
          'orange-75': '#FFA140',
          'orange-50': '#FFC07F',
          'orange-25': '#FFE0BF',
          
          // Primary Colors - Blue
          'blue-100': '#00B8CF',    // Interactive elements (buttons, links, icons, tags)
          'blue-75': '#40CADB',
          'blue-50': '#7FDBE7',
          'blue-25': '#BFEDF3',
          
          // Secondary Colors (use sparingly for accents)
          'green-accent': '#C1E200',
          'red-accent': '#EB0064',
          'yellow-accent': '#FCE300',
          'interaction-blue': '#007180', // User interactions
          
          // System Colors (for information status)
          'positive': '#66B300',
          'negative': '#CC0000',
          'neutral': '#FFCC00',
          'information': '#0066CC',
        },
        
        // Override default Tailwind colors to use SUVA system
        primary: {
          50: '#BFEDF3',
          100: '#7FDBE7', 
          200: '#40CADB',
          300: '#00B8CF',
          400: '#00B8CF',
          500: '#00B8CF',
          600: '#007180',
          700: '#007180',
          800: '#007180',
          900: '#007180',
        },
        secondary: {
          50: '#FFE0BF',
          100: '#FFC07F',
          200: '#FFA140',
          300: '#FF8200',
          400: '#FF8200',
          500: '#FF8200',
          600: '#FF8200',
          700: '#FF8200',
          800: '#FF8200',
          900: '#FF8200',
        },
        gray: {
          50: '#F2F2F2',
          100: '#D9D9D9',
          200: '#B2B2B2',
          300: '#8C8C8C',
          400: '#666666',
          500: '#666666',
          600: '#666666',
          700: '#666666',
          800: '#666666',
          900: '#666666',
        },
        // Status colors
        success: '#66B300',
        warning: '#FFCC00',
        error: '#CC0000',
        info: '#0066CC',
      },
    },
  },
  plugins: [],
};
