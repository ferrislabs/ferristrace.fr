import { MessageCircle } from 'lucide-react'
import { GithubMark } from './github-mark'
import { Band, Column } from './frame'
import { H3, LinkButton } from './ui'
import { links, REPO_SLUG } from './links'

/**
 * Counts read from the GitHub API at build time. Any of them missing shows
 * the placeholder it replaces, never a spinner and never a made-up number.
 */
export interface RepoStats {
  stars?: number
  contributors?: number
  commitsLastMonth?: number
  version?: string
  /** Contributor avatar URLs, newest first. Up to eight are drawn. */
  avatars?: string[]
}

const count = (value?: number) => (value === undefined ? '[N]' : value.toLocaleString('en'))

/**
 * The repository's own numbers live here rather than in the hero. Beside an
 * invitation to contribute they are context; above the fold they would be a
 * popularity claim the project cannot make yet.
 */
export function Community({ stats = {} }: { stats?: RepoStats }) {
  const cells = [
    { value: count(stats.stars), label: 'stars' },
    { value: count(stats.contributors), label: 'contributors' },
    { value: count(stats.commitsLastMonth), label: 'commits last month' },
  ]

  const avatars = (stats.avatars ?? []).slice(0, 8)
  const slots = Array.from({ length: 8 }, (_, i) => avatars[i])

  return (
    <Band id="community" labelledBy="community-title">
      <Column className="py-[72px]">
        <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
          <div>
            <H3 id="community-title" className="text-[28px] leading-[34px]">
              Questions, bugs, ideas?
            </H3>
            <p className="mt-2 text-muted-foreground">
              Ask on Discord, file an issue on GitHub. The roadmap is public in both.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* No server stood up yet: the placeholder stays visible rather
                than shipping a link that goes nowhere. */}
            {links.discord ? (
              <LinkButton href={links.discord} target="_blank" rel="noreferrer noopener">
                <MessageCircle />
                Join the Discord
              </LinkButton>
            ) : (
              <span className="inline-flex h-11 items-center gap-2 rounded-[2px] border border-dashed border-border px-[18px] font-mono text-[13.5px] text-faint-foreground">
                <MessageCircle className="size-4" aria-hidden="true" />
                [DISCORD_URL]
              </span>
            )}

            <LinkButton
              variant="outline"
              href={links.newIssue}
              target="_blank"
              rel="noreferrer noopener"
            >
              <GithubMark />
              Open an issue
            </LinkButton>
          </div>
        </div>

        <div className="mt-10 rounded-[2px] border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border px-[18px] py-3.5">
            <GithubMark />
            <a
              href={links.github}
              target="_blank"
              rel="noreferrer noopener"
              className="text-sm font-semibold hover:underline"
            >
              {REPO_SLUG}
            </a>
            <span className="ml-auto rounded-[2px] border border-border px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
              {stats.version ? `v${stats.version}` : 'v[X.Y.Z]'}
            </span>
          </div>

          <dl className="grid grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {cells.map(({ value, label }) => (
              <div key={label} className="px-[18px] py-3.5">
                <dd className="font-mono text-[22px] font-semibold leading-none">{value}</dd>
                <dt className="mt-1.5 text-sm text-faint-foreground">{label}</dt>
              </div>
            ))}
          </dl>

          <div className="flex flex-wrap items-center gap-3 border-t border-border px-[18px] py-3">
            <ul className="flex" aria-label="Recent contributors">
              {slots.map((src, index) => (
                <li key={index} className={index === 0 ? '' : '-ml-1.5'}>
                  {src ? (
                    <img
                      src={src}
                      alt=""
                      width={22}
                      height={22}
                      loading="lazy"
                      className="size-[22px] rounded-full ring-2 ring-card"
                    />
                  ) : (
                    <span className="block size-[22px] rounded-full bg-muted ring-2 ring-card" />
                  )}
                </li>
              ))}
            </ul>
            <p className="text-sm text-faint-foreground">
              Built in the open. Issues and pull requests welcome.
            </p>
          </div>
        </div>
      </Column>
    </Band>
  )
}
