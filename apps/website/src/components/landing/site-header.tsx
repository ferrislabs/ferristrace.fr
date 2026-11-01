import { useEffect, useState } from 'react'
import { Button, cn } from '@cometrace/ui'
import { Menu, X } from 'lucide-react'
import { products, solutionsBySize, solutionsByTeam } from './catalog'
import { FerrisMark } from './ferris-mark'
import { GithubMark } from './github-mark'
import { NavMenu, NavMenuGroup } from './nav-menu'
import { ThemeRow, ThemeToggle } from './theme-toggle'
import { Container, StartOnCloudButton } from './shared'
import { links } from './links'

export type HeaderSection = 'products' | 'solutions' | 'docs' | 'pricing' | 'changelog'

interface SiteHeaderProps {
  /** Section of the page being shown, so its nav entry reads as current. */
  current?: HeaderSection
}

const plainLinks: Array<{ section: HeaderSection; label: string; href: string }> = [
  { section: 'docs', label: 'Docs', href: links.docs },
  { section: 'pricing', label: 'Pricing', href: links.pricing },
]

export function SiteHeader({ current }: SiteHeaderProps = {}) {
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMobileOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <Container className="flex h-16 items-center gap-6">
        <a
          href="/"
          className="flex items-center gap-2 rounded-md text-[15px] font-bold tracking-[-0.01em]"
        >
          <FerrisMark className="size-7" />
          FerrisTrace
        </a>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            <NavMenu label="Products" active={current === 'products'} className="w-[640px]">
              <div className="grid grid-cols-2 gap-x-1">
                <NavMenuGroup entries={products.slice(0, 3)} />
                <NavMenuGroup entries={products.slice(3)} />
              </div>
            </NavMenu>
            <NavMenu label="Solutions" active={current === 'solutions'} className="w-[600px]">
              <div className="grid grid-cols-2 gap-x-1">
                <NavMenuGroup title="By company" entries={solutionsBySize} />
                <NavMenuGroup title="By team" entries={solutionsByTeam} />
              </div>
            </NavMenu>
            {plainLinks.map((link) => {
              const isCurrent = link.section === current
              return (
                <li key={link.label}>
                  <a
                    href={link.href}
                    aria-current={isCurrent ? 'page' : undefined}
                    className={cn(
                      'rounded-md px-2.5 py-1.5 text-sm transition-colors',
                      isCurrent
                        ? 'font-semibold text-foreground'
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
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? 'Close the menu' : 'Open the menu'}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </Button>
        </div>
      </Container>

      {mobileOpen ? (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-border bg-background md:hidden"
        >
          <Container className="space-y-4 py-4">
            <NavMenuGroup title="Products" entries={products} />
            <NavMenuGroup title="Solutions" entries={[...solutionsBySize, ...solutionsByTeam]} />
            <ul className="border-t border-border pt-3">
              {[...plainLinks, { section: 'changelog' as const, label: 'Changelog', href: links.changelog }].map(
                (link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="block rounded-md px-3 py-2 text-sm font-semibold hover:bg-accent"
                    >
                      {link.label}
                    </a>
                  </li>
                ),
              )}
              <li className="sm:hidden">
                <ThemeRow />
              </li>
            </ul>
          </Container>
        </nav>
      ) : null}
    </header>
  )
}
