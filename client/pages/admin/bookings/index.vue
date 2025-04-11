<template>
    <div>
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold">预约管理</h1>
            <NuxtLink to="/admin/bookings/new" class="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-sm transition-colors">
                添加预约
            </NuxtLink>
        </div>

        <!-- Filters -->
        <div class="bg-white p-4 rounded-sm shadow-md border border-gray-200 mb-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label for="date-filter" class="block text-sm font-medium text-gray-700 mb-1">日期范围</label>
                    <select id="date-filter" v-model="filters.dateRange" @change="applyFilters" class="w-full p-2 border border-gray-300 rounded-sm">
                        <option value="all">全部</option>
                        <option value="today">今天</option>
                        <option value="tomorrow">明天</option>
                        <option value="this-week">本周</option>
                        <option value="next-week">下周</option>
                        <option value="this-month">本月</option>
                    </select>
                </div>
                <div>
                    <label for="status-filter" class="block text-sm font-medium text-gray-700 mb-1">状态</label>
                    <select id="status-filter" v-model="filters.status" @change="applyFilters" class="w-full p-2 border border-gray-300 rounded-sm">
                        <option value="all">全部</option>
                        <option value="pending">待确认</option>
                        <option value="confirmed">已确认</option>
                        <option value="cancelled">已取消</option>
                        <option value="completed">已完成</option>
                    </select>
                </div>
                <div>
                    <label for="service-filter" class="block text-sm font-medium text-gray-700 mb-1">服务类型</label>
                    <select id="service-filter" v-model="filters.serviceId" @change="applyFilters" class="w-full p-2 border border-gray-300 rounded-sm">
                        <option value="all">全部</option>
                        <option v-for="service in services" :key="service.id" :value="service.id">
                            {{ service.name }}
                        </option>
                    </select>
                </div>
                <div>
                    <label for="search" class="block text-sm font-medium text-gray-700 mb-1">搜索</label>
                    <input type="text" id="search" v-model="filters.search" @input="applyFilters" class="w-full p-2 border border-gray-300 rounded-sm" placeholder="搜索姓名、邮箱或电话" />
                </div>
            </div>
        </div>

        <!-- Bookings Table -->
        <div class="bg-white rounded-sm shadow-md border border-gray-200 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                预约信息
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                服务类型
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                客户信息
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                状态
                            </th>
                            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                操作
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="booking in bookings" :key="booking.id" class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium text-gray-900">
                                    {{ formatDate(booking.booking_date) }}
                                </div>
                                <div class="text-sm text-gray-500">
                                    {{ booking.start_time }} - {{ booking.end_time }}
                                </div>
                                <div class="text-xs text-gray-500">
                                    ID: {{ booking.id.substring(0, 8) }}...
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900">{{ booking.service ? booking.service.name : '-' }}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium text-gray-900">
                                    {{ booking.user ? booking.user.email : booking.guest_name }}
                                </div>
                                <div class="text-sm text-gray-500">
                                    {{ booking.guest_phone || '无电话' }}
                                </div>
                                <div class="text-xs text-gray-500">
                                    {{ booking.user ? '注册用户' : '访客' }}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                                      :class="{
                                        'bg-yellow-100 text-yellow-800': booking.status === 'pending',
                                        'bg-green-100 text-green-800': booking.status === 'confirmed',
                                        'bg-red-100 text-red-800': booking.status === 'cancelled',
                                        'bg-blue-100 text-blue-800': booking.status === 'completed'
                                      }">
                                    {{ translateStatus(booking.status) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button v-if="booking.status === 'pending'" @click="updateStatus(booking.id, 'confirmed')" class="text-green-600 hover:text-green-900 mr-2">
                                    确认
                                </button>
                                <button v-if="['pending', 'confirmed'].includes(booking.status)" @click="updateStatus(booking.id, 'cancelled')" class="text-red-600 hover:text-red-900 mr-2">
                                    取消
                                </button>
                                <button v-if="booking.status === 'confirmed'" @click="updateStatus(booking.id, 'completed')" class="text-blue-600 hover:text-blue-900 mr-2">
                                    完成
                                </button>
                                <NuxtLink :to="`/admin/bookings/${booking.id}`" class="text-amber-600 hover:text-amber-900">
                                    查看
                                </NuxtLink>
                            </td>
                        </tr>
                        <tr v-if="bookings.length === 0">
                            <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
                                <div class="py-8">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p class="text-base">未找到预约记录</p>
                                    <p class="text-gray-400 mt-1">尝试调整筛选条件或创建新的预约</p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div class="flex justify-between items-center">
                    <div class="text-sm text-gray-700">
                        显示 <span class="font-medium">{{ bookings.length }}</span> 条记录，
                        共 <span class="font-medium">{{ totalBookings }}</span> 条
                    </div>
                    <div class="flex">
                        <button @click="changePage(-1)" :disabled="page === 1" class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                            上一页
                        </button>
                        <button @click="changePage(1)" :disabled="page * perPage >= totalBookings" class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                            下一页
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
// Supabase composables will be auto-imported by Nuxt

definePageMeta({
    layout: 'admin'
})

const supabase = useSupabaseClient()

// State
const bookings = ref([])
const services = ref([])
const totalBookings = ref(0)
const page = ref(1)
const perPage = ref(10)
const filters = ref({
    dateRange: 'all',
    status: 'all',
    serviceId: 'all',
    search: ''
})

// Format date (YYYY-MM-DD to YYYY年MM月DD日)
const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return `${date.getFullYear()}年${(date.getMonth() + 1).toString().padStart(2, '0')}月${date.getDate().toString().padStart(2, '0')}日`
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

// Fetch bookings
const fetchBookings = async () => {
    try {
        let query = supabase
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
                notes,
                user:user_id(email),
                service:service_id(name, duration, price)
            `)

        // Apply filters
        if (filters.value.status !== 'all') {
            query = query.eq('status', filters.value.status)
        }

        if (filters.value.serviceId !== 'all') {
            query = query.eq('service_id', filters.value.serviceId)
        }

        if (filters.value.dateRange !== 'all') {
            const dateFilters = getDateRangeFilter(filters.value.dateRange)
            if (dateFilters.from) {
                query = query.gte('booking_date', dateFilters.from)
            }
            if (dateFilters.to) {
                query = query.lte('booking_date', dateFilters.to)
            }
        }

        if (filters.value.search) {
            query = query.or(`guest_name.ilike.%${filters.value.search}%,guest_email.ilike.%${filters.value.search}%,guest_phone.ilike.%${filters.value.search}%`)
        }

        // Count total (for pagination)
        const { count } = await query.count()
        totalBookings.value = count

        // Fetch paginated results
        const { data, error } = await query
            .order('booking_date', { ascending: true })
            .range((page.value - 1) * perPage.value, page.value * perPage.value - 1)

        if (error) throw error
        bookings.value = data
    } catch (error) {
        console.error('Error fetching bookings:', error)
    }
}

// Fetch all services for filter
const fetchServices = async () => {
    try {
        const { data, error } = await supabase
            .from('services')
            .select('id, name')
            .order('name')

        if (error) throw error
        services.value = data
    } catch (error) {
        console.error('Error fetching services:', error)
    }
}

// Get date range filter
const getDateRangeFilter = (range) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    switch (range) {
        case 'today':
            return {
                from: today.toISOString().split('T')[0],
                to: today.toISOString().split('T')[0]
            }
        case 'tomorrow':
            const tomorrow = new Date(today)
            tomorrow.setDate(tomorrow.getDate() + 1)
            return {
                from: tomorrow.toISOString().split('T')[0],
                to: tomorrow.toISOString().split('T')[0]
            }
        case 'this-week': {
            const firstDay = new Date(today)
            const day = today.getDay()
            const diff = today.getDate() - day + (day === 0 ? -6 : 1) // Adjust for Sunday
            firstDay.setDate(diff)

            const lastDay = new Date(firstDay)
            lastDay.setDate(lastDay.getDate() + 6)

            return {
                from: firstDay.toISOString().split('T')[0],
                to: lastDay.toISOString().split('T')[0]
            }
        }
        case 'next-week': {
            const firstDay = new Date(today)
            const day = today.getDay()
            const diff = today.getDate() - day + (day === 0 ? -6 : 1) + 7 // Next week's Monday
            firstDay.setDate(diff)

            const lastDay = new Date(firstDay)
            lastDay.setDate(lastDay.getDate() + 6)

            return {
                from: firstDay.toISOString().split('T')[0],
                to: lastDay.toISOString().split('T')[0]
            }
        }
        case 'this-month': {
            const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
            const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)

            return {
                from: firstDay.toISOString().split('T')[0],
                to: lastDay.toISOString().split('T')[0]
            }
        }
        default:
            return {}
    }
}

// Apply filters and reset to page 1
const applyFilters = () => {
    page.value = 1
    fetchBookings()
}

// Change page
const changePage = (increment) => {
    page.value = Math.max(1, page.value + increment)
    fetchBookings()
}

// Update booking status
const updateStatus = async (bookingId, newStatus) => {
    try {
        const { error } = await supabase
            .from('bookings')
            .update({ status: newStatus })
            .eq('id', bookingId)

        if (error) throw error
        
        // Refresh data
        fetchBookings()
    } catch (error) {
        console.error('Error updating booking status:', error)
    }
}

// Initialize
onMounted(() => {
    fetchServices()
    fetchBookings()
})
</script>