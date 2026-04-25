<template>
  <p
    v-if="showNavPeekHint"
    class="nav-peek-hint pointer-events-none fixed left-1/2 z-[35] max-w-[min(22rem,92vw)] -translate-x-1/2 px-3 text-center text-[10px] leading-snug tracking-wide text-[var(--muted)] opacity-[0.82] sm:text-[11px]"
    :style="{ top: 'max(0.35rem, env(safe-area-inset-top, 0px))' }"
    role="note"
  >
    将鼠标移至窗口顶部可显示导航栏
  </p>
  <div
    class="fixed left-0 top-0 z-30 h-6 w-full"
    @mouseenter="showByEdge = true"
  />
  <header
    class="fixed left-0 top-0 z-40 w-full"
    :class="[
      'transition-all duration-500',
      visible ? 'translate-y-0 opacity-100' : '-translate-y-[120%] opacity-0',
      scrolled ? 'py-2' : 'py-4',
    ]"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <div class="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      <div
        class="glass flex items-center justify-between rounded-2xl px-4 py-3"
        :class="scrolled ? 'shadow-[var(--shadow)]' : ''"
      >
        <RouterLink
          to="/"
          class="group flex items-baseline gap-2 rounded-xl px-2 py-1 transition-all duration-300 hover:-translate-y-0.5"
        >
          <span class="text-[15px] font-bold tracking-tight text-[var(--text-strong)]">
            {{ BRAND_NAME }}
          </span>
          <span
            class="text-xs font-normal text-[var(--muted)] transition-colors group-hover:text-[var(--text)]"
          >
            Portfolio
          </span>
        </RouterLink>

        <nav class="hidden items-center gap-1 md:flex">
          <button class="navbtn" type="button" @click="go('about')">关于</button>
          <button class="navbtn" type="button" @click="go('skills')">技能</button>
          <button class="navbtn" type="button" @click="go('works')">作品</button>
          <button class="navbtn" type="button" @click="go('hobbies')">爱好</button>
          <button class="navbtn" type="button" @click="go('lab')">实验室</button>
        </nav>

        <div class="flex items-center gap-2" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { smoothScrollToEl } from '../composables/useSmoothScrollTo'
import { activePortfolioSectionId } from '../composables/usePortfolioSection'
import { BRAND_NAME } from '../constants/brand'

const y = ref(0)
const scrolled = computed(() => y.value > 12)
const route = useRoute()
const router = useRouter()
const hovering = ref(false)
const showByEdge = ref(false)

const visible = computed(() => {
  const touch = window.matchMedia?.('(pointer: coarse)').matches ?? false
  if (touch) return true
  return hovering.value || showByEdge.value || y.value < 20
})

/**
 * 除单页首页首屏（#about）外，桌面端在导航收起时提示：鼠标移入顶部可显示导航。
 * 含：作品集其它版块、项目详情等子路由。
 */
const showNavPeekHint = computed(() => {
  if (window.matchMedia?.('(pointer: coarse)').matches) return false
  const isPortfolioFirstScreen = route.path === '/' && activePortfolioSectionId.value === 'about'
  if (isPortfolioFirstScreen) return false
  return !visible.value
})

function onScroll() {
  y.value = window.scrollY || 0
}

function onMove(e: MouseEvent) {
  showByEdge.value = e.clientY <= 24
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('mousemove', onMove, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('mousemove', onMove)
})

async function go(id: string) {
  if (route.path !== '/') await router.push('/')
  requestAnimationFrame(() => {
    const el = document.getElementById(id)
    if (!el) return
    smoothScrollToEl(el, { duration: 0.95, offset: 96 })
  })
}
</script>

<style scoped>
.navbtn {
  border-radius: 14px;
  padding: 8px 12px;
  font-size: 13px;
  color: var(--muted);
  transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1), color 320ms cubic-bezier(0.22, 1, 0.36, 1),
    background-color 320ms cubic-bezier(0.22, 1, 0.36, 1);
}
.navbtn:hover {
  transform: translateY(-2px);
  color: var(--text);
  background: rgba(255, 255, 255, 0.22);
}
</style>
