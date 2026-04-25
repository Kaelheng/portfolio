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
      :preload="shouldPlay ? 'metadata' : 'none'"
      :src="activeSrc"
      @canplay="onCanPlay"
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
const loading = ref(false)
const needsUserGestureForSound = ref(false)
const hasBeenVisible = ref(false)
let soundRetryTimer: number | null = null

const { ratio } = useInView(root, { threshold: 0.3 })
const shouldPlay = computed(() => ratio.value >= 0.3 && !reduced.value)
const shouldLoad = computed(() => ratio.value >= 0.08 || hasBeenVisible.value)
const activeSrc = computed(() => (shouldLoad.value ? props.src : undefined))

async function play() {
  const el = video.value
  if (!el || !activeSrc.value) return
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

function clearSoundRetry() {
  if (soundRetryTimer !== null) {
    window.clearInterval(soundRetryTimer)
    soundRetryTimer = null
  }
}

function tryEnableSound() {
  const el = video.value
  if (!el || !shouldPlay.value) return
  if (el.paused) return
  el.muted = false
  el.volume = 1
  void el.play().then(() => {
    if (!el.muted) {
      needsUserGestureForSound.value = false
      clearSoundRetry()
    }
  })
}

function ensureSoundWithRetry() {
  clearSoundRetry()
  if (!shouldPlay.value) return
  soundRetryTimer = window.setInterval(() => {
    if (!shouldPlay.value) {
      clearSoundRetry()
      return
    }
    tryEnableSound()
  }, 800)
}

function onCanPlay() {
  if (!shouldPlay.value) return
  void play()
  ensureSoundWithRetry()
}

function enableSound() {
  const el = video.value
  if (!el) return
  el.muted = false
  el.volume = 1
  void el.play().then(() => {
    needsUserGestureForSound.value = false
    clearSoundRetry()
  })
}

function pause() {
  const el = video.value
  if (!el) return
  el.pause()
}

watch(shouldPlay, (sp) => {
  if (sp) {
    play()
    ensureSoundWithRetry()
  } else {
    clearSoundRetry()
    pause()
  }
})

watch(
  ratio,
  (r) => {
    if (r >= 0.08 && !hasBeenVisible.value) {
      hasBeenVisible.value = true
    }
  },
  { immediate: true },
)

watch(
  shouldLoad,
  (v) => {
    if (v && !video.value?.readyState) {
      loading.value = true
    }
    if (!v) {
      loading.value = false
    }
  },
  { immediate: true },
)

watch(
  activeSrc,
  (src) => {
    if (!src || !shouldPlay.value) return
    loading.value = true
    queueMicrotask(() => {
      void play()
      ensureSoundWithRetry()
    })
  },
  { immediate: true },
)

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
  const onBgmState = (e: Event) => {
    const ce = e as CustomEvent<{ playing?: boolean }>
    if (ce.detail?.playing) {
      ensureSoundWithRetry()
      tryEnableSound()
    }
  }
  window.addEventListener('bgmstate', onBgmState as EventListener)
  onBeforeUnmount(() => {
    window.removeEventListener('pointerdown', onFirstUserGesture as any)
    window.removeEventListener('keydown', onFirstUserGesture as any)
    window.removeEventListener('bgmstate', onBgmState as EventListener)
  })
})

onBeforeUnmount(() => {
  clearSoundRetry()
  pause()
})
</script>

