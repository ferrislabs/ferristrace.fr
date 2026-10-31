import { BrandMark } from './brand-mark'
import { GithubMark } from './github-mark'
import { Column } from './frame'
import { LinkButton } from './ui'
import { ThemeToggle } from './theme-toggle'
import { links } from './links'

/** The Docs entry drops out of the row entirely while they are unpublished. */
const nav = [
  ...(links.docs ? [{ label: 'Docs', href: links.docs }] : []),
  { label: 'Changelog', href: links.changelog },
  { label: 'Community', href: '#community' },
]

/**
 * `stars` is the repository's star count, read at build time. It stays a
 * visible placeholder when the fetch did not happen, never a spinner.
 */
export function SiteHeader({ stars }: { stars?: number }) {
  return (
    <header className="relative z-20 h-14 border-b border-border">
      {/* The brief puts a marker at each end of this border too. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
        <div className="relative mx-auto h-0 max-w-[1120px]">
          <span className="absolute -left-[5.5px] top-0 hidden size-[11px] -translate-y-1/2 md:block">
            <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-faint-foreground" />
            <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-faint-foreground" />
          </span>
          <span className="absolute -right-[5.5px] top-0 hidden size-[11px] -translate-y-1/2 md:block">
            <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-faint-foreground" />
            <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-faint-foreground" />
          </span>
        </div>
      </div>

      <Column className="flex h-full items-center gap-5">
        <a href="/" className="flex items-center gap-2 text-[16px] font-bold">
          <BrandMark className="size-5" />
          FerrisTrace
        </a>

        <nav aria-label="Site" className="hidden md:block">
          <ul className="flex items-center gap-5">
            {nav.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <a
            href={links.github}
            target="_blank"
            rel="noreferrer noopener"
            className="hidden items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground md:inline-flex"
          >
            <GithubMark />
            GitHub
            <span className="font-mono text-[12px] text-faint-foreground">
              {stars === undefined ? '[N]' : stars.toLocaleString('en')}
            </span>
          </a>

          <ThemeToggle />

          {/* Get started has nowhere to go until the docs are published; the
              GitHub link beside it carries the visitor in the meantime. */}
          {links.docs ? (
            <LinkButton size="sm" href={links.docs}>
              Get started
            </LinkButton>
          ) : null}
        </div>
      </Column>
    </header>
  )
}
