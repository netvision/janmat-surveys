<template>
  <q-page v-if="is_varified" class="q-pa-md">
    <q-list bordered class="q-ma-md rounded-borders">
      <q-item v-for="survey in surveys" :key="survey.survey_id">
        <q-item-label class="q-mt-xs text-h4 text-primary" @click="goTo(survey.survey_id)">
          <span class="cursor-pointer">{{ survey.title }}</span>
        </q-item-label>
      </q-item>
    </q-list>
  </q-page>
  <q-page v-else class="q-pa-md">
    <pre>You are not allowed</pre>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { api } from 'boot/axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const is_varified = ref(false)
const emails = ref([])
const surveys = ref([])

const goTo = (id) => router.push('/response/' + id)

onMounted(async () => {
  const users = await api.get('/janmat-users').then((r) => r.data)
  users.forEach((usr) => {
    if (usr.email) emails.value.push(usr.email)
  })
  is_varified.value = emails.value.includes(authStore.user.email)
  surveys.value = await api.get('/janmat-surveys?sort=-id').then((r) => r.data)
})
</script>
