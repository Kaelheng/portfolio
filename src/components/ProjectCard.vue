<template>
  <RouterLink
    :to="`/projects/${project.id}`"
    class="group block overflow-hidden border border-[var(--border)] bg-[color-mix(in_srbg,var(--bg-elev)_92%,transparent)] shadow-[var(--shadow-soft)] transition-all duration-700 hover:shadow-[var(--shadow)]"
    :class="mode === 'gallery' ? 'rounded-[32px] hover:-translate-y-2' : 'rounded-3xl hover:-translate-y-1'"
  >
    <div
      class="relative overflow-hidden"
      :class="mediaAspectClass"
    >
      <div
        v-if="project.kind === 'video'"
        class="absolute inset-0"
      >
        <VideoPreview :src="project.coverSrc" />
      </div>
      <img
        v-else
        :src="project.coverSrc"
        :alt="project.title"
        loading="lazy"
        class="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.06]"
      />

      <div
        class="absolute inset-0"
        :class="
          mode === 'gallery'
            ? 'bg-[radial-gradient(1200px_600px_at_30%_10%,rgba(0,0,0,0.08),transparent_55%),linear-gradient(180deg,transparent,rgba(0,0,0,0.26))]'
            : 'bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.18))]'
        "
      />

      <div class="absolute bottom-0 left-0 right-0 p-5">
        <div class="flex items-end justify-between gap-4">
          <div>
            <div
              class="font-semibold tracking-tight text-white/92"
              :class="mode === 'gallery' ? 'text-[15px]' : 'text-sm'"
            >
              {{ project.title }}
            </div>
            <div v-if="mode !== 'gallery'" class="mt-1 text-xs text-white/75">
              {{ project.tagline }}
            </div>
            <div v-else class="mt-1 text-xs text-white/70">
              {{ project.stack[0] }}
            </div>
          </div>
          <div v-if="mode === 'gallery'" class="text-xs text-white/70">
            {{ indexLabel }}
          </div>
        </div>
      </div>
    </div>

    <div v-if="mode !== 'gallery'" class="p-5">
      <div class="flex flex-wrap gap-2">
        <span
          v-for="t in project.stack"
          :key="t"
          class="rounded-full border border-[var(--border)] bg-white/30 px-2.5 py-1 text-[11px] text-[var(--text-strong)] transition-all duration-300 group-hover:-translate-y-0.5"
        >
          {{ t }}
        </span>
      </div>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Project } from '../data/projects'
import VideoPreview from './VideoPreview.vue'

const props = withDefaults(
  defineProps<{
    project: Project
    mode?: 'default' | 'gallery'
    wide?: boolean
    tall?: boolean
    /** 一屏内展示：更扁、更矮的比例 */
    compact?: boolean
    indexLabel?: string
  }>(),
  { mode: 'default', wide: false, tall: false, compact: false, indexLabel: '' },
)

const mediaAspectClass = computed(() => {
  if (props.mode !== 'gallery') return 'aspect-[16/10]'
  if (props.compact) {
    return 'aspect-video'
  }
  if (props.tall) return 'aspect-[4/5]'
  if (props.wide) return 'aspect-[21/10]'
  return 'aspect-[16/10]'
})
</script>

