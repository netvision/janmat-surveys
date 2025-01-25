import { defineStore } from 'pinia'
import { auth, googleProvider } from '../firebase/init'
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    loading: true, // Track the initial auth state
  }),

  actions: {
    async loginWithGoogle() {
      try {
        const result = await signInWithPopup(auth, googleProvider)
        this.user = result.user
        this.isAuthenticated = true
        console.log('User logged in:', this.user)
      } catch (error) {
        console.error('Google Sign-In Error:', error)
        throw error
      }
    },

    async logout() {
      try {
        await signOut(auth)
        this.user = null
        this.isAuthenticated = false
        console.log('User logged out')
      } catch (error) {
        console.error('Logout Error:', error)
        throw error
      }
    },

    initializeAuthListener() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.user = user
          this.isAuthenticated = true
        } else {
          this.user = null
          this.isAuthenticated = false
        }
        this.loading = false // Set loading to false once auth state is resolved
        console.log('Auth state changed:', user)
      })
    },
  },
})
