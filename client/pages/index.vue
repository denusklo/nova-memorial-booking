<template>
    <div class="bg-black text-white min-h-screen">
        <!-- Hero Section -->
        <section class="relative h-screen flex items-center">
            <div class="absolute inset-0 bg-cover bg-center z-0" style="background-image: url('https://placehold.co/1920x1080');">
                <div class="absolute inset-0 bg-black bg-opacity-70"></div>
            </div>

            <div class="container mx-auto px-6 relative z-10">
                <div class="max-w-3xl">
                    <h1 class="text-4xl md:text-6xl font-serif mb-2 text-amber-400">
                        Etched With Love
                    </h1>
                    <p class="text-xl md:text-2xl mb-8 text-amber-200">
                        For Every Memory Worth Remembering
                    </p>
                    <h2 class="text-3xl md:text-5xl font-bold mb-2 font-sans">
                        慎终追远，寄托思念
                    </h2>
                    <p class="text-xl md:text-2xl mb-8">
                        安息的福地<br>
                        思念的寄托
                    </p>
                    <p class="mb-10 text-gray-300 max-w-xl">
                        我们秉承"慎终追远"的精神，以现代化设施结合传统文化，打造一个宁静而温馨的纪念空间，让逝者安息，让思念永存。
                    </p>
                    <div class="space-x-4">
                        <NuxtLink to="/contact"
                            class="px-8 py-3 bg-amber-700 hover:bg-amber-600 text-white rounded-sm transition duration-300">
                            联络我们
                        </NuxtLink>
                        <NuxtLink to="/services"
                            class="px-8 py-3 border border-amber-700 hover:border-amber-500 text-white rounded-sm transition duration-300">
                            追思服务
                        </NuxtLink>
                    </div>
                </div>
            </div>

            <div class="absolute bottom-10 left-0 right-0 flex justify-center">
                <button @click="scrollToStats" class="text-amber-400 animate-bounce">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </button>
            </div>
        </section>

        <!-- Stats Section -->
        <section ref="statsSection" class="py-20 bg-gradient-to-b from-black to-gray-900">
            <div class="container mx-auto px-6">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    <!-- Stat 1 -->
                    <div class="text-center">
                        <h3 class="text-5xl font-bold text-amber-500 mb-2">20</h3>
                        <p class="text-amber-300 mb-1">年专业运营经验</p>
                        <p class="text-gray-400 text-sm">值得信赖的纪念空间</p>
                    </div>

                    <!-- Stat 2 -->
                    <div class="text-center">
                        <h3 class="text-5xl font-bold text-amber-500 mb-2">95%</h3>
                        <p class="text-amber-300 mb-1">客户满意度</p>
                        <p class="text-gray-400 text-sm">提供最贴心的纪念服务</p>
                    </div>

                    <!-- Stat 3 -->
                    <div class="text-center">
                        <h3 class="text-5xl font-bold text-amber-500 mb-2">10,000+</h3>
                        <p class="text-amber-300 mb-1">永久安息位</p>
                        <p class="text-gray-400 text-sm">见证思念的延续</p>
                    </div>

                    <!-- Stat 4 -->
                    <div class="text-center">
                        <h3 class="text-5xl font-bold text-amber-500 mb-2">50</h3>
                        <p class="text-amber-300 mb-1">英亩宁静庄重的园区</p>
                        <p class="text-gray-400 text-sm">打造最安详的追思环境</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Origin Section -->
        <section class="py-20 bg-gray-900">
            <div class="container mx-auto px-6">
                <div class="flex flex-col md:flex-row items-center">
                    <div class="md:w-1/2 mb-10 md:mb-0 md:pr-10">
                        <h2 class="text-3xl font-bold mb-6 text-amber-400">纪念馆缘起</h2>
                        <h3 class="text-2xl mb-6">传承孝道文化，缔造思念之地</h3>
                        <p class="text-gray-300 mb-6">
                            中华纪念馆不仅是一个存放先人骨灰的地方，更是一个承载记忆、延续亲情的空间。纪念馆的建立，旨在为家属提供一个安宁、庄重的环境，让思念得以寄托，让先人的精神得以传承。
                        </p>
                        <NuxtLink to="/about"
                            class="px-6 py-2 border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white rounded-sm transition duration-300">
                            了解更多
                        </NuxtLink>
                    </div>
                    <div class="md:w-1/2">
                        <div class="bg-gray-800 p-1">
                            <img src="https://placehold.co/1200x640" alt="中华纪念馆" class="w-full h-80 object-cover" />
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Services Section -->
        <section class="py-20 bg-black">
            <div class="container mx-auto px-6">
                <div class="text-center mb-16">
                    <h2 class="text-3xl font-bold mb-3 text-amber-400">追思服务</h2>
                    <h3 class="text-2xl mb-6">让思念有归处，让记忆被铭记</h3>
                    <p class="text-gray-300 max-w-3xl mx-auto">
                        在中华纪念馆，我们深知每一次的祭拜，都是对亲人的深深思念。因此，我们提供多样化的追思服务，满足不同家庭的需求，让每一份怀念都能得到尊重和延续。
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <!-- Service 1 -->
                    <div class="bg-gray-900 p-6 border border-gray-800 hover:border-amber-700 transition duration-300">
                        <div class="mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-amber-500" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                    d="M19 9l-7 7-7-7" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3v14" />
                            </svg>
                        </div>
                        <h4 class="text-xl font-bold mb-3 text-amber-300">安息堂</h4>
                        <p class="text-gray-400 mb-6">
                            我们的安息堂环境庄重，采用恒温恒湿管理，为骨灰存放提供一个安全、稳定的环境。同时，不同级别的存放区域，可满足不同家族的需求。
                        </p>
                        <NuxtLink to="/services" class="text-amber-500 hover:text-amber-400">了解更多 →</NuxtLink>
                    </div>

                    <!-- Service 2 -->
                    <div class="bg-gray-900 p-6 border border-gray-800 hover:border-amber-700 transition duration-300">
                        <div class="mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-amber-500" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                        </div>
                        <h4 class="text-xl font-bold mb-3 text-amber-300">租界殡仪馆</h4>
                        <p class="text-gray-400 mb-6">
                            我们提供专业的殡仪服务，包括灵堂布置、礼仪指导、追思会安排等，让每一场告别仪式都充满尊严与温情，为逝者送行，为生者送去慰藉。
                        </p>
                        <NuxtLink to="/services" class="text-amber-500 hover:text-amber-400">了解更多 →</NuxtLink>
                    </div>

                    <!-- Service 3 -->
                    <div class="bg-gray-900 p-6 border border-gray-800 hover:border-amber-700 transition duration-300">
                        <div class="mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-amber-500" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h4 class="text-xl font-bold mb-3 text-amber-300">圆满七日祭拜</h4>
                        <p class="text-gray-400 mb-6">
                            遵循传统，我们提供七日祭拜服务，由专业人员指导家属完成各项祭祀仪式，既尊重传统习俗，又融入现代元素，让逝者安心，生者慰藉。
                        </p>
                        <NuxtLink to="/services" class="text-amber-500 hover:text-amber-400">了解更多 →</NuxtLink>
                    </div>
                </div>
            </div>
        </section>

        <!-- Facilities Section -->
        <section class="py-20 bg-gray-900">
            <div class="container mx-auto px-6">
                <div class="text-center mb-16">
                    <h2 class="text-3xl font-bold mb-3 text-amber-400">场馆设施</h2>
                    <h3 class="text-2xl mb-6">宁静、庄重，让思念有温度</h3>
                    <p class="text-gray-300 max-w-3xl mx-auto">
                        中华纪念馆的建筑风格融合了中华传统美学与现代人文关怀，为家属提供一个庄严而温馨的追思空间。
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <!-- Facility 1 -->
                    <div class="group">
                        <div class="overflow-hidden">
                            <img src="https://placehold.co/200x200" alt="纪念大厅"
                                class="w-full h-64 object-cover transition duration-500 transform group-hover:scale-110" />
                        </div>
                        <div class="p-4 bg-gray-800 group-hover:bg-gray-700 transition duration-300">
                            <h4 class="text-lg font-bold text-amber-400">1. 纪念大厅</h4>
                        </div>
                    </div>

                    <!-- Facility 2 -->
                    <div class="group">
                        <div class="overflow-hidden">
                            <img src="https://placehold.co/200x200" alt="安息堂"
                                class="w-full h-64 object-cover transition duration-500 transform group-hover:scale-110" />
                        </div>
                        <div class="p-4 bg-gray-800 group-hover:bg-gray-700 transition duration-300">
                            <h4 class="text-lg font-bold text-amber-400">2. 安息堂</h4>
                        </div>
                    </div>

                    <!-- Facility 3 -->
                    <div class="group">
                        <div class="overflow-hidden">
                            <img src="https://placehold.co/200x200" alt="纪念墙"
                                class="w-full h-64 object-cover transition duration-500 transform group-hover:scale-110" />
                        </div>
                        <div class="p-4 bg-gray-800 group-hover:bg-gray-700 transition duration-300">
                            <h4 class="text-lg font-bold text-amber-400">3. 纪念墙</h4>
                        </div>
                    </div>

                    <!-- Facility 4 -->
                    <div class="group">
                        <div class="overflow-hidden">
                            <img src="https://placehold.co/200x200" alt="休息区 & 咖啡厅"
                                class="w-full h-64 object-cover transition duration-500 transform group-hover:scale-110" />
                        </div>
                        <div class="p-4 bg-gray-800 group-hover:bg-gray-700 transition duration-300">
                            <h4 class="text-lg font-bold text-amber-400">4. 休息区 & 咖啡厅</h4>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="py-20 bg-black">
            <div class="container mx-auto px-6 text-center">
                <h2 class="text-3xl font-bold mb-3 text-amber-400">慎终追远，寄托思念</h2>
                <p class="text-xl mb-8">联系我们，让思念不再遥远</p>
                <p class="text-gray-300 max-w-2xl mx-auto mb-8">
                    无论您想了解我们的纪念服务、预约参观，还是寻求个性化纪念方案，我们的团队随时为您提供帮助。
                </p>
                <NuxtLink to="/contact"
                    class="px-8 py-3 bg-amber-700 hover:bg-amber-600 text-white rounded-sm inline-block transition duration-300">
                    联系我们
                </NuxtLink>
            </div>
        </section>
    </div>
</template>

<script setup>
const statsSection = ref(null)

const scrollToStats = () => {
    statsSection.value.scrollIntoView({ behavior: 'smooth' })
}

// You'll need to create a public/images folder with the following placeholder images:
// - lotus.jpg
// - placeholder-memorial.jpg
// - placeholder-hall.jpg
</script>

<style scoped>
/* Custom styles here if needed */
</style>