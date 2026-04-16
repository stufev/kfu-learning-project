<template>
  <div class="max-w-2xl">
    <div class="card-shadow p-8">
      <h2 class="text-xl font-bold mb-2">Связаться с нами</h2>
      <p class="text-muted mb-8">Если у вас возникли вопросы по работе системы или содержанию курсов, пожалуйста,
        заполните форму ниже.</p>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-semibold mb-2">Ваше имя</label>
            <input
                v-model="form.name"
                type="text"
                required
                class="w-full px-4 py-3 rounded-lg border border-line focus:outline-none focus:border-primary text-sm"
                placeholder="Иван Иванов"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold mb-2">Email для связи</label>
            <input
                v-model="form.email"
                type="email"
                required
                class="w-full px-4 py-3 rounded-lg border border-line focus:outline-none focus:border-primary text-sm"
                placeholder="example@mail.ru"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm font-semibold mb-2">Сообщение</label>
          <textarea
              v-model="form.message"
              required
              rows="5"
              class="w-full px-4 py-3 rounded-lg border border-line focus:outline-none focus:border-primary text-sm resize-none"
              placeholder="Опишите ваш вопрос..."
          ></textarea>
        </div>

        <div v-if="success" class="text-green-600 text-sm font-medium">
          Ваше сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.
        </div>

        <div class="flex justify-end">
          <button
              type="submit"
              class="btn-primary"
              :disabled="loading"
          >
            {{ loading ? 'Отправка...' : 'Отправить сообщение' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import api from '../api'

const loading = ref(false);
const success = ref(false);

const form = ref({
  name: '',
  email: '',
  message: ''
})

const handleSubmit = async () => {
  try {
    loading.value = true;
    success.value = false;

    await api.post('/feedback', form.value)
    success.value = true;

    form.value = {
      name: '',
      email: '',
      message: ''
    }
  } catch (err) {
    console.error(err);
    alert(err)
  } finally {
    loading.value = false;
  }
}
</script>