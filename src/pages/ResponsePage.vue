<template>
  <q-page class="q-pa-md">
    <h2>{{ survey.title }}</h2>
    <q-stepper v-model="step" vertical color="primary" animated>
      <q-step
        v-for="(que, i) in questions"
        :key="i"
        :name="que.question_id"
        :title="que.question_text"
        icon="settings"
      >
        For each ad campaign that you create, you can control how much you're willing to spend on
        clicks and conversions, which networks and geographical locations you want your ads to show
        on, and more.

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
    {{ location }}
  </q-page>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'boot/axios'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const route = useRoute() // Access the current route
const surveyId = route.params.surveyId
const survey = ref({})
const questions = ref([])
const step = ref(1)
const location = ref()

// step = questions[i + 1].question_id

const save = (i) => {
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
      location.value.lat = position.coords.latitude
      location.value.lng = position.coords.longitude
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
  questions.value = await api
    .get('/janmat-question?expand=options&filter[survey_id][eq]=' + surveyId)
    .then((r) => r.data)
  step.value = questions.value[0].question_id
  getLocation()
})
</script>
