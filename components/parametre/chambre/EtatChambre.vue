<template>
  <div></div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  mounted() {
    this.getForunitures()
  },
  cmoputed: {
    ...mapGetters('maintenance/fournitures', ['fournitures']),
  },
  methods: {
    ...mapActions({ getForunitures: 'maintenance/fournitures/getAll' }),
  },
}
</script>
<style lang=""></style>
