const GITHUB_USER = 'Kaelheng'
const GITHUB_REPO = 'portfolio'
const GITHUB_REF = 'main'

const CDN_BASE = `https://cdn.jsdelivr.net/gh/${GITHUB_USER}/${GITHUB_REPO}@${GITHUB_REF}/`

export function resolveMediaUrl(relativePath: string): string {
  if (import.meta.env.PROD) {
    return `${CDN_BASE}${relativePath}`
  }
  return new URL(`../../${relativePath}`, import.meta.url).href
}

