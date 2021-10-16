<template>
  <div>
    <v-tabs v-model="tab" vertical color="orange darken-4">
      <v-tab v-for="item in items" :key="item">
        {{ item }}
      </v-tab>
      <v-tab-item>
        <liste-factures-non-soldees />
      </v-tab-item>
      <v-tab-item>
        <liste-factures-soldees />
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import ListeFacturesSoldees from '~/components/reception/facture/ListeFacturesSoldees.vue'
import ListeFacturesNonSoldees from '~/components/reception/facture/ListeFacturesNonSoldees.vue'

export default {
  components: {
    ListeFacturesSoldees,
    ListeFacturesNonSoldees,
  },
  data: () => ({
    tab: null,
    items: ['factures non soldées', 'factures soldées'],
  }),
}
</script>

<style></style>
