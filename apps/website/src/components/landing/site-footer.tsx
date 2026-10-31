import { BrandMark } from './brand-mark'
import { Band, Column } from './frame'
import { links } from './links'

const footerLinks = [
  { label: 'Docs', href: links.docs },
  { label: 'Changelog', href: links.changelog },
  { label: 'Security', href: links.security },
  { label: 'GitHub', href: links.github },
]

export function SiteFooter() {
  return (
    <Band className="border-t border-border">
      <Column className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-6 text-[13.5px]">
        <p className="flex flex-wrap items-center gap-2">
          <BrandMark className="size-4 shrink-0" />
          <span className="font-bold">Ferristrace</span>
          <span className="text-faint-foreground">
            Apache 2.0 · © {new Date().getFullYear()} Ferrislabs
          </span>
        </p>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center gap-x-[22px] gap-y-2 text-muted-foreground">
            {footerLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="transition-colors hover:text-foreground">
                  {link.label}
                </a>
              </li>
            ))}
            {links.discord ? (
              <li>
                <a href={links.discord} className="transition-colors hover:text-foreground">
                  Discord
                </a>
              </li>
            ) : (
              <li className="font-mono text-faint-foreground">[DISCORD_URL]</li>
            )}
          </ul>
        </nav>
      </Column>
    </Band>
  )
}
