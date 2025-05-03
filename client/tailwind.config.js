/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
      extend: {
        animation: {
          // Provides type hints for custom animations
          'gradient-rotate': 'gradient-rotate 20s linear infinite',
          'float-in': 'float-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
          'fade-in': 'fade-in 0.8s ease-out forwards'
        }
      }
    },
    plugins: [
      require('tailwindcss-radix')({
        variantPrefix: 'radix',
      }),
      require('tailwindcss-animate')
    ]
  }