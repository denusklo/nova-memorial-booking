<template>
    <div>
        <div class="mb-6 flex justify-between items-center">
            <div class="flex items-center">
                <NuxtLink to="/admin/assets" class="text-gray-500 hover:text-amber-600 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </NuxtLink>
                <h1 class="text-2xl font-bold">上传资源</h1>
            </div>
        </div>

        <div class="bg-white rounded-sm shadow-md border border-gray-200 p-6">
            <div v-if="!uploading && !uploadSuccess">
                <!-- Upload Instructions -->
                <div class="text-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-amber-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <h2 class="text-lg font-medium text-gray-800 mb-1">上传文件</h2>
                    <p class="text-gray-500 mb-4">支持图片、文档和其他文件类型</p>
                    <div class="text-xs text-gray-500 max-w-md mx-auto">
                        <p>最大文件大小: 10MB</p>
                        <p>支持的图片格式: JPG, PNG, GIF, WEBP</p>
                        <p>支持的文档格式: PDF, DOC, DOCX, XLS, XLSX</p>
                    </div>
                </div>

                <!-- Upload Area -->
                <div 
                    @dragover.prevent="dragover = true" 
                    @dragleave.prevent="dragover = false"
                    @drop.prevent="onDrop" 
                    :class="`border-2 border-dashed rounded-sm p-8 text-center transition-colors ${dragover ? 'border-amber-500 bg-amber-50' : 'border-gray-300 hover:border-amber-400'}`">
                    <input 
                        type="file" 
                        ref="fileInput" 
                        @change="onFileSelected" 
                        class="hidden" 
                        :accept="acceptedFileTypes" 
                        :multiple="allowMultiple" />
                    
                    <div v-if="selectedFiles.length > 0">
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div v-for="(file, index) in selectedFiles" :key="index" class="flex items-center p-3 border border-gray-200 rounded-sm bg-gray-50">
                                <div class="w-10 h-10 flex-shrink-0 bg-gray-200 rounded-sm flex items-center justify-center mr-3">
                                    <svg v-if="file.type.startsWith('image/')" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-medium text-gray-900 truncate">{{ file.name }}</p>
                                    <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
                                </div>
                                <button @click="removeFile(index)" class="ml-2 text-red-500 hover:text-red-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        <div class="mt-4 flex justify-center">
                            <button @click="clearFiles" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-sm mr-3 transition-colors">
                                清空
                            </button>
                            <button @click="browseFiles" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-sm transition-colors">
                                继续添加
                            </button>
                        </div>
                    </div>
                    
                    <div v-else>
                        <button @click="browseFiles" class="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-sm transition-colors mb-3">
                            选择文件
                        </button>
                        <p class="text-gray-500">或将文件拖放到此区域</p>
                    </div>
                </div>

                <!-- Error Message -->
                <div v-if="error" class="mt-4 p-3 border border-red-300 bg-red-50 text-red-700 rounded-sm">
                    {{ error }}
                </div>

                <!-- Upload Button -->
                <div class="mt-6 flex justify-end">
                    <button 
                        @click="uploadFiles" 
                        :disabled="selectedFiles.length === 0"
                        :class="`px-6 py-3 rounded-sm transition-colors ${selectedFiles.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-amber-600 hover:bg-amber-500 text-white'}`">
                        上传 ({{ selectedFiles.length }} 个文件)
                    </button>
                </div>
            </div>

            <!-- Upload Progress -->
            <div v-else-if="uploading" class="text-center py-8">
                <div class="mb-4 relative pt-1">
                    <div class="flex mb-2 items-center justify-between">
                        <div>
                            <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-amber-600 bg-amber-200">
                                上传中
                            </span>
                        </div>
                        <div class="text-right">
                            <span class="text-xs font-semibold inline-block text-amber-600">
                                {{ Math.round(uploadProgress) }}%
                            </span>
                        </div>
                    </div>
                    <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-amber-200">
                        <div :style="{ width: `${uploadProgress}%` }" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-amber-500 transition-all duration-300"></div>
                    </div>
                </div>
                <p class="text-gray-600">正在上传 {{ currentFileIndex + 1 }}/{{ selectedFiles.length }}: {{ currentFileName }}</p>
            </div>

            <!-- Upload Success -->
            <div v-else class="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 class="text-xl font-bold text-gray-800 mb-2">上传成功</h2>
                <p class="text-gray-600 mb-6">已成功上传 {{ uploadedFiles.length }} 个文件</p>
                
                <div class="flex justify-center space-x-4">
                    <NuxtLink to="/admin/assets" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-sm transition-colors">
                        返回资源列表
                    </NuxtLink>
                    <button @click="resetUpload" class="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-sm transition-colors">
                        继续上传
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
const user = useSupabaseUser()

// File selection
const fileInput = ref(null)
const selectedFiles = ref([])
const dragover = ref(false)
const error = ref('')

// Upload state
const uploading = ref(false)
const uploadSuccess = ref(false)
const uploadProgress = ref(0)
const currentFileIndex = ref(0)
const currentFileName = ref('')
const uploadedFiles = ref([])

// Configuration
const maxFileSize = 10 * 1024 * 1024 // 10MB
const allowMultiple = true
const acceptedFileTypes = '.jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.xls,.xlsx'

// Methods
const browseFiles = () => {
    fileInput.value.click()
}

const onFileSelected = (event) => {
    const files = Array.from(event.target.files)
    addFiles(files)
}

const onDrop = (event) => {
    dragover.value = false
    const files = Array.from(event.dataTransfer.files)
    addFiles(files)
}

const addFiles = (files) => {
    error.value = ''
    
    for (const file of files) {
        // Check file size
        if (file.size > maxFileSize) {
            error.value = `文件"${file.name}"超出最大尺寸限制(10MB)`
            continue
        }
        
        // Add to selected files
        selectedFiles.value.push(file)
    }
}

const removeFile = (index) => {
    selectedFiles.value.splice(index, 1)
}

const clearFiles = () => {
    selectedFiles.value = []
    error.value = ''
}

const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const uploadFiles = async () => {
    if (selectedFiles.value.length === 0) return
    
    uploading.value = true
    uploadProgress.value = 0
    currentFileIndex.value = 0
    uploadedFiles.value = []
    
    try {
        for (let i = 0; i < selectedFiles.value.length; i++) {
            const file = selectedFiles.value[i]
            currentFileIndex.value = i
            currentFileName.value = file.name
            
            // In a real implementation, you'd upload to S3, Supabase Storage, or your server
            // For now, we'll simulate upload and store in the database
            
            // Simulate upload progress
            await simulateUploadProgress()
            
            // Insert record into database
            const { data, error: uploadError } = await supabase
                .from('assets')
                .insert({
                    filename: file.name,
                    path: `/upload/admin/asset/${file.name}`, // Placeholder path
                    size: file.size,
                    mime_type: file.type,
                    uploaded_by: user.value.id
                })
                .select()
            
            if (uploadError) throw uploadError
            
            uploadedFiles.value.push(data[0])
        }
        
        uploadSuccess.value = true
    } catch (err) {
        error.value = err.message || '上传失败'
        console.error('Upload error:', err)
        uploading.value = false
    }
}

const simulateUploadProgress = async () => {
    // Simulate upload progress for demo
    uploadProgress.value = 0
    const increment = 100 / 20 // 20 steps
    
    for (let i = 0; i < 20; i++) {
        await new Promise(resolve => setTimeout(resolve, 100))
        uploadProgress.value += increment
    }
    
    uploadProgress.value = 100
}

const resetUpload = () => {
    selectedFiles.value = []
    uploadSuccess.value = false
    uploading.value = false
    error.value = ''
}
</script>