import { defineConfig } from 'windicss/helpers'
import formsPlugin from 'windicss/plugin/forms'

export default defineConfig({
  darkMode: 'class',
  safelist: 'p-3 p-4 p-5',
  theme: {
    extend: {
      colors: {
        pink: {
          400: "#FF0079"
        },
        dark: {
          100: '#111215',
          200: '#17191E',
          300: "#1D2026",
          400: "#434547",
          500: "#6D6E72",
        },
      },
    },
  },
  plugins: [formsPlugin],
})