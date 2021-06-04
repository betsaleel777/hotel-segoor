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
              <side-stock />
            </v-col>
            <v-col cols="12" sm="6" md="9">
              <v-data-table
                no-data-text="Aucun Demande"
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
                <template #[`item.departement.nom`]="{ item }">
                  <b>{{ item.departement.nom }}</b>
                </template>
                <template #[`item.status`]="{ item }">
                  <v-chip small outlined :color="getColor(item.status)" dark>
                    {{ item.status }}
                  </v-chip>
                </template>
                <template #[`item.actions`]="{ item }">
                  <show-demande :item="item" />
                  <process-demande
                    v-if="item.status === 'en cours'"
                    :item="item"
                    @accepted-demande="demandeChanged"
                    @rejected-demande="demandeChanged"
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
/* eslint-disable camelcase */
import SideStock from '~/components/stock/SideStock.vue'
import ProcessDemande from '~/components/stock/demande/ProcessDemande'
import ShowDemande from '~/components/restaurant/demande/ShowDemande.vue'

export default {
  components: {
    SideStock,
    ProcessDemande,
    ShowDemande,
  },
  data() {
    return {
      search: '',
      demandes: [],
      headers: [
        { text: 'Code', value: 'code', sortable: false },
        { text: 'Titre', value: 'titre', sortable: false },
        { text: 'Département', value: 'departement.nom', sortable: false },
        { text: 'Statut', value: 'status', sortable: false },
        { text: 'Date', value: 'created_at' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  async fetch() {
    const calebasse = await this.$axios.get('stock/demandes')
    const demandes = calebasse.data.demandes.map((demande) => {
      const {
        code,
        titre,
        status,
        created_at,
        id,
        departement_linked,
        produits,
      } = demande
      return {
        id,
        titre,
        code,
        status,
        created_at: this.$moment(created_at).format('ll'),
        produits,
        departement: { id: departement_linked.id, nom: departement_linked.nom },
      }
    })
    this.demandes = demandes
  },
  methods: {
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
    pushDemande(demande) {
      demande.created_at = this.$moment(demande.created_at).format('ll')
      this.demandes.push(demande)
    },
    demandeChanged(demande) {
      demande.created_at = this.$moment(demande.created_at).format('ll')
      const index = this.demandes.findIndex(
        (element) => element.id === demande.id
      )
      this.demandes.splice(index, 1, demande)
    },
  },
}
</script>

<style></style>
