import type { ReactNode } from 'react'
import { cn } from '@cometrace/ui'
import { links } from '../landing/links'
import { Frame, Kicker } from '../landing/shared'
import { PixelSprite } from '../pixel/pixel-sprite'
import { cometCrab } from '../pixel/sprites'
import { PageShell } from './blocks'

type LegalDocId = 'terms' | 'terms-of-sale' | 'privacy' | 'dpa'

interface LegalSection {
  id: string
  title: string
  content: ReactNode
}

const LEGAL_TABS: Array<{ id: LegalDocId; label: string; shortLabel: string; href: string }> = [
  { id: 'terms', label: 'Terms of Use (CGU)', shortLabel: 'CGU', href: links.terms },
  { id: 'terms-of-sale', label: 'Terms of Sale (CGV)', shortLabel: 'CGV', href: links.termsOfSale },
  { id: 'privacy', label: 'Privacy Policy (GDPR)', shortLabel: 'GDPR / RGPD', href: links.privacy },
  { id: 'dpa', label: 'Data Processing Agreement (DPA)', shortLabel: 'DPA', href: links.dpa },
]

const EFFECTIVE_DATE = 'November 25, 2026'

function InlineLink({ href, children }: { href: string; children: ReactNode }) {
  const external = href.startsWith('http')
  return (
    <a
      href={href}
      className="font-medium text-accent-text underline decoration-border underline-offset-4 transition-colors hover:decoration-accent-text"
      {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
    >
      {children}
    </a>
  )
}

function LegalLayout({
  active,
  eyebrow,
  title,
  lead,
  sections,
}: {
  active: LegalDocId
  eyebrow: string
  title: string
  lead: string
  sections: LegalSection[]
}) {
  return (
    <PageShell>
      <Frame labelledBy="page-title">
        <div className="px-5 py-16 sm:px-8 sm:py-24">
          <p className="inline-flex items-center gap-3 border border-border bg-card py-1.5 pl-1.5 pr-3">
            <span className="flex size-7 items-center justify-center bg-primary/10">
              <PixelSprite sprite={cometCrab} className="size-4" />
            </span>
            <span className="font-pixel text-[11px] uppercase tracking-[0.06em] text-accent-text">
              {eyebrow}
            </span>
          </p>

          <h1
            id="page-title"
            className="mt-6 max-w-3xl text-balance text-[clamp(2.25rem,5vw,3.75rem)] font-medium leading-[1.03] tracking-[-0.04em]"
          >
            {title}
          </h1>

          <p className="mt-6 max-w-2xl text-pretty text-[15px] leading-7 text-muted-foreground">
            {lead}
          </p>

          <p className="mt-6 font-pixel text-[10px] uppercase tracking-[0.08em] text-faint-foreground">
            Effective date: {EFFECTIVE_DATE} · Governed by French law &amp; EU GDPR
          </p>
        </div>

        <nav
          aria-label="Legal documents"
          className="flex flex-wrap border-t border-border bg-surface-tint/60"
        >
          {LEGAL_TABS.map((tab) => {
            const isCurrent = tab.id === active
            return (
              <a
                key={tab.id}
                href={tab.href}
                aria-current={isCurrent ? 'page' : undefined}
                className={cn(
                  'border-r border-border px-5 py-3.5 text-sm font-medium transition-colors sm:px-6',
                  isCurrent
                    ? 'bg-background text-foreground shadow-[inset_0_-2px_0_var(--primary)]'
                    : 'text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground',
                )}
              >
                {tab.label}
              </a>
            )
          })}
        </nav>
      </Frame>

      <Frame>
        <div className="grid lg:grid-cols-[17rem_minmax(0,1fr)]">
          <aside className="border-b border-border px-5 py-8 sm:px-8 lg:border-b-0 lg:border-r lg:py-12">
            <div className="lg:sticky lg:top-20">
              <Kicker className="mb-4">On this page</Kicker>
              <ol className="space-y-1.5 text-sm">
                {sections.map((section, index) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="flex gap-2.5 py-1 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <span className="font-mono text-xs text-faint-foreground">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span>{section.title}</span>
                    </a>
                  </li>
                ))}
              </ol>

              <div className="mt-8 border-t border-border pt-6 text-xs leading-6 text-muted-foreground">
                <p className="font-pixel text-[10px] uppercase tracking-[0.08em] text-accent-text">
                  Questions or legal requests
                </p>
                <p className="mt-2">
                  Write to{' '}
                  <InlineLink href="mailto:contact@ferristrace.dev">contact@ferristrace.dev</InlineLink>
                  .
                </p>
              </div>
            </div>
          </aside>

          <div className="divide-y divide-border">
            {sections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-heading`}
                className="scroll-mt-20 px-5 py-10 sm:px-10 sm:py-12"
              >
                <p className="font-pixel text-[10px] uppercase tracking-[0.08em] text-accent-text">
                  Article {String(index + 1).padStart(2, '0')}
                </p>
                <h2
                  id={`${section.id}-heading`}
                  className="mt-2 text-xl font-medium tracking-[-0.015em] sm:text-2xl"
                >
                  {section.title}
                </h2>
                <div className="mt-5 space-y-4 text-[15px] leading-7 text-muted-foreground [&_strong]:font-semibold [&_strong]:text-foreground">
                  {section.content}
                </div>
              </section>
            ))}
          </div>
        </div>
      </Frame>
    </PageShell>
  )
}

function BulletList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-2.5 pt-1">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-2.5 size-1.5 shrink-0 bg-primary" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

/* ========================================================================== */
/* 1. TERMS OF USE (CGU & MENTIONS LEGALES)                                   */
/* ========================================================================== */

const termsSections: LegalSection[] = [
  {
    id: 'legal-notice',
    title: 'Publisher & Hosting Notice (Mentions légales)',
    content: (
      <>
        <p>
          In accordance with Article 6-III and Article 19 of French Law No. 2004-575 of June 21,
          2004 on Confidence in the Digital Economy (<em>LCEN</em>), users of{' '}
          <strong>ferristrace.dev</strong>, <strong>docs.ferristrace.dev</strong>, and{' '}
          <strong>console.ferristrace.dev</strong> are informed of the following identities:
        </p>
        <div className="overflow-x-auto border border-border bg-card">
          <table className="w-full text-left text-sm">
            <tbody className="divide-y divide-border">
              <tr>
                <th scope="row" className="w-48 px-4 py-3 font-medium text-foreground">
                  Publisher
                </th>
                <td className="px-4 py-3">
                  <strong>Thibault Pointurier — Entrepreneur Individuel (EI)</strong>, operating
                  under the trade name <strong>FerrisTrace</strong>{' '}
                  (French <em>micro-entreprise / auto-entreprise</em> regime, zero share capital)
                </td>
              </tr>
              <tr>
                <th scope="row" className="px-4 py-3 font-medium text-foreground">
                  Registration &amp; VAT
                </th>
                <td className="px-4 py-3">
                  SIREN <strong>905 294 013</strong> · SIRET <strong>905 294 013 00024</strong> ·
                  APE <strong>62.01Z</strong> · Registered with the French{' '}
                  <em>Registre National des Entreprises (RNE)</em> ·{' '}
                  <strong>
                    VAT not applicable — Art. 293 B of the French General Tax Code (
                    <em>TVA non applicable, art. 293 B du CGI</em>)
                  </strong>
                </td>
              </tr>
              <tr>
                <th scope="row" className="px-4 py-3 font-medium text-foreground">
                  Registered office
                </th>
                <td className="px-4 py-3">
                  France — Non-public Sirene registration pursuant to Article A. 123-96 of the
                  French Commercial Code (statutory postal address stated on Customer invoices and
                  communicated upon legal request to{' '}
                  <InlineLink href="mailto:contact@ferristrace.dev">
                    contact@ferristrace.dev
                  </InlineLink>
                  )
                </td>
              </tr>
              <tr>
                <th scope="row" className="px-4 py-3 font-medium text-foreground">
                  Publication director
                </th>
                <td className="px-4 py-3">
                  <strong>Thibault Pointurier</strong>
                </td>
              </tr>
              <tr>
                <th scope="row" className="px-4 py-3 font-medium text-foreground">
                  Contact
                </th>
                <td className="px-4 py-3">
                  <InlineLink href="mailto:contact@ferristrace.dev">contact@ferristrace.dev</InlineLink>{' '}
                  · <InlineLink href="https://ferristrace.dev">ferristrace.dev</InlineLink>
                </td>
              </tr>
              <tr>
                <th scope="row" className="px-4 py-3 font-medium text-foreground">
                  Cloud &amp; web host
                </th>
                <td className="px-4 py-3">
                  <strong>Scaleway SAS</strong>, 8 rue de la Ville l&apos;Évêque, 75008 Paris,
                  France (+33 1 84 13 00 00 ·{' '}
                  <InlineLink href="https://www.scaleway.com">scaleway.com</InlineLink>) — servers
                  located in France (European Union).
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    ),
  },
  {
    id: 'scope',
    title: 'Purpose & Scope',
    content: (
      <>
        <p>
          These Terms of Use (<em>Conditions Générales d&apos;Utilisation — CGU</em>) govern access
          to and use of the public websites (<strong>ferristrace.dev</strong> and{' '}
          <strong>docs.ferristrace.dev</strong>) as well as the managed observability platform{' '}
          <strong>FerrisTrace Cloud</strong> (<InlineLink href={links.signIn}>console.ferristrace.dev</InlineLink>
          ), operated by Thibault Pointurier — Entrepreneur Individuel (EI), trading as FerrisTrace (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;FerrisTrace&rdquo;).
        </p>
        <p>
          They apply to both professional users acting in the course of their trade or business
          (&ldquo;Business Users&rdquo; / B2B) and individual users acting for non-professional
          purposes (&ldquo;Consumers&rdquo; / B2C). Subscriptions to Cloud plans (Free, Pro, and
          Enterprise) are additionally governed by our{' '}
          <InlineLink href={links.termsOfSale}>Terms of Sale (CGV)</InlineLink>, and personal data
          processing is described in our{' '}
          <InlineLink href={links.privacy}>Privacy Policy (GDPR)</InlineLink>.
        </p>
        <p>
          <strong>Self-hosted deployments:</strong> The open-source FerrisTrace software distributed
          via GitHub and container registries is licensed under the{' '}
          <InlineLink href="https://www.apache.org/licenses/LICENSE-2.0">
            Apache License, Version 2.0
          </InlineLink>
          . When you self-host FerrisTrace on your own servers, that licence governs your use of the
          software, and FerrisTrace has no access to your infrastructure or data.
        </p>
      </>
    ),
  },
  {
    id: 'accounts-and-oidc',
    title: 'Accounts, OIDC Sign-In & Access Tokens',
    content: (
      <>
        <p>
          Access to FerrisTrace Cloud requires creating or joining an Organisation workspace at{' '}
          <InlineLink href={links.signIn}>console.ferristrace.dev</InlineLink>. Human authentication
          relies on <strong>OpenID Connect (OIDC) with Authorization Code + PKCE</strong> via
          FerrisKey or a configured identity provider; FerrisTrace does not store user passwords.
        </p>
        <BulletList
          items={[
            <>
              <strong>Accuracy &amp; eligibility:</strong> You must be at least 18 years old (or of
              legal age in your jurisdiction) and provide accurate contact and billing details. If
              you create an Organisation on behalf of a company, you warrant that you are authorised
              to bind that entity.
            </>,
            <>
              <strong>Credentials &amp; keys:</strong> Organisation owners and administrators can
              issue OTLP ingest keys, HTTP API keys, and short-lived scoped AI agent / MCP tokens.
              You are solely responsible for keeping these credentials confidential, scoping roles
              appropriately (<code>owner</code>, <code>admin</code>, <code>member</code>), and
              revoking compromised keys immediately in the console.
            </>,
            <>
              <strong>Notification:</strong> You agree to notify{' '}
              <InlineLink href="mailto:contact@ferristrace.dev">contact@ferristrace.dev</InlineLink>{' '}
              promptly upon becoming aware of any unauthorised access to your workspace.
            </>,
          ]}
        />
      </>
    ),
  },
  {
    id: 'acceptable-use',
    title: 'Acceptable Use',
    content: (
      <>
        <p>
          FerrisTrace Cloud is designed for application, infrastructure, Kubernetes, incident, and
          AI/LLM observability. You agree not to misuse the service or assist anyone else in doing
          so. In particular, you must not:
        </p>
        <BulletList
          items={[
            <>
              Use the platform for unlawful, fraudulent, defamatory, or harmful activities, or to
              store or distribute malware.
            </>,
            <>
              Probe, scan, fuzz, benchmark-flood, or test the vulnerability of FerrisTrace Cloud
              infrastructure, bypass authentication or rate limits, or interfere with other
              tenants&apos; workspaces.
            </>,
            <>
              Circumvent plan quotas by creating automated throwaway Organisations in place of
              upgrading a workspace.
            </>,
            <>
              Intentionally ingest unredacted payment card numbers (PCI-DSS PAN/CVV), plaintext
              cryptographic private keys, or special-category personal data within the meaning of
              Article 9 GDPR (such as health or biometric records) without appropriate prior
              sanitisation in your OpenTelemetry SDKs or Collector pipelines.
            </>,
          ]}
        />
      </>
    ),
  },
  {
    id: 'customer-data',
    title: 'Your Telemetry, Ownership & Portability',
    content: (
      <>
        <p>
          <strong>You own your data.</strong> You retain all rights, title, and interest in the
          traces, spans, logs, metrics, dashboards, alert rules, incident timelines, postmortems,
          and configurations (&ldquo;Customer Data&rdquo;) you send to or create in FerrisTrace
          Cloud.
        </p>
        <p>
          You grant FerrisTrace a limited, non-exclusive, worldwide licence to host, index, query,
          back up, and display Customer Data solely as necessary to provide, secure, and support the
          FerrisTrace Cloud service for your Organisation. FerrisTrace never sells Customer Data and
          never uses your telemetry or LLM traces to train machine-learning models.
        </p>
        <p>
          <strong>Zero lock-in:</strong> Telemetry is ingested over standard OpenTelemetry (OTLP),
          and Organisation owners can export a complete portable <code>tar.gz</code> archive of
          their Organisation data at any time from the console or HTTP API to migrate to a
          self-hosted FerrisTrace instance.
        </p>
      </>
    ),
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property & Open Source',
    content: (
      <>
        <p>
          The FerrisTrace core source code is published under the{' '}
          <InlineLink href="https://www.apache.org/licenses/LICENSE-2.0">
            Apache License 2.0
          </InlineLink>{' '}
          at <InlineLink href={links.github}>github.com/Ferristrace/ferristrace</InlineLink>. Nothing
          in these Terms restricts your rights under that open-source licence.
        </p>
        <p>
          The <strong>FerrisTrace</strong> name, logos, pixel crab
          marks, visual design, and marketing copy on <strong>ferristrace.dev</strong> remain the
          exclusive property of Thibault Pointurier (trading as FerrisTrace) and may not be used in a way that suggests endorsement or
          causes confusion without prior written permission.
        </p>
      </>
    ),
  },
  {
    id: 'availability-and-suspension',
    title: 'Service Evolution, Maintenance & Suspension',
    content: (
      <>
        <p>
          FerrisTrace Cloud tracks upstream FerrisTrace releases continuously. We may add, improve,
          or deprecate features, provided we do not materially degrade paid functionality during an
          active billing cycle without reasonable prior notice.
        </p>
        <p>
          We may temporarily suspend ingestion or workspace access where strictly necessary to
          mitigate an active security threat, DDoS attack, runaway loop threatening platform
          stability, legal order, or material breach of Article 04 (Acceptable Use). Whenever lawful
          and practicable, we notify the Organisation owner beforehand and restore access once the
          issue is resolved.
        </p>
      </>
    ),
  },
  {
    id: 'liability',
    title: 'Warranties & Liability',
    content: (
      <>
        <p>
          Public websites, documentation, and the Free Cloud tier are provided on an &ldquo;as
          is&rdquo; and &ldquo;as available&rdquo; basis. Paid Cloud tiers are subject to the
          warranties and liability terms set out in our{' '}
          <InlineLink href={links.termsOfSale}>Terms of Sale (CGV)</InlineLink>.
        </p>
        <p>
          FerrisTrace is not responsible for failures originating in your own applications, networks,
          OpenTelemetry SDK configurations, third-party identity providers, or alert notification
          targets (such as Slack, PagerDuty, email relays, or webhooks). Nothing in these Terms
          excludes or limits liability where such exclusion or limitation is prohibited by mandatory
          French law, in particular towards Consumers.
        </p>
      </>
    ),
  },
  {
    id: 'termination',
    title: 'Account Closure & Termination',
    content: (
      <>
        <p>
          You may leave an Organisation or delete your Organisation workspace at any time from{' '}
          <InlineLink href={links.signIn}>console.ferristrace.dev</InlineLink> or by emailing{' '}
          <InlineLink href="mailto:contact@ferristrace.dev">contact@ferristrace.dev</InlineLink>. We
          recommend exporting your Organisation archive before deletion, as workspace deletion
          permanently purges ingested telemetry and metadata in accordance with our{' '}
          <InlineLink href={links.privacy}>Privacy Policy</InlineLink>.
        </p>
      </>
    ),
  },
  {
    id: 'governing-law',
    title: 'Changes, Governing Law & Disputes',
    content: (
      <>
        <p>
          We may update these Terms of Use to reflect product, operational, or regulatory changes.
          For material changes affecting existing Cloud account holders, we provide at least 30
          days&apos; notice by email or in-app banner before the new terms take effect.
        </p>
        <p>
          These Terms of Use are governed by <strong>French law</strong>. In the event of a dispute,
          please contact{' '}
          <InlineLink href="mailto:contact@ferristrace.dev">contact@ferristrace.dev</InlineLink> first
          so we can seek an amicable resolution.
        </p>
        <BulletList
          items={[
            <>
              <strong>Consumers (B2C):</strong> Pursuant to Articles L. 612-1 and R. 616-1 of the
              French Consumer Code, if an amicable written complaint to{' '}
              <InlineLink href="mailto:contact@ferristrace.dev">contact@ferristrace.dev</InlineLink>{' '}
              remains unresolved, you may refer the matter free of charge to the consumer mediator:{' '}
              <strong>
                CM2C (Centre de la Médiation de la Consommation de Conciliateurs de Justice)
              </strong>
              , 49 rue de Ponthieu, 75008 Paris, France —{' '}
              <InlineLink href="https://www.cm2c.net">cm2c.net</InlineLink>. Consumers may also
              bring proceedings before any court competent under Article R. 631-3 of the French
              Consumer Code or applicable EU consumer protection rules.
            </>,
            <>
              <strong>Business Users (B2B):</strong> Failing amicable settlement within 30 days, any
              dispute relating to the validity, interpretation, or performance of these Terms shall
              fall under the exclusive jurisdiction of the competent courts of{' '}
              <strong>Bourges</strong>, France.
            </>,
          ]}
        />
      </>
    ),
  },
]

/* ========================================================================== */
/* 2. TERMS OF SALE (CGV)                                                     */
/* ========================================================================== */

const saleSections: LegalSection[] = [
  {
    id: 'cgv-scope',
    title: 'Scope & Contracting Parties',
    content: (
      <>
        <p>
          These Terms of Sale (<em>Conditions Générales de Vente — CGV</em>) govern all
          subscriptions to <strong>FerrisTrace Cloud</strong> entered into between{' '}
          <strong>Thibault Pointurier — Entrepreneur Individuel (EI)</strong>, trading as{' '}
          <strong>FerrisTrace</strong> (French{' '}
          <em>micro-entreprise / auto-entreprise</em>, SIREN <strong>905 294 013</strong> · SIRET{' '}
          <strong>905 294 013 00024</strong>, whose statutory details appear in Article 01 of the{' '}
          <InlineLink href={links.terms}>Terms of Use</InlineLink>) and
          any Business Customer (B2B) or Consumer Customer (B2C) subscribing on{' '}
          <InlineLink href={links.signIn}>console.ferristrace.dev</InlineLink> or via a signed
          Enterprise order form (&ldquo;Customer&rdquo;).
        </p>
        <p>
          Placing an order or activating a Cloud workspace implies full acceptance of these Terms of
          Sale without reservation. Bespoke terms in a signed Enterprise order form prevail over
          conflicting provisions of these Terms of Sale.
        </p>
      </>
    ),
  },
  {
    id: 'plans-and-quotas',
    title: 'Cloud Plans, Quotas & Overage Rules',
    content: (
      <>
        <p>
          Every FerrisTrace Cloud plan includes the full product feature set (traces, logs, metrics,
          dashboards, Kubernetes views, alerts, incidents, on-call, status pages, AI/LLM cost
          observability, FerrisKey OIDC sign-in, and scoped AI agents) with{' '}
          <strong>unlimited users and unlimited projects</strong> per Organisation. Plans differ
          solely by ingested telemetry volume, retention window, and support level:
        </p>
        <div className="overflow-x-auto border border-border bg-card">
          <table className="w-full min-w-[540px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-tint text-xs uppercase tracking-wider text-accent-text">
                <th scope="col" className="px-4 py-3 font-pixel text-[10px]">
                  Plan
                </th>
                <th scope="col" className="px-4 py-3 font-pixel text-[10px]">
                  Base price (excl. VAT)
                </th>
                <th scope="col" className="px-4 py-3 font-pixel text-[10px]">
                  Included ingest / mo
                </th>
                <th scope="col" className="px-4 py-3 font-pixel text-[10px]">
                  Retention &amp; overage
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <th scope="row" className="px-4 py-3 font-medium text-foreground">
                  Free
                </th>
                <td className="px-4 py-3">€0</td>
                <td className="px-4 py-3">30 GB / month</td>
                <td className="px-4 py-3">
                  7-day retention · Hard cap at 30 GB (ingestion pauses cleanly until the next cycle
                  or upgrade; never billed automatically).
                </td>
              </tr>
              <tr>
                <th scope="row" className="px-4 py-3 font-medium text-foreground">
                  Pro
                </th>
                <td className="px-4 py-3">€19.99 / mo or €199 / yr</td>
                <td className="px-4 py-3">100 GB / month</td>
                <td className="px-4 py-3">
                  30-day retention · 8 GB unbilled grace buffer (up to 108 GB) · €0.30 / GB beyond
                  108 GB, capped at €19.99 / mo by default · Email support.
                </td>
              </tr>
              <tr>
                <th scope="row" className="px-4 py-3 font-medium text-foreground">
                  Enterprise
                </th>
                <td className="px-4 py-3">Custom quote</td>
                <td className="px-4 py-3">Contractual</td>
                <td className="px-4 py-3">
                  Custom retention, Cloud or assisted self-hosted deployment, dedicated contact &amp;
                  contractual SLA.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <strong>Metering &amp; overage cap:</strong> Telemetry volume is metered across OTLP
          spans, log records, and metric data points as documented in the FerrisTrace Cost Meter
          documentation. On Pro, Organisation owners can inspect daily volume in real time and rely
          on the €19.99/month default overage cap so an unexpected traffic spike cannot generate an
          uncapped invoice.
        </p>
      </>
    ),
  },
  {
    id: 'prices-and-vat',
    title: 'Prices, Currency & VAT Status (Art. 293 B CGI)',
    content: (
      <>
        <p>
          All prices listed on our <InlineLink href={links.pricing}>Pricing page</InlineLink> are
          expressed in <strong>Euros (€)</strong>. Before confirming checkout, the exact total
          amount payable is displayed clearly.
        </p>
        <BulletList
          items={[
            <>
              <strong>
                French micro-entreprise VAT exemption (<em>Franchise en base de TVA</em>):
              </strong>{' '}
              As a French <em>micro-entreprise</em> operating under the basic VAT exemption regime,
              VAT is not charged and every invoice carries the mandatory statutory notice:{' '}
              <strong>
                &ldquo;TVA non applicable, art. 293 B du Code général des impôts (CGI)&rdquo;
              </strong>{' '}
              (VAT not applicable under Article 293 B of the French General Tax Code). Accordingly,
              while this regime applies, the displayed Euro price is the net and final amount
              payable.
            </>,
            <>
              <strong>Transition to VAT collection (if applicable):</strong> Should FerrisTrace
              subsequently become subject to VAT (upon crossing statutory turnover thresholds or by
              tax election), prices will be treated as excluding VAT (<em>HT</em>) and applicable
              VAT (<em>TVA</em>) will be added at checkout in accordance with EU VAT rules (standard
              French VAT for customers in France; intra-EU reverse charge under Article 196 of
              Directive 2006/112/EC upon validation of a valid EU VAT number for EU B2B customers;
              applicable Member State VAT for EU Consumers).
            </>,
            <>
              <strong>Outside the European Union:</strong> Any local import duties or withholding
              taxes imposed by the Customer&apos;s jurisdiction remain the Customer&apos;s
              responsibility.
            </>,
          ]}
        />
        <p>
          We may revise plan pricing prospectively with at least 30 days&apos; prior email notice.
          Revised prices apply only upon the next renewal cycle, giving you the opportunity to
          cancel or migrate beforehand.
        </p>
      </>
    ),
  },
  {
    id: 'billing-and-stripe',
    title: 'Ordering, Payment Processing (Stripe) & Late Payment',
    content: (
      <>
        <p>
          Online payments are processed by <strong>Stripe</strong> (Stripe Payments Europe, Ltd., a
          PCI-DSS Level 1 certified payment service provider). FerrisTrace never receives or stores
          raw payment card numbers or CVV codes.
        </p>
        <BulletList
          items={[
            <>
              <strong>Billing schedule:</strong> The fixed Pro base fee (€19.99/month or €199/year
              excl. VAT) is billed in advance at the start of each billing period. Metered Pro
              overage above the 108 GB threshold (if any) is tallied and billed at the close of each
              monthly period. Electronic PDF invoices are made available in your billing portal and
              by email.
            </>,
            <>
              <strong>Failed payments:</strong> If a charge fails, Stripe retries collection
              automatically and notifies the Organisation owner. If payment remains unsettled 10
              days after notice, FerrisTrace may pause ingestion or downgrade the workspace to the
              Free tier limits until settled.
            </>,
            <>
              <strong>B2B statutory late-payment penalties (Art. L. 441-10 Code de commerce):</strong>{' '}
              For Business Customers only, any sum unpaid on its due date automatically accrues
              late-payment interest without prior formal notice at a rate equal to the European
              Central Bank&apos;s most recent refinancing rate plus 10 percentage points, together
              with the statutory fixed recovery indemnity of <strong>€40</strong> (
              <em>indemnité forfaitaire pour frais de recouvrement</em>, Art. D. 441-5 Code de
              commerce), without prejudice to further documented recovery costs.
            </>,
          ]}
        />
      </>
    ),
  },
  {
    id: 'withdrawal-right',
    title: 'Consumer Right of Withdrawal (Droit de rétractation — B2C)',
    content: (
      <>
        <p>
          <strong>Applies solely to Consumers (B2C) within the European Economic Area.</strong>{' '}
          Pursuant to Article L. 221-18 of the French Consumer Code, a Consumer has a period of{' '}
          <strong>14 calendar days</strong> from the date a paid Cloud subscription is entered into
          to exercise their right of withdrawal, without having to state reasons or pay penalties.
        </p>
        <p>
          <strong>Immediate performance of Cloud services:</strong> When activating a paid Cloud
          plan, the workspace and quota upgrade are provisioned immediately upon your express
          request. Under Article L. 221-25 of the French Consumer Code, if you request immediate
          start of the subscription and then exercise your right of withdrawal within the 14-day
          window, you remain liable only for the proportionate amount corresponding to the service
          provided up to the time you notify us of your withdrawal (and FerrisTrace refunds the
          balance within 14 days via the original payment method). Where Article L. 221-28 13°
          applies to fully performed digital content, any prior express consent and acknowledgement
          is collected separately at checkout as required by law.
        </p>
        <p>
          <strong>How to withdraw:</strong> Send an unambiguous statement before the 14-day deadline
          to <InlineLink href="mailto:contact@ferristrace.dev">contact@ferristrace.dev</InlineLink> (for
          instance: <em>&ldquo;I hereby notify my withdrawal from my FerrisTrace Cloud Pro
          subscription ordered on [date] for Organisation [name], account email [email].&rdquo;</em>
          ). We acknowledge receipt by email without delay.
        </p>
      </>
    ),
  },
  {
    id: 'renewal-and-cancellation',
    title: 'Term, Renewal, Plan Changes & Cancellation',
    content: (
      <>
        <BulletList
          items={[
            <>
              <strong>Term &amp; renewal:</strong> Paid subscriptions run for the selected billing
              cycle (one month or one year) and renew automatically for successive periods of the
              same duration unless cancelled prior to the renewal date. For Consumers on annual
              plans, FerrisTrace sends the statutory renewal reminder notice between three months and
              one month before renewal in accordance with Article L. 215-1 of the French Consumer
              Code.
            </>,
            <>
              <strong>Upgrades:</strong> Upgrading from Free to Pro or from monthly to annual takes
              effect immediately, with unused prepaid time credited pro rata.
            </>,
            <>
              <strong>Cancellation &amp; downgrades:</strong> You can cancel or downgrade at any
              time in one click from{' '}
              <InlineLink href={links.signIn}>console.ferristrace.dev</InlineLink>. Cancellation
              stops future renewals while keeping your Pro features and retention active until the
              end of the current paid period. Except where required by statutory Consumer rights or
              termination for FerrisTrace&apos;s uncured material breach, prepaid fees for the current
              period are non-refundable.
            </>,
          ]}
        />
      </>
    ),
  },
  {
    id: 'conformity-and-support',
    title: 'Support, Service Levels & Statutory Consumer Guarantee',
    content: (
      <>
        <p>
          <strong>Support &amp; availability:</strong> Free workspaces receive community support via{' '}
          <InlineLink href={`${links.github}/discussions`}>GitHub Discussions</InlineLink>; Pro
          workspaces receive email support via{' '}
          <InlineLink href="mailto:contact@ferristrace.dev">contact@ferristrace.dev</InlineLink>;
          Enterprise customers benefit from contractual response times and uptime SLAs set out in
          their order form. Live platform status is published on our status page.
        </p>
        <p>
          <strong>Statutory Guarantee of Conformity for Consumers (B2C):</strong> Consumers benefit
          from the French statutory guarantee of conformity for digital services supplied
          continuously over a period of time pursuant to Articles L. 224-25-12 to L. 224-25-26 of
          the French Consumer Code throughout the subscription period, as well as the statutory
          warranty against hidden defects under Articles 1641 to 1649 of the French Civil Code. In
          the event of lack of conformity, the Consumer is entitled to have the digital service
          brought into conformity free of charge within a reasonable time, or failing that, to a
          price reduction or contract termination under Article L. 224-25-19 et seq.
        </p>
      </>
    ),
  },
  {
    id: 'cgv-liability',
    title: 'Liability & Force Majeure',
    content: (
      <>
        <p>
          Neither party shall be liable for failure or delay resulting from an event of{' '}
          <em>force majeure</em> within the meaning of Article 1218 of the French Civil Code and the
          case law of the French courts.
        </p>
        <p>
          <strong>Business Customers (B2B):</strong> To the maximum extent permitted by French law,
          FerrisTrace shall not be liable to Business Customers for indirect or consequential losses
          (including loss of profit, revenue, business opportunity, or anticipated savings), and
          FerrisTrace&apos;s aggregate liability arising out of or in connection with a Cloud
          subscription over any 12-month period shall not exceed the total subscription fees
          actually paid by the Business Customer for the affected Organisation during the 12 months
          preceding the event giving rise to the claim.
        </p>
        <p>
          <strong>Consumers (B2C):</strong> The B2B cap and exclusions above do not apply to
          Consumers, who retain the full benefit of mandatory statutory liability provisions under
          French law.
        </p>
      </>
    ),
  },
  {
    id: 'dpa',
    title: 'Data Processing Agreement (GDPR Art. 28)',
    content: (
      <>
        <p>
          When a Business Customer ingests personal data within telemetry sent to FerrisTrace Cloud,
          the Customer acts as Data Controller and FerrisTrace acts as Data Processor within the
          meaning of Article 28 of Regulation (EU) 2016/679 (GDPR). Our{' '}
          <InlineLink href={links.dpa}>Data Processing Agreement (DPA)</InlineLink> forms an
          integral part of these Terms of Sale and applies automatically to every Business Customer
          workspace. Enterprise customers requiring a countersigned PDF execution copy of the DPA
          may request one at{' '}
          <InlineLink href="mailto:contact@ferristrace.dev">contact@ferristrace.dev</InlineLink>.
        </p>
      </>
    ),
  },
  {
    id: 'cgv-law',
    title: 'Governing Law, Mediation & Jurisdiction',
    content: (
      <>
        <p>
          These Terms of Sale are governed by <strong>French law</strong> (excluding the UN
          Convention on Contracts for the International Sale of Goods). Any billing or contractual
          complaint should first be addressed to{' '}
          <InlineLink href="mailto:contact@ferristrace.dev">contact@ferristrace.dev</InlineLink>.
        </p>
        <p>
          <strong>Consumers (B2C)</strong> may, following a prior written complaint to{' '}
          <InlineLink href="mailto:contact@ferristrace.dev">contact@ferristrace.dev</InlineLink>,
          refer unresolved disputes free of charge to the consumer mediator{' '}
          <strong>
            CM2C (Centre de la Médiation de la Consommation de Conciliateurs de Justice)
          </strong>
          , 49 rue de Ponthieu, 75008 Paris, France (
          <InlineLink href="https://www.cm2c.net">cm2c.net</InlineLink>, Art. L. 612-1 &amp;
          R. 616-1 French Consumer Code) and bring claims before the courts designated by mandatory
          consumer protection law. <strong>Business Customers (B2B)</strong> agree that any dispute
          not resolved amicably within 30 days shall be submitted to the exclusive jurisdiction of
          the competent courts of <strong>Bourges</strong>, France.
        </p>
      </>
    ),
  },
]

/* ========================================================================== */
/* 3. PRIVACY POLICY & GDPR (POLITIQUE DE CONFIDENTIALITE & RGPD)             */
/* ========================================================================== */

const privacySections: LegalSection[] = [
  {
    id: 'roles',
    title: 'Controller & Processor Roles under the GDPR',
    content: (
      <>
        <p>
          <strong>Thibault Pointurier — Entrepreneur Individuel (EI)</strong>, trading as{' '}
          <strong>FerrisTrace</strong> (SIREN <strong>905 294 013</strong> · SIRET{' '}
          <strong>905 294 013 00024</strong>, established in France), processes personal
          data in compliance with Regulation (EU) 2016/679 (the{' '}
          <strong>General Data Protection Regulation — GDPR / RGPD</strong>) and French Law
          No. 78-17 of January 6, 1978 as amended (<em>Loi Informatique et Libertés</em>).
        </p>
        <BulletList
          items={[
            <>
              <strong>FerrisTrace as Data Controller (Responsable de traitement):</strong> For
              visitors to <strong>ferristrace.dev</strong> and <strong>docs.ferristrace.dev</strong>
              , and for account holders, Organisation members, billing contacts, and support
              correspondents on <strong>console.ferristrace.dev</strong>.
            </>,
            <>
              <strong>FerrisTrace as Data Processor (Sous-traitant, Art. 28 GDPR):</strong> For
              observability telemetry (traces, spans, logs, metrics, LLM spans, alerts, and incident
              records) ingested by Customers into their FerrisTrace Cloud workspaces. Each Customer
              controls what telemetry its OpenTelemetry SDKs emit, remains the Data Controller for
              any personal data contained in that telemetry, and benefits from our{' '}
              <InlineLink href={links.dpa}>Data Processing Agreement (DPA)</InlineLink>.
            </>,
            <>
              <strong>Privacy contact:</strong>{' '}
              <InlineLink href="mailto:contact@ferristrace.dev">contact@ferristrace.dev</InlineLink>{' '}
              (Thibault Pointurier).
            </>,
          ]}
        />
      </>
    ),
  },
  {
    id: 'data-collected',
    title: 'Personal Data Collected, Purposes & Legal Bases',
    content: (
      <>
        <p>
          We collect only the minimum data needed to run FerrisTrace Cloud, bill paid subscriptions,
          secure workspaces, and answer enquiries:
        </p>
        <div className="overflow-x-auto border border-border bg-card">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-tint text-xs uppercase tracking-wider text-accent-text">
                <th scope="col" className="px-4 py-3 font-pixel text-[10px]">
                  Category
                </th>
                <th scope="col" className="px-4 py-3 font-pixel text-[10px]">
                  Data elements
                </th>
                <th scope="col" className="px-4 py-3 font-pixel text-[10px]">
                  Purpose &amp; GDPR legal basis
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <th scope="row" className="px-4 py-3 font-medium text-foreground">
                  Account &amp; OIDC identity
                </th>
                <td className="px-4 py-3">
                  OIDC <code>(issuer, sub)</code> identifier, display name, verified email address,
                  Organisation memberships &amp; roles (no passwords stored by FerrisTrace).
                </td>
                <td className="px-4 py-3">
                  Workspace authentication &amp; access control ·{' '}
                  <strong>Contract performance</strong> (Art. 6(1)(b) GDPR).
                </td>
              </tr>
              <tr>
                <th scope="row" className="px-4 py-3 font-medium text-foreground">
                  Billing &amp; tax records
                </th>
                <td className="px-4 py-3">
                  Organisation billing name, postal address, country, EU VAT number, Stripe customer
                  &amp; subscription IDs, card brand/last 4 digits, invoices.
                </td>
                <td className="px-4 py-3">
                  Subscription billing &amp; statutory accounting ·{' '}
                  <strong>Contract &amp; Legal obligation</strong> (Art. 6(1)(b) &amp; 6(1)(c)
                  GDPR).
                </td>
              </tr>
              <tr>
                <th scope="row" className="px-4 py-3 font-medium text-foreground">
                  Security &amp; audit logs
                </th>
                <td className="px-4 py-3">
                  IP address, timestamps, HTTP request metadata, workspace audit log entries (key
                  creation, role changes, AI agent actions).
                </td>
                <td className="px-4 py-3">
                  Abuse prevention, incident forensics &amp; tenant security ·{' '}
                  <strong>Legitimate interest</strong> (Art. 6(1)(f) GDPR).
                </td>
              </tr>
              <tr>
                <th scope="row" className="px-4 py-3 font-medium text-foreground">
                  Support enquiries
                </th>
                <td className="px-4 py-3">
                  Sender email, name, and message contents sent to{' '}
                  <code>contact@ferristrace.dev</code>.
                </td>
                <td className="px-4 py-3">
                  Answering technical, commercial, or legal requests ·{' '}
                  <strong>Pre-contractual steps / Legitimate interest</strong> (Art. 6(1)(b)/(f)
                  GDPR).
                </td>
              </tr>
              <tr>
                <th scope="row" className="px-4 py-3 font-medium text-foreground">
                  Ingested Cloud telemetry
                </th>
                <td className="px-4 py-3">
                  OTLP spans, logs, metrics, LLM call metadata, and incident timelines sent by a
                  Customer&apos;s services.
                </td>
                <td className="px-4 py-3">
                  Processed strictly as <strong>Data Processor</strong> on the Customer&apos;s
                  instructions (Art. 28 GDPR).
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies & Local Storage (CNIL / ePrivacy)',
    content: (
      <>
        <p>
          <strong>Zero advertising or cross-site tracking cookies.</strong> Neither{' '}
          <strong>ferristrace.dev</strong>, <strong>docs.ferristrace.dev</strong>, nor{' '}
          <strong>console.ferristrace.dev</strong> embeds third-party advertising networks, social
          media pixels, or behavioural profiling trackers.
        </p>
        <p>
          We only store strictly functional client-side items that are exempt from prior consent
          under Article 82 of the French Data Protection Act and CNIL guidelines:
        </p>
        <BulletList
          items={[
            <>
              <code>theme</code> cookie (<code>light</code>, <code>dark</code>, or{' '}
              <code>system</code>, 1-year expiry) — remembers your display appearance across the
              marketing site and documentation so pages render without a flash of the wrong theme.
            </>,
            <>
              OIDC PKCE session state on <code>console.ferristrace.dev</code> — strictly necessary
              to authenticate you securely through FerrisKey or your identity provider.
            </>,
          ]}
        />
      </>
    ),
  },
  {
    id: 'hosting-and-subprocessors',
    title: 'EU Hosting, Sub-processors & International Transfers',
    content: (
      <>
        <p>
          FerrisTrace Cloud infrastructure, databases (PostgreSQL and ClickHouse), and object
          storage are hosted in the <strong>European Union (France)</strong>. We share data only
          with vetted infrastructure and payment providers strictly needed to deliver the service:
        </p>
        <div className="overflow-x-auto border border-border bg-card">
          <table className="w-full min-w-[540px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-tint text-xs uppercase tracking-wider text-accent-text">
                <th scope="col" className="px-4 py-3 font-pixel text-[10px]">
                  Sub-processor
                </th>
                <th scope="col" className="px-4 py-3 font-pixel text-[10px]">
                  Role
                </th>
                <th scope="col" className="px-4 py-3 font-pixel text-[10px]">
                  Processing location &amp; safeguards
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <th scope="row" className="px-4 py-3 font-medium text-foreground">
                  Scaleway SAS
                </th>
                <td className="px-4 py-3">
                  Cloud servers, Kubernetes clusters, databases &amp; S3 object storage
                </td>
                <td className="px-4 py-3">France (European Union) — no transfer outside the EEA.</td>
              </tr>
              <tr>
                <th scope="row" className="px-4 py-3 font-medium text-foreground">
                  Stripe Payments Europe, Ltd.
                </th>
                <td className="px-4 py-3">
                  Subscription checkout, invoicing &amp; PCI-DSS card processing (paid plans only)
                </td>
                <td className="px-4 py-3">
                  Ireland (EU) &amp; United States — framed by the EU-U.S. Data Privacy Framework
                  and European Commission Standard Contractual Clauses (Art. 46 GDPR).
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          We never sell personal data, never share telemetry with data brokers, and never send
          Customer telemetry to external LLM providers unless an Organisation administrator
          explicitly connects their own agent or MCP client.
        </p>
      </>
    ),
  },
  {
    id: 'retention',
    title: 'Data Retention Periods',
    content: (
      <>
        <BulletList
          items={[
            <>
              <strong>Ingested Cloud telemetry:</strong> Automatically expired by ClickHouse TTL
              after <strong>7 days</strong> on Free, <strong>30 days</strong> on Pro, or the custom
              window agreed on Enterprise, and deleted immediately upon project or Organisation
              deletion.
            </>,
            <>
              <strong>Account &amp; workspace metadata:</strong> Kept while your account or
              Organisation remains active, and purged within <strong>30 days</strong> of account or
              workspace deletion (including encrypted operational backups as they rotate out).
            </>,
            <>
              <strong>Security &amp; connection logs:</strong> Retained for up to{' '}
              <strong>12 months</strong> in compliance with French LCEN obligations and security
              monitoring needs.
            </>,
            <>
              <strong>Invoices &amp; accounting records:</strong> Retained for{' '}
              <strong>10 years</strong> from the close of the financial year pursuant to Article
              L. 123-22 of the French Commercial Code.
            </>,
          ]}
        />
      </>
    ),
  },
  {
    id: 'security',
    title: 'Technical & Organisational Security Measures',
    content: (
      <>
        <p>
          Pursuant to Article 32 GDPR, FerrisTrace implements defence-in-depth measures across the
          platform:
        </p>
        <BulletList
          items={[
            <>
              TLS encryption in transit across all web, OIDC, HTTP API, OTLP ingestion, and MCP
              endpoints, plus encryption at rest on underlying storage volumes.
            </>,
            <>
              Passwordless OIDC + PKCE sign-in backed by FerrisKey, hashed ingest/API tokens, and
              short-lived audience-bound tokens for AI agents enforced by the MCP policy gateway.
            </>,
            <>
              Strict per-Organisation tenant isolation in PostgreSQL and ClickHouse queries, paired
              with an immutable Organisation audit log.
            </>,
            <>
              Hardened Rust binaries running in minimal non-root containers with read-only root
              filesystems, signed container images, and automated vulnerability scanning.
            </>,
          ]}
        />
      </>
    ),
  },
  {
    id: 'gdpr-rights',
    title: 'Your GDPR Rights & Supervisory Authority (CNIL)',
    content: (
      <>
        <p>
          Under Articles 15 to 22 of the GDPR and the French Data Protection Act (
          <em>Loi Informatique et Libertés</em>), you hold the following rights over your personal
          data where FerrisTrace acts as Data Controller:
        </p>
        <BulletList
          items={[
            <>
              <strong>Right of access &amp; portability:</strong> Obtain confirmation of processing,
              a copy of your personal data, and a machine-readable export (in addition to the
              self-service <code>tar.gz</code> Organisation export built into FerrisTrace).
            </>,
            <>
              <strong>Right to rectification &amp; erasure:</strong> Correct inaccurate details or
              request deletion of your account and personal data (&ldquo;right to be
              forgotten&rdquo;), subject to mandatory accounting retention rules.
            </>,
            <>
              <strong>Right to restriction &amp; objection:</strong> Request restricted processing
              or object on grounds relating to your particular situation where processing relies on
              legitimate interest.
            </>,
            <>
              <strong>Post-mortem directives (Art. 85 Loi Informatique et Libertés):</strong> Define
              instructions regarding the retention, erasure, and communication of your personal data
              after your death.
            </>,
          ]}
        />
        <p>
          <strong>Exercising your rights:</strong> Email{' '}
          <InlineLink href="mailto:contact@ferristrace.dev">contact@ferristrace.dev</InlineLink>{' '}
          specifying the email address associated with your workspace. We respond within{' '}
          <strong>one month</strong> of receipt (extendable by two months for complex requests under
          Article 12(3) GDPR). If your request concerns telemetry inside an Organisation&apos;s
          workspace where FerrisTrace is Data Processor, we will direct your request to that
          Organisation&apos;s controller.
        </p>
        <p>
          <strong>Supervisory authority:</strong> If you consider after contacting us that your data
          protection rights have not been respected, you have the right to lodge a complaint with
          the French supervisory authority, the{' '}
          <strong>Commission Nationale de l&apos;Informatique et des Libertés (CNIL)</strong> — 3
          Place de Fontenoy, TSA 80715, 75334 Paris Cedex 07, France (
          <InlineLink href="https://www.cnil.fr">cnil.fr</InlineLink>) — or with the data protection
          authority of your habitual EU Member State of residence.
        </p>
      </>
    ),
  },
]

/* ========================================================================== */
/* 4. DATA PROCESSING AGREEMENT (DPA — ACCORD DE SOUS-TRAITANCE ART. 28 RGPD) */
/* ========================================================================== */

const dpaSections: LegalSection[] = [
  {
    id: 'dpa-parties-and-scope',
    title: 'Parties, Scope & Incorporation (Art. 28 GDPR)',
    content: (
      <>
        <p>
          This Data Processing Agreement (<em>Accord de sous-traitance de données personnelles</em>{' '}
          — &ldquo;DPA&rdquo;) is entered into pursuant to Article 28 of Regulation (EU) 2016/679
          (the <strong>General Data Protection Regulation — GDPR / RGPD</strong>) and French Law
          No. 78-17 of January 6, 1978 as amended (<em>Loi Informatique et Libertés</em>) between:
        </p>
        <BulletList
          items={[
            <>
              <strong>The Data Controller (Responsable de traitement — &ldquo;Customer&rdquo;):</strong>{' '}
              Any legal entity or professional user subscribing to or operating an Organisation
              workspace on <strong>FerrisTrace Cloud</strong> (
              <InlineLink href={links.signIn}>console.ferristrace.dev</InlineLink>); and
            </>,
            <>
              <strong>The Data Processor (Sous-traitant — &ldquo;FerrisTrace&rdquo;):</strong>{' '}
              <strong>Thibault Pointurier — Entrepreneur Individuel (EI)</strong>, operating under
              the trade name <strong>FerrisTrace</strong> (French{' '}
              <em>micro-entreprise / auto-entreprise</em>, SIREN <strong>905 294 013</strong> ·
              SIRET <strong>905 294 013 00024</strong> · APE <strong>62.01Z</strong>, registered
              with the French <em>Registre National des Entreprises (RNE)</em>, established in
              France — statutory postal address stated on Customer invoices and Order Forms).
            </>,
          ]}
        />
        <p>
          <strong>Automatic incorporation:</strong> This DPA forms an integral part of our{' '}
          <InlineLink href={links.terms}>Terms of Use (CGU)</InlineLink> and{' '}
          <InlineLink href={links.termsOfSale}>Terms of Sale (CGV)</InlineLink>, and applies
          automatically whenever Customer telemetry ingested into FerrisTrace Cloud contains
          personal data. Enterprise customers requiring a countersigned PDF execution copy may
          request one at{' '}
          <InlineLink href="mailto:contact@ferristrace.dev">contact@ferristrace.dev</InlineLink>. In the
          event of any conflict between this DPA and the CGU/CGV regarding personal data protection,
          this DPA prevails.
        </p>
      </>
    ),
  },
  {
    id: 'dpa-annex-1-description',
    title: 'Annex I — Description of Processing',
    content: (
      <>
        <p>
          In accordance with Article 28(3) GDPR, the subject matter, duration, nature, and purpose
          of the processing, as well as the types of personal data and categories of data subjects,
          are specified below:
        </p>
        <div className="overflow-x-auto border border-border bg-card">
          <table className="w-full min-w-[560px] text-left text-sm">
            <tbody className="divide-y divide-border">
              <tr>
                <th scope="row" className="w-56 px-4 py-3 font-medium text-foreground">
                  Subject matter &amp; purpose
                </th>
                <td className="px-4 py-3">
                  Provision of the managed <strong>FerrisTrace Cloud</strong> observability platform
                  (ingestion, indexing, storage, querying, dashboarding, alerting, incident
                  management, and Customer-authorised AI/MCP inspection of observability telemetry).
                </td>
              </tr>
              <tr>
                <th scope="row" className="px-4 py-3 font-medium text-foreground">
                  Nature of operations
                </th>
                <td className="px-4 py-3">
                  Automated reception over OpenTelemetry (OTLP gRPC/HTTP), structured parsing,
                  ClickHouse &amp; PostgreSQL storage, full-text and attribute indexing, display in
                  the Customer&apos;s workspace, portable <code>tar.gz</code> export, and automated
                  TTL expiration or deletion.
                </td>
              </tr>
              <tr>
                <th scope="row" className="px-4 py-3 font-medium text-foreground">
                  Duration of processing
                </th>
                <td className="px-4 py-3">
                  For the duration of the Customer&apos;s FerrisTrace Cloud subscription, subject to
                  rolling ClickHouse retention TTLs (<strong>7 days</strong> on Free,{' '}
                  <strong>30 days</strong> on Pro, or the contractual window on Enterprise) and
                  post-termination purge within 30 days.
                </td>
              </tr>
              <tr>
                <th scope="row" className="px-4 py-3 font-medium text-foreground">
                  Categories of data subjects
                </th>
                <td className="px-4 py-3">
                  Determined solely by the Customer&apos;s instrumentation; typically includes end
                  users of the Customer&apos;s software applications, employees, engineers, on-call
                  responders, or API consumers whose identifiers appear in telemetry emitted by the
                  Customer&apos;s services.
                </td>
              </tr>
              <tr>
                <th scope="row" className="px-4 py-3 font-medium text-foreground">
                  Categories of personal data
                </th>
                <td className="px-4 py-3">
                  Determined by the Customer&apos;s OpenTelemetry SDKs and Collector pipelines:
                  IP addresses, user/session IDs, request headers, URLs, email addresses, service
                  log lines, span attributes, LLM prompt/completion metadata, and incident responder
                  notes.
                </td>
              </tr>
              <tr>
                <th scope="row" className="px-4 py-3 font-medium text-foreground">
                  Excluded sensitive data
                </th>
                <td className="px-4 py-3">
                  Special categories of data (Art. 9 GDPR — health, biometric, political, religious
                  data), criminal conviction data (Art. 10 GDPR), and unredacted payment card data
                  (PCI-DSS PAN/CVV) are excluded and must be scrubbed or redacted in the
                  Customer&apos;s OTel SDK or Collector prior to ingestion.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    ),
  },
  {
    id: 'dpa-controller-and-processor-obligations',
    title: 'Documented Instructions & Processor Obligations (Art. 28(3)(a)-(b))',
    content: (
      <>
        <p>
          <strong>Customer obligations as Data Controller:</strong> The Customer warrants that it
          has a valid legal basis under Article 6 GDPR for collecting and transmitting any personal
          data included in its telemetry, has informed data subjects appropriately, and configures
          its OpenTelemetry instrumentation in compliance with the data minimisation principle (Art.
          5(1)(c) GDPR).
        </p>
        <p>
          <strong>FerrisTrace obligations as Data Processor:</strong> Pursuant to Article 28(3)(a)
          and (b) GDPR, FerrisTrace undertakes to:
        </p>
        <BulletList
          items={[
            <>
              <strong>Documented instructions only:</strong> Process Customer telemetry solely in
              accordance with the Customer&apos;s documented instructions — as set out in this DPA,
              the CGU/CGV, and the Customer&apos;s configurations in{' '}
              <code>console.ferristrace.dev</code> — unless required to do so by European Union or
              French law (in which case FerrisTrace shall inform the Customer of that legal
              requirement before processing, unless the law prohibits such information on important
              grounds of public interest).
            </>,
            <>
              <strong>Duty to alert:</strong> Immediately inform the Customer if, in FerrisTrace&apos;s
              opinion, an instruction given by the Customer infringes the GDPR or other EU or Member
              State data protection provisions (Art. 28(3) subparagraph 2 GDPR).
            </>,
            <>
              <strong>Zero secondary use or AI model training:</strong> Never sell, rent, or monetise
              Customer telemetry, never use it for advertising, and never use Customer telemetry or
              LLM traces to train or fine-tune machine-learning models.
            </>,
            <>
              <strong>Confidentiality:</strong> Ensure that any person authorised to access personal
              data is bound by a strict contractual or statutory obligation of confidentiality and
              processes data only on a need-to-know basis for support or platform maintenance.
            </>,
          ]}
        />
      </>
    ),
  },
  {
    id: 'dpa-annex-2-security',
    title: 'Annex II — Technical & Organisational Security Measures (Art. 32 GDPR)',
    content: (
      <>
        <p>
          Pursuant to Article 28(3)(c) and Article 32 GDPR, FerrisTrace implements and maintains the
          following technical and organisational security measures (TOMs) to protect Customer
          telemetry against accidental or unlawful destruction, loss, alteration, unauthorised
          disclosure, or access:
        </p>
        <BulletList
          items={[
            <>
              <strong>Encryption in transit &amp; at rest:</strong> All external traffic across web,
              OIDC, HTTP API, OTLP gRPC/HTTP ingestion, and MCP endpoints is encrypted via TLS
              1.2/1.3. Underlying block storage, PostgreSQL databases, ClickHouse volumes, and S3
              object storage are encrypted at rest.
            </>,
            <>
              <strong>Passwordless OIDC &amp; cryptographic token hashing:</strong> Human sign-in
              uses OpenID Connect (OIDC) Authorization Code + PKCE via FerrisKey. Ingest keys and
              API tokens are stored exclusively as cryptographic hashes. AI agent / MCP tokens are
              short-lived, audience-bound, and filtered through a policy gateway.
            </>,
            <>
              <strong>Strict multi-tenant isolation &amp; RBAC:</strong> Every database query and
              storage path is scoped to the authenticated Organisation ID. Role-based access control
              (<code>owner</code>, <code>admin</code>, <code>member</code>) restricts administrative
              operations, and an immutable Organisation audit log records key issuance, role
              changes, and agent actions.
            </>,
            <>
              <strong>Memory-safe runtime &amp; container hardening:</strong> FerrisTrace services
              are compiled in Rust (eliminating memory-corruption classes of vulnerabilities) and
              run in minimal non-root containers with read-only root filesystems, signed container
              images, and automated dependency vulnerability scanning.
            </>,
            <>
              <strong>Resilience &amp; availability:</strong> Hosted in tier-3+ EU data centres in
              France (Scaleway SAS) with automated health checks, resource isolation, and encrypted
              operational backups.
            </>,
          ]}
        />
      </>
    ),
  },
  {
    id: 'dpa-annex-3-subprocessors',
    title: 'Annex III — Authorised Sub-processors & EU Data Residency (Art. 28(2) & (4))',
    content: (
      <>
        <p>
          The Customer grants FerrisTrace a general written authorisation under Article 28(2) GDPR to
          engage the sub-processors listed below for the hosting and delivery of FerrisTrace Cloud:
        </p>
        <div className="overflow-x-auto border border-border bg-card">
          <table className="w-full min-w-[540px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-tint text-xs uppercase tracking-wider text-accent-text">
                <th scope="col" className="px-4 py-3 font-pixel text-[10px]">
                  Sub-processor
                </th>
                <th scope="col" className="px-4 py-3 font-pixel text-[10px]">
                  Scope of processing
                </th>
                <th scope="col" className="px-4 py-3 font-pixel text-[10px]">
                  Data location &amp; Chapter V status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <th scope="row" className="px-4 py-3 font-medium text-foreground">
                  Scaleway SAS (Iliad Group)
                </th>
                <td className="px-4 py-3">
                  Cloud compute, Kubernetes clusters, PostgreSQL &amp; ClickHouse storage, S3 object
                  storage for ingested telemetry
                </td>
                <td className="px-4 py-3">
                  <strong>France (European Union)</strong> — 100% EEA residency; zero transfer of
                  Customer telemetry outside the European Economic Area.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <em>
            Note: Stripe Payments Europe, Ltd. processes subscription billing data where FerrisTrace
            acts as Data Controller (covered by our{' '}
            <InlineLink href={links.privacy}>Privacy Policy</InlineLink>), and never receives or
            processes ingested Customer observability telemetry.
          </em>
        </p>
        <BulletList
          items={[
            <>
              <strong>Prior notice &amp; right to object:</strong> FerrisTrace informs Organisation
              owners by email at least <strong>30 calendar days</strong> before adding or replacing
              any sub-processor that handles Customer telemetry. The Customer may object on
              reasonable, documented data protection grounds within 15 days of notice; if the
              parties cannot resolve the objection amicably, the Customer may export its{' '}
              <code>tar.gz</code> archive and terminate its subscription prior to the new
              sub-processor taking effect, receiving a pro-rata refund of any prepaid unused fees.
            </>,
            <>
              <strong>Flow-down obligations (Art. 28(4) GDPR):</strong> FerrisTrace imposes on each
              sub-processor data protection obligations no less protective than those set out in
              this DPA and remains liable to the Customer for the performance of the
              sub-processor&apos;s obligations.
            </>,
          ]}
        />
      </>
    ),
  },
  {
    id: 'dpa-assistance-and-rights',
    title: 'Assistance with Data Subject Rights, DPIAs & CNIL Consultations (Art. 28(3)(e)-(f))',
    content: (
      <>
        <BulletList
          items={[
            <>
              <strong>Self-service tools &amp; Data Subject Requests (DSRs):</strong> The
              FerrisTrace Cloud console and HTTP API enable the Customer to search, export (
              <code>tar.gz</code>), and delete project or workspace telemetry directly. If
              FerrisTrace receives a request directly from an end user relating to telemetry in a
              Customer&apos;s workspace, FerrisTrace will promptly forward the request to the
              Customer and will not respond directly to the data subject without the Customer&apos;s
              prior authorisation, unless legally compelled.
            </>,
            <>
              <strong>DPIA &amp; supervisory authority consultation:</strong> Taking into account
              the nature of processing and the information available to FerrisTrace, FerrisTrace
              assists the Customer upon request in carrying out Data Protection Impact Assessments
              (Art. 35 GDPR) and prior consultations with the CNIL or other competent supervisory
              authorities (Art. 36 GDPR) by providing up-to-date architectural and security
              documentation.
            </>,
          ]}
        />
      </>
    ),
  },
  {
    id: 'dpa-breach-notification',
    title: 'Personal Data Breach Notification (Art. 33 GDPR)',
    content: (
      <>
        <p>
          In the event of a confirmed personal data breach affecting Customer telemetry processed by
          FerrisTrace (Art. 4(12) and Art. 33(2) GDPR), FerrisTrace shall notify the Customer&apos;s
          Organisation owner by email <strong>without undue delay</strong> — and in any event within{' '}
          <strong>48 hours</strong> of becoming aware of the breach — so the Customer can meet its
          own 72-hour notification deadline where applicable.
        </p>
        <p>The notification shall describe, to the extent known:</p>
        <BulletList
          items={[
            <>
              The nature and timeline of the personal data breach, including the categories and
              approximate volume of affected telemetry records;
            </>,
            <>
              The contact point at FerrisTrace (
              <InlineLink href="mailto:contact@ferristrace.dev">contact@ferristrace.dev</InlineLink>)
              from whom further information may be obtained;
            </>,
            <>The likely consequences of the breach; and</>,
            <>
              The technical measures taken or proposed by FerrisTrace to contain the breach and
              mitigate its possible adverse effects.
            </>,
          ]}
        />
      </>
    ),
  },
  {
    id: 'dpa-deletion-and-return',
    title: 'Return & Deletion of Data at End of Service (Art. 28(3)(g) GDPR)',
    content: (
      <>
        <p>
          At any time during the subscription and prior to closing an Organisation workspace, the
          Customer can retrieve all of its data in a standard, portable <code>tar.gz</code> archive
          from <InlineLink href={links.signIn}>console.ferristrace.dev</InlineLink> or via the HTTP
          API.
        </p>
        <p>
          Upon deletion of a project or Organisation workspace by the Customer, or upon termination
          of the subscription:
        </p>
        <BulletList
          items={[
            <>
              Ingested telemetry and workspace metadata are immediately removed from active
              ClickHouse and PostgreSQL databases (in addition to continuous automatic expiration at
              the end of the plan&apos;s 7-day or 30-day retention TTL); and
            </>,
            <>
              Any residual copies in encrypted operational backups are permanently overwritten and
              purged within <strong>30 calendar days</strong> as backup snapshots rotate out, unless
              European Union or French law requires storage of specific records. Upon written
              request, FerrisTrace confirms completion of deletion by email.
            </>,
          ]}
        />
      </>
    ),
  },
  {
    id: 'dpa-audits-and-law',
    title: 'Audits, Demonstration of Compliance & Governing Law (Art. 28(3)(h) GDPR)',
    content: (
      <>
        <p>
          <strong>Transparency &amp; documentation:</strong> Because FerrisTrace is open-source (
          <InlineLink href={links.github}>github.com/Ferristrace/ferristrace</InlineLink>), the
          Customer can inspect the exact ingestion, storage, tenant-isolation, and authentication
          code running on FerrisTrace Cloud at any time. Upon written request, FerrisTrace also makes
          available information necessary to demonstrate compliance with Article 28 GDPR.
        </p>
        <p>
          <strong>Audit rights:</strong> Where the documentation above is insufficient to satisfy a
          mandatory regulatory requirement of the Customer, the Customer (or an independent auditor
          mandated by the Customer who is not a competitor of FerrisTrace and is bound by
          confidentiality) may conduct a remote or on-document audit of FerrisTrace&apos;s data
          protection controls at most once per 12-month period (or following a confirmed personal
          data breach affecting the Customer&apos;s workspace), subject to at least{' '}
          <strong>30 calendar days&apos; prior written notice</strong>, conducted during normal
          business hours at the Customer&apos;s expense, and without compromising the security or
          confidentiality of other tenants.
        </p>
        <p>
          <strong>Governing law:</strong> This DPA is governed by <strong>French law</strong> and
          follows the dispute resolution and liability provisions of the{' '}
          <InlineLink href={links.termsOfSale}>Terms of Sale (CGV)</InlineLink>.
        </p>
      </>
    ),
  },
]

/* ========================================================================== */
/* EXPORTED PAGES                                                             */
/* ========================================================================== */

export function TermsPage() {
  return (
    <LegalLayout
      active="terms"
      eyebrow="Legal · Terms of Use (CGU)"
      title="Terms of Use & Legal Notice"
      lead="Statutory publisher notice (LCEN) and rules governing access to ferristrace.dev, docs.ferristrace.dev, and FerrisTrace Cloud workspaces."
      sections={termsSections}
    />
  )
}

export function TermsOfSalePage() {
  return (
    <LegalLayout
      active="terms-of-sale"
      eyebrow="Legal · Terms of Sale (CGV)"
      title="Terms of Sale"
      lead="Commercial terms governing FerrisTrace Cloud plans (Free, Pro, and Enterprise), ingestion quotas, overage caps, Stripe billing, and statutory consumer protections."
      sections={saleSections}
    />
  )
}

export function PrivacyPage() {
  return (
    <LegalLayout
      active="privacy"
      eyebrow="Legal · Privacy & GDPR (RGPD)"
      title="Privacy Policy"
      lead="How FerrisTrace collects, secures, and retains account data and Cloud observability telemetry in the European Union under the GDPR and French law."
      sections={privacySections}
    />
  )
}

export function DpaPage() {
  return (
    <LegalLayout
      active="dpa"
      eyebrow="Legal · GDPR Art. 28 (DPA)"
      title="Data Processing Agreement"
      lead="Article 28 GDPR Data Processing Agreement (Accord de sous-traitance) governing observability telemetry ingested into FerrisTrace Cloud workspaces in the European Union."
      sections={dpaSections}
    />
  )
}
