import {
  Bot,
  Eye,
  FileCode2,
  GlobeLock,
  KeyRound,
  Layers,
  ListChecks,
  Lock,
  Server,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react'
import { links } from '../landing/links'
import { CheckList, Frame, Kicker, SectionTitle } from '../landing/shared'
import { key as keySprite } from '../pixel/sprites'
import { Capabilities, CtaBand, PageHero, PageShell } from './blocks'
import { Perimeter } from './diagrams/perimeter'

const cloudGuarantees = [
  '100% European Union hosting in France (Scaleway SAS, Paris / Île-de-France)',
  'GDPR Article 28 Data Processing Agreement (DPA) included automatically',
  'Automatic ClickHouse TTL expiration (7 days on Free, 30 days on Pro, custom on Enterprise)',
  'Zero telemetry or LLM spans ever used to train machine-learning models',
  'Full portable tar.gz Organisation export at any time — zero vendor lock-in',
]

const selfHostGuarantees = [
  'Apache 2.0 open-source code auditable line by line on GitHub',
  'Runs inside your own Kubernetes cluster (OCI Helm chart) or VPC (Docker Compose)',
  'Zero outbound telemetry, zero license check, and zero phone-home traffic',
  'Connect your own FerrisKey instance or corporate OIDC identity provider',
  'Your own S3-compatible cold storage and retention rules',
]

const disclosureRules = [
  'Email your report to contact@ferrislabs.fr or open a GitHub Private Security Advisory on github.com/ferrislabs/ferristrace/security/advisories/new',
  'Include affected component/version, reproduction steps or proof-of-concept, and impact assessment',
  'We acknowledge receipt within 24 hours and provide a triage assessment and fix timeline within 72 hours',
  'Please allow us reasonable time to release a patch before public disclosure, and avoid testing against other customers’ Cloud workspaces',
]

export function SecurityPage() {
  return (
    <PageShell>
      <PageHero
        sprite={keySprite}
        eyebrow="Security & Trust"
        title="Security built into the binary,"
        accent="not bolted on later."
        lead="FerrisTrace is written in memory-safe Rust, authenticates humans and AI agents over OpenID Connect through FerrisKey, isolates every Organisation workspace, and runs either in our EU data centres in France or inside your own perimeter."
      >
        <Perimeter />
        <p className="mt-4 text-center text-sm text-faint-foreground">
          Toggle between a typical SaaS and FerrisTrace self-hosted, and click each security review
          question on the right.
        </p>
      </PageHero>

      <Capabilities
        title="Defence in depth across the stack."
        items={[
          {
            Icon: KeyRound,
            title: 'Passwordless OIDC & PKCE',
            body: 'Human authentication uses OpenID Connect Authorization Code + PKCE via FerrisKey or your identity provider. FerrisTrace never stores user passwords.',
          },
          {
            Icon: Bot,
            title: 'Scoped AI agents & MCP gateway',
            body: 'AI agents never hold root API tokens. Each agent gets a short-lived, audience-bound FerrisKey token restricted to explicit scopes and enforced by the MCP policy gateway.',
          },
          {
            Icon: ShieldCheck,
            title: 'Memory-safe Rust & hardened containers',
            body: 'Services are compiled in Rust, eliminating memory-corruption bugs, and run in minimal non-root containers with read-only root filesystems and signed images.',
          },
          {
            Icon: Lock,
            title: 'Encryption in transit & at rest',
            body: 'Every web, OIDC, HTTP API, OTLP gRPC/HTTP ingestion, and MCP endpoint enforces TLS 1.2/1.3. Databases, object storage, and backups are encrypted at rest.',
          },
          {
            Icon: Layers,
            title: 'Strict tenant isolation & hashed keys',
            body: 'Every PostgreSQL and ClickHouse query is scoped to the authenticated Organisation ID. Ingest keys and API tokens are stored exclusively as cryptographic hashes.',
          },
          {
            Icon: ListChecks,
            title: 'Immutable Organisation audit log',
            body: 'Key issuance, token revocation, role changes (owner, admin, member), incident mutations, and every AI agent read or comment land in an immutable audit trail.',
          },
        ]}
      />

      <Frame labelledBy="residency-title" innerClassName="overflow-hidden">
        <div className="border-b border-border px-5 py-20 sm:px-8 sm:py-28">
          <SectionTitle
            id="residency-title"
            kicker="Data residency & sovereignty"
            title="Hosted in France on Cloud, or air-gapped on your servers."
            description="Both editions run the exact same open-source codebase and security controls."
          />
        </div>

        <div className="-mr-px grid grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col border-b border-r border-border bg-surface-tint px-6 py-10 sm:px-8 sm:py-12">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center border border-border bg-primary/10">
                  <GlobeLock className="size-4 text-accent-text" aria-hidden="true" />
                </span>
                <h3 className="text-xl font-medium tracking-[-0.01em]">FerrisTrace Cloud (EU)</h3>
              </div>
              <span className="font-pixel text-[10px] uppercase tracking-[0.08em] text-accent-text">
                France · GDPR
              </span>
            </div>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Managed by FerrisLabs in the European Union with strict GDPR processor commitments and
              zero non-EEA telemetry transfers.
            </p>
            <div className="my-7 border-t border-border" />
            <CheckList items={cloudGuarantees} />
            <div className="mt-auto flex flex-wrap gap-3 pt-8">
              <a
                href={links.dpa}
                className="inline-flex items-center gap-2 border border-border bg-card px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-foreground/[0.04]"
              >
                Read the GDPR DPA
                <span aria-hidden="true">→</span>
              </a>
              <a
                href={links.privacy}
                className="inline-flex items-center gap-2 border border-border bg-card px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-foreground/[0.04]"
              >
                Privacy Policy
              </a>
            </div>
          </div>

          <div className="flex flex-col border-b border-r border-border px-6 py-10 sm:px-8 sm:py-12">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center border border-border bg-primary/10">
                  <Server className="size-4 text-accent-text" aria-hidden="true" />
                </span>
                <h3 className="text-xl font-medium tracking-[-0.01em]">Self-Hosted Edition</h3>
              </div>
              <span className="border border-border px-2 py-1 font-pixel text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                Apache 2.0
              </span>
            </div>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Deploy inside your own network boundary. No telemetry, credentials, or usage ping ever
              leaves your infrastructure.
            </p>
            <div className="my-7 border-t border-border" />
            <CheckList items={selfHostGuarantees} />
            <div className="mt-auto flex flex-wrap gap-3 pt-8">
              <a
                href={links.selfHostGuide}
                className="inline-flex items-center gap-2 border border-border bg-card px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-foreground/[0.04]"
              >
                Self-host guide
                <span aria-hidden="true">→</span>
              </a>
              <a
                href={links.github}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 border border-border bg-card px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-foreground/[0.04]"
              >
                Inspect source on GitHub
              </a>
            </div>
          </div>
        </div>
      </Frame>

      <Frame labelledBy="disclosure-title" innerClassName="overflow-hidden">
        <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="border-b border-border px-5 py-12 sm:px-8 sm:py-16 lg:border-b-0 lg:border-r">
            <Kicker>Vulnerability disclosure</Kicker>
            <h2
              id="disclosure-title"
              className="mt-3 text-balance text-2xl font-medium tracking-[-0.02em] sm:text-3xl"
            >
              Found a security issue? Tell us first.
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              We welcome coordinated vulnerability reports from security researchers and users. Good-faith
              research conducted in accordance with this policy is authorised and will never result
              in legal action from FerrisLabs.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="mailto:contact@ferrislabs.fr?subject=Security%20Vulnerability%20Report%20-%20FerrisTrace"
                className="inline-flex items-center gap-2 bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                <ShieldAlert className="size-4" aria-hidden="true" />
                Report via email
              </a>
              <a
                href={`${links.github}/security/advisories/new`}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 border border-border bg-card px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-foreground/[0.04]"
              >
                <Eye className="size-4" aria-hidden="true" />
                GitHub Security Advisory
              </a>
              <a
                href="/.well-known/security.txt"
                className="inline-flex items-center gap-2 border border-border bg-card px-4 py-2.5 font-mono text-xs font-medium text-muted-foreground transition-colors hover:bg-foreground/[0.04] hover:text-foreground"
              >
                <FileCode2 className="size-3.5" aria-hidden="true" />
                /.well-known/security.txt
              </a>
            </div>
          </div>

          <div className="px-5 py-12 sm:px-8 sm:py-16">
            <p className="font-pixel text-[10px] uppercase tracking-[0.08em] text-accent-text">
              Coordinated disclosure process (RFC 9116)
            </p>
            <div className="mt-6">
              <CheckList items={disclosureRules} />
            </div>
          </div>
        </div>
      </Frame>

      <CtaBand
        title="Inspect the code, or run it in your own perimeter."
        body="Every line of FerrisTrace is open source under Apache 2.0 on GitHub, or ready in one minute on FerrisTrace Cloud."
      />
    </PageShell>
  )
}
