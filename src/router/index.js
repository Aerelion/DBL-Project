import { createRouter, createWebHashHistory } from 'vue-router'
import Visualise from '../views/Visualise.vue'
import About from '../views/About.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: About,
  },
  {
    path: '/visualise',
    name: 'Visualise',
    component: Visualise
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
