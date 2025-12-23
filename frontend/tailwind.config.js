/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#2a2a2a',
          100: '#232323',
          200: '#1e1e1e',
          300: '#1a1a1a',
          400: '#161616',
          500: '#121212',
          600: '#0d0d0d',
          700: '#080808',
          800: '#040404',
          900: '#000000',
        },
        silver: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#8e9399',
          600: '#6c757d',
          700: '#495057',
          800: '#343a40',
          900: '#212529',
        },
        accent: {
          primary: '#c0c0c0',    // Silver
          secondary: '#a8a8a8',  // Darker silver
          hover: '#d4d4d4',      // Lighter silver
          glow: '#e8e8e8',       // Silver glow
        },
      },
      boxShadow: {
        'silver': '0 0 15px rgba(192, 192, 192, 0.3)',
        'silver-lg': '0 0 25px rgba(192, 192, 192, 0.4)',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
