<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <v-card elevation="2" shaped tile>
        <v-card-title class="headline grey lighten-1 primary--text">
          Demandes
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <side-restaurant />
            </v-col>
            <v-col cols="12" sm="6" md="9">
              <v-data-table
                no-data-text="Aucune Demande"
                :loading="$fetchState.pending"
                loading-text="En chargement ..."
                :headers="headers"
                :items="demandes"
                :search="search"
                :items-per-page="10"
              >
                <template #[`top`]>
                  <v-toolbar flat>
                    <create-demande
                      v-can="'creation demande restau'"
                      :departement="1"
                    />
                    <v-spacer></v-spacer>
                    <v-text-field
                      v-model="search"
                      append-icon="mdi-magnify"
                      label="recherche ..."
                      single-line
                      hide-details
                    ></v-text-field>
                  </v-toolbar>
                </template>
                <template #[`item.status`]="{ item }">
                  <v-chip small outlined :color="getColor(item.status)" dark>
                    {{ item.status }}
                  </v-chip>
                </template>
                <template #[`item.created_at`]="{ item }">
                  {{ $moment(item.created_at).format('ll') }}
                </template>
                <template #[`item.actions`]="{ item }">
                  <show-demande-stock :item="item" />
                  <reception-demande
                    v-if="item.status === 'livrée'"
                    :item="item"
                  />
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions> </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import CreateDemande from '~/components/restaurant/demande/CreateDemande.vue'
import SideRestaurant from '~/components/restaurant/SideRestaurant.vue'
import ReceptionDemande from '~/components/stock/demande/ReceptionDemande.vue'
import ShowDemandeStock from '~/components/stock/demande/ShowDemandeStock.vue'

export default {
  components: {
    SideRestaurant,
    CreateDemande,
    ReceptionDemande,
    ShowDemandeStock,
  },
  data() {
    return {
      search: '',
      headers: [
        { text: 'Titre', value: 'titre', sortable: false },
        { text: 'Statut', value: 'status', align: 'center', sortable: false },
        { text: 'Date', value: 'created_at', align: 'center' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  async fetch() {
    await this.getDemandeRestau()
  },
  computed: {
    ...mapGetters('stock/demande', ['demandes']),
  },
  methods: {
    ...mapActions('stock/demande', ['getDemandeRestau']),
    getColor(status) {
      if (status === 'en cours') {
        return 'blue'
      } else if (status === 'rejettée') {
        return 'red'
      } else if (status === 'livrée') {
        return 'green'
      } else {
        return 'pink'
      }
    },
  },
}
</script>

<style></style>
