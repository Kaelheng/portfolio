<template>
  <div class="relative">
    <div class="pointer-events-none fixed inset-0 -z-10">
      <div class="absolute inset-0 opacity-[0.22] [background:radial-gradient(1100px_700px_at_18%_8%,color-mix(in_srbg,var(--coffee)_22%,transparent),transparent_55%),radial-gradient(1000px_700px_at_82%_18%,color-mix(in_srbg,var(--coffee-2)_18%,transparent),transparent_58%)]" />
    </div>

    <section :ref="(el) => setSection(el, 0)" id="about" class="section about-section relative">
      <div class="mx-auto grid w-full max-w-6xl items-stretch gap-5 px-4 pb-1 pt-0 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div class="about-left flex h-full flex-col justify-start">
          <div class="kicker reveal">ABOUT</div>
          <h2 class="title">
            关于我
            <span class="title-accent">/</span>
            Contact
          </h2>
          <p class="reveal mt-5 max-w-2xl text-pretty text-[15px] leading-relaxed text-[var(--text)] sm:text-base">
            我叫吕嘉珩，计算机专业，练习时长两年半（bushi）的一名2026年应届生🙌，欢迎来到我的个人网站！
          </p>

          <div class="reveal mt-8 flex flex-wrap gap-3">
            <button type="button" class="pill" @click="copyEmail">
              {{ emailCopied ? '已复制 13552704165@163.com' : '13552704165@163.com（点击复制）' }}
            </button>
            <a class="pill" href="https://github.com/Kaelheng" target="_blank" rel="noopener noreferrer">
              GitHub: Kaelheng
            </a>
          </div>
          <div class="glass relative mt-4 overflow-hidden rounded-[34px] p-6">
            <div class="absolute -right-16 -top-14 h-40 w-40 rounded-full blur-3xl" :style="{ background: 'color-mix(in srgb, var(--coffee) 18%, transparent)' }" />
            <div class="text-xs font-semibold tracking-[0.22em] text-[var(--muted)]">PROFILE</div>
            <div class="mt-4 space-y-3">
              <div class="row">
                <span class="row-k">方向</span>
                <span class="row-v">全栈 / AI Agent 开发</span>
              </div>
              <div class="row">
                <span class="row-k">关键词</span>
                <span class="row-v">全栈开发 · AI Agent · 产品</span>
              </div>
              <div class="row">
                <span class="row-k">爱好</span>
                <span class="row-v">摄影，设计，网球</span>
              </div>
              <div class="row">
                <span class="row-k">现在</span>
                <span class="row-v">寻找实习 / 校招机会</span>
              </div>
            </div>
          </div>
        </div>

        <div class="about-right relative flex h-full">
          <div class="reveal mx-auto w-full max-w-[360px]">
            <div
              class="overflow-hidden rounded-[30px] border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-elev)_90%,transparent)] shadow-[var(--shadow-soft)]"
            >
              <div class="aspect-[3/4] w-full">
                <img :src="aboutPhotoSrc" alt="生活照片" class="h-full w-full object-cover" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 分页下滑提示：以滚轮分页事件为准，避免相邻屏 IO 重叠导致不显示 -->
    <Teleport to="body">
      <Transition name="scroll-hint-fade" appear>
        <div
          v-if="showPageScrollHint"
          class="scroll-hint pointer-events-none fixed bottom-10 left-1/2 z-[35] flex flex-col items-center gap-1.5 text-[12px] tracking-[0.12em] text-[var(--muted)] sm:bottom-12"
          role="presentation"
        >
          <span class="font-semibold text-[var(--text-strong)]/85">下滑</span>
          <span class="scroll-hint-chevron text-base leading-none text-[var(--coffee)]">↓</span>
        </div>
      </Transition>
    </Teleport>

    <section :ref="(el) => setSection(el, 1)" id="skills" class="section skills-section">
      <div class="skills-shell mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div class="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div class="kicker reveal">SKILLS</div>
            <h2 class="title reveal">技能</h2>
            <p class="reveal mt-5 text-sm leading-relaxed text-[var(--muted)]">
              全栈开发 + 视觉设计：从原型到落地，兼顾体验与实现。
            </p>
          </div>

          <div class="skills-cards grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <div class="glass skill-card skill-card--design reveal rounded-[30px] p-6 md:col-span-2 lg:col-span-1">
              <div class="flex items-center justify-between gap-3">
                <div class="text-sm font-semibold text-[var(--text-strong)]">设计与视觉</div>
                <span class="skill-design-badge">核心优势</span>
              </div>
              <p class="mt-2 text-xs leading-relaxed text-[var(--muted)]">
                高保真界面、品牌视觉与交互原型，强调信息层级与细节质感。
              </p>
              <div class="mt-4 flex flex-wrap gap-2">
                <span v-for="t in design" :key="t" class="tag tag--accent">{{ t }}</span>
              </div>
            </div>
            <div class="glass skill-card rounded-[30px] p-6">
              <div class="text-sm font-semibold text-[var(--text-strong)]">开发与编程</div>
              <div class="mt-4 flex flex-wrap gap-2">
                <span v-for="t in fe" :key="t" class="tag">{{ t }}</span>
              </div>
            </div>
            <div class="glass skill-card rounded-[30px] p-6">
              <div class="text-sm font-semibold text-[var(--text-strong)]">工程与协作</div>
              <div class="mt-4 flex flex-wrap gap-2">
                <span v-for="t in tooling" :key="t" class="tag">{{ t }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section :ref="(el) => setSection(el, 2)" id="works" data-snap="top" class="section works-section">
      <div class="works-shell works-fit -mt-8 mx-auto w-full max-w-5xl px-4 py-0 sm:-mt-10 sm:px-6 lg:-mt-12 lg:px-8">
        <div class="works-head mb-1 flex shrink-0 items-end justify-between gap-4">
          <div>
            <div class="kicker reveal">WORKS</div>
            <h2 class="title works-page-title reveal">项目作品集</h2>
            <p class="reveal mt-1 max-w-2xl text-xs leading-snug text-[var(--muted)] sm:text-sm sm:leading-relaxed line-clamp-2">
              项目精选：一屏一项，聚焦核心实现。
            </p>
          </div>
          <div class="hidden text-right text-xs text-[var(--muted)] lg:block">
            Wheel
            <span class="mx-1 text-[var(--text-strong)]">↕</span>
            to navigate
          </div>
        </div>

        <div class="works-carousel-shell works-single reveal min-h-0">
          <button
            type="button"
            class="works-carousel-btn works-carousel-btn--prev"
            aria-label="上一个项目"
            @click="stepWorksSlide(-1)"
          >
            <span aria-hidden="true" class="text-xl font-light leading-none">&#8249;</span>
          </button>
          <button
            type="button"
            class="works-carousel-btn works-carousel-btn--next"
            aria-label="下一个项目"
            @click="stepWorksSlide(1)"
          >
            <span aria-hidden="true" class="text-xl font-light leading-none">&#8250;</span>
          </button>
          <div class="works-carousel-viewport">
            <div
              class="works-carousel-track"
              :class="{ 'works-carousel-track--reduced': reduced }"
              :style="{
                width: `${worksProjectCount * 100}%`,
                transform: `translateX(-${(worksSlideIndex * 100) / worksProjectCount}%)`,
              }"
            >
              <div
                v-for="(p, i) in projects"
                :key="p.id"
                class="works-carousel-slide"
                :style="{ flexBasis: `${100 / worksProjectCount}%` }"
              >
                <ProjectCard
                  :project="p"
                  mode="gallery"
                  wide
                  compact
                  :index-label="worksIndexLabel(i)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section
      :ref="(el) => setSection(el, 3)"
      id="hobbies"
      class="section hobbies-section"
      data-snap="top"
      data-snap-target=".hobbies-title"
    >
      <div class="mx-auto w-full max-w-6xl px-4 pt-10 sm:px-6 lg:px-8">
        <div class="mb-5 flex items-end justify-between gap-6">
          <div>
            <div class="kicker reveal">HOBBY</div>
            <h2 class="hobbies-title title reveal">爱好作品集</h2>
            <p class="reveal mt-4 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
              爱好内容展示：以弧形轮播呈现摄影与创作。
            </p>
          </div>
          <div class="hidden text-right text-xs text-[var(--muted)] lg:block">
            Scroll
            <span class="mx-1 text-[var(--text-strong)]">↕</span>
            to switch
          </div>
        </div>
      </div>

      <div class="reveal w-full pb-8">
        <EllipseCarousel class="w-full" :slides="hobbySlides" :titles="hobbyTitles" />
      </div>
    </section>

    <section :ref="(el) => setSection(el, 4)" id="lab" class="section lab-section">
      <div class="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div class="mb-8 flex items-end justify-between gap-6">
          <div>
            <div class="kicker reveal">LAB</div>
            <h2 class="title reveal">奖项与实践经历</h2>
            <p class="reveal mt-4 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
              集中展示荣誉奖项、项目实践与组织经历。
            </p>
          </div>
        </div>

        <div class="reveal">
          <InspirationWall :cards="labCards" />
        </div>

        <div class="mt-10 text-center text-xs text-[var(--muted)]">
          © {{ new Date().getFullYear() }} {{ BRAND_NAME }} · Kaelheng
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import gsap from 'gsap'
import ProjectCard from '../components/ProjectCard.vue'
import EllipseCarousel from '../components/EllipseCarousel.vue'
import InspirationWall from '../components/InspirationWall.vue'
import { BRAND_NAME } from '../constants/brand'
import { projects } from '../data/projects'
import { labCards } from '../data/lab'
import { usePrefersReducedMotion } from '../composables/usePrefersReducedMotion'
import { useFullpageWheel } from '../composables/useFullpageWheel'
import { activePortfolioSectionId } from '../composables/usePortfolioSection'

const { reduced } = usePrefersReducedMotion()
const sections = ref<HTMLElement[]>([])

const worksSlideIndex = ref(0)
const worksProjectCount = computed(() => projects.length)
const emailCopied = ref(false)

function worksIndexLabel(i: number) {
  return String(i + 1).padStart(2, '0')
}

function stepWorksSlide(dir: -1 | 1) {
  const n = worksProjectCount.value
  if (n <= 1) return
  worksSlideIndex.value = (worksSlideIndex.value + dir + n) % n
}

function copyEmail() {
  const email = '13552704165@163.com'
  navigator.clipboard
    .writeText(email)
    .then(() => {
      emailCopied.value = true
      window.setTimeout(() => {
        emailCopied.value = false
      }, 1400)
    })
    .catch(() => {
      emailCopied.value = false
    })
}

const HINT_SECTION_IDS = new Set(['about', 'skills', 'works'])

const activeSectionId = ref('about')
const hintDismissed = ref<Partial<Record<string, boolean>>>({})

const showPageScrollHint = computed(() => {
  const id = activeSectionId.value
  if (!HINT_SECTION_IDS.has(id)) return false
  return !hintDismissed.value[id]
})

function setSection(el: HTMLElement | null, i: number) {
  if (!el) return
  sections.value[i] = el
}

const fullpageEnabled = computed(() => {
  const fine = window.matchMedia?.('(pointer:fine)').matches ?? false
  return fine && !reduced.value && window.innerWidth >= 1024
})

useFullpageWheel({ sectionEls: sections, enabled: fullpageEnabled, offset: 96, lockMs: 320 })

function animateSectionById(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const targets = Array.from(el.querySelectorAll<HTMLElement>('.reveal'))
  if (!targets.length) return
  if (reduced.value) return

  gsap.killTweensOf(targets)
  gsap.fromTo(
    targets,
    { y: 12 },
    {
      y: 0,
      duration: 0.72,
      ease: 'power3.inOut',
      stagger: 0.06,
      overwrite: true,
    },
  )
}

function leaveSectionById(id: string) {
  const el = document.getElementById(id)
  if (!el || reduced.value) return
  gsap.killTweensOf(el)
  gsap.to(el, {
    scale: 0.994,
    duration: 0.2,
    ease: 'power2.inOut',
    overwrite: true,
  })
}

function onSectionChange(e: Event) {
  const ce = e as CustomEvent<{ id: string; dir?: 1 | -1; index?: number; fromId?: string }>
  if (!ce.detail?.id) return
  const id = ce.detail.id
  activeSectionId.value = id
  activePortfolioSectionId.value = id
  if (HINT_SECTION_IDS.has(id)) {
    hintDismissed.value = { ...hintDismissed.value, [id]: false }
  }
  const el = document.getElementById(id)
  if (el && !reduced.value) {
    gsap.killTweensOf(el)
    gsap.to(el, {
      scale: 1,
      duration: 0.28,
      ease: 'power3.inOut',
      overwrite: true,
    })
  }
  if (id === 'about') animateAboutEnter()
  if (id === 'skills') animateSkillsEnter()
  animateSectionById(id)
}

function onSectionWillChange(e: Event) {
  const ce = e as CustomEvent<{ from?: { id: string }; to?: { id: string }; dir?: 1 | -1 }>
  const fromId = ce.detail?.from?.id
  const toId = ce.detail?.to?.id
  if (fromId && toId && fromId !== toId && HINT_SECTION_IDS.has(fromId)) {
    hintDismissed.value = { ...hintDismissed.value, [fromId]: true }
  }
  if (!fromId) return
  if (fromId === 'about') animateAboutLeave(ce.detail?.dir ?? 0)
  if (fromId === 'skills') animateSkillsLeave()
  leaveSectionById(fromId)
}

function animateAboutEnter() {
  if (reduced.value) return
  const left = document.querySelector<HTMLElement>('.about-left')
  const right = document.querySelector<HTMLElement>('.about-right')
  if (!left || !right) return
  gsap.killTweensOf([left, right])
  gsap.fromTo(
    left,
    { x: -70, opacity: 0.01 },
    { x: 0, opacity: 1, duration: 0.78, ease: 'power3.out', overwrite: true },
  )
  gsap.fromTo(
    right,
    { x: 70, opacity: 0.01 },
    { x: 0, opacity: 1, duration: 0.78, ease: 'power3.out', overwrite: true },
  )
}

function animateAboutLeave(dir: number) {
  if (reduced.value) return
  const left = document.querySelector<HTMLElement>('.about-left')
  const right = document.querySelector<HTMLElement>('.about-right')
  if (!left || !right) return
  gsap.killTweensOf([left, right])
  const leftTo = dir >= 0 ? -54 : -54
  const rightTo = dir >= 0 ? 54 : 54
  gsap.to(left, { x: leftTo, opacity: 0.8, duration: 0.36, ease: 'power2.inOut', overwrite: true })
  gsap.to(right, { x: rightTo, opacity: 0.8, duration: 0.36, ease: 'power2.inOut', overwrite: true })
}

function animateSkillsEnter() {
  if (reduced.value) return
  const shell = document.querySelector<HTMLElement>('.skills-shell')
  if (!shell) return
  gsap.killTweensOf(shell)
  gsap.fromTo(
    shell,
    { y: -36, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.38,
      ease: 'power2.out',
      overwrite: true,
    },
  )
}

function animateSkillsLeave() {
  if (reduced.value) return
  const shell = document.querySelector<HTMLElement>('.skills-shell')
  if (!shell) return
  gsap.killTweensOf(shell)
  gsap.to(shell, {
    y: -30,
    opacity: 0,
    duration: 0.22,
    ease: 'power1.in',
    overwrite: true,
  })
}

onMounted(() => {
  activePortfolioSectionId.value = 'about'
  window.addEventListener('sectionwillchange', onSectionWillChange as any)
  window.addEventListener('sectionchange', onSectionChange as any)
  animateAboutEnter()
  animateSectionById('about')
})
onBeforeUnmount(() => {
  window.removeEventListener('sectionwillchange', onSectionWillChange as any)
  window.removeEventListener('sectionchange', onSectionChange as any)
  activePortfolioSectionId.value = 'about'
})

const design = ['Figma', 'Illustrator', 'Photoshop', 'UI/UX', '视觉规范', '原型设计']
const fe = ['Java', 'Python', 'Vue 3', 'JavaScript', 'Spring Boot', 'SQL']
const tooling = ['Office', 'Git', '项目协作']

const hobbyTitles = [
  { left: 'Hello!', middle: '👋', right: 'Welcome to my hobby portfolio' },
  { left: 'Arc', middle: '∿', right: 'Curved carousel, silky transitions.' },
  { left: 'Art', middle: '✦', right: 'Less grid, more rhythm.' },
]

const hobbyImageModules = import.meta.glob('../../image/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const aboutPhotoSrc = new URL('../../image/e9ee3fdb7b37c38df35749422e30f6c5.jpg', import.meta.url).href

const hobbySlides = Object.entries(hobbyImageModules)
  .sort(([a], [b]) => {
    const an = a.split('/').pop() ?? a
    const bn = b.split('/').pop() ?? b
    return an.localeCompare(bn, undefined, { numeric: true, sensitivity: 'base' })
  })
  .map(([path, src], idx) => {
    const filename = path.split('/').pop() ?? `image-${idx + 1}`
    const name = filename.replace(/\.[^.]+$/, '')
    return {
      id: `h${idx + 1}`,
      src,
      alt: `hobby ${name}`,
    }
  })

</script>

<style scoped>
.section {
  min-height: 100dvh;
  display: flex;
  align-items: center;
}
.section[data-snap='top'] {
  align-items: flex-start;
}

/* 首屏：顶部对齐，避免整屏垂直居中导致大块留白 */
.about-section {
  align-items: flex-start;
  padding-top: max(1.75rem, env(safe-area-inset-top, 0px));
  padding-bottom: 0;
}

.about-section .title {
  margin-top: 0;
}
.hobbies-section {
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
}
.skills-section,
.works-section,
.lab-section {
  position: relative;
}

/* 画廊页：整体靠上，减少标题区占位 */
.works-section {
  align-items: flex-start;
  justify-content: flex-start;
  padding-top: 0;
  margin-top: -0.75rem;
  --works-title-fs: clamp(26px, 3.6vw, 34px);
  --works-title-lh: 1.08;
}

.works-section .title {
  margin-top: 2px;
}

/* 画廊单屏：标题略小 + 主区域限高，卡片用 compact 比例 */
.works-page-title {
  font-size: var(--works-title-fs);
  line-height: var(--works-title-lh);
}

.works-fit {
  display: flex;
  max-height: min(calc(100dvh - 3.25rem), 880px);
  min-height: 0;
  flex-direction: column;
}

.works-fit .works-single {
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
}

.skills-section::before,
.works-section::before,
.lab-section::before {
  content: '';
  position: absolute;
  inset: 10% 6% auto;
  height: 46%;
  border-radius: 36px;
  pointer-events: none;
  z-index: 0;
  opacity: 0.52;
  background: radial-gradient(
    70% 90% at 50% 20%,
    color-mix(in srgb, var(--coffee) 12%, transparent),
    transparent 70%
  );
}

.skills-section > *,
.works-section > *,
.lab-section > * {
  position: relative;
  z-index: 1;
}
.kicker {
  font-size: 11px;
  letter-spacing: 0.32em;
  font-weight: 700;
  color: var(--muted);
}
.title {
  margin-top: 10px;
  font-size: 42px;
  line-height: 1.06;
  letter-spacing: -0.02em;
  font-weight: 800;
  color: var(--text-strong);
}
.title-accent {
  color: var(--coffee);
}
.pill {
  border: 1px solid var(--border);
  background: color-mix(in srgb, var(--bg-elev) 92%, transparent);
  box-shadow: var(--shadow-soft);
  backdrop-filter: blur(18px);
  border-radius: 999px;
  padding: 10px 14px;
  font-size: 13px;
  color: var(--text-strong);
  transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
}
.pill:hover {
  transform: translateY(-2px);
}
.row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
}
.row-k {
  font-size: 11px;
  letter-spacing: 0.22em;
  color: var(--muted);
}
.row-v {
  font-size: 13px;
  color: var(--text-strong);
}
.tag {
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.22);
  padding: 7px 10px;
  border-radius: 999px;
  font-size: 12px;
  color: var(--text-strong);
  transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
}
.tag:hover {
  transform: translateY(-2px);
}

.skill-card {
  transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 420ms cubic-bezier(0.22, 1, 0.36, 1);
}

.skill-card:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 18px 34px color-mix(in srgb, var(--coffee) 16%, transparent);
}

.skill-card--design {
  border-color: color-mix(in srgb, var(--coffee) 32%, var(--border));
  background:
    radial-gradient(120% 80% at 100% 0%, color-mix(in srgb, var(--coffee) 14%, transparent), transparent 55%),
    color-mix(in srgb, var(--bg-elev) 94%, transparent);
}

.skill-card--design:hover {
  box-shadow: 0 20px 38px color-mix(in srgb, var(--coffee) 22%, transparent);
}

.skill-design-badge {
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--coffee) 35%, transparent);
  background: color-mix(in srgb, var(--coffee) 12%, transparent);
  padding: 3px 8px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--coffee);
}

.tag--accent {
  border-color: color-mix(in srgb, var(--coffee) 28%, var(--border));
  background: color-mix(in srgb, var(--coffee) 10%, white);
}

@media (min-width: 1024px) {
  .skills-cards {
    align-items: stretch;
  }

  .skill-card--design {
    min-height: 100%;
  }
}

.works-single {
  max-width: 940px;
  margin: calc(
      clamp(1.1rem, 3.2vw, 1.9rem) + 0.5 * var(--works-title-lh) * var(--works-title-fs)
    )
    auto 0;
  transform: rotate(-0.55deg);
}

.works-carousel-shell {
  position: relative;
}

.works-carousel-viewport {
  overflow: hidden;
  width: 100%;
}

.works-carousel-track {
  display: flex;
  transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
}

.works-carousel-track--reduced {
  transition-duration: 0.01ms;
}

.works-carousel-slide {
  flex-shrink: 0;
  box-sizing: border-box;
  padding: 0 0.2rem;
}

.works-carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
  width: 44px;
  height: 44px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: color-mix(in srgb, var(--bg-elev) 90%, transparent);
  box-shadow: var(--shadow-soft);
  backdrop-filter: blur(12px);
  color: var(--text-strong);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition:
    transform 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.28s ease,
    background-color 0.28s ease;
}

.works-carousel-btn:hover {
  transform: translateY(-50%) scale(1.06);
  box-shadow: var(--shadow);
}

.works-carousel-btn--prev {
  left: clamp(-0.35rem, -1vw, 0.25rem);
}

.works-carousel-btn--next {
  right: clamp(-0.35rem, -1vw, 0.25rem);
}

.works-carousel-btn:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--coffee) 55%, transparent);
  outline-offset: 3px;
}

@media (max-width: 640px) {
  .works-carousel-btn {
    width: 38px;
    height: 38px;
  }

  .works-carousel-btn--prev {
    left: 0.2rem;
  }

  .works-carousel-btn--next {
    right: 0.2rem;
  }
}

.works-single :deep(a.group) {
  transition: transform 520ms cubic-bezier(0.22, 1, 0.36, 1), filter 520ms cubic-bezier(0.22, 1, 0.36, 1);
}

.works-single :deep(a.group:hover) {
  transform: translateY(-4px) scale(1.01);
  filter: saturate(1.05);
}

.lab-section :deep(.card) {
  transition: transform 460ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 460ms cubic-bezier(0.22, 1, 0.36, 1);
}

.lab-section :deep(.card:hover) {
  transform: translateY(-5px) rotate(0.15deg);
  box-shadow: 0 18px 34px color-mix(in srgb, var(--ink-blue) 16%, transparent);
}

@media (max-width: 1024px) {
  .works-single {
    transform: none;
  }
}

.scroll-hint {
  transform: translateX(-50%);
}

.scroll-hint-fade-enter-active,
.scroll-hint-fade-leave-active {
  transition:
    opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.scroll-hint-fade-enter-from {
  opacity: 0;
  transform: translate(-50%, 20px);
}

.scroll-hint-fade-enter-to {
  opacity: 1;
  transform: translate(-50%, 0);
}

.scroll-hint-fade-leave-from {
  opacity: 1;
  transform: translate(-50%, 0);
}

.scroll-hint-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, 22px);
}

@media (prefers-reduced-motion: reduce) {
  .scroll-hint-fade-enter-active,
  .scroll-hint-fade-leave-active {
    transition: opacity 0.35s ease;
  }
  .scroll-hint-fade-enter-from,
  .scroll-hint-fade-leave-to {
    transform: translate(-50%, 0);
  }
}

.scroll-hint-chevron {
  display: inline-block;
  animation: scroll-hint-bob 1.5s ease-in-out infinite;
}

@keyframes scroll-hint-bob {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0.85;
  }
  50% {
    transform: translateY(6px);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .scroll-hint-chevron {
    animation: none;
  }
}
</style>

