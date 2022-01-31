<template>
  <v-app>
    <top-bar />
    <Header />
    <nuxt />
    <footer>
      <span>Build by</span>
      <span class="ml-2">
        <a href="https://segoor.net" target="_blank">
          <img src="/segoor-favi.png" /> Segoor
        </a>
      </span>
    </footer>
  </v-app>
</template>

<script>
import TopBar from '~/components/partials/TopBar.vue'
import Header from '~/components/partials/Header.vue'
export default {
  components: {
    TopBar,
    Header,
  },
  head: () => ({
    bodyAttrs: {
      class: 'panel-data expand-data',
    },
  }),
}
</script>
