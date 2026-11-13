import { Alert, AlertDescription, cn } from '@cometrace/ui'
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

const pixelTag =
  'inline-flex items-center gap-1.5 border px-2 py-1 font-pixel text-[10px] uppercase tracking-[0.08em] [&>svg]:size-3'

/** Every tag pairs an icon with the word, so the type never rests on colour. */
const GROUP_STYLES: Record<GroupType, GroupStyle> = {
  Added: { Icon: Plus, className: 'border-success-text/35 text-success-text' },
  Changed: { Icon: ArrowRight, className: 'border-border bg-card text-foreground' },
  Deprecated: { Icon: Clock, className: 'border-border text-muted-foreground' },
  Removed: { Icon: Minus, className: 'border-border text-muted-foreground' },
  Fixed: { Icon: Check, className: 'border-border text-muted-foreground' },
  Security: {
    Icon: ShieldAlert,
    className:
      'border-severity-error-border bg-severity-error-background text-severity-error-foreground',
  },
}

const ghostLink =
  'inline-flex items-center border border-border bg-card px-3 py-2 text-[13px] font-semibold transition-colors hover:bg-foreground/[0.04]'

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
      className="grid scroll-mt-24 md:grid-cols-[220px_1fr]"
    >
      <div className="flex flex-col items-start gap-3 border-b border-border px-5 py-6 sm:px-8 md:border-b-0 md:border-r md:py-10">
        <a
          href={`#${anchor}`}
          className="font-pixel text-[15px] uppercase tracking-[0.06em] text-foreground"
        >
          {tag}
        </a>
        <time
          dateTime={release.date}
          className="font-pixel text-[10px] uppercase tracking-[0.08em] text-muted-foreground"
        >
          {formatReleaseDate(release.date)}
        </time>
        <div className="flex flex-wrap items-center gap-2">
          {isLatest ? (
            <span className="bg-primary px-2 py-1 font-pixel text-[10px] uppercase tracking-[0.08em] text-primary-foreground">
              Latest
            </span>
          ) : null}
          <span className={cn(pixelTag, 'border-success-text/35 text-success-text')}>
            <Check aria-hidden="true" />
            Live on Cloud
          </span>
        </div>
      </div>

      <div className="min-w-0 px-5 py-8 sm:px-8 md:py-10">
        <h2 id={titleId} className="text-2xl font-medium leading-[1.2] tracking-[-0.02em]">
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
                <span className={cn(pixelTag, className)}>
                  <Icon aria-hidden="true" />
                  {group.type}
                </span>
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
            lines={[`docker pull ${links.image}:${release.version}`]}
          />
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`${links.repo}/releases/tag/${tag}`}
              target="_blank"
              rel="noreferrer noopener"
              className={ghostLink}
            >
              Release notes on GitHub
            </a>
            {previousVersion ? (
              <a
                href={`${links.repo}/compare/v${previousVersion}...${tag}`}
                target="_blank"
                rel="noreferrer noopener"
                className={ghostLink}
              >
                Compare v{previousVersion}&hellip;{tag}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  )
}
