import gsap from 'gsap'

export function getNavOffset(fallback = 92) {
  const header = document.querySelector('header')
  if (!header) return fallback
  const h = Math.round(header.getBoundingClientRect().height)
  return Math.max(64, Math.min(140, h + 10))
}

export function smoothScrollToY(
  targetY: number,
  opts?: { duration?: number; onComplete?: () => void },
) {
  const start = window.scrollY || 0
  const obj = { y: start }
  const duration = opts?.duration ?? 0.95

  return gsap.to(obj, {
    y: targetY,
    duration,
    ease: 'power3.out',
    overwrite: 'auto',
    onUpdate: () => {
      window.scrollTo(0, obj.y)
    },
    onComplete: opts?.onComplete,
  })
}

export function smoothScrollToEl(el: HTMLElement, opts?: { duration?: number; offset?: number }) {
  const rect = el.getBoundingClientRect()
  const offset = opts?.offset ?? getNavOffset(92)
  const y = (window.scrollY || 0) + rect.top - offset
  smoothScrollToY(y, opts)
}

