import { defineConfig } from 'windicss/helpers'
import formsPlugin from 'windicss/plugin/forms'
import colors from 'windicss/colors'

export default defineConfig({
  darkMode: 'class',
  safelist: 'p-3 p-4 p-5',
  theme: {
    colors: {
      ...colors,
      pink: {
        300: "#D6005A",
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
  plugins: [formsPlugin],
})