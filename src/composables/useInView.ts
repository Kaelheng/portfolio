import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

export function useInView<T extends Element>(target: Ref<T | null>, opts?: { threshold?: number }) {
  const ratio = ref(0)
  let io: IntersectionObserver | null = null

  onMounted(() => {
    if (!target.value) return
    io = new IntersectionObserver(
      (entries) => {
        ratio.value = entries[0]?.intersectionRatio ?? 0
      },
      { threshold: [0, 0.1, 0.2, 0.3, 0.5, 0.7, 1], ...(opts ?? {}) },
    )
    io.observe(target.value)
  })

  onBeforeUnmount(() => {
    io?.disconnect()
    io = null
  })

  return { ratio }
}

