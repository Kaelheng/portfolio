<template>
  <div class="pointer-events-none fixed left-0 top-0 z-50 h-[2px] w-full">
    <div
      class="h-full origin-left bg-[linear-gradient(90deg,var(--coffee),var(--coffee-2))] opacity-80 transition-[opacity] duration-500"
      :style="{ transform: `scaleX(${progress})` }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const y = ref(0)
const max = ref(1)

const progress = computed(() => {
  const p = max.value <= 0 ? 0 : y.value / max.value
  return Math.min(1, Math.max(0, p))
})

function refresh() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop || 0
  const doc = document.documentElement
  const scrollMax = Math.max(1, doc.scrollHeight - doc.clientHeight)
  y.value = scrollTop
  max.value = scrollMax
}

onMounted(() => {
  refresh()
  window.addEventListener('scroll', refresh, { passive: true })
  window.addEventListener('resize', refresh)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', refresh)
  window.removeEventListener('resize', refresh)
})
</script>

