<template>
    <div class="min-h-screen flex flex-col bg-black text-white">
        <!-- Header -->
        <header class="bg-black bg-opacity-80 fixed w-full z-50 border-b border-gray-800">
            <div class="container mx-auto px-6 py-4">
                <div class="flex justify-between items-center">
                    <!-- Logo -->
                    <div class="flex items-center">
                        <NuxtLink to="/" class="text-amber-400 font-bold text-2xl flex items-center">
                            <div class="w-10 h-10 mr-3 flex items-center justify-center border-2 border-amber-400">
                                <span class="text-sm">纪念</span>
                            </div>
                            <span>NovaMemorial</span>
                        </NuxtLink>
                    </div>

                    <!-- Desktop Navigation -->
                    <nav class="hidden md:flex space-x-8">
                        <NuxtLink to="/" class="text-white hover:text-amber-400 transition duration-300">首页</NuxtLink>
                        <NuxtLink to="/about" class="text-white hover:text-amber-400 transition duration-300">纪念馆缘起
                        </NuxtLink>
                        <NuxtLink to="/services" class="text-white hover:text-amber-400 transition duration-300">追思服务
                        </NuxtLink>
                        <NuxtLink to="/facilities" class="text-white hover:text-amber-400 transition duration-300">场馆设施
                        </NuxtLink>
                        <NuxtLink to="/contact" class="text-white hover:text-amber-400 transition duration-300">联络我们
                        </NuxtLink>
                    </nav>

                    <!-- Mobile Menu Button -->
                    <button @click="toggleMobileMenu" class="md:hidden text-white focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16" />
                            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Mobile Menu -->
            <div v-if="mobileMenuOpen" class="md:hidden bg-gray-900 border-b border-gray-800">
                <div class="container mx-auto px-6 py-4">
                    <nav class="flex flex-col space-y-4">
                        <NuxtLink @click="mobileMenuOpen = false" to="/"
                            class="text-white hover:text-amber-400 transition duration-300">首页</NuxtLink>
                        <NuxtLink @click="mobileMenuOpen = false" to="/about"
                            class="text-white hover:text-amber-400 transition duration-300">纪念馆缘起</NuxtLink>
                        <NuxtLink @click="mobileMenuOpen = false" to="/services"
                            class="text-white hover:text-amber-400 transition duration-300">追思服务</NuxtLink>
                        <NuxtLink @click="mobileMenuOpen = false" to="/facilities"
                            class="text-white hover:text-amber-400 transition duration-300">场馆设施</NuxtLink>
                        <NuxtLink @click="mobileMenuOpen = false" to="/contact"
                            class="text-white hover:text-amber-400 transition duration-300">联络我们</NuxtLink>
                    </nav>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="flex-grow pt-16">
            <slot />
        </main>

        <!-- Footer -->
        <footer class="bg-gray-900 border-t border-gray-800">
            <div class="container mx-auto px-6 py-12">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <!-- About -->
                    <div>
                        <h3 class="text-xl font-bold mb-4 text-amber-400">中华纪念馆</h3>
                        <p class="text-gray-400 mb-4">
                            中华纪念馆承载着千年的孝道文化，致力于提供专业、庄重的追思与安息服务。
                        </p>
                        <div class="flex space-x-4">
                            <a href="#" class="text-gray-400 hover:text-amber-400">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                        d="M12 2C6.477 2 2 6.477 2 12c0 5.013 3.693 9.153 8.505 9.876V14.65H8.031v-2.629h2.474v-1.749c0-2.896 1.411-4.167 3.818-4.167 1.153 0 1.762.085 2.051.124v2.294h-1.642c-1.022 0-1.379.969-1.379 2.061v1.437h2.995l-.406 2.629h-2.588v7.247C18.235 21.236 22 17.062 22 12c0-5.523-4.477-10-10-10z" />
                                </svg>
                            </a>
                            <a href="#" class="text-gray-400 hover:text-amber-400">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                        d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                                </svg>
                            </a>
                            <a href="#" class="text-gray-400 hover:text-amber-400">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.5 4.25c1.24 0 2.25 1.01 2.25 2.25s-1.01 2.25-2.25 2.25-2.25-1.01-2.25-2.25 1.01-2.25 2.25-2.25zM19.5 10v1h-2v2h-1v-2h-2v-1h2V8h1v2h2zm-8.28 8.5h-.72v-6h3c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2h-2.28v-1.5h1.78c.39 0 .5-.11.5-.5v-2c0-.39-.11-.5-.5-.5H12v5z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <!-- Quick Links -->
                    <div>
                        <h3 class="text-xl font-bold mb-4 text-amber-400">快速链接</h3>
                        <ul class="space-y-2">
                            <li>
                                <NuxtLink to="/" class="text-gray-400 hover:text-amber-400 transition duration-300">首页
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink to="/about"
                                    class="text-gray-400 hover:text-amber-400 transition duration-300">纪念馆缘起</NuxtLink>
                            </li>
                            <li>
                                <NuxtLink to="/services"
                                    class="text-gray-400 hover:text-amber-400 transition duration-300">追思服务</NuxtLink>
                            </li>
                            <li>
                                <NuxtLink to="/facilities"
                                    class="text-gray-400 hover:text-amber-400 transition duration-300">场馆设施</NuxtLink>
                            </li>
                            <li>
                                <NuxtLink to="/contact"
                                    class="text-gray-400 hover:text-amber-400 transition duration-300">联络我们</NuxtLink>
                            </li>
                        </ul>
                    </div>

                    <!-- Services -->
                    <div>
                        <h3 class="text-xl font-bold mb-4 text-amber-400">我们的服务</h3>
                        <ul class="space-y-2">
                            <li>
                                <NuxtLink to="/services"
                                    class="text-gray-400 hover:text-amber-400 transition duration-300">安息堂</NuxtLink>
                            </li>
                            <li>
                                <NuxtLink to="/services"
                                    class="text-gray-400 hover:text-amber-400 transition duration-300">租界殡仪馆</NuxtLink>
                            </li>
                            <li>
                                <NuxtLink to="/services"
                                    class="text-gray-400 hover:text-amber-400 transition duration-300">圆满七日祭拜</NuxtLink>
                            </li>
                            <li>
                                <NuxtLink to="/services"
                                    class="text-gray-400 hover:text-amber-400 transition duration-300">网上追思</NuxtLink>
                            </li>
                            <li>
                                <NuxtLink to="/services"
                                    class="text-gray-400 hover:text-amber-400 transition duration-300">心理咨询</NuxtLink>
                            </li>
                        </ul>
                    </div>

                    <!-- Contact -->
                    <div>
                        <h3 class="text-xl font-bold mb-4 text-amber-400">联系方式</h3>
                        <ul class="space-y-2">
                            <li class="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    class="h-5 w-5 mr-2 text-amber-500 mt-0.5 flex-shrink-0" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span class="text-gray-400">上海市浦东新区XX路XX号</span>
                            </li>
                            <li class="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    class="h-5 w-5 mr-2 text-amber-500 mt-0.5 flex-shrink-0" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span class="text-gray-400">服务热线: 400-XXX-XXXX</span>
                            </li>
                            <li class="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    class="h-5 w-5 mr-2 text-amber-500 mt-0.5 flex-shrink-0" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span class="text-gray-400">info@novamemorial.com</span>
                            </li>
                            <li class="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    class="h-5 w-5 mr-2 text-amber-500 mt-0.5 flex-shrink-0" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span class="text-gray-400">周一至周日: 8:00 - 20:00</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="mt-12 pt-8 border-t border-gray-800 text-center">
                    <p class="text-gray-500">© 2024 中华纪念馆 | 慎终追远 • 让思念长存</p>
                </div>
            </div>
        </footer>
    </div>
</template>

<script setup>
const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value
}
</script>

<style>
/* Global styles */
body {
    font-family: 'Noto Sans SC', 'Noto Serif', sans-serif;
}
</style>