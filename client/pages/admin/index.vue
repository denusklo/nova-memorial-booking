<template>
    <div>
        <h1 class="text-2xl font-bold mb-6">管理员仪表盘</h1>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <!-- Bookings Stats -->
            <div class="bg-white rounded-sm p-6 shadow-md border border-gray-200">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-gray-500 text-sm font-medium">预约总数</p>
                        <p class="text-3xl font-bold text-gray-800">{{ stats.totalBookings }}</p>
                    </div>
                    <div class="bg-amber-100 p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                </div>
                <div class="mt-4">
                    <div class="flex justify-between">
                        <p class="text-sm text-gray-500">今日预约</p>
                        <p class="text-sm font-semibold text-gray-700">{{ stats.todayBookings }}</p>
                    </div>
                    <div class="flex justify-between mt-1">
                        <p class="text-sm text-gray-500">待确认</p>
                        <p class="text-sm font-semibold text-amber-600">{{ stats.pendingBookings }}</p>
                    </div>
                </div>
            </div>

            <!-- Services Stats -->
            <div class="bg-white rounded-sm p-6 shadow-md border border-gray-200">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-gray-500 text-sm font-medium">服务总数</p>
                        <p class="text-3xl font-bold text-gray-800">{{ stats.totalServices }}</p>
                    </div>
                    <div class="bg-green-100 p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                </div>
                <div class="mt-4">
                    <div class="flex justify-between">
                        <p class="text-sm text-gray-500">最受欢迎</p>
                        <p class="text-sm font-semibold text-gray-700">{{ stats.mostPopularService }}</p>
                    </div>
                </div>
            </div>

            <!-- Assets Stats -->
            <div class="bg-white rounded-sm p-6 shadow-md border border-gray-200">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-gray-500 text-sm font-medium">资源总数</p>
                        <p class="text-3xl font-bold text-gray-800">{{ stats.totalAssets }}</p>
                    </div>
                    <div class="bg-purple-100 p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                </div>
                <div class="mt-4">
                    <div class="flex justify-between">
                        <p class="text-sm text-gray-500">总存储空间</p>
                        <p class="text-sm font-semibold text-gray-700">{{ formatFileSize(stats.totalAssetsSize) }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Recent Bookings -->
        <div class="bg-white rounded-sm p-6 shadow-md border border-gray-200 mb-8">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-semibold text-gray-800">最近预约</h2>
                <NuxtLink to="/admin/bookings" class="text-amber-600 hover:text-amber-500 text-sm font-medium">
                    查看全部
                </NuxtLink>
            </div>

            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th class="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                预约日期
                            </th>
                            <th class="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                服务类型
                            </th>
                            <th class="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                客户
                            </th>
                            <th class="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                状态
                            </th>
                            <th class="px-4 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                操作
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="booking in recentBookings" :key="booking.id" class="hover:bg-gray-50">
                            <td class="px-4 py-3 whitespace-nowrap">
                                <div class="text-sm font-medium text-gray-900">{{ formatDate(booking.booking_date) }}</div>
                                <div class="text-xs text-gray-500">{{ booking.start_time }} - {{ booking.end_time }}</div>
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap">
                                <div class="text-sm text-gray-900">{{ booking.service.name }}</div>
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap">
                                <div class="text-sm text-gray-900">{{ booking.user ? booking.user.email : booking.guest_name }}</div>
                                <div class="text-xs text-gray-500">{{ booking.guest_phone || '-' }}</div>
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap">
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                                      :class="{
                                        'bg-yellow-100 text-yellow-800': booking.status === 'pending',
                                        'bg-green-100 text-green-800': booking.status === 'confirmed',
                                        'bg-red-100 text-red-800': booking.status === 'cancelled',
                                        'bg-blue-100 text-blue-800': booking.status === 'completed'
                                      }">
                                    {{ translateStatus(booking.status) }}
                                </span>
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                <NuxtLink :to="`/admin/bookings/${booking.id}`" class="text-amber-600 hover:text-amber-500 mr-2">
                                    查看
                                </NuxtLink>
                            </td>
                        </tr>
                        <tr v-if="recentBookings.length === 0">
                            <td colspan="5" class="px-4 py-3 text-sm text-gray-500 text-center">暂无预约记录</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-sm p-6 shadow-md border border-gray-200">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">快捷操作</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <NuxtLink to="/admin/bookings/new" class="flex flex-col items-center p-4 bg-amber-50 hover:bg-amber-100 rounded-sm border border-amber-200 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-amber-700 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span class="text-sm font-medium text-gray-700">创建预约</span>
                </NuxtLink>
                <NuxtLink to="/admin/services/new" class="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-sm border border-green-200 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-700 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span class="text-sm font-medium text-gray-700">添加服务</span>
                </NuxtLink>
                <NuxtLink to="/admin/assets/upload" class="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-sm border border-purple-200 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-700 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span class="text-sm font-medium text-gray-700">上传资源</span>
                </NuxtLink>
                <a href="/" target="_blank" class="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-sm border border-blue-200 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-700 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span class="text-sm font-medium text-gray-700">访问前台</span>
                </a>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// The useSupabaseClient will be auto-imported by Nuxt

definePageMeta({
    layout: 'admin',
    middleware: 'admin'
})

const supabase = useSupabaseClient()

// Data
const stats = ref({
    totalBookings: 0,
    todayBookings: 0,
    pendingBookings: 0,
    totalServices: 0,
    mostPopularService: '-',
    totalAssets: 0,
    totalAssetsSize: 0
})

const recentBookings = ref([])

// Format date (YYYY-MM-DD to YYYY年MM月DD日)
const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return `${date.getFullYear()}年${(date.getMonth() + 1).toString().padStart(2, '0')}月${date.getDate().toString().padStart(2, '0')}日`
}

// Format file size
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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

// Fetch dashboard data on component mount
onMounted(fetchDashboardData)

async function fetchDashboardData() {
    try {
        // Fetch total bookings
        const { count: totalBookings, error: bookingsError } = await supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })

        if (bookingsError) throw bookingsError
        stats.value.totalBookings = totalBookings

        // Fetch today's bookings
        const today = new Date().toISOString().split('T')[0]
        const { count: todayBookings, error: todayBookingsError } = await supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .eq('booking_date', today)

        if (todayBookingsError) throw todayBookingsError
        stats.value.todayBookings = todayBookings

        // Fetch pending bookings
        const { count: pendingBookings, error: pendingBookingsError } = await supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending')

        if (pendingBookingsError) throw pendingBookingsError
        stats.value.pendingBookings = pendingBookings

        // Fetch total services
        const { count: totalServices, error: servicesError } = await supabase
            .from('services')
            .select('*', { count: 'exact', head: true })

        if (servicesError) throw servicesError
        stats.value.totalServices = totalServices

        // Fetch most popular service
        const { data: popularService, error: popularServiceError } = await supabase
            .from('bookings')
            .select('service_id, services(name)')
            .not('status', 'eq', 'cancelled')
            .order('service_id', { ascending: false })

        if (!popularServiceError && popularService.length > 0) {
            // Count occurrences of each service
            const serviceCounts = {}
            popularService.forEach(booking => {
                if (booking.service_id) {
                    serviceCounts[booking.service_id] = (serviceCounts[booking.service_id] || 0) + 1
                }
            })

            // Find the most frequent service
            let maxCount = 0
            let mostPopularId = null
            
            for (const [serviceId, count] of Object.entries(serviceCounts)) {
                if (count > maxCount) {
                    maxCount = count
                    mostPopularId = serviceId
                }
            }

            if (mostPopularId) {
                const popularServiceItem = popularService.find(item => item.service_id === mostPopularId)
                if (popularServiceItem && popularServiceItem.services) {
                    stats.value.mostPopularService = popularServiceItem.services.name
                }
            }
        }

        // Fetch total assets
        const { count: totalAssets, error: assetsError } = await supabase
            .from('assets')
            .select('*', { count: 'exact', head: true })

        if (assetsError) throw assetsError
        stats.value.totalAssets = totalAssets

        // Fetch total assets size
        const { data: assets, error: assetsSizeError } = await supabase
            .from('assets')
            .select('size')

        if (!assetsSizeError && assets.length > 0) {
            stats.value.totalAssetsSize = assets.reduce((total, asset) => total + (asset.size || 0), 0)
        }

        // Fetch recent bookings
        const { data: bookings, error: recentBookingsError } = await supabase
            .from('bookings')
            .select(`
                id, 
                booking_date, 
                start_time, 
                end_time, 
                status, 
                guest_name,
                guest_phone,
                user:user_id(email),
                service:service_id(name)
            `)
            .order('created_at', { ascending: false })
            .limit(5)

        if (recentBookingsError) throw recentBookingsError
        recentBookings.value = bookings
    } catch (error) {
        console.error('Error fetching dashboard data:', error)
    }
}
</script>