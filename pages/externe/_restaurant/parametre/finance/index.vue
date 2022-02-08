<template>
  <v-card elevation="2" shaped tile>
    <v-card-title class="headline grey lighten-1 primary--text">
      Configuration finance
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <side-externe :restaurant="restaurant" />
        </v-col>
        <v-col cols="12" sm="6" md="9">
          <v-tabs
            v-model="tab"
            fixed-tabs
            color="indigo darken-4"
            align-with-title
            center-active
          >
            <v-tab v-for="(item, i) in items" :key="i">
              <template #default>
                <v-icon left>{{ item.icon }}</v-icon
                ><span class="text-subtitle-2">{{ item.text }}</span>
              </template>
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item v-for="(item, i) in items" :key="i">
              <v-row>
                <v-col cols="1"></v-col>
                <v-col cols="10">
                  <liste-paiement
                    v-if="item.text === 'Paiements Mobiles'"
                    :restaurant="restaurant"
                  />
                </v-col>
                <v-col cols="1"></v-col>
              </v-row>
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions></v-card-actions>
  </v-card>
</template>

<script>
import SideExterne from '~/components/externe/SideExterne.vue'
import ListePaiement from '~/components/externe/parametre/finance/ListePaiementWayExterne.vue'
export default {
  components: {
    SideExterne,
    ListePaiement,
  },
  data: () => ({
    tab: null,
    items: [
      { text: 'Paiements Mobiles', icon: 'mdi-cellphone' },
      { text: 'Factures et taxes', icon: 'mdi-cash-fast' },
    ],
  }),
  fetch() {
    const { params } = this.$nuxt.context
    this.restaurant = Number(params.restaurant)
  },
}
</script>

<style></style>
