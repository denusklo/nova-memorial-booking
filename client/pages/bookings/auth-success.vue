// client/pages/booking/auth-success.vue
<template>
  <div class="bg-black text-white min-h-screen flex items-center justify-center">
    <div class="max-w-md w-full p-8 bg-gray-800 rounded-sm border border-gray-700">
      <div class="text-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 class="text-2xl font-bold text-amber-400">Google 日历已连接</h1>
        <p class="text-gray-300 mt-2">您的预约将添加到您的 Google 日历</p>
      </div>
      
      <div class="mt-6">
        <button @click="saveTokensAndContinue" class="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-sm transition-colors">
          继续
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const saveTokensAndContinue = async () => {
  try {
    // Get tokens from query params
    const accessToken = route.query.access_token
    const refreshToken = route.query.refresh_token
    const expiryDate = route.query.expiry_date
    
    if (!accessToken) {
      throw new Error('Missing access token')
    }
    
    // If user is logged in, save tokens to database
    if (user.value) {
      await supabase
        .from('user_google_tokens')
        .upsert({
          user_id: user.value.id,
          access_token: accessToken,
          refresh_token: refreshToken || null,
          expiry_date: expiryDate ? new Date(Number(expiryDate)).toISOString() : null
        })
    }
    
    // Get pending booking ID if any
    const pendingBookingId = localStorage.getItem('pendingBookingId')
    
    if (pendingBookingId) {
      // Add to calendar if there was a pending booking
      await fetch('/api/calendar/add-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bookingId: pendingBookingId })
      })
      
      localStorage.removeItem('pendingBookingId')
      router.push('/booking/confirmation')
    } else {
      // No pending booking, just go to homepage
      router.push('/')
    }
  } catch (error) {
    console.error('Error saving tokens:', error)
    alert('保存令牌时出错，请稍后再试')
  }
}
</script>