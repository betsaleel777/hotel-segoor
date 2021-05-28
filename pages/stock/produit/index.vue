<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <v-card elevation="2" shaped tile>
        <v-card-title class="headline grey lighten-1 primary--text">
          Articles
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <side-stock />
            </v-col>
            <v-col cols="12" sm="6" md="9">
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="recherche ..."
                single-line
                hide-details
              ></v-text-field>
              <v-data-table
                no-data-text="Aucun produit"
                :loading="$fetchState.pending"
                loading-text="En chargement ..."
                :headers="headers"
                :items="produits"
                :search="search"
                :items-per-page="10"
              >
                <template #[`item.seuil`]="{ item }">
                  {{ item.seuil + ' ' }}{{ item.mesure }}
                </template>
                <template #[`item.actions`]="{ item }">
                  <edit-produit
                    :categories="categories"
                    :item="item"
                    @edited-produit="produitEdited"
                  />
                  <delete-produit
                    :item="item"
                    @deleted-produit="produitDeleted"
                  />
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <create-produit :categories="categories" @new-produit="pushProduit" />
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import CreateProduit from '~/components/stock/produit/CreateProduit.vue'
import DeleteProduit from '~/components/stock/produit/DeleteProduit.vue'
import EditProduit from '~/components/stock/produit/EditProduit.vue'
import SideStock from '~/components/stock/SideStock'
export default {
  components: {
    SideStock,
    CreateProduit,
    DeleteProduit,
    EditProduit,
  },
  data() {
    return {
      search: '',
      produits: [],
      categories: [],
      headers: [
        { text: 'Code', value: 'code', sortable: false },
        { text: 'Description', value: 'nom' },
        { text: 'Famille', value: 'categorie.nom' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  async fetch() {
    let calebasse = await this.$axios.get('stock/produits')
    const produits = calebasse.data.produits.map((produit) => {
      const imageData = produit.image ? produit.image : []
      const mesureData = produit.mesure ? produit.mesure : ''
      return {
        id: produit.id,
        code: produit.code,
        mesure: mesureData,
        nom: produit.nom,
        image: imageData,
        contenance: produit.contenance,
        mode: produit.mode,
        type: produit.type,
        etagere: produit.etagere ? produit.etagere : '',
        description: produit.description ? produit.description : '',
        categorie: {
          id: produit.categorie_linked.id,
          nom: produit.categorie_linked.nom,
        },
      }
    })
    calebasse = await this.$axios.get('stock/categories')
    const categories = calebasse.data.categories.map((categorie) => {
      return { id: categorie.id, nom: categorie.nom }
    })
    this.produits = produits
    this.categories = categories
  },
  methods: {
    pushProduit(produit) {
      this.produits.push(produit)
    },
    produitEdited(produit) {
      const index = this.produits.findIndex(
        (element) => element.id === produit.id
      )
      this.produits.splice(index, 1, produit)
    },
    produitDeleted(produit) {
      this.produits = this.produits.filter(
        (element) => element.id !== produit.id
      )
    },
  },
}
</script>

<style></style>
