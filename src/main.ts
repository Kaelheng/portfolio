import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import { routes } from './router/routes'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

const app = createApp(App).use(router)

router.isReady().then(async () => {
  if (router.currentRoute.value.path !== '/') {
    await router.replace('/')
  }
  window.scrollTo(0, 0)
})

app.mount('#app')
