// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  debug: true,
  runtimeConfig: {
    // The private keys which are only available server-side
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleRedirectUri: process.env.GOOGLE_REDIRECT_URI,
    
    // Keys within public are also exposed client-side
    public: {
      // Public config here
    }
  },
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
    },
    externals: {
      inline: ['google-auth-library'],
    },
    rollupConfig: {
      output: {
        format: 'es'
      }
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