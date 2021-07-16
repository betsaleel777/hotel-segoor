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
                :items="lignes"
                :search="search"
                :items-per-page="10"
              >
                <template #[`item.disponible`]="{ item }">
                  {{ item.disponible + ' ' }}{{ item.mesure }}
                </template>
                <template #[`item.reste`]="{ item }">
                  {{ item.reste + ' %' }}
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
      lignes: [],
      headers: [
        { text: 'Code', value: 'code', sortable: false },
        { text: 'Description', value: 'nom' },
        { text: 'Disponible', value: 'disponible' },
        { text: 'En cours', value: 'reste' },
      ],
    }
  },
  async fetch() {
    // doit recuperer le departement de l'utilisateur
    let departement = null
    let requete = await this.$axios.get('parametre/departements/' + 'bar')
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
        reste: ligne.reste ?? 0,
        mesure: ligne.mesure,
      }
    })
    this.lignes = lignes
  },
}
</script>

<style></style>
