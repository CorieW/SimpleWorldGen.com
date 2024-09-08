/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'theme-color': '#1F1F1F',
          'theme-accent': '#FFD700',
          'theme-grey': '#747474',
          'theme-bg': '#F3F4F6'
        },
        boxShadow: {
          'intense': '0 5px 7px -1px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        }
      },
    },
    plugins: ["prettier-plugin-tailwindcss"],
  }