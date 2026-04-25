<template>
  <div class="min-h-dvh bg-[var(--bg)] text-[var(--text)] transition-colors duration-500">
    <SiteProgress />
    <SiteCursor />
    <SiteNav />
    <MusicToggle />

    <main class="mx-auto w-full max-w-6xl px-4 pb-24 pt-24 sm:px-6 lg:px-8">
      <RouterView v-slot="{ Component }">
        <Transition name="route-fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import SiteNav from './components/SiteNav.vue'
import SiteProgress from './components/SiteProgress.vue'
import SiteCursor from './components/SiteCursor.vue'
import MusicToggle from './components/MusicToggle.vue'
</script>

<style>
.route-fade-enter-active,
.route-fade-leave-active {
  transition: opacity 380ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 520ms cubic-bezier(0.22, 1, 0.36, 1);
}
.route-fade-enter-from,
.route-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>

