// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    "nitro-cloudflare-dev",
    '@nuxtjs/supabase',
    '@nuxtjs/tailwindcss',
  ],

  nitro: {
    preset: "cloudflare-pages",

    cloudflare: {
      deployConfig: true,
      nodeCompat: true
    }
  },
  supabase: {
    // Optional: Disable redirect on auth pages (recommended for SPA)
    redirect: false,
    // Your Supabase URL and anon key will be loaded from environment variables
  },
  app: {
    head: {
      title: 'Nova Memorial',
      meta: [
        { name: 'description', content: 'A memorial booking application' }
      ]
    }
  },
  dir: {
    layouts: './client/layouts',
    pages: './client/pages'
  },
  
})