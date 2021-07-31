<template>
  <div>
    <v-snackbar
      v-model="show"
      timeout="3500"
      :color="variantUse"
      text
      right
      top
    >
      {{ text }}
      <template #action="{ attrs }">
        <v-btn
          color="blue darken-4"
          dark
          text
          v-bind="attrs"
          @click="show = false"
        >
          Fermer
        </v-btn>
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
    }
  },
  computed: {
    variantUse() {
      return this.variant + ' darken-4'
    },
  },
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'snackbar/SHOW_MESSAGE') {
        this.text = state.snackbar.text
        this.variant = state.snackbar.variant
        this.show = true
      }
    })
  },
}
</script>

<style></style>
