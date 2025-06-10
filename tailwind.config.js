/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // this must be present
  ],
  theme: {
    extend: {
       fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      animation: {
    'fade-in': 'fadeIn 0.8s ease-out',
    'float': 'float 6s ease-in-out infinite',
    'gradient-x': 'gradientX 5s ease infinite',
  },
  keyframes: {
    fadeIn: {
      '0%': { opacity: 0, transform: 'translateY(20px)' },
      '100%': { opacity: 1, transform: 'translateY(0)' },
    },
    float: {
      '0%, 100%': { transform: 'translateY(0px)' },
      '50%': { transform: 'translateY(-10px)' },
    },
    gradientX: {
      '0%, 100%': { backgroundPosition: '0% 50%' },
      '50%': { backgroundPosition: '100% 50%' },
    },
  },

    },
  },
  plugins: [],
}

