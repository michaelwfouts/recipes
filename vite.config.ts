import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

// Set base to the repository name for GitHub Pages project sites
// (https://<user>.github.io/<repo>/). Override with VITE_BASE if needed.
export default defineConfig({
  base: process.env.VITE_BASE ?? '/recipes/',
  plugins: [vue()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
