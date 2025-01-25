import { createPinia } from 'pinia'
import { boot } from 'quasar/wrappers'
import { useAuthStore } from '../stores/auth'

const pinia = createPinia()

export default boot(({ app }) => {
  app.use(pinia)

  const authStore = useAuthStore()
  authStore.initializeAuthListener() // Start the auth listener
})

export { pinia }
