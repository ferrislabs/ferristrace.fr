import type { ReactNode } from 'react'
import { Badge, Button, cn } from '@cometrace/ui'
import { Check, ChevronDown, Minus } from 'lucide-react'
import { links } from '../landing/links'
import { CheckList, Container, SectionTitle, StartOnCloudButton } from '../landing/shared'
import { CtaBand, PageShell } from './blocks'

interface Plan {
  name: string
  price: string
  priceNote: string
  body: string
  items: string[]
  action: ReactNode
  highlighted?: boolean
  badge?: string
}

/**
 * No figure is invented here: Cloud is free while in beta and self-hosting is
 * free under Apache 2.0. Paid plans get their prices when they exist.
 */
const plans: Plan[] = [
  {
    name: 'Self-hosted',
    price: 'Free',
    priceNote: 'forever, Apache 2.0',
    body: 'Run FerrisTrace on your own servers or cluster, and the data stays there.',
    items: [
      'Traces, logs, metrics, infrastructure and incidents',
      'AI observability and AI agents through FerrisKey',
      'Unlimited users and projects',
      'Kubernetes manifests (Kustomize + ArgoCD)',
      'Community support on GitHub',
    ],
    action: (
      <Button asChild variant="outline" className="w-full font-semibold">
        <a href={links.selfHostGuide}>Read the self-host guide</a>
      </Button>
    ),
  },
  {
    name: 'Cloud',
    price: 'Free',
    priceNote: 'while in beta',
    body: 'We host FerrisTrace and handle upgrades and backups. You get a workspace and an ingest key.',
    items: [
      'Everything in Self-hosted',
      'Managed upgrades and backups',
      'Multi-region',
      'Retention up to 90 days',
      'Export your data and move to self-hosted any time',
    ],
    action: <StartOnCloudButton className="w-full">Get started for free</StartOnCloudButton>,
    highlighted: true,
    badge: 'Quickest to start',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    priceNote: 'self-hosted or Cloud',
    body: 'For organisations that need help with deployment, compliance reviews or support.',
    items: [
      'Everything in Cloud or Self-hosted',
      'Single sign-on and audit log',
      'AI agents limited to FerrisKey scopes',
      'Deployment help on your infrastructure',
      'Priority support',
    ],
    action: (
      <Button asChild variant="outline" className="w-full font-semibold">
        <a href="/solutions/enterprises">See enterprise features</a>
      </Button>
    ),
  },
]

type Cell = boolean | string

const comparison: Array<{ group: string; rows: Array<[string, Cell, Cell, Cell]> }> = [
  {
    group: 'Product',
    rows: [
      ['Traces, logs and metrics', true, true, true],
      ['Infrastructure (Kubernetes)', true, true, true],
      ['Incident response', true, true, true],
      ['AI observability', true, true, true],
      ['AI agents through FerrisKey', true, true, true],
    ],
  },
  {
    group: 'Operations',
    rows: [
      ['Hosting', 'Your servers', 'Managed', 'Your choice'],
      ['Upgrades and backups', 'You', 'Managed', 'Managed or assisted'],
      ['Retention', 'You decide', 'Up to 90 days', 'Custom'],
    ],
  },
  {
    group: 'Security',
    rows: [
      ['OpenID Connect sign-in', true, true, true],
      ['Audit log', true, true, true],
      ['Data stays on your infrastructure', true, false, true],
    ],
  },
  {
    group: 'Support',
    rows: [
      ['Community on GitHub', true, true, true],
      ['Priority support', false, false, true],
    ],
  },
]

const faq = [
  {
    q: 'Is the self-hosted edition limited?',
    a: 'No. It runs the same code and the same interface as Cloud, under Apache 2.0. If you move from one to the other, the operator changes and the features stay the same.',
  },
  {
    q: 'What happens to Cloud pricing after the beta?',
    a: 'We have not set it yet. Whatever we decide, you can export your data and move to self-hosted whenever you want.',
  },
  {
    q: 'Do you charge per user?',
    a: 'Not on self-hosted, where users and projects are unlimited. For Cloud, we want giving another engineer access to cost nothing extra.',
  },
  {
    q: 'Do I need a FerrisTrace SDK?',
    a: 'No. FerrisTrace accepts OpenTelemetry data over OTLP, so any OpenTelemetry SDK or Collector works once you point it at your instance.',
  },
]

export function PricingPage() {
  return (
    <PageShell current="pricing">
      <section aria-labelledby="page-title" className="pb-20 pt-20 sm:pt-24">
        <Container className="flex flex-col items-center text-center">
          <h1
            id="page-title"
            className="max-w-[820px] text-[clamp(2rem,5vw,3.75rem)] font-bold leading-[1.05] tracking-[-0.03em]"
          >
            <span className="block text-balance">Every plan gets every feature.</span>
            <span className="block text-balance text-muted-foreground">You pick who runs the servers.</span>
          </h1>
          <p className="mt-6 max-w-[600px] text-lg leading-8 text-muted-foreground">
            Host it yourself for free, or let us run it on Cloud, which costs nothing while the beta lasts.
          </p>
        </Container>

        <Container className="mt-14 grid items-stretch gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                'flex flex-col rounded-xl border bg-card p-6',
                plan.highlighted ? 'border-primary ring-1 ring-primary' : 'border-border',
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-[17px] font-semibold">{plan.name}</h2>
                {plan.badge ? <Badge>{plan.badge}</Badge> : null}
              </div>
              <p className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-bold tracking-[-0.03em]">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.priceNote}</span>
              </p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{plan.body}</p>
              <div className="my-6 border-t border-border" />
              <CheckList items={plan.items} />
              <div className="mt-auto pt-8">{plan.action}</div>
            </div>
          ))}
        </Container>
      </section>

      <section aria-labelledby="compare-title" className="border-t border-border bg-section-alt py-24">
        <Container>
          <SectionTitle id="compare-title" title="Compare the plans." />
          <p className="mt-6 text-[12px] text-faint-foreground sm:hidden" aria-hidden="true">
            Swipe the table to see every plan →
          </p>
          <div className="relative mt-3 sm:mt-10 overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th scope="col" className="sticky left-0 z-10 bg-card p-3 font-semibold sm:p-4">
                    <span className="sr-only">Feature</span>
                  </th>
                  {plans.map((plan) => (
                    <th key={plan.name} scope="col" className="w-1/5 p-3 text-center font-semibold sm:p-4">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              {comparison.map((group) => (
                <tbody key={group.group}>
                  <tr>
                    <th
                      scope="colgroup"
                      colSpan={4}
                      className="bg-section-alt px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-faint-foreground"
                    >
                      {group.group}
                    </th>
                  </tr>
                  {group.rows.map(([label, ...cells]) => (
                    <tr key={label} className="border-t border-border">
                      <th scope="row" className="sticky left-0 z-10 bg-card p-3 text-left font-normal sm:p-4">
                        {label}
                      </th>
                      {cells.map((cell, i) => (
                        <td key={i} className="p-3 text-center sm:p-4">
                          <CellValue value={cell} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
        </Container>
      </section>

      <section aria-labelledby="faq-title" className="border-t border-border py-24">
        <Container className="max-w-[800px]">
          <SectionTitle id="faq-title" title="Common questions." />
          <div className="mt-8 divide-y divide-border rounded-xl border border-border bg-card">
            {faq.map((item) => (
              <details key={item.q} className="group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <ChevronDown
                    className="size-4 shrink-0 text-faint-foreground transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand
        title="Start on Cloud for free, or host it yourself."
        body="Create a Cloud workspace in a minute, or self-host with one docker run."
      />
    </PageShell>
  )
}

function CellValue({ value }: { value: Cell }) {
  if (value === true)
    return (
      <>
        <Check className="mx-auto size-4 text-success-text" aria-hidden="true" />
        <span className="sr-only">Included</span>
      </>
    )
  if (value === false)
    return (
      <>
        <Minus className="mx-auto size-4 text-faint-foreground" aria-hidden="true" />
        <span className="sr-only">Not included</span>
      </>
    )
  return <span className="text-muted-foreground">{value}</span>
}
