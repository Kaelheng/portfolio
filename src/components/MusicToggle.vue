<template>
  <audio
    ref="audioDom"
    class="hidden"
    :src="bgmSrc"
    autoplay
    loop
    preload="metadata"
    @play="onAudioPlay"
    @pause="onAudioPause"
  />
  <div class="fixed right-4 top-20 z-[46] sm:right-6 sm:top-24">
    <button
      type="button"
      class="music-toggle grid h-8 w-8 place-items-center rounded-full border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-elev)_90%,transparent)] text-[var(--text-strong)] shadow-[var(--shadow-soft)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow)] sm:h-9 sm:w-9"
      :aria-label="isPlaying ? '暂停背景音乐' : '播放背景音乐'"
      :title="isPlaying ? '暂停背景音乐' : '播放背景音乐'"
      @click="toggleMusic"
    >
      <span
        aria-hidden="true"
        class="music-icon text-xs leading-none sm:text-sm"
        :class="{ 'music-icon--spin': isPlaying }"
      >
        {{ isPlaying ? '♪' : '♫' }}
      </span>
    </button>

    <div
      v-if="showHint && !isPlaying"
      class="pointer-events-none mt-1 w-8 text-center text-[10px] leading-none text-[var(--muted)] sm:w-9 sm:text-[11px]"
      role="note"
    >
      <span class="music-hint-arrow mx-auto block w-fit">↑</span>
      <span class="mt-1 block">点击图标播放音乐</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const audioEl = ref<HTMLAudioElement | null>(null)
const audioDom = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const userPaused = ref(false)
const interruptedByVideo = ref(false)
let autoplayRetryTimer: number | null = null
let autoplayRetryInterval: number | null = null
let hintTimer: number | null = null
const showHint = ref(true)
const playingVideos = new Set<HTMLVideoElement>()

const bgmSrc = new URL('../../music/music1.mp3', import.meta.url).href

async function playMusic() {
  const el = audioEl.value
  if (!el) return false
  try {
    await el.play()
    isPlaying.value = true
    window.dispatchEvent(new CustomEvent('bgmstate', { detail: { playing: true } }))
    return true
  } catch {
    isPlaying.value = false
    window.dispatchEvent(new CustomEvent('bgmstate', { detail: { playing: false } }))
    return false
  }
}

function pauseMusic() {
  const el = audioEl.value
  if (!el) return
  el.pause()
  isPlaying.value = false
  window.dispatchEvent(new CustomEvent('bgmstate', { detail: { playing: false } }))
}

function onAudioPlay() {
  isPlaying.value = true
  window.dispatchEvent(new CustomEvent('bgmstate', { detail: { playing: true } }))
}

function onAudioPause() {
  isPlaying.value = false
  window.dispatchEvent(new CustomEvent('bgmstate', { detail: { playing: false } }))
}

function onAnyMediaPlay(e: Event) {
  const t = e.target
  if (!(t instanceof HTMLVideoElement)) return
  playingVideos.add(t)
  interruptedByVideo.value = true
  pauseMusic()
}

async function onAnyMediaPause(e: Event) {
  const t = e.target
  if (!(t instanceof HTMLVideoElement)) return
  playingVideos.delete(t)
  if (!interruptedByVideo.value || userPaused.value) return
  if (playingVideos.size > 0) return
  interruptedByVideo.value = false
  await playMusic()
}

async function onAnyMediaEnded(e: Event) {
  const t = e.target
  if (!(t instanceof HTMLVideoElement)) return
  playingVideos.delete(t)
  if (!interruptedByVideo.value || userPaused.value) return
  if (playingVideos.size > 0) return
  interruptedByVideo.value = false
  await playMusic()
}

function retryAutoplay() {
  if (isPlaying.value || userPaused.value) return
  if (playingVideos.size > 0) return
  void playMusic()
}

async function toggleMusic() {
  showHint.value = false
  if (isPlaying.value) {
    userPaused.value = true
    interruptedByVideo.value = false
    pauseMusic()
    return
  }
  userPaused.value = false
  interruptedByVideo.value = false
  await playMusic()
}

onMounted(async () => {
  const el = audioDom.value ?? new Audio(bgmSrc)
  el.preload = 'metadata'
  el.loop = true
  el.autoplay = true
  el.volume = 0.6
  audioEl.value = el

  if (!audioDom.value) {
    el.addEventListener('play', onAudioPlay)
    el.addEventListener('pause', onAudioPause)
  }
  document.addEventListener('play', onAnyMediaPlay, true)
  document.addEventListener('pause', onAnyMediaPause, true)
  document.addEventListener('ended', onAnyMediaEnded, true)
  document.addEventListener('visibilitychange', retryAutoplay)
  window.addEventListener('focus', retryAutoplay)
  window.addEventListener('pageshow', retryAutoplay)

  await playMusic()

  autoplayRetryTimer = window.setTimeout(() => {
    retryAutoplay()
  }, 600)
  autoplayRetryInterval = window.setInterval(() => {
    retryAutoplay()
  }, 1800)
  hintTimer = window.setTimeout(() => {
    showHint.value = false
  }, 4200)
})

onBeforeUnmount(() => {
  const el = audioEl.value
  if (el) {
    el.pause()
    if (!audioDom.value) {
      el.removeEventListener('play', onAudioPlay)
      el.removeEventListener('pause', onAudioPause)
    }
  }
  document.removeEventListener('play', onAnyMediaPlay, true)
  document.removeEventListener('pause', onAnyMediaPause, true)
  document.removeEventListener('ended', onAnyMediaEnded, true)
  document.removeEventListener('visibilitychange', retryAutoplay)
  window.removeEventListener('focus', retryAutoplay)
  window.removeEventListener('pageshow', retryAutoplay)
  if (autoplayRetryTimer !== null) {
    window.clearTimeout(autoplayRetryTimer)
    autoplayRetryTimer = null
  }
  if (autoplayRetryInterval !== null) {
    window.clearInterval(autoplayRetryInterval)
    autoplayRetryInterval = null
  }
  if (hintTimer !== null) {
    window.clearTimeout(hintTimer)
    hintTimer = null
  }
})
</script>

<style scoped>
.music-icon--spin {
  animation: music-spin 2.8s linear infinite;
}

@keyframes music-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .music-icon--spin {
    animation: none;
  }
}

.music-hint-arrow {
  display: inline-block;
  animation: music-hint-bob 1.2s ease-in-out infinite;
  opacity: 0.9;
}

@keyframes music-hint-bob {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .music-hint-arrow {
    animation: none;
  }
}
</style>

