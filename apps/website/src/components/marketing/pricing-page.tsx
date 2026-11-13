import type { ReactNode } from 'react'
import { cn } from '@cometrace/ui'
import { Check, Minus } from 'lucide-react'
import { links } from '../landing/links'
import { CheckList, Frame, SectionTitle } from '../landing/shared'
import { PixelSprite } from '../pixel/pixel-sprite'
import { cometCrab } from '../pixel/sprites'
import { CtaBand, PageShell } from './blocks'

const primaryAction =
  'inline-flex w-full items-center justify-center gap-2 bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover'
const secondaryAction =
  'inline-flex w-full items-center justify-center gap-2 border border-border bg-card px-5 py-3 text-sm font-semibold transition-colors hover:bg-foreground/[0.04]'

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
      <a href={links.selfHostGuide} className={secondaryAction}>
        Read the self-host guide
      </a>
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
    action: (
      <a href={links.startOnCloud} className={primaryAction}>
        Get started for free
        <span aria-hidden="true">→</span>
      </a>
    ),
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
      <a href="/solutions/enterprises" className={secondaryAction}>
        See enterprise features
      </a>
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
      <section aria-labelledby="page-title" className="border-b border-border">
        <div className="mx-auto max-w-6xl border-x border-border">
          <div className="flex flex-col items-center px-5 pb-20 pt-[clamp(4rem,10vh,6.5rem)] text-center">
            <p className="reveal inline-flex items-center gap-3 border border-border bg-card py-1.5 pl-1.5 pr-3">
              <span className="flex size-7 items-center justify-center bg-primary/10">
                <PixelSprite sprite={cometCrab} className="size-4" />
              </span>
              <span className="font-pixel text-[11px] uppercase tracking-[0.06em] text-accent-text">
                Pricing
              </span>
            </p>
            <h1
              id="page-title"
              className="reveal mt-6 max-w-4xl text-[clamp(2.25rem,5vw,4.25rem)] font-medium leading-[1.03] tracking-[-0.04em]"
              style={{ animationDelay: '0.1s' }}
            >
              <span className="block text-balance">Every plan gets every feature.</span>
              <span className="block text-balance text-accent-text">
                You pick who runs the servers.
              </span>
            </h1>
            <p
              className="reveal mt-7 max-w-xl text-pretty text-lg leading-8 text-muted-foreground"
              style={{ animationDelay: '0.2s' }}
            >
              Host it yourself for free, or let us run it on Cloud, which costs nothing while the
              beta lasts.
            </p>
          </div>

          <ul className="-mr-px grid border-t border-border lg:grid-cols-3">
            {plans.map((plan) => (
              <li
                key={plan.name}
                className={cn(
                  'flex flex-col border-b border-r border-border px-6 py-10 last:border-b-0 sm:px-8 lg:border-b-0',
                  plan.highlighted && '-mt-px border-t-2 border-t-primary bg-surface-tint',
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl font-medium tracking-[-0.01em]">{plan.name}</h2>
                  {plan.badge ? (
                    <span className="bg-primary px-2 py-1 font-pixel text-[10px] uppercase tracking-[0.08em] text-primary-foreground">
                      {plan.badge}
                    </span>
                  ) : null}
                </div>
                <p className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-5xl font-medium tracking-[-0.04em]">{plan.price}</span>
                  <span className="font-pixel text-[10px] uppercase tracking-[0.08em] text-accent-text">
                    {plan.priceNote}
                  </span>
                </p>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">{plan.body}</p>
                <div className="my-8 border-t border-border" />
                <CheckList items={plan.items} />
                <div className="mt-auto pt-10">{plan.action}</div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Frame labelledBy="compare-title">
        <div className="border-b border-border px-5 py-20 sm:px-8 sm:py-28">
          <SectionTitle id="compare-title" kicker="Compare" title="Compare the plans." />
          <p
            className="mt-6 font-pixel text-[10px] uppercase tracking-[0.08em] text-faint-foreground sm:hidden"
            aria-hidden="true"
          >
            Swipe the table to see every plan →
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th scope="col" className="sticky left-0 z-10 bg-background p-3 sm:p-4 sm:px-8">
                  <span className="sr-only">Feature</span>
                </th>
                {plans.map((plan) => (
                  <th
                    key={plan.name}
                    scope="col"
                    className="w-1/5 border-l border-border p-3 text-center font-pixel text-[11px] font-normal uppercase tracking-[0.08em] sm:p-4"
                  >
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
                    className="border-b border-border bg-surface-tint px-4 py-2.5 text-left font-pixel text-[10px] font-normal uppercase tracking-[0.08em] text-accent-text sm:px-8"
                  >
                    {group.group}
                  </th>
                </tr>
                {group.rows.map(([label, ...cells]) => (
                  <tr key={label} className="border-b border-border last:border-b-0">
                    <th
                      scope="row"
                      className="sticky left-0 z-10 bg-background p-3 text-left font-normal sm:p-4 sm:px-8"
                    >
                      {label}
                    </th>
                    {cells.map((cell, i) => (
                      <td key={i} className="border-l border-border p-3 text-center sm:p-4">
                        <CellValue value={cell} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </Frame>

      <Frame labelledBy="faq-title">
        <div className="border-b border-border px-5 py-20 sm:px-8 sm:py-28">
          <SectionTitle id="faq-title" kicker="FAQ" title="Common questions." />
        </div>
        <div className="divide-y divide-border">
          {faq.map((item) => (
            <details key={item.q} className="group px-5 py-6 sm:px-8">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium [&::-webkit-details-marker]:hidden">
                {item.q}
                <span
                  className="flex size-6 shrink-0 items-center justify-center border border-border bg-card font-pixel text-[12px] leading-none text-accent-text"
                  aria-hidden="true"
                >
                  <span className="group-open:hidden">+</span>
                  <span className="hidden group-open:inline">-</span>
                </span>
              </summary>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </Frame>

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
        <span className="mx-auto flex size-5 items-center justify-center border border-success-text/40 bg-success-text/10">
          <Check className="size-3 text-success-text" strokeWidth={3} aria-hidden="true" />
        </span>
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
