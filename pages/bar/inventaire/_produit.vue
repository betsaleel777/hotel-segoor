<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <v-card elevation="2" shaped tile>
        <v-card-title class="headline grey lighten-1 primary--text">
          {{ produit.nom }} - {{ produit.code }}
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <side-gestion-bar />
            </v-col>
            <v-col cols="9">
              <v-data-table
                no-data-text="Aucun achat éffectué"
                :loading="$fetchState.pending"
                loading-text="En chargement ..."
                :headers="headers"
                :items="achats"
                :search="search"
                :items-per-page="10"
              >
                <template #[`top`]>
                  <v-toolbar flat>
                    <v-btn to="/bar/inventaire" dark color="primary" nuxt>
                      <v-icon left>mdi-arrow-left-thick</v-icon>
                      RETOUR
                    </v-btn>
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
                <template #[`item.quantite`]="{ item }">
                  {{ item.quantite + ' ' }}{{ produit.mesure }}
                </template>
                <template #[`item.prix`]="{ item }">
                  {{ item.prix + ' FCFA' }}
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
      achats: [],
      produit: {},
      headers: [
        { text: 'Code', value: 'code', sortable: false },
        { text: 'Quantité', value: 'quantite' },
        { text: 'Prix de revient', value: 'prix' },
        { text: 'Date', value: 'created_at' },
      ],
    }
  },
  async fetch() {
    const calebasse = await this.$axios.get(
      'stock/achats/produit/' + this.$route.params.produit
    )
    const listeAchats = calebasse.data.achats
    const produit = calebasse.data.produit
    const achats = listeAchats.map((achat) => {
      return {
        id: achat.id,
        code: achat.code,
        quantite: achat.quantite,
        prix: achat.prix_achat,
        created_at: this.$moment(achat.created_at).format('ll'),
      }
    })
    this.achats = achats
    this.produit = produit
  },
}
</script>

<style></style>
