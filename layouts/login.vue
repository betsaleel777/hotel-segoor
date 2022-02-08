<template>
  <v-app>
    <v-main>
      <nuxt />
      <snackbar-component />
    </v-main>
  </v-app>
</template>

<script>
import SnackbarComponent from '~/components/SnackbarComponent.vue'
export default {
  components: { SnackbarComponent },
}
</script>
