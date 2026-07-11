import { createRouter, createWebHistory } from 'vue-router'
import { SITE_NAME } from '@/data/site'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomePage.vue'),
      meta: { title: '首页' },
    },
    {
      path: '/resume',
      name: 'resume',
      component: () => import('@/views/ResumePage.vue'),
      meta: { title: '简历' },
    },
    {
      path: '/experience',
      name: 'experience',
      component: () => import('@/views/ExperiencePage.vue'),
      meta: { title: '经历' },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutPage.vue'),
      meta: { title: '关于' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFound.vue'),
      meta: { title: '页面未找到' },
    },
  ],
})

router.afterEach((to) => {
  const pageTitle = typeof to.meta.title === 'string' ? to.meta.title : ''
  document.title = pageTitle ? `${pageTitle} · ${SITE_NAME}` : `${SITE_NAME} | 前端开发工程师`
})

export default router
