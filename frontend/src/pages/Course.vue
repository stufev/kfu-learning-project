<template>
  <div style="padding: 20px">
    <p v-if="loading">Загрузка...</p>

    <div v-else-if="course">
      <h1>{{ course.title }}</h1>
      <p>{{ course.description }}</p>

      <p><b>Длительность:</b> {{ course.duration }}</p>
      <p><b>Формат:</b> {{ course.format }}</p>
    </div>

    <p v-else>Курс не найден</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../api'

const route = useRoute()
const course = ref(null)
const loading = ref(true)

const fetchCourse = async () => {
  try {
    const res = await api.get(`/courses/${route.params.id}`)
    course.value = res.data
  } catch (e) {
    console.log('Ошибка загрузки курса', e)
  } finally {
    loading.value = false
  }
}

onMounted(fetchCourse)
</script>