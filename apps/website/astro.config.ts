import react from '@astrojs/react'
import { thumbnailIntegration } from '@cometrace/thumbnail/integration'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: process.env.PUBLIC_WEBSITE_URL || undefined,
  integrations: [
    react(),
    thumbnailIntegration({
      appName: 'Cometrace',
      content: {
        type: 'static',
        pages: [
          {
            path: '/',
            title: 'Cometrace',
            description: 'Traces, metrics and logs in a single container.',
          },
        ],
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    envDir: '../../',
  },
})
