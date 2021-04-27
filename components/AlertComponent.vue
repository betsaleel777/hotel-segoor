<template>
  <div>
    <v-alert
      :value="show"
      class="my-6"
      border="right"
      prominent
      outlined
      text
      :type="variant"
      dismissible
    >
      {{ text }}
    </v-alert>
  </div>
</template>

<script>
export default {
  data() {
    return {
      text: '',
      variant: 'info',
      show: false,
    }
  },
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'alert/SHOW_MESSAGE') {
        this.text = state.alert.text
        this.variant = state.alert.variant
        this.show = true
      }
    })
  },
}
</script>

<style></style>
