import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import ui from '@nuxt/ui/vite'

// Set base to the repository name for GitHub Pages project sites
// (https://<user>.github.io/<repo>/). Override with VITE_BASE if needed.
export default defineConfig({
  base: process.env.VITE_BASE ?? '/recipes/',
  plugins: [
    vue(),
    // Theme colors live here: change primary/neutral to restyle the whole site.
    ui({ ui: { colors: { primary: 'orange', neutral: 'zinc' } } }),
  ],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
