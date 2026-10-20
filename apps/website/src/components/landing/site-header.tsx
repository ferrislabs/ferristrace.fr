import { Button, cn } from '@cometrace/ui'
import { CometMark } from './comet-mark'
import { GithubMark } from './github-mark'
import { ThemeToggle } from './theme-toggle'
import { Container, StartOnCloudButton } from './shared'
import { links } from './links'

const navLinks = [
  { label: 'Docs', href: links.docs },
  { label: 'Self-host', href: links.selfHost },
  { label: 'Cloud', href: links.cloud },
  { label: 'Changelog', href: links.changelog },
]

interface SiteHeaderProps {
  /** Label of the nav link for the page being shown, e.g. "Changelog". */
  current?: string
}

export function SiteHeader({ current }: SiteHeaderProps = {}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <Container className="flex h-16 items-center gap-6">
        <a
          href="/"
          className="flex items-center gap-2 rounded-md text-[15px] font-bold tracking-[-0.01em]"
        >
          <CometMark />
          Cometrace
        </a>

        {/* The four links need ~300 px, which only fits from md up. Below sm
            the row keeps the logo and the primary action, nothing else. */}
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isCurrent = link.label === current

              return (
                <li key={link.label}>
                  <a
                    href={link.href}
                    aria-current={isCurrent ? 'page' : undefined}
                    className={cn(
                      'rounded-md px-2.5 py-1.5 text-sm transition-colors',
                      isCurrent
                        ? 'bg-secondary font-semibold text-secondary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle className="hidden sm:inline-flex" />
          <Button asChild variant="ghost" size="sm" className="hidden font-semibold sm:inline-flex">
            <a href={links.github} target="_blank" rel="noreferrer noopener" aria-label="GitHub">
              <GithubMark />
              <span className="hidden lg:inline">GitHub</span>
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="hidden font-semibold sm:inline-flex"
          >
            <a href={links.signIn}>Sign in</a>
          </Button>
          <StartOnCloudButton size="sm" />
        </div>
      </Container>
    </header>
  )
}
