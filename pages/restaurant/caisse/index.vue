<template>
  <v-card elevation="2" shaped tile>
    <v-card-title class="headline grey lighten-1 primary--text">
      Caisse
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <side-restaurant />
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
              <liste-factures-non-soldees
                v-if="item.text === 'Factures Non Soldées'"
              />
              <liste-factures-soldees v-if="item.text === 'Factures Soldées'" />
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions></v-card-actions>
  </v-card>
</template>

<script>
import ListeFacturesNonSoldees from '~/components/restaurant/caisse/ListeFacturesNonSoldeesCaisse'
import ListeFacturesSoldees from '~/components/restaurant/caisse/ListeFacturesSoldeesCaisse'
import SideRestaurant from '~/components/restaurant/SideRestaurant'

export default {
  components: {
    ListeFacturesNonSoldees,
    ListeFacturesSoldees,
    SideRestaurant,
  },
  data: () => ({
    tab: null,
    items: [
      { text: 'Factures Non Soldées', icon: 'mdi-file-outline' },
      { text: 'Factures Soldées', icon: 'mdi-dollars' },
    ],
  }),
}
</script>

<style></style>
