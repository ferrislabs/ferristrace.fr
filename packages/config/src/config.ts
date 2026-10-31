import type { SiteConfig } from './contracts'

const REPO = 'https://github.com/ferrislabs/ferristrace'

export const defaultConfig: SiteConfig = {
  name: 'FerrisTrace',
  titleTemplate: '%s · FerrisTrace',
  favicon: '/favicon-512.png',
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
          href: '/{locale}/ferristrace/getting-started/quickstart-self-host',
        },
        {
          label: 'footer.links.sendingData',
          href: '/{locale}/ferristrace/sending-data/ingest-keys',
        },
        {
          label: 'footer.links.administration',
          href: '/{locale}/ferristrace/administration/projects',
        },
        { label: 'footer.links.reference', href: '/{locale}/ferristrace/reference/configuration' },
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
