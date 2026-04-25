import type { RouteRecordRaw } from 'vue-router'

import OnePage from '../views/OnePage.vue'
import ProjectDetailPage from '../views/ProjectDetailPage.vue'

export const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: OnePage },
  { path: '/projects/:id', name: 'project-detail', component: ProjectDetailPage },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

