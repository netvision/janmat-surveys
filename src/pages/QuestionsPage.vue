<template>
  <h2>{{ survey.title }}</h2>
  <q-list bordered class="q-ma-md rounded-borders">
    <q-item v-for="que in questions" :key="que.id">
      <q-item-section top>
        <q-item-label class="q-mt-xs text-h4 text-primary">
          <span class="cursor-pointer">{{ que.question_text }}</span>
        </q-item-label>
        <q-item-label caption lines="1" v-for="opt in que.options" :key="opt.option_id">
          {{ opt.option_text }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
  <q-btn label="Add Question" color="primary" @click="questionModal = true" />
  <q-dialog v-model="questionModal">
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h6">Add Question</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="submitForm">
          <!-- Question Input -->
          <q-input v-model="question.question_text" label="Question" outlined required></q-input>

          <!-- Options List -->
          <div class="q-mt-md">
            <div class="text-subtitle1">Options</div>
            <div v-for="(option, index) in question.options" :key="index" class="q-my-sm">
              <q-input
                v-model="option.option_text"
                label="Option"
                outlined
                dense
                :clearable="true"
                @keyup.enter="addOption"
              >
                <!-- Remove Option Button -->
                <template v-slot:append>
                  <q-btn
                    color="negative"
                    flat
                    dense
                    round
                    icon="delete"
                    @click="removeOption(index)"
                  ></q-btn>
                </template>
              </q-input>
            </div>

            <!-- Add Option Button -->
            <q-btn
              label="Add Option"
              icon="add"
              color="primary"
              flat
              dense
              @click="addOption"
            ></q-btn>
          </div>

          <!-- Submit Button -->
          <q-btn label="Submit Question" type="submit" color="primary" class="q-mt-md"></q-btn>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import { useRoute } from 'vue-router'

const $q = useQuasar()
const route = useRoute() // Access the current route
const surveyId = route.params.surveyId
const survey = ref({})
const questionModal = ref(false)

const question = reactive({
  question_text: '', // Question text
  options: [{ option_text: '' }], // Initial empty option
})

// Add a new empty option
const addOption = () => {
  question.options.push({ option_text: '' })
}

// Remove an option by index
const removeOption = (index) => {
  question.options.splice(index, 1)
}

// Submit the form and log the question data
const submitForm = async () => {
  if (!question.question_text.trim()) {
    alert('Please enter a question')
    return
  }

  if (question.options.some((option) => !option.option_text.trim())) {
    alert('All options must have text')
    return
  }

  try {
    // Step 1: Save the question
    const questionResponse = await api.post('/janmat-questions', {
      question_text: question.question_text,
      question_type: 'checkbox',
      survey_id: surveyId,
    })
    const questionId = questionResponse.data.question_id // Assuming the backend returns the question ID

    // Step 2: Save the options
    for (const opt of question.options) {
      await api.post('/janmat-options', { question_id: questionId, option_text: opt.option_text })
    }

    // Success notification
    $q.notify({ type: 'positive', message: 'Question and options added successfully!' })

    // Reset the form
    questions.value.push({ ...question })
    console.log(questions.value)
    question.question_text = ''
    question.options = [{ option_text: '' }]
  } catch (error) {
    console.error('Error saving question or options:', error)
    $q.notify({ type: 'negative', message: 'Failed to save question or options.' })
  }
}

//const $q = useQuasar();
const questions = ref([])

onMounted(async () => {
  survey.value = await api.get('/janmat-surveys/' + surveyId).then((r) => r.data)
  questions.value = await api
    .get('/janmat-question?expand=options&filter[survey_id][eq]=' + surveyId)
    .then((r) => r.data)
})
</script>
