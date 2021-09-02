<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <v-card elevation="2" shaped tile>
        <v-card-title class="headline grey lighten-1 primary--text">
          Factures
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <side-reception />
            </v-col>
            <v-col cols="12" sm="6" md="9">
              <v-data-table
                no-data-text="Aucune Facture"
                :loading="$fetchState.pending"
                loading-text="En chargement ..."
                :headers="headers"
                :items="factures"
                :search="search"
                :items-per-page="10"
              >
                <template #[`top`]>
                  <v-toolbar flat>
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
                  <v-chip small :color="getColor(item.status)" dark>
                    {{ item.status }}
                  </v-chip>
                </template>
                <template #[`item.created_at`]="{ item }">
                  {{ $moment(item.created_at).format('ll') }}
                </template>
                <template #[`item.actions`]="{ item }">
                  <show-facture-reception :item="item" />
                  <delete-facture-reception :item="item" />
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
import { mapGetters, mapActions } from 'vuex'
import ShowFactureReception from '~/components/reception/facture/ShowFactureReception.vue'
import DeleteFactureReception from '~/components/reception/facture/DeleteFactureReception.vue'
import SideReception from '~/components/reception/SideReception.vue'

export default {
  components: {
    ShowFactureReception,
    DeleteFactureReception,
    SideReception,
  },
  data() {
    return {
      search: '',
      headers: [
        { text: 'Code', value: 'code', sortable: false, align: 'center' },
        { text: 'Statut', value: 'status', sortable: false, align: 'center' },
        { text: 'Chambre', value: 'chambre', sortable: false, align: 'center' },
        { text: 'Client', value: 'client', sortable: false, align: 'center' },
        { text: 'Date', value: 'created_at', align: 'center' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  fetch() {
    this.getAll()
  },
  computed: {
    ...mapGetters('facture-reception', ['factures']),
  },
  methods: {
    ...mapActions('facture-reception', ['getAll']),
    getColor(status) {
      if (status === 'soldée') {
        return 'success'
      } else {
        return 'error'
      }
    },
  },
}
</script>

<style></style>
