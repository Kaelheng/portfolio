<template>
  <section
    ref="root"
    class="relative w-full select-none overflow-hidden rounded-[30px] border border-[var(--border)] bg-[var(--bg)] px-4 pb-2 pt-1 shadow-[var(--shadow-soft)] sm:px-6"
  >
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      multiple
      class="hidden"
      @change="onPickFiles"
    />
    <div class="hero-title">
      <p>{{ activeTitle.left }} <span class="mx-2">{{ activeTitle.middle }}</span> {{ activeTitle.right }}</p>
    </div>
    <div class="relative z-10 -mt-1 flex items-center justify-center" :style="{ perspective: '1600px' }">
      <div class="track relative h-[220px] w-full sm:h-[246px]">
        <div
          v-for="(s, i) in displaySlides"
          :key="s.id"
          class="abs-card absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[22px] bg-black/5 shadow-[var(--shadow-soft)] ring-1 ring-[color-mix(in_srbg,var(--border)_80%,transparent)]"
          :style="{ width: cardW + 'px', height: cardH + 'px', ...cardStyle(i) }"
        >
          <img :src="s.src" :alt="s.alt" class="h-full w-full object-cover" draggable="false" loading="lazy" />
        </div>
      </div>
    </div>

    <footer class="relative z-10 mt-1 flex flex-col items-center justify-center gap-1.5">
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="arrow-btn arrow-btn-light"
          aria-label="上一项"
          @click="step(-1)"
        >
          ←
        </button>
        <button
          type="button"
          class="arrow-btn arrow-btn-dark"
          aria-label="下一项"
          @click="step(1)"
        >
          →
        </button>
      </div>

      <div class="flex items-center gap-2">
        <button
          v-for="(_, i) in displaySlides"
          :key="`dot-${i}`"
          type="button"
          class="h-1.5 rounded-full transition-all duration-500"
          :class="i === currentIndex ? 'w-6 bg-black/80' : 'w-2.5 bg-black/20 hover:bg-black/35'"
          :aria-label="`切换到第 ${i + 1} 页`"
          @click="goTo(i)"
        />
      </div>

      <div class="text-xs tracking-[0.24em] text-[var(--muted)]">
        {{ pageLabel }}
      </div>

      <div class="flex items-center gap-5">
        <button
          type="button"
          class="upload-btn"
          @click="openFilePicker"
        >
          Choose
        </button>
        <button
          type="button"
          class="upload-btn"
          @click="openFilePicker"
        >
          Upload
        </button>
      </div>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import gsap from 'gsap'
import { usePrefersReducedMotion } from '../composables/usePrefersReducedMotion'
import { useWheelStepper } from '../composables/useWheelStepper'

type Slide = { id: string; src: string; alt: string }
type Title = { left: string; middle: string; right: string }

const props = defineProps<{ slides: Slide[]; titles: Title[] }>()
const { reduced } = usePrefersReducedMotion()

const root = ref<HTMLElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const trackW = ref(1200)
const trackH = ref(300)
const uploadedSlides = ref<Slide[]>([])
const uploadedUrls = ref<string[]>([])

const displaySlides = computed(() => [...props.slides, ...uploadedSlides.value])
// Continuous phase value; one step = 1/slideCount.
const theta = ref(0)
let settleTween: gsap.core.Tween | null = null

const slideCount = computed(() => Math.max(1, displaySlides.value.length))
const activeTitle = computed(() => {
  if (!props.titles?.length) return { left: 'Hello!', middle: '👋', right: 'Feel free to drop your portfolio!' }
  return props.titles[0]
})
const currentIndex = computed(() => {
  const n = slideCount.value
  const i = ((Math.round(-theta.value * n) % n) + n) % n
  return i
})
const pageLabel = computed(() => {
  const cur = String(currentIndex.value + 1).padStart(2, '0')
  const total = String(slideCount.value).padStart(2, '0')
  return `${cur} / ${total}`
})

function stopTween() {
  if (settleTween) {
    settleTween.kill()
    settleTween = null
  }
}

function normalizeDelta(d: number) {
  // map to [-0.5, 0.5) for shortest ring distance
  let x = ((d + 0.5) % 1 + 1) % 1 - 0.5
  if (x === 0.5) x = -0.5
  return x
}

function goTo(index: number) {
  const n = slideCount.value
  const current = ((theta.value % 1) + 1) % 1
  const target = ((-(index / n) % 1) + 1) % 1
  const shortest = normalizeDelta(target - current)
  const next = theta.value + shortest
  stopTween()
  settleTween = gsap.to(theta, {
    value: next,
    duration: reduced.value ? 0 : 1.15,
    ease: 'power3.inOut',
    overwrite: true,
  })
}

function step(dir: 1 | -1) {
  const n = slideCount.value
  const target = theta.value - dir / n
  stopTween()
  settleTween = gsap.to(theta, {
    value: target,
    duration: reduced.value ? 0 : 1.1,
    ease: 'power3.inOut',
    overwrite: true,
  })
}

useWheelStepper(root, {
  onStep(dir) {
    step(dir)
  },
  lockMs: 140,
  preventPageScroll: true,
})

function measure() {
  const el = root.value
  if (!el) return
  const track = el.querySelector<HTMLElement>('.track')
  const box = (track ?? el).getBoundingClientRect()
  trackW.value = Math.max(320, box.width)
  trackH.value = Math.max(220, box.height)
}

let ro: ResizeObserver | null = null

function wrap01(x: number) {
  const m = ((x % 1) + 1) % 1
  return m
}

function openFilePicker() {
  fileInput.value?.click()
}

function onPickFiles(e: Event) {
  const input = e.target as HTMLInputElement
  const files = Array.from(input.files ?? [])
  if (!files.length) return
  const validFiles = files.filter((f) => f.type.startsWith('image/'))
  if (!validFiles.length) return

  const newSlides = validFiles.map((file, idx) => {
    const src = URL.createObjectURL(file)
    uploadedUrls.value.push(src)
    return {
      id: `u-${Date.now()}-${idx}`,
      src,
      alt: file.name,
    }
  })

  uploadedSlides.value = [...uploadedSlides.value, ...newSlides]
  input.value = ''
}

// avoid over-wide track; keep centered within viewport
const ampY = computed(() => Math.min(trackH.value * 0.1, 24))
// cards: 3:4 aspect, height ~ track height
const cardH = computed(() => {
  // avoid overlap: keep card height around 75% of track height
  const base = Math.round(trackH.value * 0.72)
  return Math.max(132, Math.min(base, 210))
})
const cardW = computed(() => Math.round(cardH.value * 0.75))
// wider side inset + larger slot spacing for clearer gaps
const sideInset = computed(() => 36)
const maxX = computed(() =>
  Math.max(100, Math.round(trackW.value / 2 - cardW.value / 2 - sideInset.value)),
)
const stepX = computed(() => {
  const count = Math.max(2, slideCount.value)
  return ((maxX.value * 2) / (count - 1)) * 1.38
})
// visual nudge to align center card with arrow center
const centerNudgeX = 8

function cardStyle(i: number) {
  const n = Math.max(1, displaySlides.value.length)
  const pos = wrap01(i / n + theta.value)
  // 以相位 0 作为“正中心”，保证轮播几何居中
  const d = normalizeDelta(pos)
  const relative = d * n
  const ad = Math.abs(d)
  const side = d >= 0 ? 1 : -1

  // Continuous slot movement for real sliding effect.
  const xRaw = relative * stepX.value
  const isOddCount = n % 2 === 1
  // Keep motion continuous: only apply a fixed parity offset.
  // odd -> center a card; even -> center the gap between two cards.
  const parityOffset = isOddCount ? 0 : stepX.value * 0.5
  const x = xRaw + parityOffset + centerNudgeX
  // Create "top convex / bottom concave" feel:
  // center card rises up, side cards sit lower.
  const curve = Math.pow(ad / 0.5, 1.1)
  const y = curve * ampY.value + 92

  // Front card is largest and brightest
  const depth = Math.max(0, 1 - ad / 0.5)
  const z = 90 + depth * 380
  const scale = 0.72 + depth * 0.34
  const rotY = side * -34 * (1 - depth)

  return {
    transform: `translate(-50%, -50%) translateX(${x}px) translateY(${y}px) translateZ(${z}px) rotateY(${rotY}deg) scale(${scale})`,
    zIndex: String(10 + Math.round(depth * 100)),
    filter: 'brightness(1) saturate(1)',
  } as Record<string, string>
}

onMounted(async () => {
  measure()
  ro = new ResizeObserver(() => measure())
  if (root.value) ro.observe(root.value)
})
onBeforeUnmount(() => {
  stopTween()
  for (const url of uploadedUrls.value) URL.revokeObjectURL(url)
  uploadedUrls.value = []
  ro?.disconnect()
  ro = null
})
</script>

<style scoped>
.abs-card {
  transition: filter 420ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform, filter;
}

.hero-title {
  position: relative;
  z-index: 20;
  display: flex;
  justify-content: center;
  text-align: center;
  margin: 2px 0 8px;
}

.hero-title p {
  font-size: clamp(22px, 2.6vw, 42px);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: #0f1012;
  white-space: nowrap;
}

.arrow-btn {
  width: 50px;
  height: 50px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-size: 18px;
  transition: transform 320ms ease, background-color 320ms ease, color 320ms ease;
}

.arrow-btn:hover {
  transform: scale(1.12);
}

.arrow-btn-light {
  border: 1px solid #171717;
  background: #fff;
  color: #171717;
}

.arrow-btn-light:hover {
  background: #000;
  color: #fff;
}

.arrow-btn-dark {
  border: 1px solid #171717;
  background: #000;
  color: #fff;
}

.upload-btn {
  border-radius: 20px;
  background: #000;
  color: #fff9f1;
  font-size: 18px;
  line-height: 1;
  font-weight: 500;
  padding: 10px 28px;
  cursor: pointer;
  transition: transform 280ms ease, opacity 280ms ease;
}

.upload-btn:hover {
  transform: translateY(-1px);
  opacity: 0.92;
}

@media (max-height: 820px) {
  .hero-title {
    margin: 0 0 4px;
  }

  .hero-title p {
    font-size: clamp(18px, 2.1vw, 30px);
  }

  .arrow-btn {
    width: 44px;
    height: 44px;
  }

  .upload-btn {
    font-size: 16px;
    padding: 8px 22px;
  }
}
</style>

