<template>
  <div style="padding: 20px">
    <h1>Регистрация</h1>

    <input v-model="fullName" placeholder="Имя"/>
    <br/>
    <input v-model="email" placeholder="email"/>
    <br/>
    <input v-model="password" type="password" placeholder="password"/>
    <br/>

    <button @click="register">Создать аккаунт</button>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import api from '../api'
import {useRouter} from 'vue-router'
import {useAuthStore} from "@/store/auth.js";

const fullName = ref('')
const email = ref('')
const password = ref('')
const router = useRouter()

const auth = useAuthStore()

const register = async () => {
  try {
    const res = await api.post('/auth/register', {
      fullName: fullName.value,
      email: email.value,
      password: password.value
    })

    auth.setToken(res.data.token)

    await router.push('/')
  } catch (e) {
    console.log('Ошибка регистрации', e)
  }
}
</script>