<template>
  <div ref="root" class="relative h-full w-full">
    <div
      v-if="loading"
      class="absolute inset-0 animate-pulse bg-[color-mix(in_srbg,var(--coffee)_8%,transparent)]"
    />
    <video
      ref="video"
      class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
      playsinline
      preload="metadata"
      :src="src"
      @loadeddata="loading = false"
    />
    <div
      v-if="needsUserGestureForSound"
      class="pointer-events-none absolute inset-0 grid place-items-center"
    >
      <div
        class="rounded-full border border-white/25 bg-black/35 px-4 py-2 text-[11px] font-semibold tracking-wide text-white/90 backdrop-blur-sm"
      >
        点开查看详情
      </div>
    </div>
    <div
      class="absolute inset-0 bg-[color-mix(in_srbg,black_14%,transparent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useInView } from '../composables/useInView'
import { usePrefersReducedMotion } from '../composables/usePrefersReducedMotion'

const props = defineProps<{ src: string }>()

const { reduced } = usePrefersReducedMotion()
const root = ref<HTMLDivElement | null>(null)
const video = ref<HTMLVideoElement | null>(null)
const loading = ref(true)
const needsUserGestureForSound = ref(false)

const { ratio } = useInView(root, { threshold: 0.3 })
const shouldPlay = computed(() => ratio.value >= 0.3 && !reduced.value)

async function play() {
  const el = video.value
  if (!el) return
  try {
    el.muted = false
    await el.play()
    needsUserGestureForSound.value = false
  } catch {
    try {
      el.muted = true
      await el.play()
      needsUserGestureForSound.value = true
    } catch {
    }
  }
}

function enableSound() {
  const el = video.value
  if (!el) return
  el.muted = false
  el.volume = 1
  void el.play().then(() => {
    needsUserGestureForSound.value = false
  })
}

function pause() {
  const el = video.value
  if (!el) return
  el.pause()
}

watch(shouldPlay, (sp) => {
  if (sp) play()
  else pause()
})

onMounted(() => {
  if (!video.value) return
  video.value.muted = false
  video.value.volume = 1
  const onFirstUserGesture = () => {
    if (!needsUserGestureForSound.value) return
    enableSound()
  }
  window.addEventListener('pointerdown', onFirstUserGesture, { passive: true })
  window.addEventListener('keydown', onFirstUserGesture)
  onBeforeUnmount(() => {
    window.removeEventListener('pointerdown', onFirstUserGesture as any)
    window.removeEventListener('keydown', onFirstUserGesture as any)
  })
})

onBeforeUnmount(() => pause())
</script>

