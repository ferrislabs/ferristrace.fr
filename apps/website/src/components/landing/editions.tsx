import type { ReactNode } from 'react'
import { Badge, Button, Card, Separator, cn } from '@cometrace/ui'
import { CopyCommand } from './copy-command'
import { CheckList, Container, SectionTitle, StartOnCloudButton } from './shared'
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

export function Editions() {
  return (
    <section
      aria-labelledby="editions-title"
      className="border-t border-border bg-section-alt py-20"
    >
      <Container>
        <SectionTitle
          id="editions-title"
          title="Run it yourself, or don't."
          description="Cloud runs the same code and the same UI as self-hosted. Switching between them only changes who runs the container."
        />

        <div className="mt-10 grid grid-cols-1 items-stretch gap-4 md:grid-cols-2">
          <EditionCard
            id="self-host"
            title="Self-hosted"
            aside={<Badge variant="outline">Apache 2.0</Badge>}
            body="One container, one volume. Your data stays on your server."
            items={selfHosted}
            action={
              <div className="space-y-3">
                <CopyCommand
                  label="Copy the docker run command"
                  lines={[`$ docker run -d -p 8080:8080 -p 4318:4318 -v ferristrace:/data ${IMAGE}`]}
                />
                <Button asChild variant="outline" className="w-full font-semibold">
                  <a href={links.selfHostGuide}>Self-host guide</a>
                </Button>
              </div>
            }
          />

          <EditionCard
            id="cloud"
            title="Cloud"
            highlighted
            aside={<span className="text-sm font-semibold text-foreground">Free while in beta</span>}
            body="We host the container, keep it updated and handle the backups. You get a workspace and an ingest key."
            items={cloud}
            action={<StartOnCloudButton className="w-full" />}
          />
        </div>
      </Container>
    </section>
  )
}

interface EditionCardProps {
  id: string
  title: string
  aside: ReactNode
  body: string
  items: string[]
  action: ReactNode
  highlighted?: boolean
}

function EditionCard({
  id,
  title,
  aside,
  body,
  items,
  action,
  highlighted = false,
}: EditionCardProps) {
  return (
    <Card
      id={id}
      className={cn(
        'flex scroll-mt-20 flex-col p-5',
        highlighted && 'border-primary ring-1 ring-primary',
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-[15px] font-semibold">{title}</h3>
        {aside}
      </div>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>

      <Separator className="my-5" />

      <CheckList items={items} />

      <div className="mt-auto pt-6">{action}</div>
    </Card>
  )
}
