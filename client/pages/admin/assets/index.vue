<template>
    <div>
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold">资源管理</h1>
            <NuxtLink to="/admin/assets/upload"
                class="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-sm transition-colors">
                上传资源
            </NuxtLink>
        </div>

        <!-- Filters -->
        <div class="bg-white p-4 rounded-sm shadow-md border border-gray-200 mb-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label for="type-filter" class="block text-sm font-medium text-gray-700 mb-1">文件类型</label>
                    <select id="type-filter" v-model="filters.mimeType" @change="applyFilters"
                        class="w-full p-2 border border-gray-300 rounded-sm">
                        <option value="all">全部</option>
                        <option value="image">图片</option>
                        <option value="document">文档</option>
                        <option value="other">其他</option>
                    </select>
                </div>
                <div>
                    <label for="date-filter" class="block text-sm font-medium text-gray-700 mb-1">上传日期</label>
                    <select id="date-filter" v-model="filters.dateRange" @change="applyFilters"
                        class="w-full p-2 border border-gray-300 rounded-sm">
                        <option value="all">全部</option>
                        <option value="today">今天</option>
                        <option value="this-week">本周</option>
                        <option value="this-month">本月</option>
                    </select>
                </div>
                <div>
                    <label for="search" class="block text-sm font-medium text-gray-700 mb-1">搜索</label>
                    <input type="text" id="search" v-model="filters.search" @input="applyFilters"
                        class="w-full p-2 border border-gray-300 rounded-sm" placeholder="搜索文件名" />
                </div>
            </div>
        </div>

        <!-- Assets Grid -->
        <div v-if="loading" class="text-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <p class="text-gray-500">加载中...</p>
        </div>

        <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-sm mb-6">
            <p>{{ error }}</p>
            <button @click="fetchAssets" class="mt-2 text-red-600 hover:text-red-800 underline">重试</button>
        </div>

        <div v-else-if="assets.length === 0"
            class="bg-white rounded-sm shadow-md border border-gray-200 p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h2 class="text-xl font-medium text-gray-700 mb-2">暂无资源</h2>
            <p class="text-gray-500 mb-4">上传一些图片或文档开始使用</p>
            <NuxtLink to="/admin/assets/upload"
                class="inline-block px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-sm transition-colors">
                上传第一个资源
            </NuxtLink>

        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div v-for="asset in assets" :key="asset.id"
                class="bg-white rounded-sm shadow-md border border-gray-200 overflow-hidden">
                <!-- Preview -->
                <div class="h-40 bg-gray-100 flex items-center justify-center border-b border-gray-200">
                    <img v-if="isImage(asset.mime_type)" :src="getAssetUrl(asset)"
                        class="max-h-full max-w-full object-contain" />
                    <div v-else class="text-center">
                        <div class="w-12 h-12 bg-gray-200 rounded-sm flex items-center justify-center mx-auto mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <p class="text-xs text-gray-500">{{ getFileExtension(asset.filename) }}</p>
                    </div>
                </div>

                <!-- Details -->
                <div class="p-4">
                    <h3 class="text-sm font-medium text-gray-800 truncate" :title="asset.filename">
                        {{ asset.filename }}
                    </h3>
                    <p class="text-xs text-gray-500 mt-1">
                        {{ formatFileSize(asset.size) }} · {{ formatDate(asset.created_at) }}
                    </p>
                </div>

                <!-- Actions -->
                <div class="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between">
                    <a :href="getAssetUrl(asset)" target="_blank" class="text-amber-600 hover:text-amber-500 text-sm">
                        查看
                    </a>
                    <button @click="confirmDelete(asset)" class="text-red-600 hover:text-red-500 text-sm">
                        删除
                    </button>
                </div>
            </div>
        </div>

        <!-- Pagination -->
        <div v-if="assets.length > 0" class="mt-6 bg-white px-4 py-3 border border-gray-200 rounded-sm shadow-md">
            <div class="flex justify-between items-center">
                <div class="text-sm text-gray-700">
                    显示 <span class="font-medium">{{ assets.length }}</span> 条记录，
                    共 <span class="font-medium">{{ totalAssets }}</span> 条
                </div>
                <div class="flex">
                    <button @click="changePage(-1)" :disabled="page === 1"
                        class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                        上一页
                    </button>
                    <button @click="changePage(1)" :disabled="page * perPage >= totalAssets"
                        class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                        下一页
                    </button>
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-sm shadow-lg max-w-md w-full p-6">
                <h3 class="text-lg font-bold text-gray-800 mb-4">确认删除</h3>
                <p class="text-gray-600 mb-6">确定要删除文件 "{{ selectedAsset ? selectedAsset.filename : '' }}" 吗？此操作无法撤销。</p>
                <div class="flex justify-end space-x-3">
                    <button @click="showDeleteModal = false"
                        class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-sm transition-colors">
                        取消
                    </button>
                    <button @click="deleteAsset"
                        class="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-sm transition-colors">
                        删除
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// Supabase composables will be auto-imported by Nuxt

definePageMeta({
    layout: 'admin'
})

const supabase = useSupabaseClient()

// State
const assets = ref([])
const loading = ref(true)
const error = ref('')
const totalAssets = ref(0)
const page = ref(1)
const perPage = ref(12)
const filters = ref({
    mimeType: 'all',
    dateRange: 'all',
    search: ''
})

// Delete modal state
const showDeleteModal = ref(false)
const selectedAsset = ref(null)

// Fetch assets
const fetchAssets = async () => {
    try {
        loading.value = true
        error.value = ''

        let query = supabase
            .from('assets')
            .select('*', { count: 'exact' })

        // Apply MIME type filter
        if (filters.value.mimeType !== 'all') {
            if (filters.value.mimeType === 'image') {
                query = query.ilike('mime_type', 'image/%')
            } else if (filters.value.mimeType === 'document') {
                query = query.or('mime_type.ilike.application/pdf,mime_type.ilike.application/msword,mime_type.ilike.application/vnd.openxmlformats-officedocument.%')
            } else if (filters.value.mimeType === 'other') {
                query = query.not('mime_type', 'ilike', 'image/%')
                    .not('mime_type', 'ilike', 'application/pdf')
                    .not('mime_type', 'ilike', 'application/msword')
                    .not('mime_type', 'ilike', 'application/vnd.openxmlformats-officedocument.%')
            }
        }

        // Apply date range filter
        if (filters.value.dateRange !== 'all') {
            const dateFilter = getDateRangeFilter(filters.value.dateRange)
            if (dateFilter.from) {
                query = query.gte('created_at', dateFilter.from)
            }
            if (dateFilter.to) {
                query = query.lte('created_at', dateFilter.to)
            }
        }

        // Apply search filter
        if (filters.value.search) {
            query = query.ilike('filename', `%${filters.value.search}%`)
        }

        // Count total (for pagination)
        const { count } = await query.count()
        totalAssets.value = count

        // Fetch paginated results
        const { data, error: fetchError } = await query
            .order('created_at', { ascending: false })
            .range((page.value - 1) * perPage.value, page.value * perPage.value - 1)

        if (fetchError) throw fetchError
        assets.value = data
    } catch (err) {
        error.value = err.message || '加载资源失败'
        console.error('Error fetching assets:', err)
    } finally {
        loading.value = false
    }
}

// Apply filters and reset to page 1
const applyFilters = () => {
    page.value = 1
    fetchAssets()
}

// Change page
const changePage = (increment) => {
    page.value = Math.max(1, page.value + increment)
    fetchAssets()
}

// Check if asset is an image
const isImage = (mimeType) => {
    return mimeType && mimeType.startsWith('image/')
}

// Get file extension
const getFileExtension = (filename) => {
    return filename.split('.').pop().toUpperCase()
}

// Format file size
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Format date
const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`
}

// Get date range filter
const getDateRangeFilter = (range) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    switch (range) {
        case 'today':
            return {
                from: today.toISOString(),
                to: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString()
            }
        case 'this-week': {
            const firstDay = new Date(today)
            const day = today.getDay()
            const diff = today.getDate() - day + (day === 0 ? -6 : 1) // Adjust for Sunday
            firstDay.setDate(diff)

            return {
                from: firstDay.toISOString(),
                to: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
            }
        }
        case 'this-month': {
            const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
            const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)

            return {
                from: firstDay.toISOString(),
                to: new Date(lastDay.getTime() + 24 * 60 * 60 * 1000).toISOString()
            }
        }
        default:
            return {}
    }
}

// Get asset URL
const getAssetUrl = (asset) => {
    // For now, we're storing in local directory
    return `${window.location.origin}/upload/admin/asset/${asset.filename}`
}

// Confirm delete
const confirmDelete = (asset) => {
    selectedAsset.value = asset
    showDeleteModal.value = true
}

// Delete asset
const deleteAsset = async () => {
    try {
        if (!selectedAsset.value) return

        // Delete from database
        const { error: deleteError } = await supabase
            .from('assets')
            .delete()
            .eq('id', selectedAsset.value.id)

        if (deleteError) throw deleteError

        // TODO: Delete actual file from storage
        // This would typically involve a server endpoint or direct cloud storage integration

        // Close modal and refresh list
        showDeleteModal.value = false
        selectedAsset.value = null
        fetchAssets()
    } catch (err) {
        error.value = err.message || '删除资源失败'
        console.error('Error deleting asset:', err)
    }
}

// Initialize
onMounted(() => {
    fetchAssets()
})
</script>