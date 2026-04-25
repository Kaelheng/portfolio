<template>
  <div v-if="enabled" class="pointer-events-none fixed inset-0 z-[60]">
    <div
      class="absolute left-0 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color-mix(in_srbg,var(--coffee)_18%,transparent)] ring-1 ring-[color-mix(in_srbg,var(--coffee)_30%,transparent)] backdrop-blur"
      :style="dotStyle"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { usePrefersReducedMotion } from '../composables/usePrefersReducedMotion'

const { reduced } = usePrefersReducedMotion()

const enabled = computed(() => {
  const isFinePointer = typeof window !== 'undefined' && window.matchMedia?.('(pointer:fine)').matches
  return isFinePointer && !reduced.value && window.innerWidth >= 768
})

const x = ref(0)
const y = ref(0)
const sx = ref(0)
const sy = ref(0)
let raf = 0
let downT = 0

const dotStyle = computed(() => ({
  transform: `translate(${sx.value}px, ${sy.value}px) translate(-50%, -50%) scale(${downT ? 0.72 : 1})`,
}))

function tick() {
  sx.value += (x.value - sx.value) * 0.16
  sy.value += (y.value - sy.value) * 0.16
  raf = requestAnimationFrame(tick)
}

function onMove(e: PointerEvent) {
  x.value = e.clientX
  y.value = e.clientY
}
function onDown() {
  downT = window.setTimeout(() => {}, 0)
}
function onUp() {
  if (downT) window.clearTimeout(downT)
  downT = 0
}

onMounted(() => {
  if (!enabled.value) return
  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('pointerdown', onDown, { passive: true })
  window.addEventListener('pointerup', onUp, { passive: true })
  raf = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerdown', onDown)
  window.removeEventListener('pointerup', onUp)
  cancelAnimationFrame(raf)
})
</script>

