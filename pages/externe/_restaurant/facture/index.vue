<template>
  <v-card elevation="2" shaped tile>
    <v-card-title class="headline grey lighten-1 primary--text">
      Factures et paiements
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <side-externe :restaurant="restaurant" />
        </v-col>
        <v-col justify="center" align="center" cols="12" md="9">
          <v-tabs v-model="tab" fixed-tabs color="indigo darken-4">
            <v-tab v-for="item in items" :key="item.text">
              <v-icon left>{{ item.icon }}</v-icon
              >{{ item.text }}
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab" class="mt-7">
            <v-tab-item v-for="item in items" :key="item.text">
              <liste-facture-non-soldee
                v-if="item.text === 'Factures Non Soldées'"
                :factures="nonSoldees"
                :restaurant="restaurant"
              />
              <liste-facture-soldee
                v-if="item.text === 'Factures Soldées'"
                :factures="soldees"
                :restaurant="restaurant"
              />
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions></v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import ListeFactureNonSoldee from '~/components/externe/facture/ListeFactureExterneNonSoldee.vue'
import ListeFactureSoldee from '~/components/externe/facture/ListeFactureExterneSoldee.vue'
import SideExterne from '~/components/externe/SideExterne.vue'
export default {
  components: {
    SideExterne,
    ListeFactureNonSoldee,
    ListeFactureSoldee,
  },
  data: () => ({
    tab: null,
    items: [
      { text: 'Factures Non Soldées', icon: 'mdi-file-outline' },
      { text: 'Factures Soldées', icon: 'mdi-dollars' },
    ],
  }),
  async fetch() {
    const { params, store } = this.$nuxt.context
    this.restaurant = Number(params.restaurant)
    await store.dispatch('externe/facture/getSoldees', params.restaurant)
    await store.dispatch('externe/facture/getNonSoldees', params.restaurant)
  },
  computed: {
    ...mapGetters('externe/facture', ['soldees', 'nonSoldees']),
  },
}
</script>

<style></style>
