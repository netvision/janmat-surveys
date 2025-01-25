import { boot } from 'quasar/wrappers'
import authGuard from '../router/auth-guard'

export default boot(({ router }) => {
  authGuard({ router }) // Attach the auth guard
})
