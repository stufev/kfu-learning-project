<template>
  <div>
    <section class="flex justify-between items-center mb-6">
      <h2 class="text-lg font-semibold">Все доступные программы</h2>
      <select v-model="format" @change="onFilterChange">
        <option value="">Все форматы</option>
        <option value="online">online</option>
        <option value="offline">offline</option>
      </select>
      <div class="relative">
        <input
            v-model="search"
            placeholder="Поиск курса"
            @input="onFilterChange"
            type="text"
            class="w-[300px] bg-white border border-line px-4 py-2.5 pl-10 rounded-lg text-sm focus:outline-none focus:border-primary"
        />
      </div>
    </section>

    <div class="grid grid-cols-2 gap-5">
      <div v-for="course in courses" :key="course.id" class="card-shadow p-5 flex flex-col justify-between h-full">
        <div>
          <span
              class="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold uppercase mb-3 bg-blue-100 text-blue-800"
              v-if="false">
            {{ course.category }}
          </span>
          <h3 class="text-base font-semibold mb-2 leading-snug">{{ course.title }}</h3>
          <p class="text-sm text-muted line-clamp-2 mb-3">{{ course.description }}</p>
          <div class="flex gap-4 text-[13px] text-muted">
            <span class="flex items-center gap-1"> {{ course.duration }}</span>
            <span class="flex items-center gap-1"> {{ course.format }}</span>
            <span class="flex items-center gap-1" v-if="false"> {{ course.price }} ₽</span>
          </div>
        </div>
        <div class="flex justify-between items-center mt-5">
          <span class="text-xs font-medium px-3 py-1 bg-nav-hover rounded-full">
            {{ isEnrolled(course.id) ? 'Вы записаны' : 'Свободно' }}
          </span>
          <router-link :to="'/course/' + course.id" class="btn-primary text-sm">
            {{ isEnrolled(course.id) ? 'Перейти' : 'Подробнее' }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import api from '../api'
import {useAuthStore} from "@/store/auth.js"

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