<template>
  <v-card elevation="2" shaped tile>
    <v-card-title class="headline grey lighten-1 primary--text">
      Acceuil de la réception
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-tabs v-model="tab" fixed-tabs color="indigo darken-4">
        <v-tab v-for="item in items" :key="item.text">
          <v-icon left>{{ item.icon }}</v-icon
          >{{ item.text }}
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab" class="mt-7">
        <v-tab-item v-for="item in items" :key="item.text">
          <calendrier-dashboard v-if="item.text === 'Calendrier'" />
          <liste-reservation v-if="item.text === 'Réservations'" />
          <liste-hebergement v-if="item.text === 'Hébergements'" />
          <liste-client v-if="item.text === 'Clientelle'" />
          <liste-factures v-if="item.text === 'Factures'" />
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>
    <v-card-actions></v-card-actions>
  </v-card>
</template>

<script>
import CalendrierDashboard from '~/components/reception/dashboard/CalendrierDashboard.vue'
import ListeHebergement from '~/components/reception/hall/ListeHebergement.vue'
import ListeReservation from '~/components/reception/reservation/ListeReservation.vue'
import ListeClient from '~/components/reception/client/ListeClient.vue'
import ListeFactures from '~/components/reception/facture/ListeFactures.vue'

export default {
  components: {
    CalendrierDashboard,
    ListeHebergement,
    ListeReservation,
    ListeClient,
    ListeFactures,
  },
  data: () => ({
    tab: null,
    items: [
      { text: 'Calendrier', icon: 'mdi-calendar' },
      { text: 'Réservations', icon: 'mdi-shield-home' },
      { text: 'Hébergements', icon: 'mdi-bed' },
      { text: 'Clientelle', icon: 'mdi-account-group' },
      { text: 'Factures', icon: 'mdi-file-outline' },
    ],
  }),
}
</script>

<style></style>
