<template>
  <q-page class="q-pa-md">
    <h2>{{ survey.title }}</h2>
    <q-select v-model="response.area" :options="areas" label="Select Area" style="width: 40%" />
    <q-stepper v-model="step" vertical color="primary" animated>
      <q-step
        v-for="(que, i) in questions"
        :key="i"
        :name="que.question_id"
        :title="que.question_text"
        icon="settings"
      >
        <div class="q-gutter-sm">
          <q-radio
            v-for="opt in que.options"
            :key="opt.option_id"
            v-model="response.answer_option_id"
            checked-icon="task_alt"
            unchecked-icon="panorama_fish_eye"
            :val="opt.option_id"
            :label="opt.option_text"
          />
        </div>

        <q-stepper-navigation>
          <q-btn @click="save(i)" color="primary" label=" Save & Continue" />
          <q-btn
            v-if="i > 0"
            @click="step = questions[i - 1].question_id"
            color="primary"
            label="Back"
          />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
    {{ response }}
  </q-page>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'boot/axios'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '../stores/auth'

const $q = useQuasar()
const authStore = useAuthStore()
const route = useRoute() // Access the current route
const surveyId = route.params.surveyId
const survey = ref({})
const questions = ref([])
const step = ref(1)
const response = ref({})
const areas = ref([])

// step = questions[i + 1].question_id

const save = async (i) => {
  response.value.question_id = questions.value[i].question_id
  await api.post('/janmat-responses', response.value)
  if (questions.value.length > i + 1) step.value = questions.value[i + 1].question_id
}

const getLocation = () => {
  if (!navigator.geolocation) {
    $q.notify({
      type: 'negative',
      message: 'Geolocation is not supported by your browser.',
    })
    return
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      response.value.gps_latitude = position.coords.latitude
      response.value.gps_longitude = position.coords.longitude
      $q.notify({
        type: 'positive',
        message: 'GPS Coordinates retrieved successfully!',
      })
    },
    (error) => {
      console.error('Error getting location:', error)
      $q.notify({
        type: 'negative',
        message: 'Unable to retrieve GPS coordinates.',
      })
    },
  )
}

onMounted(async () => {
  survey.value = await api.get('/janmat-surveys/' + surveyId).then((r) => r.data)
  areas.value = survey.value.areas.split(', ')
  questions.value = await api
    .get('/janmat-question?expand=options&filter[survey_id][eq]=' + surveyId)
    .then((r) => r.data)
  step.value = questions.value[0].question_id
  getLocation()
  const user = await api
    .get('/janmat-user?filter[email][eq]=' + authStore.user.email)
    .then((r) => r.data)
  console.log(user[0].user_id)
  response.value.user_id = user[0].user_id
})
</script>
