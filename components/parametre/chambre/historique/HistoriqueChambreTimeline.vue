<template>
  <v-container>
    <time-line-chambre-hebergement v-if="mode === 1" />
    <timeline-chambre-entretien v-if="mode === 2" />
    <timeline-chambre-reparation v-if="mode === 3" />
  </v-container>
</template>
<script>
import TimelineChambreEntretien from './TimelineChambreEntretien.vue'
import TimeLineChambreHebergement from './TimeLineChambreHebergement.vue'
import TimelineChambreReparation from './TimelineChambreReparation.vue'
export default {
  components: {
    TimelineChambreEntretien,
    TimelineChambreReparation,
    TimeLineChambreHebergement,
  },
  props: {
    mode: {
      type: Number,
      required: true,
    },
  },
}
</script>
<style lang=""></style>
