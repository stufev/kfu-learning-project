<template>
  <div class="p-5 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Мои курсы</h1>

    <!-- пусто -->
    <div v-if="enrollments.length === 0" class="card-shadow p-12 text-center">
      <h3 class="text-lg font-semibold mb-2">У вас пока нет активных курсов</h3>
      <p class="text-muted mb-6">
        Выберите подходящую программу в каталоге и начните обучение.
      </p>
      <router-link to="/" class="btn-primary">Перейти в каталог</router-link>
    </div>

    <!-- список -->
    <div v-else class="grid grid-cols-1 gap-4">
      <div
          v-for="enrollment in enrollments"
          :key="enrollment.id"
          class="card-shadow p-6 flex items-center justify-between"
      >
        <!-- левая часть -->
        <div class="flex items-center gap-6">
          <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            📘
          </div>

          <div>
            <h3 class="font-bold text-lg mb-1">
              {{ enrollment.course.title }}
            </h3>

            <div class="flex gap-4 text-sm text-muted">
              <span>⏰ {{ enrollment.course.duration }}</span>
              <span>•</span>
              <span>🥼 {{ enrollment.course.format }}</span>
            </div>
          </div>
        </div>

        <!-- правая часть -->
        <div class="flex items-center gap-6">
          <!-- статус -->
          <div class="text-right">
            <div class="text-xs text-muted uppercase mb-1">Статус</div>

            <span
                class="px-3 py-1 rounded-full text-xs font-bold uppercase"
                :class="getStatusClass(enrollment.status)"
            >
              {{ getStatusLabel(enrollment.status) }}
            </span>
          </div>

          <!-- действия -->
          <div class="flex flex-col gap-2">
            <button
                class="text-xs border px-3 py-1 rounded hover:bg-gray-50"
                @click="updateStatus(enrollment.id, 'in_progress')"
            >
              В процессе
            </button>

            <button
                class="text-xs border px-3 py-1 rounded hover:bg-gray-50"
                @click="updateStatus(enrollment.id, 'completed')"
            >
              Завершить
            </button>
          </div>

          <!-- переход -->
          <router-link
              :to="'/course/' + enrollment.course.id"
              class="btn-primary text-sm"
          >
            Открыть
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api'

const enrollments = ref([])

/**
 * label статуса
 */
const getStatusLabel = (status) => {
  switch (status) {
    case 'enrolled': return 'Записан'
    case 'in_progress': return 'В процессе'
    case 'completed': return 'Завершён'
    default: return status
  }
}

/**
 * цвет статуса
 */
const getStatusClass = (status) => {
  switch (status) {
    case 'ENROLLED': return 'bg-blue-100 text-blue-800'
    case 'in_progress': return 'bg-yellow-100 text-yellow-800'
    case 'completed': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

/**
 * обновление статуса
 */
const updateStatus = async (id, status) => {
  try {
    await api.put(`/enrollments/${id}/status`, { status })

    // обновляем список
    await fetchMyCourses()
  } catch (e) {
    console.log('Ошибка обновления статуса', e)
  }
}

/**
 * загрузка курсов
 */
const fetchMyCourses = async () => {
  try {
    const res = await api.get('/enrollments/my')
    enrollments.value = res.data
  } catch (e) {
    console.log('Ошибка загрузки курсов', e)
  }
}

onMounted(fetchMyCourses)
</script>