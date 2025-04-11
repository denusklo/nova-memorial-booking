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
                    <h1 class="text-4xl md:text-5xl font-bold mb-4 text-amber-400">联络我们</h1>
                    <p class="text-xl text-amber-200 mb-8">让思念不再遥远</p>
                    <div class="w-24 h-1 bg-amber-500 mx-auto"></div>
                </div>
                
                <!-- Booking Button -->
                <div class="max-w-lg mx-auto mt-8 text-center">
                    <NuxtLink to="/booking" class="inline-block px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-sm transition duration-300 transform hover:scale-105">
                        <span class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            预约服务
                        </span>
                    </NuxtLink>
                    <p class="text-gray-400 mt-2">在线预约我们的纪念服务</p>
                </div>
            </div>
        </section>

        <!-- Contact Section -->
        <section class="py-16 bg-gray-900">
            <div class="container mx-auto px-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <!-- Contact Form -->
                    <div class="bg-gray-800 p-8 border border-gray-700">
                        <h2 class="text-2xl font-bold mb-6 text-amber-400">发送信息</h2>
                        <form @submit.prevent="submitForm" class="space-y-6">
                            <div>
                                <label for="name" class="block mb-2 text-amber-200">姓名</label>
                                <input id="name" v-model="form.name" type="text"
                                    class="w-full p-3 bg-gray-700 border border-gray-600 rounded-sm focus:outline-none focus:border-amber-500"
                                    required />
                            </div>

                            <div>
                                <label for="email" class="block mb-2 text-amber-200">电子邮件</label>
                                <input id="email" v-model="form.email" type="email"
                                    class="w-full p-3 bg-gray-700 border border-gray-600 rounded-sm focus:outline-none focus:border-amber-500"
                                    required />
                            </div>

                            <div>
                                <label for="phone" class="block mb-2 text-amber-200">电话</label>
                                <input id="phone" v-model="form.phone" type="tel"
                                    class="w-full p-3 bg-gray-700 border border-gray-600 rounded-sm focus:outline-none focus:border-amber-500" />
                            </div>

                            <div>
                                <label for="subject" class="block mb-2 text-amber-200">主题</label>
                                <select id="subject" v-model="form.subject"
                                    class="w-full p-3 bg-gray-700 border border-gray-600 rounded-sm focus:outline-none focus:border-amber-500"
                                    required>
                                    <option value="" disabled>请选择</option>
                                    <option value="general">一般咨询</option>
                                    <option value="services">追思服务</option>
                                    <option value="visit">预约参观</option>
                                    <option value="memorial">纪念安排</option>
                                </select>
                            </div>

                            <div>
                                <label for="message" class="block mb-2 text-amber-200">留言</label>
                                <textarea id="message" v-model="form.message" rows="5"
                                    class="w-full p-3 bg-gray-700 border border-gray-600 rounded-sm focus:outline-none focus:border-amber-500"
                                    required></textarea>
                            </div>

                            <div v-if="formStatus" class="p-3 border rounded-sm"
                                :class="formStatus.success ? 'text-green-400 border-green-400 bg-green-900 bg-opacity-30' : 'text-red-400 border-red-400 bg-red-900 bg-opacity-30'">
                                {{ formStatus.message }}
                            </div>

                            <button type="submit"
                                class="w-full py-3 bg-amber-700 hover:bg-amber-600 text-white rounded-sm transition duration-300"
                                :disabled="submitting">
                                {{ submitting ? '发送中...' : '发送信息' }}
                            </button>
                        </form>
                    </div>

                    <!-- Contact Info -->
                    <div>
                        <h2 class="text-2xl font-bold mb-6 text-amber-400">联系方式</h2>

                        <div class="space-y-8">
                            <!-- Address -->
                            <div class="flex">
                                <div class="mr-4 mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-amber-500" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 class="text-xl font-semibold mb-2 text-amber-300">地址</h3>
                                    <p class="text-gray-300">中华纪念馆</p>
                                    <p class="text-gray-300">上海市浦东新区XX路XX号</p>
                                    <p class="text-gray-300">邮编: 200120</p>
                                </div>
                            </div>

                            <!-- Phone -->
                            <div class="flex">
                                <div class="mr-4 mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-amber-500" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 class="text-xl font-semibold mb-2 text-amber-300">电话</h3>
                                    <p class="text-gray-300">总机: 021-XXXX XXXX</p>
                                    <p class="text-gray-300">服务热线: 400-XXX-XXXX</p>
                                </div>
                            </div>

                            <!-- Email -->
                            <div class="flex">
                                <div class="mr-4 mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-amber-500" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 class="text-xl font-semibold mb-2 text-amber-300">电子邮件</h3>
                                    <p class="text-gray-300">info@novamemorial.com</p>
                                    <p class="text-gray-300">service@novamemorial.com</p>
                                </div>
                            </div>

                            <!-- Hours -->
                            <div class="flex">
                                <div class="mr-4 mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-amber-500" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 class="text-xl font-semibold mb-2 text-amber-300">开放时间</h3>
                                    <p class="text-gray-300">周一至周日: 早上 8:00 - 晚上 8:00</p>
                                    <p class="text-gray-300">全年无休</p>
                                </div>
                            </div>
                        </div>

                        <!-- Booking CTA Card -->
                        <div class="mt-10 border border-amber-600 bg-gray-800 p-6 rounded-sm">
                            <h3 class="text-xl font-semibold mb-3 text-amber-400">在线预约服务</h3>
                            <p class="text-gray-300 mb-4">为您和您的亲人预约追思服务，我们提供全方位的线上预约系统。</p>
                            <NuxtLink to="/booking" class="block w-full py-3 bg-amber-600 hover:bg-amber-500 text-white text-center rounded-sm transition duration-300">
                                立即预约
                            </NuxtLink>
                        </div>

                        <!-- Map Placeholder -->
                        <div class="mt-10 border border-gray-700 p-1">
                            <div class="bg-gray-800 h-64 flex items-center justify-center">
                                <p class="text-gray-500">地图将在这里显示</p>
                                <!-- In a real implementation, you would add a map component here -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- FAQ Section -->
        <section class="py-16 bg-black">
            <div class="container mx-auto px-6">
                <h2 class="text-2xl font-bold mb-10 text-amber-400 text-center">常见问题</h2>

                <div class="max-w-3xl mx-auto space-y-6">
                    <!-- FAQ Item 1 -->
                    <div class="border border-gray-800 bg-gray-900">
                        <button @click="toggleFaq(0)"
                            class="flex justify-between items-center w-full p-4 text-left focus:outline-none">
                            <span class="text-lg font-medium text-amber-300">如何预约参观纪念馆？</span>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-500 transition-transform"
                                :class="openFaq === 0 ? 'transform rotate-180' : ''" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <div v-if="openFaq === 0" class="p-4 pt-0 text-gray-300">
                            <p>您可以通过以下方式预约参观纪念馆：</p>
                            <ul class="list-disc pl-5 mt-2 space-y-1">
                                <li>电话预约：拨打我们的服务热线400-XXX-XXXX</li>
                                <li>网上预约：填写本页面的联系表单，选择"预约参观"</li>
                                <li>直接访问：您也可以直接前来，我们的工作人员会为您提供导览服务</li>
                                <li>在线预约：点击上方的"预约服务"按钮进行在线预约</li>
                            </ul>
                        </div>
                    </div>

                    <!-- FAQ Item 2 -->
                    <div class="border border-gray-800 bg-gray-900">
                        <button @click="toggleFaq(1)"
                            class="flex justify-between items-center w-full p-4 text-left focus:outline-none">
                            <span class="text-lg font-medium text-amber-300">纪念馆提供哪些追思服务？</span>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-500 transition-transform"
                                :class="openFaq === 1 ? 'transform rotate-180' : ''" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <div v-if="openFaq === 1" class="p-4 pt-0 text-gray-300">
                            <p>我们的追思服务包括但不限于：</p>
                            <ul class="list-disc pl-5 mt-2 space-y-1">
                                <li>骨灰安放：包括永久性和临时性安放服务</li>
                                <li>祭拜仪式：包括传统七日祭、周年纪念、清明祭祀等</li>
                                <li>纪念活动：为逝者举办个性化的纪念活动</li>
                                <li>网上追思：为无法亲临的亲友提供网上祭拜平台</li>
                                <li>心理咨询：为家属提供专业的哀伤辅导</li>
                            </ul>
                        </div>
                    </div>

                    <!-- FAQ Item 3 -->
                    <div class="border border-gray-800 bg-gray-900">
                        <button @click="toggleFaq(2)"
                            class="flex justify-between items-center w-full p-4 text-left focus:outline-none">
                            <span class="text-lg font-medium text-amber-300">如何选择合适的安息位？</span>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-500 transition-transform"
                                :class="openFaq === 2 ? 'transform rotate-180' : ''" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <div v-if="openFaq === 2" class="p-4 pt-0 text-gray-300">
                            <p>选择安息位主要考虑以下因素：</p>
                            <ul class="list-disc pl-5 mt-2 space-y-1">
                                <li>位置：我们提供不同区域的安息位，包括室内安息堂和户外纪念园</li>
                                <li>类型：单人、双人或家族安息位可供选择</li>
                                <li>价格：不同位置和类型的安息位价格各异</li>
                                <li>风水：我们有专业的顾问可以提供风水相关的建议</li>
                            </ul>
                            <p class="mt-2">建议您预约参观，我们的顾问会详细介绍各类安息位，帮助您做出最合适的选择。</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
const form = ref({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
})

const submitting = ref(false)
const formStatus = ref(null)
const openFaq = ref(null)

const toggleFaq = (index) => {
    openFaq.value = openFaq.value === index ? null : index
}

const submitForm = async () => {
    submitting.value = true

    try {
        // In a real implementation, you would submit to your API here
        // await $fetch('/api/contact', {
        //   method: 'POST',
        //   body: form.value
        // })

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        formStatus.value = {
            success: true,
            message: '您的消息已成功发送，我们会尽快与您联系。'
        }

        // Reset form
        form.value = {
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
        }
    } catch (error) {
        formStatus.value = {
            success: false,
            message: '发送失败，请稍后再试或直接致电联系我们。'
        }
    } finally {
        submitting.value = false
    }
}
</script>

<style scoped>
/* Custom styles here if needed */
</style>