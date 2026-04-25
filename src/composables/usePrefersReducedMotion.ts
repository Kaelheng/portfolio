import { onBeforeUnmount, onMounted, ref } from 'vue'

export function usePrefersReducedMotion() {
  const reduced = ref(false)
  let mql: MediaQueryList | null = null

  function sync() {
    reduced.value = !!mql?.matches
  }

  onMounted(() => {
    mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    sync()
    mql.addEventListener?.('change', sync)
  })

  onBeforeUnmount(() => {
    mql?.removeEventListener?.('change', sync)
  })

  return { reduced }
}

