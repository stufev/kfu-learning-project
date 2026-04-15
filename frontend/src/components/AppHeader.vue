<template>
  <header style="padding: 15px; display: flex; gap: 15px; border-bottom: 1px solid #ccc;">

    <router-link to="/">Курсы</router-link>

    <router-link v-if="auth.isAuth" to="/my">Мои курсы</router-link>

    <router-link v-if="auth.isAuth" to="/profile">
      Профиль
    </router-link>

    <router-link to="/feedback">Обратная связь</router-link>

    <router-link v-if="!auth.isAuth" to="/login">Вход</router-link>
    <router-link v-if="!auth.isAuth" to="/register">Регистрация</router-link>

    <button v-if="auth.isAuth" @click="logout">
      Выйти
    </button>

  </header>
</template>

<script setup>
import { useAuthStore } from '../store/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const logout = () => {
  auth.logout()
  localStorage.removeItem('token')
  router.push('/login')
}
</script>