<template>
  <div style="padding: 20px">
    <h1>Обратная связь</h1>

    <input v-model="form.name" placeholder="Имя" />
    <input v-model="form.email" placeholder="Email" />
    <textarea v-model="form.message" placeholder="Сообщение"></textarea>

    <button @click="send">Отправить</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../api'

const form = ref({
  name: '',
  email: '',
  message: ''
})

const send = async () => {
  try {
    await api.post('/feedback', form.value)
    alert('Отправлено')

    form.value = {
      name: '',
      email: '',
      message: ''
    }
  } catch (e) {
    console.log(e)
    alert('Ошибка отправки')
  }
}
</script>