// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@vite-pwa/nuxt'
  ],
  css: ['~/assets/css/main.css'],
  tailwindcss: {
    config: {
      darkMode: 'class',
    }
  },
  pwa: {
    manifest: {
      name: 'Controle de Peças',
      short_name: 'Peças',
      description: 'Controle de empréstimo de peças entre assistências',
      theme_color: '#111827',
      background_color: '#111827',
      display: 'standalone',
      icons: [
        {
          src: 'icon_64x64.png',
          sizes: '64x64',
          type: 'image/png'
        },
        {
          src: 'icon_144x144.png',
          sizes: '144x144',
          type: 'image/png'
        },
        {
          src: 'icon_192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'icon_512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      navigateFallback: '/'
    },
    devOptions: {
      enabled: true,
      type: 'module'
    }
  },
  app: {
    head: {
      title: 'Controle de Peças',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0' },
        { name: 'theme-color', content: '#111827' }
      ]
    }
  },
})
