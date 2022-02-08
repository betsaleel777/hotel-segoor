import colors from 'vuetify/es5/util/colors'
import { fr } from 'vuetify/lib/locale'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  ssr: false,
  env: {
    AUTH_API: process.env.AUTH_API || 'http://localhost:8000',
  },
  head: {
    titleTemplate: '%s - hotel-segoor',
    title: 'hotel-segoor',
    htmlAttrs: {
      lang: 'fr',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: '/css/materialize.min.css',
      },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: '/css/icons.min.css',
      },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: '/css/main.css',
      },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: '/css/responsive.css',
      },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: '/css/responsive.css',
      },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: '/css/color-schemes/color1.css',
        title: 'color1',
      },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: '/css/color-schemes/color2.css',
        title: 'color2',
      },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: '/css/color-schemes/color3.css',
        title: 'color3',
      },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: '/css/color-schemes/color4.css',
        title: 'color4',
      },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: '/css/color-schemes/color5.css',
        title: 'color5',
      },
    ],
    script: [
      { src: '/js/jquery.min.js', body: 'true' },
      { src: '/js/materialize.min.js', body: 'true' },
      { src: '/js/slick.min.js', body: 'true' },
      { src: '/js/isotope.min.js', body: 'true' },
      { src: '/js/isotope-int.js', body: 'true' },
      { src: '/js/jquery.counterup.js', body: 'true' },
      { src: '/js/waypoints.min.js', body: 'true' },
      { src: '/js/highcharts.js', body: 'true' },
      { src: '/js/exporting.js', body: 'true' },
      { src: '/js/highcharts-more.js', body: 'true' },
      { src: '/js/jquery.circliful.min.js', body: 'true' },
      { src: '/js/jquery.bootstrap-touchspin.min.js', body: 'true' },
      { src: '/js/jquery.formtowizard.js', body: 'true' },
      { src: '/js/form-validator.min.js', body: 'true' },
      { src: '/js/cropbox-min.js', body: 'true' },
      { src: '/js/jquery.slimscroll.min.js', body: 'true' },
      { src: '/js/jquery.poptrox.min.js', body: 'true' },
      { src: '/js/main.js', body: 'true' },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],
  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/notifier.js', ssr: false },
    { src: '~/plugins/user.js', ssr: false },
    { src: '~/plugins/vue-gates', ssr: false },
    { src: '~/plugins/apex-chart', ssr: false },
    { src: '~/plugins/TiptapVuetify', ssr: false },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/moment',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
  ],
  router: {
    middleware: ['auth'],
  },
  auth: {
    strategies: {
      laravelJWT: {
        scheme: 'refresh',
        provider: 'laravel/jwt',
        url: '/',
        endpoints: {
          login: { url: '/login', method: 'post' },
          refresh: { url: '/refresh', method: 'post' },
          user: { url: '/user', method: 'get' },
          logout: { url: '/logout', method: 'post' },
        },
        token: {
          property: 'access_token',
          maxAge: 60 * 60,
        },
        refreshToken: {
          maxAge: 60 * 60 * 24 * 30,
          property: 'refresh_token',
          data: 'refresh_token',
        },
      },
    },
    redirect: {
      login: '/auth/login',
      logout: '/auth/login',
      callback: false,
      home: '/',
    },
  },
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: process.env.AUTH_API, // Can be also an object with default options
    headers: {
      'Content-Type': 'application/json',
    },
    // credentials:true
    // withCredentials: true,
  },
  // moment global configuration
  moment: {
    defaultLocale: 'fr',
    locales: ['fr'],
    plugins: ['moment-range'],
  },
  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    locale: {
      defaultLocale: 'fr',
      fallbackLocale: 'fr',
      messages: { fr },
    },
    theme: {
      options: {
        customProperties: true,
      },
      dark: false,
      light: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
        light: {
          background: '#f3f3f3',
          primary: '#1976D2',
          secondary: '#424242',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['vuetify/lib', 'tiptap-vuetify'],
  },
}
