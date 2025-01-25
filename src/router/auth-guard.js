import { useAuthStore } from '../stores/auth'
import { watch } from 'vue'

export default ({ router }) => {
  router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()

    const handleNavigation = () => {
      if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        // Redirect to login if the route requires authentication and the user is not authenticated
        next('/login')
      } else if (to.path === '/login' && authStore.isAuthenticated) {
        // Redirect to home if the user is already authenticated and tries to access the login page
        next('/')
      } else {
        // Proceed to the route
        next()
      }
    }

    if (authStore.loading) {
      // Use Vue's watch to wait until loading is resolved
      const unwatch = watch(
        () => authStore.loading,
        (loading) => {
          if (!loading) {
            unwatch() // Stop watching once the loading state is resolved
            handleNavigation()
          }
        },
        { immediate: true }, // Start immediately
      )
    } else {
      handleNavigation() // Proceed directly if loading is already resolved
    }
  })
}
