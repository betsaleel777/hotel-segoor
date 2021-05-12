<template>
  <div>
    <v-snackbar
      :value="show"
      :color="variantUse"
      :timeout="timeout"
      text
      absolute
      bottom
      elevation="24"
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
  computed: {
    variantUse() {
      return this.variant + ' darken-3'
    },
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
