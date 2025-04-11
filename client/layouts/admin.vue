<template>
    <div class="bg-gray-100 min-h-screen flex flex-col">
        <!-- Header -->
        <header class="bg-gray-800 text-white shadow-md">
            <div class="container mx-auto px-6 py-3">
                <div class="flex justify-between items-center">
                    <!-- Logo -->
                    <div class="flex items-center">
                        <NuxtLink to="/admin" class="text-amber-400 font-bold text-xl flex items-center">
                            <div class="w-8 h-8 mr-2 flex items-center justify-center border-2 border-amber-400">
                                <span class="text-xs">纪念</span>
                            </div>
                            <span>管理后台</span>
                        </NuxtLink>
                    </div>

                    <!-- Navigation -->
                    <nav class="hidden md:flex space-x-4">
                        <NuxtLink to="/admin" class="text-white hover:text-amber-400 transition duration-300 px-3 py-2" exact-active-class="bg-gray-700 text-amber-400">
                            仪表盘
                        </NuxtLink>
                        <NuxtLink to="/admin/bookings" class="text-white hover:text-amber-400 transition duration-300 px-3 py-2" active-class="bg-gray-700 text-amber-400">
                            预约管理
                        </NuxtLink>
                        <NuxtLink to="/admin/services" class="text-white hover:text-amber-400 transition duration-300 px-3 py-2" active-class="bg-gray-700 text-amber-400">
                            服务管理
                        </NuxtLink>
                        <NuxtLink to="/admin/assets" class="text-white hover:text-amber-400 transition duration-300 px-3 py-2" active-class="bg-gray-700 text-amber-400">
                            资源管理
                        </NuxtLink>
                    </nav>

                    <!-- User Menu -->
                    <div class="flex items-center">
                        <div class="relative" v-if="user">
                            <button @click="toggleUserMenu" class="flex items-center text-white focus:outline-none">
                                <span class="mr-2">{{ user.email }}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                                </svg>
                            </button>
                            <div v-if="userMenuOpen" class="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-1 z-10">
                                <button @click="handleLogout" class="block w-full text-left px-4 py-2 hover:bg-gray-100">
                                    退出登录
                                </button>
                            </div>
                        </div>
                        <NuxtLink v-else to="/admin/login" class="text-white hover:text-amber-400 transition duration-300">
                            登录
                        </NuxtLink>
                    </div>

                    <!-- Mobile Menu Button -->
                    <button @click="toggleMobileMenu" class="md:hidden text-white focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Mobile Menu -->
            <div v-if="mobileMenuOpen" class="md:hidden bg-gray-700">
                <div class="container mx-auto px-6 py-3">
                    <nav class="flex flex-col space-y-2">
                        <NuxtLink to="/admin" @click="mobileMenuOpen = false" class="text-white hover:text-amber-400 transition duration-300 px-3 py-2" exact-active-class="bg-gray-600 text-amber-400">
                            仪表盘
                        </NuxtLink>
                        <NuxtLink to="/admin/bookings" @click="mobileMenuOpen = false" class="text-white hover:text-amber-400 transition duration-300 px-3 py-2" active-class="bg-gray-600 text-amber-400">
                            预约管理
                        </NuxtLink>
                        <NuxtLink to="/admin/services" @click="mobileMenuOpen = false" class="text-white hover:text-amber-400 transition duration-300 px-3 py-2" active-class="bg-gray-600 text-amber-400">
                            服务管理
                        </NuxtLink>
                        <NuxtLink to="/admin/assets" @click="mobileMenuOpen = false" class="text-white hover:text-amber-400 transition duration-300 px-3 py-2" active-class="bg-gray-600 text-amber-400">
                            资源管理
                        </NuxtLink>
                    </nav>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="flex-grow container mx-auto px-6 py-6">
            <slot />
        </main>

        <!-- Footer -->
        <footer class="bg-gray-800 text-white py-4">
            <div class="container mx-auto px-6">
                <p class="text-center text-gray-400 text-sm">
                    © 2024 中华纪念馆 | 管理后台
                </p>
            </div>
        </footer>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
// Supabase composables will be auto-imported by Nuxt

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const mobileMenuOpen = ref(false)
const userMenuOpen = ref(false)

const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value
}

const toggleUserMenu = () => {
    userMenuOpen.value = !userMenuOpen.value
}

const handleLogout = async () => {
    try {
        await supabase.auth.signOut()
        userMenuOpen.value = false
        router.push('/admin/login')
    } catch (error) {
        console.error('Error during logout:', error)
    }
}

// Check if user is an admin, redirect if not
onMounted(async () => {
    if (user.value) {
        const { data, error } = await supabase
            .from('admins')
            .select('id')
            .eq('id', user.value.id)
            .single()

        if (error || !data) {
            // User is not an admin, sign them out and redirect
            await supabase.auth.signOut()
            router.push('/admin/login')
        }
    }
})
</script>