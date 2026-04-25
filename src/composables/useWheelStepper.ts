import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

export function useWheelStepper(
  el: Ref<HTMLElement | null>,
  opts: {
    onStep: (dir: 1 | -1) => void
    lockMs?: number
    preventPageScroll?: boolean
  },
) {
  const locked = ref(false)
  let t = 0
  const lockMs = opts.lockMs ?? 650

  function lock() {
    locked.value = true
    if (t) window.clearTimeout(t)
    t = window.setTimeout(() => {
      locked.value = false
      t = 0
    }, lockMs)
  }

  function onWheel(e: WheelEvent) {
    if (locked.value) return
    const dy = e.deltaY
    if (Math.abs(dy) < 8) return
    if (opts.preventPageScroll) e.preventDefault()
    lock()
    opts.onStep(dy > 0 ? 1 : -1)
  }

  onMounted(() => {
    if (!el.value) return
    el.value.addEventListener('wheel', onWheel, { passive: !opts.preventPageScroll })
  })

  onBeforeUnmount(() => {
    if (!el.value) return
    el.value.removeEventListener('wheel', onWheel as any)
    if (t) window.clearTimeout(t)
  })

  return { locked }
}

