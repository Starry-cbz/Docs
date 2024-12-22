// v1.3
import { createApp, App as VueApp } from 'vue'
import { createRouter, createMemoryHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  // Add routes as needed
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

const app: VueApp = createApp({})

app.use(router)

export default app

