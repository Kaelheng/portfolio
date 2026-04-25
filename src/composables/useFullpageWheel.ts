import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'
import { getNavOffset, smoothScrollToY } from './useSmoothScrollTo'

export function useFullpageWheel(opts: {
  sectionEls: Ref<HTMLElement[]>
  enabled: Ref<boolean>
  lockMs?: number
  offset?: number
}) {
  const locked = ref(false)
  const activeIndex = ref(0)
  const fallbackOffset = opts.offset ?? 92
  let io: IntersectionObserver | null = null
  let transitioning = false
  let queuedDir = 0
  const dirThreshold = 10

  function consumeQueue() {
    if (!queuedDir) return
    const dir = queuedDir > 0 ? 1 : -1
    queuedDir = queuedDir > 0 ? queuedDir - 1 : queuedDir + 1
    scrollToIndex(activeIndex.value + dir, dir)
  }

  function getSectionY(el: HTMLElement, align: 'top' | 'center' = 'center') {
    const offset = getNavOffset(fallbackOffset)
    const rect = el.getBoundingClientRect()
    const top = (window.scrollY || 0) + rect.top - offset
    if (align === 'top') return top

    const vh = window.innerHeight
    const effectiveVh = Math.max(1, vh - offset)
    const centerAdjust = (rect.height - effectiveVh) / 2
    return top + centerAdjust
  }

  function getTargetY(sectionEl: HTMLElement) {
    const snap = sectionEl?.dataset?.snap ?? 'center'
    const snapTarget = sectionEl?.dataset?.snapTarget
    if (snapTarget) {
      const targetEl = sectionEl.querySelector<HTMLElement>(snapTarget)
      if (targetEl) return getSectionY(targetEl, 'top')
    }
    if (snap === 'top') return getSectionY(sectionEl, 'top')
    return getSectionY(sectionEl, 'center')
  }

  function setupObserver() {
    const els = opts.sectionEls.value
    if (!els.length) return

    io?.disconnect()
    io = new IntersectionObserver(
      (entries) => {
        if (!entries.length) return
        // pick highest intersection ratio
        let bestId = ''
        let bestRatio = 0
        for (const e of entries) {
          if (e.intersectionRatio > bestRatio) {
            bestRatio = e.intersectionRatio
            bestId = (e.target as HTMLElement).id
          }
        }
        if (!bestId) return
        const idx = els.findIndex((s) => s?.id === bestId)
        if (idx >= 0) activeIndex.value = idx
      },
      { threshold: [0.25, 0.4, 0.55, 0.7, 0.85] },
    )
    els.forEach((el) => el && io!.observe(el))
  }

  function scrollToIndex(i: number, dir?: 1 | -1) {
    if (transitioning) {
      queuedDir += dir ?? 0
      queuedDir = Math.max(-2, Math.min(2, queuedDir))
      return
    }

    const els = opts.sectionEls.value
    const clamped = Math.max(0, Math.min(els.length - 1, i))
    const fromEl = els[activeIndex.value]
    const targetEl = els[clamped]!
    const y = getTargetY(targetEl)
    if (!targetEl) return
    if (fromEl === targetEl) return

    transitioning = true
    locked.value = true

    if (fromEl) {
      window.dispatchEvent(
        new CustomEvent('sectionwillchange', {
          detail: {
            from: { index: activeIndex.value, id: fromEl.id },
            to: { index: clamped, id: targetEl.id },
            dir: dir ?? 0,
          },
        }),
      )
    }

    smoothScrollToY(y, {
      duration: 0.86,
      onComplete: () => {
        activeIndex.value = clamped
        window.dispatchEvent(
          new CustomEvent('sectionchange', {
            detail: {
              index: clamped,
              dir: dir ?? 0,
              id: targetEl.id,
              fromId: fromEl?.id ?? '',
            },
          }),
        )
        transitioning = false
        locked.value = false
        consumeQueue()
      },
    })
  }

  function onWheel(e: WheelEvent) {
    if (!opts.enabled.value) return
    if (Math.abs(e.deltaY) < dirThreshold) return
    e.preventDefault()
    const dir = e.deltaY > 0 ? 1 : -1
    if (transitioning) {
      queuedDir += dir
      queuedDir = Math.max(-2, Math.min(2, queuedDir))
      return
    }
    scrollToIndex(activeIndex.value + dir, dir)
  }

  onMounted(() => {
    window.addEventListener('wheel', onWheel, { passive: false })
    setupObserver()
  })

  onBeforeUnmount(() => {
    window.removeEventListener('wheel', onWheel as any)
    io?.disconnect()
    io = null
  })

  return { locked, activeIndex, scrollToIndex }
}

