<template>
  <section class="space-y-3">
    <div v-if="project" class="glass mx-auto w-full max-w-5xl overflow-hidden rounded-3xl">
      <div class="p-3.5 sm:p-4">
        <div class="grid gap-4 lg:grid-cols-[0.34fr_0.66fr] lg:items-start">
          <div class="lg:pt-12">
            <div class="text-[22px] font-semibold tracking-tight text-[var(--text-strong)] sm:text-2xl">
              {{ project.title }}
            </div>
            <div class="mt-1 text-sm text-[var(--muted)]">{{ project.tagline }}</div>

            <div class="mt-3 flex flex-wrap gap-2">
              <span
                v-for="t in project.stack"
                :key="t"
                class="rounded-full border border-[var(--border)] bg-white/25 px-3 py-1.5 text-xs text-[var(--text-strong)]"
              >
                {{ t }}
              </span>
            </div>
          </div>

          <div class="relative ml-auto w-full overflow-hidden rounded-2xl lg:w-[94%] lg:translate-x-1">
            <div class="relative aspect-[16/7] overflow-hidden rounded-2xl">
              <video
                v-if="project.kind === 'video'"
                ref="detailVideo"
                :src="project.coverSrc"
                class="h-full w-full rounded-2xl object-cover"
                controls
                autoplay
                playsinline
                preload="metadata"
              />
              <img
                v-else
                :src="project.coverSrc"
                :alt="project.title"
                class="h-full w-full rounded-2xl object-cover"
              />

              <button
                type="button"
                class="absolute left-3 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-black/35 text-white/90 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-black/45"
                aria-label="上一个项目"
                @click="goProject(-1)"
              >
                ‹
              </button>
              <button
                type="button"
                class="absolute right-3 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-black/35 text-white/90 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-black/45"
                aria-label="下一个项目"
                @click="goProject(1)"
              >
                ›
              </button>
            </div>
          </div>
        </div>

        <div class="my-3 hairline" />

        <div class="grid gap-3 md:grid-cols-2">
          <div>
            <div class="text-xs font-semibold text-[var(--text-strong)]">个人职责</div>
            <div class="mt-2 text-sm text-[var(--text)]">
              {{ project.role ?? '（待补充）' }}
            </div>
          </div>
          <div>
            <div class="text-xs font-semibold text-[var(--text-strong)]">简介</div>
            <div class="mt-2 text-sm leading-relaxed text-[var(--text)]">
              {{ project.description ?? '（待补充）' }}
            </div>
          </div>
        </div>

        <div class="mt-3 flex flex-wrap gap-3">
          <a
            v-if="project.repoUrl"
            class="rounded-2xl border border-[var(--border)] bg-transparent px-4 py-2 text-sm font-semibold text-[var(--text-strong)] transition-all duration-500 hover:-translate-y-0.5 hover:bg-white/20"
            :href="project.repoUrl"
            target="_blank"
            rel="noreferrer"
          >
            源码仓库
          </a>
        </div>
      </div>
    </div>

    <div v-else class="glass mx-auto w-full max-w-5xl rounded-3xl p-6">
      <div class="text-sm font-semibold text-[var(--text-strong)]">未找到该项目</div>
      <div class="mt-2 text-sm text-[var(--muted)]">请返回作品集列表。</div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { projects } from '../data/projects'

const route = useRoute()
const router = useRouter()
const detailVideo = ref<HTMLVideoElement | null>(null)
const project = computed(() => {
  const id = String(route.params.id || '')
  return projects.find((p) => p.id === id) ?? null
})

const projectIndex = computed(() => {
  const id = String(route.params.id || '')
  return projects.findIndex((p) => p.id === id)
})

function goProject(dir: -1 | 1) {
  const i = projectIndex.value
  if (i < 0 || projects.length <= 1) return
  const next = (i + dir + projects.length) % projects.length
  void router.push(`/projects/${projects[next].id}`)
}

watch(
  () => project.value?.id,
  async () => {
    await nextTick()
    const el = detailVideo.value
    if (!el) return
    try {
      el.currentTime = 0
      await el.play()
    } catch {
      // Browsers may block autoplay with sound until user interaction.
    }
  },
  { immediate: true },
)
</script>

