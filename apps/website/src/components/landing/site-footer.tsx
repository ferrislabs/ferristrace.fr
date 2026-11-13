import { PixelSprite } from '../pixel/pixel-sprite'
import { cometCrab, rustCrab } from '../pixel/sprites'
import { products, solutions } from './catalog'
import { links } from './links'
import { FooterWordmark } from './footer-wordmark'

const columns = [
  { title: 'Products', links: products.map(({ title, href }) => ({ label: title, href })) },
  { title: 'Solutions', links: solutions.map(({ title, href }) => ({ label: title, href })) },
  {
    title: 'Resources',
    links: [
      { label: 'Docs', href: links.docs },
      { label: 'Pricing', href: links.pricing },
      { label: 'Changelog', href: links.changelog },
      { label: 'GitHub', href: links.github },
      { label: 'Status', href: links.status },
      { label: 'Security', href: links.security },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="overflow-hidden">
      <div className="mx-auto max-w-6xl border-x border-border">
        <nav
          aria-label="Footer"
          className="grid border-b border-border md:grid-cols-[1.5fr_1fr_1fr_1fr]"
        >
          <div className="flex flex-col justify-between gap-12 border-b border-border px-5 py-14 sm:px-10 md:border-b-0 md:border-r">
            <div>
              <a href="/" className="flex items-center gap-3 text-lg font-semibold tracking-tight">
                <PixelSprite sprite={cometCrab} className="h-5 w-8" />
                FerrisTrace
              </a>
              <p className="mt-6 max-w-xs text-pretty text-xl font-medium leading-snug tracking-[-0.02em]">
                Open-source observability, incidents and AI agents, written in Rust.
              </p>
            </div>
            <a
              href={links.startOnCloud}
              className="inline-flex w-fit items-center gap-2 bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Start on Cloud
              <span aria-hidden="true">→</span>
            </a>
          </div>
          {columns.map((column) => (
            <div
              key={column.title}
              className="border-b border-border px-5 py-12 last:border-b-0 sm:px-10 md:border-b-0 md:border-r md:last:border-r-0"
            >
              <h2 className="font-pixel text-[11px] font-normal uppercase tracking-[0.08em] text-accent-text">
                {column.title}
              </h2>
              <ul className="mt-6 space-y-0.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="inline-block py-1.5 text-[15px] transition-colors hover:text-accent-text"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <p className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-6 text-xs text-muted-foreground sm:px-10">
          <span>© {new Date().getFullYear()} FerrisTrace · Apache 2.0</span>
          <a
            href="https://ferrislabs.fr"
            className="inline-flex items-center gap-2 font-pixel uppercase transition-colors hover:text-foreground"
          >
            <PixelSprite sprite={rustCrab} className="size-4" />A Ferrislabs project
          </a>
        </p>

        <div className="px-5 sm:px-10">
          <FooterWordmark />
        </div>
      </div>
    </footer>
  )
}
