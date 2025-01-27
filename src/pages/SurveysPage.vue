<template>
  <q-list bordered class="q-ma-md rounded-borders">
    <q-item v-for="survey in surveys" :key="survey.survey_id">
      <q-item-section top>
        <q-item-label class="q-mt-xs text-h4 text-primary">
          <span class="cursor-pointer"
            ><router-link :to="{ path: `/questions/${survey.survey_id}` }">{{
              survey.title
            }}</router-link></span
          >
        </q-item-label>
      </q-item-section>
      <q-item-section top side>
        <div class="text-grey-8 q-gutter-xs">
          <q-btn class="gt-xs" size="12px" flat dense round icon="delete" />
          <q-btn class="gt-xs" size="12px" flat dense round icon="edit" />
        </div>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
import { ref, onMounted } from 'vue'
//import { useQuasar } from 'quasar';
import { api } from 'boot/axios'

//const $q = useQuasar();
const surveys = ref([])

onMounted(async () => {
  surveys.value = await api.get('/janmat-surveys').then((r) => r.data)
})
</script>
