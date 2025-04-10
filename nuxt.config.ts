// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ["nitro-cloudflare-dev"],

  nitro: {
    preset: "cloudflare-pages",

    cloudflare: {
      deployConfig: true,
      nodeCompat: true
    }
  }
})