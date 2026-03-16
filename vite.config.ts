import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Esha/', // GitHub Pages repo name — change to /Esha/ when you swap repos
})
