<template>
  <div>
    <v-expansion-panels
      v-for="(pannel, index) in pannels"
      :key="index"
      focusable
      tile
      class="mb-3"
    >
      <timeline-pannel-provider
        :titre="pannel.titre"
        :action="pannel.action"
        :items="ordres"
      />
    </v-expansion-panels>
  </div>
</template>
<script>
import TimelinePannelProvider from './TimelinePannelProvider.vue'
export default {
  components: {
    TimelinePannelProvider,
  },
  props: {
    ordres: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    pannels: [
      {
        titre: 'Réparations Terminées',
        action: 'completed',
      },
      {
        titre: 'Réparations Du jour',
        action: 'today',
      },
      {
        titre: 'Réparations Prévues',
        action: 'future',
      },
      {
        titre: 'Réparations Non Traitées',
        action: 'untreated',
      },
      {
        titre: 'Mauvaises Réparations',
        action: 'incompleted',
      },
    ],
  }),
}
</script>
<style></style>
