import { Alert, AlertDescription, Badge, Button, cn } from '@cometrace/ui'
import {
  ArrowRight,
  Check,
  Clock,
  Minus,
  Plus,
  ShieldAlert,
  TriangleAlert,
  type LucideIcon,
} from 'lucide-react'
import { formatReleaseDate, releaseAnchor, type GroupType, type Release } from '../../lib/changelog'
import { CopyCommand } from '../landing/copy-command'
import { InlineMarkdown } from './inline-markdown'
import { links } from './links'

interface GroupStyle {
  Icon: LucideIcon
  className: string
}

/** Every badge pairs an icon with the word, so the type never rests on colour. */
const GROUP_STYLES: Record<GroupType, GroupStyle> = {
  Added: { Icon: Plus, className: 'border-success-text/35 bg-transparent text-success-text' },
  Changed: { Icon: ArrowRight, className: 'border-transparent bg-secondary text-foreground' },
  Deprecated: { Icon: Clock, className: '' },
  Removed: { Icon: Minus, className: '' },
  Fixed: { Icon: Check, className: '' },
  Security: {
    Icon: ShieldAlert,
    className:
      'border-severity-error-border bg-severity-error-background text-severity-error-foreground',
  },
}

interface ReleaseArticleProps {
  release: Release
  /** The version directly below this one in the file, for the compare link. */
  previousVersion?: string
  isLatest: boolean
}

export function ReleaseArticle({ release, previousVersion, isLatest }: ReleaseArticleProps) {
  const anchor = releaseAnchor(release.version)
  const titleId = `${anchor}-title`
  const tag = `v${release.version}`

  return (
    <article
      id={anchor}
      aria-labelledby={titleId}
      className="grid scroll-mt-24 gap-6 border-b border-border py-8 md:grid-cols-[200px_1fr] md:gap-10"
    >
      <div className="flex flex-col gap-2">
        <a
          href={`#${anchor}`}
          className="rounded-sm font-mono text-[15px] font-semibold text-foreground"
        >
          {tag}
        </a>
        <time dateTime={release.date} className="text-sm text-muted-foreground">
          {formatReleaseDate(release.date)}
        </time>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          {isLatest ? <Badge>Latest</Badge> : null}
          <Badge variant="outline" className="border-success-text/35 text-success-text">
            <Check aria-hidden="true" />
            Live on Cloud
          </Badge>
        </div>
      </div>

      <div className="min-w-0">
        <h2 id={titleId} className="text-[22px] font-semibold leading-[30px] tracking-[-0.01em]">
          {release.title ?? `Release ${tag}`}
        </h2>

        {release.summary ? (
          <p className="mt-2 text-[15px] leading-6 text-muted-foreground">
            <InlineMarkdown text={release.summary} idPrefix={`${anchor}-summary`} />
          </p>
        ) : null}

        {release.breaking.length > 0 ? (
          <Alert variant="warning" className="mt-5">
            <TriangleAlert aria-hidden="true" />
            <AlertDescription>
              {release.breaking.map((item, index) => (
                <p key={`${anchor}-breaking-${index}`}>
                  <strong className="font-semibold">Breaking:</strong>{' '}
                  <InlineMarkdown text={item} idPrefix={`${anchor}-breaking-${index}`} />
                </p>
              ))}
            </AlertDescription>
          </Alert>
        ) : null}

        <div className="mt-5 flex flex-col gap-5">
          {release.groups.map((group) => {
            const { Icon, className } = GROUP_STYLES[group.type]

            return (
              <div key={`${anchor}-${group.type}`}>
                <Badge variant="outline" className={cn(className)}>
                  <Icon aria-hidden="true" />
                  {group.type}
                </Badge>
                <ul className="mt-2.5 space-y-1.5">
                  {group.items.map((item, index) => (
                    <li
                      key={`${anchor}-${group.type}-${index}`}
                      className="flex gap-2.5 text-[15px] leading-[23px] text-muted-foreground"
                    >
                      <span aria-hidden="true" className="select-none text-faint-foreground">
                        &middot;
                      </span>
                      <span className="min-w-0">
                        <InlineMarkdown text={item} idPrefix={`${anchor}-${group.type}-${index}`} />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <CopyCommand
            className="max-w-[520px]"
            label={`Copy the docker pull command for ${tag}`}
            lines={[`docker pull ${links.image}/cometrace:${release.version}`]}
          />
          <div className="flex flex-wrap items-center gap-1">
            <Button asChild variant="ghost" size="sm" className="px-2 font-semibold">
              <a
                href={`${links.repo}/releases/tag/${tag}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                Release notes on GitHub
              </a>
            </Button>
            {previousVersion ? (
              <Button asChild variant="ghost" size="sm" className="px-2 font-semibold">
                <a
                  href={`${links.repo}/compare/v${previousVersion}...${tag}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Compare v{previousVersion}&hellip;{tag}
                </a>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  )
}
