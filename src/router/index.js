import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes' // Your routes file
import authGuard from './auth-guard' // Import the auth guard

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Use the auth guard
authGuard({ router })

export default router
