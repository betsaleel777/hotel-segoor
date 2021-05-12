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
              <side-restaurant />
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
                :headers="headers"
                :items="achats"
                :search="search"
                :items-per-page="10"
              >
                <template #[`item.quantite`]="{ item }">
                  {{ item.quantite + ' ' }}{{ item.mesure }}
                </template>
                <template #[`item.prix_achat`]="{ item }">
                  {{ displayPrice(item.prix_achat, item.mesure) }}
                </template>
                <template #[`item.prix_vente`]="{ item }">
                  {{ displayPrice(item.prix_vente, item.mesure) }}
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
import moment from 'moment'
import CreateAchat from '~/components/restaurant/achat/CreateAchat.vue'
import DeleteAchat from '~/components/restaurant/achat/DeleteAchat.vue'
import SideRestaurant from '~/components/restaurant/SideRestaurant'
export default {
  components: {
    SideRestaurant,
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
        { text: 'Produit', value: 'nom' },
        { text: 'Prix Achat', value: 'prix_achat', sortable: false },
        { text: 'Prix vente', value: 'prix_vente', sortable: false },
        { text: 'Date', value: 'laDate' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  async mounted() {
    let calebasse = await this.$axios.get('/restaurant/produits')
    const produits = calebasse.data.produits.map((produit) => {
      return {
        id: produit.id,
        mesure: produit.mesure,
        nom: produit.nom,
        type: produit.type,
      }
    })
    this.produits = produits
    calebasse = await this.$axios.get('/restaurant/achats')
    const achats = calebasse.data.achats.map((achat) => {
      moment.locales('fr')
      return {
        id: achat.id,
        code: achat.code,
        quantite: achat.quantite,
        prix_achat: achat.prix_achat,
        prix_vente: achat.prix_vente,
        ingredient: achat.ingredient,
        nom: achat.produit.nom,
        mesure: achat.produit.mesure,
        type: achat.produit.type,
        laDate: moment(achat.created_at).format('DD-MM-yyyy'),
      }
    })
    this.achats = achats
  },
  methods: {
    displayPrice(prix, mesure) {
      if (mesure) {
        return `${prix} FCFA/${mesure}`
      } else {
        return `${prix} FCFA`
      }
    },
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
