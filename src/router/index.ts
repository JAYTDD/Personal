import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import ResumePage from '@/views/ResumePage.vue'
import ExperiencePage from '@/views/ExperiencePage.vue'
import AboutPage from '@/views/AboutPage.vue'
import ProjectsPage from '@/views/ProjectsPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/resume', name: 'resume', component: ResumePage },
    { path: '/experience', name: 'experience', component: ExperiencePage },
    { path: '/about', name: 'about', component: AboutPage },
    { path: '/projects', name: 'projects', component: ProjectsPage },
    // Catch-all: redirect unknown routes to home
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

export default router
