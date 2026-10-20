import { CometMark } from './comet-mark'
import { Container } from './shared'
import { links } from './links'

const footerLinks = [
  { label: 'Docs', href: links.docs },
  { label: 'GitHub', href: links.github },
  { label: 'Changelog', href: links.changelog },
  { label: 'Status', href: links.status },
  { label: 'Security', href: links.security },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border py-8">
      <Container className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        {/* The copyright carries the name, so the mark goes without the wordmark. */}
        <p className="flex items-center gap-2.5 text-sm text-muted-foreground">
          <CometMark className="size-4 shrink-0" />
          <span>© 2025 Cometrace · Apache 2.0</span>
        </p>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            {footerLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="rounded-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </footer>
  )
}
