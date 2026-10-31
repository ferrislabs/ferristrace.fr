import { fileURLToPath } from 'node:url'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import { thumbnailIntegration } from '@ferristrace/thumbnail/integration'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import { loadEnv } from 'vite'

/**
 * Vite loads this directory's .env into import.meta.env, but that happens
 * after the config is evaluated, so `site` read process.env and found nothing
 * every local build. An unset `site` is silent: absolute URLs degrade to bare
 * paths, which the RSS feed is not allowed to emit. Reading the same file here
 * keeps the two in step.
 */
const ENV_DIR = fileURLToPath(new URL('../../', import.meta.url))
const env = loadEnv(process.env.NODE_ENV ?? 'production', ENV_DIR, 'PUBLIC_')

export default defineConfig({
  site: process.env.PUBLIC_WEBSITE_URL || env.PUBLIC_WEBSITE_URL || undefined,
  integrations: [
    react(),
    /*
     * Needs `site`, and emits nothing without it — which is the same condition
     * the social cards depend on, so the two fail and recover together.
     *
     * 404 is the one page to keep out: it carries robots="noindex", and a
     * sitemap that advertises a page asking not to be indexed is a
     * contradiction a crawler reports.
     */
    sitemap({ filter: (page) => !page.endsWith('/404') }),
    thumbnailIntegration({
      appName: 'FerrisTrace',
      content: {
        type: 'static',
        pages: [
          {
            path: '/',
            title: 'FerrisTrace',
            description: 'Traces, metrics and logs in a single container.',
          },
        ],
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    envDir: ENV_DIR,
  },
})
