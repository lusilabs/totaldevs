const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  mode: 'jit',
  purge: [
    './pages/**/*.{js,jsx,ts,tsx,vue}',
    './components/**/*.{js,jsx,ts,tsx,vue}'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    fontFamily: {
      sans: ['Inter var', ...defaultTheme.fontFamily.sans]
    }
  },
  variants: {
    extend: {},
    animation: ['motion-reduce', 'motion-safe']
  },
  plugins: [require('@tailwindcss/forms')]
}
