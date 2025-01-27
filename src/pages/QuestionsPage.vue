<template>
  <h2 v-for="survey in surveys" :key="survey.id">
  {{surveyId}}
  </h2>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  //import { useQuasar } from 'quasar';
  import { api } from 'boot/axios';
  import { useRoute } from 'vue-router'

  const route = useRoute() // Access the current route
  const surveyId = route.params.surveyId
  
  //const $q = useQuasar();
  const surveys = ref([])
  
  onMounted(async()=>{
    surveys.value = await api.get('/janmat-surveys').then(r => r.data)
  })
  </script>