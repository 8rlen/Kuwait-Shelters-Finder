import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Use subdirectory base for GitHub Pages; root for Vercel and local dev
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS ? '/Kuwait-Shelters-Finder/' : '/',
})
