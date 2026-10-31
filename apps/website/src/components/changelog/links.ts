import { docs, IMAGE } from '../landing/links'

/**
 * Destinations used by the changelog. The repository is the core one, where
 * the releases, tags and compare views live.
 */
export const links = {
  image: IMAGE,
  repo: 'https://github.com/ferrislabs/ferristrace',
  rss: '/changelog/rss.xml',
  upgradeGuide: docs('/administration/backups-and-upgrades'),
} as const
