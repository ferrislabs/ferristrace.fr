import { Band, Column } from './frame'
import { H2, H3, Intro, LinkButton } from './ui'
import { links } from './links'

/**
 * Every destination here is a page the docs actually publish. Only the
 * self-host quickstart exists today, so all three point at it rather than at
 * two addresses that would answer 404.
 */
const targets = [
  {
    name: 'Docker',
    description: 'One container, one volume. Fine for a team and a few services.',
    keyword: 'docker run',
    action: 'Quickstart',
    href: links.quickstart,
  },
  {
    name: 'Docker Compose',
    description: 'FerrisTrace and an OpenTelemetry Collector side by side.',
    keyword: 'compose.yaml',
    action: 'Example file',
    href: links.quickstart,
  },
  {
    name: 'Kubernetes',
    description: 'Helm chart with persistent storage and the Collector as a DaemonSet.',
    keyword: 'helm install',
    action: 'Helm guide',
    href: links.quickstart,
  },
]

export function Where() {
  return (
    <Band labelledBy="where-title">
      <Column className="py-[88px]">
        <H2 id="where-title">Where it runs</H2>
        <Intro className="mt-5">
          Free and open source. No account, no licence key, no data leaving your network.
        </Intro>

        <div className="mt-7">
          {targets.map(({ name, description, keyword, action, href }) => (
            <div
              key={name}
              className="grid items-center gap-2 border-t border-border py-5 last:border-b md:grid-cols-[200px_1fr_200px_170px] md:gap-5"
            >
              <H3>{name}</H3>
              <p className="text-sm text-muted-foreground">{description}</p>
              <p className="font-mono text-sm text-faint-foreground">{keyword}</p>
              {/* Each action is a docs page. While they are unpublished the
                  row keeps its name, its description and its command. */}
              {href ? (
                <LinkButton variant="outline" href={href} className="w-full">
                  {action}
                </LinkButton>
              ) : null}
            </div>
          ))}
        </div>

        {/* No sizing line until it is measured: a reader dimensions a machine
            on whatever number sits here. */}
        <p className="mt-6 text-sm text-faint-foreground">
          Retention is yours to set, in days.
        </p>
      </Column>
    </Band>
  )
}
