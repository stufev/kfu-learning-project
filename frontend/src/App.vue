<template>
  <div class="flex h-screen overflow-hidden bg-background">
    <!-- Sidebar -->
    <aside
        class="w-64 bg-white border-r border-line flex flex-col p-8"
        v-if="!isAuthPage"
    >
      <div class="flex items-center gap-3 mb-12">
        <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">
          К
        </div>
        <div>
          <div class="font-bold text-base leading-tight">КФУ</div>
          <div class="text-[10px] text-muted tracking-widest uppercase">Елабуга</div>
        </div>
      </div>

      <nav class="flex-1">
        <ul class="space-y-2">
          <li>
            <router-link to="/" class="nav-item" :class="{ active: $route.path === '/' }">
              Главная
            </router-link>
          </li>
          <li>
            <router-link to="/courses" class="nav-item" :class="{ active: $route.path === '/courses' }">
              Список курсов
            </router-link>
          </li>
          <li v-if="authStore.isAuth">
            <router-link to="/my" class="nav-item" :class="{ active: $route.path === '/my' }">
              Мои курсы
            </router-link>
          </li>
          <li v-if="authStore.isAuth">
            <router-link to="/profile" class="nav-item" :class="{ active: $route.path === '/profile' }">
              Личный кабинет
            </router-link>
          </li>
          <li>
            <router-link to="/feedback" class="nav-item" :class="{ active: $route.path === '/feedback' }">
              Обратная связь
            </router-link>
          </li>
        </ul>
      </nav>

      <div class="mt-auto pt-4 border-t border-line">
        <template v-if="authStore.isAuth">
          <button @click="logout" class="nav-item w-full text-left cursor-pointer">
            Выход
          </button>
        </template>
        <template v-else>
          <router-link to="/login" class="nav-item">
            Вход
          </router-link>
          <router-link to="/register" class="nav-item">
            Регистрация
          </router-link>
        </template>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto p-10">
      <header v-if="!isAuthPage" class="flex justify-between items-start mb-8">
        <div>
          <h1 class="text-2xl font-bold text-ink">{{ pageTitle }}</h1>
          <p class="text-sm text-muted mt-1">Елабужский институт Казанского федерального университета</p>
        </div>

        <div v-if="authStore.isAuth" class="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-line">
          <div class="text-right">
            <div class="text-xs text-muted">Учитель</div>
          </div>
          <div class="w-8 h-8 bg-line rounded-full flex items-center justify-center overflow-hidden">
            🔬
          </div>
        </div>
      </header>

      <router-view/>
    </main>
  </div>
</template>

<script setup>
import {computed} from "vue";
import {useAuthStore} from "@/store/auth.js";
import {useRoute, useRouter} from "vue-router";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const isAuthPage = computed(() => ['/login', '/register'].includes(route.path));

const pageTitle = computed(() => {
  switch (route.path) {
    case '/':
      return 'Главная панель';
    case '/courses':
      return 'Курсы повышения квалификации';
    case '/my':
      return 'Мои учебные программы';
    case '/profile':
      return 'Личный кабинет';
    case '/feedback':
      return 'Служба поддержки';
    default:
      return 'КФУ Елабуга';
  }
});

const logout = () => {
  authStore.logout()
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

