import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/lib/supabase'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
    { path: '/prestations', name: 'prestations', component: () => import('@/views/PrestationsView.vue') },
    { path: '/portfolio', name: 'portfolio', component: () => import('@/views/PortfolioView.vue') },
    { path: '/equipe', name: 'equipe', component: () => import('@/views/EquipeView.vue') },
    { path: '/contact', name: 'contact', component: () => import('@/views/ContactView.vue') },
    { path: '/admin', name: 'admin', component: () => import('@/views/admin/AdminDashboardView.vue'), meta: { requiresAuth: true } },
    { path: '/admin/login', name: 'admin-login', component: () => import('@/views/admin/AdminLoginView.vue') }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach(async (to) => {
  if (!to.meta?.requiresAuth) return true
  const { data } = await supabase.auth.getSession()
  if (data.session) return true
  return { name: 'admin-login', query: { next: to.fullPath } }
})

export default router
