import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import { useStartpage } from '@/composables/useStartpage'

// Hash history: GitHub Pages has no rewrites, and a new tab page may be opened from anywhere.
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/welcome', name: 'welcome', component: () => import('@/views/Welcome.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
})

// A first visit goes through the setup before landing on the page.
router.beforeEach(to => {
  if (to.name === 'home' && !useStartpage().state.welcomed) return { name: 'welcome' }
})

export default router
