import { products, solutions } from './catalog'
import { FerrisMark } from './ferris-mark'
import { Container } from './shared'
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
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Status', href: links.status },
      { label: 'Security', href: links.security },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="overflow-hidden border-t border-border pb-8 pt-14">
      <Container>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-faint-foreground">
                {column.title}
              </h2>
              <ul className="mt-2 text-sm">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="inline-block rounded-sm py-1.5 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* The copyright carries the name, so the mark goes without the wordmark. */}
        <p className="mt-12 flex items-center gap-2.5 border-t border-border pt-6 text-sm text-muted-foreground">
          <FerrisMark className="size-5 shrink-0" />
          <span>© {new Date().getFullYear()} FerrisTrace · Apache 2.0</span>
        </p>

        <FooterWordmark />
      </Container>
    </footer>
  )
}
