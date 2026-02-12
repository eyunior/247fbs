/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1D408A',
        'primary-light': '#2A52A8',
        'primary-dark': '#152E66',
        secondary: '#F3752B',
        'secondary-light': '#FF8F4F',
        'secondary-dark': '#D45E1A',
        'light-color': '#FFFFFE',
        'black-color': '#000000',
        'heading-color': '#1B1D1D',
        background: '#FFFFFF',
        'background-alt': '#F1F3F9',
        foreground: '#6A6A6A',
        'meta-color': '#A6A3A3',
        'border-color': '#E7E6E6',
      },
      fontFamily: {
        sans: ['Albert Sans', 'sans-serif'],
        heading: ['Mona Sans', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(29, 64, 138, 0.07), 0 10px 20px -2px rgba(29, 64, 138, 0.04)',
        'card': '0 4px 25px -5px rgba(29, 64, 138, 0.1), 0 10px 10px -5px rgba(29, 64, 138, 0.04)',
        'card-hover': '0 20px 40px -10px rgba(29, 64, 138, 0.15), 0 10px 20px -5px rgba(29, 64, 138, 0.08)',
        'glow': '0 0 20px rgba(243, 117, 43, 0.3)',
        'glow-primary': '0 0 20px rgba(29, 64, 138, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.5s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.6s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}

