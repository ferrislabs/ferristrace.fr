import {
  Bot,
  Boxes,
  Building2,
  ChartGantt,
  BrainCircuit,
  Rocket,
  ServerCog,
  Siren,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'

/**
 * Every product and solution page, in one place. The header menus, the
 * footer, the "explore" grids and the 404 suggestions all read from here, so
 * a page cannot be listed in one and missing from another.
 */
export interface CatalogEntry {
  slug: string
  href: string
  title: string
  /** One line, shown under the title in the menus. */
  summary: string
  Icon: LucideIcon
}

export const products: CatalogEntry[] = [
  {
    slug: 'observability',
    href: '/product/observability',
    title: 'Traces, logs & metrics',
    summary: 'Follow one request from the click to the database.',
    Icon: ChartGantt,
  },
  {
    slug: 'infrastructure',
    href: '/product/infrastructure',
    title: 'Infrastructure',
    summary: 'Your Kubernetes cluster, next to the services it runs.',
    Icon: Boxes,
  },
  {
    slug: 'incidents',
    href: '/product/incidents',
    title: 'Incident response',
    summary: 'From the first alert to the postmortem, on one timeline.',
    Icon: Siren,
  },
  {
    slug: 'ai-observability',
    href: '/product/ai-observability',
    title: 'AI observability',
    summary: 'What each LLM call cost, and how long it took.',
    Icon: Sparkles,
  },
  {
    slug: 'ai-agents',
    href: '/product/ai-agents',
    title: 'AI agents',
    summary: 'Agents investigate with scoped FerrisKey tokens.',
    Icon: Bot,
  },
]

export const solutionsBySize: CatalogEntry[] = [
  {
    slug: 'startups',
    href: '/solutions/startups',
    title: 'Startups',
    summary: 'See what production is doing before you hire a platform team.',
    Icon: Rocket,
  },
  {
    slug: 'enterprises',
    href: '/solutions/enterprises',
    title: 'Enterprises',
    summary: 'Self-hosted with SSO and audit, so your data stays with you.',
    Icon: Building2,
  },
]

export const solutionsByTeam: CatalogEntry[] = [
  {
    slug: 'platform-teams',
    href: '/solutions/platform-teams',
    title: 'Platform & SRE teams',
    summary: 'One tool for the clusters you run and the pages you answer.',
    Icon: ServerCog,
  },
  {
    slug: 'ai-teams',
    href: '/solutions/ai-teams',
    title: 'AI product teams',
    summary: 'Ship LLM features and keep their cost under control.',
    Icon: BrainCircuit,
  },
]

export const solutions = [...solutionsBySize, ...solutionsByTeam]
