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
                :headers="headers"
                :items="produits"
                :search="search"
                :items-per-page="10"
              >
                <template #[`item.seuil`]="{ item }">
                  {{ item.seuil + ' ' }}{{ item.mesure }}
                </template>
                <template #[`item.actions`]="{ item }">
                  <edit-produit :item="item" @edited-produit="produitEdited" />
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
          <create-produit @new-produit="pushProduit" />
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
  async asyncData({ $axios }) {
    const calebasse = await $axios.get('stock/produits')
    const produits = calebasse.data.produits.map((produit) => {
      const imageData = produit.image ? produit.image : []
      const mesureData = produit.mesure ? produit.mesure : ''
      return {
        id: produit.id,
        code: produit.code,
        mesure: mesureData,
        nom: produit.nom,
        image: imageData,
        seuil: produit.seuil,
        mode: produit.mode,
        type: produit.type,
      }
    })
    return { produits }
  },
  data() {
    return {
      search: '',
      headers: [
        { text: 'Code', value: 'code', sortable: false },
        { text: 'Nom', value: 'nom' },
        { text: 'Seuil', value: 'seuil', sortable: false },
        { text: 'mode', value: 'mode', sortable: false },
        { text: 'Type', value: 'type' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
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
