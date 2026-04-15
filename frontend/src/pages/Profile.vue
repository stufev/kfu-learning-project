<template>
  <div style="padding: 20px">
    <h1>Профиль</h1>

    <p v-if="loading">Загрузка...</p>

    <div v-else>
      <input v-model="form.fullName" placeholder="ФИО" />
      <input v-model="form.email" placeholder="Email" />

      <button @click="save">Сохранить</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api'

const loading = ref(true)

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

const save = async () => {
  try {
    await api.put('/profile', form.value)
    alert('Сохранено')
  } catch (e) {
    console.log('Ошибка сохранения', e)
  }
}

onMounted(loadProfile)
</script>