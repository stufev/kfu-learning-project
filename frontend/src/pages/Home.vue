<template>
  <div>
    <div class="grid grid-cols-3 gap-6 mb-8">
      <div class="card-shadow p-6">
        <div class="text-3xl font-bold mb-1">{{ stats.available }}</div>
        <div class="text-[13px] text-muted uppercase tracking-wider">Доступно курсов</div>
      </div>
      <div class="card-shadow p-6">
        <div class="text-3xl font-bold mb-1">{{ stats.inProgress }}</div>
        <div class="text-[13px] text-muted uppercase tracking-wider">В процессе</div>
      </div>
      <div class="card-shadow p-6">
        <div class="text-3xl font-bold mb-1">{{ stats.completed }}</div>
        <div class="text-[13px] text-muted uppercase tracking-wider">Завершено</div>
      </div>
    </div>

    <section class="mb-6">
      <div class="flex justify-between items-center mb-5">
        <h2 class="text-lg font-semibold">Рекомендуемые программы</h2>
        <router-link to="/courses" class="text-primary text-sm font-medium hover:underline">Смотреть все</router-link>
      </div>

      <div class="grid grid-cols-2 gap-5">
        <div v-for="course in featuredCourses" :key="course.id"
             class="card-shadow p-5 flex flex-col justify-between h-full">
          <div>
            <span
                class="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold uppercase mb-3 bg-green-100 text-green-800"
                v-if="false"
            >
              {{ course.category }}
            </span>
            <h3 class="text-base font-semibold mb-2 leading-snug">{{ course.title }}</h3>
            <div class="flex gap-4 text-[13px] text-muted">
              <span class="flex items-center gap-1">🥼 {{ course.format }}</span>
              <span class="flex items-center gap-1">⏰ {{ course.duration }}</span>
              <span class="flex items-center gap-1" v-if="false">
                <Star :size="14" class="text-yellow-500 fill-yellow-500"/> 4.9
              </span>
            </div>
          </div>
          <div class="flex justify-between items-center mt-5">
            <router-link :to="'/course/' + course.id" class="btn-primary text-sm">Подробнее</router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import api from '../api'
import {useAuthStore} from "@/store/auth.js"

const authStore = useAuthStore();

const featuredCourses = ref([]);
const stats = ref({
  available: 0,
  inProgress: 0,
  completed: 0
});

onMounted(async () => {
  const {data: courses} = await api.get('/courses')

  featuredCourses.value = courses.slice(0, 4);
  stats.value.available = courses.length;

  if (authStore.isAuth) {
    const {data: myCourses} = await api.get('/enrollments/my')
    stats.value.inProgress = myCourses.filter(e => e.status === 'enrolled' || e.status === 'in_progress').length;
    stats.value.completed = myCourses.filter(e => e.status === 'completed').length;
  }
})
</script>
