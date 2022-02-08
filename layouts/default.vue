<template>
  <v-app>
    <TopBar />
    <Header />
    <nuxt />
    <snackbar-component />
    <footer>
      <span class="ml-2">
        <a href="https://segoor.net" target="_blank">
          <img src="/segoor-favi.png" /> Segoor
        </a>
      </span>
      <span>Powered by</span>
    </footer>
  </v-app>
</template>

<script>
import TopBar from '~/components/partials/TopBar.vue'
import Header from '~/components/partials/Header.vue'
import SnackbarComponent from '~/components/SnackbarComponent.vue'
export default {
  components: {
    SnackbarComponent,
    TopBar,
    Header,
  },
  head: () => ({
    bodyAttrs: {
      class: 'panel-data expand-data',
    },
  }),
  methods: {
    logout() {
      this.$auth.logout('laravelJWT').then(() => {
        localStorage.clear()
      })
    },
  },
}
</script>
<style scoped>
.theme--light.v-application {
  background-color: var(--v-background-base, #f3f3f3) !important;
}
</style>
