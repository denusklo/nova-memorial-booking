// client/pages/bookings/confirmation.vue
<template>
  <div class="bg-black min-h-screen flex items-center justify-center p-4">
    <div class="max-w-md w-full p-8 bg-gray-800 rounded-sm border border-gray-700 text-white">
      <div class="text-center mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 class="text-2xl font-bold text-amber-400">预约确认</h1>
        <p class="text-gray-300 mt-2">您的预约已成功提交</p>
      </div>
      
      <div class="space-y-4 mb-8">
        <div v-if="bookingDetails">
          <div class="border-b border-gray-700 pb-3 mb-3">
            <h2 class="text-lg font-medium text-amber-300">预约详情</h2>
          </div>
          
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div class="text-gray-400">服务项目:</div>
            <div>{{ bookingDetails.service?.name || '未指定' }}</div>
            
            <div class="text-gray-400">预约日期:</div>
            <div>{{ formatDate(bookingDetails.date) }}</div>
            
            <div class="text-gray-400">预约时间:</div>
            <div>{{ bookingDetails.timeSlot?.start }} - {{ bookingDetails.timeSlot?.end }}</div>
            
            <div class="text-gray-400">姓名:</div>
            <div>{{ bookingDetails.bookingInfo?.guestName || '未指定' }}</div>
            
            <div class="text-gray-400">电话:</div>
            <div>{{ bookingDetails.bookingInfo?.guestPhone || '未指定' }}</div>
          </div>
        </div>
        
        <div v-else class="text-gray-400 text-center italic">
          预约详情不可用
        </div>
      </div>
      
      <div class="space-y-3">
        <div v-if="calendarStatus.added" class="bg-gray-700 p-3 rounded-sm text-center space-y-2">
          <p class="text-green-400 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            已添加到您的 Google 日历
          </p>
          
          <a v-if="calendarStatus.eventLink" 
             :href="calendarStatus.eventLink" 
             target="_blank" 
             class="text-amber-400 text-sm underline hover:text-amber-300">
            在 Google 日历中查看
          </a>
        </div>
        
        <button @click="navigateToHome" class="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-sm transition-colors">
          返回首页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const bookingDetails = ref(null)
const calendarStatus = ref({
  added: false,
  eventLink: null,
  error: null
})

// Format date for display
const formatDate = (dateObj) => {
  if (!dateObj || !dateObj.date) return '未指定'
  
  try {
    // Format based on the object structure with year, month, date
    const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
    return `${dateObj.year}年${months[dateObj.month]}${dateObj.date}日`
  } catch (error) {
    console.error('Error formatting date:', error, dateObj)
    return '日期格式错误'
  }
}

// Navigate to home page
const navigateToHome = () => {
  router.push('/')
}

onMounted(() => {
  // Try to load booking details from localStorage if available
  try {
    const storedState = localStorage.getItem('bookingState')
    if (storedState) {
      bookingDetails.value = JSON.parse(storedState)
      console.log('Loaded booking details:', bookingDetails.value)
    }
    
    // Check if we have any info about calendar status
    const calendarAdded = localStorage.getItem('calendarEventAdded')
    if (calendarAdded === 'true') {
      calendarStatus.value.added = true
      
      // Get the calendar event link if available
      const eventLink = localStorage.getItem('calendarEventLink')
      if (eventLink) {
        calendarStatus.value.eventLink = eventLink
      }
    }
    
    // Clean up localStorage
    localStorage.removeItem('bookingState')
    localStorage.removeItem('calendarEventAdded')
    localStorage.removeItem('calendarEventLink')
  } catch (error) {
    console.error('Error loading booking details:', error)
  }
})
</script>