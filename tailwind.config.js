/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,jsx}', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#000000',
        night: '#05070a',
        lime: '#90eb61',
        teal: '#24baac',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-space)', 'var(--font-inter)', 'sans-serif'],
        brand: ['var(--font-poppins)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        drift: {
          '0%,100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(0,-20px,0)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        hueGlow: {
          '0%,100%': { opacity: 0.55 },
          '50%': { opacity: 1 },
        },
        spinSlow: {
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        drift: 'drift 9s ease-in-out infinite',
        scan: 'scan 6s linear infinite',
        hueGlow: 'hueGlow 5s ease-in-out infinite',
        spinSlow: 'spinSlow 40s linear infinite',
      },
    },
  },
  plugins: [],
};
