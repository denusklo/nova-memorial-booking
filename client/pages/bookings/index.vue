<template>
    <div class="bg-black text-white min-h-screen">
        <!-- Hero Section -->
        <section class="relative py-20">
            <div class="absolute inset-0 bg-cover bg-center z-0 opacity-30"
                style="background-image: url('https://placehold.co/1920x1080');">
                <div class="absolute inset-0 bg-black bg-opacity-0"></div>
            </div>

            <div class="container mx-auto px-6 relative z-10">
                <div class="text-center mb-16">
                    <h1 class="text-4xl md:text-5xl font-bold mb-4 text-amber-400">预约服务</h1>
                    <p class="text-xl text-amber-200 mb-8">为您所爱的人提供专业的纪念服务</p>
                    <div class="w-24 h-1 bg-amber-500 mx-auto"></div>
                </div>
            </div>
        </section>

        <!-- Booking Form Section -->
        <section class="py-16 bg-gray-900">
            <div class="container mx-auto px-6">
                <div class="max-w-4xl mx-auto">
                    <!-- Steps Indicator -->
                    <div class="mb-10">
                        <div class="flex items-center justify-between">
                            <div v-for="(step, index) in steps" :key="index"
                                class="flex flex-col items-center justify-center w-1/3">
                                <div
                                    :class="`rounded-full w-10 h-10 flex items-center justify-center mb-2 ${currentStep > index ? 'bg-amber-500 text-white' : currentStep === index ? 'bg-amber-400 text-white' : 'bg-gray-700 text-gray-400'}`">
                                    {{ index + 1 }}
                                </div>
                                <div
                                    :class="`text-sm font-medium ${currentStep >= index ? 'text-amber-300' : 'text-gray-500'}`">
                                    {{ step }}
                                </div>
                            </div>
                        </div>
                        <div class="relative flex items-center mt-2">
                            <div class="absolute left-0 right-0 h-1 bg-gray-700"></div>
                            <div class="absolute left-0 h-1 bg-amber-500"
                                :style="{ width: `${(currentStep / (steps.length - 1)) * 100}%` }"></div>
                        </div>
                    </div>

                    <!-- Step 1: Service Selection -->
                    <div v-if="currentStep === 0" class="bg-gray-800 p-8 border border-gray-700 rounded-sm">
                        <h2 class="text-2xl font-bold mb-6 text-amber-400">选择服务类型</h2>

                        <div class="space-y-6">
                            <div v-for="service in services" :key="service.id" @click="selectService(service)"
                                :class="`border-2 p-6 rounded-sm cursor-pointer transition-colors ${selectedService && selectedService.id === service.id ? 'border-amber-500 bg-gray-700' : 'border-gray-600 hover:border-amber-400'}`">
                                <div class="flex justify-between items-start">
                                    <div>
                                        <h3 class="text-xl font-semibold text-white mb-2">{{ service.name }}</h3>
                                        <p class="text-gray-300 mb-4">{{ service.description }}</p>
                                        <div class="flex items-center text-gray-400 mb-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-amber-500"
                                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>时长: {{ service.duration }} 分钟</span>
                                        </div>
                                    </div>
                                    <div class="text-xl font-bold text-amber-400">¥{{ service.price }}</div>
                                </div>
                            </div>



                            <div v-if="services.length === 0" class="text-center py-6">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-500 mx-auto mb-4"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p class="text-gray-400">暂无可预约的服务</p>
                            </div>
                        </div>

                        <div class="flex justify-between mt-8">
                            <NuxtLink to="/contact"
                                class="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-sm transition-colors">
                                返回
                            </NuxtLink>
                            <button @click="nextStep" :disabled="!selectedService"
                                :class="`px-6 py-3 rounded-sm transition-colors ${!selectedService ? 'bg-gray-600 cursor-not-allowed' : 'bg-amber-600 hover:bg-amber-500'}`">
                                下一步
                            </button>
                        </div>
                    </div>

                    <!-- Step 2: Date & Time Selection -->
                    <div v-else-if="currentStep === 1" class="bg-gray-800 p-8 border border-gray-700 rounded-sm">
                        <h2 class="text-2xl font-bold mb-6 text-amber-400">选择日期和时间</h2>

                        <div class="mb-6">
                            <h3 class="text-lg font-semibold text-amber-300 mb-3">已选服务</h3>
                            <div class="p-4 bg-gray-700 rounded-sm border border-gray-600">
                                <div class="flex justify-between">
                                    <div>
                                        <p class="text-white font-medium">{{ selectedService.name }}</p>
                                        <p class="text-gray-400 text-sm">时长: {{ selectedService.duration }} 分钟</p>
                                    </div>
                                    <p class="text-amber-400 font-bold">¥{{ selectedService.price }}</p>
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Date Selection -->
                            <div>
                                <label class="block text-amber-200 mb-2">选择日期</label>
                                <div class="bg-gray-700 p-4 rounded-sm border border-gray-600">
                                    <div class="flex justify-between items-center mb-4">
                                        <button @click="prevMonth" class="text-gray-400 hover:text-white">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <div class="text-white font-medium">{{ currentMonthName }} {{ currentYear }}
                                        </div>
                                        <button @click="nextMonth" class="text-gray-400 hover:text-white">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div class="grid grid-cols-7 gap-1 text-center">
                                        <div v-for="day in ['日', '一', '二', '三', '四', '五', '六']" :key="day"
                                            class="text-xs text-gray-500 p-1">
                                            {{ day }}
                                        </div>
                                        <div v-for="day in calendarDays"
                                            :key="`${currentYear}-${currentMonth}-${day.date}`"
                                            :class="`p-2 text-sm rounded-sm cursor-pointer ${getDateClass(day)}`"
                                            @click="selectDate(day)">
                                            {{ day.date > 0 ? day.date : '' }}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Time Selection -->
                            <div>
                                <label class="block text-amber-200 mb-2">选择时间</label>
                                <div class="bg-gray-700 p-4 rounded-sm border border-gray-600 h-full">
                                    <div v-if="!selectedDate.date"
                                        class="h-full flex items-center justify-center text-gray-400">
                                        请先选择日期
                                    </div>
                                    <div v-else-if="availableTimeSlots.length === 0"
                                        class="h-full flex items-center justify-center text-gray-400">
                                        所选日期无可预约时段
                                    </div>
                                    <div v-else class="grid grid-cols-2 gap-2">
                                        <button v-for="slot in availableTimeSlots" :key="slot.start"
                                            @click="selectTimeSlot(slot)"
                                            :class="`p-2 text-center text-sm rounded-sm transition-colors ${selectedTimeSlot && selectedTimeSlot.start === slot.start ? 'bg-amber-600 text-white' : 'bg-gray-600 text-gray-200 hover:bg-gray-500'}`">
                                            {{ slot.start }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="flex justify-between mt-8">
                            <button @click="prevStep"
                                class="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-sm transition-colors">
                                上一步
                            </button>
                            <button @click="nextStep" :disabled="!selectedDate.date || !selectedTimeSlot"
                                :class="`px-6 py-3 rounded-sm transition-colors ${!selectedDate.date || !selectedTimeSlot ? 'bg-gray-600 cursor-not-allowed' : 'bg-amber-600 hover:bg-amber-500'}`">
                                下一步
                            </button>
                        </div>
                    </div>

                    <!-- Step 3: Contact Information -->
                    <div v-else-if="currentStep === 2" class="bg-gray-800 p-8 border border-gray-700 rounded-sm">
                        <h2 class="text-2xl font-bold mb-6 text-amber-400">预约信息确认</h2>

                        <div class="mb-6">
                            <h3 class="text-lg font-semibold text-amber-300 mb-3">预约详情</h3>
                            <div class="p-4 bg-gray-700 rounded-sm border border-gray-600 mb-4">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p class="text-gray-400 text-sm">服务类型</p>
                                        <p class="text-white">{{ selectedService.name }}</p>
                                    </div>
                                    <div>
                                        <p class="text-gray-400 text-sm">价格</p>
                                        <p class="text-amber-400 font-bold">¥{{ selectedService.price }}</p>
                                    </div>
                                    <div>
                                        <p class="text-gray-400 text-sm">日期</p>
                                        <p class="text-white">{{ formatDate(selectedDate) }}</p>
                                    </div>
                                    <div>
                                        <p class="text-gray-400 text-sm">时间</p>
                                        <p class="text-white">{{ selectedTimeSlot.start }} - {{ selectedTimeSlot.end }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div v-if="user">
                            <h3 class="text-lg font-semibold text-amber-300 mb-3">已登录用户</h3>
                            <div class="p-4 bg-gray-700 rounded-sm border border-gray-600 mb-6">
                                <p class="text-white">您已使用以下账号登录：</p>
                                <p class="text-amber-400 font-medium mt-1">{{ user.email }}</p>

                                <div class="mt-4 flex">
                                    <button @click="logout" class="text-sm text-gray-300 hover:text-amber-300">
                                        退出登录并使用访客预约
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div v-else>
                            <div class="flex justify-between items-center mb-4">
                                <h3 class="text-lg font-semibold text-amber-300">访客预约</h3>
                                <button @click="showLoginForm = !showLoginForm"
                                    class="text-sm text-amber-400 hover:text-amber-300">
                                    {{ showLoginForm ? '返回访客预约' : '已有账号？登录' }}
                                </button>
                            </div>

                            <div v-if="showLoginForm" class="p-4 bg-gray-700 rounded-sm border border-gray-600 mb-6">
                                <form @submit.prevent="login" class="space-y-4">
                                    <div>
                                        <label for="login-email" class="block text-sm text-amber-200 mb-1">电子邮箱</label>
                                        <input type="email" id="login-email" v-model="loginForm.email"
                                            class="w-full p-2 bg-gray-600 border border-gray-500 rounded-sm text-white focus:outline-none focus:border-amber-500"
                                            required>
                                    </div>
                                    <div>
                                        <label for="login-password" class="block text-sm text-amber-200 mb-1">密码</label>
                                        <input type="password" id="login-password" v-model="loginForm.password"
                                            class="w-full p-2 bg-gray-600 border border-gray-500 rounded-sm text-white focus:outline-none focus:border-amber-500"
                                            required>
                                    </div>
                                    <div v-if="loginError" class="text-red-400 text-sm">
                                        {{ loginError }}
                                    </div>
                                    <div class="flex justify-end">
                                        <button type="submit"
                                            class="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-sm transition-colors">
                                            登录
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <div v-else class="space-y-4">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label for="guest-name" class="block text-sm text-amber-200 mb-1">姓名</label>
                                        <input type="text" id="guest-name" v-model="bookingInfo.guestName"
                                            class="w-full p-2 bg-gray-700 border border-gray-600 rounded-sm text-white focus:outline-none focus:border-amber-500"
                                            required>
                                    </div>
                                    <div>
                                        <label for="guest-phone" class="block text-sm text-amber-200 mb-1">联系电话</label>
                                        <input type="tel" id="guest-phone" v-model="bookingInfo.guestPhone"
                                            class="w-full p-2 bg-gray-700 border border-gray-600 rounded-sm text-white focus:outline-none focus:border-amber-500"
                                            required>
                                    </div>
                                </div>
                                <div>
                                    <label for="guest-email" class="block text-sm text-amber-200 mb-1">电子邮箱</label>
                                    <input type="email" id="guest-email" v-model="bookingInfo.guestEmail"
                                        class="w-full p-2 bg-gray-700 border border-gray-600 rounded-sm text-white focus:outline-none focus:border-amber-500"
                                        required>
                                </div>
                            </div>
                        </div>

                        <div class="mt-6">
                            <label for="notes" class="block text-sm text-amber-200 mb-1">备注信息</label>
                            <textarea id="notes" v-model="bookingInfo.notes" rows="3"
                                class="w-full p-2 bg-gray-700 border border-gray-600 rounded-sm text-white focus:outline-none focus:border-amber-500"
                                placeholder="如有特殊要求，请在此说明"></textarea>
                        </div>

                        <!-- Add this inside the Step 3 section, before the Submit button -->
                        <div class="mt-6 mb-6">
                            <label class="flex items-center cursor-pointer">
                                <input type="checkbox" v-model="addToGoogleCalendar"
                                    class="form-checkbox h-5 w-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500">
                                <span class="ml-2 text-white">将预约添加到 Google 日历</span>
                            </label>
                            <p v-if="addToGoogleCalendar && !hasGoogleIntegration" class="text-gray-400 text-sm mt-1">
                                您需要授权我们访问您的 Google 日历</p>
                            <p v-else-if="addToGoogleCalendar && hasGoogleIntegration"
                                class="text-gray-400 text-sm mt-1">已连接 Google 日历</p>
                        </div>

                        <div class="flex justify-between mt-8">
                            <button @click="prevStep"
                                class="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-sm transition-colors">
                                上一步
                            </button>
                            <button 
                                @click="createBookingWithCalendar" 
                                :disabled="!isContactFormValid || isSubmitting"
                                :class="`px-6 py-3 rounded-sm transition-colors ${!isContactFormValid || isSubmitting ? 'bg-gray-600 cursor-not-allowed' : 'bg-amber-600 hover:bg-amber-500'}`">
                                {{ isSubmitting ? '提交中...' : '提交预约' }}
                            </button>
                        </div>
                    </div>

                    <!-- Step 4: Confirmation -->
                    <div v-else-if="currentStep === 3"
                        class="bg-gray-800 p-8 border border-gray-700 rounded-sm text-center">
                        <div v-if="bookingSuccess">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-green-500 mx-auto mb-4"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h2 class="text-2xl font-bold mb-2 text-amber-400">预约成功</h2>
                            <p class="text-gray-300 mb-6">您的预约请求已提交，我们将尽快与您联系确认</p>

                            <div
                                class="p-4 bg-gray-700 rounded-sm border border-gray-600 text-left mb-6 max-w-md mx-auto">
                                <div class="space-y-2">
                                    <div>
                                        <p class="text-gray-400 text-sm">预约编号</p>
                                        <p class="text-amber-400 font-medium">{{ bookingReference }}</p>
                                    </div>
                                    <div>
                                        <p class="text-gray-400 text-sm">服务类型</p>
                                        <p class="text-white">{{ selectedService.name }}</p>
                                    </div>
                                    <div>
                                        <p class="text-gray-400 text-sm">预约时间</p>
                                        <p class="text-white">{{ formatDate(selectedDate) }} {{ selectedTimeSlot.start
                                            }} - {{ selectedTimeSlot.end }}</p>
                                    </div>
                                </div>
                            </div>

                            <div class="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                                <NuxtLink to="/"
                                    class="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-sm transition-colors">
                                    返回首页
                                </NuxtLink>
                                <button @click="resetForm"
                                    class="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-sm transition-colors">
                                    再次预约
                                </button>
                            </div>
                        </div>

                        <div v-else>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-red-500 mx-auto mb-4"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h2 class="text-2xl font-bold mb-2 text-amber-400">预约失败</h2>
                            <p class="text-gray-300 mb-6">很抱歉，您的预约请求提交失败，请稍后再试或直接联系我们</p>

                            <div
                                class="text-red-400 p-4 bg-red-900 bg-opacity-30 border border-red-700 rounded-sm text-left mb-6 max-w-md mx-auto">
                                <p>{{ bookingError }}</p>
                            </div>

                            <div class="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                                <NuxtLink to="/contact"
                                    class="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-sm transition-colors">
                                    联系我们
                                </NuxtLink>
                                <button @click="currentStep = 2"
                                    class="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-sm transition-colors">
                                    返回修改
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
// Supabase composables will be auto-imported by Nuxt

const supabase = useSupabaseClient()
const user = useSupabaseUser()

// Steps
const steps = ['选择服务', '选择日期时间', '确认信息', '完成预约']
const currentStep = ref(0)

// Service selection
const services = ref([])
const selectedService = ref(null)

// Date & time selection
const currentDate = ref(new Date())
const currentMonth = ref(currentDate.value.getMonth())
const currentYear = ref(currentDate.value.getFullYear())
const selectedDate = ref({})
const selectedTimeSlot = ref(null)
const availableTimeSlots = ref([])

// Contact information
const showLoginForm = ref(false)
const loginForm = ref({
    email: '',
    password: ''
})
const loginError = ref('')
const bookingInfo = ref({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    notes: ''
})

// Booking status
const bookingSuccess = ref(false)
const bookingError = ref('')
const bookingReference = ref('')
const isSubmitting = ref(false)

const addToGoogleCalendar = ref(false)
const hasGoogleIntegration = ref(false)

// Computed properties
const currentMonthName = computed(() => {
    const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
    return monthNames[currentMonth.value]
})

const calendarDays = computed(() => {
    const days = []
    const firstDay = new Date(currentYear.value, currentMonth.value, 1)
    const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)

    // Add empty days for start of month
    for (let i = 0; i < firstDay.getDay(); i++) {
        days.push({ date: 0, disabled: true })
    }

    // Add days of month
    for (let i = 1; i <= lastDay.getDate(); i++) {
        const date = new Date(currentYear.value, currentMonth.value, i)
        days.push({
            date: i,
            disabled: date < new Date(new Date().setHours(0, 0, 0, 0)) // Disable past dates
        })
    }

    return days
})

const isContactFormValid = computed(() => {
    if (user.value) {
        return true
    }

    return !showLoginForm.value &&
        bookingInfo.value.guestName.trim() !== '' &&
        bookingInfo.value.guestEmail.trim() !== '' &&
        bookingInfo.value.guestPhone.trim() !== ''
})

// Methods
const fetchServices = async () => {
    try {
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .order('name')

        if (error) throw error
        services.value = data
    } catch (error) {
        console.error('Error fetching services:', error)
    }
}

const selectService = (service) => {
    selectedService.value = service
}

const prevMonth = () => {
    if (currentMonth.value === 0) {
        currentYear.value--
        currentMonth.value = 11
    } else {
        currentMonth.value--
    }
}

const nextMonth = () => {
    if (currentMonth.value === 11) {
        currentYear.value++
        currentMonth.value = 0
    } else {
        currentMonth.value++
    }
}

const getDateClass = (day) => {
    if (day.date === 0) return 'invisible'
    if (day.disabled) return 'text-gray-600 cursor-not-allowed'

    // Check if selected
    const isSelected = selectedDate.value.date === day.date &&
        selectedDate.value.month === currentMonth.value &&
        selectedDate.value.year === currentYear.value

    if (isSelected) return 'bg-amber-600 text-white'

    // Check if it's today
    const today = new Date()
    const isToday = day.date === today.getDate() &&
        currentMonth.value === today.getMonth() &&
        currentYear.value === today.getFullYear()

    if (isToday) return 'border border-amber-500 text-amber-300'

    return 'text-white hover:bg-gray-600'
}

const selectDate = (day) => {
    if (day.date === 0 || day.disabled) return

    selectedDate.value = {
        date: day.date,
        month: currentMonth.value,
        year: currentYear.value
    }

    // Reset time slot
    selectedTimeSlot.value = null

    // Fetch available time slots
    fetchAvailableTimeSlots()
}

const fetchAvailableTimeSlots = async () => {
    if (!selectedService.value || !selectedDate.value.date) return

    try {
        // Convert selected date to ISO format (YYYY-MM-DD)
        const dateStr = `${selectedDate.value.year}-${String(selectedDate.value.month + 1).padStart(2, '0')}-${String(selectedDate.value.date).padStart(2, '0')}`

        // Get day of week (0 = Sunday, 1 = Monday, etc.)
        const date = new Date(dateStr)
        const dayOfWeek = date.getDay()

        // Fetch service availability for this day
        const { data: availability, error } = await supabase
            .from('service_availability')
            .select('*')
            .eq('service_id', selectedService.value.id)
            .eq('day_of_week', dayOfWeek)

        if (error) throw error

        if (!availability || availability.length === 0) {
            availableTimeSlots.value = []
            return
        }

        const serviceAvailability = availability[0]

        // Fetch existing bookings for this date and service
        const { data: bookings, error: bookingsError } = await supabase
            .from('bookings')
            .select('start_time, end_time')
            .eq('service_id', selectedService.value.id)
            .eq('booking_date', dateStr)
            .not('status', 'eq', 'cancelled')

        if (bookingsError) throw bookingsError

        // Generate time slots
        const slots = []
        const startTime = new Date(`${dateStr}T${serviceAvailability.start_time}`)
        const endTime = new Date(`${dateStr}T${serviceAvailability.end_time}`)
        const duration = selectedService.value.duration

        let current = new Date(startTime)

        while (current.getTime() + (duration * 60 * 1000) <= endTime.getTime()) {
            const slotStart = current.toTimeString().substring(0, 5)
            const slotEnd = new Date(current.getTime() + (duration * 60 * 1000)).toTimeString().substring(0, 5)

            // Check if this slot is already booked
            let isBooked = false
            if (bookings && bookings.length > 0) {
                const maxBookingsPerSlot = serviceAvailability.max_bookings
                let bookingsInThisSlot = 0

                for (const booking of bookings) {
                    const bookingStart = booking.start_time
                    const bookingEnd = booking.end_time

                    // Check for overlap
                    if ((slotStart <= bookingEnd && slotEnd >= bookingStart)) {
                        bookingsInThisSlot++
                    }
                }

                isBooked = bookingsInThisSlot >= maxBookingsPerSlot
            }

            if (!isBooked) {
                slots.push({
                    start: slotStart,
                    end: slotEnd
                })
            }

            // Move to next slot (30 min increments)
            current = new Date(current.getTime() + (30 * 60 * 1000))
        }

        availableTimeSlots.value = slots
    } catch (error) {
        console.error('Error fetching time slots:', error)
        availableTimeSlots.value = []
    }
}

const selectTimeSlot = (slot) => {
    selectedTimeSlot.value = slot
}

const formatDate = (dateObj) => {
    if (!dateObj || !dateObj.date) return ''

    const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
    return `${dateObj.year}年${months[dateObj.month]}${dateObj.date}日`
}

const login = async () => {
    try {
        loginError.value = ''

        const { data, error } = await supabase.auth.signInWithPassword({
            email: loginForm.value.email,
            password: loginForm.value.password
        })

        if (error) throw error

        // Reset login form
        loginForm.value = {
            email: '',
            password: ''
        }

        showLoginForm.value = false
    } catch (error) {
        loginError.value = '登录失败，请检查您的邮箱和密码'
        console.error('Login error:', error)
    }
}

const logout = async () => {
    try {
        await supabase.auth.signOut()
    } catch (error) {
        console.error('Logout error:', error)
    }
}

const prevStep = () => {
    if (currentStep.value > 0) {
        currentStep.value--
    }
}

const nextStep = async () => {
    if (currentStep.value < steps.length - 1) {
        // If this is the final step before confirmation, create the booking
        if (currentStep.value === 2) {
            await createBookingWithCalendar()
        } else {
            currentStep.value++
        }
    }
}

const createBookingWithCalendar = async () => {
    try {
        isSubmitting.value = true
        bookingError.value = ''
        
        // Format date (YYYY-MM-DD)
        const bookingDate = `${selectedDate.value.year}-${String(selectedDate.value.month + 1).padStart(2, '0')}-${String(selectedDate.value.date).padStart(2, '0')}`
        
        const bookingData = {
            service_id: selectedService.value.id,
            booking_date: bookingDate,
            start_time: selectedTimeSlot.value.start,
            end_time: selectedTimeSlot.value.end,
            notes: bookingInfo.value.notes,
            status: 'pending'
        }
        
        // If user is logged in, add user_id
        if (user.value) {
            bookingData.user_id = user.value.id
        } else {
            // For guest bookings
            bookingData.guest_name = bookingInfo.value.guestName
            bookingData.guest_email = bookingInfo.value.guestEmail
            bookingData.guest_phone = bookingInfo.value.guestPhone
        }
        
        // Create booking using the stored procedure
        const { data, error } = await supabase.rpc('create_booking', {
            p_user_id: bookingData.user_id || null,
            p_service_id: bookingData.service_id,
            p_booking_date: bookingData.booking_date,
            p_start_time: bookingData.start_time,
            p_end_time: bookingData.end_time,
            p_guest_name: bookingData.guest_name || null,
            p_guest_email: bookingData.guest_email || null,
            p_guest_phone: bookingData.guest_phone || null,
            p_notes: bookingData.notes || null
        })
        
        if (error) throw error
        
        // Store booking reference
        bookingReference.value = data
        
        // Handle Google Calendar integration if requested
        if (addToGoogleCalendar.value) {
            if (!hasGoogleIntegration.value) {
                // Store booking ID in localStorage to use after auth
                localStorage.setItem('pendingBookingId', data)
                
                // Start Google auth flow
                const response = await fetch('/api/auth/google')
                const result = await response.json()
                
                // Save current state to restore later
                localStorage.setItem('bookingState', JSON.stringify({
                    service: selectedService.value,
                    date: selectedDate.value,
                    timeSlot: selectedTimeSlot.value,
                    bookingInfo: bookingInfo.value
                }))
                
                // Redirect to Google auth
                window.location.href = result.url
                return // Stop here as we're redirecting
            } else if (hasGoogleIntegration.value) {
                // User already has Google integration, add directly to calendar
                try {
                    await fetch('/api/calendar/add-event', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ bookingId: data })
                    })
                } catch (calendarError) {
                    console.error('Error adding to calendar:', calendarError)
                    // Continue with booking flow even if calendar fails
                }
            }
        }
        
        // Booking successful
        bookingSuccess.value = true
        currentStep.value++
    } catch (error) {
        console.error('Error creating booking:', error)
        bookingError.value = error.message || '预约创建失败，请稍后再试'
        bookingSuccess.value = false
        currentStep.value++
    } finally {
        isSubmitting.value = false
    }
}

const resetForm = () => {
    selectedService.value = null
    selectedDate.value = {}
    selectedTimeSlot.value = null
    bookingInfo.value = {
        guestName: '',
        guestEmail: '',
        guestPhone: '',
        notes: ''
    }
    bookingSuccess.value = false
    bookingError.value = ''
    currentStep.value = 0
}

// Initialize
// Add this to your onMounted function
onMounted(async () => {
    fetchServices()
    
    // Check if returning from Google auth
    const pendingBookingId = localStorage.getItem('pendingBookingId')
    if (pendingBookingId) {
        try {
            // User is back from Google auth, add event to calendar
            await fetch('/api/calendar/add-event', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ bookingId: pendingBookingId })
            })
            
            // Clear localStorage
            localStorage.removeItem('pendingBookingId')
            
            // Show success message or redirect to confirmation
            bookingReference.value = pendingBookingId
            bookingSuccess.value = true
            currentStep.value = 3 // Confirmation step
            
            // Try to restore booking state for display purposes
            try {
                const savedState = JSON.parse(localStorage.getItem('bookingState'))
                if (savedState) {
                    selectedService.value = savedState.service
                    selectedDate.value = savedState.date
                    selectedTimeSlot.value = savedState.timeSlot
                    localStorage.removeItem('bookingState')
                }
            } catch (e) {
                console.error('Error restoring booking state:', e)
            }
        } catch (error) {
            console.error('Error adding to calendar after auth:', error)
        }
    } else {
        // Normal flow - fetch services
        fetchServices()
        
        // Check if user has Google Calendar integration
        if (user.value) {
            try {
                const { data, error } = await supabase
                    .from('user_google_tokens')
                    .select('user_id')
                    .eq('user_id', user.value.id)
                    .single()
                
                hasGoogleIntegration.value = !error && data
            } catch (error) {
                console.error('Error checking Google integration:', error)
            }
        }
    }
})
</script>