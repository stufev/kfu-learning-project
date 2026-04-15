<template>
  <div style="padding: 20px">
    <h1>Мои курсы</h1>

    <div v-for="e in enrollments" :key="e.id">
      <h3>{{ e.course.title }}</h3>

      <p>Статус: {{ e.status }}</p>

      <button @click="updateStatus(e.id, 'in_progress')">
        В процессе
      </button>

      <button @click="updateStatus(e.id, 'completed')">
        Завершён
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api'

const updateStatus = async (id, status) => {
  await api.put(`/enrollments/${id}/status`, { status })
  await fetchMyCourses()
}

const enrollments = ref([])

const fetchMyCourses = async () => {
  const res = await api.get('/enrollments/my')
  enrollments.value = res.data
}

onMounted(fetchMyCourses)
</script>