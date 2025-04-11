// client/pages/booking/auth-error.vue
<template>
  <div class="bg-black text-white min-h-screen flex items-center justify-center">
    <div class="max-w-md w-full p-8 bg-gray-800 rounded-sm border border-gray-700">
      <div class="text-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 class="text-2xl font-bold text-amber-400">连接失败</h1>
        <p class="text-gray-300 mt-2">无法连接到 Google 日历</p>
      </div>
      
      <div v-if="error" class="mt-4 p-4 bg-red-900 bg-opacity-30 border border-red-700 rounded-sm">
        <p class="text-red-300 text-sm">{{ error }}</p>
      </div>
      
      <div class="mt-6">
        <button @click="router.push('/')" class="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-sm transition-colors">
          返回首页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const error = ref('')

onMounted(() => {
  error.value = route.query.error || '未知错误'
})
</script>