<template>
  <div style="padding: 20px">
    <h1>Вход</h1>

    <input v-model="email" placeholder="email" />
    <br />
    <input v-model="password" type="password" placeholder="password" />
    <br />

    <button @click="login">Войти</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../api'
import { useAuthStore } from '../store/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()
const auth = useAuthStore()

const login = async () => {
  try {
    const res = await api.post('/auth/login', {
      email: email.value,
      password: password.value
    })

    auth.setToken(res.data.token)

    await router.push('/')
  } catch (e) {
    console.log('Login error', e)
  }
}
</script>