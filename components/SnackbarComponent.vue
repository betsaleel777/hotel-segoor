<template>
  <div>
    <v-snackbar
      :value="show"
      :color="variant"
      :timeout="timeout"
      dark
      text
      absolute
      bottom
    >
      {{ text }}
      <template #action="{ attrs }">
        <v-btn dark text v-bind="attrs" @click="show = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      variant: '',
      text: '',
      timeout: 3500,
    }
  },
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'snackbar/SHOW_MESSAGE') {
        this.text = state.snackbar.text
        this.variant = state.snackbar.variant
        this.timeout = state.snackbar.timeout
        this.show = true
      }
    })
  },
}
</script>

<style></style>
