import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../components/HomePage.vue'
import HeartAnimation from '../components/HeartAnimation.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/animation/:message',
    name: 'HeartAnimation',
    component: HeartAnimation,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router