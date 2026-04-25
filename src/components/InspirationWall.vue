<template>
  <div ref="root" class="relative overflow-hidden rounded-[36px] border border-[var(--border)] p-8 sm:p-10">
    <div class="pointer-events-none absolute inset-0">
      <div class="absolute inset-0 opacity-[0.55] [background:linear-gradient(180deg,color-mix(in_srbg,var(--bg-elev)_78%,transparent),transparent)]" />
      <div
        class="absolute -left-24 -top-24 h-72 w-72 rounded-full blur-3xl"
        :style="{ background: 'color-mix(in srgb, var(--coffee) 18%, transparent)' }"
      />
      <div
        class="absolute -right-32 top-12 h-80 w-80 rounded-full blur-3xl"
        :style="{ background: 'color-mix(in srgb, var(--coffee-2) 14%, transparent)' }"
      />
      <div class="absolute inset-0 opacity-[0.06] [background:repeating-radial-gradient(circle_at_20%_10%,rgba(0,0,0,0.9)_0_1px,transparent_1px_7px)]" />
    </div>

    <div class="relative z-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <div class="text-xs font-semibold tracking-[0.32em] text-[var(--muted)]">PERSONAL HIGHLIGHTS</div>
        <div class="mt-3 text-2xl font-extrabold tracking-tight text-[var(--text-strong)] sm:text-3xl">
          个人亮点 · 经验墙
        </div>
        <p class="mt-4 text-sm leading-relaxed text-[var(--muted)]">
          以卡片形式呈现奖项、项目实践、校园组织与综合能力，便于快速了解个人经历与优势。
        </p>

        <div class="mt-6 flex flex-wrap gap-2">
          <span class="chip">Awards</span>
          <span class="chip">Projects</span>
          <span class="chip">Leadership</span>
          <span class="chip">Impact</span>
        </div>
      </div>

      <div class="relative min-h-[420px] sm:min-h-[480px]">
        <div
          v-for="(c, i) in cards"
          :key="c.id"
          class="card glass absolute w-[min(340px,78%)] rounded-[28px] p-5 sm:p-6"
          :style="cardInline(i, c.tone)"
        >
          <div class="flex items-baseline justify-between gap-4">
            <div class="text-sm font-semibold text-[var(--text-strong)]">{{ c.title }}</div>
            <div class="text-[11px] tracking-[0.22em] text-[var(--muted)]">{{ c.meta }}</div>
          </div>
          <div class="mt-3 text-sm leading-relaxed text-[var(--text)]">
            {{ c.content }}
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import gsap from 'gsap'
import type { LabCard } from '../data/lab'
import { usePrefersReducedMotion } from '../composables/usePrefersReducedMotion'

const props = defineProps<{ cards: LabCard[] }>()
const { reduced } = usePrefersReducedMotion()

const root = ref<HTMLElement | null>(null)
let cleanup: (() => void) | null = null

function cardInline(i: number, tone?: LabCard['tone']) {
  const pos = [
    { top: 18, left: 6, rot: -6 },
    { top: 110, left: 46, rot: 5 },
    { top: 232, left: 12, rot: 7 },
    { top: 300, left: 54, rot: -4 },
  ][i % 4]

  const tint =
    tone === 'coffee'
      ? 'color-mix(in srgb, var(--coffee) 10%, transparent)'
      : tone === 'ink'
        ? 'rgba(0,0,0,0.04)'
        : 'rgba(255,255,255,0.22)'

  return {
    top: `${pos.top}px`,
    left: `${pos.left}%`,
    transform: `rotate(${pos.rot}deg)`,
    background: `linear-gradient(180deg, ${tint}, color-mix(in srgb, var(--bg-elev) 92%, transparent))`,
  } as Record<string, string>
}

onMounted(() => {
  const el = root.value
  if (!el || reduced.value) return

  const cards = Array.from(el.querySelectorAll<HTMLElement>('.card'))
  const onMove = (e: PointerEvent) => {
    const r = el.getBoundingClientRect()
    const cx = e.clientX - (r.left + r.width / 2)
    const cy = e.clientY - (r.top + r.height / 2)
    const px = cx / r.width
    const py = cy / r.height

    cards.forEach((c, i) => {
      const depth = 10 + i * 6
      gsap.to(c, {
        x: px * depth * 18,
        y: py * depth * 12,
        duration: 0.8,
        ease: 'power3.out',
        overwrite: true,
      })
    })
  }

  const onLeave = () => {
    cards.forEach((c) => {
      gsap.to(c, { x: 0, y: 0, duration: 0.9, ease: 'power3.out', overwrite: true })
    })
  }

  el.addEventListener('pointermove', onMove, { passive: true })
  el.addEventListener('pointerleave', onLeave, { passive: true })
  cleanup = () => {
    el.removeEventListener('pointermove', onMove as any)
    el.removeEventListener('pointerleave', onLeave as any)
  }
})

onBeforeUnmount(() => cleanup?.())
</script>

<style scoped>
.chip {
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  padding: 7px 10px;
  font-size: 12px;
  color: var(--text-strong);
  transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
}
.chip:hover {
  transform: translateY(-2px);
}
.card {
  box-shadow: var(--shadow-soft);
  transition: transform 520ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}
.card:hover {
  transform: translateY(-6px) rotate(0deg);
  box-shadow: var(--shadow);
}
</style>

