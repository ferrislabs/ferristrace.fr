import { useState, type ReactNode } from 'react'
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

type BillingCycle = 'monthly' | 'annual'

interface Plan {
  name: string
  price: Record<BillingCycle, string>
  priceNote: Record<BillingCycle, string>
  subNote?: Record<BillingCycle, string>
  body: string
  items: string[]
  action: ReactNode
  highlighted?: boolean
  badge?: string
}

const plans: Plan[] = [
  {
    name: 'Self-hosted',
    price: { monthly: 'Free', annual: 'Free' },
    priceNote: { monthly: 'forever · Apache 2.0', annual: 'forever · Apache 2.0' },
    body: 'Run FerrisTrace on your own servers or Kubernetes cluster, and keep every byte inside your perimeter.',
    items: [
      'Unlimited ingested volume (your storage)',
      'Retention set by you + S3 cold tiering',
      'Unlimited users and projects',
      'Every product feature included',
      'Docker Compose & OCI Helm chart (ArgoCD ready)',
      'Community support on GitHub',
    ],
    action: (
      <a href={links.selfHostGuide} className={secondaryAction}>
        Read the self-host guide
      </a>
    ),
  },
  {
    name: 'Free',
    price: { monthly: '€0', annual: '€0' },
    priceNote: { monthly: 'per month', annual: 'per year' },
    body: 'A managed Cloud workspace for side projects, staging environments, or evaluating FerrisTrace.',
    items: [
      '30 GB ingested per month included',
      '7-day retention',
      'Hard cap — upgrade or pause, no surprise bill',
      'Unlimited users and projects',
      'Every product feature included',
      'Community support',
    ],
    action: (
      <a href={links.startOnCloud} className={secondaryAction}>
        Start for free
        <span aria-hidden="true">→</span>
      </a>
    ),
  },
  {
    name: 'Pro',
    price: { monthly: '€19.99', annual: '€199' },
    priceNote: { monthly: '/ month · excl. VAT', annual: '/ year · excl. VAT' },
    subNote: {
      monthly: 'or €199 / year (2 months free)',
      annual: '2 months free (~€16.58 / month)',
    },
    body: 'Managed Cloud for production teams that want 30-day retention, burst tolerance, and capped overage.',
    items: [
      '100 GB ingested per month included',
      '30-day retention',
      '8 GB unbilled grace buffer',
      '€0.30 / GB beyond that (€19.99 default cap)',
      'Unlimited users and projects',
      'Every product feature included',
      'Email support',
    ],
    action: (
      <a href={links.startOnCloud} className={primaryAction}>
        Get started with Pro
        <span aria-hidden="true">→</span>
      </a>
    ),
    highlighted: true,
    badge: 'Most popular',
  },
  {
    name: 'Enterprise',
    price: { monthly: 'Custom', annual: 'Custom' },
    priceNote: { monthly: 'Cloud or self-hosted', annual: 'Cloud or self-hosted' },
    body: 'For organisations that need custom volume, longer retention, deployment assistance, or contractual SLAs.',
    items: [
      'Custom monthly volume & overage terms',
      'Custom retention window',
      'Managed Cloud or assisted self-hosted deployment',
      'Unlimited users and projects',
      'Every product feature included',
      'Contractual SLA & dedicated contact',
    ],
    action: (
      <a href="/solutions/enterprises" className={secondaryAction}>
        See enterprise features
      </a>
    ),
  },
]

type Cell = boolean | string

const comparison: Array<{ group: string; rows: Array<[string, Cell, Cell, Cell, Cell]> }> = [
  {
    group: 'Quotas & billing (per organisation, excl. VAT)',
    rows: [
      ['Monthly price', '€0', '€0', '€19.99', 'Custom'],
      ['Annual price (2 months free)', '€0', '€0', '€199', 'Custom'],
      ['Included monthly ingest', 'Unlimited', '30 GB', '100 GB', 'Custom'],
      ['Retention', 'You decide', '7 days', '30 days', 'Custom'],
      ['Unbilled grace buffer', '—', 'None', '8 GB', 'Contractual'],
      ['Overage beyond allowance', '—', 'Upgrade or pause', '€0.30 / GB', 'Contractual'],
      ['Default overage cap', '—', 'n/a', '€19.99', 'Contractual'],
      ['Users and projects', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited'],
    ],
  },
  {
    group: 'Features',
    rows: [
      ['Traces, logs, metrics & dashboards', true, true, true, true],
      ['Infrastructure & Kubernetes', true, true, true, true],
      ['Alerts, incidents, on-call & status pages', true, true, true, true],
      ['AI & LLM cost observability', true, true, true, true],
      ['AI agents & MCP gateway (FerrisKey)', true, true, true, true],
    ],
  },
  {
    group: 'Operations & security',
    rows: [
      ['Hosting', 'Your servers', 'Managed Cloud', 'Managed Cloud', 'Cloud or yours'],
      ['Upgrades and backups', 'You', 'Managed', 'Managed', 'Managed or assisted'],
      ['OpenID Connect sign-in & audit log', true, true, true, true],
      ['Portable data export (tar.gz)', true, true, true, true],
      ['Data stays on your infrastructure', true, false, false, 'Your choice'],
    ],
  },
  {
    group: 'Support',
    rows: [
      ['Support channel', 'Community', 'Community', 'Email', 'Dedicated contact'],
      ['Contractual SLA', false, false, false, true],
    ],
  },
]

const faq = [
  {
    q: 'Are any features locked behind Pro or Enterprise?',
    a: 'No. Self-hosted, Free, Pro and Enterprise all run the exact same Apache 2.0 build and include every feature: traces, logs, metrics, dashboards, Kubernetes, alerts, incidents, on-call, status pages, AI observability, AI agents and MCP. Plans differ only on hosting, volume, retention and support.',
  },
  {
    q: 'How do the 8 GB grace buffer and the €19.99 overage cap work on Pro?',
    a: 'Pro includes 100 GB of ingested telemetry per month plus an 8 GB unbilled buffer for unexpected traffic bursts. Above 108 GB, extra volume is billed at €0.30 / GB up to a €19.99 default monthly overage cap, so a noisy deploy never produces a runaway invoice. On Free, ingestion pauses cleanly at 30 GB until the next cycle or until you upgrade.',
  },
  {
    q: 'Do you charge per user or per project?',
    a: 'Never. Every plan is priced per organisation with unlimited users and unlimited projects, so everyone who writes code can inspect production without seat rationing.',
  },
  {
    q: 'Can I move between Cloud and Self-hosted later?',
    a: 'Yes. Both run the same codebase, accept standard OpenTelemetry over OTLP without a proprietary SDK, and let organisation owners export their data as a portable tar.gz archive at any time.',
  },
]

export function PricingPage() {
  const [cycle, setCycle] = useState<BillingCycle>('monthly')

  return (
    <PageShell current="pricing">
      <section aria-labelledby="page-title" className="border-b border-border">
        <div className="mx-auto max-w-6xl border-x border-border">
          <div className="flex flex-col items-center px-5 pb-16 pt-[clamp(4rem,10vh,6.5rem)] text-center">
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
                Pay for volume, never per seat.
              </span>
            </h1>
            <p
              className="reveal mt-7 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground"
              style={{ animationDelay: '0.2s' }}
            >
              Self-host for free under Apache 2.0, start on Cloud with 30 GB/month at €0, or move to
              Pro with 100 GB included and capped overage.
            </p>

            <div
              role="group"
              aria-label="Billing period"
              className="reveal mt-9 inline-flex items-center border border-border bg-card p-1"
              style={{ animationDelay: '0.25s' }}
            >
              <button
                type="button"
                aria-pressed={cycle === 'monthly'}
                onClick={() => setCycle('monthly')}
                className={cn(
                  'cursor-pointer px-4 py-2 text-xs font-semibold transition-colors',
                  cycle === 'monthly'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                Monthly
              </button>
              <button
                type="button"
                aria-pressed={cycle === 'annual'}
                onClick={() => setCycle('annual')}
                className={cn(
                  'inline-flex cursor-pointer items-center gap-2 px-4 py-2 text-xs font-semibold transition-colors',
                  cycle === 'annual'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                Annual
                <span
                  className={cn(
                    'font-pixel text-[9px] uppercase tracking-[0.06em]',
                    cycle === 'annual' ? 'text-primary-foreground/90' : 'text-accent-text',
                  )}
                >
                  2 months free
                </span>
              </button>
            </div>
            <p className="mt-3 font-pixel text-[10px] uppercase tracking-[0.08em] text-faint-foreground">
              Cloud prices excl. VAT, per organisation
            </p>
          </div>

          <ul className="-mr-px grid border-t border-border sm:grid-cols-2 xl:grid-cols-4">
            {plans.map((plan) => (
              <li
                key={plan.name}
                className={cn(
                  'flex flex-col border-b border-r border-border px-6 py-9 last:border-b-0 xl:border-b-0',
                  plan.highlighted && '-mt-px border-t-2 border-t-primary bg-surface-tint',
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-xl font-medium tracking-[-0.01em]">{plan.name}</h2>
                  {plan.badge ? (
                    <span className="bg-primary px-2 py-1 font-pixel text-[10px] uppercase tracking-[0.08em] text-primary-foreground">
                      {plan.badge}
                    </span>
                  ) : null}
                </div>
                <div className="mt-7 min-h-[4.25rem]">
                  <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                    <span className="text-4xl font-medium tracking-[-0.04em] sm:text-[2.5rem]">
                      {plan.price[cycle]}
                    </span>
                    <span className="font-pixel text-[10px] uppercase tracking-[0.08em] text-accent-text">
                      {plan.priceNote[cycle]}
                    </span>
                  </p>
                  {plan.subNote ? (
                    <p className="mt-1.5 text-xs text-muted-foreground">{plan.subNote[cycle]}</p>
                  ) : null}
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">{plan.body}</p>
                <div className="my-7 border-t border-border" />
                <CheckList items={plan.items} />
                <div className="mt-auto pt-9">{plan.action}</div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Frame labelledBy="compare-title">
        <div className="border-b border-border px-5 py-20 sm:px-8 sm:py-28">
          <SectionTitle
            id="compare-title"
            kicker="Compare"
            title="Compare every plan line by line."
            description="All Cloud prices are shown in euros excluding VAT, billed per organisation with unlimited users and projects."
          />
          <p
            className="mt-6 font-pixel text-[10px] uppercase tracking-[0.08em] text-faint-foreground sm:hidden"
            aria-hidden="true"
          >
            Swipe the table to see every plan →
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th scope="col" className="sticky left-0 z-10 bg-background p-3 sm:p-4 sm:px-8">
                  <span className="sr-only">Feature</span>
                </th>
                {plans.map((plan) => (
                  <th
                    key={plan.name}
                    scope="col"
                    className={cn(
                      'w-[17%] border-l border-border p-3 text-center font-pixel text-[11px] font-normal uppercase tracking-[0.08em] sm:p-4',
                      plan.highlighted && 'bg-surface-tint text-accent-text',
                    )}
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
                    colSpan={5}
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
                      <td
                        key={i}
                        className={cn(
                          'border-l border-border p-3 text-center sm:p-4',
                          plans[i]?.highlighted && 'bg-surface-tint/50',
                        )}
                      >
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
        title="Start on Cloud Free, or host it yourself."
        body="Create a Cloud workspace with 30 GB/month included, or bring up the self-hosted stack with Docker Compose or Helm."
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
