/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,vue}'],
  theme: {
    extend: {
      fontFamily: {
        product: ['product', 'Open Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
