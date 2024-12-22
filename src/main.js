// v1.0
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './styles/index.css' // Assuming you're using Tailwind CSS

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('./pages/index.js'),
      meta: { title: 'Home' }
    },
    {
      path: '/docs/:id',
      component: () => import('./pages/docs/[id].tsx'),
      meta: { title: 'Documentation' }
    },
    {
      path: '/search',
      component: () => import('./pages/search.js'),
      meta: { title: 'Search' }
    }
  ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')

