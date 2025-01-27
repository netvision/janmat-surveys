<template>
  <q-page class="flex flex-center">
    <pre v-if="is_varified">{{ authStore.user.email }}</pre>
    <pre v-else>You are not allowed</pre>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '../stores/auth'
// import { api } from 'boot/axios'
const authStore = useAuthStore()
const is_varified = ref(false)

onMounted(async () => {
  is_varified.value = ['rakesh@jangid.co.in', 'smcjjn@gmail.com'].includes(authStore.user.email)
})
</script>
