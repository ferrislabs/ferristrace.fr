import type { SiteConfig } from './contracts'

const REPO = 'https://github.com/Comettrace/Cometrace'

export const defaultConfig: SiteConfig = {
  name: 'Cometrace',
  titleTemplate: '%s · Cometrace',
  favicon: '/favicon.svg',
  logo: '/logo.svg',
  thumbnail: '/thumbnail.png',
  twitterCard: 'summary_large_image',
  ogType: 'website',
  github: REPO,
  defaultLocale: 'en',
  locales: ['en', 'fr'],
  footer: {
    description: 'footer.description',
    columns: {
      documentation: 'footer.columns.documentation',
      resources: 'footer.columns.resources',
      community: 'footer.columns.community',
    },
    copyright: 'footer.copyright',
    builtWith: 'footer.builtWith',
    links: {
      // Pages that exist in the docs content tree.
      documentation: [
        {
          label: 'footer.links.quickstart',
          href: '/{locale}/cometrace/getting-started/quickstart-self-host',
        },
        { label: 'footer.links.sendingData', href: '/{locale}/cometrace/sending-data/ingest-keys' },
        {
          label: 'footer.links.administration',
          href: '/{locale}/cometrace/administration/projects',
        },
        { label: 'footer.links.reference', href: '/{locale}/cometrace/reference/configuration' },
      ],
      resources: [
        { label: 'footer.links.github', href: REPO, external: true },
        { label: 'footer.links.changelog', href: `${REPO}/releases`, external: true },
      ],
      community: [
        { label: 'footer.links.issues', href: `${REPO}/issues`, external: true },
        { label: 'footer.links.discussions', href: `${REPO}/discussions`, external: true },
        {
          label: 'footer.links.contributing',
          href: `${REPO}/blob/main/CONTRIBUTING.md`,
          external: true,
        },
      ],
    },
  },
}
