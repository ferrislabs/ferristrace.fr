import { defineConfig } from '@ferristrace/config'

export const siteConfig = defineConfig({
  titleTemplate: '%s',
  /**
   * The social card every page falls back to. Authored at 1200x630, the size
   * base.astro declares, so a page that overrides it has to be drawn at the
   * same size or the declaration lies.
   */
  thumbnail: '/og/landing.png',
})
