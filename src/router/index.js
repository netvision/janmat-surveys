import { route } from 'quasar/wrappers'
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { useAuthStore } from '../stores/auth'

export default route(function () {
  const Router = createRouter({
    history: createWebHistory(),
    routes,
  })

  Router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()

    // Check if the user is authenticated
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      // Redirect to the login page if not logged in
      next('/login')
    } else if (to.path === '/login' && authStore.isAuthenticated) {
      // Redirect to home if already logged in
      next('/')
    } else {
      // Proceed to the route
      next()
    }
  })

  return Router
})
