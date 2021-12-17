<template>
  <div>
    <v-expansion-panels
      v-for="(pannel, index) in pannels"
      :key="index"
      focusable
      tile
      class="mb-3"
    >
      <timeline-pannel
        :titre="pannel.titre"
        :action="pannel.action"
        :items="entretiens"
      />
    </v-expansion-panels>
  </div>
</template>
<script>
import TimelinePannel from './TimelinePannel.vue'
export default {
  components: {
    TimelinePannel,
  },
  props: {
    entretiens: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    pannels: [
      {
        titre: 'Entretiens Terminés',
        action: 'completed',
      },
      {
        titre: 'Entretiens Du jour',
        action: 'today',
      },
      {
        titre: 'Entretiens Prévus',
        action: 'future',
      },
      {
        titre: 'Entretiens Non Traités',
        action: 'untreated',
      },
    ],
  }),
}
</script>
<style></style>
