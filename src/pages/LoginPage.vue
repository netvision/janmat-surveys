<template>
  <q-page class="q-pa-md flex flex-center">
    <q-card class="q-pa-lg" flat bordered>
      <q-card-section>
        <div class="text-h6 text-center">Welcome to My App</div>
        <div class="text-subtitle2 text-center q-mt-sm">Please log in to continue</div>
      </q-card-section>

      <q-card-section>
        <q-btn
          label="Sign in with Google"
          color="primary"
          class="full-width q-mb-sm"
          icon="login"
          @click="handleLogin"
        />
        <q-spinner v-if="loading" size="30px" color="primary" class="q-my-sm full-width" />
        <q-banner v-if="errorMessage" class="bg-red-2 text-red-8 q-mt-md">
          {{ errorMessage }}
        </q-banner>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    await authStore.loginWithGoogle()
    router.push('/')
  } catch (error) {
    errorMessage.value = 'Login failed. Please try again.'
    console.error('Login error:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.full-width {
  width: 100%;
}
</style>
