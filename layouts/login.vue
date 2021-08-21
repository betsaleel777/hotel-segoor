<template>
  <v-app>
    <v-main class="blue-grey">
      <v-container fluid>
        <alert-component />
        <nuxt />
        <snackbar-component />
      </v-container>
    </v-main>
    <v-footer app>
      <span>
        lovely designed by
        <a
          href="http://www.segoor.com"
          target="_blank"
          rel="noopener noreferrer"
          >segoor</a
        >
        &copy; {{ new Date().getFullYear() }}
      </span>
    </v-footer>
  </v-app>
</template>

<script>
import AlertComponent from '~/components/AlertComponent.vue'
import SnackbarComponent from '~/components/SnackbarComponent.vue'
export default {
  components: { SnackbarComponent, AlertComponent },
}
</script>
