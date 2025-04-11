<template>
    <div>
        <div class="mb-6 flex justify-between items-center">
            <div class="flex items-center">
                <NuxtLink to="/admin/bookings" class="text-gray-500 hover:text-amber-600 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </NuxtLink>
                <h1 class="text-2xl font-bold">预约详情</h1>
            </div>

            <div class="flex space-x-2">
                <button 
                    v-if="booking.status === 'pending'" 
                    @click="updateStatus('confirmed')"
                    class="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-sm transition-colors">
                    确认预约
                </button>
                <button 
                    v-if="['pending', 'confirmed'].includes(booking.status)" 
                    @click="updateStatus('cancelled')"
                    class="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-sm transition-colors">
                    取消预约
                </button>
                <button 
                    v-if="booking.status === 'confirmed'" 
                    @click="updateStatus('completed')"
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-sm transition-colors">
                    标记完成
                </button>
                <button 
                    v-if="booking.google_calendar_event_id" 
                    @click="syncGoogleCalendar"
                    :disabled="syncing"
                    class="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-sm transition-colors disabled:bg-gray-400">
                    {{ syncing ? '同步中...' : '同步日历' }}
                </button>
            </div>
        </div>

        <div v-if="loading" class="text-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <p class="text-gray-500">加载中...</p>
        </div>

        <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-sm">
            <p>{{ error }}</p>
            <button @click="fetchBooking" class="mt-2 text-red-600 hover:text-red-800 underline">重试</button>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Main Booking Info -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Booking Status Card -->
                <div class="bg-white rounded-sm shadow-md border border-gray-200 p-6">
                    <div class="flex justify-between items-start">
                        <div>
                            <h2 class="text-lg font-bold text-gray-800 mb-2">预约状态</h2>
                            <span class="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full"
                                :class="{
                                    'bg-yellow-100 text-yellow-800': booking.status === 'pending',
                                    'bg-green-100 text-green-800': booking.status === 'confirmed',
                                    'bg-red-100 text-red-800': booking.status === 'cancelled',
                                    'bg-blue-100 text-blue-800': booking.status === 'completed'
                                }">
                                {{ translateStatus(booking.status) }}
                            </span>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">预约编号</span>
                            <p class="text-gray-900 font-mono text-sm">{{ booking.id }}</p>
                        </div>
                    </div>
                </div>

                <!-- Booking Details -->
                <div class="bg-white rounded-sm shadow-md border border-gray-200 p-6">
                    <h2 class="text-lg font-bold text-gray-800 mb-4">预约详情</h2>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 class="text-sm font-medium text-gray-500">服务</h3>
                            <p class="mt-1 text-gray-900">{{ booking.service ? booking.service.name : '-' }}</p>
                        </div>
                        <div>
                            <h3 class="text-sm font-medium text-gray-500">价格</h3>
                            <p class="mt-1 text-amber-600 font-bold">¥{{ booking.service ? booking.service.price : '-' }}</p>
                        </div>
                        <div>
                            <h3 class="text-sm font-medium text-gray-500">日期</h3>
                            <p class="mt-1 text-gray-900">{{ formatDate(booking.booking_date) }}</p>
                        </div>
                        <div>
                            <h3 class="text-sm font-medium text-gray-500">时间</h3>
                            <p class="mt-1 text-gray-900">{{ booking.start_time }} - {{ booking.end_time }}</p>
                        </div>
                        <div>
                            <h3 class="text-sm font-medium text-gray-500">创建时间</h3>
                            <p class="mt-1 text-gray-900">{{ formatDateTime(booking.created_at) }}</p>
                        </div>
                        <div>
                            <h3 class="text-sm font-medium text-gray-500">更新时间</h3>
                            <p class="mt-1 text-gray-900">{{ formatDateTime(booking.updated_at) }}</p>
                        </div>
                    </div>

                    <div class="mt-4">
                        <h3 class="text-sm font-medium text-gray-500">备注</h3>
                        <p class="mt-1 text-gray-900 whitespace-pre-line">{{ booking.notes || '无备注' }}</p>
                    </div>
                </div>

                <!-- Google Calendar Info -->
                <div v-if="booking.google_calendar_event_id" class="bg-white rounded-sm shadow-md border border-gray-200 p-6">
                    <h2 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
                        </svg>
                        Google 日历
                    </h2>
                    
                    <div class="p-3 bg-blue-50 rounded-sm">
                        <p class="text-sm text-gray-800">此预约已添加到 Google 日历</p>
                        <p class="text-xs text-gray-500 mt-1">事件 ID: {{ booking.google_calendar_event_id }}</p>

                        <div class="mt-3 flex justify-end">
                            <a href="#" @click.prevent="openGoogleCalendar" class="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                                <span>在 Google 日历中查看</span>
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Actions History -->
                <div class="bg-white rounded-sm shadow-md border border-gray-200 p-6">
                    <h2 class="text-lg font-bold text-gray-800 mb-4">操作历史</h2>
                    
                    <div class="relative">
                        <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                        
                        <ul class="space-y-4">
                            <li class="ml-6 relative">
                                <div class="absolute -left-6 mt-1.5 w-3 h-3 rounded-full bg-amber-500"></div>
                                <div class="p-3 bg-amber-50 rounded-sm">
                                    <div class="flex justify-between items-start">
                                        <div>
                                            <p class="text-gray-800">预约创建</p>
                                            <p class="text-sm text-gray-500">由 {{ booking.user ? booking.user.email : booking.guest_name }}</p>
                                        </div>
                                        <p class="text-xs text-gray-500">{{ formatDateTime(booking.created_at) }}</p>
                                    </div>
                                </div>
                            </li>
                            
                            <!-- Additional history items would go here in a real implementation -->
                            <li class="ml-6 relative" v-if="booking.updated_at !== booking.created_at">
                                <div class="absolute -left-6 mt-1.5 w-3 h-3 rounded-full bg-blue-500"></div>
                                <div class="p-3 bg-blue-50 rounded-sm">
                                    <div class="flex justify-between items-start">
                                        <div>
                                            <p class="text-gray-800">预约更新</p>
                                            <p class="text-sm text-gray-500">状态更新为 {{ translateStatus(booking.status) }}</p>
                                        </div>
                                        <p class="text-xs text-gray-500">{{ formatDateTime(booking.updated_at) }}</p>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Sidebar Info -->
            <div class="space-y-6">
                <!-- Customer Information -->
                <div class="bg-white rounded-sm shadow-md border border-gray-200 p-6">
                    <h2 class="text-lg font-bold text-gray-800 mb-4">客户信息</h2>
                    
                    <div v-if="booking.user">
                        <div class="flex items-center mb-4">
                            <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-3">
                                {{ booking.user.email.charAt(0).toUpperCase() }}
                            </div>
                            <div>
                                <p class="text-gray-800 font-medium">注册用户</p>
                                <p class="text-gray-500 text-sm">{{ booking.user.email }}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div v-else>
                        <div class="flex items-center mb-4">
                            <div class="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3">
                                {{ booking.guest_name.charAt(0).toUpperCase() }}
                            </div>
                            <div>
                                <p class="text-gray-800 font-medium">访客预约</p>
                                <p class="text-amber-600 text-sm">未注册用户</p>
                            </div>
                        </div>

                        <div class="space-y-2">
                            <div>
                                <h3 class="text-sm font-medium text-gray-500">姓名</h3>
                                <p class="mt-1 text-gray-900">{{ booking.guest_name }}</p>
                            </div>
                            <div>
                                <h3 class="text-sm font-medium text-gray-500">电子邮箱</h3>
                                <p class="mt-1 text-gray-900">{{ booking.guest_email }}</p>
                            </div>
                            <div>
                                <h3 class="text-sm font-medium text-gray-500">联系电话</h3>
                                <p class="mt-1 text-gray-900">{{ booking.guest_phone || '未提供' }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="bg-white rounded-sm shadow-md border border-gray-200 p-6">
                    <h2 class="text-lg font-bold text-gray-800 mb-4">快捷操作</h2>
                    
                    <div class="space-y-3">
                        <button @click="openEmailClient" class="w-full flex items-center justify-center px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-sm transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span>发送邮件</span>
                        </button>
                        
                        <button v-if="booking.guest_phone" @click="callCustomer" class="w-full flex items-center justify-center px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-sm transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span>拨打电话</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// Supabase composables will be auto-imported by Nuxt

definePageMeta({
    layout: 'admin'
})

const supabase = useSupabaseClient()
const route = useRoute()
const router = useRouter()

// State
const booking = ref({})
const loading = ref(true)
const error = ref('')
const syncing = ref(false)

// Format date (YYYY-MM-DD to YYYY年MM月DD日)
const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return `${date.getFullYear()}年${(date.getMonth() + 1).toString().padStart(2, '0')}月${date.getDate().toString().padStart(2, '0')}日`
}

// Format date and time
const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '-'
    const date = new Date(dateTimeString)
    return `${date.getFullYear()}年${(date.getMonth() + 1).toString().padStart(2, '0')}月${date.getDate().toString().padStart(2, '0')}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

// Translate booking status
const translateStatus = (status) => {
    const statusMap = {
        'pending': '待确认',
        'confirmed': '已确认',
        'cancelled': '已取消',
        'completed': '已完成'
    }
    return statusMap[status] || status
}

// Fetch booking details
const fetchBooking = async () => {
    try {
        loading.value = true
        error.value = ''
        
        const { data, error: fetchError } = await supabase
            .from('bookings')
            .select(`
                id, 
                booking_date, 
                start_time, 
                end_time, 
                status, 
                guest_name,
                guest_email,
                guest_phone,
                google_calendar_event_id,
                notes,
                created_at,
                updated_at,
                user:user_id(email),
                service:service_id(name, duration, price)
            `)
            .eq('id', route.params.id)
            .single()
            
        if (fetchError) throw fetchError
        
        if (!data) {
            throw new Error('找不到预约记录')
        }
        
        booking.value = data
    } catch (err) {
        error.value = err.message || '加载预约详情失败'
        console.error('Error fetching booking:', err)
    } finally {
        loading.value = false
    }
}

// Update booking status
const updateStatus = async (newStatus) => {
    try {
        loading.value = true
        
        const { error: updateError } = await supabase
            .from('bookings')
            .update({ status: newStatus })
            .eq('id', booking.value.id)
            
        if (updateError) throw updateError
        
        // Refresh booking data
        await fetchBooking()
    } catch (err) {
        error.value = err.message || '更新预约状态失败'
        console.error('Error updating booking status:', err)
    } finally {
        loading.value = false
    }
}

// Sync with Google Calendar
const syncGoogleCalendar = async () => {
    try {
        syncing.value = true
        
        // TODO: Implement Google Calendar API integration
        // This would typically be handled by a server endpoint
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // For now, we'll just simulate a successful sync
        if (!booking.value.google_calendar_event_id) {
            const { error: updateError } = await supabase
                .from('bookings')
                .update({ 
                    google_calendar_event_id: 'calendar_' + Math.random().toString(36).substring(2, 15) 
                })
                .eq('id', booking.value.id)
                
            if (updateError) throw updateError
            
            // Refresh booking data
            await fetchBooking()
        }
    } catch (err) {
        error.value = err.message || '同步 Google 日历失败'
        console.error('Error syncing with Google Calendar:', err)
    } finally {
        syncing.value = false
    }
}

// Open Google Calendar event
const openGoogleCalendar = () => {
    // In a real implementation, this would open the actual Google Calendar event
    window.open(`https://calendar.google.com`, '_blank')
}

// Open email client
const openEmailClient = () => {
    const email = booking.value.user ? booking.value.user.email : booking.value.guest_email
    const subject = `中华纪念馆 - 预约确认 #${booking.value.id.substring(0, 8)}`
    const body = `尊敬的客户，\n\n您的预约已确认：\n\n服务：${booking.value.service.name}\n日期：${formatDate(booking.value.booking_date)}\n时间：${booking.value.start_time} - ${booking.value.end_time}\n\n如有任何问题，请随时联系我们。\n\n中华纪念馆团队`
    
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

// Call customer
const callCustomer = () => {
    const phone = booking.value.guest_phone
    if (phone) {
        window.location.href = `tel:${phone}`
    }
}

// Initialize
onMounted(() => {
    fetchBooking()
})
</script>