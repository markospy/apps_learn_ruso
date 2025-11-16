// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss'],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'Matriuska - Aprende Ruso',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Aprende Ruso de forma interactiva' },
        { name: 'keywords', content: 'Ruso, Aprender Ruso, Conjugaciones, Pronunciación, Vocabulario, Gramática, Mejor apliacion para aprender Ruso, Hablar Ruso, Aprender Ruso online, Aprender Ruso gratis, Aprender Ruso facil, Aprender Ruso rapido, Aprender Ruso online gratis, Aprender Ruso online facil, Aprender Ruso online rapido' },
        { name: 'author', content: 'Matriuska' },
        { name: 'robots', content: 'index, follow' },
        { name: 'googlebot', content: 'index, follow' },
        { name: 'bingbot', content: 'index, follow' },
        { name: 'yandexbot', content: 'index, follow' },
        { name: 'duckduckbot', content: 'index, follow' },
        { name: 'slurp', content: 'index, follow' },
        { name: 'crawler', content: 'index, follow' },
        { name: 'spider', content: 'index, follow' },
      ],
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? 'http://localhost:8000/api',
    }
  },

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config',
    exposeConfig: false,
    viewer: true,
  }
})

