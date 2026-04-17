<template>
  <div class="max-w-2xl">
    <div class="card-shadow p-8">
      <div class="flex items-center gap-6 mb-8 pb-8 border-b border-line">
        <div class="w-20 h-20 bg-nav-active rounded-full flex items-center justify-center">🔬</div>
        <div>
          <h2 class="text-2xl font-bold">{{ form.fullName }}</h2>
          <p class="text-muted">{{ form.email }}</p>
          <span class="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase">Учитель</span>
        </div>
      </div>

      <form @submit.prevent="handleUpdate" class="space-y-6">
        <div class="grid grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-semibold mb-2">ФИО</label>
            <input
                v-model="form.fullName"
                type="text"
                class="w-full px-4 py-3 rounded-lg border border-line focus:outline-none focus:border-primary text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold mb-2">Email</label>
            <input
                v-model="form.email"
                type="email"
                class="w-full px-4 py-3 rounded-lg border border-line focus:outline-none focus:border-primary text-sm"
            />
          </div>
        </div>

        <div v-if="message" :class="message.type === 'success' ? 'text-green-600' : 'text-red-600'"
             class="text-sm font-medium">
          {{ message.text }}
        </div>

        <div class="flex justify-end">
          <button
              type="submit"
              class="btn-primary"
              :disabled="loading"
          >
            {{ loading ? 'Сохранение...' : 'Сохранить изменения' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import api from '../api'

const loading = ref(false);
const message = ref(null);

const form = ref({
  fullName: '',
  email: ''
})

const loadProfile = async () => {
  try {
    const res = await api.get('/profile')
    form.value = res.data
  } catch (e) {
    console.log('Ошибка загрузки профиля', e)
  } finally {
    loading.value = false
  }
}

onMounted(loadProfile)

const handleUpdate = async () => {
  try {
    loading.value = true;
    message.value = null;

    await api.put('/profile', form.value)
    alert('Сохранено')
  } catch (err) {
    message.value = {type: 'error', text: 'Ошибка при обновлении профиля'};
  } finally {
    loading.value = false;
  }
}
</script>