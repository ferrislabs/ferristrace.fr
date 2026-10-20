import { docs } from '../landing/links'

/**
 * Destinations used by the changelog. The container registry is still a
 * visible placeholder; the repository is the core one, where the releases,
 * tags and compare views live.
 */
export const links = {
  image: '[IMAGE]',
  repo: 'https://github.com/Comettrace/Cometrace',
  rss: '/changelog/rss.xml',
  upgradeGuide: docs('/administration/backups-and-upgrades'),
} as const
