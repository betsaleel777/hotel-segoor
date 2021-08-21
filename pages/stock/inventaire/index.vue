<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <v-card elevation="2" shaped tile>
        <v-card-title class="headline grey lighten-1 primary--text">
          Inventaire stock général
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <side-stock />
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
                    <template #[`item.reste`]="{ item }">
                      {{ item.reste + ' %' }}
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
import SideStock from '~/components/stock/SideStock.vue'
export default {
  components: {
    SideStock,
  },
  data() {
    return {
      search: '',
      lignes: [],
      headers: [
        { text: 'Description', value: 'nom' },
        { text: 'Disponible', value: 'disponible' },
        { text: 'En cours', value: 'reste' },
      ],
    }
  },
  async fetch() {
    const requete = await this.$axios.get('stock/produits/inventaire')
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
