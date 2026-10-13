/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,vue}'],
  theme: {
    extend: {
      fontFamily: {
        product: ['Google Sans Flex', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
