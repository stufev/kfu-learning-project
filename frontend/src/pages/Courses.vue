<template>
  <div style="padding: 20px">
    <h1>Курсы</h1>

    <input
        v-model="search"
        placeholder="Поиск курса"
        @input="onFilterChange"
    />

    <select v-model="format" @change="onFilterChange">
      <option value="">Все форматы</option>
      <option value="online">online</option>
      <option value="offline">offline</option>
    </select>

    <p v-if="loading">Загрузка...</p>

    <div v-else>
      <div
          v-for="course in courses"
          :key="course.id"
          style="margin-bottom: 15px;"
      >
        <h3>{{ course.title }}</h3>
        <p>{{ course.description }}</p>
        <small>{{ course.duration }} | {{ course.format }}</small>

        <br />

        <button
            @click="enroll(course.id)"
            :disabled="isEnrolled(course.id)"
        >
          {{ isEnrolled(course.id) ? 'Уже записан' : 'Записаться' }}
        </button>

        <router-link :to="`/course/${course.id}`">
          Подробнее
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api'
import { useAuthStore } from "@/store/auth.js"

const courses = ref([])
const enrollments = ref([])
const loading = ref(true)

const search = ref('')
const format = ref('')

const auth = useAuthStore()

/**
 * Загрузка курсов (зависит от фильтров)
 */
const loadCourses = async () => {
  loading.value = true

  try {
    const res = await api.get('/courses', {
      params: {
        search: search.value,
        format: format.value
      }
    })

    courses.value = res.data
  } catch (e) {
    console.log('Ошибка загрузки курсов', e)
  } finally {
    loading.value = false
  }
}

/**
 * Загрузка записей пользователя (ОДИН РАЗ)
 */
const loadEnrollments = async () => {
  if (!auth.isAuth) {
    enrollments.value = []
    return
  }

  try {
    const res = await api.get('/enrollments/my')
    enrollments.value = res.data
  } catch (e) {
    console.log('Ошибка загрузки enrollments', e)
  }
}

/**
 * Проверка записи на курс
 */
const isEnrolled = (courseId) => {
  return enrollments.value.some(e => e.course.id === courseId)
}

/**
 * Запись на курс
 */
const enroll = async (courseId) => {
  try {
    await api.post('/enrollments', {courseId})

    // обновляем только enrollments, не курсы
    await loadEnrollments()
  } catch (e) {
    console.log('Ошибка записи', e)
    alert('Ошибка записи на курс')
  }
}

/**
 * реакция на фильтры
 */
const onFilterChange = () => {
  loadCourses()
}

onMounted(async () => {
  await Promise.all([
    loadCourses(),
    loadEnrollments()
  ])
})
</script>