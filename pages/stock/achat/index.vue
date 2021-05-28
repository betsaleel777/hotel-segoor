<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <v-card elevation="2" shaped tile>
        <v-card-title class="headline grey lighten-1 primary--text">
          Produits
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <side-stock />
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
                no-data-text="Aucun achat éffectué"
                :loading="$fetchState.pending"
                loading-text="En chargement ..."
                :headers="headers"
                :items="achats"
                :search="search"
                :items-per-page="10"
              >
                <template #[`item.quantite`]="{ item }">
                  {{ item.quantite + ' ' }}{{ item.mesure }}
                </template>
                <template #[`item.prix_achat`]="{ item }">
                  {{ item.prix_achat + ' FCFA' }}
                </template>
                <template #[`item.actions`]="{ item }">
                  <delete-achat :item="item" @deleted-achat="achatDeleted" />
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <create-achat :produits="produits" @new-achat="pushAchat" />
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
// import moment from 'moment'
import CreateAchat from '~/components/stock/achat/CreateAchat.vue'
import DeleteAchat from '~/components/stock/achat/DeleteAchat.vue'
import SideStock from '~/components/stock/SideStock'
export default {
  components: {
    SideStock,
    CreateAchat,
    DeleteAchat,
  },
  data() {
    return {
      search: '',
      produits: [],
      achats: [],
      headers: [
        { text: 'Code', value: 'code', sortable: false },
        { text: 'Quantité', value: 'quantite' },
        { text: 'Description', value: 'nom' },
        { text: 'Prix revient', value: 'prix_achat', sortable: false },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  async fetch() {
    let calebasse = await this.$axios.get('stock/produits')
    const produits = calebasse.data.produits.map((produit) => {
      return {
        id: produit.id,
        mesure: produit.mesure,
        nom: produit.nom,
        type: produit.type,
      }
    })
    this.produits = produits
    calebasse = await this.$axios.get('stock/achats')
    const achats = calebasse.data.achats.map((achat) => {
      const pachat = isNaN(parseInt(achat.prix_achat)) ? 0 : achat.prix_achat
      return {
        id: achat.id,
        code: achat.code,
        quantite: achat.quantite,
        prix_achat: pachat,
        ingredient: achat.ingredient,
        nom: achat.produit.nom,
        mesure: achat.produit.mesure,
        contenance: achat.produit.contenance,
        type: achat.produit.type,
      }
    })
    this.achats = achats
  },
  methods: {
    pushAchat(achat) {
      this.achats.push(achat)
    },
    achatEdited(achat) {
      const index = this.achats.findIndex((element) => element.id === achat.id)
      this.achats.splice(index, 1, achat)
    },
    achatDeleted(achat) {
      this.achats = this.achats.filter((element) => element.id !== achat.id)
    },
  },
}
</script>

<style></style>
