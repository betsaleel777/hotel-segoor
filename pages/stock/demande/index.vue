<template>
  <v-card elevation="2" shaped tile>
    <v-card-title class="headline grey lighten-1 primary--text">
      Demandes
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <side-stock />
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
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="recherche ..."
                single-line
                hide-details
              ></v-text-field>
            </template>
            <template #[`item.departement_linked.nom`]="{ item }">
              <b>{{ item.departement_linked.nom }}</b>
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
              <process-demande
                v-if="item.status === 'en cours'"
                :key="key"
                :item="item"
                :disponibles="disponibles"
              />
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions> </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import SideStock from '~/components/stock/SideStock.vue'
import ProcessDemande from '~/components/stock/demande/ProcessDemande'
import ShowDemandeStock from '~/components/stock/demande/ShowDemandeStock.vue'

export default {
  components: {
    SideStock,
    ProcessDemande,
    ShowDemandeStock,
  },
  data() {
    return {
      search: '',
      key: false,
      headers: [
        { text: 'Titre', value: 'titre', sortable: false },
        {
          text: 'Département',
          value: 'departement_linked.nom',
          sortable: false,
        },
        { text: 'Statut', value: 'status', sortable: false },
        { text: 'Date', value: 'created_at' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  async fetch() {
    await this.getAll()
    await this.getDisponiblesArticles()
    this.key = !this.key
  },
  computed: {
    ...mapGetters('stock/demande', ['demandes']),
    ...mapGetters('stock/article', ['disponibles']),
  },
  methods: {
    ...mapActions({
      getAll: 'stock/demande/getAll',
      getDisponiblesArticles: 'stock/article/getDisponibleStock',
    }),
    getColor(status) {
      if (status === 'en cours') {
        return 'blue'
      } else if (status === 'rejettée') {
        return 'red'
      } else if (status === 'acceptée') {
        return 'green'
      } else if (status === 'livrée') {
        return 'pink'
      } else {
        return 'deep-orange'
      }
    },
  },
}
</script>

<style></style>
