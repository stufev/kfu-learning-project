<template>
  <div v-if="course" class="max-w-3xl">
    <div class="card-shadow p-8 mb-6">
      <div class="flex justify-between items-start mb-6">
        <div>
          <span
              class="inline-block px-3 py-1 rounded-md text-xs font-bold uppercase mb-4 bg-blue-100 text-blue-800"
              v-if="false"
          >
            {{ course.category }}
          </span>
          <h2 class="text-3xl font-bold mb-4">{{ course.title }}</h2>
          <div class="flex gap-6 text-sm text-muted">
            <span class="flex items-center gap-2">⏰ {{ course.duration }}</span>
            <span class="flex items-center gap-2">🥼 {{ course.format }}</span>
            <span class="flex items-center gap-2" v-if="false"> {{ course.price }} ₽</span>
          </div>
        </div>
      </div>

      <div class="prose max-w-none text-ink leading-relaxed mb-8">
        <h3 class="text-lg font-semibold mb-3">Описание программы</h3>
        <p>{{ course.description }}</p>
        <p class="mt-4">В рамках данного курса вы изучите передовые практики и методики, применимые в современной
          образовательной среде. Программа разработана ведущими специалистами Елабужского института КФУ.</p>
      </div>

      <div class="flex items-center gap-4 pt-6 border-t border-line">
        <button
            v-if="!isEnrolled"
            @click="enroll"
            class="btn-primary px-8 py-3"
            :disabled="loading"
        >
          {{ loading ? 'Загрузка...' : 'Записаться на курс' }}
        </button>
        <div v-else class="flex items-center gap-4">
          <span class="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
            Вы уже записаны
          </span>
          <div class="text-gray cursor-not-allowed font-medium">
            Перейти к обучению
          </div>
        </div>
      </div>
    </div>

    <div v-if="error" class="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import api from '../api'
import {useAuthStore} from "@/store/auth.js";

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const course = ref(null)
const enrollments = ref([])
const loading = ref(false)
const error = ref('')

/**
 * Загрузка курса
 */
const fetchCourse = async () => {
  try {
    const res = await api.get(`/courses/${route.params.id}`)
    course.value = res.data
  } catch (e) {
    console.log('Ошибка загрузки курса', e)
    error.value = 'Не удалось загрузить курс'
  }
}

/**
 * Загрузка записей пользователя
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
 * Computed: записан ли пользователь
 */
const isEnrolled = computed(() => {
  if (!course.value) return false

  return enrollments.value.some(
      e => e.course.id === course.value.id
  )
})

/**
 * Запись на курс
 */
const enroll = async () => {
  if (!auth.isAuth) {
    router.push('/login')
    return
  }

  loading.value = true
  error.value = ''

  try {
    await api.post('/enrollments', {
      courseId: course.value.id
    })

    await loadEnrollments()
  } catch (e) {
    console.log('Ошибка записи', e)
    error.value = 'Не удалось записаться на курс'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  loading.value = true

  await Promise.all([
    fetchCourse(),
    loadEnrollments()
  ])

  loading.value = false
})
</script>