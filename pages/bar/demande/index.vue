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
              <side-gestion-bar />
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
                  <v-toolbar flat>
                    <create-demande
                      :from="'bar'"
                      :floating="false"
                      @new-demande="pushDemande"
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
                <template #[`item.actions`]="{ item }">
                  <show-demande :item="item" />
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <create-demande :from="'bar'" @new-demande="pushDemande" />
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
/* eslint-disable camelcase */
import SideGestionBar from '~/components/bar/SideGestionBar.vue'
import CreateDemande from '~/components/restaurant/demande/CreateDemande.vue'
import ShowDemande from '~/components/restaurant/demande/ShowDemande.vue'

export default {
  components: {
    CreateDemande,
    ShowDemande,
    SideGestionBar,
  },
  data() {
    return {
      search: '',
      demandes: [],
      headers: [
        { text: 'Titre', value: 'titre', sortable: false },
        { text: 'Statut', value: 'status', align: 'center', sortable: false },
        { text: 'Date', value: 'created_at', align: 'center' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  async fetch() {
    // récuperer uniquement les demandes du département en question
    let departement = null
    let calebasse = await this.$axios.get('parametre/departements/' + 'bar')
    departement = calebasse.data.departement.id
    calebasse = await this.$axios.get('stock/demandes/' + departement)
    const demandes = calebasse.data.demandes.map((demande) => {
      const {
        code,
        titre,
        status,
        created_at,
        id,
        departement_linked,
        produits,
        sortie,
      } = demande
      return {
        id,
        titre,
        code,
        status,
        created_at: this.$moment(created_at).format('ll'),
        produits,
        departement: departement_linked.id,
        sortie,
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
      }
    },
    pushDemande(demande) {
      demande.created_at = this.$moment(demande.created_at).format('ll')
      this.demandes.push(demande)
    },
  },
}
</script>

<style></style>
