import type { ComponentType } from 'react'
import {
  Boxes,
  Building2,
  ClipboardCheck,
  DollarSign,
  FileLock2,
  Hourglass,
  KeyRound,
  Layers,
  Rocket,
  ServerCog,
  Siren,
  Sparkles,
  Users,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import { products } from '../landing/catalog'
import { CtaBand, DiagramSection, ExploreGrid, PageHero, PageShell } from './blocks'
import { FleetMatrix } from './diagrams/fleet-matrix'
import { GrowthTimeline } from './diagrams/growth-timeline'
import { Perimeter } from './diagrams/perimeter'
import { ReleaseCompare } from './diagrams/release-compare'
import { ProblemTabs, type Problem } from './problem-tabs'

export type SolutionSlug = 'startups' | 'enterprises' | 'platform-teams' | 'ai-teams'

interface Solution {
  Icon: LucideIcon
  eyebrow: string
  title: string
  accent: string
  lead: string
  diagram: { title: string; description: string; Diagram: ComponentType }
  problems: Problem[]
  /** Product slugs that matter most for this profile, in order. */
  recommended: string[]
  cta: { title: string; body: string }
}

const solutionData: Record<SolutionSlug, Solution> = {
  startups: {
    Icon: Rocket,
    eyebrow: 'For startups',
    title: 'Watch production properly',
    accent: 'before you can afford an SRE.',
    lead: 'Run one container and you have traces, logs, metrics and incidents on day one. Your engineers keep building the product instead of gluing five monitoring tools together.',
    diagram: {
      title: 'Year one, tool by tool.',
      description: 'Most teams add a tool every time something new goes wrong. Click through a typical first year and see where FerrisTrace already has it covered.',
      Diagram: GrowthTimeline,
    },
    problems: [
      {
        id: 'time',
        Icon: Hourglass,
        title: 'No time to set it up',
        before: [
          ['Jaeger', 'deploy and size a tracing backend'],
          ['Loki', 'deploy a log store'],
          ['Prometheus', 'deploy metrics and exporters'],
          ['Grafana', 'build dashboards for all three'],
          ['PagerDuty', 'wire alerts to a paging tool'],
        ],
        after: [
          ['FerrisTrace', 'docker run, or create a Cloud workspace'],
          ['FerrisTrace', 'set two OTLP variables and watch traces, logs and metrics come in'],
        ],
        result: 'You can see what production is doing by the end of the afternoon.',
      },
      {
        id: 'cost',
        Icon: DollarSign,
        title: 'Bills that grow with the team',
        before: [
          ['vendor', 'pay per seat for every engineer'],
          ['admin', 'ration who gets access'],
          ['Slack', 'paste screenshots for everyone else'],
        ],
        after: [['FerrisTrace', 'self-host free with unlimited users, or use Cloud while the beta is free']],
        result: 'Anyone who ships code gets to look at production.',
      },
      {
        id: 'outage',
        Icon: Siren,
        title: 'The first big outage',
        before: [
          ['ssh', 'tail logs on the one server you know'],
          ['Slack', 'reassure the customer without facts'],
          ['notes', 'reconstruct what happened afterwards'],
        ],
        after: [
          ['FerrisTrace', 'the alert opens an incident with the failing traces'],
          ['FerrisTrace', 'the timeline gives you a postmortem draft to edit'],
        ],
        result: 'You handle your first big incident like a team that has done this before.',
      },
    ],
    recommended: ['observability', 'incidents', 'ai-observability', 'infrastructure'],
    cta: { title: 'Set it up before your next release goes out.', body: 'Cloud is free during the beta, and signing up takes a minute without a credit card.' },
  },
  enterprises: {
    Icon: Building2,
    eyebrow: 'For enterprises',
    title: 'Observability you run',
    accent: 'inside your own perimeter.',
    lead: 'Install FerrisTrace on infrastructure you control and connect it to your identity provider. The audit log records what each person, API token and AI agent looked at.',
    diagram: {
      title: 'Answers for your security review.',
      description: 'Toggle between a typical SaaS tool and self-hosted FerrisTrace, then pick a question to see how each one answers it.',
      Diagram: Perimeter,
    },
    problems: [
      {
        id: 'leak',
        Icon: FileLock2,
        title: 'Telemetry leaves the building',
        before: [
          ['SaaS', 'ship logs with customer data to another region'],
          ['legal', 'negotiate a data processing agreement'],
          ['security', 'review the vendor every year'],
        ],
        after: [['FerrisTrace', 'run it on your own infrastructure, so telemetry stays there']],
        result: 'Your retention policy applies, because the data sits on your servers.',
      },
      {
        id: 'sprawl',
        Icon: Layers,
        title: 'Tool and licence sprawl',
        before: [
          ['procurement', 'renew five observability contracts'],
          ['IAM', 'manage access in each tool separately'],
          ['finance', 'reconcile an invoice per vendor'],
          ['teams', 'learn a different interface per tool'],
        ],
        after: [['FerrisTrace', 'one open-source product with a single access policy']],
        result: 'Procurement reviews one product and IAM maintains one access policy.',
      },
      {
        id: 'compliance',
        Icon: ClipboardCheck,
        title: 'The compliance audit',
        before: [
          ['auditor', 'asks who accessed production data'],
          ['each tool', 'export access logs, if they exist'],
          ['spreadsheet', 'merge and explain the gaps'],
        ],
        after: [['FerrisTrace', 'export one audit log covering people, tokens and agents']],
        result: 'When the auditor asks who saw what and when, you send one file.',
      },
    ],
    recommended: ['observability', 'infrastructure', 'incidents', 'ai-agents'],
    cta: { title: 'Try it on your own infrastructure.', body: 'Start with the self-host guide, or evaluate on Cloud first. Both run the same product with the same interface.' },
  },
  'platform-teams': {
    Icon: ServerCog,
    eyebrow: 'For platform & SRE teams',
    title: 'Stop being the help desk',
    accent: 'for every dashboard request.',
    lead: 'Product teams get traces, logs and metrics without filing a ticket. You get the Kubernetes fleet next to their services, and incidents run in the same tool.',
    diagram: {
      title: 'Every team on every cluster.',
      description: 'You deploy one Collector per cluster. Each team owns its SLO and gets its own pages, and you see the whole grid. Click a cell to see who gets woken up.',
      Diagram: FleetMatrix,
    },
    problems: [
      {
        id: 'tickets',
        Icon: Users,
        title: 'Every team asks you first',
        before: [
          ['Jira', 'receive "add my service to monitoring"'],
          ['Prometheus', 'add scrape configs'],
          ['Grafana', 'clone a dashboard for them'],
          ['Slack', 'explain how to read it'],
        ],
        after: [['FerrisTrace', 'the team creates its project and ingest key itself']],
        result: 'Product teams serve themselves and you get back to the platform.',
      },
      {
        id: 'fleet',
        Icon: Boxes,
        title: 'The fleet is a black box',
        before: [
          ['Lens', 'check cluster health'],
          ['APM', 'check service health'],
          ['your head', 'connect the two'],
        ],
        after: [['FerrisTrace', 'pods, nodes and deploys next to the services they run']],
        result: 'Pods and the services on them show up in the same view and the same search.',
      },
      {
        id: 'toil',
        Icon: Wrench,
        title: 'On-call toil',
        before: [
          ['PagerDuty', 'get paged with a metric name'],
          ['kubectl', 'find the pods involved'],
          ['APM', 'find a failing trace'],
          ['Slack', 'summarise for the owning team'],
        ],
        after: [
          ['FerrisTrace', 'the alert names the pods and carries the traces'],
          ['agent', 'posts the first summary on the incident'],
        ],
        result: 'The page already carries the context, so nobody goes digging at 3 a.m.',
      },
    ],
    recommended: ['infrastructure', 'observability', 'incidents', 'ai-agents'],
    cta: { title: 'Give every team observability and keep your queue short.', body: 'Deploy it with our Kustomize manifests through ArgoCD, or try it on Cloud first.' },
  },
  'ai-teams': {
    Icon: Sparkles,
    eyebrow: 'For AI product teams',
    title: 'Ship LLM features',
    accent: 'knowing what each call costs.',
    lead: 'Every model call shows up inside the request that made it, with its tokens, cost and latency. When agents dig through your telemetry, FerrisKey decides what they can touch.',
    diagram: {
      title: 'Did that prompt change help?',
      description: 'Pick a change and compare cost, tokens, latency and user feedback, measured on real requests before and after.',
      Diagram: ReleaseCompare,
    },
    problems: [
      {
        id: 'bill',
        Icon: DollarSign,
        title: 'The bill doubled',
        before: [
          ['provider console', 'see the total'],
          ['spreadsheet', 'map API keys to features'],
          ['git', 'hunt for the prompt change'],
        ],
        after: [['FerrisTrace', 'spend broken down by feature, so the spike points at its cause']],
        result: 'You see cost per feature as it moves, before the invoice tells you.',
      },
      {
        id: 'slow',
        Icon: Hourglass,
        title: 'Slow answers',
        before: [
          ['logs', 'add timers around each step'],
          ['deploy', 'ship and wait for traffic'],
          ['spreadsheet', 'compare the timings'],
        ],
        after: [['FerrisTrace', 'open the request and every step already has its timing']],
        result: 'You can see which step to optimise first.',
      },
      {
        id: 'agents',
        Icon: KeyRound,
        title: 'Agents with too much power',
        before: [
          ['admin UI', 'create a full-access key for the agent'],
          ['.env', 'store it next to the code'],
          ['nobody', 'audits what it does'],
        ],
        after: [
          ['FerrisKey', 'scoped, expiring identity for the agent'],
          ['FerrisTrace', 'every action in the audit log'],
        ],
        result: 'The agent goes to production and you can still say what it did.',
      },
    ],
    recommended: ['ai-observability', 'ai-agents', 'observability', 'incidents'],
    cta: { title: 'Find out what your AI features cost to run.', body: 'Send your LLM calls over OpenTelemetry and their cost and latency show up next to the rest of your traces.' },
  },
}

export function SolutionPage({ slug }: { slug: SolutionSlug }) {
  const data = solutionData[slug]
  const recommended = data.recommended
    .map((s) => products.find((p) => p.slug === s))
    .filter((p): p is (typeof products)[number] => Boolean(p))

  return (
    <PageShell current="solutions">
      <PageHero Icon={data.Icon} eyebrow={data.eyebrow} title={data.title} accent={data.accent} lead={data.lead} />
      <DiagramSection id={`${slug}-diagram`} alt title={data.diagram.title} description={data.diagram.description}>
        <data.diagram.Diagram />
      </DiagramSection>
      <ProblemTabs
        id={`${slug}-problems`}
        alt={false}
        title="Where the time goes today."
        description="The steps it takes now, next to the steps it takes with FerrisTrace."
        problems={data.problems}
      />
      <ExploreGrid title="Start with these." entries={recommended} />
      <CtaBand title={data.cta.title} body={data.cta.body} />
    </PageShell>
  )
}
