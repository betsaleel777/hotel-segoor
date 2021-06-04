<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <v-card elevation="2" shaped tile>
        <v-card-title class="headline grey lighten-1 primary--text">
          Inventaire du Bar
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <side-gestion-bar />
            </v-col>
            <v-col cols="9">
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="recherche ..."
                single-line
                hide-details
              ></v-text-field>
              <v-data-table
                no-data-text="Inventaire vide"
                :loading="$fetchState.pending"
                loading-text="En chargement ..."
                :headers="headers"
                :items="demandes"
                :search="search"
                :items-per-page="10"
              >
                <template #[`item.quantite`]="{ item }">
                  {{ item.quantite + ' ' }}{{ item.mesure }}
                </template>
                <template #[`item.actions`]="{ item }">
                  <v-btn
                    :to="'/bar/inventaire/' + item.id"
                    color="pink"
                    elevation="1"
                    icon
                    fab
                    dark
                    x-small
                    ><v-icon small> mdi-eye</v-icon></v-btn
                  >
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
import SideGestionBar from '~/components/bar/SideGestionBar.vue'
export default {
  components: {
    SideGestionBar,
  },
  data() {
    return {
      search: '',
      demandes: [],
      headers: [
        { text: 'Code', value: 'code', sortable: false },
        { text: 'Description', value: 'nom' },
        { text: 'Disponible', value: 'quantite' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  async fetch() {
    // doit recuperer le departement de l'utilisateur
    let departement = null
    let calebasse = await this.$axios.get('parametre/departements/' + 'bar')
    departement = calebasse.data.departement
    calebasse = await this.$axios.get(
      'stock/demandes/inventaire/' + departement.id
    )
    const demandes = calebasse.data.inventaire.map((ligne) => {
      return {
        id: ligne.id,
        nom: ligne.nom,
        code: ligne.code,
        quantite: ligne.quantite,
        mesure: ligne.mesure,
      }
    })
    this.demandes = demandes
  },
}
</script>

<style></style>
