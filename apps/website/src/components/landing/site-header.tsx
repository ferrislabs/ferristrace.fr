import { useEffect, useState } from 'react'
import { cn } from '@cometrace/ui'
import { Menu, X } from 'lucide-react'
import { PixelSprite } from '../pixel/pixel-sprite'
import { cometCrab } from '../pixel/sprites'
import { products, solutionsBySize, solutionsByTeam } from './catalog'
import { GithubMark } from './github-mark'
import { NavMenu, NavMenuGroup } from './nav-menu'
import { ThemeRow, ThemeToggle } from './theme-toggle'
import { links } from './links'

export type HeaderSection = 'products' | 'solutions' | 'docs' | 'pricing' | 'changelog'

interface SiteHeaderProps {
  /** Section of the page being shown, so its nav entry reads as current. */
  current?: HeaderSection
}

const plainLinks: Array<{ section: HeaderSection; label: string; href: string }> = [
  { section: 'docs', label: 'Docs', href: links.docs },
  { section: 'pricing', label: 'Pricing', href: links.pricing },
  { section: 'changelog', label: 'Changelog', href: links.changelog },
]

/** One cell of the bar: full height, a rule on its right. */
const cell =
  'flex items-center border-r border-border px-4 text-[13px] font-medium transition-colors hover:bg-foreground/[0.04] hover:text-foreground'

export function SiteHeader({ current }: SiteHeaderProps = {}) {
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMobileOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-12 max-w-6xl items-stretch border-x border-border">
        <a
          href="/"
          className="flex shrink-0 items-center gap-2.5 border-r border-border px-4 text-[15px] font-semibold tracking-tight"
        >
          <PixelSprite sprite={cometCrab} className="h-[18px] w-[29px]" />
          FerrisTrace
        </a>

        <nav aria-label="Main" className="hidden md:flex">
          <ul className="flex items-stretch">
            <NavMenu label="Products" active={current === 'products'} className="w-[36rem]">
              <div className="grid grid-cols-2">
                <NavMenuGroup entries={products.slice(0, 3)} className="border-r border-border" />
                <NavMenuGroup entries={products.slice(3)} />
              </div>
            </NavMenu>
            <NavMenu label="Solutions" active={current === 'solutions'} className="w-[34rem]">
              <div className="grid grid-cols-2">
                <NavMenuGroup
                  title="By company"
                  entries={solutionsBySize}
                  className="border-r border-border"
                />
                <NavMenuGroup title="By team" entries={solutionsByTeam} />
              </div>
            </NavMenu>
            {plainLinks.map((link) => {
              const isCurrent = link.section === current
              return (
                <li key={link.label} className="flex">
                  <a
                    href={link.href}
                    aria-current={isCurrent ? 'page' : undefined}
                    className={cn(
                      cell,
                      isCurrent
                        ? 'text-foreground shadow-[inset_0_-2px_0_var(--primary)]'
                        : 'text-muted-foreground',
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-stretch">
          <a
            href={links.github}
            target="_blank"
            rel="noreferrer noopener"
            className="hidden items-center gap-2 border-l border-border px-4 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground lg:flex"
          >
            <GithubMark />
            GitHub
          </a>
          <div className="hidden items-center border-l border-border px-1.5 sm:flex">
            <ThemeToggle />
          </div>
          <a
            href={links.signIn}
            className="hidden items-center border-l border-border px-4 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-foreground/[0.04] hover:text-foreground sm:flex"
          >
            Sign in
          </a>
          <a
            href={links.startOnCloud}
            className="flex items-center bg-primary px-4 text-[13px] font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Start on Cloud
          </a>
          <button
            type="button"
            className="flex w-12 cursor-pointer items-center justify-center border-l border-border md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? 'Close the menu' : 'Open the menu'}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="max-h-[calc(100dvh-3rem)] overflow-y-auto border-t border-border bg-background md:hidden"
        >
          <NavMenuGroup title="Products" entries={products} className="border-b border-border" />
          <NavMenuGroup
            title="Solutions"
            entries={[...solutionsBySize, ...solutionsByTeam]}
            className="border-b border-border"
          />
          <ul>
            {[...plainLinks, { section: 'docs' as const, label: 'GitHub', href: links.github }].map(
              (link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="block border-b border-border px-5 py-3 text-sm font-semibold"
                  >
                    {link.label}
                  </a>
                </li>
              ),
            )}
            <li className="sm:hidden">
              <a
                href={links.signIn}
                className="block border-b border-border px-5 py-3 text-sm font-semibold"
              >
                Sign in
              </a>
            </li>
            <li className="sm:hidden">
              <ThemeRow />
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  )
}
