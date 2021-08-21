<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <v-card elevation="2" shaped tile>
        <v-card-title class="headline grey lighten-1 primary--text">
          Inventaire du Restaurant
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <side-restaurant />
            </v-col>
            <v-col cols="9">
              <v-row>
                <v-col cols="2"></v-col>
                <v-col cols="8">
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
                    :items="lignes"
                    :search="search"
                    :items-per-page="10"
                  >
                    <template #[`item.disponible`]="{ item }">
                      {{ item.disponible + ' ' }}{{ item.mesure }}
                    </template>
                  </v-data-table>
                </v-col>
                <v-col cols="2"></v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions> </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
// import moment from 'moment'
import SideRestaurant from '~/components/restaurant/SideRestaurant.vue'
export default {
  components: {
    SideRestaurant,
  },
  data() {
    return {
      search: '',
      lignes: [],
      headers: [
        { text: 'Description', value: 'nom' },
        { text: 'Disponible', value: 'disponible' },
      ],
    }
  },
  async fetch() {
    // doit recuperer le departement de l'utilisateur
    let departement = null
    let requete = await this.$axios.get(
      'parametre/departements/' + 'restaurant'
    )
    departement = requete.data.departement
    requete = await this.$axios.get(
      'stock/demandes/inventaire/' + departement.id
    )
    const lignes = requete.data.inventaire.map((ligne) => {
      return {
        id: ligne.id,
        nom: ligne.nom,
        code: ligne.code,
        disponible: ligne.disponible,
        mesure: ligne.mesure,
      }
    })
    this.lignes = lignes
  },
}
</script>

<style></style>
