<template>
  <div v-if="course" class="max-w-3xl">
    <div class="card-shadow p-8 mb-6">
      <div class="flex justify-between items-start mb-6">
        <div>
          <span class="inline-block px-3 py-1 rounded-md text-xs font-bold uppercase mb-4 bg-blue-100 text-blue-800"
                v-if="false">
            {{ course.category }}
          </span>
          <h2 class="text-3xl font-bold mb-4">{{ course.title }}</h2>
          <div class="flex gap-6 text-sm text-muted">
            <span class="flex items-center gap-2"> {{ course.duration }}</span>
            <span class="flex items-center gap-2"> {{ course.format }}</span>
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
            <Check :size="18"/> Вы уже записаны
          </span>
          <router-link to="/my-courses" class="text-primary font-medium hover:underline">Перейти к обучению
          </router-link>
        </div>
      </div>
    </div>

    <div v-if="error" class="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import api from '../api'
import {useAuthStore} from "@/store/auth.js";

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const course = ref(null);
const enrollments = ref([]);
const loading = ref(false);
const error = ref('');

// todo доделать

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

onMounted(async () => {
  await Promise.all([
    fetchCourse(),
    loadEnrollments()
  ])
})
</script>