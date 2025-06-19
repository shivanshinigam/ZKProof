/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      colors: {
        // Optional: Custom theme colors (adjust to match your brand)
        'primary': '#6366f1', // Indigo-500
        'secondary': '#a855f7', // Purple-500
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },

  plugins: [
    //require('@tailwindcss/forms'),
    //require('@tailwindcss/typography'),
    //require('@tailwindcss/aspect-ratio'),
  ],
};
