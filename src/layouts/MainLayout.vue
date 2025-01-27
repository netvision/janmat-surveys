<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title> Janmat App</q-toolbar-title>
        <q-btn-group
          outline
          v-if="
            isAuthenticated &&
            ['rakesh@jangid.co.in', 'smcjjn@gmail.com'].includes(authStore.user.email)
          "
        >
          <q-btn color="primary" label="Users" to="/user-admin" />
          <q-btn color="primary" label="Surveys" to="/surveys" />
        </q-btn-group>
        <q-btn v-if="isAuthenticated" label="Logout" color="secondary" @click="logout" />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
const authStore = useAuthStore()
const router = useRouter()

const isAuthenticated = computed(() => authStore.isAuthenticated)

const logout = async () => {
  try {
    await authStore.logout() // Log out the user
    router.push('/login') // Redirect to the login page
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>
