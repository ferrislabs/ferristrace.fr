/**
 * Resolves the shared root domain attribute for a cookie.
 *
 * `ferristrace.dev`   → `domain=.ferristrace.dev`  (shared with docs.ferristrace.dev)
 * `localhost`         → (no domain attribute)
 * `myapp.pages.dev`   → (no domain attribute – public suffix)
 */
const PUBLIC_SUFFIX_HOSTS = ['pages.dev', 'github.io', 'vercel.app', 'netlify.app', 'workers.dev']

function cookieDomainAttr(hostname: string): string {
  const parts = hostname.split('.')
  const isPublicSuffix =
    parts.length < 2 || PUBLIC_SUFFIX_HOSTS.some((s) => hostname.endsWith(s))
  return isPublicSuffix ? '' : `;domain=.${parts.slice(-2).join('.')}`
}

export function setCookie(name: string, value: string, maxAge = 60 * 60 * 24 * 365) {
  const domain = cookieDomainAttr(window.location.hostname)
  if (domain) {
    // Remove any stale no-domain cookie to prevent it taking precedence in document.cookie
    document.cookie = `${name}=;path=/;max-age=0;SameSite=Lax`
  }
  document.cookie = `${name}=${value};path=/${domain};max-age=${maxAge};SameSite=Lax`
}

export function getCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match?.[1]
}
