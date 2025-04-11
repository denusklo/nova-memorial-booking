<template>
    <div class="bg-black text-white min-h-screen flex items-center justify-center">
        <div class="w-full max-w-md p-8 bg-gray-800 rounded-sm shadow-lg border border-gray-700">
            <div class="text-center mb-8">
                <div class="flex justify-center mb-4">
                    <div class="w-16 h-16 flex items-center justify-center border-2 border-amber-400 text-amber-400">
                        <span class="text-lg">纪念</span>
                    </div>
                </div>
                <h1 class="text-2xl font-bold text-amber-400">管理员登录</h1>
                <p class="text-gray-400 mt-2">请输入您的管理员账号和密码</p>
            </div>

            <form @submit.prevent="handleLogin" class="space-y-6">
                <div>
                    <label for="email" class="block text-sm font-medium text-amber-200 mb-1">电子邮箱</label>
                    <input
                        v-model="email"
                        id="email"
                        type="email"
                        required
                        class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="admin@example.com"
                    />
                </div>

                <div>
                    <label for="password" class="block text-sm font-medium text-amber-200 mb-1">密码</label>
                    <input
                        v-model="password"
                        id="password"
                        type="password"
                        required
                        class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="••••••••"
                    />
                </div>

                <div v-if="errorMessage" class="p-3 border border-red-400 bg-red-900 bg-opacity-30 text-red-300 rounded-sm">
                    {{ errorMessage }}
                </div>

                <button
                    type="submit"
                    class="w-full py-2 px-4 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-50 transition-colors"
                    :disabled="loading"
                >
                    {{ loading ? '登录中...' : '登录' }}
                </button>
            </form>

            <div class="mt-6 text-center">
                <NuxtLink to="/" class="text-amber-400 hover:text-amber-300 text-sm">
                    返回前台页面
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
// Supabase composables will be auto-imported by Nuxt

definePageMeta({
    layout: false
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

onMounted(async () => {
    // If already logged in as admin, redirect to admin dashboard
    if (user.value) {
        const { data, error } = await supabase
            .from('admins')
            .select('id')
            .eq('id', user.value.id)
            .single()

        if (!error && data) {
            router.push('/admin')
        } else {
            // Not an admin, sign out
            await supabase.auth.signOut()
        }
    }
})

const handleLogin = async () => {
    try {
        errorMessage.value = ''
        loading.value = true

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.value,
            password: password.value
        })

        if (error) throw error

        // Check if user is an admin
        const { data: adminData, error: adminError } = await supabase
            .from('admins')
            .select('id')
            .eq('id', data.user.id)
            .single()

        if (adminError || !adminData) {
            // Not an admin, sign out and show error
            await supabase.auth.signOut()
            errorMessage.value = '您没有管理员权限'
            return
        }

        // Admin login successful, redirect to admin dashboard
        router.push('/admin')
    } catch (error) {
        errorMessage.value = error.message || '登录失败，请检查您的邮箱和密码'
    } finally {
        loading.value = false
    }
}
</script>