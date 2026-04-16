<template>
  <div class="min-h-screen flex items-center justify-center bg-background p-6">
    <div class="w-full max-w-md bg-white p-10 rounded-2xl shadow-sm border border-line">
      <div class="text-center mb-10">
        <div
            class="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
          К
        </div>
        <h2 class="text-2xl font-bold text-ink">Регистрация</h2>
        <p class="text-sm text-muted mt-2">Создайте аккаунт для доступа к курсам</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-5">
        <div>
          <label class="block text-sm font-semibold mb-2">ФИО</label>
          <input
              v-model="fullName"
              type="text"
              required
              class="w-full px-4 py-3 rounded-lg border border-line focus:outline-none focus:border-primary text-sm"
              placeholder="Иванов Иван Иванович"
          />
        </div>
        <div>
          <label class="block text-sm font-semibold mb-2">Email</label>
          <input
              v-model="email"
              type="email"
              required
              class="w-full px-4 py-3 rounded-lg border border-line focus:outline-none focus:border-primary text-sm"
              placeholder="example@mail.ru"
          />
        </div>
        <div>
          <label class="block text-sm font-semibold mb-2">Пароль</label>
          <input
              v-model="password"
              type="password"
              required
              class="w-full px-4 py-3 rounded-lg border border-line focus:outline-none focus:border-primary text-sm"
              placeholder="••••••••"
          />
        </div>

        <div v-if="error" class="text-red-600 text-xs font-medium">
          {{ error }}
        </div>

        <button
            type="submit"
            class="w-full btn-primary py-3"
            :disabled="loading"
        >
          {{ loading ? 'Загрузка...' : 'Зарегистрироваться' }}
        </button>
      </form>

      <div class="mt-8 text-center text-sm">
        <span class="text-muted">Уже есть аккаунт?</span>
        <router-link to="/login" class="text-primary font-semibold ml-1 hover:underline">Войти</router-link>
      </div>
    </div>
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
const error = ref('');
const loading = ref(false);

const router = useRouter()
const auth = useAuthStore()

const handleRegister = async () => {
  try {
    loading.value = true;
    error.value = '';

    const res = await api.post('/auth/register', {
      fullName: fullName.value,
      email: email.value,
      password: password.value
    })

    auth.setToken(res.data.token)

    await router.push('/')
  } catch (err) {
    error.value = err.response?.data?.error || 'Ошибка при регистрации';
  } finally {
    loading.value = false;
  }
}
</script>