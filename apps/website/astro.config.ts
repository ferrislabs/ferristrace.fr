import react from '@astrojs/react'
import { thumbnailIntegration } from '@cometrace/thumbnail/integration'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import { pages } from './src/lib/pages'

export default defineConfig({
  site: process.env.PUBLIC_WEBSITE_URL || undefined,
  integrations: [
    react(),
    // One social card per page, from the same metadata as the <head> tags.
    thumbnailIntegration({
      appName: 'FerrisTrace',
      primaryColor: '#4f46e5',
      content: {
        type: 'static',
        pages: pages.map((page) => ({ path: page.path, headline: page.card.eyebrow, title: page.card.headline })),
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    envDir: '../../',
    server: {
      allowedHosts: ['unlimitedly-uncompletable-addilyn.ngrok-free.dev']
    }
  },
})
