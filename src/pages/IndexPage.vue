<template>
  <q-page class="flex flex-center">
    <q-btn label="Go to User Management" color="primary" unelevated to="/user-admin" />
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
  is_varified.value = authStore.user.email === 'rakesh@jangid.co.in' ? true : false
})
</script>
