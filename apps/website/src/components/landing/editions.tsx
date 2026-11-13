import type { ReactNode } from 'react'
import { cn } from '@cometrace/ui'
import { CopyCommand } from './copy-command'
import { CheckList, Frame, SectionTitle } from './shared'
import { IMAGE, links } from './links'

const selfHosted = [
  'A setup token is printed at first boot. There is no default password',
  'Projects, ingest keys and API tokens per workspace',
  'Local accounts, plus OpenID Connect (FerrisKey) when you configure it',
  'Kubernetes manifests (Kustomize + ArgoCD) in deploy/k8s',
  'Retention in days, set by an admin',
]

const cloud = [
  'Same UI and API as self-hosted',
  'Multi-region',
  'Retention up to 90 days',
  'Export your data and move to self-hosted any time',
]

const pixelLabel = 'font-pixel text-[10px] uppercase tracking-[0.08em]'

export function Editions() {
  return (
    <Frame labelledBy="editions-title" innerClassName="overflow-hidden">
      <div className="border-b border-border px-5 py-20 sm:px-8 sm:py-28">
        <SectionTitle
          id="editions-title"
          kicker="Editions"
          title="Run it yourself, or don't."
          description="Cloud runs the same code and the same UI as self-hosted. Switching between them only changes who runs the container."
        />
      </div>

      <div className="-mr-px grid grid-cols-1 md:grid-cols-2">
        <EditionCell
          id="self-host"
          title="Self-hosted"
          aside={
            <span
              className={cn(pixelLabel, 'border border-border px-2 py-1 text-muted-foreground')}
            >
              Apache 2.0
            </span>
          }
          body="One container, one volume. Your data stays on your server."
          items={selfHosted}
          action={
            <div className="space-y-3">
              <CopyCommand
                label="Copy the docker run command"
                lines={[`$ docker run -d -p 8080:8080 -p 4318:4318 -v ferristrace:/data ${IMAGE}`]}
              />
              <a
                href={links.selfHostGuide}
                className="flex w-full items-center justify-center gap-2 border border-border bg-card px-5 py-3 text-sm font-semibold transition-colors hover:bg-foreground/[0.04]"
              >
                Self-host guide
              </a>
            </div>
          }
        />

        <EditionCell
          id="cloud"
          title="Cloud"
          highlighted
          aside={<span className={cn(pixelLabel, 'text-accent-text')}>Free while in beta</span>}
          body="We host the container, keep it updated and handle the backups. You get a workspace and an ingest key."
          items={cloud}
          action={
            <a
              href={links.startOnCloud}
              className="flex w-full items-center justify-center gap-2 bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Start on Cloud
              <span aria-hidden="true">→</span>
            </a>
          }
        />
      </div>
    </Frame>
  )
}

interface EditionCellProps {
  id: string
  title: string
  aside: ReactNode
  body: string
  items: string[]
  action: ReactNode
  highlighted?: boolean
}

function EditionCell({
  id,
  title,
  aside,
  body,
  items,
  action,
  highlighted = false,
}: EditionCellProps) {
  return (
    <div
      id={id}
      className={cn(
        'flex scroll-mt-20 flex-col border-b border-r border-border px-6 py-10 sm:px-8 sm:py-12',
        highlighted && 'bg-surface-tint',
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-xl font-medium tracking-[-0.01em]">{title}</h3>
        {aside}
      </div>

      <p className="mt-4 text-sm leading-7 text-muted-foreground">{body}</p>

      <div className="my-7 border-t border-border" />

      <CheckList items={items} />

      <div className="mt-auto pt-8">{action}</div>
    </div>
  )
}
